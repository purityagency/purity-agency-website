// Carte de la Belgique (vrais contours Eurostat via geoBoundaries, CC BY 4.0).
// Écrit partials/visuals/carte-belgique.html et remplace la carte entre les
// marqueurs <!-- be-map:start --> / <!-- be-map:end --> des pages listées.
// Usage : node scripts/build-be-map.mjs
import fs from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rd = (p) => JSON.parse(fs.readFileSync(resolve(ROOT, p), 'utf8'));
const reg = rd('data/be-geo/regions.json');
const inner = rd('data/be-geo/provinces-lignes.json');

const C = Math.cos(50.5 * Math.PI / 180);
let mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9;
const pts = (g) => g.type === 'Polygon' ? g.coordinates.flat() : g.type === 'MultiPolygon' ? g.coordinates.flat(2) : g.type === 'LineString' ? g.coordinates : g.coordinates.flat();
reg.features.forEach((f) => pts(f.geometry).forEach(([x, y]) => { mnx = Math.min(mnx, x); mxx = Math.max(mxx, x); mny = Math.min(mny, y); mxy = Math.max(mxy, y); }));
const W = 800, PAD = 24, k = (W - 2 * PAD) / ((mxx - mnx) * C), H = Math.round((mxy - mny) * k + 2 * PAD);
const r1 = (v) => Math.round(v * 10) / 10;
const P = ([x, y]) => [r1((x - mnx) * C * k + PAD), r1((mxy - y) * k + PAD)];
const ring = (r) => { let s = '', prev; r.forEach((pt, i) => { const q = P(pt).join(' '); if (q === prev) return; s += (i ? 'L' : 'M') + q; prev = q; }); return s.replace(/ -/g, '-'); };
const poly = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates).map((p) => p.map((r) => ring(r) + 'Z').join('')).join('');
const line = (g) => (g.type === 'LineString' ? [g.coordinates] : g.coordinates).map(ring).join('');
const byReg = Object.fromEntries(reg.features.map((f) => [f.properties.reg, poly(f.geometry)]));
const inn = (inner.geometries || inner.features.map((f) => f.geometry)).map(line).join('');

// [classe, nom, lon, lat, dx, dy, ancre (s|e|m), mineur (masqué sur mobile), page ville]
const V = [
  ['charleroi', 'Charleroi', 4.444, 50.411, 0, 0, 'm', 0, '/agence-web/charleroi'],
  ['namur', 'Namur', 4.867, 50.467, 14, 5, 's', 0, '/agence-web/namur'],
  ['mons', 'Mons', 3.952, 50.454, -14, 5, 'e', 0, '/agence-web/mons'],
  ['louviere', 'La Louvière', 4.187, 50.480, -14, -8, 'e', 0, '/agence-web/la-louviere'],
  ['liege', 'Liège', 5.571, 50.633, 0, -16, 'm', 0, '/agence-web/liege'],
  ['wavre', 'Wavre', 4.612, 50.717, 14, 8, 's', 1, '/agence-web/brabant-wallon'],
  ['nivelles', 'Nivelles', 4.329, 50.598, -14, 5, 'e', 1, '/agence-web/brabant-wallon'],
  ['tournai', 'Tournai', 3.389, 50.606, -14, 5, 'e', 0],
  ['verviers', 'Verviers', 5.864, 50.590, 0, 24, 'm', 1],
  ['arlon', 'Arlon', 5.817, 49.683, -14, 5, 'e', 0],
  ['bruxelles', 'Bruxelles', 4.352, 50.847, -14, 5, 'e', 0],
  ['gand', 'Gand', 3.726, 51.054, 0, -16, 'm', 0],
  ['anvers', 'Anvers', 4.402, 51.219, 0, -16, 'm', 0],
  ['louvain', 'Louvain', 4.700, 50.880, 14, 5, 's', 1],
  ['bruges', 'Bruges', 3.225, 51.209, 0, -16, 'm', 0],
  ['hasselt', 'Hasselt', 5.338, 50.931, 0, -16, 'm', 0],
];

function build({ links = false, cls = 'be-map' } = {}) {
  const [cx, cy] = P([4.444, 50.411]);
  let arcs = '', pins = '';
  const wrap = (href, n, inner) => links && href ? `<a href="${href}" aria-label="Agence web : ${n}">${inner}</a>` : inner;
  V.forEach(([c, n, lo, la, dx, dy, a, minor, href], i) => {
    const [x, y] = P([lo, la]);
    if (c === 'charleroi') {
      pins += wrap(href, n, `<g class="bm-pin bm-hq"><circle class="bm-ring" cx="${x}" cy="${y}" r="26"/><circle class="bm-ring bm-ring2" cx="${x}" cy="${y}" r="26"/><circle class="bm-dot bm-dot--hq" cx="${x}" cy="${y}" r="26"/><image href="/assets/logo-mark.webp" x="${r1(x - 18)}" y="${r1(y - 18)}" width="36" height="36"/><text class="bm-lb bm-lb--hq" x="${x}" y="${r1(y + 50)}">Charleroi</text></g>`);
      return;
    }
    const mx = (cx + x) / 2, my = (cy + y) / 2 - Math.hypot(x - cx, y - cy) * 0.18;
    arcs += `<path class="bm-arc bm-d${i}" pathLength="1" d="M${cx} ${cy}Q${Math.round(mx)} ${Math.round(my)} ${x} ${y}"/>`;
    const anc = a === 'e' ? ' bm-end' : a === 'm' ? ' bm-mid' : '';
    pins += wrap(href, n, `<g class="bm-pin bm-d${i}"><circle class="bm-dot" cx="${x}" cy="${y}" r="13"/><image href="/assets/logo-mark.webp" x="${r1(x - 9)}" y="${r1(y - 9)}" width="18" height="18"/><text class="bm-lb${anc}${minor ? ' bm-minor' : ''}" x="${r1(x + dx)}" y="${r1(y + dy)}">${n}</text></g>`);
  });
  return `<figure class="${cls}" data-vz><svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="bm-t"><title id="bm-t">Carte de la Belgique : Purity Agency, basée à Charleroi, accompagne des entreprises en Wallonie, à Bruxelles et en Flandre.</title><path class="bm-fla" d="${byReg.fla}"/><path class="bm-wal" d="${byReg.wal}"/><path class="bm-inner" d="${inn}"/><path class="bm-bxl" d="${byReg.bru}"/><g class="bm-arcs">${arcs}</g>${pins}</svg></figure>`;
}

const PAGES = [
  ['index.html', { cls: 'be-map home-reach__map' }],
  ['agence-web/index.html', { links: true }],
  ['labo-visuels.html', {}],
];
fs.writeFileSync(resolve(ROOT, 'partials/visuals/carte-belgique.html'), build() + '\n');
for (const [file, opt] of PAGES) {
  const p = resolve(ROOT, file);
  const h = fs.readFileSync(p, 'utf8');
  const re = /<!-- be-map:start -->[\s\S]*?<!-- be-map:end -->/;
  if (!re.test(h)) { console.error('marqueurs absents :', file); process.exitCode = 1; continue; }
  fs.writeFileSync(p, h.replace(re, `<!-- be-map:start -->${build(opt)}<!-- be-map:end -->`));
  console.log('carte :', file);
}
