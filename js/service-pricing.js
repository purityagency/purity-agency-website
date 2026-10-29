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

  const isPromo24hActive = () => !window.PurityPromo24h || window.PurityPromo24h.isActive();
  const promoBadgeText = fallback => (window.PurityPromo24h ? window.PurityPromo24h.badgeLabel() : (fallback || '-25 % 24h'));

  const priceMarkup = offer => {
    const price = String(offer.price || 'Sur mesure');
    const parts = price.split(' + ');
    const active24h = isPromo24hActive();
    const hasMonthly = Boolean(parts[1]);
    const monthlyText = hasMonthly ? `+ ${escapeHtml(parts.slice(1).join(' + '))}` : '';

    if (offer.id === 'M01') {
      return `<div class="price-setup">
        <strong class="price-current price-current--free">${escapeHtml(parts[0])}</strong>
        <em class="promo-pill promo-pill--free">${escapeHtml(offer.promoTag || '100 % gratuit')}</em>
      </div>
      <div class="price-recurring price-recurring--free">
        <span class="price-recurring__note">15 min en visio · sans aucun engagement</span>
      </div>`;
    }

    if (offer.id === 'M16') {
      const setupOld = parts[0];
      const setupNow = active24h && offer.promoSetup ? offer.promoSetup : setupOld;
      const isDiscounted = active24h && offer.promoSetup && setupNow !== setupOld;
      return `<div class="price-setup">
        ${isDiscounted ? `<s class="price-old">${escapeHtml(setupOld)}</s>` : ''}
        <strong class="price-current">${escapeHtml(setupNow)}</strong>
        ${isDiscounted ? `<em class="promo-pill promo-pill--25" data-promo-badge="25">${escapeHtml(promoBadgeText(offer.promoTag))}</em>` : ''}
      </div>
      <div class="price-recurring">
        <span class="price-recurring__amount">${monthlyText}</span>
        <em class="promo-pill promo-pill--free">${escapeHtml(offer.promoTag || '1er mois offert')}</em>
      </div>`;
    }

    if (offer.promoSetup && active24h) {
      return `<div class="price-setup">
        <s class="price-old">${escapeHtml(parts[0])}</s>
        <strong class="price-current">${escapeHtml(offer.promoSetup)}</strong>
        <em class="promo-pill promo-pill--25" data-promo-badge="25">${escapeHtml(promoBadgeText(offer.promoTag))}</em>
      </div>
      <div class="price-recurring">
        ${hasMonthly 
          ? `<span class="price-recurring__amount">${monthlyText}</span> <span class="price-recurring__note">hébergement &amp; suivi inclus</span>` 
          : `<span class="price-recurring__note price-recurring__note--once">paiement unique · sans abonnement</span>`
        }
      </div>`;
    }

    return `<div class="price-setup">
      <strong class="price-current">${escapeHtml(parts[0])}</strong>
      ${offer.promoSetup ? `<em class="promo-pill promo-pill--expired" data-promo-badge="25">24h expiré</em>` : ''}
    </div>
    <div class="price-recurring">
      ${hasMonthly 
        ? `<span class="price-recurring__amount">${monthlyText}</span> <span class="price-recurring__note">hébergement &amp; suivi inclus</span>` 
        : `<span class="price-recurring__note price-recurring__note--once">paiement unique · sans abonnement</span>`
      }
    </div>`;
  };

  const renderOffer = offer => {
    const ctaLabel = offer.id === 'M01' ? 'Réserver mon créneau' : 'Profiter de l’offre';
    return `<article class="service-offer-row">
      <div class="service-offer-row__copy">
        <strong>${escapeHtml(offer.name)}</strong>
        <p>${escapeHtml(offer.description)}</p>
      </div>
      <div class="service-offer-row__price" aria-label="Prix ${escapeHtml(offer.price)}">${priceMarkup(offer)}</div>
      <a href="/contact.html?offer=${encodeURIComponent(offer.id)}&amp;promo=novdec25">${ctaLabel} <span aria-hidden="true">↗</span></a>
    </article>`;
  };

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
      const renderAll = () => {
        blocks.forEach(block => {
          const target = block.querySelector('.service-card__offers');
          const ids = offerGroups[block.dataset.servicePricing] || [];
          const selected = ids.map(id => offers.get(id)).filter(Boolean);
          if (!target || !selected.length) return setError(block);
          target.innerHTML = selected.map(renderOffer).join('');
        });
      };
      renderAll();
      window.addEventListener('purity:promo24h-expired', renderAll);
    })
    .catch(() => blocks.forEach(setError));
})();
