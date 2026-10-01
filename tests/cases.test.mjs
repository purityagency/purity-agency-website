import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';
import { caseStudies } from '../data/case-studies.mjs';

const root = new URL('..', import.meta.url);
const text = (file) => readFile(new URL(file, root), 'utf8');

test('les douze cas sont uniques et possèdent un parcours complet', () => {
  assert.equal(caseStudies.length, 12);
  assert.equal(new Set(caseStudies.map((item) => item.id)).size, 12);
  caseStudies.forEach((item) => {
    assert.equal(item.features.length, 3);
    assert.equal(item.pages.length, 4);
    assert.ok(item.palette.length === 3);
  });
});

test('les pages indexables ont canonical et les démonstrations restent noindex', async () => {
  const gallery = await text('cas-concrets.html');
  assert.match(gallery, /canonical" href="https:\/\/purity-agency\.be\/cas-concrets\.html"/);
  for (const item of caseStudies) {
    const detail = await text(`cas-concrets/${item.id}.html`);
    assert.match(detail, new RegExp(`canonical" href="https://purity-agency\\.be/cas-concrets/${item.id}\\.html"`));
    assert.doesNotMatch(detail, /name="robots" content="noindex/);
    for (const page of ['index', 'services', 'univers', 'contact', 'studio']) {
      const demo = await text(`demos/${item.id}/${page}.html`);
      assert.match(demo, /name="robots" content="noindex, nofollow"/);
      assert.doesNotMatch(demo, /fetch\(|\/api\//);
    }
    await stat(new URL(`assets/cases/${item.id}-og.svg`, root));
    await stat(new URL(`assets/cases/visuals/${item.id}.png`, root));
  }
});

test('le contexte cas concret prévaut sur un brouillon OctoMask', async () => {
  const contact = await text('js/contact.js');
  assert.match(contact, /var caseLabels =/);
  assert.match(contact, /if \(caseId && caseLabels\[caseId\]\)/);
  assert.match(contact, /if \(!caseId && !offer && draft/);
});
