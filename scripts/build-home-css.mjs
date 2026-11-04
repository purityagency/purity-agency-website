// Fusionne les feuilles CSS de la home en css/home.bundle.css (une seule requete
// bloquante). Concatenation fidele dans l'ordre de cascade historique de index.html.
// Les anciens fichiers restent intacts (utilises par les autres pages).
// Usage : node scripts/build-home-css.mjs   (affiche le ?v= a mettre dans index.html)
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ORDER = ['app', 'menu', 'octomask', 'hero-video', 'site-additions', 'audit', 'audit-sites',
  'method', 'service-grid', 'service-experience', 'services-bg', 'be-map', 'home'];

// Reecrit les url() relatifs (ex. ../assets/x.webp, img/x.png) en chemins absolus du site.
function absolutize(css, fromDir) {
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, q, u) => {
    if (/^(data:|https?:|\/\/|\/|#)/.test(u)) return m;
    return `url(${q}${posix.normalize(posix.join(fromDir, u))}${q})`;
  });
}

// Inline recursivement les @import locaux.
function load(file, seen = new Set()) {
  const path = resolve(ROOT, file);
  if (seen.has(path)) return '';
  seen.add(path);
  const dir = posix.dirname('/' + file.split('\\').join('/'));
  let css = readFileSync(path, 'utf8');
  css = css.replace(/@import\s+(?:url\(\s*)?['"]?([^'")\s;]+)['"]?\s*\)?\s*;/g, (m, u) => {
    if (/^(https?:|\/\/)/.test(u)) return m;
    const target = u.startsWith('/') ? u.slice(1) : posix.join(dir.slice(1), u);
    return load(target, seen);
  });
  return absolutize(css, dir);
}

const parts = ORDER.map((n) => `/* ---- ${n}.css ---- */\n${load(`css/${n}.css`).trim()}\n`);
const out = parts.join('\n');
writeFileSync(resolve(ROOT, 'css/home.bundle.css'), out);
const v = createHash('sha1').update(out).digest('hex').slice(0, 8);
console.log(`css/home.bundle.css : ${Buffer.byteLength(out)} octets, v=${v}`);
