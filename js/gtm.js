// Google Tag Manager — chargé en externe car la CSP du site interdit les
// scripts inline (server/middleware/security.js). Ce fichier reproduit le
// snippet standard GTM sans passer par document.write ni un <script> collé
// dans le HTML.

// Consent Mode v2 : tout ce que GTM chargera par défaut (Analytics, Ads...)
// démarre REFUSÉ. La bannière cookie (js/site.js, clic "Accepter") passe
// analytics_storage à "granted" ; sur les pages sans bannière, ça reste
// refusé — c'est le comportement sûr par défaut demandé par Google lui-même,
// pas une case à cocher qu'on aurait pu oublier de brancher.
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});

(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s),
    dl = l !== 'dataLayer' ? '&l=' + l : '';
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-W95H5T7D');
