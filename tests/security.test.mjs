import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractClientIp,
  verifySameOrigin,
  stripPrototypePollution,
  createRateLimiter,
  resolveLegacyRedirect,
  resolveCleanRoute,
  isAllowedStaticPath
} from '../api/security.mjs';
import { sendContact } from '../api/contact.mjs';
import { sessionFor } from '../api/chat.mjs';

process.env.PURITY_NO_LISTEN = '1';
const { server } = await import('../server.mjs');

async function withServer(fn) {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  try {
    await fn(baseUrl);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

test('security headers, CSP connect-src self, and RFC 9116 security.txt are enforced', async () => {
  await withServer(async baseUrl => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('strict-transport-security') || '', /max-age=63072000/);
    assert.equal(res.headers.get('x-frame-options'), 'DENY');
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(res.headers.get('cross-origin-opener-policy'), 'same-origin');
    const csp = res.headers.get('content-security-policy') || '';
    assert.match(csp, /connect-src 'self'/);
    assert.doesNotMatch(csp, /api\.resend\.com/);

    const secTxt = await fetch(`${baseUrl}/.well-known/security.txt`);
    assert.equal(secTxt.status, 200);
    assert.match(await secTxt.text(), /Contact: mailto:contact@purity-agency\.be/);
  });
});

test('legacy URLs redirect in 301 (trailing slash included) without loops', async () => {
  const expected = {
    '/tarifs': '/#services',
    '/tarifs/': '/#services',
    '/tarifs.html': '/#services',
    '/tarifs.html/': '/#services',
    '/services.html': '/services',
    '/services.html/': '/services',
    '/agence-web-charleroi.html': '/agence-web/charleroi',
    '/liens.html': '/contact'
  };
  for (const [from, to] of Object.entries(expected)) {
    assert.equal(resolveLegacyRedirect(from), to, from);
    assert.equal(resolveLegacyRedirect(new URL(to, 'http://x').pathname), null, `${to} must not redirect again`);
  }
  for (const live of ['/', '/services', '/services/', '/contact', '/services/site-vitrine']) {
    assert.equal(resolveLegacyRedirect(live), null, live);
  }

  await withServer(async baseUrl => {
    for (const [from, to] of Object.entries(expected)) {
      const res = await fetch(`${baseUrl}${from}`, { redirect: 'manual' });
      assert.equal(res.status, 301, from);
      assert.equal(res.headers.get('location'), to, from);
    }
    const hub = await fetch(`${baseUrl}/services`, { redirect: 'manual' });
    assert.equal(hub.status, 200);
    assert.match(await hub.text(), /canonical" href="https:\/\/purity-agency\.be\/services"/);
    const slash = await fetch(`${baseUrl}/services/`, { redirect: 'manual' });
    assert.equal(slash.status, 301);
    assert.equal(slash.headers.get('location'), '/services');
  });
});

test('client offers are no longer served on the main domain', async () => {
  assert.equal(isAllowedStaticPath('/offres/rdv/index.html'), false);
  assert.equal(isAllowedStaticPath('/offres/assets/logo-mail.png'), false);
  await withServer(async baseUrl => {
    for (const gone of ['/offres/fm-chauffage/', '/offres/rdv/', '/offres/fm-chauffage/index.html', '/offres/assets/logo-mail.png']) {
      const res = await fetch(`${baseUrl}${gone}`, { redirect: 'manual' });
      assert.equal(res.status, 404, gone);
    }
  });
});

test('cache policy: short cache for unversioned CSS/JS, immutable for ?v= assets, offers, no-cache for HTML', async () => {
  await withServer(async baseUrl => {
    for (const asset of ['/css/app.css', '/js/menu.js']) {
      const res = await fetch(`${baseUrl}${asset}`);
      assert.equal(res.status, 200, asset);
      assert.equal(res.headers.get('cache-control'), 'public, max-age=300, stale-while-revalidate=86400', asset);
      assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
      assert.ok(res.headers.get('etag'));
    }
    const versioned = await fetch(`${baseUrl}/css/app.css?v=20261104b`);
    assert.equal(versioned.headers.get('cache-control'), 'public, max-age=31536000, immutable');
    const html = await fetch(`${baseUrl}/contact`);
    assert.equal(html.status, 200);
    assert.equal(html.headers.get('cache-control'), 'no-cache');

    const offers = await fetch(`${baseUrl}/api/offers`);
    assert.equal(offers.status, 200);
    assert.equal(offers.headers.get('cache-control'), 'public, max-age=300');
    assert.match(offers.headers.get('content-security-policy') || '', /default-src 'self'/);
    assert.match(offers.headers.get('x-robots-tag') || '', /noindex/);
    assert.ok((await offers.json()).offers.length > 0);
  });
});

test('rate limiter never stores rejected hits, slides its window and caps tracked keys', () => {
  let t = 0;
  const limited = createRateLimiter({ windowMs: 1_000, max: 2, maxKeys: 3, now: () => t });
  assert.equal(limited('a'), false);
  assert.equal(limited('a'), false);
  t = 900;
  for (let i = 0; i < 50_000; i++) assert.equal(limited('a'), true);
  t = 1_000;
  assert.equal(limited('a'), true, 'previous window still weighs fully');
  t = 1_500;
  assert.equal(limited('a'), false, 'rejected flood must not extend the block');
  t = 3_600;
  assert.equal(limited('a'), false);
  assert.equal(limited('a'), false);
  assert.equal(limited('a'), true);

  t = 4_000;
  assert.equal(limited('b'), false);
  assert.equal(limited('b'), false);
  assert.equal(limited('b'), true);
  limited('c');
  limited('d');
  limited('e');
  assert.equal(limited('b'), false, 'oldest key evicted once maxKeys is reached');
});

test('static allowlist blocks source code, dotfiles, encoded traversal, and disallowed HTTP methods', async () => {
  assert.equal(isAllowedStaticPath('/server.mjs'), false);
  assert.equal(isAllowedStaticPath('/api/chat.mjs'), false);
  assert.equal(isAllowedStaticPath('/.env'), false);
  assert.equal(isAllowedStaticPath('/data/leads.log'), false);
  assert.equal(isAllowedStaticPath('/docs/OCTOMASK.md'), false);
  assert.equal(isAllowedStaticPath('/tarifs.html'), true);
  assert.equal(isAllowedStaticPath('/services.html'), true);
  assert.equal(isAllowedStaticPath('/services/site-vitrine.html'), true);
  assert.equal(resolveCleanRoute('/tarifs'), '/tarifs');
  assert.equal(resolveCleanRoute('/services'), '/services.html');
  assert.equal(resolveCleanRoute('/services/site-vitrine'), '/services/site-vitrine.html');
  assert.equal(resolveCleanRoute('/services/site-vitrine/'), '/services/site-vitrine.html');
  assert.equal(resolveCleanRoute('/contact/'), '/contact.html');
  assert.equal(resolveCleanRoute('//evil.com'), null);

  await withServer(async baseUrl => {
    for (const blocked of ['/server.mjs', '/api/chat.mjs', '/.env', '/package.json', '/..%2fpackage.json', '/api/unknown']) {
      const res = await fetch(`${baseUrl}${blocked}`);
      assert.ok([400, 404].includes(res.status), `${blocked} returned ${res.status}`);
      assert.match(res.headers.get('x-robots-tag') || '', /noindex/);
    }

    const postStatic = await fetch(`${baseUrl}/index.html`, { method: 'POST' });
    assert.equal(postStatic.status, 405);

    // Une URL encodee dans la query (cas de l'outil de diagnostic) ne doit pas etre rejetee.
    const encodedQuery = await fetch(`${baseUrl}/index.html?url=https%3A%2F%2Fexample.be%2F`);
    assert.equal(encodedQuery.status, 200);
    const encodedPath = await fetch(`${baseUrl}/js%2F..%2Fserver.mjs`);
    assert.equal(encodedPath.status, 400);
  });
});

test('CSRF origin check, prototype pollution guard, IP extraction, and honeypot work', async () => {
  assert.equal(
    verifySameOrigin({ headers: { host: 'purity-agency.be', origin: 'https://evil.example', 'sec-fetch-site': 'cross-site' } }),
    false
  );
  assert.equal(
    verifySameOrigin({ headers: { host: 'purity-agency.be', origin: 'https://purity-agency.be', 'sec-fetch-site': 'same-origin' } }),
    true
  );

  // Untrusted public peer cannot spoof X-Forwarded-For
  assert.equal(
    extractClientIp({ socket: { remoteAddress: '198.51.100.42' }, headers: { 'x-forwarded-for': '1.2.3.4' } }),
    '198.51.100.42'
  );
  // Trusted local reverse proxy forwards real client IP
  assert.equal(
    extractClientIp({ socket: { remoteAddress: '127.0.0.1' }, headers: { 'x-forwarded-for': '203.0.113.9, 10.0.0.1' } }),
    '203.0.113.9'
  );

  const polluted = JSON.parse('{"name":"Amir","__proto__":{"isAdmin":true},"constructor":{"prototype":{"pwned":true}}}');
  const sanitized = stripPrototypePollution(polluted);
  assert.equal(sanitized.name, 'Amir');
  assert.equal(({}).isAdmin, undefined);
  assert.equal(({}).pwned, undefined);

  let journalCalled = false;
  const botRes = await sendContact(
    { name: 'Bot', email: 'bot@example.com', message: 'Spam', website: 'https://spam.example' },
    { apiKey: 'test', journal: () => { journalCalled = true; } }
  );
  assert.deepEqual(botRes, { ok: true, saved: false, delivered: false });
  assert.equal(journalCalled, false);

  // Forged 48-hex octomask cookie without valid HMAC-SHA256 signature is rejected in constant time
  const forged = 'a'.repeat(48);
  const { id: realId } = sessionFor(`octomask=${forged}`);
  assert.notEqual(realId, forged);
  assert.equal(sessionFor(`octomask=${realId}`).id, realId);

  // Oversized body rejected cleanly with HTTP 413
  await withServer(async baseUrl => {
    const r = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'Origin': baseUrl,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'X'.repeat(25000) })
    });
    assert.equal(r.status, 413);
    const body = await r.json();
    assert.equal(body.reason, 'payload-too-large');
  });
});

