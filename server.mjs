// Serveur HTTP haute securite (Zero-Dependency) pour Purity Agency v2.
import { createHash } from 'node:crypto';
import http from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { createReadStream, realpathSync, readdirSync, readFileSync } from 'node:fs';
import { brotliCompressSync, gzipSync, constants as zlibConstants } from 'node:zlib';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditSite, normaliseUrl, isPublicUrl } from './api/audit.mjs';
import { pagespeed, pagespeedIssues } from './api/pagespeed.mjs';
import { availability, book } from './api/calendar.mjs';
import { sendContact } from './api/contact.mjs';
import { chat, sessionFor, clearSession, allowed } from './api/chat.mjs';
import { offers } from './api/octomask-knowledge.mjs';
import {
  SECURITY_TXT,
  applySecurityHeaders,
  extractClientIp,
  verifySameOrigin,
  readJsonBody,
  createRateLimiter,
  resolveLegacyRedirect,
  resolveCleanRoute,
  isAllowedStaticPath
} from './api/security.mjs';
import { validateEnvironment } from './api/env-validator.mjs';

validateEnvironment();

const ROOT = realpathSync(resolve(fileURLToPath(new URL('.', import.meta.url))));
const ROOT_PREFIX = ROOT.endsWith(sep) ? ROOT : ROOT + sep;
const PORT = Number(process.env.PORT) || 3001;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8'
};

// Limiteurs de debit dedies par type d'operation pour empecher qu'un appel
// lourd (audit / PageSpeed) ne bloque le formulaire de contact ou l'agenda.
const auditLimiter = createRateLimiter({ windowMs: 60_000, max: 30 });
const pagespeedLimiter = createRateLimiter({ windowMs: 60_000, max: 20 });
const mutationLimiter = createRateLimiter({ windowMs: 60_000, max: 8 });
const slotsLimiter = createRateLimiter({ windowMs: 60_000, max: 25 });
const offersLimiter = createRateLimiter({ windowMs: 60_000, max: 60 });
const cspReportLimiter = createRateLimiter({ windowMs: 60_000, max: 20 });

// Page 404 brandee : le visiteur garde le header, le footer et des liens de sortie.
async function notFound(res) {
  applySecurityHeaders(res, { isNoIndex: true });
  try {
    const html = await readFile(join(ROOT, '404.html'));
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }).end(html);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }).end('404');
  }
}

// ETag fondé sur le contenu (petits fichiers) : un déploiement qui ne change pas un fichier
// ne l'invalide plus. Mémorisé par chemin tant que taille et mtime restent identiques.
const ETAG_CACHE = new Map();
async function contentEtag(file, info) {
  const stamp = `${info.size}-${Math.floor(info.mtimeMs)}`;
  const hit = ETAG_CACHE.get(file);
  if (hit && hit.stamp === stamp) return hit.etag;
  let etag = `W/"${info.size.toString(16)}-${Math.floor(info.mtimeMs).toString(16)}"`;
  if (info.size <= 2_000_000) {
    try {
      etag = `W/"${info.size.toString(16)}-${createHash('sha1').update(await readFile(file)).digest('base64url').slice(0, 16)}"`;
    } catch { /* repli sur mtime */ }
  }
  if (ETAG_CACHE.size > 5000) ETAG_CACHE.clear();
  ETAG_CACHE.set(file, { stamp, etag });
  return etag;
}

// Canonicals : /x.html dont la canonical est une URL propre -> 301 vers cette URL.
// Construit une fois au démarrage depuis les <link rel=canonical> des pages (hors démos).
export const CANONICAL_REDIRECTS = new Map();
function scanCanonicals(dir, prefix) {
  let entries = [];
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    if (e.isDirectory()) {
      if (!prefix && ['agence-web', 'site-internet', 'services', 'cas-concrets'].includes(e.name)) scanCanonicals(join(dir, e.name), `/${e.name}`);
      continue;
    }
    if (!e.name.endsWith('.html')) continue;
    let html = '';
    try { html = readFileSync(join(dir, e.name), 'utf8'); } catch { continue; }
    const m = /<link[^>]+rel=["']canonical["'][^>]*href=["']https:\/\/purity-agency\.be([^"'#?]*)["']/i.exec(html);
    if (!m) continue;
    const canonical = m[1] || '/';
    const reqPath = `${prefix}/${e.name}`;
    if (canonical !== reqPath && !canonical.endsWith('.html')) CANONICAL_REDIRECTS.set(reqPath, canonical);
  }
}
scanCanonicals(ROOT, '');

// Compression brotli/gzip des réponses texte, mémorisée par ETag.
const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.json', '.xml', '.svg', '.txt']);
const COMPRESS_CACHE = new Map();
function compressed(file, etag, encoding) {
  const key = `${encoding}:${file}:${etag}`;
  let buf = COMPRESS_CACHE.get(key);
  if (!buf) {
    const raw = readFileSync(file);
    buf = encoding === 'br'
      ? brotliCompressSync(raw, { params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 11, [zlibConstants.BROTLI_PARAM_SIZE_HINT]: raw.length } })
      : gzipSync(raw, { level: 9 });
    if (COMPRESS_CACHE.size > 1000) COMPRESS_CACHE.clear();
    COMPRESS_CACHE.set(key, buf);
  }
  return buf;
}
function pickEncoding(header) {
  const h = String(header || '').toLowerCase();
  const ok = (name) => new RegExp(`(?:^|,)\\s*${name}\\s*(?:;\\s*q=(?!0(?:\\.0*)?\\s*(?:,|$))[0-9.]+)?\\s*(?:,|$)`).test(h);
  if (ok('br')) return 'br';
  if (ok('gzip')) return 'gzip';
  return null;
}

export const server = http.createServer(async (req, res) => {
  try {
    if (['TRACE', 'TRACK', 'CONNECT'].includes(String(req.method || '').toUpperCase())) {
      applySecurityHeaders(res, { isNoIndex: true });
      res.writeHead(405, { 'Cache-Control': 'no-store' }).end('Method Not Allowed');
      return;
    }
    const rawUrl = String(req.url || '/');
    // Points et slashs encodes interdits dans le chemin seulement : la query les
    // contient legitimement (/api/audit?url=https%3A%2F%2F...).
    const rawPath = rawUrl.split('?')[0];
    if (rawUrl.length > 2048 || /%00/.test(rawUrl) || /%(?:2e|2f|5c)/i.test(rawPath)) {
      applySecurityHeaders(res, { isNoIndex: true });
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }).end('Bad Request');
      return;
    }

    let path;
    try {
      path = decodeURIComponent(new URL(rawUrl, 'http://x').pathname);
    } catch {
      applySecurityHeaders(res, { isNoIndex: true });
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }).end('Bad Request');
      return;
    }

    const isDemoRoute = path.startsWith('/demos/');
    const isNoIndexRoute = path.startsWith('/api/') || isDemoRoute;
    applySecurityHeaders(res, { isNoIndex: isNoIndexRoute, isDemo: isDemoRoute });

    const json = (code, body, extraHeaders = {}) => res.writeHead(code, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders
    }).end(JSON.stringify(body));

    const ip = extractClientIp(req);

    // RFC 9116 security.txt
    if ((path === '/.well-known/security.txt' || path === '/security.txt') && (req.method === 'GET' || req.method === 'HEAD')) {
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400'
      }).end(req.method === 'HEAD' ? undefined : SECURITY_TXT);
      return;
    }

    if ((path === '/health' || path === '/api/health') && req.method === 'GET') {
      return json(200, { status: 'ok', service: 'purity-agency-v2', ts: Date.now() });
    }

    if (path === '/api/chat') {
      if (!['POST', 'DELETE'].includes(req.method)) {
        return json(405, { error: 'Méthode non autorisée.' }, { Allow: 'POST, DELETE' });
      }
      if (!verifySameOrigin(req)) return json(403, { error: 'Origine non autorisée.' });
      if (!allowed(ip)) {
        return json(429, { error: 'Trop de messages. Réessayez dans quelques minutes ou contactez Amir.' }, { 'Retry-After': '60' });
      }
      const { id, session } = sessionFor(req.headers.cookie);
      res.setHeader(
        'Set-Cookie',
        `octomask=${id}; HttpOnly; SameSite=Strict; Path=/api/chat; Max-Age=1800; Priority=High${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
      );
      if (req.method === 'DELETE') {
        clearSession(id);
        return json(200, { ok: true });
      }
      try {
        const body = await readJsonBody(req, { maxBytes: 8_192, timeoutMs: 8_000 });
        const result = await chat(session, body?.message, { page: body?.page });
        const { status, ...payload } = result;
        return json(status, payload);
      } catch (err) {
        if (err?.message === 'too-large') return json(413, { error: 'Message trop volumineux (max 8 Ko).' });
        return json(400, { error: 'Message invalide.' });
      }
    }

    if (path === '/api/offers') {
      if (req.method !== 'GET') return json(405, { error: 'Méthode non autorisée.' }, { Allow: 'GET' });
      if (offersLimiter(ip)) return json(429, { error: 'Trop de requêtes.' }, { 'Retry-After': '60' });
      return json(200, { offers }, { 'Cache-Control': 'public, max-age=300' });
    }

    if (path === '/api/slots') {
      if (req.method !== 'GET') return json(405, { ok: false, reason: 'method' }, { Allow: 'GET' });
      if (slotsLimiter(ip)) return json(429, { ok: false, reason: 'rate' }, { 'Retry-After': '60' });
      const date = new URL(rawUrl, 'http://x').searchParams.get('date');
      try {
        return json(200, await availability(String(date || '')));
      } catch {
        return json(200, { ok: false, reason: 'calendar-error' });
      }
    }

    if (path === '/api/book') {
      if (req.method !== 'POST') return json(405, { ok: false, reason: 'method' }, { Allow: 'POST' });
      if (!verifySameOrigin(req)) return json(403, { ok: false, reason: 'forbidden' });
      if (mutationLimiter(ip)) return json(429, { ok: false, reason: 'rate' }, { 'Retry-After': '60' });
      try {
        const b = await readJsonBody(req, { maxBytes: 12_288, timeoutMs: 8_000 });
        if (b.website || b.company_url || b._hp) return json(200, { ok: true, start: b.start || '' });
        if (!b.start || !b.name || !b.email) return json(200, { ok: false, reason: 'missing' });
        return json(200, await book(b));
      } catch (err) {
        if (err?.message === 'too-large') return json(413, { ok: false, reason: 'payload-too-large' });
        return json(400, { ok: false, reason: 'bad-request' });
      }
    }

    if (path === '/api/contact') {
      if (req.method !== 'POST') return json(405, { ok: false, reason: 'method' }, { Allow: 'POST' });
      if (!verifySameOrigin(req)) return json(403, { ok: false, reason: 'forbidden' });
      if (mutationLimiter(ip)) return json(429, { ok: false, reason: 'rate' }, { 'Retry-After': '60' });
      try {
        const b = await readJsonBody(req, { maxBytes: 16_384, timeoutMs: 8_000 });
        return json(200, await sendContact(b));
      } catch (err) {
        if (err?.message === 'too-large') return json(413, { ok: false, reason: 'payload-too-large' });
        return json(400, { ok: false, reason: 'bad-request' });
      }
    }

    if (path === '/api/pagespeed') {
      if (req.method !== 'GET') return json(405, { ok: false, reason: 'method' }, { Allow: 'GET' });
      if (pagespeedLimiter(ip)) return json(429, { ok: false, reason: 'rate' }, { 'Retry-After': '60' });
      const q = new URL(rawUrl, 'http://x').searchParams.get('url');
      const target = normaliseUrl(q);
      if (!target || !(await isPublicUrl(target))) return json(200, { ok: false });
      try {
        const ps = await pagespeed(target.href);
        return json(200, ps ? { ok: true, pagespeed: ps, issues: pagespeedIssues(ps) } : { ok: false });
      } catch {
        return json(200, { ok: false });
      }
    }

    if (path === '/api/audit') {
      if (req.method !== 'GET') return json(405, { ok: false, reason: 'method' }, { Allow: 'GET' });
      if (auditLimiter(ip)) return json(429, { ok: false, reason: 'rate' }, { 'Retry-After': '60' });
      const q = new URL(rawUrl, 'http://x').searchParams.get('url');
      const target = normaliseUrl(q);
      if (!target) return json(200, { ok: false, reason: 'no-url' });
      try {
        return json(200, await auditSite(target));
      } catch {
        return json(200, { ok: false, reason: 'unreachable' });
      }
    }

    // Rapports de blocage CSP (report-uri et Reporting API) : une ligne courte
    // dans le journal, sans IP ni URL complète.
    if (path === '/api/csp-report') {
      if (req.method !== 'POST') return json(405, { ok: false }, { Allow: 'POST' });
      if (cspReportLimiter(ip)) return res.writeHead(204).end();
      try {
        const body = await readJsonBody(req, {
          maxBytes: 16_384,
          timeoutMs: 5_000,
          types: ['application/csp-report', 'application/reports+json', 'application/json']
        });
        const list = Array.isArray(body) ? body.map(r => r?.body) : [body?.['csp-report']];
        for (const r of list.slice(0, 5)) {
          if (!r || typeof r !== 'object') continue;
          const clip = (v) => String(v || '').replace(/[?#].*$/, '').replace(/\s+/g, ' ').slice(0, 200);
          const page = clip(r.documentURL || r['document-uri']);
          const directive = clip(r.effectiveDirective || r['effective-directive'] || r['violated-directive']);
          const blocked = clip(r.blockedURL || r['blocked-uri']);
          console.warn(`[csp] ${directive} bloqué: ${blocked || '(inline)'} sur ${page}`);
        }
      } catch { /* rapport illisible : ignoré */ }
      return res.writeHead(204, { 'Cache-Control': 'no-store' }).end();
    }

    // Bloque toute route /api/* inconnue sans tomber dans le serveur de fichiers.
    if (path.startsWith('/api/')) {
      return json(404, { error: 'Route API introuvable.' });
    }

    // Seules les methodes GET et HEAD sont autorisees sur les ressources statiques.
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD', 'Cache-Control': 'no-store' }).end('Method Not Allowed');
      return;
    }

    // Redirections 301 des anciennes URLs v1 (/tarifs, /tarifs/, /tarifs.html, /services.html...)
    // avant toute resolution de route propre : le stub tarifs.html n'est donc jamais servi.
    const redirectTo = resolveLegacyRedirect(path);
    if (redirectTo) {
      res.writeHead(301, { Location: redirectTo, 'Cache-Control': 'no-store' }).end();
      return;
    }

    const canonicalTo = CANONICAL_REDIRECTS.get(path);
    if (canonicalTo) {
      const qs = rawUrl.includes('?') ? rawUrl.slice(rawUrl.indexOf('?')) : '';
      res.writeHead(301, { Location: canonicalTo + qs, 'Cache-Control': 'public, max-age=86400' }).end();
      return;
    }

    // Une seule forme par page : slash final retiré (sauf /site-internet/, dont c'est la canonical).
    const qsSlash = rawUrl.includes('?') ? rawUrl.slice(rawUrl.indexOf('?')) : '';
    const slashTo = path === '/site-internet' ? '/site-internet/'
      : path === '/favicon.ico' ? '/assets/favicon-32.png'
      : path.length > 1 && path.endsWith('/') && path !== '/site-internet/' && /\.html$/.test(resolveCleanRoute(path.slice(0, -1)) || '') ? path.slice(0, -1)
      : null;
    if (slashTo) {
      res.writeHead(301, { Location: slashTo + qsSlash, 'Cache-Control': 'public, max-age=86400' }).end();
      return;
    }

    const resolvedRoute = resolveCleanRoute(path);
    if (!resolvedRoute) {
      await notFound(res);
      return;
    }
    path = resolvedRoute;
    if (path.endsWith('/')) path += 'index.html';

    if (!isAllowedStaticPath(path) || !Object.hasOwn(MIME, extname(path).toLowerCase())) {
      await notFound(res);
      return;
    }

    const file = resolve(join(ROOT, normalize(path)));
    if (!file.startsWith(ROOT_PREFIX)) {
      res.writeHead(403, { 'Cache-Control': 'no-store' }).end('Forbidden');
      return;
    }

    const realFile = await realpath(file);
    if (!realFile.startsWith(ROOT_PREFIX)) {
      res.writeHead(403, { 'Cache-Control': 'no-store' }).end('Forbidden');
      return;
    }

    const info = await stat(realFile);
    if (!info.isFile()) {
      await notFound(res);
      return;
    }

    const ext = extname(file).toLowerCase();
    const etag = await contentEtag(realFile, info);
    const media = /^\.(?:webm|mp4|png|jpg|webp|svg|woff2|ico)$/.test(ext);
    const code = ext === '.css' || ext === '.js';
    // Asset versionné (?v=...) : contenu figé pour cette URL -> cache 1 an immuable.
    const versioned = /[?&]v=[^&]+/.test(rawUrl.slice(rawPath.length)) && (media || code);
    const isText = COMPRESSIBLE.has(ext);
    const headers = {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': versioned
        ? 'public, max-age=31536000, immutable'
        : media || ext === '.woff2'
          ? 'public, max-age=604800, stale-while-revalidate=2592000'
          : code ? 'public, max-age=300, stale-while-revalidate=86400'
            : ext === '.html' ? 'no-cache' : 'public, max-age=3600',
      'ETag': etag,
      'Last-Modified': new Date(info.mtimeMs).toUTCString(),
      'Accept-Ranges': 'bytes'
    };
    if (isText) headers.Vary = 'Accept-Encoding';
    const inm = req.headers['if-none-match'];
    const ims = Date.parse(req.headers['if-modified-since'] || '');
    if ((inm && inm.split(',').map(s => s.trim()).includes(etag)) ||
        (!inm && Number.isFinite(ims) && Math.floor(info.mtimeMs / 1000) <= Math.floor(ims / 1000))) {
      res.writeHead(304, headers).end();
      return;
    }
    const encoding = isText && info.size > 512 && !req.headers.range ? pickEncoding(req.headers['accept-encoding']) : null;
    if (encoding) {
      const body = compressed(realFile, etag, encoding);
      delete headers['Accept-Ranges'];
      res.writeHead(200, { ...headers, 'Content-Encoding': encoding, 'Content-Length': body.length });
      res.end(req.method === 'HEAD' ? undefined : body);
      return;
    }
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (range && (range[1] || range[2])) {
      let start = range[1] ? Number(range[1]) : Math.max(0, info.size - Number(range[2]));
      let end = range[1] && range[2] ? Math.min(Number(range[2]), info.size - 1) : info.size - 1;
      if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start >= info.size || start > end) {
        res.writeHead(416, { 'Content-Range': `bytes */${info.size}` }).end();
        return;
      }
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${info.size}`, 'Content-Length': end - start + 1 });
      if (req.method === 'HEAD') { res.end(); return; }
      createReadStream(file, { start, end }).pipe(res);
      return;
    }
    res.writeHead(200, { ...headers, 'Content-Length': info.size });
    if (req.method === 'HEAD') { res.end(); return; }
    createReadStream(file).pipe(res);
  } catch {
    if (!res.headersSent) await notFound(res);
  }
});

// Protection anti-Slowloris et limites de connexion HTTP.
server.requestTimeout = 30_000;
server.headersTimeout = 10_000;
server.keepAliveTimeout = 5_000;
server.maxHeadersCount = 64;

if (process.env.PURITY_NO_LISTEN !== '1') {
  server.listen(PORT, '0.0.0.0', () => console.log(`purity-v2 on http://127.0.0.1:${PORT}`));
}
