const https = require('https');
const http = require('http');
const env = require('../config/env');
const logger = require('../utils/logger');

function portalUrl() {
  const value = (process.env.CLIENT_PORTAL_URL || '').trim();
  if (/^https?:\/\/[^/\s]+(?::\d+)?$/i.test(value)) return value;
  return process.env.NODE_ENV === 'production' ? 'https://os.purity-agency.be' : 'http://localhost:3001';
}

// Notifie Purity OS (boîte de réception admin) qu'un lead/RDV/commande vient
// d'arriver côté site public. Best-effort : ne doit jamais faire échouer le
// flux principal (email/paiement/booking) si Purity OS est indisponible.
function notifyEvent({ type, name, email, phone, company, summary, payload }) {
  const secret = env.INTERNAL_API_SECRET;
  const base = portalUrl();
  if (!secret || !base) return Promise.resolve();

  return new Promise(resolve => {
    let endpoint;
    try {
      endpoint = new URL('/api/internal/event', base);
    } catch (e) {
      return resolve();
    }
    const body = JSON.stringify({ type, name, email, phone, company, summary, payload });
    const lib = endpoint.protocol === 'https:' ? https : http;

    const req = lib.request({
      method: 'POST',
      hostname: endpoint.hostname,
      port: endpoint.port || (endpoint.protocol === 'https:' ? 443 : 80),
      path: endpoint.pathname,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Authorization': `Bearer ${secret}`
      }
    }, res => {
      res.on('data', () => {});
      res.on('end', () => resolve());
    });

    req.on('error', err => {
      logger.error('[purityos] notifyEvent network error', err);
      resolve();
    });
    req.write(body);
    req.end();
  });
}

module.exports = { notifyEvent };
