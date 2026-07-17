/**
 * analytics.js — Capture d'événements PostHog (auto-hébergé côté client, sans SDK tiers)
 * Aucun cookie tiers, aucun pixel publicitaire : un identifiant anonyme en localStorage
 * (1ère partie) + appels fetch directs vers l'API d'ingestion PostHog (région EU).
 *
 * Clé projet PostHog à coller ci-dessous (clé publique, comme une clé Stripe "publishable" —
 * sans danger à exposer côté client). Tant qu'elle n'est pas renseignée, ce script ne fait rien.
 */
(function () {
  'use strict';

  var POSTHOG_KEY = 'phc_oVFkr5t5XgPkTARGy3KiBcwa6V77zNcmsftSnUjSBPpB';
  var POSTHOG_HOST = 'https://eu.i.posthog.com';

  if (!POSTHOG_KEY || POSTHOG_KEY === 'phc_REPLACE_ME') return;

  var STORAGE_KEY = 'purity_aid';
  var distinctId;
  try {
    distinctId = localStorage.getItem(STORAGE_KEY);
    if (!distinctId) {
      distinctId = 'anon_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(STORAGE_KEY, distinctId);
    }
  } catch (e) {
    distinctId = 'anon_session_' + Date.now().toString(36);
  }

  function capture(event, properties) {
    var payload = {
      api_key: POSTHOG_KEY,
      event: event,
      distinct_id: distinctId,
      properties: Object.assign({
        '$current_url': location.href,
        '$pathname': location.pathname,
        '$referrer': document.referrer || undefined
      }, properties || {})
    };
    try {
      fetch(POSTHOG_HOST + '/i/v0/e/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function () {});
    } catch (e) { /* navigateur trop ancien ou hors-ligne, on ignore */ }
  }

  capture('$pageview');

  // Événements de conversion clés — écoute déléguée, fonctionne même sur le contenu injecté dynamiquement
  document.addEventListener('click', function (e) {
    var bookingLink = e.target.closest('a[href="#booking"], a.nav__cta, .hero__ctas a');
    if (bookingLink) capture('cta_click', { label: (bookingLink.textContent || '').trim().slice(0, 80) });

    var orderTrigger = e.target.closest('.order-trigger[data-service]');
    if (orderTrigger) capture('order_modal_open', { service: orderTrigger.getAttribute('data-service') });

    var packTrigger = e.target.closest('.ob-trigger[data-open-ob]');
    if (packTrigger) capture('pack_modal_open', { sector: packTrigger.getAttribute('data-open-ob') });
  }, true);

  window.PurityAnalytics = { capture: capture };
})();
