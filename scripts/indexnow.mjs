// Soumet toutes les URL du sitemap à IndexNow (Bing, Yandex, Seznam, Naver...).
// À lancer APRÈS déploiement (la clé doit répondre sur https://purity-agency.be/<clé>.txt).
// Usage : node scripts/indexnow.mjs [--dry]
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const HOST = 'purity-agency.be';
const KEY = 'edf646f8d9e4f3409422adab12ffa6d1';
const urls = [...readFileSync(ROOT + 'sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const body = { host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls };

if (process.argv.includes('--dry')) {
  console.log(JSON.stringify(body, null, 2));
} else {
  const check = await fetch(body.keyLocation);
  if (!check.ok || (await check.text()).trim() !== KEY) {
    console.error('Clé introuvable en ligne : déployer le site d\'abord.');
    process.exit(1);
  }
  const r = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body)
  });
  console.log(`IndexNow : HTTP ${r.status} pour ${urls.length} URL`, await r.text());
}
