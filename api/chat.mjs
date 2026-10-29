import { readFileSync } from 'node:fs';
import { randomBytes, createHmac, timingSafeEqual } from 'node:crypto';
import { offers, instructions, matchFastRoute, normalizeKey } from './octomask-knowledge.mjs';

const SESSION_SECRET = randomBytes(32);

function signSessionToken(rawHex32) {
  const mac = createHmac('sha256', SESSION_SECRET).update(rawHex32).digest('hex').slice(0, 16);
  return rawHex32 + mac;
}

function verifySessionToken(token48) {
  if (typeof token48 !== 'string' || !/^[a-f0-9]{48}$/.test(token48)) return false;
  const rawHex32 = token48.slice(0, 32);
  const providedMac = Buffer.from(token48.slice(32), 'utf8');
  const expectedMac = Buffer.from(
    createHmac('sha256', SESSION_SECRET).update(rawHex32).digest('hex').slice(0, 16),
    'utf8'
  );
  return providedMac.length === expectedMac.length && timingSafeEqual(providedMac, expectedMac);
}

const sessions = new Map();
const limits = new Map();
const responseCache = new Map();
const CACHE_TTL = 60 * 60_000;
const TTL = 30 * 60_000;
let active = 0;
let day = '';
let daily = 0;
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions) if (now - session.at >= TTL && !session.busy) sessions.delete(id);
  for (const [ip, limit] of limits) if (now >= limit.until) limits.delete(ip);
  for (const [k, entry] of responseCache) if (now - entry.at >= CACHE_TTL) responseCache.delete(k);
}, 60_000).unref();
function key() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  for (const file of ['../../secrets/.gemini-key-free', '../../secrets/.gemini-key']) {
    try {
      const k = readFileSync(new URL(file, import.meta.url), 'utf8').trim();
      if (k) return k;
    } catch {}
  }
  return '';
}

export function sessionFor(cookie = '') {
  const now = Date.now();
  for (const [id, s] of sessions) if (now - s.at > TTL) sessions.delete(id);
  for (const [ip, s] of limits) if (now > s.until) limits.delete(ip);
  let id = cookie.match(/(?:^|;\s*)octomask=([a-f0-9]{48})(?:;|$)/)?.[1];
  if (!id || !verifySessionToken(id) || !sessions.has(id)) {
    if (sessions.size >= 1000) sessions.delete(sessions.keys().next().value);
    id = signSessionToken(randomBytes(16).toString('hex'));
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

// Soft sanitization repairs formatting slip-ups (long suggestions, extra offers) without burning a 2nd LLM call.
export function sanitizeCandidate(value) {
  if (!value || typeof value !== 'object') return value;
  const validOfferIds = Array.isArray(value.offerIds)
    ? [...new Set(value.offerIds.filter(id => offers.some(o => o.id === id)))].slice(0, 2)
    : [];
  const validSuggestions = Array.isArray(value.suggestions)
    ? value.suggestions
        .filter(s => typeof s === 'string' && s.trim())
        .map(s => (s.trim().length > 55 ? s.trim().slice(0, 54).trimEnd() + '…' : s.trim()))
        .slice(0, 3)
    : [];
  const validAction = ['none', 'contact', 'booking'].includes(value.action) ? value.action : 'none';
  return { ...value, offerIds: validOfferIds, suggestions: validSuggestions, action: validAction };
}

export function validateReply(value) {
  if (!value || typeof value.reply !== 'string' || !value.reply.trim() || value.reply.length > 1800) throw new Error('invalid-reply');
  // Prices belong to authoritative cards, never free-form model output. Also block HTML tags and system-prompt leak markers.
  if (/€|\beuros?\b|\bEUR\b|https?:\/\/|\[[^\]]*\]\(|<[a-z!/][\s\S]*?>|SORTIE JSON|CATALOGUE PUBLIC|MÉTHODE \(40/i.test(value.reply)) throw new Error('unsafe-reply');
  if (/(?:j[’']ai|nous avons|c[’']est|votre (?:message|demande|rendez-vous).{0,30}(?:est|a été)).{0,35}(?:envoy|transmis|réserv|confirm|bloqu)/i.test(value.reply)) throw new Error('unverified-action');
  if (!Array.isArray(value.offerIds) || value.offerIds.length > 2 || value.offerIds.some(id => !offers.some(o => o.id === id))) throw new Error('invalid-offers');
  if (!Array.isArray(value.suggestions) || value.suggestions.length > 3 || value.suggestions.some(s => typeof s !== 'string' || s.length > 55 || /https?:\/\/|<[a-z!/]/i.test(s))) throw new Error('invalid-suggestions');
  if (!['none', 'contact', 'booking'].includes(value.action)) throw new Error('invalid-action');
  return { reply: value.reply.trim(), offers: [...new Set(value.offerIds)].map(id => offers.find(o => o.id === id)), suggestions: value.suggestions, action: value.action };
}

// Compact model turns before sending to Gemini: only send the assistant's text reply instead of the full JSON envelope.
function compactForModel(messages) {
  return messages.slice(-6).map(m => {
    if (m.role !== 'model') return m;
    const rawText = m.parts?.[0]?.text || '';
    try {
      const parsed = JSON.parse(rawText);
      if (parsed && typeof parsed.reply === 'string') {
        const tag = Array.isArray(parsed.offerIds) && parsed.offerIds.length ? ` [Offres: ${parsed.offerIds.join(',')}]` : '';
        return { role: 'model', parts: [{ text: parsed.reply + tag }] };
      }
    } catch {}
    return m;
  });
}

export async function chat(session, message, { fetcher = fetch, apiKey = key(), page = '' } = {}) {
  if (typeof message !== 'string') return { status: 400, error: 'Écrivez un message de 1 à 1 800 caractères.' };
  const cleanMessage = message.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]+/g, '').trim();
  if (!cleanMessage || cleanMessage.length > 1800) return { status: 400, error: 'Écrivez un message de 1 à 1 800 caractères.' };
  if (session.busy) return { status: 409, error: 'Une réponse est déjà en cours.' };

  // 1. Zero-Token Fast Router (chips & clear commercial intents) — only when using default live fetcher
  if (fetcher === fetch) {
    const fast = matchFastRoute(cleanMessage, session.messages?.length || 0);
    if (fast) {
      const answer = validateReply(fast);
      session.messages = [...(session.messages || []).slice(-18), { role: 'user', parts: [{ text: cleanMessage }] }, { role: 'model', parts: [{ text: JSON.stringify(fast) }] }].slice(-20);
      session.at = Date.now();
      return { status: 200, ...answer };
    }
    // 2. Normalized First-Turn LRU Cache (0 tokens for repeated initial questions)
    if ((session.messages?.length || 0) === 0) {
      const cacheKey = normalizeKey(cleanMessage);
      const cached = cacheKey ? responseCache.get(cacheKey) : null;
      if (cached && Date.now() - cached.at < CACHE_TTL) {
        session.messages = [{ role: 'user', parts: [{ text: cleanMessage }] }, { role: 'model', parts: [{ text: cached.raw }] }];
        session.at = Date.now();
        return { status: 200, ...cached.answer };
      }
    }
  }

  if (!apiKey) return { status: 503, error: 'La conversation IA est indisponible. Vous pouvez transmettre votre projet directement à Amir.' };
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) { day = today; daily = 0; }
  if (active >= 4 || daily >= (Number(process.env.CHAT_DAILY_LIMIT) || 500)) return { status: 503, error: 'OctoMask est momentanément occupé. Réessayez plus tard ou contactez Amir.' };
  session.busy = true;
  active++;
  daily++;
  try {
    const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
    const history = [...(session.messages || []).slice(-20), { role: 'user', parts: [{ text: cleanMessage }] }];
    const llmContents = [...compactForModel(session.messages || []), { role: 'user', parts: [{ text: cleanMessage }] }];
    const pageHint = typeof page === 'string' && /^\/[a-z0-9/_.-]*$/i.test(page) && page !== '/' ? `\nPAGE VISITÉE : ${page.slice(0, 60)}` : '';
    let answer;
    let raw;
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await fetcher(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: instructions + pageHint + (attempt ? '\nVALIDATION : réponse précédente invalide. Zéro prix, mot euro/EUR, symbole € ou URL dans reply. Ne confirme aucune action.' : '') }] },
          contents: llmContents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 380,
            responseMimeType: 'application/json',
            responseSchema: schema,
            ...(/^gemini-2\.5/.test(model) ? { thinkingConfig: { thinkingBudget: 0 } }
              : /^gemini-3/.test(model) ? { thinkingConfig: { thinkingLevel: 'minimal' } } : {})
          }
        }),
        signal: AbortSignal.timeout(10_000)
      });
      if (!response.ok) throw new Error('provider-unavailable');
      const result = await response.json();
      const candidate = result.candidates?.[0];
      if (candidate?.finishReason !== 'STOP') throw new Error('incomplete');
      raw = candidate.content?.parts?.filter(p => !p.thought).map(p => p.text || '').join('');
      try {
        const parsed = sanitizeCandidate(JSON.parse(raw));
        answer = validateReply(parsed);
        raw = JSON.stringify(parsed);
        break;
      } catch (error) { if (attempt) throw error; }
    }
    if (fetcher === fetch && (session.messages?.length || 0) === 0) {
      const cacheKey = normalizeKey(cleanMessage);
      if (cacheKey && cacheKey.length >= 4) {
        if (responseCache.size >= 300) responseCache.delete(responseCache.keys().next().value);
        responseCache.set(cacheKey, { at: Date.now(), raw, answer });
      }
    }
    session.messages = [...history, { role: 'model', parts: [{ text: raw }] }].slice(-20);
    session.at = Date.now();
    return { status: 200, ...answer };
  } catch {
    return { status: 503, error: 'Je n’ai pas pu préparer une réponse fiable. Réessayez, ou transmettez votre question à Amir avec le bouton ci-dessous.' };
  } finally { session.busy = false; active--; }
}
