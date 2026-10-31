import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';
import { services } from '../data/services.mjs';
import { resolveCleanRoute, isAllowedStaticPath } from '../api/security.mjs';

const root = new URL('..', import.meta.url);
const text = (file) => readFile(new URL(file, root), 'utf8');

test('le catalogue services contient 14 offres uniques et exhaustives', () => {
  assert.equal(services.length, 14);
  assert.equal(new Set(services.map(s => s.id)).size, 14);
  assert.equal(new Set(services.map(s => s.slug)).size, 14);

  for (const s of services) {
    assert.ok(s.deliverables.length >= 4, `${s.id} doit avoir au moins 4 livrables`);
    assert.ok(s.lossOfInaction.length >= 3, `${s.id} doit avoir au moins 3 points de perte/inaction`);
    assert.equal(s.howItWorks.length, 4, `${s.id} doit avoir 4 étapes`);
    assert.ok(s.faq.length >= 3, `${s.id} doit avoir au moins 3 questions FAQ`);
    assert.ok(s.targetAudience.length > 20);
    assert.ok(s.utility.length > 20);
  }
});

test('toutes les pages de détails de services et le hub sont générés et conformes', async () => {
  const hub = await text('services.html');
  assert.match(hub, /canonical" href="https:\/\/purity-agency\.be\/services"/);
  assert.match(hub, /Des solutions concrètes/);

  for (const s of services) {
    const detail = await text(`services/${s.slug}.html`);
    assert.match(detail, new RegExp(`canonical" href="https://purity-agency\\.be/services/${s.slug}"`));
    assert.match(detail, /"@type": "Service"/);
    assert.match(detail, /"@type": "BreadcrumbList"/);
    assert.match(detail, /"@type": "FAQPage"/);
    assert.match(detail, /sd-trust-strip/);
    assert.match(detail, /sd-comparison-table/);
    assert.match(detail, /sd-floating-bar/);
    assert.match(detail, /sd-deliverables-grid/);
    assert.match(detail, /Ce que vous perdez chaque mois sans cette solution/);
    await stat(new URL(`services/${s.slug}.html`, root));
  }
});

test('resolveCleanRoute et isAllowedStaticPath gèrent les URLs de services', () => {
  assert.equal(resolveCleanRoute('/services'), '/services.html');
  assert.equal(resolveCleanRoute('/services/'), '/services.html');
  assert.equal(resolveCleanRoute('/services/site-vitrine'), '/services/site-vitrine.html');
  assert.equal(resolveCleanRoute('/services/site-vitrine/'), '/services/site-vitrine.html');
  assert.equal(resolveCleanRoute('/services/gestion-reseaux-sociaux'), '/services/gestion-reseaux-sociaux.html');

  assert.equal(isAllowedStaticPath('/services.html'), true);
  assert.equal(isAllowedStaticPath('/services/site-vitrine.html'), true);
  assert.equal(isAllowedStaticPath('/services/invalid!'), false);
});

