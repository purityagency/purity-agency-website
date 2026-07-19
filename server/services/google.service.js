const https = require('https');
const crypto = require('crypto');
const env = require('../config/env');
const logger = require('../utils/logger');

const BOOKING = {
  calendarId: process.env.BOOKING_CALENDAR_ID || 'contact.purityagency@gmail.com',
  timezone: process.env.BOOKING_TZ || 'Europe/Brussels',
  slotMinutes: 15,
  intervalMinutes: 60,
  minNoticeMinutes: 120,
  advanceDays: 21,
  meetingLink: process.env.BOOKING_MEETING_LINK || '',
  hours: {
    1: [['09:00', '18:00']],
    2: [['09:00', '18:00']],
    3: [['09:00', '18:00']],
    4: [['09:00', '18:00']],
    5: [['09:00', '17:00']]
  }
};

function isBookingConfigured() {
  const sa = env.googleServiceAccount;
  return Boolean(BOOKING.calendarId && sa?.client_email && sa?.private_key);
}

let _gTokenCache = { token: '', exp: 0 };

function getGoogleToken(cb) {
  const now = Date.now();
  if (_gTokenCache.token && now < _gTokenCache.exp - 60000) {
    return cb(null, _gTokenCache.token);
  }

  const sa = env.googleServiceAccount;
  if (!sa || !sa.client_email || !sa.private_key) {
    return cb(new Error('no_service_account'));
  }

  const iat = Math.floor(now / 1000);
  const enc = o => Buffer.from(JSON.stringify(o)).toString('base64url');
  const unsigned = enc({ alg: 'RS256', typ: 'JWT' }) + '.' + enc({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    iat,
    exp: iat + 3600
  });

  let signature;
  try {
    signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(sa.private_key, 'base64url');
  } catch (e) {
    return cb(e);
  }

  const post = 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + unsigned + '.' + signature;
  const r = https.request({
    method: 'POST',
    hostname: 'oauth2.googleapis.com',
    path: '/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(post)
    }
  }, resp => {
    let d = '';
    resp.on('data', x => d += x);
    resp.on('end', () => {
      try {
        const j = JSON.parse(d);
        if (j.access_token) {
          _gTokenCache = { token: j.access_token, exp: now + j.expires_in * 1000 };
          return cb(null, j.access_token);
        }
        cb(new Error('token_error: ' + d.slice(0, 200)));
      } catch (e) {
        cb(e);
      }
    });
  });

  r.on('error', cb);
  r.write(post);
  r.end();
}

function calApi(method, apiPath, token, body, cb) {
  const payload = body ? JSON.stringify(body) : null;
  const headers = { 'Authorization': 'Bearer ' + token };
  if (payload) {
    headers['Content-Type'] = 'application/json';
    headers['Content-Length'] = Buffer.byteLength(payload);
  }

  const r = https.request({
    method,
    hostname: 'www.googleapis.com',
    path: apiPath,
    headers
  }, resp => {
    let d = '';
    resp.on('data', x => d += x);
    resp.on('end', () => {
      let j = {};
      try {
        j = JSON.parse(d);
      } catch (e) { /* ignore */ }
      cb(resp.statusCode >= 400 ? new Error('cal_' + resp.statusCode + ': ' + d.slice(0, 300)) : null, j);
    });
  });

  r.on('error', cb);
  if (payload) r.write(payload);
  r.end();
}

function tzOffsetMinutes(date, tz) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const p = dtf.formatToParts(date).reduce((a, x) => (a[x.type] = x.value, a), {});
  const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour === '24' ? 0 : p.hour, p.minute, p.second);
  return (asUTC - date.getTime()) / 60000;
}

function zonedTime(y, mo, d, h, mi, tz) {
  let ts = Date.UTC(y, mo - 1, d, h, mi, 0);
  const off = tzOffsetMinutes(new Date(ts), tz);
  return new Date(ts - off * 60000);
}

function parseHM(s) {
  const [h, m] = s.split(':').map(Number);
  return { h, m };
}

function candidateSlots(dateStr) {
  const [y, mo, d] = dateStr.split('-').map(Number);
  if (!y || !mo || !d) return [];

  const noon = zonedTime(y, mo, d, 12, 0, BOOKING.timezone);
  const wd = new Date(noon).getUTCDay();
  const ranges = BOOKING.hours[wd];
  if (!ranges) return [];

  const slots = [];
  for (const [start, end] of ranges) {
    const s = parseHM(start);
    const e = parseHM(end);
    let cur = zonedTime(y, mo, d, s.h, s.m, BOOKING.timezone).getTime();
    const stop = zonedTime(y, mo, d, e.h, e.m, BOOKING.timezone).getTime();
    const step = (BOOKING.intervalMinutes || BOOKING.slotMinutes) * 60000;
    while (cur + BOOKING.slotMinutes * 60000 <= stop) {
      slots.push(new Date(cur));
      cur += step;
    }
  }
  return slots;
}

module.exports = {
  BOOKING,
  isBookingConfigured,
  getGoogleToken,
  calApi,
  candidateSlots
};
