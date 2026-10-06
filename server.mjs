// Serveur statique minimal pour le chantier v2. Aucune dependance.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditSite, normaliseUrl } from './api/audit.mjs';
import { pagespeed, pagespeedIssues } from './api/pagespeed.mjs';
import { availability, book } from './api/calendar.mjs';
import { sendContact } from './api/contact.mjs';
import { chat, sessionFor, clearSession, allowed } from './api/chat.mjs';
import { offers } from './api/octomask-knowledge.mjs';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)));
const PORT = Number(process.env.PORT) || 3001;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml; charset=utf-8',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.txt': 'text/plain; charset=utf-8'
};

function securityHeaders(res) {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "script-src 'self'",
    "style-src 'self'",
    // Les animations (reveal.js, founder-reveal.js, hero-video.js, method-waves.js, menu.js)
    // pilotent des custom properties CSS (--i, --score, --scroll-progress...) et des
    // transform/opacity via element.style.* : CSP les traite comme "style inline" au meme
    // titre qu'un attribut style="" statique. style-src-attr cible precisement l'attribut
    // style (HTML ou pose par JS) sans rouvrir <style>/feuilles externes (toujours 'self').
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "media-src 'self'",
    "connect-src 'self' https://generativelanguage.googleapis.com https://api.resend.com https://oauth2.googleapis.com https://www.googleapis.com https://www.googleapis.com/pagespeedonline/"
  ].join('; '));
}

// Une IP ne peut pas enchainer les audits : chaque audit declenche une
// requete sortante vers un site tiers.
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 6;
}


// Page 404 brandee : le visiteur garde le header, le footer et des liens de sortie.
async function notFound(res) {
  try {
    const html = await readFile(join(ROOT, '404.html'));
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' }).end(html);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('404');
  }
}

http.createServer(async (req, res) => {
  try {
    securityHeaders(res);
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);

    var json = (code, body) => res.writeHead(code, {
      'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store'
    }).end(JSON.stringify(body));

    function readBody() {
      return new Promise((ok, ko) => {
        let raw = '';
        req.on('data', (c) => {
          raw += c;
          if (raw.length > 20000) { req.destroy(); ko(new Error('too-large')); }
        });
        req.on('end', () => { try { ok(JSON.parse(raw || '{}')); } catch { ko(new Error('bad-json')); } });
        req.on('error', ko);
      });
    }

    if ((path === '/health' || path === '/api/health') && req.method === 'GET') {
      return json(200, { status: 'ok', service: 'purity-agency-v2', ts: Date.now() });
    }

    // Diagnostic temporaire de l'animation hero sur appareils reels : une ligne
    // dans le journal Render, rien d'autre n'est conserve.
    if (path === '/api/hero-diag' && req.method === 'POST') {
      const body = await readBody().catch(() => null);
      if (body) console.log('[hero-diag]', JSON.stringify(body).slice(0, 3000));
      res.writeHead(204).end();
      return;
    }

    if (path === '/api/chat') {
      if (!['POST', 'DELETE'].includes(req.method)) return json(405, { error: 'Méthode non autorisée.' });
      if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}` && req.headers.origin !== `https://${req.headers.host}`) return json(403, { error: 'Origine non autorisée.' });
      if (!allowed(req.socket.remoteAddress || 'unknown')) return json(429, { error: 'Trop de messages. Réessayez dans quelques minutes ou contactez Amir.' });
      const { id, session } = sessionFor(req.headers.cookie);
      res.setHeader('Set-Cookie', `octomask=${id}; HttpOnly; SameSite=Strict; Path=/api/chat; Max-Age=1800${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
      if (req.method === 'DELETE') { clearSession(id); return json(200, { ok: true }); }
      try {
        const body = await readBody();
        const result = await chat(session, body?.message);
        const { status, ...payload } = result;
        return json(status, payload);
      } catch { return json(400, { error: 'Message invalide.' }); }
    }

    if (path === '/api/offers' && req.method === 'GET') return json(200, { offers });

    if (path === '/api/slots') {
      const date = new URL(req.url, 'http://x').searchParams.get('date');
      try {
        return json(200, await availability(String(date || '')));
      } catch {
        return json(200, { ok: false, reason: 'calendar-error' });
      }
    }

    if (path === '/api/book' && req.method === 'POST') {
      const ip = req.socket.remoteAddress || 'x';
      if (rateLimited(ip)) return json(429, { ok: false, reason: 'rate' });
      try {
        const b = await readBody();
        if (!b.start || !b.name || !b.email) return json(200, { ok: false, reason: 'missing' });
        return json(200, await book(b));
      } catch {
        return json(200, { ok: false, reason: 'bad-request' });
      }
    }

    if (path === '/api/contact' && req.method === 'POST') {
      const ip = req.socket.remoteAddress || 'x';
      if (rateLimited(ip)) return json(429, { ok: false, reason: 'rate' });
      try {
        const b = await readBody();
        return json(200, await sendContact(b));
      } catch {
        return json(200, { ok: false, reason: 'bad-request' });
      }
    }

    if (path === '/api/pagespeed') {
      const q = new URL(req.url, 'http://x').searchParams.get('url');
      const target = normaliseUrl(q);
      if (!target) return json(200, { ok: false });
      try {
        const ps = await pagespeed(target.href);
        return json(200, ps ? { ok: true, pagespeed: ps, issues: pagespeedIssues(ps) } : { ok: false });
      } catch {
        return json(200, { ok: false });
      }
    }

    if (path === '/api/audit') {
      const q = new URL(req.url, 'http://x').searchParams.get('url');
      const ip = req.socket.remoteAddress || 'x';
      if (rateLimited(ip)) return json(429, { ok: false, reason: 'rate' });
      const target = normaliseUrl(q);
      if (!target) return json(200, { ok: false, reason: 'no-url' });
      try {
        return json(200, await auditSite(target));
      } catch {
        return json(200, { ok: false, reason: 'unreachable' });
      }
    }

    // Preserve useful legacy entry points while the new information architecture
    // takes over. Search engines and bookmarked v1 URLs land on an equivalent
    // v2 destination instead of a dead page.
    const redirects = {
      '/tarifs.html': '/#services',
      '/services.html': '/#services',
      '/agence-web-charleroi.html': '/#services',
      '/liens.html': '/contact.html'
    };
    if (redirects[path]) {
      res.writeHead(301, { Location: redirects[path], 'Cache-Control': 'no-store' }).end();
      return;
    }
    if (path.endsWith('/')) path += 'index.html';
    // Do not serve backend source, documentation or dotfiles as static assets.
    const allowedStaticPath =
      /^\/[a-zA-Z0-9_-]+\.(?:html|txt|xml)$/.test(path) ||
      /^\/(?:assets|css|js)\/[a-zA-Z0-9_./-]+$/.test(path) ||
      /^\/cas-concrets\/[a-z0-9-]+\.html$/.test(path) ||
      /^\/demos\/[a-z0-9-]+\/(?:index|services|univers|contact|studio)\.html$/.test(path);
    if (!allowedStaticPath || path.split('/').some(s => s.startsWith('.')) || !Object.hasOwn(MIME, extname(path))) {
      await notFound(res); return;
    }
    // normalize resout les segments ".." ; on verifie ensuite que le chemin
    // reste sous ROOT, ce qui bloque toute remontee hors du dossier servi.
    const file = resolve(join(ROOT, normalize(path)));
    if (!file.startsWith(ROOT.endsWith(sep) ? ROOT : ROOT + sep)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    const info = await stat(file);
    const ext = extname(file).toLowerCase();
    const etag = `W/"${info.size.toString(16)}-${Math.floor(info.mtimeMs).toString(16)}"`;
    // HTML, CSS, JS : toujours revalides (304 si inchanges) pour qu'un deploiement soit
    // visible immediatement. Medias et polices : gardes un jour en cache navigateur.
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
    // Requetes partielles : le navigateur peut sauter dans la video (currentTime = 4.4)
    // sans devoir telecharger tout le debut du fichier.
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (range && (range[1] || range[2])) {
      let start = range[1] ? Number(range[1]) : Math.max(0, info.size - Number(range[2]));
      let end = range[1] && range[2] ? Math.min(Number(range[2]), info.size - 1) : info.size - 1;
      if (start >= info.size || start > end) {
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
}).listen(PORT, '0.0.0.0', () => console.log(`purity-v2 on http://127.0.0.1:${PORT}`));
