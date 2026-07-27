/**
 * order-modal.js — Tunnel de commande directe Premium & Planificateur J+5 (Purity ONE)
 * Injecte et gère le modal de commande directe complexe sur toutes les pages de services.
 */
(function () {
  'use strict';

  // ── CATALOGUE V2.0 — 28 modules · 8 catégories ──────────────────────────────
  var SERVICES = {
    // 01 — Diagnostic & Stratégie
    'm01': {
      id: 'm01', name: 'Diagnostic Digital', price: 0,
      engage: 'Gratuit — valeur estimée : 290 €',
      features: ['Analyse du site actuel (design, vitesse, mobile, SEO)', 'Audit de la fiche Google Business', 'Analyse concurrentielle rapide (3 concurrents)', 'Rapport PDF personnalisé + score de maturité digitale', '3 recommandations prioritaires chiffrées']
    },
    'm02': {
      id: 'm02', name: 'Feuille de Route Stratégique', price: 490,
      engage: '100 % à la commande',
      features: ['Entretien approfondi (1h30)', 'Plan d\'action priorisé sur 6 à 12 mois', 'Matrice impact vs effort', 'Budget prévisionnel avec phasage', 'Déduit du projet si signé dans les 30 jours']
    },

    // 02 — Présence Digitale
    'm03': {
      id: 'm03', name: 'Page Essentielle', price: 490,
      engage: '100 % à la commande',
      features: ['Design personnalisé (jamais de template)', 'Structure de conversion éprouvée (hero, bénéfices, CTA)', 'Responsive mobile/tablette', 'Formulaire de contact ou réservation', 'Optimisation vitesse > 90/100 + analytics']
    },
    'm04': {
      id: 'm04', name: 'Site Vitrine', price: 1490,
      engage: '50 % à la commande, 50 % à la livraison',
      features: ['5 pages sur-mesure (jamais de template générique)', 'Responsive mobile et tablette', 'Optimisation SEO locale (balises, vitesse, structure)', 'Formulaire de contact sécurisé + analytics', 'Formation prise en main (1h)']
    },
    'm05': {
      id: 'm05', name: 'Site Complet', price: 2490,
      engage: '50 % à la commande, 50 % à la livraison',
      features: ['Jusqu\'à 10 pages + blog avec catégories', 'Référencement avancé (sitemap, schema.org, maillage)', 'Intégration réseaux sociaux + page FAQ', '2 articles de blog initiaux rédigés', 'Formation étendue (2h)']
    },
    'm06': {
      id: 'm06', name: 'Boutique en Ligne', price: 3990,
      engage: '40 % à la commande, 30 % à mi-parcours, 30 % à la livraison',
      features: ['Design e-commerce personnalisé', 'Catalogue jusqu\'à 50 produits', 'Paiement sécurisé (Stripe/Mollie/Bancontact)', 'Gestion stocks, commandes et livraisons', 'Formation gestion boutique (2h)']
    },
    'm07': {
      id: 'm07', name: 'Refonte & Modernisation', price: 890,
      engage: '50 % à la commande, 50 % à la livraison',
      features: ['Audit UX/UI du site existant', 'Migration et restructuration du contenu', 'Nouveau design responsive', 'Redirections 301 (conservation du référencement)', 'Formation prise en main incluse']
    },
    'm08': {
      id: 'm08', name: 'Fiche Google Business', price: 290,
      engage: '100 % à la commande',
      features: ['Création ou réclamation de la fiche', 'Optimisation complète (catégories, description, mots-clés locaux)', 'Upload de 10 photos optimisées', '3 premières publications Google', 'Guide de bonnes pratiques PDF']
    },

    // 03 — Identité & Contenu
    'm09': {
      id: 'm09', name: 'Identité Visuelle', price: 590,
      engage: '100 % à la commande',
      features: ['3 propositions de logo', 'Palette de couleurs + couple typographique', 'Charte graphique PDF (4-6 pages)', 'Fichiers sources (SVG, PNG, PDF)', 'Déclinaisons (favicon, réseaux sociaux, signature email)']
    },
    'm10': {
      id: 'm10', name: 'Visuels Produit & Marque — Purity Studio', price: 290,
      engage: '100 % à la commande',
      features: ['20 visuels retouchés et optimisés', 'Formats adaptés (web, Instagram, Facebook, LinkedIn)', 'Retouche et mise en situation IA', 'Livraison haute résolution', 'Version web optimisée de chaque visuel']
    },
    'm11': {
      id: 'm11', name: 'Vidéos & Reels — Purity Studio', price: 390,
      engage: '100 % à la commande',
      features: ['5 vidéos/Reels montées (15-60 sec)', 'Sous-titres intégrés + musique libre de droits', 'Formats 9:16 et 1:1', '1 cycle de retouches inclus', 'Prêt à publier sur Instagram, TikTok, LinkedIn']
    },
    'm12': {
      id: 'm12', name: 'Rédaction Web & Blog', price: 290,
      engage: '100 % à la commande',
      features: ['5 pages ou articles rédigés (500-800 mots)', 'Optimisation SEO (mots-clés, balises, méta-descriptions)', 'Structure web optimale (titres, sous-titres, CTA)', '1 cycle de corrections inclus', 'Recommandations de mots-clés associés']
    },

    // 04 — Acquisition & Croissance
    'm13': {
      id: 'm13', name: 'Référencement Local (SEO)', price: 590,
      engage: '100 % à la commande pour le setup',
      features: ['Audit SEO technique complet', 'Recherche de 20-30 mots-clés locaux', 'Optimisation on-page complète', '3 pages locales optimisées créées', 'Calendrier éditorial + rapport de positionnement initial']
    },
    'm14': {
      id: 'm14', name: 'Publicité Digitale', price: 490,
      engage: '100 % à la commande pour le setup',
      features: ['Stratégie publicitaire (objectifs, ciblage, budget)', 'Création des campagnes (Google Search ou Meta)', '2-3 visuels publicitaires créés', 'Configuration du suivi de conversions', 'Optimisation initiale (2 premières semaines)']
    },
    'm15': {
      id: 'm15', name: 'Campagnes Email & SMS', price: 790,
      engage: '50 % à la commande, 50 % à la livraison',
      features: ['Configuration plateforme (Brevo ou équivalent)', '2 templates email + 3 séquences automatisées', 'Bienvenue, relance, fidélisation — prêts à l\'emploi', 'Première campagne envoyée', 'Formation utilisation (1h)']
    },
    'm16': {
      id: 'm16', name: 'Gestion des Réseaux Sociaux', price: 290,
      engage: '100 % à la commande pour le setup',
      features: ['Audit de la présence sociale actuelle', 'Stratégie éditoriale (ton, thèmes, fréquence)', 'Calendrier éditorial mensuel', '12 publications + 4 Reels/mois (abonnement)', 'Rapport de performance mensuel']
    },

    // 05 — Relation Client
    'm17': {
      id: 'm17', name: 'Réservation en Ligne', price: 390,
      engage: '100 % à la commande',
      features: ['Créneaux personnalisables par service', 'Synchronisation Google Calendar', 'Confirmation automatique par email', 'Rappels automatiques (J-1 + H-2)', 'Formation utilisation (30 min)']
    },
    'm18': {
      id: 'm18', name: 'Gestion Client (CRM)', price: 990,
      engage: '50 % à la commande, 50 % à la livraison',
      features: ['Configuration CRM + import base clients existante', 'Pipeline de suivi des prospects', 'Automatisation des rappels et tâches', 'Tableaux de bord personnalisés', 'Formation utilisation (1h)']
    },
    'm19': {
      id: 'm19', name: 'Portail Client Sécurisé', price: 690,
      engage: '50 % à la commande, 50 % à la livraison',
      features: ['Authentification sécurisée par login', 'Interface de dépôt/téléchargement de documents', 'Notifications automatiques (document disponible)', 'Organisation par dossiers + chiffrement des données', 'Responsive mobile — Formation (30 min)']
    },
    'm20': {
      id: 'm20', name: 'Réputation & Avis en Ligne', price: 290,
      engage: '100 % à la commande',
      features: ['Collecte automatisée d\'avis Google après chaque prestation', 'Tableau de bord de suivi de la réputation', 'Alerte instantanée en cas d\'avis négatif', '5 suggestions de réponse personnalisées', 'Formation (20 min)']
    },

    // 06 — Automatisation & IA
    'm21': {
      id: 'm21', name: 'Pilote Automatique — Essentiel', price: 490,
      engage: '100 % à la commande',
      features: ['1 workflow automatisé sur 1 canal (email ou SMS)', 'Déclencheur personnalisé (après RDV, après achat…)', 'Configuration et test complet', 'Monitoring du workflow', 'Formation (15 min)']
    },
    'm22': {
      id: 'm22', name: 'Pilote Automatique — Business', price: 990,
      engage: '50 % à la commande, 50 % à la livraison',
      features: ['Jusqu\'à 3 workflows multi-canal', 'Chatbot intelligent sur le site (FAQ, capture de leads)', 'Réservation en ligne avec rappels multi-canal', 'Synchronisation agenda Google Calendar', 'Tableau de bord des automatisations']
    },
    'm23': {
      id: 'm23', name: 'Pilote Automatique — Intégral', price: 1990,
      engage: '50 % à la commande, 50 % à la livraison',
      features: ['Workflows illimités + intégrations avancées', 'Assistant IA entraîné sur vos données', 'Qualification et scoring automatique des leads', 'Connexion CRM, comptabilité et outils métier', 'Support dédié + rapports mensuels']
    },

    // 07 — Accompagnement
    'm24-ess': {
      id: 'm24-ess', name: 'Maintenance Essentielle', price: 79,
      engage: 'Mensuel — engagement 12 mois',
      features: ['Hébergement sécurisé + sauvegardes quotidiennes', 'Certificat SSL + mises à jour techniques', 'Monitoring 24/7', 'Support email (réponse sous 48h)']
    },
    'm24-biz': {
      id: 'm24-biz', name: 'Maintenance Business', price: 149,
      engage: 'Mensuel — engagement 12 mois',
      features: ['Tout le niveau Essentiel inclus', '2h de modifications mineures/mois', 'Support prioritaire (réponse sous 24h)', 'Rapport de performance mensuel + gestion fiche Google']
    },
    'm24-pro': {
      id: 'm24-pro', name: 'Maintenance Premium', price: 249,
      engage: 'Mensuel — engagement 12 mois',
      features: ['Tout le niveau Business inclus', '5h de modifications/mois', 'Support téléphonique + session stratégie trimestrielle (30 min)', 'Optimisation SEO continue']
    },
    'm25': {
      id: 'm25', name: 'Formation & Prise en Main', price: 290,
      engage: '100 % à la commande',
      features: ['Formation personnalisée (2h en visio)', 'Prise en main de votre site, CRM ou automatisation', 'Guide récapitulatif PDF livré', 'Replay de la session disponible', '1 session de questions/réponses J+30 incluse']
    },
    'm26': {
      id: 'm26', name: 'Conseil Stratégique', price: 190,
      engage: '100 % à la commande (session) ou mensuel',
      features: ['Session stratégique 1h (analyse + recommandations)', 'Suivi des indicateurs et alertes opportunités', 'Plan d\'action mensuel priorisé', 'Accès WhatsApp direct pour questions rapides', 'Rapport stratégique mensuel']
    },

    // 08 — Solutions Sur Mesure
    'm27': {
      id: 'm27', name: 'Application Métier', price: 2990,
      engage: '40 % à la commande, 30 % à mi-parcours, 30 % à la livraison',
      features: ['Architecture sur-mesure selon cahier des charges', 'Base de données robuste et évolutive', 'Espace client ou collaborateur dédié', 'Intégrations API tierces incluses', 'Documentation et formation équipe']
    },
    'm28': {
      id: 'm28', name: 'Intégrations & Connexions', price: 490,
      engage: '100 % à la commande',
      features: ['Connexion entre vos logiciels existants (CRM, compta, agenda)', 'Synchronisation bidirectionnelle des données', 'Webhooks et API personnalisés', 'Tests complets et documentation technique', 'Support post-déploiement (30 jours)']
    },

    // ── Alias legacy (compatibilité boutons HTML existants) ──────────────────
    'googlebiz':      { id: 'm08', name: 'Fiche Google Business', price: 290, engage: '100 % à la commande', features: ['Optimisation complète de la fiche', 'Catégories, photos, publications', 'Formation incluse (30 min)'] },
    'landing':        { id: 'm03', name: 'Page Essentielle', price: 490, engage: '100 % à la commande', features: ['Design personnalisé', 'Formulaire de conversion', 'Responsive + analytics'] },
    'vitrine':        { id: 'm04', name: 'Site Vitrine', price: 1490, engage: '50 % à la commande, 50 % à la livraison', features: ['5 pages sur-mesure', 'SEO local', 'Formation (1h)'] },
    'complet':        { id: 'm05', name: 'Site Complet', price: 2490, engage: '50 % à la commande, 50 % à la livraison', features: ['10+ pages + blog', 'SEO avancé', 'Formation (2h)'] },
    'ecommerce':      { id: 'm06', name: 'Boutique en Ligne', price: 3990, engage: '40 % à la commande, 30 % à mi-parcours, 30 % à la livraison', features: ['50 produits', 'Paiement sécurisé', 'Formation gestion (2h)'] },
    'seolocal':       { id: 'm13', name: 'Référencement Local (SEO)', price: 590, engage: '100 % à la commande', features: ['Audit SEO complet', '3 pages locales', 'Calendrier éditorial'] },
    'googleads':      { id: 'm14', name: 'Publicité Digitale', price: 490, engage: '100 % à la commande', features: ['Campagnes Google/Meta', '3 visuels publicitaires', 'Optimisation 2 semaines'] },
    'tunnel':         { id: 'm15', name: 'Campagnes Email & SMS', price: 790, engage: '50 % à la commande, 50 % à la livraison', features: ['Plateforme configurée', '3 séquences automatisées', 'Première campagne envoyée'] },
    'calendar':       { id: 'm17', name: 'Réservation en Ligne', price: 390, engage: '100 % à la commande', features: ['Créneaux personnalisables', 'Rappels automatiques', 'Synchro Google Calendar'] },
    'botia':          { id: 'm22', name: 'Pilote Automatique — Business', price: 990, engage: '50 % à la commande, 50 % à la livraison', features: ['Chatbot intelligent', '3 workflows multi-canal', 'Réservation intégrée'] },
    'workflow':       { id: 'm23', name: 'Pilote Automatique — Intégral', price: 1990, engage: '50 % à la commande, 50 % à la livraison', features: ['Workflows illimités', 'Assistant IA entraîné', 'Connexion CRM + compta'] },
    'crm':            { id: 'm18', name: 'Gestion Client (CRM)', price: 990, engage: '50 % à la commande, 50 % à la livraison', features: ['CRM configuré', 'Pipeline de vente', 'Formation (1h)'] },
    'dashboard':      { id: 'm27', name: 'Application Métier', price: 2990, engage: '40 % à la commande, 30 % à mi-parcours, 30 % à la livraison', features: ['Architecture sur-mesure', 'Base de données', 'Intégrations API'] },
    'appcomplete':    { id: 'm27', name: 'Application Métier', price: 2990, engage: '40 % à la commande, 30 % à mi-parcours, 30 % à la livraison', features: ['Architecture sur-mesure', 'Espace client', 'Documentation complète'] },
    'maintenance':    { id: 'm24-biz', name: 'Maintenance Business', price: 149, engage: 'Mensuel — engagement 12 mois', features: ['2h de modifs/mois', 'Support prioritaire 24h', 'Rapport mensuel'] },
    'studio-visuels': { id: 'm10', name: 'Visuels Produit & Marque', price: 290, engage: '100 % à la commande', features: ['20 visuels retouchés', 'Formats web et réseaux', 'Livraison HD'] },
    'studio-videos':  { id: 'm11', name: 'Vidéos & Reels', price: 390, engage: '100 % à la commande', features: ['5 vidéos/Reels', 'Sous-titres inclus', 'Formats 9:16 et 1:1'] },
    'studio-identite':{ id: 'm09', name: 'Identité Visuelle', price: 590, engage: '100 % à la commande', features: ['3 propositions logo', 'Charte graphique', 'Fichiers sources SVG/PNG'] },
    'studio-mensuel': { id: 'm16', name: 'Gestion des Réseaux Sociaux', price: 349, engage: 'Mensuel sans engagement minimum', features: ['12 publications/mois', '4 Reels/mois', 'Rapport de performance'] },
    'emailpro':       { id: 'm28', name: 'Intégrations & Connexions', price: 490, engage: '100 % à la commande', features: ['Email @votremarque.be', 'Configuration anti-spam complète', 'Accès webmail + mobile'] }
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
      // Legacy aliases
      'googlebiz': 'web', 'landing': 'web', 'vitrine': 'web', 'complet': 'web', 'ecommerce': 'web',
      'seolocal': 'acquisition', 'googleads': 'acquisition', 'tunnel': 'acquisition',
      'calendar': 'auto', 'botia': 'auto', 'workflow': 'auto',
      'crm': 'auto', 'dashboard': 'auto', 'appcomplete': 'auto',
      'studio-visuels': 'studio', 'studio-videos': 'studio', 'studio-identite': 'studio', 'studio-mensuel': 'studio',
      'maintenance': 'support', 'emailpro': 'support',
      // V2 modules
      'm01': 'web', 'm02': 'web',
      'm03': 'web', 'm04': 'web', 'm05': 'web', 'm06': 'web', 'm07': 'web', 'm08': 'web',
      'm09': 'studio', 'm10': 'studio', 'm11': 'studio', 'm12': 'studio',
      'm13': 'acquisition', 'm14': 'acquisition', 'm15': 'acquisition', 'm16': 'studio',
      'm17': 'auto', 'm18': 'auto', 'm19': 'auto', 'm20': 'auto',
      'm21': 'auto', 'm22': 'auto', 'm23': 'auto',
      'm24-ess': 'support', 'm24-biz': 'support', 'm24-pro': 'support', 'm25': 'support', 'm26': 'support',
      'm27': 'auto', 'm28': 'auto'
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
    // (applyDict sans argument réutilise le dictionnaire déjà chargé — window.currentLang
    // est un code langue, pas un dictionnaire, ça n'a jamais dû lui être passé directement)
    if (window.applyDict && window.currentLang && window.currentLang !== 'fr') {
        window.applyDict();
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
          serviceId: currentService.id,
          name: (firstname + ' ' + lastname).trim(),
          email: email,
          phone: phone,
          bce: tva,
          intake: {
            fname: firstname,
            lname: lastname,
            email: email,
            phone: phone,
            business_name: company,
            tva: tva,
            address: address,
            sector: sector,
            goals: goals,
            style: style,
            inspiration: inspiration,
            formattedRdv: formattedRdv
          }
        };

        fetch('/api/order/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
          .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
          .then(function (result) {
            if (result.ok && result.data && result.data.sessionUrl) {
              window.location.href = result.data.sessionUrl;
              return;
            }
            // Fallback lead log si Mollie est en mode hors-ligne
            fetch('/api/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: payload.name, email: payload.email, phone: payload.phone,
                activity: sector, need: needLines.join('\n')
              })
            }).then(function() {
              var displayRdv = document.getElementById('ob-success-date-time-display');
              if (displayRdv) displayRdv.textContent = formattedRdv;
              goToStep(5, true);
            }).catch(function() {
              var displayRdv = document.getElementById('ob-success-date-time-display');
              if (displayRdv) displayRdv.textContent = formattedRdv;
              goToStep(5, true);
            });
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
