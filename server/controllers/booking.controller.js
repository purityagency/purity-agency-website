const env = require('../config/env');
const logger = require('../utils/logger');
const validator = require('../utils/validator');
const googleService = require('../services/google.service');
const resendService = require('../services/resend.service');
const ordersRepo = require('../repositories/orders.repository');

function handleAvailability(req, res, query) {
  const dateStr = (query.get('date') || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'bad_date' }));
  }

  const now = Date.now();
  let slots = googleService.candidateSlots(dateStr).filter(s =>
    s.getTime() >= now + googleService.BOOKING.minNoticeMinutes * 60000 &&
    s.getTime() <= now + googleService.BOOKING.advanceDays * 86400000
  );

  // Pseudo-random seed for realistic slot coverage (60% kept)
  const seed = dateStr.replace(/-/g, '');
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash) + seed.charCodeAt(i);
  const rnd = () => { const x = Math.sin(hash++) * 10000; return x - Math.floor(x); };
  slots = slots.filter(() => rnd() > 0.4);

  if (!slots.length) {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    return res.end(JSON.stringify({ slots: [] }));
  }

  if (!googleService.isBookingConfigured()) {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    return res.end(JSON.stringify({ slots: slots.map(s => s.toISOString()) }));
  }

  googleService.getGoogleToken((err, token) => {
    if (err) {
      logger.error('[booking] token error', err);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'auth' }));
    }
    const timeMin = new Date(slots[0].getTime()).toISOString();
    const timeMax = new Date(slots[slots.length - 1].getTime() + googleService.BOOKING.slotMinutes * 60000).toISOString();
    
    googleService.calApi('POST', '/calendar/v3/freeBusy', token, {
      timeMin,
      timeMax,
      items: [{ id: googleService.BOOKING.calendarId }]
    }, (e2, data) => {
      if (e2) {
        logger.error('[booking] freebusy error', e2);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'freebusy' }));
      }
      const busy = (data.calendars?.[googleService.BOOKING.calendarId]?.busy || []).map(b => [Date.parse(b.start), Date.parse(b.end)]);
      const free = slots.filter(s => {
        const a = s.getTime();
        const b = a + googleService.BOOKING.slotMinutes * 60000;
        return !busy.some(([bs, be]) => a < be && b > bs);
      }).map(s => s.toISOString());

      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ slots: free }));
    });
  });
}

function handleBook(req, res) {
  let body = '';
  req.on('data', c => { body += c; if (body.length > 8000) req.destroy(); });
  req.on('end', () => {
    let data = {};
    try { data = JSON.parse(body) || {}; } catch (err) { /* ignore */ }
    const start = String(data.start || '').trim();
    const name = String(data.name || '').slice(0, 200).trim();
    const email = String(data.email || '').slice(0, 200).trim();
    const phone = String(data.phone || '').slice(0, 60).trim();
    const need = String(data.need || '').slice(0, 2000).trim();
    const honeypot = String(data.website_verification || '').trim();

    if (honeypot) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true }));
    }

    const startMs = Date.parse(start);
    if (!name || !validator.isValidEmail(email) || !startMs) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'invalid' }));
    }
    if (startMs < Date.now() + googleService.BOOKING.minNoticeMinutes * 60000) {
      res.writeHead(409, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'too_soon' }));
    }

    if (!googleService.isBookingConfigured()) {
      ordersRepo.logLead({ name, email, phone, activity: '', need: '[RDV (Mode Simple)] ' + new Date(startMs).toISOString() + (need ? ' — ' + need : '') });

      if (env.RESEND_API_KEY) {
        const icsDate = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const startDt = new Date(startMs);
        const endDt = new Date(startMs + googleService.BOOKING.slotMinutes * 60000);
        const icsContent = [
          'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
          `DTSTART:${icsDate(startDt)}`, `DTEND:${icsDate(endDt)}`,
          `SUMMARY:Appel Purity — ${name}`,
          `DESCRIPTION:${phone ? 'Téléphone: ' + phone + '\\n' : ''}${need ? 'Besoin: ' + need : ''}`,
          'END:VEVENT', 'END:VCALENDAR'
        ].join('\r\n');

        const html = `<h2>Nouveau RDV (Mode Simple) — Purity Agency</h2>
<p><strong>Heure :</strong> ${startDt.toLocaleString('fr-FR', { timeZone: googleService.BOOKING.timezone })}</p>
<p><strong>Nom :</strong> ${validator.escapeHtml(name)}<br>
<strong>E-mail :</strong> ${validator.escapeHtml(email)}<br>
<strong>Téléphone :</strong> ${validator.escapeHtml(phone || '—')}</p>
<p><strong>Besoin :</strong><br>${validator.escapeHtml(need).replace(/\\n/g, '<br>')}</p>
<p><em>💡 Ouvrez ce mail sur votre téléphone et touchez la pièce jointe (.ics) pour l\'ajouter à votre calendrier.</em></p>`;

        resendService.sendEmail({
          to: env.CONTACT_TO,
          replyTo: email,
          subject: `📅 Nouveau RDV — ${name}`,
          html,
          attachments: [{ filename: 'rendez-vous.ics', content: Buffer.from(icsContent).toString('base64') }]
        }).catch(err => logger.error('[booking] simple mode email error', err));
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true, start: new Date(startMs).toISOString(), htmlLink: '' }));
    }

    googleService.getGoogleToken((err, token) => {
      if (err) {
        logger.error('[booking] token error', err);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'auth' }));
      }
      const endMs = startMs + googleService.BOOKING.slotMinutes * 60000;
      
      googleService.calApi('POST', '/calendar/v3/freeBusy', token, {
        timeMin: new Date(startMs).toISOString(),
        timeMax: new Date(endMs).toISOString(),
        items: [{ id: googleService.BOOKING.calendarId }]
      }, (e2, fb) => {
        if (e2) {
          logger.error('[booking] freebusy check error', e2);
          res.writeHead(502, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'freebusy' }));
        }
        const busy = fb.calendars?.[googleService.BOOKING.calendarId]?.busy || [];
        if (busy.length) {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'taken' }));
        }

        const descLines = [
          'Appel stratégique de 15 min — Purity Agency.',
          phone ? 'Téléphone : ' + phone : '',
          need ? 'Besoin : ' + need : '',
          googleService.BOOKING.meetingLink ? 'Lien visio : ' + googleService.BOOKING.meetingLink : ''
        ].filter(Boolean);

        const event = {
          summary: 'Appel Purity — ' + name,
          description: descLines.join('\n'),
          start: { dateTime: new Date(startMs).toISOString(), timeZone: googleService.BOOKING.timezone },
          end: { dateTime: new Date(endMs).toISOString(), timeZone: googleService.BOOKING.timezone },
          attendees: [{ email }],
          reminders: { useDefault: true }
        };
        if (googleService.BOOKING.meetingLink) event.location = googleService.BOOKING.meetingLink;

        googleService.calApi('POST',
          `/calendar/v3/calendars/${encodeURIComponent(googleService.BOOKING.calendarId)}/events?sendUpdates=all`,
          token, event, (e3, ev) => {
            ordersRepo.logLead({ name, email, phone, activity: '', need: '[RDV] ' + new Date(startMs).toISOString() + (need ? ' — ' + need : '') });
            if (e3) {
              logger.error('[booking] insert event error', e3);
              res.writeHead(502, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ error: 'insert' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true, start: new Date(startMs).toISOString(), htmlLink: ev.htmlLink || '' }));
          });
      });
    });
  });
}

module.exports = {
  handleAvailability,
  handleBook
};
