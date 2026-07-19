const https = require('https');
const env = require('../config/env');
const logger = require('../utils/logger');

const PACK_DATA = {
  coiffure:  { name: 'Coiffure & Beauté',      pack: 'Pack Agenda Plein',       price: 1290, deposit: 387, remaining: 903,  monthly: 69 },
  artisan:   { name: 'Artisan & Bâtiment',      pack: 'Pack Zéro Appel Perdu',   price: 1490, deposit: 447, remaining: 1043, monthly: 79 },
  horeca:    { name: 'HoReCa & Restauration',   pack: 'Pack Toujours Ouvert',    price: 1490, deposit: 447, remaining: 1043, monthly: 79 },
  praticien: { name: 'Praticiens & Bien-être',  pack: 'Pack Agenda Plein',       price: 1290, deposit: 387, remaining: 903,  monthly: 69 },
  liberal:   { name: 'Prof. Libérales & Lib.',  pack: 'Pack Standard Pro',       price: 1290, deposit: 387, remaining: 903,  monthly: 69 },
  commerce:  { name: 'Commerce & Boutique',     pack: 'Pack Standard Pro',       price: 1290, deposit: 387, remaining: 903,  monthly: 69 },
  immo:      { name: 'Immobilier & Agences',    pack: 'Pack Standard Pro',       price: 1290, deposit: 387, remaining: 903,  monthly: 69 },
  autre:     { name: 'Autre métier...',         pack: 'Pack Standard Pro',       price: 1290, deposit: 387, remaining: 903,  monthly: 69 }
};

function isMollieConfigured() {
  const key = env.MOLLIE_API_KEY;
  return Boolean(key && (key.startsWith('live_') || key.startsWith('test_')));
}

function mollieRequest(method, apiPath, body) {
  return new Promise((resolve, reject) => {
    const key = env.MOLLIE_API_KEY;
    if (!key) {
      logger.warn('[Mollie] API key missing, failing request');
      return reject(new Error('mollie_not_configured'));
    }

    const payload = body ? JSON.stringify(body) : '';
    const req = https.request({
      method,
      hostname: 'api.mollie.com',
      path: `/v2${apiPath}`,
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        let parsed = {};
        try {
          parsed = JSON.parse(data || '{}');
        } catch (err) { /* ignore */ }
        if (res.statusCode >= 400) {
          return reject(new Error(parsed.detail || `mollie_http_${res.statusCode}`));
        }
        resolve(parsed);
      });
    });

    req.on('error', err => {
      logger.error('[Mollie] Connection error', err);
      reject(err);
    });

    if (payload) req.write(payload);
    req.end();
  });
}

module.exports = {
  PACK_DATA,
  isMollieConfigured,
  mollieRequest
};
