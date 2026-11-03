// Typographie française appliquée au texte visible d'un document HTML
// (jamais dans <script>, <style>, <pre>, <code>, <textarea>, commentaires ni attributs) :
// espace fine insécable (U+202F) avant « : ; ? ! » et à l'intérieur des guillemets « »,
// guillemets anglais convertis en « », apostrophe droite en ’, heures « 18 h 30 » et « 24 h/24 »,
// majuscules de titres à l'anglaise ramenées à la seule initiale (liste TITLE_CASE).
// L'espace insécable U+00A0 avant € est conservée.
// Usage : import { typoHtml, typoText } from './typo-fr.mjs' (build-service-pages l'applique à chaque page).
const NNBSP = String.fromCharCode(0x202f);
const NBSP = String.fromCharCode(0x00a0);
const LDQ = String.fromCharCode(0x201c);
const RDQ = String.fromCharCode(0x201d);
const M0 = String.fromCharCode(0xe000);
const M1 = String.fromCharCode(0xe001);
const SP = `[ \\t${NBSP}${NNBSP}]*`;

// Expressions à majuscules de titre → forme française (initiale seule, noms propres conservés).
export const TITLE_CASE = [
  ['Pilote Automatique', 'Pilote automatique'],
  ['Site Vitrine', 'Site vitrine'],
  ['Site Complet', 'Site complet'],
  ['Page Essentielle', 'Page essentielle'],
  ['Réseaux Sociaux', 'Réseaux sociaux'],
  ['Identité visuelle et Logo', 'Identité visuelle et logo'],
  ['Identité Visuelle', 'Identité visuelle'],
  ['Pack Visuels et Reels Studio', 'Pack visuels et Reels studio'],
  ['Boutique en Ligne', 'Boutique en ligne'],
  ['Référencement Local', 'Référencement local'],
  ['Toilettage Animalier', 'Toilettage animalier'],
  ['Commerce Local', 'Commerce local'],
  ['Bureau d’Architecture', 'Bureau d’architecture'],
  ['Garage & Carrosserie', 'Garage & carrosserie'],
  ['Rénovation & Bâtiment', 'Rénovation & bâtiment'],
  ['Rénovation Intérieure', 'Rénovation intérieure'],
  ['Chauffage & Énergie', 'Chauffage & énergie'],
  ['Commerce & Décoration', 'Commerce & décoration'],
  ['Santé & Médical', 'Santé & médical'],
  ['Solution Digitale Métier', 'Solution digitale métier'],
  ['(E-commerce)', '(e-commerce)'],
  ['Sites Web & Référencement', 'Sites web & référencement'],
  ['Réseaux Sociaux & Image', 'Réseaux sociaux & image'],
  ['Sites Web', 'Sites web'],
  ['Diagnostic & Cadrage', 'Diagnostic & cadrage'],
  ['Sécurité & Fiabilité', 'Sécurité & fiabilité'],
  ['Artisan & Rénovation', 'Artisan & rénovation'],
  ['Restaurant & Commerce', 'Restaurant & commerce'],
  ['Boutique & Fiche Google', 'Boutique & fiche Google'],
  ['Tarifs Image', 'Tarifs image'],
  ['Tarifs Automatisation', 'Tarifs automatisation'],
  ['Brabant Wallon', 'Brabant wallon'],
  ['Région Wallonne', 'Région wallonne'],
  ['Espace Recrutement', 'Espace recrutement'],
  ['Freinage & Disques', 'Freinage & disques'],
  ['Cuisine & Séjour', 'Cuisine & séjour'],
  ['Suivi Réparation', 'Suivi réparation'],
  ['Soin Beauté', 'Soin beauté'],
  ['Installation Pompe', 'Installation pompe'],
  ['Dépannage Chauffage', 'Dépannage chauffage']
];
// Même liste avec l'esperluette encodée (&amp;) telle qu'elle apparaît dans le HTML.
const CASES = TITLE_CASE.flatMap(([a, b]) => a.includes('&') ? [[a, b], [a.replace('&', '&amp;'), b.replace('&', '&amp;')]] : [[a, b]]);

const RULES = [
  [/(\p{L})'(?=\p{L})/gu, '$1’'],
  [new RegExp(`${LDQ}${SP}`, 'g'), `«${NNBSP}`],
  [new RegExp(`${SP}${RDQ}`, 'g'), `${NNBSP}»`],
  [new RegExp(`«${SP}`, 'g'), `«${NNBSP}`],
  [new RegExp(`${SP}»`, 'g'), `${NNBSP}»`],
  [new RegExp(`[ \\t${NBSP}]+([;:!?])`, 'g'), `${NNBSP}$1`],
  [new RegExp(`(\\p{L}|\\))([;:!?])(?=[\\s${NBSP}»]|$)`, 'gu'), `$1${NNBSP}$2`],
  [/(?<![\p{L}\d.,])(\d{1,2})h(\d{2})(?![\p{L}\d])/gu, `$1${NBSP}h${NBSP}$2`],
  [/(?<![\p{L}\d.,])(\d{1,2})h(?![\p{L}\d])/gu, `$1${NBSP}h`]
];

export function typoText(s) {
  if (!s || !/[:;?!«»'h\p{Lu}]/u.test(s) && !s.includes(LDQ)) return s;
  for (const [a, b] of CASES) s = s.split(a).join(b);
  // Les entités HTML (&amp; &#39; …) sont masquées pour que leur « ; » ne reçoive pas d'espace.
  s = s.replace(/&nbsp;(?=[:;?!»])/g, NBSP).replace(/«&nbsp;/g, `«${NBSP}`).replace(/&#0?39;|&apos;/g, '’');
  const ents = [];
  s = s.replace(/&#?[a-zA-Z0-9]+;/g, (m) => { ents.push(m); return `${M0}${ents.length - 1}${M1}`; });
  for (const [re, to] of RULES) s = s.replace(re, to);
  return s.replace(new RegExp(`${M0}(\\d+)${M1}`, 'g'), (_, i) => ents[+i]);
}

const TOKEN = /(<!--[\s\S]*?-->|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<pre\b[\s\S]*?<\/pre>|<code\b[\s\S]*?<\/code>|<textarea\b[\s\S]*?<\/textarea>|<[^>]*>)/i;
export function typoHtml(html) {
  const parts = html.split(TOKEN);
  for (let i = 0; i < parts.length; i += 2) parts[i] = typoText(parts[i]);
  return parts.join('');
}

// Même typographie pour les textes d'un objet JSON-LD (FAQ, descriptions), pour qu'ils restent
// identiques au texte visible. Les URL, identifiants (@id, @type…) et dates ne sont pas touchés.
const RAW_KEYS = /^(@.*|url|item|image|logo|sameAs|email|telephone|openingHours|datePublished|dateModified|priceCurrency|billingDuration|availability)$/;
export function typoJson(v, key = '') {
  if (typeof v === 'string') return RAW_KEYS.test(key) || /^https?:/.test(v) ? v : typoText(v);
  if (Array.isArray(v)) return v.map(x => typoJson(x, key));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, typoJson(x, k)]));
  return v;
}
