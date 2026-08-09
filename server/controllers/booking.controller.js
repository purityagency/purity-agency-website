const env = require('../config/env');
const logger = require('../utils/logger');
const validator = require('../utils/validator');
const googleService = require('../services/google.service');
const resendService = require('../services/resend.service');
const ordersRepo = require('../repositories/orders.repository');
const purityosService = require('../services/purityos.service');
const rateLimit = require('../middleware/rate-limit');

function handleAvailability(req, res, query) {
  if (rateLimit.rateLimited(req)) {
    res.writeHead(429, { 'Content-Type': 'application/json', 'Retry-After': '60' });
    return res.end(JSON.stringify({ error: 'rate_limited' }));
  }

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
  if (rateLimit.rateLimited(req)) {
    res.writeHead(429, { 'Content-Type': 'application/json', 'Retry-After': '60' });
    return res.end(JSON.stringify({ error: 'rate_limited' }));
  }

  let body = '';
  let tooLarge = false;
  req.on('data', c => { 
    if (tooLarge) return;
    body += c; 
    if (body.length > 8000) {
      tooLarge = true;
      res.writeHead(413, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'payload_too_large' }));
    }
  });
  req.on('end', () => {
    if (tooLarge) return;
    let data = {};
    try { 
      data = JSON.parse(body) || {}; 
    } catch (err) { 
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'invalid_json' }));
    }
    const start = String(data.start || '').trim();
    const name = String(data.name || '').slice(0, 200).trim();
    const email = String(data.email || '').slice(0, 200).trim();
    const phone = String(data.phone || '').slice(0, 60).trim();
    const company = String(data.company || '').slice(0, 200).trim();
    const companyWebsite = String(data.companyWebsite || '').slice(0, 300).trim();
    const honeypot = String(data.website_verification || '').trim();

    if (honeypot) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true }));
    }

    const startMs = Date.parse(start);
    if (!name || !validator.isValidEmail(email) || !phone || (!company && !companyWebsite) || !startMs) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'invalid' }));
    }
    if (startMs < Date.now() + googleService.BOOKING.minNoticeMinutes * 60000) {
      res.writeHead(409, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'too_soon' }));
    }

    const detailNeed = `Entreprise : ${company}` + (companyWebsite ? ` — Site : ${companyWebsite}` : '');

    if (!googleService.isBookingConfigured()) {
      ordersRepo.logLead({ name, email, phone, activity: company, need: '[RDV (Mode Simple)] ' + new Date(startMs).toISOString() + ' — ' + detailNeed });
      purityosService.notifyEvent({
        type: 'BOOKING',
        name,
        email,
        phone,
        company,
        summary: `RDV le ${new Date(startMs).toLocaleString('fr-FR', { timeZone: googleService.BOOKING.timezone })}`,
        payload: { start: new Date(startMs).toISOString(), company, companyWebsite }
      });

      if (env.RESEND_API_KEY) {
        const icsDate = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const startDt = new Date(startMs);
        const endDt = new Date(startMs + googleService.BOOKING.slotMinutes * 60000);
        const icsContent = [
          'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
          `DTSTART:${icsDate(startDt)}`, `DTEND:${icsDate(endDt)}`,
          `SUMMARY:Appel Purity — ${name} (${company || companyWebsite})`,
          `DESCRIPTION:Entreprise: ${company || '—'}\\nTéléphone: ${phone || '—'}\\nSite: ${companyWebsite || '—'}`,
          'END:VEVENT', 'END:VCALENDAR'
        ].join('\r\n');

        const html = `<h2>Nouveau RDV (Mode Simple) — Purity Agency</h2>
<p><strong>Heure :</strong> ${startDt.toLocaleString('fr-FR', { timeZone: googleService.BOOKING.timezone })}</p>
<p><strong>Nom :</strong> ${validator.escapeHtml(name)}<br>
<strong>E-mail :</strong> ${validator.escapeHtml(email)}<br>
<strong>Téléphone :</strong> ${validator.escapeHtml(phone || '—')}</p>
<p><strong>Entreprise :</strong> ${validator.escapeHtml(company || '—')}<br>
<strong>Site internet actuel :</strong> ${companyWebsite ? `<a href="${validator.escapeHtml(companyWebsite)}" target="_blank">${validator.escapeHtml(companyWebsite)}</a>` : '—'}</p>
<p><em>💡 Ouvrez ce mail sur votre téléphone et touchez la pièce jointe (.ics) pour l\'ajouter à votre calendrier.</em></p>`;

        resendService.sendEmail({
          to: env.NOTIFY_EMAILS,
          replyTo: email,
          subject: `📅 Nouveau RDV — ${name} (${company || companyWebsite})`,
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
          'Appel de diagnostic offert de 15 min — Purity Agency.',
          `Entreprise : ${company || '—'}`,
          companyWebsite ? 'Site internet : ' + companyWebsite : '',
          phone ? 'Téléphone : ' + phone : '',
          googleService.BOOKING.meetingLink ? 'Lien visio : ' + googleService.BOOKING.meetingLink : ''
        ].filter(Boolean);

        const event = {
          summary: `Appel Purity — ${name} (${company || companyWebsite})`,
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
            ordersRepo.logLead({ name, email, phone, activity: company, need: '[RDV] ' + new Date(startMs).toISOString() + ' — ' + detailNeed });
            if (e3) {
              logger.error('[booking] insert event error', e3);
              res.writeHead(502, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ error: 'insert' }));
            }

            purityosService.notifyEvent({
              type: 'BOOKING',
              name,
              email,
              phone,
              company,
              summary: `RDV le ${new Date(startMs).toLocaleString('fr-FR', { timeZone: googleService.BOOKING.timezone })}`,
              payload: { start: new Date(startMs).toISOString(), company, companyWebsite, htmlLink: ev.htmlLink || '' }
            });

            if (env.RESEND_API_KEY) {
              const startDt = new Date(startMs);
              const html = `<h2>Nouveau RDV — Purity Agency</h2>
<p><strong>Heure :</strong> ${startDt.toLocaleString('fr-FR', { timeZone: googleService.BOOKING.timezone })}</p>
<p><strong>Nom :</strong> ${validator.escapeHtml(name)}<br>
<strong>E-mail :</strong> ${validator.escapeHtml(email)}<br>
<strong>Téléphone :</strong> ${validator.escapeHtml(phone || '—')}</p>
<p><strong>Entreprise :</strong> ${validator.escapeHtml(company || '—')}<br>
<strong>Site internet actuel :</strong> ${companyWebsite ? `<a href="${validator.escapeHtml(companyWebsite)}" target="_blank">${validator.escapeHtml(companyWebsite)}</a>` : '—'}</p>
${ev.htmlLink ? `<p><a href="${validator.escapeHtml(ev.htmlLink)}" target="_blank">Voir dans Google Calendar</a></p>` : ''}`;

              resendService.sendEmail({
                to: env.NOTIFY_EMAILS,
                replyTo: email,
                subject: `📅 Nouveau RDV — ${name} (${company || companyWebsite})`,
                html
              }).catch(err => logger.error('[booking] real mode email error', err));
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
