const https = require('https');
const env = require('../config/env');
const logger = require('../utils/logger');

// Clés strictement alignées sur les data-open-ob="..." de index.html (12 briques
// Packs Métier). Ne jamais renommer une clé ici sans mettre à jour le HTML —
// un mismatch renvoie 'invalid_sector' et casse silencieusement le bouton.
const PACK_DATA = {
  coiffure:   { name: 'Coiffure & Beauté',      pack: 'Pack Agenda Plein',       price: 1290, deposit: 387, remaining: 903,  monthly: 69 },
  artisan:    { name: 'Artisan & Bâtiment',     pack: 'Pack Zéro Appel Perdu',   price: 1490, deposit: 447, remaining: 1043, monthly: 79 },
  horeca:     { name: 'HoReCa & Restauration',  pack: 'Pack Toujours Ouvert',    price: 1490, deposit: 447, remaining: 1043, monthly: 79 },
  praticien:  { name: 'Praticien & Bien-être',  pack: 'Pack Cabinet Serein',     price: 1290, deposit: 387, remaining: 903,  monthly: 69 },
  immobilier: { name: 'Immobilier',             pack: 'Pack Agence Digitale',    price: 1490, deposit: 447, remaining: 1043, monthly: 79 },
  avocat:     { name: 'Avocats & Juridique',    pack: 'Pack Cabinet Moderne',    price: 1490, deposit: 447, remaining: 1043, monthly: 79 },
  commerce:   { name: 'Commerces & Retail',     pack: 'Pack Click & Collect',    price: 1990, deposit: 597, remaining: 1393, monthly: 99 },
  fitness:    { name: 'Salles de Sport',        pack: 'Pack Membres Pro',        price: 1490, deposit: 447, remaining: 1043, monthly: 79 },
  consulting: { name: 'Consultants & B2B',      pack: 'Pack Expert Autorité',    price: 1290, deposit: 387, remaining: 903,  monthly: 69 },
  formation:  { name: 'Formateurs & Coachs',    pack: 'Pack Académie',           price: 1990, deposit: 597, remaining: 1393, monthly: 99 },
  garage:     { name: 'Garages & Concessions',  pack: 'Pack Atelier Connecté',   price: 1490, deposit: 447, remaining: 1043, monthly: 79 },
  finance:    { name: 'Finance & Assurance',    pack: 'Pack Confiance Pro',      price: 1490, deposit: 447, remaining: 1043, monthly: 79 },
  photo:       { name: 'Photographes & Vidéastes', pack: 'Pack Complet', price: 1390, deposit: 417, remaining: 973,  monthly: 59 },
  veterinaire: { name: 'Santé Animale',            pack: 'Pack Complet', price: 1490, deposit: 447, remaining: 1043, monthly: 79 },
  architecte:  { name: 'Architectes & Déco',       pack: 'Pack Complet', price: 1890, deposit: 567, remaining: 1323, monthly: 89 },
  domicile:    { name: 'Aide à la Personne',       pack: 'Pack Complet', price: 1490, deposit: 447, remaining: 1043, monthly: 79 }
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
