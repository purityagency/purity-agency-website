const https = require('https');
const env = require('../config/env');
const logger = require('../utils/logger');

const fs = require('fs');
const path = require('path');

// Single Source of Truth : Chargement dynamique du catalogue officiel (/docs/business/CATALOG.json)
let PACK_DATA = {
  coiffure:    { name: 'Coiffure & Beauté',        pack: 'Pack Agenda Plein',       price: 1490, deposit: 447, remaining: 1043, monthly: 79 },
  artisan:     { name: 'Artisan & Bâtiment',       pack: 'Pack Chantier Assuré',    price: 1890, deposit: 567, remaining: 1323, monthly: 99 },
  horeca:      { name: 'HoReCa & Restauration',    pack: 'Pack Salle Comble',       price: 1890, deposit: 567, remaining: 1323, monthly: 99 },
  praticien:   { name: 'Praticien & Bien-être',    pack: 'Pack Cabinet Serein',     price: 1490, deposit: 447, remaining: 1043, monthly: 79 },
  immobilier:  { name: 'Immobilier',               pack: 'Pack Mandat Capté',       price: 2890, deposit: 867, remaining: 2023, monthly: 149 },
  avocat:      { name: 'Professions Juridiques',   pack: 'Pack Autorité Établie',   price: 2290, deposit: 687, remaining: 1603, monthly: 129 },
  commerce:    { name: 'Commerces & Retail',       pack: 'Pack Vitrine Active',     price: 1490, deposit: 447, remaining: 1043, monthly: 79 },
  fitness:     { name: 'Sport & Fitness',          pack: 'Pack Abonnés Fidèles',    price: 1890, deposit: 567, remaining: 1323, monthly: 99 },
  consulting:  { name: 'Consulting & B2B',         pack: 'Pack Pipeline Rempli',    price: 2290, deposit: 687, remaining: 1603, monthly: 129 },
  formation:   { name: 'Centres de Formation',     pack: 'Pack Classe Complète',    price: 2890, deposit: 867, remaining: 2023, monthly: 149 },
  garage:      { name: 'Garages & Auto',           pack: 'Pack Atelier Rempli',     price: 1490, deposit: 447, remaining: 1043, monthly: 79 },
  finance:     { name: 'Experts-Comptables',       pack: 'Pack Dossiers en Ordre',  price: 2290, deposit: 687, remaining: 1603, monthly: 129 },
  photo:       { name: 'Photographes & Créatifs',  pack: 'Pack Portfolio Vivant',   price: 1490, deposit: 447, remaining: 1043, monthly: 79 },
  veterinaire: { name: 'Santé Animale',            pack: 'Pack Clinique Connectée', price: 1890, deposit: 567, remaining: 1323, monthly: 99 },
  architecte:  { name: 'Architectes & Design',     pack: 'Pack Projet Signé',       price: 2290, deposit: 687, remaining: 1603, monthly: 129 },
  domicile:    { name: 'Services à la Personne',   pack: 'Pack Lien de Confiance',  price: 1890, deposit: 567, remaining: 1323, monthly: 99 }
};

try {
  const catalogPath = path.join(env.ROOT, '..', 'docs', 'business', 'CATALOG.json');
  if (fs.existsSync(catalogPath)) {
    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    if (catalog && catalog.packs) {
      Object.keys(catalog.packs).forEach(key => {
        const item = catalog.packs[key];
        PACK_DATA[key] = {
          name: item.name,
          pack: item.pack,
          price: item.price,
          deposit: item.deposit,
          remaining: item.price - item.deposit,
          monthly: item.monthly
        };
      });
    }
  }
} catch (err) {
  logger.warn('[Mollie] CATALOG.json load fallback used', err);
}

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
