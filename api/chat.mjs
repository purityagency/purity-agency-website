import { readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { offers, instructions } from './octomask-knowledge.mjs';

const sessions = new Map();
const limits = new Map();
const TTL = 30 * 60_000;
let active = 0;
let day = '';
let daily = 0;
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions) if (now - session.at >= TTL && !session.busy) sessions.delete(id);
  for (const [ip, limit] of limits) if (now >= limit.until) limits.delete(ip);
}, 60_000).unref();
function key() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  try { return readFileSync(new URL('../../secrets/.gemini-key', import.meta.url), 'utf8').trim(); }
  catch { return ''; }
}

export function sessionFor(cookie = '') {
  const now = Date.now();
  for (const [id, s] of sessions) if (now - s.at > TTL) sessions.delete(id);
  for (const [ip, s] of limits) if (now > s.until) limits.delete(ip);
  let id = cookie.match(/(?:^|;\s*)octomask=([a-f0-9]{48})(?:;|$)/)?.[1];
  if (!id || !sessions.has(id)) {
    if (sessions.size >= 1000) sessions.delete(sessions.keys().next().value);
    id = randomBytes(24).toString('hex');
    sessions.set(id, { at: now, messages: [], busy: false });
  }
  const session = sessions.get(id);
  session.at = now;
  return { id, session };
}

export function clearSession(id) { sessions.delete(id); }
export function allowed(ip) {
  const now = Date.now();
  if (limits.size >= 5000 && !limits.has(ip)) return false;
  let entry = limits.get(ip);
  if (!entry || now > entry.until) entry = { count: 0, until: now + 10 * 60_000 };
  limits.set(ip, entry);
  return ++entry.count <= 25;
}

const schema = {
  type: 'OBJECT', properties: {
    reply: { type: 'STRING' },
    offerIds: { type: 'ARRAY', items: { type: 'STRING', enum: offers.map(o => o.id) } },
    suggestions: { type: 'ARRAY', items: { type: 'STRING' } },
    action: { type: 'STRING', enum: ['none', 'contact', 'booking'] }
  }, required: ['reply', 'offerIds', 'suggestions', 'action']
};

export function validateReply(value) {
  if (!value || typeof value.reply !== 'string' || !value.reply.trim() || value.reply.length > 1800) throw new Error('invalid-reply');
  // Prices belong to authoritative cards, never free-form model output.
  if (/€|\beuros?\b|\bEUR\b|https?:\/\/|\[[^\]]*\]\(/i.test(value.reply)) throw new Error('unsafe-reply');
  if (/(?:j[’']ai|nous avons|c[’']est|votre (?:message|demande|rendez-vous).{0,30}(?:est|a été)).{0,35}(?:envoy|transmis|réserv|confirm|bloqu)/i.test(value.reply)) throw new Error('unverified-action');
  if (!Array.isArray(value.offerIds) || value.offerIds.length > 2 || value.offerIds.some(id => !offers.some(o => o.id === id))) throw new Error('invalid-offers');
  if (!Array.isArray(value.suggestions) || value.suggestions.length > 3 || value.suggestions.some(s => typeof s !== 'string' || s.length > 55)) throw new Error('invalid-suggestions');
  if (!['none', 'contact', 'booking'].includes(value.action)) throw new Error('invalid-action');
  return { reply: value.reply.trim(), offers: [...new Set(value.offerIds)].map(id => offers.find(o => o.id === id)), suggestions: value.suggestions, action: value.action };
}

export async function chat(session, message, { fetcher = fetch, apiKey = key() } = {}) {
  if (typeof message !== 'string' || !message.trim() || message.length > 1800) return { status: 400, error: 'Écrivez un message de 1 à 1 800 caractères.' };
  if (session.busy) return { status: 409, error: 'Une réponse est déjà en cours.' };
  if (!apiKey) return { status: 503, error: 'La conversation IA est indisponible. Vous pouvez transmettre votre projet directement à Amir.' };
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) { day = today; daily = 0; }
  if (active >= 4 || daily >= (Number(process.env.CHAT_DAILY_LIMIT) || 500)) return { status: 503, error: 'OctoMask est momentanément occupé. Réessayez plus tard ou contactez Amir.' };
  session.busy = true;
  active++;
  daily++;
  try {
    const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
    const contents = [...session.messages.slice(-20), { role: 'user', parts: [{ text: message.trim() }] }];
    let answer;
    let raw;
    for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetcher(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: instructions + (attempt ? '\nVALIDATION : la réponse précédente était invalide. Ne cite aucun montant, aucun mot euro/EUR, aucun symbole monétaire ni URL dans reply. Les prix apparaissent SEULEMENT sur les cartes sélectionnées par offerIds. Ne confirme aucune action. Respecte strictement les longueurs : suggestions maximum 55 caractères, 3 suggestions, 2 offres.' : '') }] }, contents,
        generationConfig: { temperature: 0.35, maxOutputTokens: 1800, responseMimeType: 'application/json', responseSchema: schema,
          // Gemini 2.5 coupe le raisonnement via thinkingBudget ; la famille 3.x (nouvelle API
          // "thinking level") via thinkingLevel. Sans ca, un modele 3.x "pense" avant de repondre :
          // plus lent et plus cher pour un simple JSON de chat, sans gain de qualite mesure.
          ...(/^gemini-2\.5/.test(model) ? { thinkingConfig: { thinkingBudget: 0 } }
            : /^gemini-3/.test(model) ? { thinkingConfig: { thinkingLevel: 'minimal' } } : {}) } }),
      signal: AbortSignal.timeout(10_000)
    });
    if (!response.ok) throw new Error('provider-unavailable');
    const result = await response.json();
    const candidate = result.candidates?.[0];
    if (candidate?.finishReason !== 'STOP') throw new Error('incomplete');
    raw = candidate.content?.parts?.filter(p => !p.thought).map(p => p.text || '').join('');
    try { answer = validateReply(JSON.parse(raw)); break; }
    catch (error) { if (attempt) throw error; }
    }
    session.messages = [...contents, { role: 'model', parts: [{ text: raw }] }].slice(-20);
    session.at = Date.now();
    return { status: 200, ...answer };
  } catch {
    return { status: 503, error: 'Je n’ai pas pu préparer une réponse fiable. Réessayez, ou transmettez votre question à Amir avec le bouton ci-dessous.' };
  } finally { session.busy = false; active--; }
}
