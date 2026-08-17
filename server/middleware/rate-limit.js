const RATE = { windowMs: 60000, max: 20 };
const CHAT_RATE = { windowMs: 60000, max: 10 };
const rateMap = new Map();
const chatRateMap = new Map();

// X-Forwarded-For est fourni par le CLIENT et donc falsifiable à volonté
// (un attaquant change juste l'en-tête à chaque requête pour contourner le
// rate limit). Le site est derrière Cloudflare (DNS) : cf-connecting-ip est
// posé par l'edge Cloudflare lui-même et écrase toute valeur client — c'est
// la seule source fiable de l'IP réelle en production. En local/direct
// (pas de Cloudflare devant), on retombe sur l'IP socket brute, qui n'est
// pas non plus falsifiable par le client.
function getClientIp(req) {
  const cfIp = String(req.headers['cf-connecting-ip'] || '').trim();
  return cfIp || req.socket.remoteAddress || '?';
}

function rateLimited(req) {
  const ip = getClientIp(req);
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.start > RATE.windowMs) {
    rateMap.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count++;
  return entry.count > RATE.max;
}

function rateLimitedChat(req) {
  const ip = getClientIp(req);
  const now = Date.now();
  const entry = chatRateMap.get(ip);
  if (!entry || now - entry.start > CHAT_RATE.windowMs) {
    chatRateMap.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count++;
  return entry.count > CHAT_RATE.max;
}

// Memory leak protection: clean rate limits map periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, e] of rateMap) {
    if (now - e.start > RATE.windowMs) {
      rateMap.delete(ip);
    }
  }
  for (const [ip, e] of chatRateMap) {
    if (now - e.start > CHAT_RATE.windowMs) {
      chatRateMap.delete(ip);
    }
  }
}, 5 * 60000).unref();

module.exports = {
  rateLimited,
  rateLimitedChat
};
