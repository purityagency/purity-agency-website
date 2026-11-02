import { answerFor, objectionsFor, linksFor, notForHtml } from './service-page-extras.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { services } from '../data/services.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SERVICES_DIR = path.join(ROOT, 'services');

if (!fs.existsSync(SERVICES_DIR)) {
  fs.mkdirSync(SERVICES_DIR, { recursive: true });
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function renderHeader(activePage = 'services') {
  return `<header class="header">
  <a class="header__brand" href="/">
    <img src="/assets/logo-mark.webp" alt="" aria-hidden="true" width="26" height="26">
    <span>Purity Agency</span>
  </a>
  <nav class="header__nav" aria-label="Principal">
    <a href="/services" ${activePage === 'services' ? 'aria-current="page"' : ''}>Services &amp; Tarifs</a>
    <a href="/cas-concrets.html">Nos réalisations</a>
    <a href="/blog.html">Blog</a>
    <a href="/contact.html">Contact</a>
  </nav>
  <button class="burger" type="button" command="toggle-popover" commandfor="menu" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu">
    <span class="burger__box" aria-hidden="true"><span class="burger__bar"></span><span class="burger__bar"></span></span>
  </button>
</header>
<div id="menu" popover="auto" class="menu" aria-label="Menu">
  <div class="menu__top">
    <span class="menu__brand">
      <img src="/assets/logo-mark.webp" alt="" aria-hidden="true" width="24" height="24">
      <span>Purity Agency</span>
    </span>
    <button class="burger burger--close" type="button" command="hide-popover" commandfor="menu" aria-label="Fermer le menu">
      <span class="burger__box" aria-hidden="true"><span class="burger__bar"></span><span class="burger__bar"></span></span>
    </button>
  </div>
  <nav class="menu__nav">
    <a href="/services" style="--i:0">Services &amp; Tarifs</a>
    <a href="/cas-concrets.html" style="--i:1">Nos réalisations</a>
    <a href="/blog.html" style="--i:2">Blog</a>
    <a href="/contact.html" style="--i:3">Contact</a>
  </nav>
</div>`;
}

function renderFooter() {
  return `<footer class="site-footer">
  <div class="site-footer__inner">
    <div>
      <a class="site-footer__brand" href="/">
        <img src="/assets/logo-mark.webp" alt="" width="32" height="32">
        Purity Agency
      </a>
      <p>Modernisation, optimisation et solutions digitales pour les indépendants et PME.</p>
    </div>
    <nav aria-label="Navigation de pied de page">
      <h2>Explorer</h2>
      <a href="/services">Services &amp; Tarifs</a>
      <a href="/cas-concrets.html">Nos réalisations</a>
      <a href="/blog.html">Blog</a>
      <a href="/contact.html">Contact</a>
    </nav>
    <div>
      <h2>Parlons-en</h2>
      <a href="mailto:contact@purity-agency.be">contact@purity-agency.be</a>
    </div>
  </div>
  <div class="site-footer__legal">
    <span>Purity Agency · Boulevard Frans Dewandre 14, 6000 Charleroi</span>
    <span>BCE 1036.775.590 · TVA BE 1036.775.590 · Franchise TVA, art. 56bis CTVA</span>
    <span><a href="/legal.html">Mentions légales</a> · <a href="/confidentialite.html">Confidentialité</a> · <a href="/cookies.html">Cookies</a></span>
  </div>
</footer>`;
}

const OG_IMAGE = `<meta property="og:image" content="https://purity-agency.be/assets/og-purity.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">`;
const VAT_NOTE = 'Prix nets · TVA non applicable (franchise, art. 56bis CTVA)';
const OFFER_NOTE = '-25 % sur la création si vous validez dans les 24 h suivant votre devis';

// Prix affiché = tarif réel ; la remise des 24 h n'est qu'une note conditionnelle.
const isFree = svc => !/[1-9]/.test(svc.priceSetup);
const displayPrice = svc => isFree(svc) ? (svc.promoSetup || 'Offert') : svc.priceSetup;
function offerNotes(svc) {
  if (isFree(svc) || !svc.promoTag) return [];
  const notes = [`${OFFER_NOTE}.`];
  if (!/25\s*%/.test(svc.promoTag)) notes.push(`${svc.promoTag}.`);
  return notes;
}

// Descriptions de 140 à 160 caractères, propres à chaque page (le résumé complet reste dans la page).
const tarif = s => `Tarif : ${s.priceSetup}${s.monthlyPrice ? ` + ${s.monthlyPrice}` : ''}.`;
const META_DESCRIPTIONS = {
  'diagnostic-digital': () => 'Diagnostic digital offert : 15 minutes en visio avec Amir Kebiyeb pour repérer ce qui freine vos demandes de devis et l’action la plus rentable à lancer.',
  'page-essentielle': s => `Page Essentielle pour artisans et indépendants : une page pro claire et rapide qui présente votre métier, contact en un clic. ${tarif(s)}`,
  'site-vitrine': s => `Site vitrine de 5 pages pour artisans et PME en Wallonie : prestations, réalisations avant/après et demande de devis. ${tarif(s)}`,
  'site-complet': s => `Site complet de plus de 10 pages pour PME multi-métiers : une page par service et par ville d’intervention en Wallonie. ${tarif(s)}`,
  'boutique-en-ligne': s => `Boutique en ligne pour commerçants et restaurateurs belges : paiement Bancontact, Payconiq et carte, retrait sur place. ${tarif(s)}`,
  'refonte-modernisation': s => `Refonte de votre site lent ou dépassé : reconstruction complète sans perdre vos adresses ni votre positionnement Google. ${tarif(s)}`,
  'google-business': s => `Fiche Google Business optimisée pour apparaître sur Google Maps quand un client cherche votre métier près de chez lui, en Wallonie. ${tarif(s)}`,
  'identite-visuelle-logo': s => `Logo et identité visuelle pour artisans, indépendants et commerces : une image nette, lisible sur camionnette, vêtements et devis. ${tarif(s)}`,
  'pack-visuels-reels': s => `Vos vidéos de chantier filmées au smartphone deviennent des Reels sous-titrés et des visuels prêts à publier sur Instagram et Facebook. ${tarif(s)}`,
  'referencement-local-seo': s => `Référencement local en Wallonie : être trouvé sur Google pour votre métier et votre commune, sans dépendre de la publicité. ${tarif(s)}`,
  'gestion-reseaux-sociaux': s => `Vos réseaux sociaux gérés : 3 vidéos courtes et 3 publications par semaine, sur les réseaux de votre choix. ${tarif(s)}`,
  'pilote-automatique-essentiel': s => `Une automatisation au choix : rappels SMS contre les rendez-vous manqués, relance des devis ou alerte devis urgent. ${tarif(s)}`,
  'pilote-automatique-business': s => `Formulaires, e-mails, planning et facturation reliés : chaque nouveau contact crée son dossier complet, sans double saisie. ${tarif(s)}`,
  'pilote-automatique-integral': s => `Assistant IA entraîné sur vos tarifs, vos zones et vos règles métier : il répond à vos clients le soir et le week-end. ${tarif(s)}`
};

function metaDescriptionFor(service) {
  const build = META_DESCRIPTIONS[service.slug];
  const desc = build ? build(service) : service.headline;
  if (desc.length < 120 || desc.length > 154) console.warn(`Meta description hors 120-154 caractères (${desc.length}) : ${service.slug}`);
  return desc;
}

function buildServiceDetailPage(service) {
  const canonicalUrl = `https://purity-agency.be/services/${service.slug}`;
  const pageTitle = [' : tarif et livrables | Purity Agency', ' : tarif | Purity Agency', ' | Purity Agency'].map(x => service.name + x).find(t => t.length < 60);
  const allFaq = [...service.faq, ...objectionsFor(service)];
  const answer = answerFor(service);
  const metaDesc = metaDescriptionFor(service);

  const contactOfferUrl = service.id === 'M01'
    ? '/contact.html?solution=diagnostic'
    : `/contact.html?offer=${service.id}`;
  const primaryCtaText = service.id === 'M01' ? 'Réserver mon diagnostic offert (15 min)' : 'Demander mon devis cadré';

  // Build FAQPage Schema.org structure
  const faqSchemaItems = allFaq.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": f.a
    }
  }));

  const schemaJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": pageTitle,
        "description": metaDesc,
        "url": canonicalUrl,
        "isPartOf": {
          "@type": "WebSite",
          "name": "Purity Agency",
          "url": "https://purity-agency.be/"
        }
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
        "offers": {
          "@type": "Offer",
          "price": service.priceSetup.replace(/[^0-9]/g, '') || "0",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
          "url": canonicalUrl
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqSchemaItems
      }
    ]
  };

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(pageTitle)}</title>
<meta name="description" content="${escapeHtml(metaDesc)}">
<link rel="canonical" href="${canonicalUrl}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_BE">
<meta property="og:title" content="${escapeHtml(pageTitle)}">
<meta property="og:description" content="${escapeHtml(metaDesc)}">
<meta property="og:url" content="${canonicalUrl}">
${OG_IMAGE}
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preload" as="font" type="font/woff2" href="/assets/GeneralSans-Variable.woff2" crossorigin>
<link rel="stylesheet" href="/css/app.css?v=2026110102">
<link rel="stylesheet" href="/css/menu.css?v=3">
<link rel="stylesheet" href="/css/service-detail.css?v=20261103">
<script type="application/ld+json">
${JSON.stringify(schemaJson, null, 2)}
</script>
</head>
<body class="service-page">

${renderHeader('services')}

<main class="sd-main">
  <div class="sd-container">
    <nav class="sd-breadcrumbs" aria-label="Fil d'Ariane">
      <a href="/">Accueil</a>
      <span class="sd-breadcrumbs__sep">/</span>
      <a href="/services">Services</a>
      <span class="sd-breadcrumbs__sep">/</span>
      <span aria-current="page">${escapeHtml(service.name)}</span>
    </nav>

    <!-- HERO DU SERVICE -->
    <section class="sd-hero" aria-labelledby="service-title">
      <div class="sd-hero__pill"><i aria-hidden="true"></i> ${escapeHtml(service.pillar)}</div>
      <h1 class="sd-hero__title" id="service-title">${escapeHtml(service.name)}</h1>
      <p class="sd-hero__answer">${escapeHtml(answer)}</p>
      <p class="sd-hero__summary">${escapeHtml(service.summary)}</p>

      <div class="sd-hero__meta">
        <div class="sd-meta-card sd-meta-card--highlight">
          <span class="sd-meta-card__label">Tarif de mise en place</span>
          <div class="sd-meta-card__price-wrap">
            <span class="sd-meta-card__price-now">${escapeHtml(displayPrice(service))}</span>
            ${isFree(service) && service.promoTag ? `<span class="sd-meta-card__badge">${escapeHtml(service.promoTag)}</span>` : ''}
          </div>
          <span class="sd-meta-card__sub">${service.monthlyPrice ? `+ ${escapeHtml(service.monthlyPrice)} (suivi &amp; hébergement)` : isFree(service) ? 'Aucun paiement demandé' : 'Paiement unique · sans abonnement'}</span>
          ${isFree(service) ? '' : `<span class="sd-meta-card__vat">${VAT_NOTE}</span>`}
          ${offerNotes(service).map(note => `<span class="sd-meta-card__offer">${escapeHtml(note)}</span>`).join('')}
        </div>

        <div class="sd-meta-card">
          <span class="sd-meta-card__label">Délai d'exécution</span>
          <span class="sd-meta-card__value">${escapeHtml(service.delay)}</span>
          <span class="sd-meta-card__sub">Écrit dans votre devis</span>
        </div>

        <div class="sd-meta-card">
          <span class="sd-meta-card__label">Garantie &amp; Accompagnement</span>
          <span class="sd-meta-card__value">100 % Clé en main</span>
          <span class="sd-meta-card__sub">Sans frais cachés · Interlocuteur unique (Amir)</span>
        </div>
      </div>

      <div class="sd-hero__actions">
        <a class="sd-btn-primary" href="${contactOfferUrl}">${primaryCtaText} <span aria-hidden="true">↗</span></a>
        ${service.id !== 'M01' ? `<a class="sd-btn-secondary" href="/contact.html?solution=diagnostic">Échanger 15 min en visio d'abord <span aria-hidden="true">→</span></a>` : ''}
      </div>

      <!-- TRUST STRIP ABOVE THE FOLD -->
      <div class="sd-trust-strip" aria-label="Garanties et réassurance">
        <div class="sd-trust-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>BCE &amp; TVA : <strong>BE 1036.775.590</strong></span>
        </div>
        <div class="sd-trust-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>Charleroi &amp; Wallonie</span>
        </div>
      </div>
    </section>

    <!-- SECTION POUR QUI & UTILITÉ -->
    <section class="sd-section">
      <div class="sd-section-header">
        <span class="sd-kicker">Cadrage &amp; Impact</span>
        <h2 class="sd-heading">Pourquoi ce service est indispensable à votre activité</h2>
        <p class="sd-subheading">Comprendre l'utilité directe sur votre chiffre d'affaires et la cible exacte concernée.</p>
      </div>

      <div class="sd-duo-grid">
        <div class="sd-duo-card">
          <h3>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            À qui s'adresse cette formule&nbsp;?
          </h3>
          <p>${escapeHtml(service.targetAudience)}</p>
        </div>

        <div class="sd-duo-card">
          <h3>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            L'utilité concrète pour votre business
          </h3>
          <p>${escapeHtml(service.utility)}</p>
        </div>
      </div>
      ${notForHtml(service, escapeHtml)}
    </section>

    <!-- SECTION LIVRABLES EXACTS -->
    <section class="sd-section">
      <div class="sd-section-header">
        <span class="sd-kicker">Ce que vous recevez</span>
        <h2 class="sd-heading">La liste exhaustive de vos livrables</h2>
        <p class="sd-subheading">Zéro flou artistique. Voici exactement ce qui est conçu, construit et remis entre vos mains.</p>
      </div>

      <div class="sd-deliverables-grid">
        ${service.deliverables.map(deliv => `
          <div class="sd-deliverable-item">
            <div class="sd-deliverable-item__head">
              <span class="sd-deliverable-item__check" aria-hidden="true">✓</span>
              <strong>${escapeHtml(deliv.title)}</strong>
            </div>
            <p>${escapeHtml(deliv.desc)}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- SECTION COMPARATIVE AVEC PURITY VS AUTRES -->
    ${service.comparison && service.comparison.length ? `
    <section class="sd-section">
      <div class="sd-section-header">
        <span class="sd-kicker">Pourquoi Purity</span>
        <h2 class="sd-heading">La différence concrète face aux prestataires classiques</h2>
        <p class="sd-subheading">Voyez exactement ce qui change lorsque vous travaillez avec un studio axé sur la performance et la rentabilité.</p>
      </div>

      <div class="sd-comparison-wrap">
        <table class="sd-comparison-table">
          <thead>
            <tr>
              <th scope="col">Critère clé</th>
              <th scope="col">Prestataire classique / Bricolage</th>
              <th scope="col" class="sd-col-purity">Approche Purity Agency</th>
            </tr>
          </thead>
          <tbody>
            ${service.comparison.map(c => `
              <tr>
                <td class="sd-col-aspect">${escapeHtml(c.aspect)}</td>
                <td class="sd-col-others">${escapeHtml(c.others)}</td>
                <td class="sd-col-purity"><strong>✓</strong> ${escapeHtml(c.purity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
    ` : ''}

    <!-- SECTION LE COÛT DE L'INACTION -->
    <section class="sd-section">
      <div class="sd-loss-card">
        <span class="sd-kicker">Ne pas agir a un coût</span>
        <h2 class="sd-heading">Ce que vous perdez chaque mois sans cette solution</h2>
        <p class="sd-subheading">Ce n'est pas le coût de la solution qui est cher, c'est ce que son absence vous fait perdre en continu.</p>

        <div class="sd-loss-grid">
          ${service.lossOfInaction.map(loss => `
            <div class="sd-loss-item">
              <div class="sd-loss-item__title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>${escapeHtml(loss.title)}</span>
              </div>
              <p>${escapeHtml(loss.desc)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION COMMENT ÇA SE PASSE / DÉROULEMENT -->
    <section class="sd-section">
      <div class="sd-section-header">
        <span class="sd-kicker">Déroulement &amp; Remise</span>
        <h2 class="sd-heading">Comment se passe la réalisation de A à Z</h2>
        <p class="sd-subheading">Un processus cadré en 4 étapes pour un lancement serein sans vous surcharger de travail.</p>
      </div>

      <div class="sd-steps-grid">
        ${service.howItWorks.map(step => `
          <div class="sd-step-item">
            <div class="sd-step-num">${escapeHtml(step.step)}</div>
            <strong>${escapeHtml(step.title)}</strong>
            <p>${escapeHtml(step.desc)}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- SECTION CAS CONCRETS ASSOCIÉS (PREUVE SOCIALE & MAILLAGE) -->
    ${service.relatedCases && service.relatedCases.length ? `
    <section class="sd-section">
      <div class="sd-section-header">
        <span class="sd-kicker">Exemples réels</span>
        <h2 class="sd-heading">Voyez ce que nous avons créé pour d'autres métiers</h2>
        <p class="sd-subheading">Découvrez les démonstrations interactives et cas concrets déployés pour les artisans et PME de Wallonie.</p>
      </div>

      <div class="sd-cases-grid">
        ${service.relatedCases.map(rc => `
          <a class="sd-case-card" href="/cas-concrets/${escapeHtml(rc.id)}.html">
            <span class="sd-case-card__sector">${escapeHtml(rc.sector)}</span>
            <h3>${escapeHtml(rc.name)}</h3>
            <p>Voir le cas d'étude détaillé, l'architecture de conversion et la démonstration interactive en ligne.</p>
            <span class="sd-case-card__cta">Explorer le cas d'étude <span aria-hidden="true">→</span></span>
          </a>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <!-- SECTION MAINTENANCE & SUIVI -->
    ${service.monthlyPrice ? `
    <section class="sd-section">
      <div class="sd-maintenance-box">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
        <div>
          <h4>Ce qui est inclus dans votre suivi mensuel (${escapeHtml(service.monthlyPrice)})</h4>
          <p>${escapeHtml(service.includedMaintenance)}</p>
        </div>
      </div>
    </section>
    ` : ''}

    <!-- FAQ SECTION (SERP RICH SNIPPETS) -->
    <section class="sd-section">
      <div class="sd-section-header">
        <span class="sd-kicker">Transparence</span>
        <h2 class="sd-heading">Questions fréquentes sur cette formule</h2>
        <p class="sd-subheading">Toutes les réponses directes avant de prendre votre décision.</p>
      </div>

      <div class="sd-faq-list">
        ${allFaq.map(item => `
          <details class="sd-faq-item">
            <summary>${escapeHtml(item.q)}</summary>
            <div class="sd-faq-body">
              <p>${escapeHtml(item.a)}</p>
            </div>
          </details>
        `).join('')}
      </div>
    </section>

    <!-- MAILLAGE INTERNE -->
    <section class="sd-section" aria-labelledby="sd-links-title">
      <div class="sd-section-header">
        <span class="sd-kicker">Pour aller plus loin</span>
        <h2 class="sd-heading" id="sd-links-title">Exemples par métier et guides utiles</h2>
      </div>
      <ul class="sd-links">
        ${linksFor(service, escapeHtml)}
      </ul>
    </section>

    <!-- BOTTOM CTA -->
    <section class="sd-bottom-cta">
      <div class="sd-bottom-cta__inner">
        <span class="sd-kicker">Votre projet</span>
        <h2>On vérifie ensemble si c’est la bonne formule&nbsp;?</h2>
        <p>Vous parlez directement à Amir Kebiyeb. Devis écrit avec prix, délai et livrables, sans engagement tant que vous ne l’avez pas signé.</p>
        <div class="sd-bottom-cta__actions">
          <a class="sd-btn-primary" href="${contactOfferUrl}">${primaryCtaText} <span aria-hidden="true">↗</span></a>
          <a class="sd-btn-secondary" href="/services">Voir tous les autres services <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  </div>
</main>

<!-- MOBILE FLOATING ACTION BAR (CONVERSION GOOGLE ADS) -->
<aside class="sd-floating-bar" aria-label="Action rapide">
  <div class="sd-floating-info">
    <span class="sd-floating-price">${escapeHtml(displayPrice(service))}</span>
    <span class="sd-floating-note">${isFree(service) ? escapeHtml(service.promoTag || 'Sans engagement') : 'Prix net · TVA non applicable'}</span>
  </div>
  <a class="sd-floating-cta" href="${contactOfferUrl}">${service.id === 'M01' ? 'Diagnostic offert' : 'Demander devis'} <span aria-hidden="true">↗</span></a>
</aside>

${renderFooter()}

<script src="/js/menu.js?v=2026110102" defer></script>
</body>
</html>`;
}

function buildServicesHubPage() {
  const canonicalUrl = `https://purity-agency.be/services`;
  const pageTitle = `Services et tarifs : sites, SEO et IA | Purity Agency`;
  const metaDesc = `Les 14 services de Purity Agency pour indépendants et PME en Wallonie : sites web, e-commerce, réseaux sociaux, automatisation et IA, prix affichés.`;

  const schemaJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": pageTitle,
        "description": metaDesc,
        "url": canonicalUrl,
        "isPartOf": {
          "@type": "WebSite",
          "name": "Purity Agency",
          "url": "https://purity-agency.be/"
        }
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

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(pageTitle)}</title>
<meta name="description" content="${escapeHtml(metaDesc)}">
<link rel="canonical" href="${canonicalUrl}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_BE">
<meta property="og:title" content="${escapeHtml(pageTitle)}">
<meta property="og:description" content="${escapeHtml(metaDesc)}">
<meta property="og:url" content="${canonicalUrl}">
${OG_IMAGE}
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preload" as="font" type="font/woff2" href="/assets/GeneralSans-Variable.woff2" crossorigin>
<link rel="stylesheet" href="/css/app.css?v=2026110102">
<link rel="stylesheet" href="/css/menu.css?v=3">
<link rel="stylesheet" href="/css/service-detail.css?v=20261103">
<script type="application/ld+json">
${JSON.stringify(schemaJson, null, 2)}
</script>
</head>
<body class="service-page">

${renderHeader('services')}

<main class="sd-main">
  <div class="sd-container">
    <nav class="sd-breadcrumbs" aria-label="Fil d'Ariane">
      <a href="/">Accueil</a>
      <span class="sd-breadcrumbs__sep">/</span>
      <span aria-current="page">Services &amp; Tarifs</span>
    </nav>

    <section class="sd-hero sd-hero--hub">
      <div class="sd-hero__pill"><i aria-hidden="true"></i> Catalogue Officiel &amp; Tarifs 2026-2027</div>
      <h1 class="sd-hero__title">Des solutions concrètes.<br>Des livrables précis.</h1>
      <p class="sd-hero__answer">Purity Agency, agence web à Charleroi, crée des sites, des fiches Google, du contenu pour les réseaux et des automatisations pour les indépendants et PME de Wallonie. Chaque service affiche son prix, son délai et ses livrables. Vous ne savez pas lequel choisir ? Le diagnostic de 15 minutes est gratuit et sans engagement.</p>
      <p class="sd-hero__summary">Tous nos tarifs sont transparents et affichés sans devis à la tête du client. Hébergement rapide, sécurité et maintenance incluses.</p>

      <div class="sd-trust-strip" aria-label="Garanties">
        <div class="sd-trust-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>Entreprise enregistrée BCE 1036.775.590</span>
        </div>
        <div class="sd-trust-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>Charleroi · Namur · Mons · Liège · Wallonie</span>
        </div>
      </div>

      <!-- FILTER TABS -->
      <div class="sd-hub-filter-bar" role="group" aria-label="Filtrer les services par pilier">
        <button class="sd-hub-filter-btn is-active" type="button" data-filter="all" aria-pressed="true">Tous les services (14)</button>
        <button class="sd-hub-filter-btn" type="button" data-filter="pilier-1" aria-pressed="false">01 · Sites Web &amp; Référencement</button>
        <button class="sd-hub-filter-btn" type="button" data-filter="pilier-2" aria-pressed="false">02 · Réseaux Sociaux &amp; Image</button>
        <button class="sd-hub-filter-btn" type="button" data-filter="pilier-3" aria-pressed="false">03 · Automatisation &amp; IA</button>
        <button class="sd-hub-filter-btn" type="button" data-filter="pilier-4" aria-pressed="false">04 · Diagnostic</button>
      </div>
    </section>

    <section class="sd-section sd-section--ruled">
      <p class="sd-hub-price-note">${VAT_NOTE}. ${OFFER_NOTE}.</p>
      <div class="sd-hub-grid" id="services-grid">
        ${services.map((svc, idx) => {
          let pillarTag = 'pilier-1';
          if (svc.pillar.includes('Pilier 02')) pillarTag = 'pilier-2';
          else if (svc.pillar.includes('Pilier 03')) pillarTag = 'pilier-3';
          else if (svc.pillar.includes('Pilier 04')) pillarTag = 'pilier-4';

          const numStr = String(idx + 1).padStart(2, '0');

          return `
          <article class="sd-hub-card" data-pillar="${pillarTag}">
            <div class="sd-hub-card__top">
              <span class="sd-hub-card__num">#${numStr}</span>
              <span class="sd-hub-card__pillar">${escapeHtml(svc.pillar.replace(/Pilier \d+ · /, ''))}</span>
            </div>
            <h2 class="sd-hub-card__title"><a href="/services/${svc.slug}">${escapeHtml(svc.name)}</a></h2>
            <p class="sd-hub-card__summary">${escapeHtml(svc.summary)}</p>

            <ul class="sd-hub-card__deliverables-preview" aria-label="Livrables clés inclus">
              ${svc.deliverables.slice(0, 3).map(deliv => `
                <li>
                  <span class="sd-hub-card__check" aria-hidden="true">✓</span>
                  <span>${escapeHtml(deliv.title)}</span>
                </li>
              `).join('')}
            </ul>

            <div class="sd-hub-card__footer">
              <div class="sd-hub-card__price-wrap">
                <span class="sd-hub-card__price">${escapeHtml(displayPrice(svc))}</span>
                <span class="sd-hub-card__delay">Livraison : ${escapeHtml(svc.delay)}</span>
              </div>
              <a class="sd-hub-card__btn" href="/services/${svc.slug}" aria-label="Voir en détail : ${escapeHtml(svc.name)}">
                Voir en détail <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
          `;
        }).join('')}
      </div>
    </section>

    <!-- BOTTOM CTA -->
    <section class="sd-bottom-cta">
      <div class="sd-bottom-cta__inner">
        <span class="sd-kicker">Cadrage rapide</span>
        <h2>Vous ne savez pas par quoi commencer&nbsp;?</h2>
        <p>Réservez un créneau de 15 minutes en visio avec Amir. C'est 100 % gratuit et sans aucun engagement.</p>
        <a class="sd-btn-primary" href="/contact.html?solution=diagnostic">Réserver mon diagnostic 15 min offert <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  </div>
</main>

<script src="/js/services-hub.js?v=20261101" defer></script>

${renderFooter()}

<script src="/js/menu.js?v=2026110102" defer></script>
</body>
</html>`;
}

// Generate all individual service pages
let count = 0;
for (const svc of services) {
  const html = buildServiceDetailPage(svc);
  const outPath = path.join(SERVICES_DIR, `${svc.slug}.html`);
  fs.writeFileSync(outPath, html, 'utf8');
  count++;
}
console.log(`Generated ${count} individual service detail pages in services/*.html`);

// Generate hub page services.html at root
const hubHtml = buildServicesHubPage();
fs.writeFileSync(path.join(ROOT, 'services.html'), hubHtml, 'utf8');
console.log(`Generated services.html hub page at root`);
