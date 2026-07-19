/**
 * order-modal.js — Tunnel de commande directe Premium & Planificateur J+5 (Purity ONE)
 * Injecte et gère le modal de commande directe complexe sur toutes les pages de services.
 */
(function () {
  'use strict';

  // 1. CATALOGUE COMPLET DES SERVICES
  var SERVICES = {
    // ── Présence en ligne (presence.html) ──
    'googlebiz': {
      id: 'googlebiz',
      name: 'Fiche Google Business (Setup)',
      price: 290,
      engage: 'Paiement unique pour le setup complet',
      features: ['Création/optimisation complète de la fiche Google Business', 'Optimisation des mots-clés locaux', 'Stratégie de collecte d\'avis Google', 'Catégories et attributs configurés']
    },
    'landing': {
      id: 'landing',
      name: 'Landing Page',
      price: 490,
      engage: 'Acompte de 50 % à la commande, solde à la livraison',
      features: ['Création d\'une page unique ultra-optimisée', 'Intégration d\'un formulaire de contact/devis', 'Adaptation mobile-first réactive', 'Mise en place du tracking analytics', 'SEO technique de base']
    },
    'vitrine': {
      id: 'vitrine',
      name: 'Site Vitrine Pro',
      price: 1490,
      engage: 'Acompte de 30 % à la commande, solde à la livraison',
      features: ['Site complet de 5 pages sur-mesure', 'Identité visuelle adaptée et soignée', 'Optimisation SEO locale poussée', 'Fiche Google My Business configurée', 'Livret de prise en main et tutoriels inclus']
    },
    'complet': {
      id: 'complet',
      name: 'Site Complet & Business',
      price: 2490,
      engage: 'Acompte de 30 % à la commande, solde à la livraison',
      features: ['Site vitrine étendu avec blog/actualités', 'Automatisation d\'un premier outil (rendez-vous ou avis)', 'SEO avancé sur-mesure', 'Intégration newsletter et réseaux sociaux', 'Guides détaillés et vidéos tutorielles inclus']
    },
    'ecommerce': {
      id: 'ecommerce',
      name: 'Boutique E-commerce',
      price: 3800,
      engage: 'Acompte de 30 % à la commande, solde à la livraison',
      features: ['Boutique en ligne complète (jusqu\'à 50 produits)', 'Système de paiement Mollie & Bancontact sécurisé', 'Gestion des stocks et commandes automatisée', 'Emails de confirmation et factures automatiques', 'Livret d\'utilisation complet pour gérer votre boutique']
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
      features: ['Cartographie de vos flux actuels', 'Automatisation des tâches répétitives (Make/Zapier)', 'Liaison automatisée Devis -> Facture -> Relance', 'Documentation et guides vidéo pour vos équipes']
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
    },

    // ── Briques index.html (Présence & Accompagnement) ──
    'emailpro': {
      id: 'emailpro',
      name: 'Pack E-mail Pro + Domaine',
      price: 90,
      engage: 'Paiement unique, configuration complète incluse',
      features: ['Adresse @votremarque.be professionnelle', 'Hébergement e-mail sécurisé', 'Configuration anti-spam (SPF, DKIM, DMARC)', 'Accès webmail + synchronisation mobile']
    },
    'maintenance': {
      id: 'maintenance',
      name: 'Support & Maintenance',
      price: 89,
      engage: 'Mensuel sans engagement, résiliable à tout moment',
      features: ['Mises à jour de sécurité continues', 'Sauvegardes quotidiennes externalisées', 'Assistance prioritaire par e-mail et WhatsApp', 'Petites évolutions incluses chaque mois']
    },

    // ── Purity Studio (index.html) ──
    'studio-visuels': {
      id: 'studio-visuels',
      name: 'Visuels Produit & Marque',
      price: 190,
      engage: 'Paiement unique par lot de visuels',
      features: ['20 visuels retouchés, livrés en 24h', 'Photos produit, portraits et ambiances', 'Génération IA sur mesure, ton de marque respecté', 'Formats optimisés web et réseaux sociaux']
    },
    'studio-videos': {
      id: 'studio-videos',
      name: 'Vidéos & Reels IA',
      price: 290,
      engage: 'Paiement unique par lot de vidéos',
      features: ['3 à 5 vidéos prêtes à publier', 'Sous-titres et habillage inclus', 'Formats Reels, Shorts et Stories optimisés', 'Zéro tournage nécessaire de votre côté']
    },
    'studio-identite': {
      id: 'studio-identite',
      name: 'Identité Visuelle',
      price: 490,
      engage: 'Acompte de 50 % à la commande, solde à la livraison',
      features: ['Logo et déclinaisons complètes', 'Charte graphique, palette et typographies', 'Supports de base (cartes, en-têtes, réseaux)', 'Livraison en 48h, révisions incluses']
    },
    'studio-mensuel': {
      id: 'studio-mensuel',
      name: 'Contenu Mensuel IA',
      price: 249,
      engage: 'Mensuel sans engagement, résiliable à tout moment',
      features: ['12 visuels prêts à publier chaque mois', '4 vidéos Reels/Shorts incluses', 'Stratégie de contenu et calendrier fournis', 'Cohérence visuelle garantie sur tous vos canaux']
    }
  };

  // OPTIONS ET SUPPLÉMENTS DISPONIBLES PAR CATÉGORIE
  var OPTIONS_CAT = {
    web: [
      { id: 'opt_textes', name: 'Rédaction professionnelle des textes', price: 290, desc: 'Nous rédigeons l\'intégralité des contenus pour maximiser vos ventes.' },
      { id: 'opt_logo', name: 'Création de logo & identité visuelle', price: 390, desc: 'Logo vectoriel moderne, charte graphique et palette de couleurs.' },
      { id: 'opt_photos', name: 'Reportage photo & vidéo pro (Wallonie)', price: 490, desc: 'Séance sur site pour capturer des visuels authentiques.' },
      { id: 'opt_maintenance', name: 'Support & maintenance (mensuel)', price: 49, desc: 'Mises à jour de sécurité et modifications rapides incluses.', isMonthly: true }
    ],
    acquisition: [
      { id: 'opt_copy', name: 'Copywriting publicitaire', price: 190, desc: 'Création de textes percutants pour vos annonces.' },
      { id: 'opt_retarget', name: 'Setup Retargeting (Pixel)', price: 290, desc: 'Configuration du reciblage publicitaire (Meta/Google).' },
      { id: 'opt_report', name: 'Rapport analytique mensuel', price: 49, desc: 'Tableau de bord personnalisé mis à jour chaque mois.', isMonthly: true },
      { id: 'opt_bot', name: 'Bot IA de qualification', price: 890, desc: 'Bot intelligent pour qualifier les prospects entrants.' }
    ],
    auto: [
      { id: 'opt_audit', name: 'Audit complet des processus', price: 390, desc: 'Analyse de vos flux pour identifier de nouvelles automatisations.' },
      { id: 'opt_formation', name: 'Formation équipe (Visio)', price: 290, desc: 'Formation de votre équipe à la maîtrise des nouveaux outils.' },
      { id: 'opt_crm_sync', name: 'Synchronisation CRM avancée', price: 490, desc: 'Connexion de l\'automatisation à votre outil métier existant.' },
      { id: 'opt_maint_tech', name: 'Maintenance technique (mensuel)', price: 49, desc: 'Surveillance et ajustement de vos automatisations.', isMonthly: true }
    ],
    studio: [
      { id: 'opt_express', name: 'Livraison express (J+3)', price: 190, desc: 'Traitement prioritaire de votre demande en 3 jours ouvrés.' },
      { id: 'opt_declinaison', name: 'Déclinaison formats (Reels/TikTok)', price: 150, desc: 'Adaptation de vos visuels/vidéos pour tous les réseaux.' },
      { id: 'opt_source', name: 'Fichiers sources complets', price: 90, desc: 'Remise des fichiers de travail originaux (PSD, AI, AEP).' },
      { id: 'opt_revision', name: 'Tour de révision supplémentaire', price: 79, desc: 'Modifications additionnelles après validation finale.' }
    ],
    support: [
      { id: 'opt_priority', name: 'Support Prioritaire 24/7', price: 99, desc: 'Ligne directe WhatsApp avec notre équipe technique.', isMonthly: true },
      { id: 'opt_backup', name: 'Sauvegardes quotidiennes externalisées', price: 29, desc: 'Sécurisation maximale avec rétention de 30 jours.', isMonthly: true },
      { id: 'opt_monitoring', name: 'Monitoring de disponibilité (Uptime)', price: 19, desc: 'Alerte instantanée en cas de coupure de vos services.', isMonthly: true },
      { id: 'opt_audit_sec', name: 'Audit de sécurité annuel', price: 290, desc: 'Test d\'intrusion et rapport complet des failles potentielles.' }
    ]
  };

  function getOptionsForService(serviceId) {
    var map = {
      'googlebiz': 'web', 'landing': 'web', 'vitrine': 'web', 'complet': 'web', 'ecommerce': 'web',
      'seolocal': 'acquisition', 'googleads': 'acquisition', 'tunnel': 'acquisition',
      'calendar': 'auto', 'botia': 'auto', 'workflow': 'auto',
      'crm': 'auto', 'dashboard': 'auto', 'appcomplete': 'auto',
      'studio-visuels': 'studio', 'studio-videos': 'studio', 'studio-identite': 'studio', 'studio-mensuel': 'studio',
      'maintenance': 'support', 'emailpro': 'support'
    };
    var cat = map[serviceId] || 'web';
    return OPTIONS_CAT[cat];
  }

  var currentService = null;
  var selectedOptions = {};
  var currentStep = 1;
  var isAnimating = false;
  var selectedDateTime = null; // Date et heure de livraison J+5 choisies

  // 2. INJECTION DYNAMIQUE DE L'HTML DU MODAL
  function injectModalHTML() {
    if (document.getElementById('order-modal')) return;

    var modalDiv = document.createElement('div');
    modalDiv.id = 'order-modal';
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
                  '<div class="ob-field"><label for="ob-svc-company">Entreprise <span class="ob-req">*</span></label><input type="text" id="ob-svc-company" placeholder="Ex: Menuiserie Dupont" required></div>' +
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

          // ── ÉTAPE 3 : PLANIFICATION ──
          '<div class="ob-panel" data-step="3" hidden>' +
            '<div class="ob-panel__inner">' +
              '<span class="ob-eyebrow" data-i18n="modal.step3.eyebrow">Étape 3 sur 4 · Planification</span>' +
              '<h2 class="ob-h2" data-i18n="modal.step3.title">Votre appel de lancement / livraison</h2>' +
              '<p class="ob-sub" data-i18n="modal.step3.desc">Choisissez la date et l\'heure de votre appel en visioconférence avec votre expert dédié.</p>' +
              
              '<div class="ob-date-carousel" id="ob-date-carousel"></div>' +
              
              '<div class="ob-other-label" data-i18n="modal.step3.time">Créneaux horaires disponibles (Heure de Bruxelles/Paris)</div>' +
              '<div class="ob-time-grid" id="ob-time-slots-container"></div>' +
              
              '<div class="ob-btn-row">' +
                '<button type="button" class="ob-back" id="ob-back-3" data-i18n="modal.btn.back2">← Retour au brief</button>' +
                '<button type="button" class="ob-submit" id="ob-next-3" style="width: auto; margin-top:0;" disabled data-i18n="modal.btn.next3">Suivant : Coordonnées →</button>' +
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
                  '<div class="ob-field"><label for="ob-svc-email">E-mail de contact <span class="ob-req">*</span></label><input type="email" id="ob-svc-email" required autocomplete="email"></div>' +
                  '<div class="ob-field"><label for="ob-svc-phone">Téléphone <span class="ob-req">*</span></label><input type="tel" id="ob-svc-phone" required autocomplete="tel"></div>' +
                '</div>' +
                '<div class="ob-field"><label for="ob-f-address">Adresse de facturation <span class="ob-req">*</span></label><input type="text" id="ob-f-address" placeholder="Rue, N°, Code Postal, Ville" required>' +
                '</div>' +
                '<input type="text" name="website_verification" id="ob-hp" style="position:absolute;left:-9999px;" tabindex="-1" autocomplete="off">' +
                
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
    var modal = document.getElementById('order-modal');
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

    var currentOptions = getOptionsForService(currentService.id);

    currentOptions.forEach(function (opt) {
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

    var currentOptions = getOptionsForService(currentService.id);

    currentOptions.forEach(function (opt) {
      var item = document.createElement('div');
      item.className = 'ob-opt-card' + (selectedOptions[opt.id] ? ' is-selected' : '');
      item.dataset.optionId = opt.id;

      item.innerHTML = 
        '<div class="ob-opt-card__meta">' +
          '<span class="ob-opt-card__name" data-i18n="modal.' + opt.id + '.name">' + opt.name + '</span>' +
          '<span class="ob-opt-card__price">+' + opt.price + ' €' + (opt.isMonthly ? '/mois' : '') + '</span>' +
        '</div>' +
        '<p class="ob-opt-card__desc" data-i18n="modal.' + opt.id + '.desc">' + opt.desc + '</p>';

      item.addEventListener('click', function () {
        selectedOptions[opt.id] = !selectedOptions[opt.id];
        item.classList.toggle('is-selected', selectedOptions[opt.id]);
        updatePrices();
      });

      container.appendChild(item);
    });
    
    // Appliquer les traductions sur les nouveaux éléments générés si la langue n'est pas le français
    if (window.applyDict && window.currentLang && window.currentLang !== 'fr') {
        window.applyDict(window.currentLang);
    }
  }

  // CONSTRUIRE LES CRÉNEAUX DE RDV
  var selectedDateStr = null;

  function buildDateCarousel() {
    var container = document.getElementById('ob-date-carousel');
    if (!container) return;
    container.innerHTML = '';

    var dates = [];
    var d = new Date();
    d.setDate(d.getDate() + 1); // Démarre demain
    
    while(dates.length < 10) { // 10 jours ouvrés
      var dayIndex = d.getDay();
      if (dayIndex !== 0 && dayIndex !== 6) { 
        dates.push(new Date(d));
      }
      d.setDate(d.getDate() + 1);
    }

    var lang = window.currentLang || 'fr';
    var locale = (lang === 'en') ? 'en-US' : lang + '-' + lang.toUpperCase();

    dates.forEach(function (date, index) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ob-date-btn' + (index === 0 ? ' is-active' : '');

      var dayName = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
      var dayNum = new Intl.DateTimeFormat(locale, { day: '2-digit' }).format(date);
      var monthName = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);

      btn.innerHTML = 
        '<span class="ob-date-btn__day">' + dayName + '</span>' +
        '<span class="ob-date-btn__num">' + dayNum + '</span>' +
        '<span class="ob-date-btn__month">' + monthName + '</span>';

      btn.addEventListener('click', function () {
        container.querySelectorAll('.ob-date-btn').forEach(function(b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        selectedDateStr = date.toISOString().split('T')[0];
        
        // Reset selected time
        selectedDateTime = null;
        var nextBtn = document.getElementById('ob-next-3');
        if (nextBtn) nextBtn.disabled = true;

        buildTimeSlotsForDate(selectedDateStr);
      });

      container.appendChild(btn);

      if (index === 0) {
        selectedDateStr = date.toISOString().split('T')[0];
      }
    });

    buildTimeSlotsForDate(selectedDateStr);
  }

  function getSeededRandom(seedStr) {
    var hash = 0;
    for (var i = 0; i < seedStr.length; i++) {
      hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
      hash = hash & hash;
    }
    var x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  }

  function buildTimeSlotsForDate(dateStr) {
    var container = document.getElementById('ob-time-slots-container');
    if (!container) return;
    container.innerHTML = '';

    // Liste logique de créneaux avec des pauses de 30 min (ex: call de 1h + 30m pause)
    var allSlots = [
      '09:00', '10:30', '11:00', '13:30', '14:00', '15:30', '16:00', '17:30'
    ];

    // On utilise un seed basé sur la date pour que les dispos soient stables le même jour
    var seed = getSeededRandom(dateStr);
    
    // Garder aléatoirement 4 à 6 créneaux par jour pour faire plus réaliste
    var availableSlots = allSlots.filter(function(slot, i) {
      return getSeededRandom(dateStr + slot) > 0.4; 
    });

    if (availableSlots.length === 0) availableSlots = ['10:30', '14:00']; // Fallback minimum

    availableSlots.forEach(function (time) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ob-time-btn';
      btn.textContent = time;

      btn.addEventListener('click', function () {
        container.querySelectorAll('.ob-time-btn').forEach(function (b) {
          b.classList.remove('is-active');
        });
        btn.classList.add('is-active');
        
        // On combine la date choisie et l'heure
        var d = new Date(dateStr);
        var locale = window.currentLang === 'en' ? 'en-US' : (window.currentLang || 'fr');
        var fullDateStr = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d);
        
        selectedDateTime = fullDateStr + ' à ' + time;

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

    var modal = document.getElementById('order-modal');
    var shell = modal.querySelector('.ob-shell');
    var title = document.getElementById('ob-modal-title');
    if (title) title.innerHTML = 'Commander : <em>' + service.name + '</em>';

    var recapTitle = document.getElementById('ob-recap-title');
    if (recapTitle) recapTitle.textContent = service.name;

    // Reset styles options
    buildOptionsList();
    updatePrices();

    // Init Date Carousel
    buildDateCarousel();

    var next3 = document.getElementById('ob-next-3');
    if (next3) next3.disabled = true;

    modal.classList.add('is-open');
    modal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';

    // Raccorder les boutons retour et navigation
    setupEventHandlers();

    if (window.PurityFocusTrap) window.PurityFocusTrap.attach(shell);

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(shell,
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out' }
      );
    }
  }

  function closeOrderModal() {
    var modal = document.getElementById('order-modal');
    if (!modal) return;

    if (window.PurityFocusTrap) window.PurityFocusTrap.release();

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
    var modal = document.getElementById('order-modal');
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
        var comp = document.getElementById('ob-svc-company').value.trim();
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

        var hp = document.getElementById('ob-hp');
        if (hp && hp.value.trim()) return; // Honeypot anti-spam

        var btn = document.getElementById('ob-submit-btn');
        var txt = btn.querySelector('.ob-submit__txt');
        var spin = btn.querySelector('.ob-submit__spin');

        if (btn) btn.disabled = true;
        if (txt) txt.textContent = 'Enregistrement...';
        if (spin) spin.hidden = false;

        var targetDate = getTargetDateJ5();
        var formattedRdv = formatFrenchDate(targetDate) + ' à ' + selectedDateTime;

        var errorBox = document.getElementById('ob-form-error');
        if (errorBox) errorBox.hidden = true;

        var company = document.getElementById('ob-svc-company').value.trim();
        var tva = document.getElementById('ob-f-tva').value.trim();
        var sector = document.getElementById('ob-f-sector').value.trim();
        var goals = document.getElementById('ob-f-goals').value.trim();
        var style = document.getElementById('ob-f-style').value.trim();
        var inspiration = document.getElementById('ob-f-inspiration').value.trim();
        var firstname = document.getElementById('ob-f-firstname').value.trim();
        var lastname = document.getElementById('ob-f-lastname').value.trim();
        var email = document.getElementById('ob-svc-email').value.trim();
        var phone = document.getElementById('ob-svc-phone').value.trim();
        var address = document.getElementById('ob-f-address').value.trim();

        var optionNames = OPTIONS.filter(function (opt) { return selectedOptions[opt.id]; })
          .map(function (opt) { return opt.name; });

        var needLines = [
          'Commande directe : ' + currentService.name + ' (' + currentService.price + ' €, ' + currentService.engage + ')',
          optionNames.length ? 'Options : ' + optionNames.join(', ') : null,
          'Entreprise : ' + (company || '—') + (tva ? ' — TVA ' + tva : ''),
          'Objectif du site : ' + (goals || '—'),
          style ? 'Ambiance/couleurs souhaitées : ' + style : null,
          inspiration ? 'Inspiration : ' + inspiration : null,
          'Adresse de facturation : ' + (address || '—'),
          'Créneau d\'appel de livraison choisi : ' + formattedRdv
        ].filter(Boolean);

        var payload = {
          name: (firstname + ' ' + lastname).trim(),
          email: email,
          phone: phone,
          activity: sector,
          need: needLines.join('\n')
        };

        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
          .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
          .then(function (result) {
            if (result.ok && result.data && result.data.ok) {
              var displayRdv = document.getElementById('ob-success-date-time-display');
              if (displayRdv) displayRdv.textContent = formattedRdv;
              goToStep(5, true);
              return;
            }
            if (errorBox) {
              errorBox.textContent = 'Votre demande n\'a pas pu être enregistrée. Vérifiez vos coordonnées ou contactez-nous directement.';
              errorBox.hidden = false;
            }
          })
          .catch(function () {
            if (errorBox) {
              errorBox.textContent = 'Connexion impossible. Vérifiez votre réseau et réessayez.';
              errorBox.hidden = false;
            }
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
