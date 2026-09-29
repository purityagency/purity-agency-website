// Envoi du message de contact par Resend, avec la cle deja presente dans
// secrets/. Le message est aussi journalise localement : un e-mail qui
// n'arrive pas ne doit pas faire disparaitre une demande.
import { readFileSync, appendFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));

function key() {
  if (process.env.RESEND_API_KEY) return process.env.RESEND_API_KEY.trim();
  try { return readFileSync(resolve(HERE, '../../secrets/.resend-key'), 'utf8').trim(); }
  catch { return ''; }
}

const clean = (v, max) => String(v == null ? '' : v).replace(/[\r\n]+/g, ' ').trim().slice(0, max);

export async function sendContact(b, { fetcher = fetch, apiKey = key(), journal } = {}) {
  const name = clean(b.name, 120);
  const email = clean(b.email, 160);
  const phone = clean(b.phone, 40);
  const message = String(b.message == null ? '' : b.message).trim().slice(0, 4000);
  const slot = clean(b.slot, 40);

  if (!name || !email || !message) return { ok: false, reason: 'missing' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, reason: 'bad-email' };

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
      mkdirSync(resolve(HERE, '../../data'), { recursive: true });
      appendFileSync(resolve(HERE, '../../data/leads.log'), entry, { mode: 0o600 });
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
