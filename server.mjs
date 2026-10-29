// Serveur HTTP haute securite (Zero-Dependency) pour Purity Agency v2.
import http from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { createReadStream, realpathSync } from 'node:fs';
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
const auditLimiter = createRateLimiter({ windowMs: 60_000, max: 6 });
const pagespeedLimiter = createRateLimiter({ windowMs: 60_000, max: 4 });
const mutationLimiter = createRateLimiter({ windowMs: 60_000, max: 8 });
const slotsLimiter = createRateLimiter({ windowMs: 60_000, max: 25 });
const offersLimiter = createRateLimiter({ windowMs: 60_000, max: 60 });

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

export const server = http.createServer(async (req, res) => {
  try {
    if (['TRACE', 'TRACK', 'CONNECT'].includes(String(req.method || '').toUpperCase())) {
      applySecurityHeaders(res, { isNoIndex: true });
      res.writeHead(405, { 'Cache-Control': 'no-store' }).end('Method Not Allowed');
      return;
    }
    const rawUrl = String(req.url || '/');
    if (rawUrl.length > 2048 || /%(?:00|2e|2f|5c)/i.test(rawUrl)) {
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
    const isNoIndexRoute = path.startsWith('/api/') || isDemoRoute || path.startsWith('/offres/');
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
      } catch {
        return json(400, { error: 'Message invalide.' });
      }
    }

    if (path === '/api/offers') {
      if (req.method !== 'GET') return json(405, { error: 'Méthode non autorisée.' }, { Allow: 'GET' });
      if (offersLimiter(ip)) return json(429, { error: 'Trop de requêtes.' }, { 'Retry-After': '60' });
      return json(200, { offers });
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
      } catch {
        return json(200, { ok: false, reason: 'bad-request' });
      }
    }

    if (path === '/api/contact') {
      if (req.method !== 'POST') return json(405, { ok: false, reason: 'method' }, { Allow: 'POST' });
      if (!verifySameOrigin(req)) return json(403, { ok: false, reason: 'forbidden' });
      if (mutationLimiter(ip)) return json(429, { ok: false, reason: 'rate' }, { 'Retry-After': '60' });
      try {
        const b = await readJsonBody(req, { maxBytes: 16_384, timeoutMs: 8_000 });
        return json(200, await sendContact(b));
      } catch {
        return json(200, { ok: false, reason: 'bad-request' });
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

    // Bloque toute route /api/* inconnue sans tomber dans le serveur de fichiers.
    if (path.startsWith('/api/')) {
      return json(404, { error: 'Route API introuvable.' });
    }

    // Seules les methodes GET et HEAD sont autorisees sur les ressources statiques.
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD', 'Cache-Control': 'no-store' }).end('Method Not Allowed');
      return;
    }

    // Redirections 301 des anciennes URLs v1 vers leur destination v2 active.
    // Note : /tarifs.html est desormais une vraie page active et ne doit plus rediriger.
    const redirects = {
      '/tarifs': '/#services',
      '/tarifs.html': '/#services',
      '/services.html': '/#services',
      '/agence-web-charleroi.html': '/#services',
      '/liens.html': '/contact.html'
    };
    if (redirects[path]) {
      res.writeHead(301, { Location: redirects[path], 'Cache-Control': 'no-store' }).end();
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
    const etag = `W/"${info.size.toString(16)}-${Math.floor(info.mtimeMs).toString(16)}"`;
    const media = /^\.(?:webm|mp4|png|jpg|webp|svg|woff2|ico)$/.test(ext);
    const headers = {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': media ? 'public, max-age=86400, stale-while-revalidate=604800' : 'no-cache',
      'ETag': etag,
      'Last-Modified': new Date(info.mtimeMs).toUTCString(),
      'Accept-Ranges': 'bytes'
    };
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, headers).end();
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
