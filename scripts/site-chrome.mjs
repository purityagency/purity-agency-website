// En-tête, menu mobile et pied de page communs à toutes les pages publiques.
// Source unique : build-service-pages.mjs l'importe ; les pages écrites à la
// main ont reçu exactement ce balisage. Le décalage du menu (--i) est en CSS.
const NAV = [
  ['services', '/services', 'Services et tarifs'],
  ['demos', '/cas-concrets', 'Démos par métier'],
  ['blog', '/blog', 'Blog'],
  ['contact', '/contact', 'Contact']
];
const link = (active) => ([key, href, label]) =>
  `<a href="${href}"${key === active ? ' aria-current="page"' : ''}>${label}</a>`;

export function renderHeader(active = '') {
  return `<header class="header">
  <a class="header__brand" href="/">
    <img src="/assets/logo-mark.webp" alt="" aria-hidden="true" width="26" height="26">
    <span>Purity Agency</span>
  </a>
  <nav class="header__nav" aria-label="Principal">
    ${NAV.map(link(active)).join('\n    ')}
  </nav>
  <button class="burger" type="button" command="toggle-popover" commandfor="menu" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu">
    <span class="burger__box" aria-hidden="true"><span class="burger__bar"></span><span class="burger__bar"></span></span>
  </button>
</header>`;
}

export function renderMenu(active = '') {
  return `<div id="menu" popover="auto" class="menu" aria-label="Menu">
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
    ${NAV.map(link(active)).join('\n    ')}
  </nav>
  <div class="menu__foot">
    <a class="btn btn--primary" href="/contact?intent=rdv">Réserver mon diagnostic gratuit</a>
    <a class="menu__mail" href="mailto:contact@purity-agency.be">contact@purity-agency.be</a>
  </div>
</div>`;
}

export function renderFooter() {
  return `<footer class="site-footer">
  <div class="site-footer__inner">
    <div>
      <a class="site-footer__brand" href="/">
        <img src="/assets/logo-mark.webp" alt="" width="32" height="32">
        Purity Agency
      </a>
      <p>Sites, fiche Google, réseaux sociaux et automatisation pour les indépendants et PME de Wallonie. Basés à Charleroi : <a href="/agence-web/charleroi">agence web à Charleroi</a>.</p>
    </div>
    <nav aria-label="Navigation de pied de page">
      <h2>Explorer</h2>
      <a href="/services">Services et tarifs</a>
      <a href="/cas-concrets">Démos par métier</a>
      <a href="/agence-web">Agence web par ville</a>
      <a href="/site-internet/">Site internet par métier</a>
      <a href="/blog">Blog</a>
      <a href="/a-propos">À propos</a>
      <a href="/contact">Contact</a>
    </nav>
    <div>
      <h2>Parlons-en</h2>
      <a href="/contact?intent=rdv">Réserver mon diagnostic gratuit</a>
      <a href="/contact">Écrire à Amir</a>
      <a href="mailto:contact@purity-agency.be">contact@purity-agency.be</a>
    </div>
  </div>
  <div class="site-footer__legal">
    <span>Purity Agency · Boulevard Frans Dewandre 14, 6000 Charleroi</span>
    <span>BCE 1036.775.590 · TVA BE 1036.775.590 · Franchise TVA, art. 56bis CTVA</span>
    <span>© 2026 Purity Agency</span>
    <a href="/legal">Légal</a>
    <a href="/confidentialite">Confidentialité</a>
    <a href="/cookies">Cookies</a>
    <a href="/conditions-generales">CGV</a>
  </div>
</footer>`;
}
