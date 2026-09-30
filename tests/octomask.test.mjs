import test from 'node:test';
import assert from 'node:assert/strict';
import { chat, sessionFor, clearSession, validateReply } from '../api/chat.mjs';
import { sendContact } from '../api/contact.mjs';
import { isPublicAddress, normaliseUrl } from '../api/audit.mjs';

const valid = { reply: 'Pour une présentation en cinq pages, le Site Vitrine est pertinent. Avez-vous déjà un site ?', offerIds: ['M04'], suggestions: ['Oui', 'Pas encore'], action: 'none' };
const provider = output => async () => ({ ok: true, json: async () => ({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify(output) }] } }] }) });
test('prices come from the catalogue including required monthly maintenance', () => {
  const result = validateReply(valid);
  assert.equal(result.offers[0].price, '1 490 € + 79 €/mois');
  assert.throws(() => validateReply({ ...valid, reply: 'Le site coûte 12 €.' }));
  assert.throws(() => validateReply({ ...valid, offerIds: ['FREE'] }));
});
test('rejects malformed output, unapproved navigation and false confirmations', () => {
  for (const reply of ['', 'https://evil.example', 'Votre rendez-vous est confirmé.', 'J’ai envoyé votre demande.']) {
    assert.throws(() => validateReply({ ...valid, reply }));
  }
  assert.throws(() => validateReply({ ...valid, action: 'send_email' }));
});
test('server owns history and keeps a bounded multi-turn context', async () => {
  const { id, session } = sessionFor();
  assert.equal(sessionFor(`octomask=${id}`).session, session);
  for (let i = 0; i < 12; i++) {
    assert.equal((await chat(session, `Question ${i}`, { apiKey: 'test', fetcher: provider(valid) })).status, 200);
  }
  assert.equal(session.messages.length, 20);
  clearSession(id);
  assert.notEqual(sessionFor(`octomask=${id}`).id, id);
});
test('failure does not poison history, releases lock and is retryable', async () => {
  const session = { messages: [], busy: false };
  const broken = await chat(session, 'Prix ?', { apiKey: 'test', fetcher: async () => { throw new Error('offline'); } });
  assert.equal(broken.status, 503);
  assert.equal(session.busy, false);
  assert.equal(session.messages.length, 0);
  assert.equal((await chat(session, 'Prix ?', { apiKey: 'test', fetcher: provider(valid) })).status, 200);
});
test('missing credentials, invalid messages and concurrent turns fail safely', async () => {
  assert.equal((await chat({ messages: [] }, 'Bonjour', { apiKey: '' })).status, 503);
  assert.equal((await chat({}, 'a'.repeat(1801), { apiKey: 'test' })).status, 400);
  assert.equal((await chat({ busy: true }, 'Bonjour', { apiKey: 'test' })).status, 409);
});
test('invalid model price gets one repair attempt before display', async () => {
  let calls = 0;
  const fetcher = async () => provider(++calls === 1 ? { ...valid, reply: 'Prix : 1 €.' } : valid)();
  const result = await chat({ messages: [], busy: false }, 'Prix ?', { apiKey: 'test', fetcher });
  assert.equal(calls, 2);
  assert.equal(result.status, 200);
  assert.equal(result.offers[0].price, '1 490 € + 79 €/mois');
});
test('contact never claims success if neither journal nor email succeeds', async () => {
  const lead = { name: 'Test', email: 'synthetic@example.com', message: 'Synthetic test only' };
  const fail = () => { throw new Error('unavailable'); };
  assert.deepEqual(await sendContact(lead, { apiKey: '', journal: fail }), { ok: false, saved: false, delivered: false });
  assert.deepEqual(await sendContact(lead, { apiKey: '', journal: () => {} }), { ok: true, saved: true, delivered: false });
  assert.deepEqual(await sendContact(lead, { apiKey: 'test', journal: fail, fetcher: async () => ({ ok: true }) }), { ok: true, saved: false, delivered: true });
  assert.deepEqual(await sendContact(lead, { apiKey: 'test', journal: fail, fetcher: fail }), { ok: false, saved: false, delivered: false });
});
test('public audit rejects unsafe protocols, credentials, ports and private addresses', () => {
  assert.equal(normaliseUrl('file:///etc/passwd'), null);
  assert.equal(normaliseUrl('https://user:pass@example.com'), null);
  assert.equal(normaliseUrl('https://example.com:8080'), null);
  for (const address of ['127.0.0.1', '10.0.0.1', '169.254.169.254', '172.16.0.1', '192.168.1.1', '::1', 'fc00::1', 'fe80::1', '::ffff:127.0.0.1']) {
    assert.equal(isPublicAddress(address), false, address);
  }
  for (const address of ['8.8.8.8', '1.1.1.1', '2606:4700:4700::1111']) {
    assert.equal(isPublicAddress(address), true, address);
  }
});
