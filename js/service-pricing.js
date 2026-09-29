/* Les prix de la section Services viennent du même catalogue serveur que
   l’agent commercial. La page d’accueil ne recopie donc aucun montant. */
(() => {
  const blocks = [...document.querySelectorAll('[data-service-pricing]')];
  if (!blocks.length) return;

  const offerGroups = {
    acquisition: ['M03', 'M04', 'M05', 'M06', 'M07'],
    visibilite: ['M08', 'M13'],
    automatisation: ['M21', 'M22', 'M23'],
    outils: ['M01']
  };

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  const priceMarkup = price => {
    const parts = String(price || 'Sur mesure').split(' + ');
    return `<strong>${escapeHtml(parts[0])}</strong>${parts[1] ? `<span>+ ${escapeHtml(parts.slice(1).join(' + '))}</span>` : '<small>prix affiché</small>'}`;
  };

  const renderOffer = offer => `<article class="service-offer-row">
    <div class="service-offer-row__copy"><strong>${escapeHtml(offer.name)}</strong><p>${escapeHtml(offer.description)}</p></div>
    <div class="service-offer-row__price" aria-label="Prix ${escapeHtml(offer.price)}">${priceMarkup(offer.price)}</div>
    <a href="/contact.html?offer=${encodeURIComponent(offer.id)}">Préparer ma demande <span aria-hidden="true">↗</span></a>
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
