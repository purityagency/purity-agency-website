const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const env = require('../config/env');
const logger = require('../utils/logger');

const LOG_FILE = path.join(__dirname, '..', '..', 'sentinel.log');

function appendLog(level, message, details = {}) {
  const time = new Date().toISOString();
  const entry = `[${time}] [SENTINEL-${level}] ${message} ${Object.keys(details).length ? JSON.stringify(details) : ''}\n`;
  try {
    fs.appendFileSync(LOG_FILE, entry, 'utf8');
  } catch (e) {
    console.error('[sentinel] log write fail:', e.message);
  }
}

function getSystemMetrics() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memPercentage = ((usedMem / totalMem) * 100).toFixed(1);
  return {
    uptimeSeconds: Math.floor(process.uptime()),
    memory: {
      totalMb: Math.round(totalMem / (1024 * 1024)),
      usedMb: Math.round(usedMem / (1024 * 1024)),
      usagePercent: `${memPercentage}%`
    },
    nodeVersion: process.version,
    pid: process.pid
  };
}

function checkRoute(port, routePath) {
  return new Promise((resolve) => {
    const options = {
      hostname: '127.0.0.1',
      port: port,
      path: routePath,
      method: 'GET',
      timeout: 3000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          path: routePath,
          statusCode: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 400,
          bytes: data.length
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        path: routePath,
        statusCode: 0,
        ok: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        path: routePath,
        statusCode: 408,
        ok: false,
        error: 'Timeout (3s)'
      });
    });

    req.end();
  });
}

const https = require('https');

function pushTelemetryToPurityOS(auditResult) {
  const portalUrl = (process.env.CLIENT_PORTAL_URL || '').trim();
  const internalSecret = env.INTERNAL_API_SECRET;
  if (!portalUrl || !internalSecret) return;

  try {
    const endpoint = new URL('/api/internal/sentinel-log', portalUrl);
    const payload = JSON.stringify({
      source: 'purity-agency-website',
      audit: auditResult
    });
    const lib = endpoint.protocol === 'https:' ? https : http;

    const req = lib.request({
      method: 'POST',
      hostname: endpoint.hostname,
      port: endpoint.port || (endpoint.protocol === 'https:' ? 443 : 80),
      path: endpoint.pathname,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Authorization': `Bearer ${internalSecret}`
      }
    }, res => {
      res.on('data', () => {});
    });

    req.on('error', err => {
      // Telemetry push silent fail gracefully if Purity OS offline
    });

    req.write(payload);
    req.end();
  } catch (e) {
    // Ignore invalid portal URL
  }
}

async function runFullAudit(port = env.PORT) {
  const metrics = getSystemMetrics();
  const routesToProbe = ['/', '/api/health', '/blog.html', '/commande-confirmee.html', '/legal.html'];
  const probeResults = [];

  for (const route of routesToProbe) {
    const res = await checkRoute(port, route);
    probeResults.push(res);
  }

  const failedRoutes = probeResults.filter(r => !r.ok);
  const isHealthy = failedRoutes.length === 0;

  if (isHealthy) {
    appendLog('INFO', 'Audit complet réussi — 100% opérationnel', { metrics, testedRoutes: probeResults.length });
  } else {
    appendLog('ALERT', 'Anomalie détectée sur certaines routes', { failedRoutes, metrics });
    logger.error('[SENTINEL AGENT] Route probe failure:', failedRoutes);
  }

  const auditResult = {
    healthy: isHealthy,
    timestamp: new Date().toISOString(),
    metrics,
    probeResults,
    failedRoutes
  };

  pushTelemetryToPurityOS(auditResult);

  return auditResult;
}

let sentinelTimer = null;

function startSentinelAgent(port = env.PORT, intervalMs = 5 * 60 * 1000) {
  if (sentinelTimer) clearInterval(sentinelTimer);

  appendLog('INFO', `Agent Sentinel démarré (Fréquence: ${intervalMs / 1000}s, Port: ${port})`);
  
  // Exécution initiale immédiate après 2s (laisser le serveur démarrer)
  setTimeout(() => {
    runFullAudit(port).catch(err => appendLog('ERROR', 'Erreur audit initial', { error: err.message }));
  }, 2000);

  // Boucle récurrente
  sentinelTimer = setInterval(() => {
    runFullAudit(port).catch(err => appendLog('ERROR', 'Erreur audit récurrent', { error: err.message }));
  }, intervalMs);

  return sentinelTimer;
}

module.exports = {
  getSystemMetrics,
  runFullAudit,
  startSentinelAgent
};
