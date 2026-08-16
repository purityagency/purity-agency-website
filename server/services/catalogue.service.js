// Catalogue OctoMask — lit les VRAIS prix directement dans index.html (la
// même page que voit le client) au lieu d'un texte recopié à la main dans le
// prompt. Avant ce fichier, les deux divergeaient partout (ex: "Landing Page
// 390€" dans le prompt vs "Page Essentielle 490€" réellement affiché) — le
// chatbot pouvait annoncer un prix différent de celui du site. Le mtime de
// index.html sert de cache-buster : toute modif de prix se propage au
// prochain message sans redémarrer le serveur.
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const HTML_PATH = path.join(__dirname, '..', '..', 'index.html');

let cache = null;
let cacheMtimeMs = 0;

function clean(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

function parseCatalogue(html) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const briqueSections = [];
  doc.querySelectorAll('#pane-briques .brique-list').forEach((ul) => {
    const card = ul.closest('.brique-card');
    const h3 = card ? card.querySelector('h3') : null;
    const category = clean(h3 ? h3.textContent : '');
    if (!category) return;

    const items = [...ul.querySelectorAll(':scope > .brique-item')]
      .map((li) => {
        const name = clean(li.querySelector('.brique-name')?.textContent);
        const price = clean(li.querySelector('.brique-price')?.textContent);
        const desc = clean(li.querySelector('.brique-desc strong')?.textContent);
        if (!name || !price) return null;
        return desc ? `${name} (${price} — ${desc})` : `${name} (${price})`;
      })
      .filter(Boolean);

    if (items.length) briqueSections.push({ category, items });
  });

  const packs = [...doc.querySelectorAll('#pane-packs .brique-card')]
    .map((card) => {
      const tag = clean(card.querySelector('.brique-card__category')?.textContent);
      const name = clean(card.querySelector('h3')?.textContent);
      const target = clean(card.querySelector('.brique-card__header p')?.textContent);
      const items = [...card.querySelectorAll('.brique-item')]
        .map((li) => {
          const iname = clean(li.querySelector('.brique-name')?.textContent);
          const price = clean(li.querySelector('.brique-price')?.textContent);
          return iname && price ? `${iname} : ${price}` : null;
        })
        .filter(Boolean);
      return { tag, name, target, items };
    })
    .filter((p) => p.name && p.items.length);

  return { briqueSections, packs };
}

function render({ briqueSections, packs }) {
  let text = '1) Les Briques (Catalogue) :\n';
  for (const s of briqueSections) {
    text += `   - ${s.category} : ${s.items.join(', ')}.\n`;
  }
  text += '\n2) Les Packs Métier (Offres phares verticalisées) :\n';
  for (const p of packs) {
    const header = p.tag ? `${p.name} "${p.tag}"` : p.name;
    text += `   - ${header}${p.target ? ` (${p.target})` : ''} : ${p.items.join(', ')}.\n`;
  }
  return text.trim();
}

/** Texte prêt à injecter dans le prompt, garanti synchro avec index.html. */
function getCatalogueText() {
  let stat;
  try {
    stat = fs.statSync(HTML_PATH);
  } catch {
    return cache || ''; // page introuvable (déploiement partiel) : on garde le dernier cache connu
  }

  if (cache && stat.mtimeMs === cacheMtimeMs) return cache;

  try {
    const html = fs.readFileSync(HTML_PATH, 'utf8');
    const parsed = parseCatalogue(html);
    const text = render(parsed);
    if (text) {
      cache = text;
      cacheMtimeMs = stat.mtimeMs;
    }
    return cache || '';
  } catch (err) {
    return cache || ''; // parsing cassé : on ne fait jamais planter le chat pour ça
  }
}

module.exports = { getCatalogueText };
