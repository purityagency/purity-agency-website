import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

process.env.PURITY_NO_LISTEN = '1';
const { server } = await import('../server.mjs');
await new Promise(r => server.listen(0, '127.0.0.1', r));
const B = `http://127.0.0.1:${server.address().port}`;
test.after(() => server.close());
const get = (p, h = {}) => fetch(B + p, { redirect: 'manual', headers: h });

test('les .html à canonical propre redirigent en 301 direct', async () => {
  for (const [from, to] of [['/services/site-vitrine.html', '/services/site-vitrine'], ['/index.html', '/'], ['/agence-web/index.html', '/agence-web'], ['/agence-web-charleroi.html', '/agence-web/charleroi'], ['/contact.html', '/contact'], ['/blog.html', '/blog'], ['/cas-concrets.html', '/cas-concrets'], ['/cas-concrets/garage.html', '/cas-concrets/garage'], ['/article-seo-local-wallonie.html', '/article-seo-local-wallonie'], ['/liens.html', '/contact']]) {
    const r = await get(from);
    assert.equal(r.status, 301, from);
    assert.equal(r.headers.get('location'), to);
    assert.equal((await get(to)).status, 200, to);
  }
  assert.equal((await get('/contact.html?intent=rdv')).headers.get('location'), '/contact?intent=rdv');
});

test('HTML compressé brotli/gzip avec Vary, CSP conservée', async () => {
  const br = await get('/', { 'Accept-Encoding': 'br' });
  assert.equal(br.headers.get('content-encoding'), 'br');
  assert.equal(br.headers.get('vary'), 'Accept-Encoding');
  assert.ok(br.headers.get('content-security-policy'));
  const gz = await get('/', { 'Accept-Encoding': 'gzip' });
  assert.equal(gz.headers.get('content-encoding'), 'gzip');
  const r304 = await get('/', { 'If-None-Match': br.headers.get('etag') });
  assert.equal(r304.status, 304);
});

test('assets versionnés immuables, sitemap 200 et clé IndexNow servie', async () => {
  const css = await get('/css/app.css?v=20261104b');
  assert.match(css.headers.get('cache-control'), /immutable/);
  const sm = await readFile(new URL('../sitemap.xml', import.meta.url), 'utf8');
  for (const m of sm.matchAll(/<loc>https:\/\/purity-agency\.be([^<]*)<\/loc>/g)) {
    assert.equal((await get(m[1] || '/')).status, 200, m[1]);
  }
  const key = (await readFile(new URL('../scripts/indexnow.mjs', import.meta.url), 'utf8')).match(/KEY = '([0-9a-f]+)'/)[1];
  assert.equal((await (await get(`/${key}.txt`)).text()).trim(), key);
  const mf = await get('/site.webmanifest');
  assert.equal(mf.status, 200);
  assert.match(mf.headers.get('content-type'), /application\/manifest\+json/);
  assert.equal((await mf.json()).name, 'Purity Agency');
});

test('page À propos routée, pages légales en noindex et hors sitemap', async () => {
  assert.equal((await get('/a-propos')).status, 200);
  const r = await get('/a-propos.html');
  assert.equal(r.status, 301);
  assert.equal(r.headers.get('location'), '/a-propos');
  const sm = await readFile(new URL('../sitemap.xml', import.meta.url), 'utf8');
  assert.match(sm, /<loc>https:\/\/purity-agency\.be\/a-propos<\/loc>/);
  for (const p of ['legal', 'conditions-generales', 'confidentialite', 'cookies']) {
    assert.ok(!sm.includes(`/${p}.html<`), `${p} ne doit pas être dans le sitemap`);
    const html = await (await get(`/${p}`)).text();
    assert.match(html, /<meta name="robots" content="noindex,follow">/, p);
  }
});

test('une seule forme par URL : slash final et favicon.ico redirigés', async () => {
  for (const [from, to] of [['/blog/', '/blog'], ['/contact/', '/contact'], ['/agence-web/', '/agence-web'], ['/services/site-vitrine/', '/services/site-vitrine'], ['/site-internet', '/site-internet/'], ['/favicon.ico', '/assets/favicon-32.png']]) {
    const r = await get(from);
    assert.equal(r.status, 301, from);
    assert.equal(r.headers.get('location'), to, from);
  }
  assert.equal((await get('/site-internet/')).status, 200);
  assert.equal((await get('/')).status, 200);
});
