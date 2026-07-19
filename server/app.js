const http = require('http');
const path = require('path');
const fs = require('fs');
const cluster = require('cluster');
const os = require('os');
const env = require('./config/env');
const logger = require('./utils/logger');
const cache = require('./utils/cache');
const security = require('./middleware/security');
const contactRouter = require('./routes/contact');
const bookingRouter = require('./routes/booking');
const paymentRouter = require('./routes/payment');

const PORT = env.PORT;
const ROOT = env.ROOT;

const ALLOWED_ORIGINS = new Set([
  'https://purity-agency.be',
  'https://www.purity-agency.be',
  `http://localhost:${PORT}`,
  `http://127.0.0.1:${PORT}`
]);

function isOriginAllowed(req) {
  const origin = req.headers['origin'] || '';
  const referer = req.headers['referer'] || '';
  if (!origin && !referer) return true;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  for (const allowed of ALLOWED_ORIGINS) {
    if (referer.startsWith(allowed)) return true;
  }
  return false;
}

const BLOCKED_FILES = new Set(['server.js', 'leads.log']);
const BLOCKED_EXTENSIONS = new Set(['.png']);
const PNG_EXCEPTIONS = new Set(['logo.png', 'service5.png']);

const MIME = {
  '.html' : 'text/html; charset=utf-8',
  '.css'  : 'text/css',
  '.js'   : 'application/javascript',
  '.png'  : 'image/png',
  '.jpg'  : 'image/jpeg',
  '.jpeg' : 'image/jpeg',
  '.gif'  : 'image/gif',
  '.svg'  : 'image/svg+xml',
  '.ico'  : 'image/x-icon',
  '.mp4'  : 'video/mp4',
  '.webm' : 'video/webm',
  '.woff' : 'font/woff',
  '.woff2': 'font/woff2',
  '.webp' : 'image/webp',
  '.txt'  : 'text/plain; charset=utf-8',
  '.xml'  : 'application/xml',
  '.json' : 'application/json'
};

function isServable(filePath) {
  const base = path.basename(filePath);
  if (base.startsWith('.') || BLOCKED_FILES.has(base)) return false;
  if (PNG_EXCEPTIONS.has(base)) return true;
  const rel = path.relative(ROOT, filePath);
  if (rel.split(path.sep).some(seg => seg.startsWith('.'))) return false;
  const ext = path.extname(filePath).toLowerCase();
  if (BLOCKED_EXTENSIONS.has(ext)) return false;
  return Object.prototype.hasOwnProperty.call(MIME, ext);
}

function handleStaticRequest(req, res, urlPath) {
  if (urlPath === '/') urlPath = '/index.html';
  if (urlPath === '/commande-confirmee') urlPath = '/commande-confirmee.html';

  const decodedPath = decodeURIComponent(urlPath);
  const filePath = path.normalize(path.join(ROOT, decodedPath));

  if (!filePath.startsWith(ROOT) || !isServable(filePath)) {
    res.writeHead(404);
    return res.end('404 Not found');
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(err && err.code !== 'ENOENT' ? 500 : 404);
      return res.end(err && err.code !== 'ENOENT' ? '500 Error' : '404 Not found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext];

    // Cache headers
    const lastModified = stat.mtime.toUTCString();
    const cacheControl = ['.html', '.css', '.js', '.json'].includes(ext)
      ? 'no-cache'
      : 'public, max-age=31536000, immutable';

    res.setHeader('Last-Modified', lastModified);
    res.setHeader('Cache-Control', cacheControl);

    const ifModifiedSince = req.headers['if-modified-since'];
    if (ifModifiedSince && ifModifiedSince === lastModified) {
      res.writeHead(304);
      return res.end();
    }

    const rangeHeader = req.headers['range'];
    if (rangeHeader) {
      const m = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
      const start = m && m[1] !== '' ? parseInt(m[1], 10) : 0;
      const end = m && m[2] !== '' ? parseInt(m[2], 10) : stat.size - 1;
      if (!m || start > end || start >= stat.size) {
        res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` });
        return res.end();
      }
      const safeEnd = Math.min(end, stat.size - 1);
      const chunkLen = safeEnd - start + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${safeEnd}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkLen,
        'Content-Type': contentType,
        'Cache-Control': cacheControl
      });
      fs.createReadStream(filePath, { start, end: safeEnd }).pipe(res);
    } else {
      // Use in-memory file cache
      const cached = cache.getCachedFile(filePath);
      if (cached) {
        const acceptEncoding = req.headers['accept-encoding'] || '';
        const compressible = ['.html', '.css', '.js', '.json', '.svg'].includes(ext);
        
        if (compressible && acceptEncoding.includes('gzip')) {
          res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Encoding': 'gzip',
            'Accept-Ranges': 'bytes',
            'Cache-Control': cacheControl,
            'Vary': 'Accept-Encoding'
          });
          return res.end(cached.gzip);
        } else {
          res.writeHead(200, {
            'Content-Length': cached.raw.length,
            'Content-Type': contentType,
            'Accept-Ranges': 'bytes',
            'Cache-Control': cacheControl
          });
          return res.end(cached.raw);
        }
      }

      // Fallback if caching failed
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': cacheControl
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
}

function startServer() {
  const server = http.createServer((req, res) => {
    security.applySecurityHeaders(res);
    const urlPath = req.url.split('?')[0];

    // CORS check on API endpoints
    if (urlPath.startsWith('/api/') && !isOriginAllowed(req)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    // Routing
    if (contactRouter.handleRoute(req, res, urlPath)) return;
    if (bookingRouter.handleRoute(req, res, urlPath)) return;
    if (paymentRouter.handleRoute(req, res, urlPath)) return;

    // Legacy Redirects
    if (['/dashboard', '/dashboard.html', '/admin', '/admin.html'].includes(urlPath)) {
      res.writeHead(301, { 'Location': '/login' });
      return res.end();
    }

    if (urlPath === '/login') {
      res.writeHead(302, { 'Location': paymentRouter.clientPortalUrl() + '/login' });
      return res.end();
    }

    // Serve Statics
    handleStaticRequest(req, res, urlPath);
  });

  // Watch directories for live auto-invalidation
  cache.watchDirectory(path.join(ROOT, 'css'));
  cache.watchDirectory(path.join(ROOT, 'js'));
  cache.watchDirectory(ROOT);

  server.listen(PORT, '0.0.0.0', () => {
    logger.info(`Worker ${process.pid} listening on port ${PORT}`);
  });
}

// Production Clustering
if (cluster.isMaster && process.env.NODE_ENV === 'production') {
  const numCPUs = os.cpus().length;
  logger.info(`Master ${process.pid} starting ${numCPUs} workers...`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died. Forking replacement...`);
    cluster.fork();
  });
} else {
  startServer();
}
