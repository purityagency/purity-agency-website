import { answerFor, objectionsFor, linksFor, commitmentAnswer, NOT_FOR, VISUALS, HUB_THUMB, photoImg, RESULT_PHOTO, weekImg, icon, SVG_VISUALS } from './service-page-extras.mjs';
import { renderHeader as renderSiteHeader, renderMenu, renderFooter as renderSiteFooter } from './site-chrome.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { services } from '../data/services.mjs';
import { caseById } from '../data/case-studies.mjs';
import { typoHtml, typoText, typoJson } from './typo-fr.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SERVICES_DIR = path.join(ROOT, 'services');
const CSS_VERSION = '20261106';
// Snippet SVG lu tel quel dans partials/visuals (pas d'include côté serveur).
const vzSnippet = name => fs.readFileSync(path.join(ROOT, 'partials', 'visuals', `${name}.html`), 'utf8').trim();
const VZ_ASSETS = `<link rel="stylesheet" href="/css/visuals.css?v=20261107">
<script src="/js/visuals.js?v=1" defer></script>
`;

if (!fs.existsSync(SERVICES_DIR)) {
  fs.mkdirSync(SERVICES_DIR, { recursive: true });
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
const e = escapeHtml;

// En-tête, menu et pied de page : source unique dans site-chrome.mjs.
function renderHeader(active = 'services') {
  return `${renderSiteHeader(active)}
${renderMenu(active)}`;
}
const renderFooter = renderSiteFooter;

const OG_IMAGE = `<meta property="og:image" content="https://purity-agency.be/assets/og-purity.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">`;
const VAT_NOTE = 'Prix nets · TVA non applicable (franchise, art. 56bis CTVA)';
const OFFER_NOTE = '-25 % si vous signez dans les 24 h après votre devis';
const PROMISE = 'Je vous réponds sous 24 h ouvrées';
const RDV_URL = '/contact?intent=rdv';

// Prix affiché = tarif réel ; la remise des 24 h n'est qu'une note conditionnelle.
const isFree = svc => !/[1-9]/.test(svc.priceSetup);
const displayPrice = svc => isFree(svc) ? (svc.promoSetup || 'Offert') : svc.priceSetup;
const cleanDelay = d => d.replace(/^Mise en place : /, '');
function offerNotes(svc) {
  if (isFree(svc) || !svc.promoTag) return [];
  const notes = [`${OFFER_NOTE}.`];
  if (!/25\s*%/.test(svc.promoTag)) notes.push(`${svc.promoTag}.`);
  return notes;
}

// Descriptions de 140 à 160 caractères, propres à chaque page (le résumé complet reste dans la page).
const tarif = s => `Tarif : ${s.priceSetup}${s.monthlyPrice ? ` + ${s.monthlyPrice}` : ''}.`;
const META_DESCRIPTIONS = {
  'diagnostic-digital': () => 'Diagnostic digital gratuit : 15 minutes par téléphone ou en visio avec Amir Kebiyeb pour repérer ce qui freine vos demandes et l’action la plus rentable.',
  'page-essentielle': s => `Page Essentielle pour artisans et indépendants : une page pro claire et rapide qui présente votre métier, contact en un clic. ${tarif(s)}`,
  'site-vitrine': s => `Site vitrine de 5 pages pour artisans et PME en Wallonie : prestations, réalisations avant/après et demande de devis. ${tarif(s)}`,
  'site-complet': s => `Site complet de plus de 10 pages pour PME multi-métiers : une page par service et par ville d’intervention en Wallonie. ${tarif(s)}`,
  'boutique-en-ligne': s => `Boutique en ligne pour commerçants et restaurateurs belges : paiement Bancontact, Payconiq et carte, retrait sur place. ${tarif(s)}`,
  'refonte-modernisation': s => `Refonte de votre site lent ou dépassé : chaque ancienne adresse est redirigée pour préserver votre référencement. ${tarif(s)}`,
  'google-business': s => `Fiche Google Business optimisée pour apparaître sur Google Maps quand un client cherche votre métier près de chez lui, en Wallonie. ${tarif(s)}`,
  'identite-visuelle-logo': s => `Logo et identité visuelle pour artisans, indépendants et commerces : une image nette, lisible sur camionnette, vêtements et devis. ${tarif(s)}`,
  'pack-visuels-reels': s => `Vos vidéos de chantier filmées au smartphone deviennent des Reels sous-titrés et des visuels prêts à publier sur Instagram et Facebook. ${tarif(s)}`,
  'referencement-local-seo': s => `Référencement local en Wallonie : être trouvé sur Google pour votre métier et votre commune, sans dépendre de la publicité. ${tarif(s)}`,
  'gestion-reseaux-sociaux': s => `Vos réseaux sociaux gérés : 3 vidéos courtes et 3 publications par semaine, sur les réseaux de votre choix. ${tarif(s)}`,
  'pilote-automatique-essentiel': s => `Une automatisation au choix : rappels SMS contre les rendez-vous manqués, relance des devis ou alerte devis urgent. ${tarif(s)}`,
  'pilote-automatique-business': s => `Formulaires, e-mails, planning et facturation reliés : chaque nouveau contact crée son dossier complet, sans double saisie. ${tarif(s)}`,
  'pilote-automatique-integral': s => `Assistant IA entraîné sur vos tarifs, vos zones et vos règles métier : il répond à vos clients le soir et le week-end. ${tarif(s)}`
};

// Title (< 60 car.) et H1 calés sur la requête : le mot-clé en tête, le nom du produit passe en kicker.
const SEO = {
  'diagnostic-digital': { title: () => 'Audit site internet gratuit en 15 min | Purity', h1: 'Audit gratuit de votre site et de votre visibilité en 15 minutes' },
  'page-essentielle': { title: s => `Site one-page pour artisan dès ${s.priceSetup} | Purity`, h1: 'Site one-page pour artisan et indépendant' },
  'site-vitrine': { title: s => `Création site vitrine Charleroi : ${s.priceSetup} | Purity`, h1: 'Création de site vitrine à Charleroi' },
  'site-complet': { title: s => `Site internet PME 10 pages et plus : ${s.priceSetup} | Purity`, h1: 'Site internet complet pour PME, 10 pages et plus' },
  'boutique-en-ligne': { title: s => `Création boutique en ligne Belgique : ${s.priceSetup} | Purity`, h1: 'Création de boutique en ligne en Belgique' },
  'refonte-modernisation': { title: s => `Refonte de site internet ${s.priceSetup} | Purity`, h1: 'Refonte de site internet lent ou dépassé' },
  'google-business': { title: s => `Optimisation fiche Google Business : ${s.priceSetup} | Purity`, h1: 'Optimisation de votre fiche Google Business' },
  'identite-visuelle-logo': { title: () => 'Logo et identité visuelle à Charleroi | Purity', h1: 'Création de logo et identité visuelle à Charleroi' },
  'pack-visuels-reels': { title: s => `Montage Reels et visuels pour PME : ${s.priceSetup} | Purity`, h1: 'Montage de Reels et visuels pour vos réseaux sociaux' },
  'referencement-local-seo': { title: () => 'Référencement local SEO en Wallonie | Purity', h1: 'Référencement local en Wallonie' },
  'gestion-reseaux-sociaux': { title: () => 'Gestion réseaux sociaux pour PME en Wallonie | Purity', h1: 'Gestion de réseaux sociaux pour PME en Wallonie' },
  'pilote-automatique-essentiel': { title: () => 'Automatisation PME : rappels et relance devis | Purity', h1: 'Automatisation pour PME : rappels SMS et relance des devis' },
  'pilote-automatique-business': { title: () => 'Automatisation PME : dossiers, planning, factures | Purity', h1: 'Automatisation pour PME : dossiers, planning et factures reliés' },
  'pilote-automatique-integral': { title: () => 'Assistant IA pour PME : réponses 24 h/24 | Purity', h1: 'Assistant IA pour PME qui répond à vos clients 24 h/24' }
};
// Prix en nombre pour le JSON-LD (« 1 490 € » → 1490, « 79 €/mois » → 79).
const amount = p => Number(String(p || '').replace(/[^0-9]/g, '')) || 0;
function offerSchema(service, url) {
  const offer = { "@type": "Offer", "price": String(amount(service.priceSetup)), "priceCurrency": "EUR", "availability": "https://schema.org/InStock", "url": url };
  if (service.monthlyPrice) {
    offer.priceSpecification = [
      { "@type": "UnitPriceSpecification", "name": "Création", "price": amount(service.priceSetup), "priceCurrency": "EUR" },
      { "@type": "UnitPriceSpecification", "name": "Suivi mensuel", "price": amount(service.monthlyPrice), "priceCurrency": "EUR", "billingDuration": "P1M", "unitText": "mois" }
    ];
  }
  return offer;
}
const WEBSITE_REF = { "@id": "https://purity-agency.be/#website" };

function metaDescriptionFor(service) {
  const build = META_DESCRIPTIONS[service.slug];
  const desc = build ? build(service) : service.headline;
  if (desc.length < 120 || desc.length > 154) console.warn(`Meta description hors 120-154 caractères (${desc.length}) : ${service.slug}`);
  return desc;
}

function headHtml({ pageTitle, metaDesc, canonicalUrl, schemaJson, vz = false }) {
  return `<!doctype html>
<html lang="fr-BE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(pageTitle)}</title>
<meta name="description" content="${e(metaDesc)}">
<link rel="canonical" href="${canonicalUrl}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_BE">
<meta property="og:title" content="${e(pageTitle)}">
<meta property="og:description" content="${e(metaDesc)}">
<meta property="og:url" content="${canonicalUrl}">
${OG_IMAGE}
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preload" as="font" type="font/woff2" href="/assets/GeneralSans-Variable.woff2" crossorigin>
<link rel="stylesheet" href="/css/app.css?v=20261105r">
<link rel="stylesheet" href="/css/menu.css?v=3">
<link rel="stylesheet" href="/css/service-detail.css?v=${CSS_VERSION}">
${vz ? VZ_ASSETS : ''}<script type="application/ld+json">
${JSON.stringify(typoJson(schemaJson), null, 2)}
</script>
</head>`;
}

// --------------------------------------------------------------------------
// Visuels du hero : captures réelles des démos Purity ou compositions HTML
// volontairement neutres (aucun avis, aucune note, aucun chiffre inventé).
// --------------------------------------------------------------------------
const shot = (demo, kind, i = 0) => `/assets/shots/${demo}-${kind}-${i}.webp`;
// srcset des captures (variante 720 px) et des visuels (variante 800 px) quand elle existe.
const respSet = (src, w, sizes) => {
  const small = /\/assets\/shots\/.*-desktop-\d\.webp$/.test(src) ? [src.replace(/\.webp$/, '-720.webp'), 720]
    : /^\/assets\/visuals\/.*\.webp$/.test(src) && !/-800\.webp$/.test(src) ? [src.replace(/\.webp$/, '-800.webp'), 800] : null;
  return small && fs.existsSync(path.join(ROOT, small[0])) ? ` srcset="${small[0]} ${small[1]}w, ${src} ${w}w" sizes="${sizes}"` : '';
};
// Démos « métier proche » sans celle déjà montrée dans le hero de la page.
const relOf = svc => (svc.relatedCases || []).filter(rc => rc.id !== VISUALS[svc.slug]?.hero?.demo);
const demoName = id => (caseById?.[id]?.name) || id;

function browserFrame(demo, label, alt, priority) {
  return `<div class="sd-browser">
          <div class="sd-browser__bar" aria-hidden="true"><i></i><i></i><i></i><span>${e(label)}</span></div>
          <img src="${shot(demo, 'desktop')}"${respSet(shot(demo, 'desktop'), 1440, '(max-width: 767px) 80vw, 480px')} width="1440" height="900" alt="${e(alt)}" decoding="async"${priority ? ' fetchpriority="high"' : ' loading="lazy"'}>
        </div>`;
}
function phoneFrame(demo, alt, extra = '') {
  return `<div class="sd-phone">
          <img src="${shot(demo, 'mobile')}" width="390" height="844" alt="${e(alt)}" decoding="async">${extra}
        </div>`;
}

function heroVisual(svc) {
  const v = VISUALS[svc.slug].hero;
  switch (v.type) {
    case 'device':
      return `<figure class="sd-stage sd-stage--device">
        ${browserFrame(v.demo, `Démo · ${v.name}`, `Accueil de la démo ${v.name} (${v.sector}) conçue par Purity, vue sur ordinateur`, true)}
        ${phoneFrame(v.demo, `La même démo ${v.name} sur téléphone`)}
        <figcaption>Démo conçue par Purity · <a href="/cas-concrets/${v.demo}">Tester ${e(v.name)}</a></figcaption>
      </figure>`;
    case 'beforeafter':
      return `<figure class="sd-stage sd-stage--ba">
        <div class="sd-ba">
          <div class="sd-ba__item sd-ba__item--before">
            <span class="sd-ba__tag">Avant</span>
            <img src="/assets/audit-compare/before-artisan.webp" width="820" height="612" alt="Exemple de site d’artisan daté : menu bleu, textes serrés, photos minuscules" decoding="async" fetchpriority="high">
          </div>
          <div class="sd-ba__item sd-ba__item--after">
            <span class="sd-ba__tag sd-ba__tag--accent">Après</span>
            ${browserFrame(v.demo, `Démo · ${v.name}`, `Accueil moderne de la démo ${v.name} conçue par Purity`, false).replace(' loading="lazy"', '')}
          </div>
        </div>
        <figcaption>Avant : exemple type de site daté. Après : <a href="/cas-concrets/${v.demo}">démo ${e(v.name)}</a> conçue par Purity.</figcaption>
      </figure>`;
    case 'audit':
      return `<figure class="sd-stage sd-stage--audit">
        <div class="sd-audit">
          <img src="/assets/audit-compare/before-resto.webp" width="820" height="612" alt="Exemple de site de restaurant daté : menu en PDF, horaires dans un tableau, numéro non cliquable" decoding="async" fetchpriority="high">
          <span class="sd-audit__pin sd-audit__pin--1" aria-hidden="true">1</span>
          <span class="sd-audit__pin sd-audit__pin--2" aria-hidden="true">2</span>
          <span class="sd-audit__pin sd-audit__pin--3" aria-hidden="true">3</span>
        </div>
        <ol class="sd-audit__legend">
          <li>Menu en PDF à télécharger</li>
          <li>Numéro non cliquable</li>
          <li>Horaires illisibles sur téléphone</li>
        </ol>
        <figcaption>Exemple type : ce qu’on repère ensemble en 15 minutes.</figcaption>
      </figure>`;
    case 'gbp':
      return `<figure class="sd-stage sd-stage--gbp">
        <div class="sd-gbp">
          <div class="sd-gbp__search">${icon('search')}<span>garage carrosserie charleroi</span></div>
          <div class="sd-gbp__map" aria-hidden="true"><i></i><i></i><i></i><span class="sd-gbp__marker">${icon('pin')}</span></div>
          <div class="sd-gbp__body">
            <strong class="sd-gbp__name">Votre entreprise</strong>
            <span class="sd-gbp__cat">Garage automobile · Charleroi</span>
            <span class="sd-gbp__open"><b>Ouvert</b> · horaires à jour</span>
            <div class="sd-gbp__actions" aria-hidden="true"><span>${icon('phone')}Appeler</span><span>${icon('route')}Itinéraire</span><span>${icon('globe')}Site web</span></div>
            <div class="sd-gbp__photos">
              <img src="/assets/cases/visuals/garage.webp" width="1200" height="800" alt="Photo d’atelier ajoutée à la fiche" decoding="async" fetchpriority="high">
            </div>
            <ul class="sd-gbp__chips" aria-label="Prestations listées"><li>Entretien</li><li>Carrosserie</li><li>Pneus</li><li>Diagnostic</li></ul>
          </div>
        </div>
        <figcaption>Aperçu illustratif d’une fiche complète. Les avis viendront de vos vrais clients.</figcaption>
      </figure>`;
    case 'serp':
      return `<figure class="sd-stage sd-stage--serp">
        <div class="sd-serp">
          <div class="sd-serp__search">${icon('search')}<span>chauffagiste charleroi</span></div>
          <div class="sd-serp__result sd-serp__result--you">
            <img src="${shot('chauffage', 'desktop')}"${respSet(shot('chauffage', 'desktop'), 1440, '(max-width: 767px) 92vw, 560px')} width="1440" height="900" alt="Page de la démo chauffagiste Thermiq" decoding="async" fetchpriority="high">
            <div>
              <span class="sd-serp__url">votre-site.be › chauffagiste-charleroi</span>
              <strong>Chauffagiste à Charleroi · Votre entreprise</strong>
              <span class="sd-serp__line"></span><span class="sd-serp__line sd-serp__line--short"></span>
            </div>
          </div>
          <div class="sd-serp__result" aria-hidden="true"><span class="sd-serp__ghost"></span><div><span class="sd-serp__line sd-serp__line--mid"></span><span class="sd-serp__line"></span><span class="sd-serp__line sd-serp__line--short"></span></div></div>
          <div class="sd-serp__result" aria-hidden="true"><span class="sd-serp__ghost"></span><div><span class="sd-serp__line sd-serp__line--mid"></span><span class="sd-serp__line"></span><span class="sd-serp__line sd-serp__line--short"></span></div></div>
        </div>
        <figcaption>Résultat illustratif : l’objectif, c’est cette ligne. Aucune position n’est garantie.</figcaption>
      </figure>`;
    case 'flow':
      return `<figure class="sd-stage sd-stage--flow">
        <ol class="sd-flow">
          ${v.steps.map(([ic, label], i) => `<li class="sd-flow__node"><span class="sd-flow__icon">${icon(ic)}</span><span class="sd-flow__label">${e(label)}</span><span class="sd-flow__num" aria-hidden="true">${i + 1}</span></li>`).join('\n          ')}
        </ol>
        <figcaption>${e(v.caption)}</figcaption>
      </figure>`;
    case 'phones':
      return `<figure class="sd-stage sd-stage--phones">
        <div class="sd-phones">
          ${v.demos.map((d, i) => `<div class="sd-phone sd-phone--reel">
            <img src="${shot(d, 'mobile')}" width="390" height="844" alt="Format vertical illustré avec la démo ${e(demoName(d))}" decoding="async"${i === 1 ? ' fetchpriority="high"' : ''}>
            <span class="sd-reel__play" aria-hidden="true">${icon('play')}</span>
            <span class="sd-reel__sub" aria-hidden="true">${e(v.captions[i])}</span>
          </div>`).join('\n          ')}
        </div>
        <figcaption>Formats illustrés avec les démos Purity : vertical, sous-titré, prêt à publier.</figcaption>
      </figure>`;
    case 'week': {
      const days = [['Lun', 'Vidéo', 'sport'], ['Mar', 'Post', 'restaurant'], ['Mer', 'Vidéo', 'beaute'], ['Jeu', 'Post', 'decoration'], ['Ven', 'Vidéo', 'garage'], ['Sam', 'Post', 'animaux']];
      return `<figure class="sd-stage sd-stage--week">
        <div class="sd-week">
          <div class="sd-week__head"><span>Planning de la semaine</span><span class="sd-week__ok">${icon('tick')}Validé</span></div>
          <ol class="sd-week__grid">
            ${days.map(([d, k, img], i) => `<li class="sd-week__day${k === 'Vidéo' ? ' is-video' : ''}"><span class="sd-week__d">${d}</span>${weekImg(img, i)}<span class="sd-week__k">${k === 'Vidéo' ? icon('play') : icon('image')}${k}</span></li>`).join('\n            ')}
            <li class="sd-week__day sd-week__day--off"><span class="sd-week__d">Dim</span><span class="sd-week__rest">Repos</span></li>
          </ol>
        </div>
        <figcaption>Semaine type : 3 vidéos et 3 publications, validées à l’avance.</figcaption>
      </figure>`;
    }
    case 'brands':
      return `<figure class="sd-stage sd-stage--brands">
        <div class="sd-brands">
          ${v.demos.map((d, i) => {
            const c = caseById[d];
            return `<a class="sd-brand sd-brand--${d}" href="/cas-concrets/${d}">
            <img src="${shot(d, 'mobile')}" width="390" height="844" alt="En-tête de la démo ${e(c.name)}" decoding="async"${i === 0 ? ' fetchpriority="high"' : ''}>
            <span class="sd-brand__name">${e(c.name)}</span>
            <span class="sd-brand__swatches" aria-hidden="true"><i></i><i></i><i></i></span>
          </a>`;
          }).join('\n          ')}
        </div>
        <figcaption>Identités créées pour nos démos par métier.</figcaption>
      </figure>`;
    case 'photo':
      return `<figure class="sd-stage sd-stage--photo">
        ${photoImg(v.id, { lazy: false, high: true, sizes: '(min-width: 1000px) 560px, 92vw' })}
      </figure>`;
    default:
      return '';
  }
}

// Bloc photo « au quotidien » (voir RESULT_PHOTO).
function resultSection(service) {
  const r = RESULT_PHOTO[service.slug];
  if (!r) return '';
  const svg = SVG_VISUALS[service.slug] && SVG_VISUALS[service.slug].result;
  return `<section class="sd-section sd-result" aria-labelledby="sd-result-title">
      <div class="sd-section-header">
        <span class="sd-kicker">Au quotidien</span>
        <h2 class="sd-heading" id="sd-result-title">Ce que ça change pour vous</h2>
      </div>
      <figure class="sd-result__fig${svg ? ' sd-result__fig--vz' : ''}">
        ${svg ? vzSnippet(svg) : photoImg(r.id, { sizes: '(min-width: 1000px) 560px, 92vw' })}
        <figcaption>${e(r.caption)}</figcaption>
      </figure>
    </section>

    `;
}

// --------------------------------------------------------------------------
// PAGE DÉTAIL
// --------------------------------------------------------------------------
function buildServiceDetailPage(service) {
  const canonicalUrl = `https://purity-agency.be/services/${service.slug}`;
  const plainName = service.name.replace(/\s*&\s*/g, ' et ');
  const seo = SEO[service.slug];
  const pageTitle = typoText(seo ? seo.title(service) : [' : tarif | Purity Agency', ' | Purity Agency'].map(x => plainName + x).find(t => t.length < 60));
  if (pageTitle.length >= 60) console.warn(`Title de 60 caractères ou plus (${pageTitle.length}) : ${service.slug}`);
  const h1 = seo ? seo.h1 : service.name;
  const allFaq = [...service.faq, ...objectionsFor(service)];
  const answer = answerFor(service);
  const metaDesc = metaDescriptionFor(service);
  const vis = VISUALS[service.slug];
  const free = isFree(service);

  const contactOfferUrl = service.id === 'M01' ? RDV_URL : `/contact?offer=${service.id}`;
  const primaryCtaText = service.id === 'M01' ? 'Réserver mon diagnostic gratuit' : 'Écrire à Amir';

  const schemaJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": pageTitle,
        "description": metaDesc,
        "url": canonicalUrl,
        "isPartOf": WEBSITE_REF
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://purity-agency.be/" },
          { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://purity-agency.be/services" },
          { "@type": "ListItem", "position": 3, "name": service.name, "item": canonicalUrl }
        ]
      },
      {
        "@type": "Service",
        "name": service.name,
        "description": service.summary,
        "provider": { "@id": "https://purity-agency.be/#business" },
        "areaServed": "Wallonie",
        "offers": offerSchema(service, canonicalUrl)
      },
      {
        "@type": "FAQPage",
        "mainEntity": allFaq.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
      }
    ]
  };

  const heroPrice = free
    ? `<div class="sd-hero__price"><strong>Gratuit</strong><span>15 min par téléphone ou en visio</span></div>`
    : `<div class="sd-hero__price"><strong>${e(service.priceSetup)}</strong><span>${service.monthlyPrice ? `+ ${e(service.monthlyPrice)} de suivi` : 'paiement unique'}</span></div>`;

  const heroChips = free
    ? [['clock', '15 min chrono'], ['users', 'Avec Amir, le fondateur'], ['file', 'Récap écrit après l’appel']]
    : [['clock', cleanDelay(service.delay)], ['users', 'Amir, de A à Z']];

  const notFor = NOT_FOR[service.slug];

  const priceCard = free
    ? `<div class="sd-offer__price">
          <span class="sd-offer__label">Ce que ça coûte</span>
          <strong class="sd-offer__amount">Gratuit</strong>
          <span class="sd-offer__sub">Aucun paiement, aucun engagement</span>
          <span class="sd-offer__note">Devis ferme seulement si vous le demandez</span>
        </div>`
    : `<div class="sd-offer__price">
          <span class="sd-offer__label">Mise en place</span>
          <strong class="sd-offer__amount">${e(displayPrice(service))}</strong>
          <span class="sd-offer__sub">${service.monthlyPrice ? `${e(service.priceSetup)} + ${e(service.monthlyPrice)} de suivi (${service.commitment && service.commitment.minMonths ? `${service.commitment.minMonths} mois` : 'résiliable chaque mois'})` : 'Paiement unique, sans abonnement'}</span>
          <span class="sd-offer__note">${e(VAT_NOTE)}</span>
          ${offerNotes(service).map(n => `<span class="sd-offer__promo">${e(n)}</span>`).join('\n          ')}
        </div>`;

  const offerSide = free
    ? [['phone', 'Par téléphone ou en visio', 'Un lien en un clic, rien à installer.'], ['file', 'Récapitulatif écrit', 'Les points faibles, la priorité, une fourchette de budget.']]
    : [
        ['refresh', service.monthlyPrice ? `Inclus dans le suivi (${service.monthlyPrice})` : 'Après la livraison', service.includedMaintenance],
        ['key', service.monthlyPrice && service.commitment && service.commitment.minMonths ? `Engagement de ${service.commitment.minMonths} mois` : (service.monthlyPrice ? 'Résiliable chaque mois' : 'Sans abonnement'), service.commitment ? service.commitment.text : '']
      ];

  return `${headHtml({ pageTitle, metaDesc, canonicalUrl, schemaJson, vz: Boolean(SVG_VISUALS[service.slug]) })}
<body class="service-page">
<a class="skip-link" href="#contenu">Aller au contenu</a>

${renderHeader('services')}

<main class="sd-main" id="contenu" tabindex="-1">
  <div class="sd-container">
    <nav class="sd-breadcrumbs" aria-label="Fil d'Ariane">
      <a href="/">Accueil</a>
      <span class="sd-breadcrumbs__sep">/</span>
      <a href="/services">Services</a>
      <span class="sd-breadcrumbs__sep">/</span>
      <span aria-current="page">${e(service.name)}</span>
    </nav>

    <section class="sd-hero sd-hero--split" aria-labelledby="service-title">
      <div class="sd-hero__text">
        <div class="sd-hero__pill">${e(service.name)}</div>
        <h1 class="sd-hero__title" id="service-title">${e(h1)}</h1>
        <p class="sd-hero__lead">${e(service.headline)}</p>
        ${heroPrice}
        <ul class="sd-hero__chips">
          ${heroChips.map(([ic, t]) => `<li>${icon(ic)}${e(t)}</li>`).join('\n          ')}
        </ul>
        <div class="sd-hero__actions">
          <a class="sd-btn-primary" href="${contactOfferUrl}">${primaryCtaText} <span class="sd-btn__ico" aria-hidden="true">→</span></a>
          ${service.id !== 'M01' ? `<a class="sd-btn-secondary" href="${RDV_URL}">Réserver mon diagnostic gratuit <span aria-hidden="true">→</span></a>` : ''}
        </div>
        <p class="sd-hero__promise">${icon('clock')}${PROMISE}</p>
        <div class="sd-trust-strip" aria-label="Garanties et réassurance">
          <span class="sd-trust-item">${icon('shield')}BCE &amp; TVA <strong>BE 1036.775.590</strong></span>
          <span class="sd-trust-item">${icon('pin')}Charleroi &amp; Wallonie</span>
        </div>
      </div>
      <div class="sd-hero__visual">
        ${heroVisual(service)}
      </div>
    </section>

    <section class="sd-section" aria-labelledby="sd-deliv-title">
      <div class="sd-section-header">
        <span class="sd-kicker">Ce que vous recevez</span>
        <h2 class="sd-heading" id="sd-deliv-title">Tout est livré, noir sur blanc</h2>
      </div>
      <ul class="sd-deliverables-grid">
        ${vis.tiles.map(([ic, label], i) => `<li class="sd-tile"><span class="sd-tile__icon">${icon(ic)}</span><span class="sd-tile__label">${e(label)}</span><span class="sd-tile__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span></li>`).join('\n        ')}
      </ul>
    </section>

    <section class="sd-section sd-section--vs" aria-labelledby="sd-vs-title">
      <div class="sd-section-header">
        <span class="sd-kicker">Pourquoi Purity</span>
        <h2 class="sd-heading" id="sd-vs-title">Avant, et avec Purity</h2>
      </div>
      <div class="sd-comparison-wrap">
        <table class="sd-comparison-table">
          <thead>
            <tr>
              <th scope="col" class="sd-col-aspect"><span class="sd-visually-hidden">Point</span></th>
              <th scope="col"><span class="sd-vs__h">${icon('cross')}Avant</span></th>
              <th scope="col" class="sd-col-purity"><span class="sd-vs__h">${icon('tick')}Avec Purity</span></th>
            </tr>
          </thead>
          <tbody>
            ${vis.vs.map(([o, p], i) => `<tr>
              <th scope="row" class="sd-col-aspect">${e(service.comparison[i].aspect)}</th>
              <td class="sd-col-others">${icon('cross')}<span>${e(o)}</span></td>
              <td class="sd-col-purity">${icon('tick')}<span>${e(p)}</span></td>
            </tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>
    </section>

    <section class="sd-section sd-loss" aria-labelledby="sd-loss-title">
      <div class="sd-loss__head">
        <h2 class="sd-heading" id="sd-loss-title">Ce que vous perdez chaque mois sans cette solution</h2>
      </div>
      <ol class="sd-loss__list">
        ${service.lossOfInaction.map((l, i) => `<li><span class="sd-loss__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span>${e(l.title)}</span></li>`).join('\n        ')}
      </ol>
    </section>

    <section class="sd-section" aria-labelledby="sd-steps-title">
      <div class="sd-section-header sd-section-header--row">
        <div>
          <span class="sd-kicker">Comment ça se passe</span>
          <h2 class="sd-heading" id="sd-steps-title">4 étapes, très peu de travail pour vous</h2>
        </div>
        <span class="sd-steps__delay">${icon('clock')}${free ? '15 min, au créneau choisi' : (/^Démarrage/.test(cleanDelay(service.delay)) ? e(cleanDelay(service.delay)) : `Livré en ${e(cleanDelay(service.delay))}`)}</span>
      </div>
      <ol class="sd-timeline">
        ${service.howItWorks.map(s => `<li class="sd-timeline__step"><span class="sd-timeline__num">${e(s.step)}</span><strong>${e(s.title)}</strong></li>`).join('\n        ')}
      </ol>${SVG_VISUALS[service.slug] && SVG_VISUALS[service.slug].steps ? `
      <div class="sd-vz-slot">
        ${vzSnippet(SVG_VISUALS[service.slug].steps)}
      </div>` : ''}
    </section>

    ${resultSection(service)}${relOf(service).length && !(RESULT_PHOTO[service.slug] && RESULT_PHOTO[service.slug].replaceCases) ? `<section class="sd-section" aria-labelledby="sd-cases-title">
      <div class="sd-section-header">
        <span class="sd-kicker">Démos par métier</span>
        <h2 class="sd-heading" id="sd-cases-title">Voyez le résultat sur un métier proche</h2>
        <p class="sd-subheading">Démos conçues par Purity, pas des sites de clients.</p>
      </div>
      <div class="sd-cases-grid${relOf(service).length === 1 ? ' sd-cases-grid--solo' : ''}">
        ${relOf(service).map(rc => `<a class="sd-case-card" href="/cas-concrets/${e(rc.id)}">
          <img src="${shot(rc.id, 'desktop')}"${respSet(shot(rc.id, 'desktop'), 1440, '(max-width: 767px) 92vw, 550px')} width="1440" height="900" alt="Accueil de la démo ${e(rc.name)}, ${e(rc.sector.toLowerCase())}" loading="lazy" decoding="async">
          <span class="sd-case-card__meta"><span class="sd-case-card__sector">${e(rc.sector)}</span><strong>${e(rc.name)}</strong></span>
          <span class="sd-case-card__cta">Tester la démo <span aria-hidden="true">→</span></span>
        </a>`).join('\n        ')}
      </div>
    </section>` : ''}

    <section class="sd-section" aria-labelledby="sd-offer-title">
      <div class="sd-section-header">
        <span class="sd-kicker">Le prix</span>
        <h2 class="sd-heading" id="sd-offer-title">Sans surprise : prix affichés, devis écrit</h2>
      </div>
      <div class="sd-offer">
        ${priceCard}
        <ul class="sd-offer__side">
          ${offerSide.map(([ic, t, d]) => `<li>${icon(ic)}<div><strong>${e(t)}</strong><p>${e(d)}</p></div></li>`).join('\n          ')}
        </ul>
      </div>
    </section>

    <section class="sd-section sd-faq" aria-labelledby="sd-faq-title">
      <div class="sd-faq__aside">
        <span class="sd-kicker">Transparence</span>
        <h2 class="sd-heading" id="sd-faq-title">Questions fréquentes</h2>
        <a class="sd-link-arrow" href="${RDV_URL}">Réserver mon diagnostic gratuit <span aria-hidden="true">→</span></a>
      </div>
      <div class="sd-faq-list">
        ${allFaq.map(item => `<details class="sd-faq-item">
          <summary>${e(item.q)}</summary>
          <div class="sd-faq-body"><p>${e(item.a)}</p></div>
        </details>`).join('\n        ')}
      </div>
    </section>

    <section class="sd-section sd-section--more" aria-label="Description détaillée">
      <details class="sd-more">
        <summary><span>En savoir plus sur ${e(service.name)}</span><span class="sd-more__hint">Détail complet</span></summary>
        <div class="sd-more__body">
          <p class="sd-more__lead">${e(answer)}</p>
          <p>${e(service.summary)}</p>
          <h3>Pour qui</h3>
          <p>${e(service.targetAudience)}</p>
          ${notFor ? `<h3>Ce n’est pas pour vous si</h3>
          <p>${e(notFor)}</p>` : ''}
          <h3>Ce que vous y gagnez</h3>
          <p>${e(service.utility)}</p>
          <h3>Le détail des livrables</h3>
          <dl>
            ${service.deliverables.map(d => `<dt>${e(d.title)}</dt><dd>${e(d.desc)}</dd>`).join('\n            ')}
          </dl>
          <h3>Le comparatif en détail</h3>
          <dl>
            ${service.comparison.map(c => `<dt>${e(c.aspect)}</dt><dd>Avant : ${e(c.others)}. Avec Purity : ${e(c.purity)}.</dd>`).join('\n            ')}
          </dl>
          <h3>Ce que l’inaction coûte</h3>
          <dl>
            ${service.lossOfInaction.map(l => `<dt>${e(l.title)}</dt><dd>${e(l.desc)}</dd>`).join('\n            ')}
          </dl>
          <h3>Les étapes</h3>
          <dl>
            ${service.howItWorks.map(s => `<dt>${e(s.step)} · ${e(s.title)}</dt><dd>${e(s.desc)}</dd>`).join('\n            ')}
          </dl>
          ${free ? '' : `<h3>Engagement</h3>
          <p>${e(commitmentAnswer(service))}</p>`}
        </div>
      </details>
    </section>

    <nav class="sd-section sd-section--links" aria-labelledby="sd-links-title">
      <h2 class="sd-mini-title" id="sd-links-title">Exemples par métier et guides utiles</h2>
      <ul class="sd-links">
        ${linksFor(service, e)}
      </ul>
    </nav>

    <section class="sd-bottom-cta" aria-labelledby="sd-cta-title">
      <div class="sd-bottom-cta__inner">
        <h2 id="sd-cta-title">On vérifie ensemble si c’est la bonne formule&nbsp;?</h2>
        <p>Vous parlez directement à Amir Kebiyeb. ${PROMISE}.</p>
        <div class="sd-bottom-cta__actions">
          <a class="sd-btn-primary" href="${contactOfferUrl}">${primaryCtaText} <span class="sd-btn__ico" aria-hidden="true">→</span></a>
          ${service.id !== 'M01' ? `<a class="sd-btn-secondary" href="${RDV_URL}">Réserver mon diagnostic gratuit <span aria-hidden="true">→</span></a>` : `<a class="sd-btn-secondary" href="/services">Voir les autres services <span aria-hidden="true">→</span></a>`}
        </div>
      </div>
    </section>
  </div>
</main>

<aside class="sd-floating-bar" aria-label="Action rapide">
  <div class="sd-floating-info">
    <span class="sd-floating-price">${e(displayPrice(service))}</span>
    <span class="sd-floating-note">${free ? e(service.promoTag || 'Sans engagement') : (service.monthlyPrice ? `+ ${e(service.monthlyPrice)} · prix net` : 'Paiement unique · prix net')}</span>
  </div>
  <a class="sd-floating-cta" href="${contactOfferUrl}">${service.id === 'M01' ? 'Réserver mon diagnostic gratuit' : 'Écrire à Amir'} <span aria-hidden="true">→</span></a>
</aside>

${renderFooter()}

<script src="/js/menu.js?v=20261105r" defer></script>
</body>
</html>`;
}

// --------------------------------------------------------------------------
// HUB /services
// --------------------------------------------------------------------------
function pillarTagOf(svc) {
  if (svc.pillar.includes('Pilier 02')) return 'pilier-2';
  if (svc.pillar.includes('Pilier 03')) return 'pilier-3';
  if (svc.pillar.includes('Pilier 04')) return 'pilier-4';
  return 'pilier-1';
}

function hubPriceHtml(svc) {
  if (isFree(svc)) return `<span class="sd-hub-card__price">Gratuit</span><span class="sd-hub-card__monthly">15 min, sans engagement</span>`;
  return `<span class="sd-hub-card__price">${e(svc.priceSetup)}</span><span class="sd-hub-card__monthly">${svc.monthlyPrice ? `+ ${e(svc.monthlyPrice)} de suivi` : 'paiement unique'}</span>`;
}

function buildServicesHubPage() {
  const canonicalUrl = `https://purity-agency.be/services`;
  const pageTitle = typoText(`Services et tarifs : sites, SEO et IA | Purity Agency`);
  const metaDesc = `Les 14 services de Purity Agency pour indépendants et PME en Wallonie : sites web, e-commerce, réseaux sociaux, automatisation et IA, prix affichés.`;

  const schemaJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": pageTitle,
        "description": metaDesc,
        "url": canonicalUrl,
        "isPartOf": WEBSITE_REF
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://purity-agency.be/" },
          { "@type": "ListItem", "position": 2, "name": "Services", "item": canonicalUrl }
        ]
      }
    ]
  };

  return `${headHtml({ pageTitle, metaDesc, canonicalUrl, schemaJson, vz: true })}
<body class="service-page">
<a class="skip-link" href="#contenu">Aller au contenu</a>

${renderHeader('services')}

<main class="sd-main" id="contenu" tabindex="-1">
  <div class="sd-container">
    <nav class="sd-breadcrumbs" aria-label="Fil d'Ariane">
      <a href="/">Accueil</a>
      <span class="sd-breadcrumbs__sep">/</span>
      <span aria-current="page">Services et tarifs</span>
    </nav>

    <section class="sd-hero sd-hero--hub" aria-labelledby="hub-title">
      <div class="sd-hub-hero">
        <div>
          <div class="sd-hero__pill">Services et prix 2026-2027</div>
          <h1 class="sd-hero__title" id="hub-title">Des solutions concrètes.<br>Des prix affichés.</h1>
        </div>
        <div class="sd-hub-hero__side">
          <p class="sd-hero__lead">Sites, fiche Google, réseaux et automatisation pour les indépendants et PME de Wallonie. Chaque prix est celui de votre devis.</p>
          <div class="sd-hero__actions">
            <a class="sd-btn-primary" href="${RDV_URL}">Réserver mon diagnostic gratuit <span class="sd-btn__ico" aria-hidden="true">→</span></a>
          </div>
          <p class="sd-hero__promise">${icon('clock')}${PROMISE}</p>
        </div>
      </div>
      <figure class="sd-hub-hero__photo">
        ${photoImg('service-hub-wallonie-hero', { lazy: false, high: true, sizes: '(min-width: 1240px) 1180px, 92vw' })}
      </figure>
      <div class="sd-trust-strip" aria-label="Garanties">
        <span class="sd-trust-item">${icon('shield')}Entreprise enregistrée BCE 1036.775.590</span>
        <span class="sd-trust-item">${icon('pin')}Charleroi · Namur · Mons · Liège · Wallonie</span>
      </div>

      <div class="sd-hub-filter-bar" role="group" aria-label="Filtrer les services par pilier">
        <button class="sd-hub-filter-btn is-active" type="button" data-filter="all" aria-pressed="true">Tous (14)</button>
        <button class="sd-hub-filter-btn" type="button" data-filter="pilier-1" aria-pressed="false">Sites &amp; référencement</button>
        <button class="sd-hub-filter-btn" type="button" data-filter="pilier-2" aria-pressed="false">Réseaux &amp; image</button>
        <button class="sd-hub-filter-btn" type="button" data-filter="pilier-3" aria-pressed="false">Automatisation &amp; IA</button>
        <button class="sd-hub-filter-btn" type="button" data-filter="pilier-4" aria-pressed="false">Diagnostic</button>
      </div>
    </section>

    <section class="sd-section sd-section--hub" aria-label="Tous les services">
      <p class="sd-hub-price-note">${VAT_NOTE}. ${OFFER_NOTE}.</p>
      <div class="sd-hub-grid" id="services-grid">
        ${services.map((svc, idx) => {
          const [, src, w, h, alt] = HUB_THUMB[svc.slug];
          const tall = h > w && !src.startsWith('/assets/visuals/');
          return `<article class="sd-hub-card" data-pillar="${pillarTagOf(svc)}">
          <div class="sd-hub-card__thumb${tall ? ' sd-hub-card__thumb--tall' : ''}">
            <img src="${src}"${respSet(src, w, '(max-width: 767px) 92vw, 380px')} width="${w}" height="${h}" alt="${e(alt)}" decoding="async" loading="lazy">
          </div>
          <div class="sd-hub-card__body">
            <span class="sd-hub-card__pillar">${e(svc.pillar.replace(/Pilier \d+ · /, ''))}</span>
            <h2 class="sd-hub-card__title"><a href="/services/${svc.slug}">${e(svc.name)}</a></h2>
            <p class="sd-hub-card__summary">${e(svc.headline)}</p>
            <div class="sd-hub-card__footer">
              <div class="sd-hub-card__price-wrap">
                ${hubPriceHtml(svc)}
                <span class="sd-hub-card__delay">${isFree(svc) ? 'Par téléphone ou en visio' : e(cleanDelay(svc.delay))}</span>
              </div>
              <span class="sd-hub-card__btn" aria-hidden="true">${icon('arrow')}</span>
            </div>
          </div>
        </article>`;
        }).join('\n        ')}
      </div>
    </section>

    <section class="sd-section sd-hub-steps" aria-label="Les étapes d’un projet">
      <div class="sd-vz-slot">
        ${vzSnippet('etapes-projet')}
      </div>
    </section>

    <section class="sd-section sd-section--more" aria-label="À propos des services">
      <details class="sd-more">
        <summary><span>En savoir plus sur nos services</span><span class="sd-more__hint">Comment on travaille</span></summary>
        <div class="sd-more__body">
          <p class="sd-more__lead">Purity Agency, agence web à Charleroi, crée des sites, des fiches Google, du contenu pour les réseaux et des automatisations pour les indépendants et PME de Wallonie. Chaque service affiche son prix, son délai et ses livrables. Vous ne savez pas lequel choisir ? Le diagnostic de 15 minutes est gratuit et sans engagement.</p>
          <p>Le prix affiché est le prix de départ. Le devis écrit le confirme avant tout paiement. Pour les sites, l’hébergement, la sécurité et les petites modifications sont compris dans le suivi mensuel.</p>
        </div>
      </details>
    </section>

    <section class="sd-bottom-cta" aria-labelledby="hub-cta-title">
      <div class="sd-bottom-cta__inner">
        <h2 id="hub-cta-title">Vous ne savez pas par quoi commencer&nbsp;?</h2>
        <p>15 minutes avec Amir. Il vous dit quel service vous sert vraiment, ou qu’aucun ne vous sert. ${PROMISE}.</p>
        <a class="sd-btn-primary" href="${RDV_URL}">Réserver mon diagnostic gratuit <span class="sd-btn__ico" aria-hidden="true">→</span></a>
      </div>
    </section>
  </div>
</main>

<script src="/js/services-hub.js?v=20261101" defer></script>

${renderFooter()}

<script src="/js/menu.js?v=20261105r" defer></script>
</body>
</html>`;
}

let count = 0;
for (const svc of services) {
  fs.writeFileSync(path.join(SERVICES_DIR, `${svc.slug}.html`), typoHtml(buildServiceDetailPage(svc)), 'utf8');
  count++;
}
console.log(`Generated ${count} individual service detail pages in services/*.html`);
fs.writeFileSync(path.join(ROOT, 'services.html'), typoHtml(buildServicesHubPage()), 'utf8');
console.log(`Generated services.html hub page at root`);
