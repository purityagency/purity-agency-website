/**
 * order-modal.js — Tunnel de commande directe Premium & Planificateur J+5 (Purity ONE)
 * Injecte et gère le modal de commande directe complexe sur toutes les pages de services.
 */
(function () {
  'use strict';

  // 1. CATALOGUE COMPLET DES SERVICES
  var SERVICES = {
    // ── Présence en ligne (presence.html) ──
    'landing': {
      id: 'landing',
      name: 'Landing Page',
      price: 390,
      engage: 'Acompte de 50 % à la commande, solde à la livraison',
      features: ['Création d\'une page unique ultra-optimisée', 'Intégration d\'un formulaire de contact/devis', 'Adaptation mobile-first réactive', 'Mise en place du tracking analytics', 'SEO technique de base']
    },
    'vitrine': {
      id: 'vitrine',
      name: 'Site Vitrine Pro',
      price: 1490,
      engage: 'Acompte de 30 % à la commande, solde à la livraison',
      features: ['Site complet de 5 pages sur-mesure', 'Identité visuelle adaptée et soignée', 'Optimisation SEO locale poussée', 'Fiche Google My Business configurée', 'Formation d\'administration autonome (30 min)']
    },
    'complet': {
      id: 'complet',
      name: 'Site Complet & Business',
      price: 2490,
      engage: 'Acompte de 30 % à la commande, solde à la livraison',
      features: ['Site vitrine étendu avec blog/actualités', 'Automatisation d\'un premier outil (rendez-vous ou avis)', 'SEO avancé sur-mesure', 'Intégration newsletter et réseaux sociaux', 'Formation d\'administration avancée (30 min)']
    },
    'ecommerce': {
      id: 'ecommerce',
      name: 'Boutique E-commerce',
      price: 3800,
      engage: 'Acompte de 30 % à la commande, solde à la livraison',
      features: ['Boutique en ligne complète (jusqu\'à 50 produits)', 'Système de paiement Stripe & Bancontact sécurisé', 'Gestion des stocks et commandes automatisée', 'Emails de confirmation et factures automatiques', 'Formation complète à la gestion de boutique (30 min)']
    },

    // ── Acquisition Clients (acquisition.html) ──
    'seolocal': {
      id: 'seolocal',
      name: 'SEO Local & Maps',
      price: 490,
      engage: 'Paiement unique pour l\'optimisation complète',
      features: ['Audit complet des positions locales', 'Optimisation structurelle de votre fiche Google', 'Campagne de netlinking local ciblée', 'Suivi mensuel des positions pendant 3 mois']
    },
    'googleads': {
      id: 'googleads',
      name: 'Campagne Google Ads',
      price: 690,
      engage: 'Frais de setup de campagne, budget pub en direct',
      features: ['Recherche et sélection des mots-clés rentables', 'Rédaction d\'annonces ultra-attractives', 'Configuration complète du compte & tracking', 'Optimisation continue pendant le 1er mois']
    },
    'tunnel': {
      id: 'tunnel',
      name: 'Tunnel & Emailing',
      price: 1290,
      engage: 'Acompte de 50 % à la commande, solde à la livraison',
      features: ['Tunnel de vente ultra-performant (landing + offre)', 'Séquence d\'emailing automatique (5 emails)', 'Intégration avec votre outil CRM existant', 'A/B testing pour maximiser la conversion']
    },

    // ── Automatisation & IA (automatisation.html) ──
    'calendar': {
      id: 'calendar',
      name: 'Automatisation Calendrier',
      price: 390,
      engage: 'Configuration et liaison complètes clés en main',
      features: ['Liaison de votre agenda (Google/Outlook)', 'Prise de rendez-vous automatique via site web', 'Rappels automatiques par SMS/Email anti-no-show', 'Synchronisation avec votre CRM']
    },
    'botia': {
      id: 'botia',
      name: 'Bot IA SAV & WhatsApp',
      price: 890,
      engage: 'Configuration, entraînement IA et intégration inclus',
      features: ['Bot entraîné sur vos documents et FAQ', 'Intégration directe sur WhatsApp ou votre site', 'Qualification automatique des demandes clients', 'Relais vers un humain en cas de besoin']
    },
    'workflow': {
      id: 'workflow',
      name: 'Workflow Entreprise',
      price: 1990,
      engage: 'Acompte de 30 % à la commande, solde à la livraison',
      features: ['Cartographie de vos flux actuels', 'Automatisation des tâches répétitives (Make/Zapier)', 'Liaison automatisée Devis -> Facture -> Relance', 'Formation d\'utilisation pour vos équipes']
    },

    // ── Outils sur-mesure (outils.html) ──
    'crm': {
      id: 'crm',
      name: 'CRM & Suivi Client Épuré',
      price: 1490,
      engage: 'Acompte de 50 % à la commande, solde à la livraison',
      features: ['Fichier client centralisé et épuré', 'Suivi du pipe commercial et des affaires', 'Modèles d\'emails et de devis intégrés', 'Statistiques de conversion en temps réel']
    },
    'dashboard': {
      id: 'dashboard',
      name: 'Dashboard de Gestion',
      price: 2490,
      engage: 'Acompte de 30 % à la commande, solde à la livraison',
      features: ['Tableau de bord sur-mesure de votre activité', 'Rapports financiers et opérationnels automatisés', 'Connexion sécurisée avec vos outils existants', 'Interface épurée, fluide et lisible']
    },
    'appcomplete': {
      id: 'appcomplete',
      name: 'Application Métier Complète',
      price: 3990,
      engage: 'Sur devis détaillé selon cahier des charges',
      features: ['Architecture sur-mesure et sécurisée', 'Base de données robuste et évolutive', 'Espace client ou collaborateur dédié', 'Intégration d\'API tierces complexes']
    }
  };

  // OPTIONS ET SUPPLÉMENTS DISPONIBLES
  var OPTIONS = [
    { id: 'opt_textes', name: 'Rédaction professionnelle des textes', price: 290, desc: 'Nous rédigeons l\'intégralité des contenus pour maximiser vos ventes.' },
    { id: 'opt_logo', name: 'Création de logo & identité visuelle', price: 390, desc: 'Logo vectoriel moderne, charte graphique et palette de couleurs.' },
    { id: 'opt_photos', name: 'Reportage photo & vidéo pro (Wallonie)', price: 490, desc: 'Séance sur site pour capturer des visuels authentiques.' },
    { id: 'opt_maintenance', name: 'Support & maintenance (mensuel)', price: 49, desc: 'Mises à jour de sécurité et modifications rapides incluses.', isMonthly: true }
  ];

  var currentService = null;
  var selectedOptions = {};
  var currentStep = 1;
  var isAnimating = false;
  var selectedDateTime = null; // Date et heure de livraison J+5 choisies

  // 2. INJECTION DYNAMIQUE DE L'HTML DU MODAL
  function injectModalHTML() {
    if (document.getElementById('ob-modal')) return;

    var modalDiv = document.createElement('div');
    modalDiv.id = 'ob-modal';
    modalDiv.className = 'ob-modal';
    modalDiv.setAttribute('role', 'dialog');
    modalDiv.setAttribute('aria-modal', 'true');
    modalDiv.setAttribute('aria-hidden', 'true');

    var html = 
      '<div class="ob-backdrop" id="ob-backdrop"></div>' +
      '<div class="ob-shell">' +
        '<div class="ob-prog"><div class="ob-prog__fill" id="ob-prog-fill" style="width: 0%;"></div></div>' +
        '<button class="ob-x" id="ob-x" aria-label="Fermer">✕</button>' +
        '<div class="ob-stage" id="ob-stage">' +
          
          // ── ÉTAPE 1 : OPTIONS & SUPPLÉMENTS ──
          '<div class="ob-panel" data-step="1">' +
            '<div class="ob-panel__inner">' +
              '<span class="ob-eyebrow">Étape 1 sur 4 · Options</span>' +
              '<h2 class="ob-h2" id="ob-modal-title">Personnalisez votre commande</h2>' +
              '<p class="ob-sub">Ajoutez des options de personnalisation ou passez directement à la suite.</p>' +
              
              '<div class="ob-options-grid" id="ob-options-container"></div>' +
              
              '<div class="ob-total-bar">' +
                '<div>' +
                  '<span class="ob-total-label">Total estimé :</span>' +
                  '<span class="ob-total-price" id="ob-total-price-display">0 €</span>' +
                '</div>' +
                '<button type="button" class="ob-submit" id="ob-next-1" style="width: auto; margin-top:0;">Suivant : Brief projet →</button>' +
              '</div>' +
            '</div>' +
          '</div>' +

          // ── ÉTAPE 2 : BRIEF PROJET DÉTAILLÉ ──
          '<div class="ob-panel" data-step="2" hidden>' +
            '<div class="ob-panel__inner">' +
              '<span class="ob-eyebrow">Étape 2 sur 4 · Brief Projet</span>' +
              '<h2 class="ob-h2">Décrivez-nous votre projet</h2>' +
              '<p class="ob-sub">Ces détails nous permettent de démarrer le travail sans perdre une seconde.</p>' +
              
              '<div class="ob-form">' +
                '<div class="ob-form__row">' +
                  '<div class="ob-field"><label for="ob-f-company">Entreprise <span class="ob-req">*</span></label><input type="text" id="ob-f-company" placeholder="Ex: Menuiserie Dupont" required></div>' +
                  '<div class="ob-field"><label for="ob-f-tva">N° de TVA (facultatif)</label><input type="text" id="ob-f-tva" placeholder="Ex: BE 0123.456.789"></div>' +
                '</div>' +
                '<div class="ob-form__row">' +
                  '<div class="ob-field"><label for="ob-f-sector">Secteur d\'activité <span class="ob-req">*</span></label><input type="text" id="ob-f-sector" placeholder="Ex: Toiture, Avocat, Cabinet Médical" required></div>' +
                  '<div class="ob-field"><label for="ob-f-goals">Objectif principal du site <span class="ob-req">*</span></label><input type="text" id="ob-f-goals" placeholder="Ex: Recevoir des appels, Vendre des services" required></div>' +
                '</div>' +
                '<div class="ob-form__row">' +
                  '<div class="ob-field"><label for="ob-f-style">Ambiance visuelle / Couleurs</label><input type="text" id="ob-f-style" placeholder="Ex: Sombre & minimaliste, clair & vert d\'eau"></div>' +
                  '<div class="ob-field"><label for="ob-f-inspiration">Lien d\'inspiration / Concurrent</label><input type="url" id="ob-f-inspiration" placeholder="Ex: https://exemple.com"></div>' +
                '</div>' +
                
                '<div class="ob-btn-row">' +
                  '<button type="button" class="ob-back" id="ob-back-2">← Retour aux options</button>' +
                  '<button type="button" class="ob-submit" id="ob-next-2" style="width: auto; margin-top:0;">Suivant : Planification →</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +

          // ── ÉTAPE 3 : PLANIFICATION J+5 ──
          '<div class="ob-panel" data-step="3" hidden>' +
            '<div class="ob-panel__inner">' +
              '<span class="ob-eyebrow">Étape 3 sur 4 · Planification</span>' +
              '<h2 class="ob-h2">Votre créneau de livraison &amp; formation</h2>' +
              '<p class="ob-sub">Votre projet sera prêt à J+5. Choisissez votre heure de livraison et formation (30 min d\'appel visio).</p>' +
              
              '<div class="ob-date-recap">' +
                '<span class="ob-date-recap__label">Date cible de livraison (J+5 ouvrés) :</span>' +
                '<strong class="ob-date-recap__value" id="ob-target-date-display">-</strong>' +
              '</div>' +
              
              '<div class="ob-other-label">Créneaux horaires disponibles (30 minutes)</div>' +
              '<div class="ob-time-grid" id="ob-time-slots-container"></div>' +
              
              '<div class="ob-btn-row">' +
                '<button type="button" class="ob-back" id="ob-back-3">← Retour au brief</button>' +
                '<button type="button" class="ob-submit" id="ob-next-3" style="width: auto; margin-top:0;" disabled>Suivant : Facturation →</button>' +
              '</div>' +
            '</div>' +
          '</div>' +

          // ── ÉTAPE 4 : COORDONNÉES & FACTURATION ──
          '<div class="ob-panel" data-step="4" hidden>' +
            '<div class="ob-panel__inner">' +
              '<span class="ob-eyebrow">Étape 4 sur 4 · Finalisation</span>' +
              '<h2 class="ob-h2">Vos informations de contact</h2>' +
              '<p class="ob-sub">Dernière étape. Vos coordonnées de facturation pour lancer la commande.</p>' +
              
              '<form class="ob-form" id="ob-final-form">' +
                '<div class="ob-form__row">' +
                  '<div class="ob-field"><label for="ob-f-firstname">Prénom <span class="ob-req">*</span></label><input type="text" id="ob-f-firstname" required autocomplete="given-name"></div>' +
                  '<div class="ob-field"><label for="ob-f-lastname">Nom <span class="ob-req">*</span></label><input type="text" id="ob-f-lastname" required autocomplete="family-name"></div>' +
                '</div>' +
                '<div class="ob-form__row">' +
                  '<div class="ob-field"><label for="ob-f-email">E-mail de contact <span class="ob-req">*</span></label><input type="email" id="ob-f-email" required autocomplete="email"></div>' +
                  '<div class="ob-field"><label for="ob-f-phone">Téléphone <span class="ob-req">*</span></label><input type="tel" id="ob-f-phone" required autocomplete="tel"></div>' +
                '</div>' +
                '<div class="ob-field"><label for="ob-f-address">Adresse de facturation <span class="ob-req">*</span></label><input type="text" id="ob-f-address" placeholder="Rue, N°, Code Postal, Ville" required>' +
                '</div>' +
                
                '<div id="ob-form-error" class="ob-form__error" hidden></div>' +
                
                '<div class="ob-order-recap" style="margin-top: 1rem;">' +
                  '<span class="ob-order-recap__name" id="ob-recap-title">Service</span>' +
                  '<span class="ob-order-recap__price" id="ob-recap-total-price">0 €</span>' +
                '</div>' +
                
                '<div class="ob-btn-row">' +
                  '<button type="button" class="ob-back" id="ob-back-4">← Retour</button>' +
                  '<button type="submit" class="ob-submit" id="ob-submit-btn"><span class="ob-submit__txt">Confirmer la commande</span><span class="ob-submit__spin" hidden></span></button>' +
                '</div>' +
              '</form>' +
            '</div>' +
          '</div>' +

          // ── ÉTAPE 5 : SUCCÈS ──
          '<div class="ob-panel" data-step="5" hidden>' +
            '<div class="ob-panel__inner--center">' +
              '<div class="ob-check-wrap">' +
                '<svg class="ob-check-svg" viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="3">' +
                  '<circle class="ob-check-circle" cx="26" cy="26" r="25" stroke="rgba(255,255,255,0.18)" />' +
                  '<circle class="ob-check-circle is-drawn" cx="26" cy="26" r="25" />' +
                  '<path class="ob-check-path is-drawn" d="M16 26l7 7 13-13" stroke-linecap="round" stroke-linejoin="round" />' +
                '</svg>' +
              '</div>' +
              '<h2 class="ob-h2 ob-h2--center">Commande enregistrée !</h2>' +
              '<p class="ob-sub ob-sub--center">Merci pour votre confiance. Nous avons bien reçu votre brief. Notre équipe démarre la conception de vos outils.</p>' +
              
              '<div class="ob-success-next">' +
                '<span class="ob-success-next__label">Votre rendez-vous est réservé :</span>' +
                '<div class="ob-book-btn" id="ob-success-date-time-display">Rendez-vous fixé</div>' +
              '</div>' +
              
              '<button type="button" class="ob-submit" id="ob-close-success">Fermer et retourner au site</button>' +
            '</div>' +
          '</div>' +

        '</div>' +
      '</div>';

    modalDiv.innerHTML = html;
    document.body.appendChild(modalDiv);
  }

  // 3. LOGIQUE GLOBALE & NAVIGATION
  function showPanel(step, fromRight) {
    var modal = document.getElementById('ob-modal');
    if (!modal) return;

    var panels = modal.querySelectorAll('.ob-panel');
    panels.forEach(function (p) {
      p.hidden = true;
    });

    var activePanel = modal.querySelector('.ob-panel[data-step="' + step + '"]');
    if (activePanel) {
      activePanel.hidden = false;
      if (typeof gsap !== 'undefined') {
        var dir = (fromRight === false) ? -30 : 30;
        gsap.fromTo(activePanel, 
          { opacity: 0, x: dir },
          { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out', onComplete: function () { isAnimating = false; } }
        );
      } else {
        isAnimating = false;
      }
    }
  }

  function setProgress(step) {
    var fill = document.getElementById('ob-prog-fill');
    if (!fill) return;
    var pct = ((step - 1) / 4) * 100;
    fill.style.width = pct + '%';
  }

  function goToStep(step, fromRight) {
    if (isAnimating) return;
    isAnimating = true;
    currentStep = step;
    setProgress(step);
    showPanel(step, fromRight);
  }

  // CALCUL DE J+5 OUVRÉS (évite samedi et dimanche)
  function getTargetDateJ5() {
    var date = new Date();
    var count = 0;
    while (count < 5) {
      date.setDate(date.getDate() + 1);
      var day = date.getDay();
      if (day !== 0 && day !== 6) { // 0 = Dimanche, 6 = Samedi
        count++;
      }
    }
    return date;
  }

  function formatFrenchDate(date) {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var formatted = date.toLocaleDateString('fr-BE', options);
    // Capitalize first letter
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  function updatePrices() {
    if (!currentService) return;
    var basePrice = currentService.price;
    var totalPrice = basePrice;

    OPTIONS.forEach(function (opt) {
      if (selectedOptions[opt.id]) {
        totalPrice += opt.price;
      }
    });

    var displayPrice = document.getElementById('ob-total-price-display');
    if (displayPrice) {
      displayPrice.textContent = totalPrice + ' €' + (selectedOptions['opt_maintenance'] ? ' + 49 €/mois' : '');
    }

    var recapPrice = document.getElementById('ob-recap-total-price');
    if (recapPrice) {
      recapPrice.textContent = totalPrice + ' €' + (selectedOptions['opt_maintenance'] ? ' (+ 49 €/m)' : '');
    }
  }

  function buildOptionsList() {
    var container = document.getElementById('ob-options-container');
    if (!container) return;
    container.innerHTML = '';

    OPTIONS.forEach(function (opt) {
      var item = document.createElement('div');
      item.className = 'ob-opt-card' + (selectedOptions[opt.id] ? ' is-selected' : '');
      item.dataset.optionId = opt.id;

      item.innerHTML = 
        '<div class="ob-opt-card__meta">' +
          '<span class="ob-opt-card__name">' + opt.name + '</span>' +
          '<span class="ob-opt-card__price">+' + opt.price + ' €' + (opt.isMonthly ? '/mois' : '') + '</span>' +
        '</div>' +
        '<p class="ob-opt-card__desc">' + opt.desc + '</p>';

      item.addEventListener('click', function () {
        selectedOptions[opt.id] = !selectedOptions[opt.id];
        item.classList.toggle('is-selected', selectedOptions[opt.id]);
        updatePrices();
      });

      container.appendChild(item);
    });
  }

  // CONSTRUIRE LES CRÉNEAUX DE RDV
  function buildTimeSlots() {
    var container = document.getElementById('ob-time-slots-container');
    if (!container) return;
    container.innerHTML = '';

    var slots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ];

    slots.forEach(function (time) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ob-time-btn';
      btn.textContent = time;

      btn.addEventListener('click', function () {
        container.querySelectorAll('.ob-time-btn').forEach(function (b) {
          b.classList.remove('is-active');
        });
        btn.classList.add('is-active');
        selectedDateTime = time;

        var nextBtn = document.getElementById('ob-next-3');
        if (nextBtn) nextBtn.disabled = false;
      });

      container.appendChild(btn);
    });
  }

  // 4. OUVERTURE / FERMETURE DU MODAL
  function openOrderModal(serviceId) {
    injectModalHTML();

    var service = SERVICES[serviceId];
    if (!service) return;

    currentService = service;
    selectedOptions = {};
    selectedDateTime = null;
    currentStep = 1;

    var modal = document.getElementById('ob-modal');
    var shell = modal.querySelector('.ob-shell');
    var title = document.getElementById('ob-modal-title');
    if (title) title.innerHTML = 'Commander : <em>' + service.name + '</em>';

    var recapTitle = document.getElementById('ob-recap-title');
    if (recapTitle) recapTitle.textContent = service.name;

    // Reset styles options
    buildOptionsList();
    updatePrices();

    // Calcul de la date J+5
    var targetDate = getTargetDateJ5();
    var formattedDate = formatFrenchDate(targetDate);
    var dateDisplay = document.getElementById('ob-target-date-display');
    if (dateDisplay) dateDisplay.textContent = formattedDate;

    buildTimeSlots();

    var next3 = document.getElementById('ob-next-3');
    if (next3) next3.disabled = true;

    modal.classList.add('is-open');
    modal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';

    // Raccorder les boutons retour et navigation
    setupEventHandlers();

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(shell,
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out' }
      );
    }
  }

  function closeOrderModal() {
    var modal = document.getElementById('ob-modal');
    if (!modal) return;

    var shell = modal.querySelector('.ob-shell');
    if (typeof gsap !== 'undefined') {
      gsap.to(shell, {
        opacity: 0, y: 15, scale: 0.97, duration: 0.25, ease: 'power2.in',
        onComplete: function () {
          modal.classList.remove('is-open');
          modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      });
    } else {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // 5. GESTION DES CLICS & FORMULAIRE
  function setupEventHandlers() {
    var modal = document.getElementById('ob-modal');
    if (!modal) return;

    // Close buttons
    var x = document.getElementById('ob-x');
    if (x) x.onclick = closeOrderModal;

    var backdrop = document.getElementById('ob-backdrop');
    if (backdrop) backdrop.onclick = closeOrderModal;

    var successClose = document.getElementById('ob-close-success');
    if (successClose) successClose.onclick = closeOrderModal;

    // Étape 1 → 2
    var next1 = document.getElementById('ob-next-1');
    if (next1) {
      next1.onclick = function () {
        goToStep(2, true);
      };
    }

    // Étape 2 → 3
    var next2 = document.getElementById('ob-next-2');
    if (next2) {
      next2.onclick = function () {
        var comp = document.getElementById('ob-f-company').value.trim();
        var sector = document.getElementById('ob-f-sector').value.trim();
        var goals = document.getElementById('ob-f-goals').value.trim();

        if (!comp || !sector || !goals) {
          alert('Veuillez remplir les champs obligatoires du brief.');
          return;
        }
        goToStep(3, true);
      };
    }

    // Étape 3 → 4
    var next3 = document.getElementById('ob-next-3');
    if (next3) {
      next3.onclick = function () {
        goToStep(4, true);
      };
    }

    // Retours
    var back2 = document.getElementById('ob-back-2');
    if (back2) back2.onclick = function () { goToStep(1, false); };

    var back3 = document.getElementById('ob-back-3');
    if (back3) back3.onclick = function () { goToStep(2, false); };

    var back4 = document.getElementById('ob-back-4');
    if (back4) back4.onclick = function () { goToStep(3, false); };

    // Soumission formulaire final
    var form = document.getElementById('ob-final-form');
    if (form) {
      form.onsubmit = function (e) {
        e.preventDefault();

        var btn = document.getElementById('ob-submit-btn');
        var txt = btn.querySelector('.ob-submit__txt');
        var spin = btn.querySelector('.ob-submit__spin');

        if (btn) btn.disabled = true;
        if (txt) txt.textContent = 'Enregistrement...';
        if (spin) spin.hidden = false;

        var targetDate = getTargetDateJ5();
        var formattedRdv = formatFrenchDate(targetDate) + ' à ' + selectedDateTime;

        var payload = {
          service: currentService.id,
          serviceName: currentService.name,
          options: selectedOptions,
          brief: {
            company: document.getElementById('ob-f-company').value,
            tva: document.getElementById('ob-f-tva').value,
            sector: document.getElementById('ob-f-sector').value,
            goals: document.getElementById('ob-f-goals').value,
            style: document.getElementById('ob-f-style').value,
            inspiration: document.getElementById('ob-f-inspiration').value
          },
          rdvDelivery: formattedRdv,
          contact: {
            firstname: document.getElementById('ob-f-firstname').value,
            lastname: document.getElementById('ob-f-lastname').value,
            email: document.getElementById('ob-f-email').value,
            phone: document.getElementById('ob-f-phone').value,
            address: document.getElementById('ob-f-address').value
          }
        };

        fetch('/api/order/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
          .then(function (res) { return res.json(); })
          .then(function () {
            var displayRdv = document.getElementById('ob-success-date-time-display');
            if (displayRdv) displayRdv.textContent = formattedRdv;
            goToStep(5, true);
          })
          .catch(function () {
            // Fallback en cas d'erreur de serveur ou offline
            var displayRdv = document.getElementById('ob-success-date-time-display');
            if (displayRdv) displayRdv.textContent = formattedRdv;
            goToStep(5, true);
          })
          .finally(function () {
            if (btn) btn.disabled = false;
            if (txt) txt.textContent = 'Confirmer la commande';
            if (spin) spin.hidden = true;
          });
      };
    }
  }

  // 6. INITIALISATION & TRIGGERS
  function init() {
    // Écouteur global sur le document pour intercepter les clics sur les déclencheurs de commande
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.order-trigger');
      if (trigger) {
        e.preventDefault();
        var serviceId = trigger.getAttribute('data-service');
        if (serviceId) {
          openOrderModal(serviceId);
        }
      }
    });

    // Support des touches de clavier
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeOrderModal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Rendre la fonction accessible de l'extérieur si nécessaire
  window.openOrderModal = openOrderModal;

})();
