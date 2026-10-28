(() => {
  const root = document.getElementById('pricing-catalog');
  if (!root) return;

  const groups = [
    { id: 'presence', label: 'Je veux un site qui ramène des clients', title: 'Sites web, boutiques & refontes (-25 % lancement)', description: 'Un site rapide, pensé pour convertir vos visiteurs en appels et demandes de devis.', image: '/assets/pricing-presence-studio.png', ids: ['M03', 'M04', 'M05', 'M06', 'M07'] },
    { id: 'visibilite', label: 'Je veux être visible sur Google & les réseaux', title: 'Google local, Réseaux sociaux (3x/sem.) & Image', description: 'Ressortir sur Google Maps et publier 3 fois par semaine sans y passer vos soirées.', image: '/assets/pricing-visibility-studio.png', ids: ['M08', 'M13', 'M16', 'M09', 'M10'] },
    { id: 'automatisation', label: 'Je veux gagner du temps chaque semaine', title: 'Automatisation & Agents IA sur mesure', description: 'Des outils qui répondent, prennent rendez-vous et relancent automatiquement.', image: '/assets/pricing-automation-studio.png', ids: ['M21', 'M22', 'M23'] },
    { id: 'diagnostic', label: 'Je veux savoir par où commencer', title: 'Diagnostic gratuit en 15 minutes', description: 'Un point honnête sur votre site et vos réseaux avant d’engager le moindre euro.', image: '/assets/pricing-diagnostic-studio.png', ids: ['M01'] }
  ];

  const examples = {
    M03: 'Une page qui explique l’offre, rassure et mène directement vers un créneau ou WhatsApp.',
    M04: 'Chaque service dispose d’une réponse claire et d’une action, au lieu d’un menu qui disperse.',
    M05: 'Les offres évoluent sans devoir reconstruire toute la présence en ligne à chaque saison.',
    M06: 'Les fiches, la réassurance et le panier restent cohérents sur mobile comme sur ordinateur.',
    M07: 'On garde ce qui aide déjà et on retire ce qui ralentit la lecture ou la prise de contact.',
    M08: 'La fiche, les pages locales et les coordonnées facilitent le choix depuis une recherche Google.',
    M09: 'Un logo net, des couleurs cohérentes et des supports qui inspirent immédiatement confiance.',
    M10: 'Des photos, visuels et vidéos courtes prêts à publier pour montrer votre travail réel.',
    M13: 'Les pages répondent aux recherches réellement utilisées dans votre zone de travail.',
    M16: '3 publications par semaine + 1 Reel par semaine créés et programmés pour vous (1er mois offert).',
    M21: 'Le formulaire recueille les informations utiles avant le premier échange.',
    M22: 'Les prospects sont suivis régulièrement sans simuler une relation humaine.',
    M23: 'Les outils échangent les informations utiles pour réduire les doubles encodages et les oublis.',
    M01: 'On identifie le blocage commercial ou opérationnel avant de choisir une solution.'
  };

  const esc = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  const priceMarkup = offer => {
    const parts = String(offer.price).split(' + ');
    const setupHtml = offer.promoSetup
      ? `<s class="price-old">${esc(parts[0])}</s> <strong>${esc(offer.promoSetup)}</strong>`
      : `<strong>${esc(parts[0])}</strong>`;
    const badgeHtml = offer.id === 'M16'
      ? `<em class="promo-pill promo-pill--free">${esc(offer.promoTag)}</em>`
      : offer.promoSetup
        ? `<em class="promo-pill promo-pill--25">${esc(offer.promoTag || '-25 % 24h')}</em>`
        : '';
    if (parts.length === 1) return `<div class="price-card__pricing price-card__pricing--single"><span>${setupHtml} ${badgeHtml}<small>${offer.promoSetup ? 'mise en place (-25 % 24h)' : 'prix affiché'}</small></span></div>`;
    return `<div class="price-card__pricing"><span>${setupHtml} ${badgeHtml}<small>mise en place</small></span><span><strong>${esc(parts.slice(1).join(' + '))}</strong><small>${offer.id === 'M16' ? '1er mois offert' : 'maintenance'}</small></span></div>`;
  };

  const conciseDescription = description => String(description)
    .replace(/\s*Maintenance requise incluse dans le montant mensuel\.?/gi, '')
    .replace(/\s*Maintenance requise\.?/gi, '')
    .trim();

  const priceAnchor = offers => {
    const ranked = offers
      .map(offer => ({ offer, value: Number.parseFloat(String(offer.promoSetup || offer.price).replace(/\s/g, '').replace(',', '.').match(/\d+(?:\.\d+)?/)?.[0] || '') }))
      .filter(item => Number.isFinite(item.value))
      .sort((a, b) => a.value - b.value);
    if (!ranked.length) return { primary: 'Offert (15 min)', secondary: 'sans engagement' };
    const top = ranked[0].offer;
    const [primary, ...rest] = String(top.price).split(' + ');
    return { primary: `Dès ${top.promoSetup || primary}`, secondary: rest.length ? `+ ${rest.join(' + ')}` : 'mise en place (-25 %)' };
  };

  const cardMarkup = offer => `<article class="price-card">
    <div class="price-card__top"><h4>${esc(offer.name)}</h4>${priceMarkup(offer)}</div>
    <p>${esc(conciseDescription(offer.description))}</p>
    <details class="price-card__example"><summary>Voir un exemple concret <span aria-hidden="true">+</span></summary><div>${esc(examples[offer.id] || '')}</div></details>
    <a class="price-card__cta" href="/contact.html?offer=${encodeURIComponent(offer.id)}&amp;promo=ouverture25">Profiter de l’offre <span aria-hidden="true">↗</span></a>
  </article>`;

  const pricingPage = document.querySelector('.pricing');
  const validGroup = id => groups.some(group => group.id === id) ? id : null;

  const showChooser = ({ updateHash = false } = {}) => {
    root.dataset.pricingView = 'chooser';
    pricingPage?.classList.remove('pricing--detail');
    document.body.classList.remove('pricing-detail-open');
    root.querySelectorAll('[role="tab"]').forEach(button => {
      button.setAttribute('aria-selected', 'false');
      button.tabIndex = 0;
    });
    root.querySelectorAll('[data-pricing-panel]').forEach(panel => { panel.hidden = true; });
    if (updateHash) history.replaceState(null, '', location.pathname);
  };

  const showDetail = (id, { updateHash = false } = {}) => {
    const active = validGroup(id) || groups[0].id;
    root.dataset.pricingView = 'detail';
    pricingPage?.classList.add('pricing--detail');
    document.body.classList.add('pricing-detail-open');
    root.querySelectorAll('[role="tab"]').forEach(button => {
      const selected = button.dataset.group === active;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = -1;
    });
    root.querySelectorAll('[data-pricing-panel]').forEach(panel => {
      panel.hidden = panel.dataset.pricingPanel !== active;
    });
    if (updateHash) history.replaceState(null, '', `#${active}`);
  };

  fetch('/api/offers')
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(({ offers }) => {
      const byId = new Map(offers.map(offer => [offer.id, offer]));
      root.innerHTML = `<nav class="pricing-tabs" role="tablist" aria-label="Choisissez votre priorité">${groups.map((group, index) => {
        const anchor = priceAnchor(group.ids.map(id => byId.get(id)).filter(Boolean));
        return `<button type="button" role="tab" data-group="${group.id}" aria-controls="pricing-${group.id}" aria-selected="false" tabindex="0"><span class="pricing-tab__count">0${index + 1}</span><span class="pricing-tab__copy"><strong>${group.label}</strong><small>${group.description}</small><em class="pricing-tab__price">${esc(anchor.primary)}<span>${esc(anchor.secondary)}</span></em></span><span class="pricing-tab__action">Voir les options <b aria-hidden="true">↘</b></span><img src="${group.image}" alt="" width="2048" height="683"></button>`;
      }).join('')}</nav>
        <div class="pricing-panels">${groups.map(group => `<section class="pricing-group" id="pricing-${group.id}" data-pricing-panel="${group.id}" hidden><button class="pricing-back" type="button" data-pricing-back><span aria-hidden="true">←</span> Retour aux priorités</button><div class="pricing-group__head"><div class="pricing-group__heading"><p>${group.label}</p><h3>${group.title}</h3><span class="pricing-group__description">${group.description}</span><span class="pricing-group__swipe">Glissez pour comparer&nbsp;→</span></div></div><div class="pricing-list">${group.ids.map(id => byId.get(id)).filter(Boolean).map(cardMarkup).join('')}</div></section>`).join('')}</div>`;

      const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
      tabs.forEach((button, index) => {
        button.addEventListener('click', () => {
          showDetail(button.dataset.group, { updateHash: true });
          root.querySelector(`#pricing-${button.dataset.group} .pricing-back`)?.focus();
        });
        button.addEventListener('keydown', event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          let next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
          tabs[next].focus();
        });
      });

      root.querySelectorAll('[data-pricing-back]').forEach(button => {
        button.addEventListener('click', () => {
          showChooser({ updateHash: true });
          root.querySelector('[role="tab"]')?.focus();
        });
      });

      const initial = validGroup(location.hash.slice(1));
      if (initial) showDetail(initial);
      else showChooser();
      addEventListener('hashchange', () => {
        const next = validGroup(location.hash.slice(1));
        next ? showDetail(next) : showChooser();
      });
    })
    .catch(() => {
      root.innerHTML = '<p class="pricing-error">Les offres ne sont pas disponibles pour le moment. Écrivez-nous : nous vous expliquerons les options sans vous engager.</p>';
    });
})();
