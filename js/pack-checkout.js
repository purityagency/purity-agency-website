/**
 * pack-checkout.js — Activation des 16 Packs Métier (Coiffure, Artisan, HoReCa, Praticien,
 * Immobilier, Avocat, Commerce, Fitness, Consulting, Formation, Garage, Finance, Photo,
 * Vétérinaire, Architecte, Aide à la Personne).
 *
 * Tunnel 3 étapes — même niveau d'exigence que order-modal.js (le tunnel briques) :
 *   1. Récap & confiance : ce qui est inclus, ventilation exacte du prix, garanties
 *   2. Brief business : nom d'entreprise, secteur précis, site existant, objectif
 *   3. Contact & paiement : coordonnées de facturation, récap final, CTA Mollie
 *
 * Réutilise les styles .ob-* injectés par order-modal.js pour rester visuellement cohérent.
 */
(function () {
  'use strict';

  var PACKS = {
    coiffure:    { name: 'Coiffure & Beauté',        pack: 'Pack Agenda Plein',       price: 1290, deposit: 387, monthly: 69,
      features: ['Agenda de réservation en ligne 24/7, sync avec vos rappels SMS anti no-show', 'Galerie de réalisations et avis clients Google mis en avant', 'Fiche Google Business optimisée pour "coiffeur près de moi"', 'Formulaire de contact/devis pour prestations sur-mesure'] },
    artisan:     { name: 'Artisan & Bâtiment',       pack: 'Pack Zéro Appel Perdu',   price: 1490, deposit: 447, monthly: 79,
      features: ['Standard IA qui répond même en dehors des heures de chantier', 'Formulaire de devis avec upload de photos du chantier', 'Portfolio de réalisations classé par type de travaux', 'Zone d\'intervention et avis clients mis en avant pour le SEO local'] },
    horeca:      { name: 'HoReCa & Restauration',    pack: 'Pack Toujours Ouvert',    price: 1490, deposit: 447, monthly: 79,
      features: ['Menu en ligne toujours à jour, mise en avant du plat du jour', 'Réservation de table en ligne connectée à votre agenda', 'Horaires et statut "ouvert/fermé" synchronisés en temps réel', 'Photos et avis clients pour convertir la recherche Google Maps'] },
    praticien:   { name: 'Praticien & Bien-être',    pack: 'Pack Cabinet Serein',     price: 1290, deposit: 387, monthly: 69,
      features: ['Prise de rendez-vous en ligne avec rappels automatiques', 'Présentation claire de vos soins, tarifs et spécialités', 'Fiche Google Business optimisée pour la recherche locale', 'Formulaire de premier contact confidentiel et rassurant'] },
    immobilier:  { name: 'Immobilier',               pack: 'Pack Agence Digitale',    price: 1490, deposit: 447, monthly: 79,
      features: ['Vitrine de biens à vendre/louer avec filtres de recherche', 'Formulaire d\'estimation en ligne pour capter des mandats', 'Fiches biens détaillées avec galerie photo soignée', 'Alerte automatique aux acquéreurs sur les nouveaux biens'] },
    avocat:      { name: 'Avocats & Juridique',      pack: 'Pack Cabinet Moderne',    price: 1490, deposit: 447, monthly: 79,
      features: ['Présentation claire de vos domaines de compétence', 'Prise de rendez-vous en ligne pour une première consultation', 'Articles/actualités juridiques pour asseoir votre autorité', 'Formulaire de contact confidentiel et conforme RGPD'] },
    commerce:    { name: 'Commerces & Retail',       pack: 'Pack Click & Collect',    price: 1990, deposit: 597, monthly: 99,
      features: ['Catalogue produits avec click & collect ou livraison', 'Gestion des stocks synchronisée, zéro survente', 'Fiche Google Business avec horaires et itinéraire en avant', 'Relance automatique des paniers abandonnés'] },
    fitness:     { name: 'Salles de Sport',          pack: 'Pack Membres Pro',        price: 1490, deposit: 447, monthly: 79,
      features: ['Réservation de cours en ligne avec places limitées', 'Présentation des formules d\'abonnement et essai gratuit', 'Planning des cours toujours à jour, zéro appel pour vérifier', 'Témoignages et transformations membres mis en avant'] },
    consulting:  { name: 'Consultants & B2B',        pack: 'Pack Expert Autorité',    price: 1290, deposit: 387, monthly: 69,
      features: ['Positionnement d\'expert avec études de cas chiffrées', 'Prise de rendez-vous qualifiée (audit gratuit, appel découverte)', 'Articles de fond pour le référencement et la crédibilité', 'Formulaire de contact avec qualification du besoin'] },
    formation:   { name: 'Formateurs & Coachs',      pack: 'Pack Académie',          price: 1990, deposit: 597, monthly: 99,
      features: ['Catalogue de formations avec dates et places disponibles', 'Inscription en ligne avec paiement ou acompte sécurisé', 'Témoignages et résultats d\'anciens participants', 'Newsletter et relances automatiques pré-session'] },
    garage:      { name: 'Garages & Concessions',    pack: 'Pack Atelier Connecté',   price: 1490, deposit: 447, monthly: 79,
      features: ['Prise de rendez-vous atelier en ligne, zéro appel manqué', 'Devis de réparation avec photo du véhicule concerné', 'Stock de véhicules d\'occasion mis en avant si applicable', 'Rappel automatique des entretiens et contrôles techniques'] },
    finance:     { name: 'Finance & Assurance',      pack: 'Pack Confiance Pro',      price: 1490, deposit: 447, monthly: 79,
      features: ['Simulateur ou formulaire de première estimation en ligne', 'Présentation claire de vos garanties et domaines d\'expertise', 'Prise de rendez-vous pour un premier bilan personnalisé', 'Conformité RGPD et mentions légales du secteur incluses'] },
    photo:       { name: 'Photographes & Vidéastes', pack: 'Pack Complet',           price: 1390, deposit: 417, monthly: 59,
      features: ['Portfolio ultra-rapide, galeries privées pour vos clients', 'Prise de RDV directe pour vos séances (shootings, événements)', 'Présentation de vos formules et tarifs par type de prestation', 'Livraison de galeries sécurisées par lien privé'] },
    veterinaire: { name: 'Santé Animale',             pack: 'Pack Complet',           price: 1490, deposit: 447, monthly: 79,
      features: ['Prise en charge des urgences via chatbot disponible 24/7', 'Prise de rendez-vous en ligne synchronisée avec votre agenda', 'Gestion des carnets de santé et rappels de vaccination', 'Fiche Google Business optimisée pour les urgences locales'] },
    architecte:  { name: 'Architectes & Déco',       pack: 'Pack Complet',           price: 1890, deposit: 567, monthly: 89,
      features: ['Présentation immersive de vos réalisations (avant/après, 3D)', 'Formulaire de qualification de projet (budget, surface, délais)', 'Espace client pour le suivi des dossiers en cours', 'Portfolio classé par type de projet (résidentiel, commercial…)'] },
    domicile:    { name: 'Aide à la Personne',       pack: 'Pack Complet',           price: 1490, deposit: 447, monthly: 79,
      features: ['Double tunnel : demandes clients et candidatures recrutement', 'Signature électronique des devis et contrats de prestation', 'Présentation rassurante de vos équipes et garanties', 'Formulaire de premier contact simple pour familles pressées'] }
  };

  var ERROR_MESSAGES = {
    invalid_sector: 'Secteur invalide. Rechargez la page et réessayez.',
    invalid_contact: 'Merci de vérifier votre nom et votre adresse e-mail.',
    mollie_not_configured: 'Le paiement en ligne n\'est pas encore configuré. Contactez-nous directement pour démarrer ce pack.',
    mollie_error: 'Le service de paiement a rencontré une erreur. Réessayez dans un instant.',
    storage: 'Une erreur technique est survenue. Réessayez dans un instant.',
    base_url_not_configured: 'Configuration serveur incomplète. Contactez-nous directement pour démarrer ce pack.'
  };

  var TOTAL_STEPS = 3;
  var currentSector = null;
  var currentStep = 1;
  var modal, errorBox, submitBtn;
  var briefData = {};

  function euro(n) {
    return n.toLocaleString('fr-BE') + ' €';
  }

  function injectModal() {
    if (document.getElementById('pack-modal')) return;

    var div = document.createElement('div');
    div.id = 'pack-modal';
    div.className = 'ob-modal';
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-modal', 'true');
    div.setAttribute('aria-hidden', 'true');

    div.innerHTML =
      '<div class="ob-backdrop" id="pk-backdrop"></div>' +
      '<div class="ob-shell" style="max-width:560px;">' +
        '<button class="ob-x" id="pk-close" aria-label="Fermer">✕</button>' +
        '<div class="ob-stage">' +

          // ── ÉTAPE 1 : RÉCAP & CONFIANCE ──
          '<div class="ob-panel" data-step="1">' +
            '<div class="ob-panel__inner">' +
              '<span class="ob-eyebrow">Étape 1 sur 3 · Votre pack</span>' +
              '<h2 class="ob-h2" id="pk-title">Pack</h2>' +
              '<p class="ob-sub" id="pk-sub"></p>' +

              '<ul class="pk-features" id="pk-features"></ul>' +

              '<div class="pk-price-table" id="pk-price-table"></div>' +

              '<div class="bk-badges pk-trust">' +
                '<span class="bk-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>Paiement sécurisé Mollie</span>' +
                '<span class="bk-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 6.9L21 9.3l-5.5 4.5L17 21l-5-4-5 4 1.5-7.2L3 9.3l6.6-.4z"/></svg>Sans engagement long terme</span>' +
                '<span class="bk-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Kickoff sous 24h</span>' +
              '</div>' +

              '<div class="ob-btn-row">' +
                '<button type="button" class="ob-submit" id="pk-next-1" style="width:100%;">Continuer →</button>' +
              '</div>' +
            '</div>' +
          '</div>' +

          // ── ÉTAPE 2 : BRIEF BUSINESS ──
          '<div class="ob-panel" data-step="2" hidden>' +
            '<div class="ob-panel__inner">' +
              '<span class="ob-eyebrow">Étape 2 sur 3 · Votre activité</span>' +
              '<h2 class="ob-h2">Parlez-nous de votre activité</h2>' +
              '<p class="ob-sub">Ces informations nous permettent de préparer votre kickoff avant même notre premier appel.</p>' +

              '<form id="pk-brief-form" class="ob-form">' +
                '<div class="ob-field"><label for="pk-business-name">Nom de votre entreprise <span class="ob-req">*</span></label><input type="text" id="pk-business-name" placeholder="Ex: Salon Marie Coiffure" required></div>' +
                '<div class="ob-form__row">' +
                  '<div class="ob-field"><label for="pk-city">Ville / zone d\'activité <span class="ob-req">*</span></label><input type="text" id="pk-city" placeholder="Ex: Charleroi et environs" required></div>' +
                  '<div class="ob-field"><label for="pk-existing">Site actuel</label><select id="pk-existing"><option value="none">Je n\'ai pas de site</option><option value="old">J\'ai un site à remplacer</option><option value="social">J\'ai seulement les réseaux sociaux</option></select></div>' +
                '</div>' +
                '<div class="ob-field"><label for="pk-goal">Votre priorité n°1 avec ce pack <span class="ob-req">*</span></label><input type="text" id="pk-goal" placeholder="Ex: Recevoir plus de réservations en ligne" required></div>' +

                '<div class="ob-addons-sec" style="margin-top:1.2rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.08);">' +
                  '<label style="font-weight:600;font-size:0.9rem;color:#fff;display:block;margin-bottom:0.6rem;">Personnalisez votre pack avec nos briques recommandées :</label>' +
                  '<div class="ob-addon-item" style="display:flex;align-items:center;justify-content:space-between;padding:0.6rem 0.8rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:10px;margin-bottom:0.5rem;">' +
                    '<label style="display:flex;align-items:center;gap:0.6rem;cursor:pointer;font-size:0.84rem;color:#eee;">' +
                      '<input type="checkbox" class="pk-addon-chk" data-price="490" data-deposit="147" data-monthly="39" data-name="Standard IA 24/7">' +
                      '<span><strong>Standard IA 24/7</strong> — Réponses & prise de RDV auto</span>' +
                    '</label>' +
                    '<span style="font-size:0.8rem;font-weight:600;color:#7c3aed;">+147 € aujourd\'hui</span>' +
                  '</div>' +
                  '<div class="ob-addon-item" style="display:flex;align-items:center;justify-content:space-between;padding:0.6rem 0.8rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:10px;margin-bottom:0.5rem;">' +
                    '<label style="display:flex;align-items:center;gap:0.6rem;cursor:pointer;font-size:0.84rem;color:#eee;">' +
                      '<input type="checkbox" class="pk-addon-chk" data-price="290" data-deposit="87" data-monthly="0" data-name="Domination Google Maps">' +
                      '<span><strong>Domination Google Maps</strong> — SEO Local Wallonie</span>' +
                    '</label>' +
                    '<span style="font-size:0.8rem;font-weight:600;color:#7c3aed;">+87 € aujourd\'hui</span>' +
                  '</div>' +
                  '<div class="ob-addon-item" style="display:flex;align-items:center;justify-content:space-between;padding:0.6rem 0.8rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:10px;margin-bottom:0.5rem;">' +
                    '<label style="display:flex;align-items:center;gap:0.6rem;cursor:pointer;font-size:0.84rem;color:#eee;">' +
                      '<input type="checkbox" class="pk-addon-chk" data-price="390" data-deposit="117" data-monthly="0" data-name="Identité Visual 2026">' +
                      '<span><strong>Identité Visuelle Liquid Glass</strong> — Logo & Charte</span>' +
                    '</label>' +
                    '<span style="font-size:0.8rem;font-weight:600;color:#7c3aed;">+117 € aujourd\'hui</span>' +
                  '</div>' +
                '</div>' +

                '<div class="ob-btn-row">' +
                  '<button type="button" class="ob-back" id="pk-back-2">← Retour</button>' +
                  '<button type="button" class="ob-submit" id="pk-next-2" style="width:auto;margin-top:0;">Suivant : Coordonnées →</button>' +
                '</div>' +
              '</form>' +
            '</div>' +
          '</div>' +

          // ── ÉTAPE 3 : CONTACT & PAIEMENT ──
          '<div class="ob-panel" data-step="3" hidden>' +
            '<div class="ob-panel__inner">' +
              '<span class="ob-eyebrow">Étape 3 sur 3 · Finalisation</span>' +
              '<h2 class="ob-h2">Vos coordonnées</h2>' +
              '<p class="ob-sub">Dernière étape avant le paiement sécurisé de votre acompte.</p>' +

              '<form id="pk-form" class="ob-form">' +
                '<div class="ob-form__row">' +
                  '<div class="ob-field"><label for="pk-name">Nom complet <span class="ob-req">*</span></label><input type="text" id="pk-name" required autocomplete="name"></div>' +
                  '<div class="ob-field"><label for="pk-company">N° BCE / TVA <span style="font-size:0.75rem;opacity:0.75;">(facultatif — émission directe du reçu B2B)</span></label><input type="text" id="pk-company" placeholder="Ex: 0123.456.789 ou BE0123456789" autocomplete="off"></div>' +
                '</div>' +
                '<div class="ob-form__row">' +
                  '<div class="ob-field"><label for="pk-email">E-mail <span class="ob-req">*</span></label><input type="email" id="pk-email" required autocomplete="email"></div>' +
                  '<div class="ob-field"><label for="pk-phone">Téléphone <span class="ob-req">*</span></label><input type="tel" id="pk-phone" required autocomplete="tel"></div>' +
                '</div>' +
                '<input type="text" name="website_verification" id="pk-hp" style="position:absolute;left:-9999px;" tabindex="-1" autocomplete="off">' +
                '<div id="pk-error" class="ob-form__error" hidden></div>' +

                '<div class="ob-order-recap" style="margin-top:1rem;">' +
                  '<span class="ob-order-recap__name" id="pk-recap-title">Pack</span>' +
                  '<span class="ob-order-recap__price" id="pk-recap-price">0 €</span>' +
                '</div>' +

                '<div class="ob-btn-row">' +
                  '<button type="button" class="ob-back" id="pk-back-3">← Retour</button>' +
                  '<button type="submit" class="ob-submit" id="pk-submit" style="width:auto;margin-top:0;"><span class="ob-submit__txt">Payer l\'acompte et démarrer</span><span class="ob-submit__spin" hidden></span></button>' +
                '</div>' +
              '</form>' +
            '</div>' +
          '</div>' +

        '</div>' +
      '</div>';

    document.body.appendChild(div);
    if (window.applyDict) window.applyDict();

    modal = div;
    errorBox = div.querySelector('#pk-error');
    submitBtn = div.querySelector('#pk-submit');

    div.querySelector('#pk-close').onclick = closeModal;
    div.querySelector('#pk-backdrop').onclick = closeModal;

    div.querySelector('#pk-next-1').onclick = function () { goToStep(2); };
    div.querySelector('#pk-back-2').onclick = function () { goToStep(1); };
    div.querySelector('#pk-next-2').onclick = handleBriefNext;
    div.querySelector('#pk-back-3').onclick = function () { goToStep(2); };
    div.querySelector('#pk-form').onsubmit = handleSubmit;
  }

  function showPanel(step) {
    modal.querySelectorAll('.ob-panel').forEach(function (p) {
      p.hidden = p.getAttribute('data-step') !== String(step);
    });
    currentStep = step;
    var focusTarget = modal.querySelector('.ob-panel:not([hidden]) input, .ob-panel:not([hidden]) button');
    if (focusTarget) focusTarget.focus();
  }

  function goToStep(step) {
    var fromEl = modal.querySelector('.ob-panel[data-step="' + currentStep + '"] .ob-panel__inner');
    var toEl = modal.querySelector('.ob-panel[data-step="' + step + '"] .ob-panel__inner');
    if (typeof gsap === 'undefined' || !fromEl || !toEl) { showPanel(step); return; }

    var dir = step > currentStep ? 1 : -1;
    gsap.to(fromEl, {
      opacity: 0, x: -24 * dir, duration: 0.22, ease: 'power2.in',
      onComplete: function () {
        showPanel(step);
        gsap.fromTo(toEl, { opacity: 0, x: 24 * dir }, { opacity: 1, x: 0, duration: 0.32, ease: 'power2.out' });
      }
    });
  }

  function handleBriefNext() {
    var name = modal.querySelector('#pk-business-name').value.trim();
    var city = modal.querySelector('#pk-city').value.trim();
    var goal = modal.querySelector('#pk-goal').value.trim();
    if (!name || !city || !goal) {
      modal.querySelector('#pk-business-name').reportValidity();
      modal.querySelector('#pk-city').reportValidity();
      modal.querySelector('#pk-goal').reportValidity();
      return;
    }
    briefData = {
      business_name: name,
      city: city,
      existing_site: modal.querySelector('#pk-existing').value,
      goal: goal
    };
    goToStep(3);
  }

  function openModal(sector) {
    var pack = PACKS[sector];
    if (!pack) return;

    injectModal();
    currentSector = sector;
    briefData = {};

    errorBox.hidden = true;
    modal.querySelector('#pk-brief-form').reset();
    modal.querySelector('#pk-form').reset();

    modal.querySelector('#pk-title').innerHTML = 'Activer : <em>' + pack.pack + '</em>';
    modal.querySelector('#pk-sub').textContent = pack.name + ' — tout ce qu\'il vous faut pour convertir vos visiteurs en clients.';

    var featuresEl = modal.querySelector('#pk-features');
    featuresEl.innerHTML = pack.features.map(function (f) {
      return '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>' + f + '</span></li>';
    }).join('');

    var remaining = pack.price - pack.deposit;
    modal.querySelector('#pk-price-table').innerHTML =
      '<div class="pk-price-row"><span>Aujourd\'hui — acompte (30 %)</span><strong>' + euro(pack.deposit) + '</strong></div>' +
      '<div class="pk-price-row"><span>À la livraison — solde</span><strong>' + euro(remaining) + '</strong></div>' +
      '<div class="pk-price-row pk-price-row--monthly"><span>Suivi mensuel dès la mise en ligne</span><strong>' + euro(pack.monthly) + '/mois</strong></div>' +
      '<div class="pk-price-row pk-price-row--total"><span>Valeur totale du pack</span><strong>' + euro(pack.price) + '</strong></div>';

    modal.querySelector('#pk-recap-title').textContent = pack.pack;
    modal.querySelector('#pk-recap-price').textContent = euro(pack.deposit) + ' aujourd\'hui';

    showPanel(1);
    modal.classList.add('is-open');
    modal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';

    if (window.PurityFocusTrap) window.PurityFocusTrap.attach(modal.querySelector('.ob-shell'));

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(modal.querySelector('.ob-shell'),
        { opacity: 0, y: 20, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
      );
    }
  }

  function closeModal() {
    if (!modal) return;
    if (window.PurityFocusTrap) window.PurityFocusTrap.release();
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (modal.querySelector('#pk-hp').value.trim()) return; // honeypot anti-spam

    var name    = modal.querySelector('#pk-name').value.trim();
    var email   = modal.querySelector('#pk-email').value.trim();
    var phone   = modal.querySelector('#pk-phone').value.trim();
    var company = modal.querySelector('#pk-company').value.trim();

    errorBox.hidden = true;
    submitBtn.disabled = true;
    submitBtn.querySelector('.ob-submit__txt').textContent = 'Redirection vers le paiement...';
    submitBtn.querySelector('.ob-submit__spin').hidden = false;

    fetch('/api/order/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sector: currentSector,
        name: name, email: email, phone: phone, company: company,
        brief: briefData
      })
    })
      .then(function (res) {
        return res.json().then(function (data) { return { ok: res.ok, data: data }; });
      })
      .then(function (result) {
        if (result.ok && result.data.sessionUrl) {
          window.location.href = result.data.sessionUrl;
          return;
        }
        showError(ERROR_MESSAGES[result.data.error] || 'Une erreur est survenue. Réessayez dans un instant.');
      })
      .catch(function () {
        showError('Connexion impossible. Vérifiez votre réseau et réessayez.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.querySelector('.ob-submit__txt').textContent = 'Payer l\'acompte et démarrer';
        submitBtn.querySelector('.ob-submit__spin').hidden = true;
      });
  }

  function init() {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.ob-trigger[data-open-ob]');
      if (!trigger) return;
      e.preventDefault();
      openModal(trigger.getAttribute('data-open-ob'));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
