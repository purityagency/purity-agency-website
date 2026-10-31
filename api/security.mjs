// Module central de securite HTTP, validation d'entrees, anti-CSRF,
// extraction d'IP derriere reverse-proxy et limitation de debit par route.
import { isIP } from 'node:net';

const CSP_DIRECTIVES = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "frame-src 'self'",
  "script-src 'self'",
  "script-src-attr 'none'",
  "style-src 'self'",
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self'"
];

const PERMISSIONS_POLICY = [
  'accelerometer=()',
  'ambient-light-sensor=()',
  'autoplay=(self)',
  'battery=()',
  'browsing-topics=()',
  'camera=()',
  'clipboard-read=()',
  'clipboard-write=(self)',
  'display-capture=()',
  'document-domain=()',
  'encrypted-media=()',
  'fullscreen=(self)',
  'gamepad=()',
  'geolocation=()',
  'gyroscope=()',
  'hid=()',
  'idle-detection=()',
  'local-fonts=()',
  'magnetometer=()',
  'microphone=()',
  'midi=()',
  'otp-credentials=()',
  'payment=()',
  'picture-in-picture=()',
  'publickey-credentials-get=()',
  'screen-wake-lock=()',
  'serial=()',
  'speaker-selection=()',
  'usb=()',
  'web-share=(self)',
  'xr-spatial-tracking=()'
].join(', ');

export const SECURITY_TXT = [
  'Contact: mailto:contact@purity-agency.be',
  'Preferred-Languages: fr, en',
  'Canonical: https://purity-agency.be/.well-known/security.txt',
  'Policy: https://purity-agency.be/confidentialite.html',
  'Expires: 2027-12-31T23:59:59.000Z',
  ''
].join('\n');

export function applySecurityHeaders(res, { isNoIndex = false, isDemo = false } = {}) {
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', isDemo ? 'SAMEORIGIN' : 'DENY');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('Origin-Agent-Cluster', '?1');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', PERMISSIONS_POLICY);
  const baseDirectives = isDemo
    ? CSP_DIRECTIVES.map(d => d.startsWith('frame-ancestors') ? "frame-ancestors 'self'" : d)
    : CSP_DIRECTIVES;
  const csp = process.env.NODE_ENV === 'production'
    ? [...baseDirectives, 'upgrade-insecure-requests'].join('; ')
    : baseDirectives.join('; ');
  res.setHeader('Content-Security-Policy', csp);
  if (isNoIndex) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }
}

export function normalizeIp(raw) {
  const cleaned = String(raw || '').trim().toLowerCase().replace(/^::ffff:/, '').split('%')[0];
  return isIP(cleaned) ? cleaned : '';
}

export function isTrustedProxyPeer(address) {
  const ip = normalizeIp(address);
  if (!ip) return false;
  if (ip === '127.0.0.1' || ip === '::1') return true;
  if (isIP(ip) === 4) {
    const [a, b] = ip.split('.').map(Number);
    return a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
  }
  return ip.startsWith('fc') || ip.startsWith('fd') || /^fe[89ab]/.test(ip);
}

export function extractClientIp(req) {
  const socketIp = normalizeIp(req.socket?.remoteAddress) || 'unknown';
  if (!isTrustedProxyPeer(socketIp)) return socketIp;

  const cfIp = normalizeIp(req.headers['cf-connecting-ip']);
  if (cfIp) return cfIp;

  const realIp = normalizeIp(req.headers['x-real-ip']);
  if (realIp) return realIp;

  const xff = String(req.headers['x-forwarded-for'] || '');
  if (xff) {
    const hops = xff.split(',').map(part => normalizeIp(part)).filter(Boolean);
    for (let i = hops.length - 1; i >= 0; i--) {
      if (!isTrustedProxyPeer(hops[i])) return hops[i];
    }
    if (hops[0]) return hops[0];
  }
  return socketIp;
}

export function verifySameOrigin(req) {
  const host = String(req.headers.host || '').trim().toLowerCase();
  if (!host || /[^a-z0-9.:-]/.test(host)) return false;

  const sfs = String(req.headers['sec-fetch-site'] || '').toLowerCase();
  if (sfs && sfs !== 'same-origin' && sfs !== 'none') return false;

  if (req.headers.origin) {
    try {
      const originUrl = new URL(String(req.headers.origin));
      if (!['http:', 'https:'].includes(originUrl.protocol)) return false;
      if (originUrl.host.toLowerCase() !== host) return false;
    } catch {
      return false;
    }
  } else if (req.headers.referer) {
    try {
      const refUrl = new URL(String(req.headers.referer));
      if (refUrl.host.toLowerCase() !== host) return false;
    } catch {
      return false;
    }
  }
  return true;
}

export function stripPrototypePollution(value, depth = 0) {
  if (depth > 8 || value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    return value.slice(0, 50).map(item => stripPrototypePollution(item, depth + 1));
  }
  const clean = Object.create(null);
  for (const [k, v] of Object.entries(value)) {
    if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
    clean[k] = stripPrototypePollution(v, depth + 1);
  }
  return { ...clean };
}

export function readJsonBody(req, { maxBytes = 16_384, timeoutMs = 8_000 } = {}) {
  return new Promise((resolve, reject) => {
    const ct = String(req.headers['content-type'] || '').toLowerCase();
    if (ct && !ct.includes('application/json')) {
      reject(new Error('unsupported-media-type'));
      return;
    }
    const chunks = [];
    let totalBytes = 0;
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      req.destroy();
      reject(new Error('body-timeout'));
    }, timeoutMs);

    req.on('data', chunk => {
      if (settled) return;
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      totalBytes += buf.byteLength;
      if (totalBytes > maxBytes) {
        settled = true;
        clearTimeout(timer);
        req.pause();
        req.on('data', () => {}); // drain stream safely
        reject(new Error('too-large'));
        return;
      }
      chunks.push(buf);
    });

    req.on('end', () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        const raw = Buffer.concat(chunks).toString('utf8').trim();
        if (!raw) {
          resolve({});
          return;
        }
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          reject(new Error('bad-json'));
          return;
        }
        resolve(stripPrototypePollution(parsed));
      } catch {
        reject(new Error('bad-json'));
      }
    });

    req.on('error', err => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(err);
    });
  });
}

export function createRateLimiter({ windowMs = 60_000, max = 10, maxKeys = 5_000 } = {}) {
  const buckets = new Map();

  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of buckets) {
      const fresh = entry.filter(ts => now - ts < windowMs);
      if (fresh.length) buckets.set(key, fresh);
      else buckets.delete(key);
    }
  }, Math.min(windowMs, 60_000));
  cleanup.unref?.();

  return function isRateLimited(key, customMax = max) {
    const now = Date.now();
    if (buckets.size >= maxKeys && !buckets.has(key)) {
      const oldestKey = buckets.keys().next().value;
      if (oldestKey !== undefined) buckets.delete(oldestKey);
    }
    const list = (buckets.get(key) || []).filter(ts => now - ts < windowMs);
    list.push(now);
    buckets.set(key, list);
    return list.length > customMax;
  };
}

const CLEAN_HTML_ROUTES = new Set([
  '/tarifs',
  '/contact',
  '/cas-concrets',
  '/services',
  '/blog',
  '/legal',
  '/confidentialite',
  '/cookies',
  '/conditions-generales'
]);

export function resolveCleanRoute(rawPathname) {
  if (typeof rawPathname !== 'string' || !rawPathname.startsWith('/')) return null;
  if (rawPathname.includes('\0') || rawPathname.includes('\\') || rawPathname.includes('//')) return null;
  const trimmed = rawPathname.length > 1 && rawPathname.endsWith('/') ? rawPathname.slice(0, -1) : rawPathname;
  if (CLEAN_HTML_ROUTES.has(trimmed)) return `${trimmed}.html`;
  if (/^\/cas-concrets\/[a-z0-9-]+$/.test(trimmed)) return `${trimmed}.html`;
  if (/^\/services\/[a-z0-9-]+$/.test(trimmed)) return `${trimmed}.html`;
  return rawPathname;
}

export function isAllowedStaticPath(path) {
  if (typeof path !== 'string' || !path.startsWith('/')) return false;
  if (path.includes('\0') || path.includes('\\') || path.includes('//') || path.includes('..')) return false;
  const segments = path.split('/');
  if (segments.some(seg => seg.startsWith('.'))) return false;
  return (
    /^\/[a-zA-Z0-9_-]+\.(?:html|txt|xml)$/.test(path) ||
    /^\/(?:assets|css|js)\/[a-zA-Z0-9_./-]+$/.test(path) ||
    /^\/cas-concrets\/[a-z0-9-]+\.html$/.test(path) ||
    /^\/services\/[a-z0-9-]+\.html$/.test(path) ||
    /^\/demos\/[a-z0-9-]+\/(?:index|services|univers|contact|studio)\.html$/.test(path) ||
    /^\/offres\/(?:assets\/[a-zA-Z0-9_.-]+|[a-z0-9-]+\/index\.html)$/.test(path)
  );
}

