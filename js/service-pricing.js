/* Les prix de la section Services viennent du même catalogue serveur que
   l’agent commercial. La page d’accueil ne recopie donc aucun montant. */
(() => {
  const blocks = [...document.querySelectorAll('[data-service-pricing]')];
  if (!blocks.length) return;

  // Mêmes groupes que serviceGroups (data/services.mjs) : chaque offre dans un
  // seul pilier, le diagnostic sert de porte d'entrée.
  const offerGroups = {
    acquisition: ['M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M13'],
    visibilite: ['M16', 'M10', 'M09'],
    automatisation: ['M21', 'M22', 'M23'],
    diagnostic: ['M01']
  };

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  // Prix affiché = prix réel. La remise de 24 h dépend de la date du devis, pas
  // de la visite : elle figure en note sous la liste, jamais en prix barré.
  const pricingNote = '<p class="service-pricing-note">Prix nets · TVA non applicable (franchise, art. 56bis CTVA). '
    + '-25&nbsp;% sur la création si vous validez dans les 24&nbsp;h suivant votre devis.</p>';

  const priceMarkup = offer => {
    const price = String(offer.price || 'Sur mesure');
    const parts = price.split(' + ');
    const hasMonthly = Boolean(parts[1]);
    const monthlyText = hasMonthly ? `+ ${escapeHtml(parts.slice(1).join(' + '))}` : '';

    if (offer.id === 'M01') {
      return `<div class="price-setup">
        <strong class="price-current price-current--free">${escapeHtml(parts[0])}</strong>
        <em class="promo-pill promo-pill--free">Gratuit · sans engagement</em>
      </div>
      <div class="price-recurring price-recurring--free">
        <span class="price-recurring__note">15 min par téléphone ou en visio · sans engagement</span>
      </div>`;
    }

    if (offer.id === 'M16') {
      return `<div class="price-recurring">
        <span class="price-recurring__amount">${monthlyText}</span>
        <em class="promo-pill promo-pill--free">Sans frais de départ</em>
      </div>`;
    }

    return `<div class="price-setup">
      <strong class="price-current">${escapeHtml(parts[0])}</strong>
    </div>
    <div class="price-recurring">
      ${hasMonthly 
        ? `<span class="price-recurring__amount">${monthlyText}</span> <span class="price-recurring__note">hébergement &amp; suivi inclus</span>` 
        : `<span class="price-recurring__note price-recurring__note--once">paiement unique · sans abonnement</span>`
      }
    </div>`;
  };

  const renderOffer = offer => {
    const ctaLabel = offer.id === 'M01' ? 'Réserver mon diagnostic gratuit' : 'Demander ce devis';
    // Rendez-vous : bloc de réservation. Devis : offre rappelée avec la remise.
    const ctaUrl = offer.id === 'M01'
      ? '/contact?intent=rdv'
      : `/contact?offer=${encodeURIComponent(offer.id)}&amp;promo=lancement`;
    const detailUrl = offer.slug ? `/services/${encodeURIComponent(offer.slug)}` : '/services';
    return `<article class="service-offer-row">
      <div class="service-offer-row__copy">
        <strong>${escapeHtml(offer.name)}</strong>
        <p>${escapeHtml(offer.description)}</p>
      </div>
      <div class="service-offer-row__price" aria-label="Prix ${escapeHtml(offer.price)}">${priceMarkup(offer)}</div>
      <div class="service-offer-row__actions">
        <a class="service-offer-row__detail" href="${detailUrl}">Détails &amp; livrables <span aria-hidden="true">→</span></a>
        <a class="service-offer-row__cta" href="${ctaUrl}">${ctaLabel} <span aria-hidden="true">↗</span></a>
      </div>
    </article>`;
  };

  const setError = block => {
    const target = block.querySelector('.service-card__offers');
    if (target) target.innerHTML = '<p class="service-pricing-error">Les tarifs ne sont pas disponibles pour le moment. <a href="/contact">Parlons directement de votre besoin.</a></p>';
  };

  fetch('/api/offers', { headers: { Accept: 'application/json' } })
    .then(response => {
      if (!response.ok) throw new Error('offers-unavailable');
      return response.json();
    })
    .then(payload => {
      const offers = new Map((Array.isArray(payload.offers) ? payload.offers : []).map(offer => [offer.id, offer]));
      blocks.forEach(block => {
        const target = block.querySelector('.service-card__offers');
        const ids = offerGroups[block.dataset.servicePricing] || [];
        const selected = ids.map(id => offers.get(id)).filter(Boolean);
        if (!target || !selected.length) return setError(block);
        target.innerHTML = selected.map(renderOffer).join('') + (block.dataset.servicePricing === 'diagnostic' ? '' : pricingNote);
      });
    })
    .catch(() => blocks.forEach(setError));
})();
