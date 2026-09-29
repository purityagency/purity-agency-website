// Disponibilites et reservation via Google Calendar, avec le compte de
// service deja utilise par le site v1 (secrets/.google-service-account.json).
// Le calendrier reste la source de verite : aucun creneau n'est stocke ici.
import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCOPE = 'https://www.googleapis.com/auth/calendar';

export const BOOKING = {
  calendarId: process.env.BOOKING_CALENDAR_ID || 'contact.purityagency@gmail.com',
  timezone: 'Europe/Brussels',
  slotMinutes: 15,
  minNoticeHours: 3,
  advanceDays: 21,
  // Plages d'ouverture par jour de semaine (1 = lundi).
  hours: { 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 18], 5: [9, 17] }
};

function serviceAccount() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try { return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON); } catch { return null; }
  }
  try {
    return JSON.parse(readFileSync(resolve(HERE, '../../secrets/.google-service-account.json'), 'utf8'));
  } catch {
    return null;
  }
}

export function isConfigured() {
  const sa = serviceAccount();
  return Boolean(sa?.client_email && sa?.private_key);
}

const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o))
  .toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

let tokenCache = { value: null, expires: 0 };

async function getToken() {
  if (tokenCache.value && Date.now() < tokenCache.expires - 60000) return tokenCache.value;
  const sa = serviceAccount();
  if (!sa) return null;

  const now = Math.floor(Date.now() / 1000);
  const claim = { iss: sa.client_email, scope: SCOPE,
    aud: 'https://oauth2.googleapis.com/token', exp: now + 3600, iat: now };
  const unsigned = b64({ alg: 'RS256', typ: 'JWT' }) + '.' + b64(claim);

  // Le fichier stocke les sauts de ligne de la cle sous forme litterale
  // (barre oblique inverse suivie de n) ; OpenSSL refuse la cle tant qu'ils
  // ne sont pas convertis en vrais retours a la ligne.
  const pem = String(sa.private_key).split(String.raw`\n`).join('\n');

  const sign = createSign('RSA-SHA256');
  sign.update(unsigned);
  let signature;
  try { signature = sign.sign(pem, 'base64'); }
  catch { return null; } // Invalid local credentials: fail closed, no invented availability.
  const jwt = unsigned + '.' + signature.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
    signal: AbortSignal.timeout(10000)
  });
  if (!r.ok) return null;
  const d = await r.json();
  tokenCache = { value: d.access_token, expires: Date.now() + (d.expires_in || 3600) * 1000 };
  return tokenCache.value;
}

// Decalage horaire de Bruxelles pour une date donnee, en minutes. Evite de
// coder l'heure d'ete en dur : elle change deux fois par an.
function offsetMinutes(date) {
  const s = new Intl.DateTimeFormat('en-US', {
    timeZone: BOOKING.timezone, timeZoneName: 'longOffset'
  }).format(date);
  const m = s.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!m) return 60;
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]));
}

// Construit l'instant UTC correspondant a une heure locale belge.
function localToUtc(dayStr, hour, minute) {
  const guess = new Date(`${dayStr}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`);
  return new Date(guess.getTime() - offsetMinutes(guess) * 60000);
}

export async function availability(dayStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayStr)) return { ok: false, reason: 'bad-date' };

  const dow = new Date(dayStr + 'T12:00:00Z').getUTCDay();
  const range = BOOKING.hours[dow];
  if (!range) return { ok: true, date: dayStr, slots: [] };   // week-end

  const token = await getToken();
  if (!token) return { ok: false, reason: 'unconfigured' };

  const dayStart = localToUtc(dayStr, range[0], 0);
  const dayEnd = localToUtc(dayStr, range[1], 0);

  let busy = [];
  try {
    const r = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timeMin: dayStart.toISOString(), timeMax: dayEnd.toISOString(),
        timeZone: BOOKING.timezone, items: [{ id: BOOKING.calendarId }]
      }),
      signal: AbortSignal.timeout(10000)
    });
    if (!r.ok) return { ok: false, reason: 'calendar-error' };
    const d = await r.json();
    const calendar = d.calendars?.[BOOKING.calendarId];
    if (!calendar || calendar.errors?.length || !Array.isArray(calendar.busy)) return { ok: false, reason: 'calendar-error' };
    busy = calendar.busy;
  } catch {
    return { ok: false, reason: 'calendar-error' };
  }

  const notBefore = Date.now() + BOOKING.minNoticeHours * 3600000;
  const step = BOOKING.slotMinutes * 60000;
  const slots = [];

  for (let t = dayStart.getTime(); t + step <= dayEnd.getTime(); t += step) {
    if (t < notBefore) continue;
    const s = t, e = t + step;
    const clash = busy.some((b) => {
      const bs = new Date(b.start).getTime(), be = new Date(b.end).getTime();
      return s < be && e > bs;
    });
    if (clash) continue;
    slots.push({
      start: new Date(s).toISOString(),
      label: new Intl.DateTimeFormat('fr-BE', {
        timeZone: BOOKING.timezone, hour: '2-digit', minute: '2-digit'
      }).format(new Date(s))
    });
  }

  return { ok: true, date: dayStr, slots };
}

export async function book({ start, name, email, phone, message }) {
  const token = await getToken();
  if (!token) return { ok: false, reason: 'unconfigured' };

  const s = new Date(start);
  if (isNaN(s) || s.getTime() < Date.now()) return { ok: false, reason: 'bad-slot' };
  const e = new Date(s.getTime() + BOOKING.slotMinutes * 60000);

  // Verifie que le creneau est toujours libre : deux visiteurs peuvent viser
  // le meme horaire pendant qu'ils remplissent le formulaire.
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: BOOKING.timezone }).format(s);
  const av = await availability(day);
  if (!av.ok || !av.slots.some((x) => x.start === s.toISOString())) {
    return { ok: false, reason: 'taken' };
  }

  const body = {
    summary: `Appel Purity Agency - ${name}`,
    description: [`Nom : ${name}`, `E-mail : ${email}`,
      phone ? `Téléphone : ${phone}` : null, '', message || '']
      .filter((l) => l !== null).join('\n'),
    start: { dateTime: s.toISOString(), timeZone: BOOKING.timezone },
    end: { dateTime: e.toISOString(), timeZone: BOOKING.timezone }
  };

  try {
    const r = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(BOOKING.calendarId)}/events`,
      { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify(body), signal: AbortSignal.timeout(10000) });
    if (!r.ok) return { ok: false, reason: 'calendar-error' };
    return { ok: true, start: s.toISOString() };
  } catch {
    return { ok: false, reason: 'calendar-error' };
  }
}
