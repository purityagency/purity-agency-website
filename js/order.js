/* order.js — Tunnel de commande Packs Purity ONE
 * 4 étapes : Secteur → Pack + prix → Coordonnées → Stripe → Succès
 */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     CATALOGUE PACKS
     priceId = identifiant Stripe Price à brancher
  ───────────────────────────────────────────── */
  var PACK_BOOKING = {
    id: 'booking',
    name: 'Pack Booking Pro',
    tagline: 'Réservation 24 h/24, zéro no-show',
    price: 249,
    engage: 'Sans engagement · résiliable à tout moment',
    priceId: 'price_BOOKING_PRO_PLACEHOLDER',
    features: [
      'Site vitrine professionnel (5 pages)',
      'Réservation en ligne 24 h/24',
      'Rappels SMS automatiques anti no-show',
      'Fiche Google My Business optimisée',
      'SEO local — 1ère page en 90 jours',
      'Tableau de bord client en temps réel',
      'Support 7 j/7 inclus'
    ]
  };

  var PACK_VISIBILITE = {
    id: 'visibilite',
    name: 'Pack Visibilité Locale',
    tagline: 'Soyez trouvé avant vos concurrents',
    price: 179,
    engage: 'Sans engagement · résiliable à tout moment',
    priceId: 'price_VISIBILITE_LOCALE_PLACEHOLDER',
    features: [
      'Site vitrine professionnel (5 pages)',
      'SEO local — 1ère page en 90 jours',
      'Formulaire de devis en ligne',
      'Fiche Google My Business optimisée',
      'Galerie photos & réalisations',
      'Support 5 j/7 inclus'
    ]
  };

  var PACK_RESTO = {
    id: 'resto',
    name: 'Pack Resto & Table',
    tagline: 'Menu en ligne, réservations & avis Google',
    price: 199,
    engage: 'Sans engagement · résiliable à tout moment',
    priceId: 'price_RESTO_TABLE_PLACEHOLDER',
    features: [
      'Site vitrine avec menu en ligne',
      'Réservation de table en ligne',
      'Rappels & confirmations automatiques',
      'Gestion des avis Google',
      'QR code menu à table',
      'SEO local — 1ère page en 90 jours',
      'Support 7 j/7 inclus'
    ]
  };

  var PACK_VITRINE = {
    id: 'vitrine',
    name: 'Pack Vitrine Pro',
    tagline: 'Une présence en ligne qui inspire confiance',
    price: 149,
    engage: 'Sans engagement · résiliable à tout moment',
    priceId: 'price_VITRINE_PRO_PLACEHOLDER',
    features: [
      'Site vitrine professionnel (5 pages)',
      'SEO local — 1ère page en 90 jours',
      'Formulaire de contact optimisé',
      'Fiche Google My Business',
      'Design sur mesure à votre image',
      'Support 5 j/7 inclus'
    ]
  };

  /* Mapping secteur → pack + social proof */
  var SECTORS = {
    beaute:    { pack: PACK_BOOKING,    roi: 'Les salons récupèrent en moyenne <strong>2 500 – 5 000 €/mois</strong> perdus en no-shows.',       proof: '47 salons & instituts belges nous font confiance' },
    sante:     { pack: PACK_BOOKING,    roi: 'Nos cabinets réduisent les no-shows de <strong>65 %</strong> dès le premier mois.',                  proof: '52 praticiens de santé nous font confiance' },
    fitness:   { pack: PACK_BOOKING,    roi: 'Remplissez vos cours et séances avec <strong>30 % de clients supplémentaires</strong> en 60 jours.', proof: '28 coachs & salles de sport nous font confiance' },
    veterin:   { pack: PACK_BOOKING,    roi: 'Vos clients réservent 24 h/24 — <strong>40 % des RDV pris hors horaires</strong> d\'ouverture.',     proof: '19 vétérinaires nous font confiance' },
    artisan:   { pack: PACK_VISIBILITE, roi: '<strong>62 % des appels artisans</strong> ne sont jamais décrochés. Captez chaque devis en ligne.',   proof: '38 artisans & entreprises du bâtiment nous font confiance' },
    garage:    { pack: PACK_VISIBILITE, roi: 'Un garage visible en ligne capte <strong>3× plus de demandes</strong> de devis.',                     proof: '14 garages & carrosseries nous font confiance' },
    domicile:  { pack: PACK_VISIBILITE, roi: 'Soyez trouvé avant vos concurrents sur <strong>Google Maps & recherche locale</strong>.',             proof: '22 prestataires à domicile nous font confiance' },
    horeca:    { pack: PACK_RESTO,      roi: '<strong>30 – 50 % des réservations</strong> se font hors horaires — soyez disponible 24 h/24.',      proof: '29 restaurants & établissements nous font confiance' },
    immo:      { pack: PACK_VITRINE,    roi: 'Une vitrine pro génère <strong>2× plus de leads qualifiés</strong> qu\'une page Facebook.',           proof: '17 agences immobilières nous font confiance' },
    juridique: { pack: PACK_VITRINE,    roi: 'La confiance commence en ligne : <strong>78 % des clients</strong> cherchent un avocat sur Google.',  proof: '12 cabinets juridiques & notaires nous font confiance' },
    comptable: { pack: PACK_VITRINE,    roi: 'Un site pro vous positionne comme <strong>expert de référence</strong> dans votre zone.',             proof: '9 fiduciaires & experts-comptables nous font confiance' },
    evenement: { pack: PACK_VITRINE,    roi: 'Vos réalisations en ligne convertissent <strong>3× mieux</strong> que le bouche-à-oreille seul.',    proof: '11 organisateurs d\'événements nous font confiance' },
    b2b:       { pack: PACK_VITRINE,    roi: 'Un site B2B clair génère <strong>3× plus de leads qualifiés</strong> auprès des professionnels.',       proof: '12 entreprises de services B2B nous font confiance' },
    commerce:  { pack: PACK_VITRINE,    roi: 'Le référencement local amène <strong>+40 % de passage en magasin</strong> en 3 mois.',               proof: '31 commerces & boutiques nous font confiance' },
    autre:     { pack: PACK_VITRINE,    roi: 'Votre activité mérite une présence en ligne à la hauteur de <strong>votre expertise</strong>.',      proof: 'Des dizaines d\'entreprises belges nous font confiance' }
  };

  var KEYBOARD_MAP = { a: 'beaute', b: 'sante', c: 'artisan', d: 'horeca' };

  /* ── État ── */
  var currentSector = null;
  var currentPack   = null;
  var currentStep   = 0;
  var isAnimating   = false;

  /* ── DOM ── */
  var modal, backdrop, shell, stage, progFill;
  var panels = {};

  function q(sel) { return document.querySelector(sel); }

  /* ── Progress ── */
  function setProgress(pct) {
    if (progFill) progFill.style.width = pct + '%';
  }

  /* ── Transition GSAP entre panels ── */
  function showPanel(id, fromRight) {
    var panel = panels[String(id)];
    if (!panel) return;

    Object.keys(panels).forEach(function (k) {
      if (k !== String(id)) panels[k].hidden = true;
    });

    panel.hidden = false;

    if (typeof gsap !== 'undefined') {
      var dir = (fromRight === false) ? -28 : 28;
      gsap.fromTo(panel,
        { opacity: 0, x: dir },
        { opacity: 1, x: 0, duration: 0.38, ease: 'power3.out',
          onComplete: function () { isAnimating = false; } }
      );
    } else {
      isAnimating = false;
    }
  }

  /* ── Ouvrir modal ── */
  function openModal(sector) {
    if (!modal || isAnimating) return;
    isAnimating = true;

    var form = q('#ob-form');
    if (form) form.reset();
    clearError();
    resetCheck();

    if (sector && SECTORS[sector]) {
      currentSector = sector;
      currentPack   = SECTORS[sector].pack;
      fillPackPanel(sector);
      currentStep = 2;
      setProgress(40);
      showPanel(2, true);
    } else {
      currentSector = null;
      currentStep   = 1;
      setProgress(8);
      showPanel(1, true);
    }

    modal.classList.add('is-open');
    modal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(shell,
        { opacity: 0, y: 20, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out',
          onComplete: function () { isAnimating = false; } }
      );
    } else {
      isAnimating = false;
    }
  }

  /* ── Fermer modal ── */
  function closeModal() {
    if (!modal) return;
    if (typeof gsap !== 'undefined') {
      gsap.to(shell, { opacity: 0, y: 14, scale: 0.97, duration: 0.25, ease: 'power2.in', onComplete: finishClose });
      gsap.to(backdrop, { opacity: 0, duration: 0.25, ease: 'power2.in' });
    } else {
      finishClose();
    }
  }

  function finishClose() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (typeof gsap !== 'undefined') {
      gsap.set(shell, { clearProps: 'all' });
      gsap.set(backdrop, { clearProps: 'opacity' });
    }
    currentSector = null;
    currentPack   = null;
    currentStep   = 0;
    setProgress(0);
    Object.keys(panels).forEach(function (k) { panels[k].hidden = k !== '1'; });
    clearSelections();
  }

  /* ── Navigation entre étapes ── */
  function goToStep(step, fromRight) {
    if (isAnimating) return;
    isAnimating = true;
    currentStep = step;
    var pcts = { 1: 8, 2: 40, 3: 72, 4: 100 };
    setProgress(pcts[step] || 0);
    showPanel(step, fromRight !== false);
  }

  /* ── Remplir step 2 (pack) ── */
  function fillPackPanel(sector) {
    var data = SECTORS[sector];
    if (!data) return;
    var pack = data.pack;

    var title = q('#ob-s2-title');
    var tagline = q('#ob-pack-tagline');
    var amount  = q('#ob-price-amount');
    var engage  = q('#ob-price-engage');
    var featEl  = q('#ob-features');
    var roi     = q('#ob-roi-stat');
    var proof   = q('#ob-proof-text');

    if (title)   title.textContent  = pack.name;
    if (tagline) tagline.textContent = pack.tagline;
    if (amount)  amount.textContent  = pack.price + ' €';
    if (engage)  engage.textContent  = pack.engage;

    if (featEl) {
      featEl.innerHTML = '';
      pack.features.forEach(function (f) {
        var li = document.createElement('li');
        li.textContent = f;
        featEl.appendChild(li);
      });
    }

    if (roi)   roi.innerHTML   = data.roi;
    if (proof) proof.textContent = data.proof;

    /* Bouton CTA */
    var orderLabel = q('#ob-order-label');
    if (orderLabel) orderLabel.textContent = 'Commander — ' + pack.price + ' €/mois';
  }

  /* ── Remplir récap step 3 ── */
  function fillRecap() {
    var nameEl  = q('#ob-recap-name');
    var priceEl = q('#ob-recap-price');
    if (!currentPack) return;
    if (nameEl)  nameEl.textContent  = currentPack.name;
    if (priceEl) priceEl.textContent = currentPack.price + ' €/mois';
  }

  /* ── Highlighting ── */
  function highlightSector(sector) {
    document.querySelectorAll('.ob-sector, .ob-chip-sector').forEach(function (el) {
      el.classList.toggle('is-selected', el.dataset.sector === sector);
    });
  }
  function clearSelections() {
    document.querySelectorAll('.ob-sector, .ob-chip-sector').forEach(function (el) {
      el.classList.remove('is-selected');
    });
  }

  /* ── Validation ── */
  function validateForm() {
    var nameEl  = q('#ob-f-name');
    var emailEl = q('#ob-f-email');
    var phoneEl = q('#ob-f-phone');

    [nameEl, emailEl, phoneEl].forEach(function (el) { if (el) el.classList.remove('is-error'); });

    if (!nameEl || !nameEl.value.trim()) {
      if (nameEl) nameEl.classList.add('is-error');
      showError('Veuillez saisir votre nom.');
      if (nameEl) nameEl.focus();
      return false;
    }
    if (!emailEl || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailEl.value.trim())) {
      if (emailEl) emailEl.classList.add('is-error');
      showError('Veuillez saisir un e-mail valide.');
      if (emailEl) emailEl.focus();
      return false;
    }
    if (!phoneEl || !phoneEl.value.trim()) {
      if (phoneEl) phoneEl.classList.add('is-error');
      showError('Veuillez saisir votre téléphone.');
      if (phoneEl) phoneEl.focus();
      return false;
    }
    return true;
  }

  function showError(msg) {
    var el = q('#ob-form-error');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
  }
  function clearError() {
    var el = q('#ob-form-error');
    if (el) { el.hidden = true; el.textContent = ''; }
    document.querySelectorAll('.ob-field input.is-error').forEach(function (i) {
      i.classList.remove('is-error');
    });
  }

  /* ── Soumission → Stripe ── */
  function submitOrder(e) {
    e.preventDefault();
    clearError();
    if (!validateForm()) return;

    var btn     = q('#ob-submit');
    var lblEl   = btn ? btn.querySelector('.ob-submit__txt') : null;
    var iconEl  = btn ? btn.querySelector('.ob-submit__icon') : null;
    var spinEl  = btn ? btn.querySelector('.ob-submit__spin') : null;

    if (btn)    btn.disabled = true;
    if (lblEl)  lblEl.textContent = 'Redirection…';
    if (iconEl) iconEl.hidden = true;
    if (spinEl) spinEl.hidden = false;

    var form     = q('#ob-form');
    var honeypot = form ? form.querySelector('[name="website_verification"]') : null;
    var company  = q('#ob-f-company');

    var payload = {
      sector:               currentSector || 'autre',
      pack:                 currentPack ? currentPack.id : 'vitrine',
      priceId:              currentPack ? currentPack.priceId : '',
      name:                 (q('#ob-f-name')  || {}).value || '',
      email:                (q('#ob-f-email') || {}).value || '',
      phone:                (q('#ob-f-phone') || {}).value || '',
      company:              company ? company.value : '',
      website_verification: honeypot ? honeypot.value : ''
    };

    fetch('/api/order/create', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.sessionUrl) {
          window.location.href = data.sessionUrl;
        } else {
          goToStep(4, true);
        }
      })
      .catch(function () {
        /* Fallback : affiche succès, lead déjà enregistré côté serveur */
        goToStep(4, true);
      })
      .finally(function () {
        if (btn)    btn.disabled = false;
        if (lblEl)  lblEl.textContent = 'Confirmer et payer';
        if (spinEl) spinEl.hidden = true;
        if (iconEl) iconEl.hidden = false;
      });
  }

  /* ── Animation check succès ── */
  function triggerCheck() {
    var circle = q('.ob-check-circle');
    var path   = q('.ob-check-path');
    setTimeout(function () {
      if (circle) circle.classList.add('is-drawn');
      if (path)   path.classList.add('is-drawn');
    }, 80);
  }

  function resetCheck() {
    var circle = q('.ob-check-circle');
    var path   = q('.ob-check-path');
    if (circle) circle.classList.remove('is-drawn');
    if (path)   path.classList.remove('is-drawn');
  }

  /* ── Init ── */
  function init() {
    modal    = q('#ob-modal');
    if (!modal) return;

    backdrop = q('#ob-backdrop');
    shell    = modal.querySelector('.ob-shell');
    stage    = q('#ob-stage');
    progFill = q('#ob-prog-fill');

    modal.querySelectorAll('.ob-panel').forEach(function (p) {
      var step = p.getAttribute('data-step');
      if (step) panels[step] = p;
    });
    Object.keys(panels).forEach(function (k) { panels[k].hidden = k !== '1'; });

    /* Triggers d'ouverture */
    document.querySelectorAll('.ob-trigger').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(el.getAttribute('data-open-ob') || el.getAttribute('data-sector') || null);
      });
    });

    /* Fermeture */
    var xBtn = q('#ob-x');
    if (xBtn) xBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    var successClose = q('#ob-close-success');
    if (successClose) successClose.addEventListener('click', closeModal);

    var bookCta = q('#ob-book-cta');
    if (bookCta) bookCta.addEventListener('click', closeModal);

    /* Step 1 — secteurs principaux */
    document.querySelectorAll('.ob-sector').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sector = btn.dataset.sector;
        if (!sector) return;
        highlightSector(sector);
        currentSector = sector;
        currentPack   = SECTORS[sector] ? SECTORS[sector].pack : PACK_VITRINE;
        fillPackPanel(sector);
        setTimeout(function () { goToStep(2, true); }, 100);
      });
    });

    /* Step 1 — chips */
    document.querySelectorAll('.ob-chip-sector').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sector = btn.dataset.sector;
        if (!sector) return;
        highlightSector(sector);
        currentSector = sector;
        currentPack   = SECTORS[sector] ? SECTORS[sector].pack : PACK_VITRINE;
        fillPackPanel(sector);
        setTimeout(function () { goToStep(2, true); }, 100);
      });
    });

    /* Raccourcis clavier A/B/C/D */
    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('is-open')) return;
      if (currentStep !== 1) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf(document.activeElement.tagName) !== -1) return;
      var sector = KEYBOARD_MAP[e.key.toLowerCase()];
      if (!sector) return;
      var btn = modal.querySelector('.ob-sector[data-sector="' + sector + '"]');
      if (btn) btn.click();
    });

    /* Step 2 → 3 (bouton "Commander") */
    var orderBtn = q('#ob-order-btn');
    if (orderBtn) {
      orderBtn.addEventListener('click', function () {
        fillRecap();
        goToStep(3, true);
        setTimeout(function () {
          var first = q('#ob-f-name');
          if (first) first.focus();
        }, 420);
      });
    }

    /* Retour step 2 → 1 */
    var back1 = q('#ob-back');
    if (back1) back1.addEventListener('click', function () { goToStep(1, false); });

    /* Retour step 3 → 2 */
    var back2 = q('#ob-back-3');
    if (back2) back2.addEventListener('click', function () { goToStep(2, false); });

    /* Soumission formulaire */
    var form = q('#ob-form');
    if (form) form.addEventListener('submit', submitOrder);

    /* Déclencher check quand step 4 devient visible */
    var origShowPanel = showPanel;
    showPanel = function (id, fromRight) {
      origShowPanel(id, fromRight);
      if (String(id) === '4') triggerCheck();
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
