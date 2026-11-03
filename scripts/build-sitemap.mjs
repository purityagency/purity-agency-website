// Génère sitemap.xml depuis les pages HTML indexables (canonical = URL servie, pas de noindex).
// lastmod = date réelle du fichier : dernier commit git s'il est propre, sinon date de modification (mtime). Usage : node scripts/build-sitemap.mjs
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const ORIGIN = 'https://purity-agency.be';
const DIRS = ['', 'services', 'agence-web', 'site-internet', 'cas-concrets'];
const EXCLUDE = new Set(['404.html']);
// Pages légales : jamais dans le sitemap, et elles doivent porter <meta robots noindex,follow>.
// Le script s'arrête si l'une d'elles redevient indexable, pour que la règle tienne.
const LEGAL_NOINDEX = ['legal.html', 'conditions-generales.html', 'confidentialite.html', 'cookies.html'];
for (const name of LEGAL_NOINDEX) {
  EXCLUDE.add(name);
  const html = readFileSync(join(ROOT, name), 'utf8');
  if (!/<meta[^>]+name=["']robots["'][^>]*content=["']noindex,follow["']/i.test(html)) {
    console.error(`${name} doit contenir <meta name="robots" content="noindex,follow">`);
    process.exit(1);
  }
}

function lastmod(file) {
  try {
    const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], { cwd: ROOT, encoding: 'utf8' }).trim();
    const dirty = execFileSync('git', ['status', '--porcelain', '--', file], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (iso && !dirty) return iso.slice(0, 10);
  } catch { /* pas de git */ }
  return statSync(join(ROOT, file)).mtime.toISOString().slice(0, 10);
}

export function collectPages() {
  const pages = [];
  for (const dir of DIRS) {
    for (const name of readdirSync(join(ROOT, dir))) {
      if (!name.endsWith('.html') || EXCLUDE.has(name) || /^google[0-9a-f]+\.html$/.test(name)) continue;
      const rel = dir ? `${dir}/${name}` : name;
      const html = readFileSync(join(ROOT, rel), 'utf8');
      if (/<meta[^>]+name=["']robots["'][^>]*noindex/i.test(html)) continue;
      const m = /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i.exec(html);
      if (!m || !m[1].startsWith(ORIGIN)) continue;
      pages.push({ file: rel, loc: m[1], lastmod: lastmod(rel) });
    }
  }
  const prio = (l) => l === `${ORIGIN}/` ? 0 : /\/services|\/agence-web|\/site-internet/.test(l) ? 1 : /contact/.test(l) ? 2 : /cas-concrets/.test(l) ? 3 : 4;
  return [...new Map(pages.map(p => [p.loc, p])).values()].sort((a, b) => prio(a.loc) - prio(b.loc) || a.loc.localeCompare(b.loc));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const pages = collectPages();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `  <url><loc>${p.loc}</loc><lastmod>${p.lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`;
  writeFileSync(join(ROOT, 'sitemap.xml'), xml);
  console.log(`sitemap.xml : ${pages.length} URL`);
}
