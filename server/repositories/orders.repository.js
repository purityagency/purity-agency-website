const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const env = require('../config/env');
const logger = require('../utils/logger');

const LEADS_DIR = path.join(env.ROOT, '..', 'data');

// Les commandes vivaient auparavant en fichiers JSON locaux (data/orders/*.json).
// Ce service Render tourne sans disque persistant (plan free, vérifié le
// 2026-08-05 via l'API Render : aucun disque attaché) — un redéploiement ou un
// restart efface tout fichier local. Une commande perdue entre le paiement et
// le webhook fait échouer silencieusement tout le provisioning (le client paie,
// ne reçoit jamais son accès, et rien ne le signale). Les commandes sont donc
// maintenant persistées dans la base Postgres de purity-os, via cette API
// interne — le seul stockage durable partagé entre les deux services.

function portalUrl() {
  const value = (process.env.CLIENT_PORTAL_URL || '').trim();
  if (/^https?:\/\/[^/\s]+(?::\d+)?$/i.test(value)) return value;
  return process.env.NODE_ENV === 'production' ? 'https://app.purity-agency.be' : 'http://localhost:3001';
}

function ordersEndpoint() {
  return new URL('/api/internal/orders', portalUrl());
}

async function callOrdersApi(method, { body, query } = {}) {
  const secret = env.INTERNAL_API_SECRET;
  if (!secret) throw new Error('internal_secret_missing');

  const endpoint = ordersEndpoint();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value) endpoint.searchParams.set(key, value);
    }
  }

  const headers = { 'Authorization': `Bearer ${secret}` };
  let payload;

  if (method === 'POST') {
    payload = JSON.stringify(body);
    const timestamp = new Date().toISOString();
    const signature = crypto.createHmac('sha256', secret).update(timestamp + '.' + payload).digest('hex');
    headers['Content-Type'] = 'application/json';
    headers['X-Purity-Timestamp'] = timestamp;
    headers['X-Purity-Signature'] = signature;
  }

  const res = await fetch(endpoint, { method, headers, body: payload });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`orders_api_${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

async function readOrder(orderId) {
  if (!/^ord_[0-9]+_[a-z0-9]{6}$/.test(orderId)) return null;
  try {
    const result = await callOrdersApi('GET', { query: { id: orderId } });
    return result ? result.order : null;
  } catch (err) {
    logger.error('[orders] readOrder failed', err);
    return null;
  }
}

async function writeOrder(order) {
  await callOrdersApi('POST', { body: { order } });
}

async function findOrderBySubscription(subscriptionId) {
  if (!subscriptionId) return null;
  try {
    const result = await callOrdersApi('GET', { query: { mollieSubscriptionId: subscriptionId } });
    return result ? result.order : null;
  } catch (err) {
    logger.error('[orders] findOrderBySubscription failed', err);
    return null;
  }
}

async function findOrderByMolliePayment(paymentId) {
  if (!paymentId) return null;
  try {
    const result = await callOrdersApi('GET', { query: { molliePaymentId: paymentId } });
    return result ? result.order : null;
  } catch (err) {
    logger.error('[orders] findOrderByMolliePayment failed', err);
    return null;
  }
}

// Reste un fichier local (append-only, best-effort) : c'est un log marketing
// secondaire, pas la source de vérité financière — sa perte occasionnelle
// n'interrompt aucun paiement ni provisioning, contrairement aux commandes.
function logLead(lead) {
  const line = JSON.stringify({ at: new Date().toISOString(), ...lead }) + '\n';
  try {
    fs.mkdirSync(LEADS_DIR, { recursive: true });
    fs.appendFileSync(path.join(LEADS_DIR, 'leads.log'), line);
  } catch (err) { /* ignore */ }
}

module.exports = {
  readOrder,
  writeOrder,
  findOrderBySubscription,
  findOrderByMolliePayment,
  logLead
};
