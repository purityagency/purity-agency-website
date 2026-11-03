// Filet de sécurité du déploiement Render.
// GitHub oublie parfois de prévenir Render après un push : le site reste alors sur l'ancienne version.
// Lancé par .git/hooks/pre-push à chaque push sur main : attend 2 min, vérifie que Render a pris
// le commit poussé, et lance le déploiement lui-même sinon. Journal : .git/render-watch.log
// Usage manuel : node scripts/render-deploy-watch.mjs <sha> [--now]
// Installer le hook : node scripts/render-deploy-watch.mjs --install
import { spawn } from 'node:child_process';
import { appendFileSync, readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SERVICE = 'srv-d9ed8sr7uimc73fcrsj0';
const KEY_FILE = join(ROOT, '..', 'secrets', '.render-key');
const LOG = join(ROOT, '.git', 'render-watch.log');
const API = `https://api.render.com/v1/services/${SERVICE}/deploys`;
const DELAY_MS = 120_000;
const args = process.argv.slice(2);

const log = (msg) => { try { appendFileSync(LOG, `${new Date().toISOString()} ${msg}\n`); } catch { /* pas de journal */ } };

if (args[0] === '--install') {
  const hook = join(ROOT, '.git', 'hooks', 'pre-push');
  writeFileSync(hook, `#!/bin/sh
# Filet de sécurité Render (voir scripts/render-deploy-watch.mjs). Ne bloque jamais le push.
while read local_ref local_sha remote_ref remote_sha; do
  if [ "$remote_ref" = "refs/heads/main" ] && [ "$local_sha" != "0000000000000000000000000000000000000000" ]; then
    node "$(git rev-parse --show-toplevel)/scripts/render-deploy-watch.mjs" --spawn "$local_sha" >/dev/null 2>&1 || true
  fi
done
exit 0
`);
  try { chmodSync(hook, 0o755); } catch { /* Windows */ }
  console.log(`Hook installé : ${hook}`);
  process.exit(0);
}

if (args[0] === '--spawn') {
  // Détache le contrôle pour que le push se termine tout de suite.
  spawn(process.execPath, [fileURLToPath(import.meta.url), args[1]], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
  process.exit(0);
}

const sha = args[0];
if (!/^[0-9a-f]{7,40}$/.test(sha || '')) { console.error('Usage : node scripts/render-deploy-watch.mjs <sha> [--now]'); process.exit(1); }

let key;
try { key = readFileSync(KEY_FILE, 'utf8').trim(); } catch { log(`${sha.slice(0, 7)} clé Render introuvable (${KEY_FILE})`); process.exit(1); }
const headers = { Authorization: `Bearer ${key}`, Accept: 'application/json' };

if (!args.includes('--now')) await new Promise(r => setTimeout(r, DELAY_MS));

try {
  const deploys = await (await fetch(`${API}?limit=10`, { headers })).json();
  const short = sha.slice(0, 7);
  const hit = deploys.map(d => d.deploy).find(d => d.commit && d.commit.id.startsWith(sha));
  if (hit && !/failed|canceled|deactivated/.test(hit.status)) {
    log(`${short} pris en charge par Render (${hit.status}), rien à faire`);
  } else {
    // Render déploie toujours la tête de main : couvre aussi les commits poussés ensemble.
    const r = await fetch(API, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ clearCache: 'do_not_clear' }) });
    const d = await r.json();
    log(`${short} absent chez Render${hit ? ` (${hit.status})` : ''} : déploiement lancé -> HTTP ${r.status} ${d.status || ''} ${d.commit ? d.commit.id.slice(0, 7) : ''}`);
  }
} catch (e) {
  log(`${sha.slice(0, 7)} erreur : ${e.message}`);
  process.exit(1);
}
