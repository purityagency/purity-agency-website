/* Les prix de la section Services viennent du même catalogue serveur que
   l’agent commercial. La page d’accueil ne recopie donc aucun montant. */
(() => {
  const blocks = [...document.querySelectorAll('[data-service-pricing]')];
  if (!blocks.length) return;

  const offerGroups = {
    acquisition: ['M03', 'M04', 'M07', 'M08', 'M13', 'M16'],
    visibilite: ['M16', 'M09', 'M10', 'M05', 'M06'],
    automatisation: ['M21', 'M22', 'M23'],
    outils: ['M01', 'M22', 'M23']
  };

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  const priceMarkup = offer => {
    const price = String(offer.price || 'Sur mesure');
    const parts = price.split(' + ');
    if (offer.id === 'M16') {
      return `<span class="price-promo-line"><s class="price-old">${escapeHtml(parts[0])}</s> <strong>${escapeHtml(offer.promoSetup || parts[0])}</strong></span>${parts[1] ? `<span>+ ${escapeHtml(parts.slice(1).join(' + '))}</span>` : ''}<em class="promo-pill promo-pill--free">${escapeHtml(offer.promoTag || '1er mois offert')}</em>`;
    }
    if (offer.promoSetup) {
      return `<span class="price-promo-line"><s class="price-old">${escapeHtml(parts[0])}</s> <strong>${escapeHtml(offer.promoSetup)}</strong> <em class="promo-pill promo-pill--25">${escapeHtml(offer.promoTag || '-25 % 24h')}</em></span>${parts[1] ? `<span>+ ${escapeHtml(parts.slice(1).join(' + '))}</span>` : '<small>mise en place (-25 %)</small>'}`;
    }
    return `<strong>${escapeHtml(parts[0])}</strong>${parts[1] ? `<span>+ ${escapeHtml(parts.slice(1).join(' + '))}</span>` : `<small>${escapeHtml(offer.promoTag || 'prix affiché')}</small>`}`;
  };

  const renderOffer = offer => `<article class="service-offer-row">
    <div class="service-offer-row__copy"><strong>${escapeHtml(offer.name)}</strong><p>${escapeHtml(offer.description)}</p></div>
    <div class="service-offer-row__price" aria-label="Prix ${escapeHtml(offer.price)}">${priceMarkup(offer)}</div>
    <a href="/contact.html?offer=${encodeURIComponent(offer.id)}&amp;promo=novdec25">Profiter de l’offre <span aria-hidden="true">↗</span></a>
  </article>`;

  const setError = block => {
    const target = block.querySelector('.service-card__offers');
    if (target) target.innerHTML = '<p class="service-pricing-error">Les tarifs ne sont pas disponibles pour le moment. <a href="/contact.html">Parlons directement de votre besoin.</a></p>';
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
        target.innerHTML = selected.map(renderOffer).join('');
      });
    })
    .catch(() => blocks.forEach(setError));
})();
