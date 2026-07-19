const https = require('https');
const env = require('../config/env');
const logger = require('../utils/logger');

function sendEmail({ to, subject, html, replyTo, attachments }) {
  return new Promise((resolve, reject) => {
    const key = env.RESEND_API_KEY;
    if (!key) {
      logger.warn('[Resend] API key missing, skipping email send');
      return resolve({ ok: true, mode: 'skipped' });
    }

    const payload = JSON.stringify({
      from: env.CONTACT_FROM,
      to: Array.isArray(to) ? to : [to],
      reply_to: replyTo,
      subject,
      html,
      ...(attachments ? { attachments } : {})
    });

    const req = https.request({
      method: 'POST',
      hostname: 'api.resend.com',
      path: '/emails',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Authorization': `Bearer ${key}`
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          logger.error(`[Resend] Failed with status ${res.statusCode}`, data);
          return reject(new Error(`Resend HTTP ${res.statusCode}`));
        }
        resolve({ ok: true, data: JSON.parse(data || '{}') });
      });
    });

    req.on('error', err => {
      logger.error('[Resend] Connection error', err);
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

module.exports = {
  sendEmail
};
