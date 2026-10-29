// Envoi du message de contact par Resend, avec la cle deja presente dans
// secrets/. Le message est aussi journalise localement : un e-mail qui
// n'arrive pas ne doit pas faire disparaitre une demande.
import { readFileSync, appendFileSync, mkdirSync, statSync, renameSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const MAX_LOG_BYTES = 5 * 1024 * 1024; // 5 Mo max avant rotation automatique
const recentDedupe = new Map();

function key() {
  if (process.env.RESEND_API_KEY) return process.env.RESEND_API_KEY.trim();
  try { return readFileSync(resolve(HERE, '../../secrets/.resend-key'), 'utf8').trim(); }
  catch { return ''; }
}

const clean = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u001F\u007F]+/g, ' ').trim().slice(0, max);

export async function sendContact(b, { fetcher = fetch, apiKey = key(), journal } = {}) {
  if (!b || typeof b !== 'object') return { ok: false, reason: 'bad-request' };
  // Piege anti-bot (honeypot) : si un robot remplit un champ invisible, on
  // repond positivement sans journaliser ni envoyer d'e-mail.
  if (b.website || b.company_url || b._hp) {
    return { ok: true, saved: false, delivered: false };
  }
  const name = clean(b.name, 120);
  const email = clean(b.email, 160);
  const phone = clean(b.phone, 40);
  const message = String(b.message == null ? '' : b.message).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]+/g, '').trim().slice(0, 4000);
  const slot = clean(b.slot, 40);

  if (!name || !email || !message) return { ok: false, reason: 'missing' };
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,24}$/.test(email)) return { ok: false, reason: 'bad-email' };

  const lines = [`Nom : ${name}`, `E-mail : ${email}`];
  if (phone) lines.push(`Téléphone : ${phone}`);
  if (slot) lines.push(`Créneau souhaité : ${slot}`);
  lines.push('', message);
  const body = lines.join('\n');

  let saved = false;
  try {
    const entry = JSON.stringify({ at: new Date().toISOString(), name, email, phone, slot, message }) + '\n';
    if (journal) journal(entry);
    else {
      const now = Date.now();
      for (const [h, exp] of recentDedupe) if (now > exp) recentDedupe.delete(h);
      const dedupeKey = createHash('sha256').update(`${email.toLowerCase()}|${message}`).digest('hex');
      if (recentDedupe.has(dedupeKey)) {
        return { ok: true, saved: true, delivered: true, deduplicated: true };
      }
      recentDedupe.set(dedupeKey, now + 10 * 60_000);
      const dataDir = resolve(HERE, '../../data');
      const logFile = resolve(dataDir, 'leads.log');
      mkdirSync(dataDir, { recursive: true });
      try {
        const st = statSync(logFile);
        if (st.size >= MAX_LOG_BYTES) renameSync(logFile, resolve(dataDir, 'leads.log.1'));
      } catch {}
      appendFileSync(logFile, entry, { mode: 0o600 });
    }
    saved = true;
  } catch { /* Report success only when at least one delivery path worked. */ }

  const k = apiKey;
  if (!k) return { ok: saved, saved, delivered: false };

  try {
    const r = await fetcher('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + k, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Purity Agency <contact@purity-agency.be>',
        to: ['contact@purity-agency.be'],
        reply_to: email,
        subject: `Nouveau message — ${name}`,
        text: body
      }),
      signal: AbortSignal.timeout(10000)
    });
    return { ok: r.ok || saved, saved, delivered: r.ok };
  } catch {
    return { ok: saved, saved, delivered: false };
  }
}
