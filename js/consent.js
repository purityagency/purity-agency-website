// Consentement + mesure d'audience (Google Tag Manager / GA4).
// Mode « basic » de Consent Mode v2 : rien de Google n'est chargé tant que
// le visiteur n'a pas cliqué sur « Accepter » (loi belge du 30 juillet 2018,
// art. 10/2). « Refuser » a le même poids qu'« Accepter ». Le choix est
// gardé 6 mois puis redemandé ; il se modifie via « Gérer les cookies ».
(() => {
  const GTM_ID = 'GTM-W95H5T7D';
  // GA4 est chargé directement (gtag.js) ; ne pas ajouter aussi une balise GA4
  // dans le conteneur GTM, sinon chaque visite serait comptée deux fois.
  const GA4_ID = 'G-SKEC13DFN7';
  const KEY = 'purity-consent-v1';
  const MAX_AGE = 1000 * 60 * 60 * 24 * 182; // 6 mois
  const w = window;
  w.dataLayer = w.dataLayer || [];
  function gtag() { w.dataLayer.push(arguments); }

  // Tout est refusé par défaut, avant tout chargement.
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'granted', security_storage: 'granted',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', false);

  const read = () => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!v || Date.now() - v.t > MAX_AGE) return null;
      return v.analytics === true || v.analytics === false ? v : null;
    } catch { return null; }
  };
  const save = (analytics) => {
    try { localStorage.setItem(KEY, JSON.stringify({ analytics, t: Date.now() })); } catch {}
  };

  let gtmLoaded = false;
  const loadGtm = () => {
    if (gtmLoaded) return;
    gtmLoaded = true;
    w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA4_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    const g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(g);
  };

  const grant = () => {
    gtag('consent', 'update', { analytics_storage: 'granted' });
    loadGtm();
  };

  // Retrait du consentement : on coupe et on efface les cookies _ga*.
  const revoke = () => {
    gtag('consent', 'update', { analytics_storage: 'denied' });
    const host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').map(c => c.trim().split('=')[0]).filter(n => /^_ga|^_gid|^_gcl/.test(n)).forEach(n => {
      ['', '.' + host, host].forEach(d => {
        document.cookie = n + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  };

  // ---------- Événements mesurés (envoyés seulement si GTM est chargé) ----------
  const track = (event, params) => {
    if (!gtmLoaded) return;
    gtag('event', event, params || {});
  };
  const page = location.pathname;
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a, button');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    const label = (a.textContent || '').trim().slice(0, 80);
    if (/calendar\.app\.google|calendar\.google\.com/.test(href)) track('book_appointment', { cta_text: label, page });
    else if (/^\/demos\/[^/]+/.test(href)) track('view_demo', { demo: href.split('/')[2], cta_text: label, page });
    else if (href.startsWith('mailto:')) track('contact_email', { page });
    else if (href.startsWith('tel:')) track('contact_phone', { page });
    else if (/^\/contact(\.html)?/.test(href)) track('cta_contact', { cta_text: label, target: href, page });
    else if (/^https?:\/\//.test(href) && !href.includes(location.hostname)) track('outbound_click', { link_url: href, page });
  }, { capture: true });
  document.addEventListener('purity:lead', (e) => track('generate_lead', Object.assign({ page }, e.detail || {})));
  document.addEventListener('purity:site_test', (e) => track('site_test', Object.assign({ page }, e.detail || {})));
  document.addEventListener('purity:chat_start', () => track('chat_start', { page }));
  // Profondeur de lecture : 50 % et 90 %.
  const marks = { 50: false, 90: false };
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    if (h <= 0) return;
    const p = (scrollY / h) * 100;
    for (const m of [50, 90]) if (!marks[m] && p >= m) { marks[m] = true; track('scroll_depth', { percent: m, page }); }
  };
  addEventListener('scroll', onScroll, { passive: true });

  // ---------- Bandeau ----------
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = '/css/consent.css?v=1';
  document.head.appendChild(css);

  let banner = null;
  const close = () => { if (banner) { banner.remove(); banner = null; } };
  const show = () => {
    if (banner) return;
    banner = document.createElement('aside');
    banner.className = 'consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Choix des cookies de mesure d’audience');
    banner.innerHTML =
      '<p class="consent__text"><strong>Mesure d’audience</strong>' +
      '<span>Avec votre accord, Google Analytics nous dit quelles pages aident vraiment. Aucune publicité, aucune revente. <a href="/cookies.html">Détails</a></span></p>' +
      '<div class="consent__actions">' +
      '<button type="button" class="consent__btn" data-consent="deny">Refuser</button>' +
      '<button type="button" class="consent__btn" data-consent="accept">Accepter</button>' +
      '</div>';
    banner.addEventListener('click', (e) => {
      const b = e.target.closest('[data-consent]');
      if (!b) return;
      const ok = b.dataset.consent === 'accept';
      save(ok);
      if (ok) grant(); else revoke();
      close();
    });
    document.body.appendChild(banner);
  };

  // Lien « Gérer les cookies » ajouté dans le pied de page de chaque page.
  const addManageLink = () => {
    const legal = document.querySelector('.site-footer__legal');
    if (!legal || legal.querySelector('.consent-manage')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'consent-manage';
    btn.textContent = 'Gérer les cookies';
    btn.addEventListener('click', show);
    legal.appendChild(btn);
  };
  document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('[data-consent-open]')) show(); });

  const start = () => {
    addManageLink();
    const choice = read();
    if (choice && choice.analytics) grant();
    else if (!choice) show();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
