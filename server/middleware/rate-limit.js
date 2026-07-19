const RATE = { windowMs: 60000, max: 20 };
const rateMap = new Map();

function rateLimited(req) {
  const fwd = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const ip = fwd || req.socket.remoteAddress || '?';
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.start > RATE.windowMs) {
    rateMap.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count++;
  return entry.count > RATE.max;
}

// Memory leak protection: clean rate limits map periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, e] of rateMap) {
    if (now - e.start > RATE.windowMs) {
      rateMap.delete(ip);
    }
  }
}, 5 * 60000).unref();

module.exports = {
  rateLimited
};
