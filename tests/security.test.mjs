import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractClientIp,
  verifySameOrigin,
  stripPrototypePollution,
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

test('/tarifs.html and clean URL /tarifs serve the pricing page without redirecting away', async () => {
  await withServer(async baseUrl => {
    const r1 = await fetch(`${baseUrl}/tarifs.html`, { redirect: 'manual' });
    assert.equal(r1.status, 200);
    const html = await r1.text();
    assert.match(html, /pricing-catalog/);

    const r2 = await fetch(`${baseUrl}/tarifs`, { redirect: 'manual' });
    assert.equal(r2.status, 200);
  });
});

test('static allowlist blocks source code, dotfiles, encoded traversal, and disallowed HTTP methods', async () => {
  assert.equal(isAllowedStaticPath('/server.mjs'), false);
  assert.equal(isAllowedStaticPath('/api/chat.mjs'), false);
  assert.equal(isAllowedStaticPath('/.env'), false);
  assert.equal(isAllowedStaticPath('/data/leads.log'), false);
  assert.equal(isAllowedStaticPath('/docs/OCTOMASK.md'), false);
  assert.equal(isAllowedStaticPath('/tarifs.html'), true);
  assert.equal(resolveCleanRoute('/tarifs'), '/tarifs.html');
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
});

