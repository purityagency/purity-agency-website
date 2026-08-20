// Pipeline unique de capture de lead — partagé par le formulaire de contact et
// par le chatbot.
//
// Avant ce fichier, le chatbot capturait ses leads DANS LE NAVIGATEUR : le
// serveur renvoyait la balise [LEAD]{...}[/LEAD] telle quelle et c'était le JS
// du visiteur qui rappelait /api/contact. Deux conséquences mesurées en prod :
//
//  1. /api/contact exigeait un e-mail valide, alors que le bot propose
//     explicitement « votre e-mail (ou téléphone) ». Tout prospect laissant un
//     numéro et pas d'adresse partait en 400 — et comme fetch() ne rejette pas
//     sur un 400, le .catch() ne voyait rien. Le visiteur lisait « c'est noté,
//     on vous écrit sous 24 h » et personne n'était jamais contacté.
//  2. Un bloqueur, une erreur JS ou un onglet fermé dans la seconde suffisait à
//     perdre le lead, alors que le serveur avait la donnée en main.
//
// Désormais l'extraction et l'envoi se font côté serveur, et le navigateur
// n'est plus sur le chemin critique.
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const validator = require('../utils/validator');
const env = require('../config/env');
const ordersRepo = require('../repositories/orders.repository');
const resendService = require('./resend.service');
const purityosService = require('./purityos.service');

const MAX = { name: 200, email: 200, phone: 60, activity: 200, need: 4000 };

// Un numéro belge tient en 9-10 chiffres (0470 11 22 33, 071 12 34 56) ; on
// accepte 8 à 15 pour couvrir l'international et les indicatifs (+32...).
// Volontairement permissif : mieux vaut rappeler un numéro douteux que de
// jeter un prospect réel — le refus silencieux est précisément le bug corrigé.
function normalizePhone(raw) {
  const digits = String(raw || '').replace(/[^\d]/g, '');
  if (digits.length < 8 || digits.length > 15) return '';
  return String(raw).trim().slice(0, MAX.phone);
}

function cut(value, max) {
  return String(value || '').slice(0, max).trim();
}

// Valide le lead quelle que soit sa provenance. `requireEmail` reste vrai pour
// le formulaire de contact (le champ y est obligatoire côté UI, un envoi sans
// e-mail y signale un bot) et faux pour le chatbot, où le téléphone seul est
// une réponse légitime que le bot a lui-même sollicitée.
function validateLead(input, { requireEmail = false } = {}) {
  const name = cut(input && input.name, MAX.name);
  const emailRaw = cut(input && input.email, MAX.email);
  const email = validator.isValidEmail(emailRaw) ? emailRaw : '';
  const phone = normalizePhone(input && input.phone);
  const activity = cut(input && input.activity, MAX.activity);
  const need = cut(input && input.need, MAX.need);

  if (name.length < 2) return { ok: false, reason: 'name' };
  if (requireEmail && !email) return { ok: false, reason: 'email' };
  if (!email && !phone) return { ok: false, reason: 'no_contact' };

  return { ok: true, lead: { name, email, phone, activity, need } };
}

// Anti-doublon partagé par fichier. Le modèle peut ré-émettre la même balise à
// chaque message d'une conversation ; sans ce filtre, une seule personne
// déclencherait dix e-mails. Clé = coordonnées normalisées, donc un visiteur
// qui SE CORRIGE ("pardon, c'est .be pas .com") produit une clé différente et
// passe bien — l'ancien verrou « un lead par session » le bloquait pour de bon.
//
// Pourquoi un fichier et pas seulement une Map : app.js peut lancer plusieurs
// workers (cluster), et chacun aurait sa propre Map — le même prospect passerait
// alors autant de fois qu'il y a de workers. Le fichier leur sert de terrain
// commun et survit en prime aux redémarrages de process. La Map reste en
// première ligne, pour ne pas relire le disque à chaque message.
const RECENT_TTL_MS = 30 * 60 * 1000;
const DEDUPE_FILE = path.join(env.ROOT, '..', 'data', 'lead-dedupe.log');
const MAX_LINES = 500;
const recentLeads = new Map();

function dedupeKey(lead) {
  return `${lead.email.toLowerCase()}|${lead.phone.replace(/[^\d]/g, '')}`;
}

function readRawLines() {
  try {
    return fs.readFileSync(DEDUPE_FILE, 'utf8').split('\n').filter(l => l.trim());
  } catch (e) {
    return []; // fichier absent au premier lead : ce n'est pas une erreur
  }
}

function parseRecent(lines) {
  const now = Date.now();
  const entries = [];
  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (entry && entry.key && now - entry.at < RECENT_TTL_MS) entries.push(entry);
    } catch (e) { /* ligne corrompue : on l'ignore */ }
  }
  return entries;
}

function isDuplicate(lead) {
  const key = dedupeKey(lead);
  const now = Date.now();

  const seenAt = recentLeads.get(key);
  if (seenAt && now - seenAt < RECENT_TTL_MS) return true;

  const lines = readRawLines();
  const onDisk = parseRecent(lines);
  if (onDisk.some(entry => entry.key === key)) {
    recentLeads.set(key, now);
    return true;
  }

  recentLeads.set(key, now);
  try {
    fs.mkdirSync(path.dirname(DEDUPE_FILE), { recursive: true });
    // La compaction se décide sur le nombre de lignes RÉELLES du fichier, pas
    // sur les entrées encore valides : ce sont justement les lignes expirées qui
    // s'accumulent, et les compter via `onDisk` (qui les exclut) revenait à ne
    // jamais compacter — le fichier grossissait indéfiniment.
    if (lines.length >= MAX_LINES) {
      fs.writeFileSync(DEDUPE_FILE, onDisk.map(e => JSON.stringify(e)).join('\n') + '\n');
    }
    fs.appendFileSync(DEDUPE_FILE, JSON.stringify({ key, at: now }) + '\n');
  } catch (err) {
    // Disque indisponible : on garde la Map en mémoire comme filet. Au pire un
    // doublon d'e-mail — jamais un lead perdu, ce qui est le bon compromis.
    logger.warn('[lead] anti-doublon non persisté sur disque', { error: String(err && err.message) });
  }
  return false;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, at] of recentLeads) {
    if (now - at > RECENT_TTL_MS) recentLeads.delete(key);
  }
}, 10 * 60 * 1000).unref();

function buildHtml(lead, source) {
  return `<h2>Nouveau lead — Purity Agency</h2>
<p><strong>Nom :</strong> ${validator.escapeHtml(lead.name)}<br>
<strong>E-mail :</strong> ${validator.escapeHtml(lead.email || '—')}<br>
<strong>Téléphone :</strong> ${validator.escapeHtml(lead.phone || '—')}<br>
<strong>Activité :</strong> ${validator.escapeHtml(lead.activity || '—')}<br>
<strong>Source :</strong> ${validator.escapeHtml(source)}</p>
<p><strong>Besoin :</strong><br>${validator.escapeHtml(lead.need || '—').replace(/\n/g, '<br>')}</p>`;
}

// Journalise, notifie Purity OS puis envoie l'e-mail. L'ordre compte : le lead
// est écrit sur disque AVANT toute I/O réseau, pour qu'une panne Resend ou
// Purity OS ne puisse jamais le faire disparaître sans trace.
async function deliverLead(lead, source) {
  ordersRepo.logLead({ ...lead, source });

  purityosService.notifyEvent({
    type: 'LEAD',
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.activity,
    summary: (lead.need || '').slice(0, 200),
    payload: { activity: lead.activity, need: lead.need, source }
  });

  try {
    await resendService.sendEmail({
      to: env.NOTIFY_EMAILS,
      replyTo: lead.email || undefined,
      subject: `Nouveau lead — ${lead.name}`,
      html: buildHtml(lead, source)
    });
    logger.info('[lead] transmis', { source, hasEmail: !!lead.email, hasPhone: !!lead.phone });
    return { ok: true, mode: 'sent' };
  } catch (err) {
    logger.error('[lead] envoi e-mail échoué, lead conservé dans le journal', err);
    return { ok: true, mode: 'logged_email_failed' };
  }
}

module.exports = {
  validateLead,
  isDuplicate,
  deliverLead,
  normalizePhone
};
