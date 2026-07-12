/* order-v2.js — Tunnel commande briques Purity ONE
 * Étapes : Choix → Formulaire détaillé → Livraison → Paiement → Confirmation
 */
(function () {
  'use strict';

  /* ── Catalogue briques ─────────────────────────────────── */
  var BRIQUES = {
    /* Présence */
    'landing':        { name: 'Landing Page',              price: 390,  mode: 'once',  days: 3,  cat: 'Présence',       stripe: 'price_LANDING_PH' },
    'vitrine':        { name: 'Site Vitrine',              price: 1490, mode: 'once',  days: 7,  cat: 'Présence',       stripe: 'price_VITRINE_PH' },
    'complet':        { name: 'Site Complet',              price: 2490, mode: 'once',  days: 14, cat: 'Présence',       stripe: 'price_COMPLET_PH' },
    'ecommerce':      { name: 'E-commerce',                price: 3490, mode: 'once',  days: 21, cat: 'Présence',       stripe: 'price_ECOMMERCE_PH' },
    'google-biz':     { name: 'Fiche Google Business',     price: 290,  mode: 'once',  days: 2,  cat: 'Présence',       stripe: 'price_GOOGLE_BIZ_PH' },
    'email-pro':      { name: 'Email Professionnel',       price: 90,   mode: 'once',  days: 1,  cat: 'Présence',       stripe: 'price_EMAIL_PRO_PH' },
    /* Acquisition */
    'seo-local':      { name: 'SEO Local',                 price: 490,  mode: 'month', days: 7,  cat: 'Acquisition',    stripe: 'price_SEO_LOCAL_PH' },
    'pub-google':     { name: 'Pub Google / Meta',         price: 390,  mode: 'month', days: 5,  cat: 'Acquisition',    stripe: 'price_PUB_GOOGLE_PH', note: '+ budget pub' },
    'visuels-rs':     { name: 'Pack Visuels Réseaux',      price: 290,  mode: 'month', days: 2,  cat: 'Acquisition',    stripe: 'price_VISUELS_RS_PH' },
    'contenu-mensuel':{ name: 'Contenu Mensuel',           price: 390,  mode: 'month', days: 5,  cat: 'Acquisition',    stripe: 'price_CONTENU_PH' },
    /* Automatisation */
    'ia-n1':          { name: 'IA N1 – Réponses auto',    price: 290,  mode: 'once',  days: 3,  cat: 'Automatisation', stripe: 'price_IA_N1_PH' },
    'ia-n2':          { name: 'IA N2 – Réservation',      price: 490,  mode: 'once',  days: 7,  cat: 'Automatisation', stripe: 'price_IA_N2_PH' },
    'ia-n3':          { name: 'IA N3 – Sur-mesure',       price: 990,  mode: 'once',  days: 14, cat: 'Automatisation', stripe: 'price_IA_N3_PH' },
    'email-sms':      { name: 'Séquences Email / SMS',    price: 290,  mode: 'once',  days: 5,  cat: 'Automatisation', stripe: 'price_EMAIL_SMS_PH' },
    'facturation':    { name: 'Facturation Peppol',        price: 390,  mode: 'once',  days: 5,  cat: 'Automatisation', stripe: 'price_FACTU_PH' },
    /* Outils */
    'app-metier':     { name: 'Application Métier',        price: 2490, mode: 'once',  days: 21, cat: 'Outils',         stripe: 'price_APP_METIER_PH' },
    'maintenance':    { name: 'Maintenance Mensuelle',     price: 149,  mode: 'month', days: 2,  cat: 'Outils',         stripe: 'price_MAINT_PH' },
    'identite':       { name: 'Identité Visuelle',         price: 690,  mode: 'once',  days: 5,  cat: 'Outils',         stripe: 'price_IDENTITE_PH' },
    'visuels-graph':  { name: 'Visuels & Photos',          price: 290,  mode: 'once',  days: 2,  cat: 'Outils',         stripe: 'price_VISUELS_PH' },
    'videos':         { name: 'Vidéos & Contenus',         price: 490,  mode: 'once',  days: 3,  cat: 'Outils',         stripe: 'price_VIDEOS_PH' },
    /* Packs */
    'pack-booking':   { name: 'Pack Booking Pro',          price: 249,  mode: 'month', days: 5,  cat: 'Pack',           stripe: 'price_PACK_BOOKING_PH' },
    'pack-visibilite':{ name: 'Pack Visibilité Locale',    price: 179,  mode: 'month', days: 5,  cat: 'Pack',           stripe: 'price_PACK_VIS_PH' },
    'pack-resto':     { name: 'Pack Resto & Table',        price: 199,  mode: 'month', days: 5,  cat: 'Pack',           stripe: 'price_PACK_RESTO_PH' },
    'pack-vitrine':   { name: 'Pack Vitrine Pro',          price: 149,  mode: 'month', days: 5,  cat: 'Pack',           stripe: 'price_PACK_VIT_PH' },
    /* Hébergement */
    'hebergement':    { name: 'Hébergement Pro',           price: 49,   mode: 'month', days: 1,  cat: 'Hébergement',    stripe: 'price_HEBERG_PH' },
    'monitoring':     { name: 'Monitoring & Alertes 24/7', price: 29,   mode: 'month', days: 1,  cat: 'Hébergement',    stripe: 'price_MONIT_PH' }
  };

  /* ── Calcul date livraison (J+N ouvrés, sam/dim off) ── */
  function addBusinessDays(date, n) {
    var d = new Date(date);
    var added = 0;
    while (added < n) {
      d.setDate(d.getDate() + 1);
      var dow = d.getDay();
      if (dow !== 0 && dow !== 6) added++;
    }
    return d;
  }

  function formatDate(d) {
    var jours = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
    var mois  = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
    return jours[d.getDay()] + ' ' + d.getDate() + ' ' + mois[d.getMonth()];
  }

  /* Créneaux 30 min pour l'appel onboarding */
  var SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30'];

  /* ── État ── */
  var currentService = null;
  var currentStep    = 0;
  var isAnimating    = false;
  var chosenDate     = null;
  var chosenSlot     = null;

  /* ── DOM refs ── */
  var modal, backdrop, shell;
  var panels = {};

  /* ── Injecter HTML du modal ── */
  function injectModal() {
    if (document.getElementById('ord2-modal')) return;

    var html = [
      '<div id="ord2-modal" role="dialog" aria-modal="true" aria-label="Commander un service" aria-hidden="true">',
        '<div id="ord2-backdrop"></div>',
        '<div id="ord2-shell">',

          /* Header */
          '<div id="ord2-header">',
            '<div id="ord2-prog-track"><div id="ord2-prog-fill"></div></div>',
            '<button id="ord2-close" type="button" aria-label="Fermer">',
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>',
            '</button>',
          '</div>',

          /* Step 0 — Choix */
          '<div id="ord2-s0" class="ord2-panel" hidden>',
            '<div class="ord2-panel__inner">',
              '<p class="ord2-kicker">Vous commandez</p>',
              '<h2 id="ord2-s0-name" class="ord2-title"></h2>',
              '<p id="ord2-s0-price" class="ord2-price-line"></p>',
              '<div class="ord2-choice-grid">',
                '<button class="ord2-choice-btn" id="ord2-go-form">',
                  '<span class="ord2-choice-btn__icon">',
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
                  '</span>',
                  '<span class="ord2-choice-btn__label">Commander en ligne</span>',
                  '<span class="ord2-choice-btn__sub">Formulaire détaillé — livraison garantie</span>',
                '</button>',
                '<a class="ord2-choice-btn ord2-choice-btn--light" id="ord2-go-contact" href="#contact">',
                  '<span class="ord2-choice-btn__icon">',
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>',
                  '</span>',
                  '<span class="ord2-choice-btn__label">Parler à un humain d\'abord</span>',
                  '<span class="ord2-choice-btn__sub">On vous rappelle sous 24 h — sans engagement</span>',
                '</a>',
              '</div>',
            '</div>',
          '</div>',

          /* Step 1 — Formulaire intake */
          '<div id="ord2-s1" class="ord2-panel" hidden>',
            '<div class="ord2-panel__inner">',
              '<p class="ord2-kicker">Votre brief</p>',
              '<h2 class="ord2-title">Dites-nous tout<br><span class="ord2-grad">sur votre projet.</span></h2>',
              '<p class="ord2-lead">Plus vous êtes précis, plus vite on démarre — et mieux ça colle à votre activité.</p>',
              '<form id="ord2-form" novalidate autocomplete="off">',

                /* Honeypot */
                '<div style="position:absolute;left:-9999px;width:0;height:0;overflow:hidden" aria-hidden="true"><input type="text" name="ord2_hp" tabindex="-1" autocomplete="off"></div>',

                /* Bloc A — Le projet */
                '<div class="ord2-bloc">',
                  '<div class="ord2-bloc__head"><span class="ord2-bloc__letter">A</span><span class="ord2-bloc__title">Le projet</span></div>',
                  '<div class="ord2-service-recap" id="ord2-service-recap"></div>',
                  '<div class="ord2-field ord2-field--full">',
                    '<label for="o2-objective">Objectif principal <span class="ord2-req">*</span></label>',
                    '<select id="o2-objective" name="objective" required>',
                      '<option value="">— Choisir —</option>',
                      '<option value="attract">Attirer plus de clients</option>',
                      '<option value="convert">Convertir mieux les visiteurs</option>',
                      '<option value="automate">Automatiser mes tâches répétitives</option>',
                      '<option value="organize">Mieux m\'organiser / gérer mon équipe</option>',
                      '<option value="visibility">Gagner en visibilité / crédibilité</option>',
                      '<option value="launch">Lancer mon activité en ligne</option>',
                      '<option value="other">Autre</option>',
                    '</select>',
                  '</div>',
                  '<div class="ord2-field ord2-field--full">',
                    '<label for="o2-existing">Site web actuel</label>',
                    '<select id="o2-existing" name="existing_site">',
                      '<option value="none">Je n\'ai pas de site</option>',
                      '<option value="old">J\'ai un site mais il est obsolète</option>',
                      '<option value="ok">J\'ai un site fonctionnel</option>',
                      '<option value="diy">J\'ai fait moi-même un site (Wix, Jimdo…)</option>',
                    '</select>',
                  '</div>',
                  '<div class="ord2-field ord2-field--full">',
                    '<label for="o2-url">URL de votre site actuel (si vous en avez un)</label>',
                    '<input type="url" id="o2-url" name="site_url" placeholder="https://votre-site.be">',
                  '</div>',
                  '<div class="ord2-field ord2-field--full">',
                    '<label for="o2-deadline">Avez-vous une date butoir ? <span class="ord2-req">*</span></label>',
                    '<select id="o2-deadline" name="deadline" required>',
                      '<option value="">— Choisir —</option>',
                      '<option value="asap">Dès que possible</option>',
                      '<option value="2w">Dans les 2 semaines</option>',
                      '<option value="1m">Dans le mois</option>',
                      '<option value="flex">Je suis flexible</option>',
                    '</select>',
                  '</div>',
                  '<div class="ord2-field ord2-field--full">',
                    '<label for="o2-project-desc">Décrivez votre projet en quelques phrases <span class="ord2-req">*</span></label>',
                    '<textarea id="o2-project-desc" name="project_desc" rows="4" required placeholder="Ce que vous voulez accomplir, vos attentes, ce qui vous tient à cœur…"></textarea>',
                  '</div>',
                  '<div class="ord2-field ord2-field--full">',
                    '<label for="o2-competitors">Concurrents ou sites que vous admirez (URLs)</label>',
                    '<textarea id="o2-competitors" name="competitors" rows="2" placeholder="https://exemple1.be, https://exemple2.be — on évite de leur ressembler (ou on s\'en inspire si vous préférez)"></textarea>',
                  '</div>',
                '</div>',

                /* Bloc B — Votre activité */
                '<div class="ord2-bloc">',
                  '<div class="ord2-bloc__head"><span class="ord2-bloc__letter">B</span><span class="ord2-bloc__title">Votre activité</span></div>',
                  '<div class="ord2-field-row">',
                    '<div class="ord2-field">',
                      '<label for="o2-business">Nom de l\'entreprise <span class="ord2-req">*</span></label>',
                      '<input type="text" id="o2-business" name="business_name" required placeholder="Ex : Boulangerie Lecomte">',
                    '</div>',
                    '<div class="ord2-field">',
                      '<label for="o2-sector">Secteur d\'activité <span class="ord2-req">*</span></label>',
                      '<select id="o2-sector" name="sector" required>',
                        '<option value="">— Choisir —</option>',
                        '<option value="beaute">Beauté & Bien-être</option>',
                        '<option value="sante">Santé & Paramédical</option>',
                        '<option value="artisan">Artisan & Bâtiment</option>',
                        '<option value="horeca">HoReCa & Restauration</option>',
                        '<option value="commerce">Commerce & Boutique</option>',
                        '<option value="immo">Immobilier</option>',
                        '<option value="juridique">Juridique & Notariat</option>',
                        '<option value="comptable">Comptabilité & Finance</option>',
                        '<option value="evenement">Événementiel</option>',
                        '<option value="formation">Formation & Éducation</option>',
                        '<option value="fitness">Fitness & Sport</option>',
                        '<option value="auto">Automobile & Garage</option>',
                        '<option value="autre">Autre</option>',
                      '</select>',
                    '</div>',
                  '</div>',
                  '<div class="ord2-field-row">',
                    '<div class="ord2-field">',
                      '<label for="o2-city">Ville / Zone géographique <span class="ord2-req">*</span></label>',
                      '<input type="text" id="o2-city" name="city" required placeholder="Ex : Charleroi, Namur…">',
                    '</div>',
                    '<div class="ord2-field">',
                      '<label for="o2-size">Effectif de l\'entreprise</label>',
                      '<select id="o2-size" name="size">',
                        '<option value="solo">Solo / indépendant</option>',
                        '<option value="2-5">2 – 5 personnes</option>',
                        '<option value="6-20">6 – 20 personnes</option>',
                        '<option value="20+">Plus de 20 personnes</option>',
                      '</select>',
                    '</div>',
                  '</div>',
                  '<div class="ord2-field ord2-field--full">',
                    '<label for="o2-business-desc">En quoi consiste votre activité ? <span class="ord2-req">*</span></label>',
                    '<textarea id="o2-business-desc" name="business_desc" rows="3" required placeholder="Ce que vous faites, votre clientèle, ce qui vous distingue de vos concurrents"></textarea>',
                  '</div>',
                  '<div class="ord2-field ord2-field--full">',
                    '<label for="o2-tva">Numéro de TVA belge (si applicable)</label>',
                    '<input type="text" id="o2-tva" name="tva" placeholder="BE 0XXX.XXX.XXX">',
                  '</div>',
                '</div>',

                /* Bloc C — Contenu & identité */
                '<div class="ord2-bloc">',
                  '<div class="ord2-bloc__head"><span class="ord2-bloc__letter">C</span><span class="ord2-bloc__title">Contenu & identité</span></div>',
                  '<div class="ord2-field ord2-field--full">',
                    '<label>De quoi disposez-vous déjà ? (cochez tout ce qui s\'applique)</label>',
                    '<div class="ord2-checks">',
                      '<label class="ord2-check"><input type="checkbox" name="assets" value="logo"> Logo existant</label>',
                      '<label class="ord2-check"><input type="checkbox" name="assets" value="photos"> Photos professionnelles</label>',
                      '<label class="ord2-check"><input type="checkbox" name="assets" value="textes"> Textes / rédaction</label>',
                      '<label class="ord2-check"><input type="checkbox" name="assets" value="charte"> Charte graphique</label>',
                      '<label class="ord2-check"><input type="checkbox" name="assets" value="videos"> Vidéos</label>',
                      '<label class="ord2-check"><input type="checkbox" name="assets" value="rien"> Je pars de zéro</label>',
                    '</div>',
                  '</div>',
                  '<div class="ord2-field ord2-field--full">',
                    '<label for="o2-tone">Ton & personnalité souhaitée</label>',
                    '<select id="o2-tone" name="tone">',
                      '<option value="">— Choisir —</option>',
                      '<option value="pro">Professionnel & sérieux</option>',
                      '<option value="warm">Chaleureux & de proximité</option>',
                      '<option value="premium">Premium & haut de gamme</option>',
                      '<option value="dynamic">Dynamique & moderne</option>',
                      '<option value="minimal">Épuré & minimaliste</option>',
                      '<option value="bold">Audacieux & original</option>',
                    '</select>',
                  '</div>',
                  '<div class="ord2-field ord2-field--full">',
                    '<label for="o2-palette">Couleurs de marque existantes (codes hex, noms)</label>',
                    '<input type="text" id="o2-palette" name="palette" placeholder="Ex : Noir #0c0c0c, Or #F6A800 — ou « je n\'en ai pas encore »">',
                  '</div>',
                  '<div class="ord2-field ord2-field--full">',
                    '<label for="o2-lang">Langue(s) du site / des contenus</label>',
                    '<select id="o2-lang" name="languages">',
                      '<option value="fr">Français uniquement</option>',
                      '<option value="fr-nl">Français + Néerlandais</option>',
                      '<option value="fr-en">Français + Anglais</option>',
                      '<option value="multi">Multilingue (préciser dans la description)</option>',
                    '</select>',
                  '</div>',
                  '<div class="ord2-field ord2-field--full">',
                    '<label for="o2-content-notes">Autres précisions sur votre image & contenu</label>',
                    '<textarea id="o2-content-notes" name="content_notes" rows="2" placeholder="Style que vous aimez, choses à absolument éviter, références visuelles…"></textarea>',
                  '</div>',
                '</div>',

                /* Bloc D — Vos coordonnées */
                '<div class="ord2-bloc">',
                  '<div class="ord2-bloc__head"><span class="ord2-bloc__letter">D</span><span class="ord2-bloc__title">Vos coordonnées</span></div>',
                  '<div class="ord2-field-row">',
                    '<div class="ord2-field">',
                      '<label for="o2-fname">Prénom <span class="ord2-req">*</span></label>',
                      '<input type="text" id="o2-fname" name="fname" required autocomplete="given-name">',
                    '</div>',
                    '<div class="ord2-field">',
                      '<label for="o2-lname">Nom <span class="ord2-req">*</span></label>',
                      '<input type="text" id="o2-lname" name="lname" required autocomplete="family-name">',
                    '</div>',
                  '</div>',
                  '<div class="ord2-field-row">',
                    '<div class="ord2-field">',
                      '<label for="o2-email">Email <span class="ord2-req">*</span></label>',
                      '<input type="email" id="o2-email" name="email" required autocomplete="email">',
                    '</div>',
                    '<div class="ord2-field">',
                      '<label for="o2-phone">Téléphone <span class="ord2-req">*</span></label>',
                      '<input type="tel" id="o2-phone" name="phone" required autocomplete="tel" placeholder="+32 …">',
                    '</div>',
                  '</div>',
                  '<div class="ord2-field ord2-field--full">',
                    '<label for="o2-best-time">Meilleur moment pour vous joindre</label>',
                    '<select id="o2-best-time" name="best_time">',
                      '<option value="matin">Matin (9 h – 12 h)</option>',
                      '<option value="midi">Midi (12 h – 14 h)</option>',
                      '<option value="aprem">Après-midi (14 h – 17 h)</option>',
                      '<option value="soir">Fin de journée (17 h – 19 h)</option>',
                    '</select>',
                  '</div>',
                  '<div class="ord2-field ord2-field--full">',
                    '<label for="o2-notes">Questions ou remarques supplémentaires</label>',
                    '<textarea id="o2-notes" name="notes" rows="2" placeholder="Tout ce que vous voulez nous faire savoir…"></textarea>',
                  '</div>',
                '</div>',

                '<div id="ord2-form-error" class="ord2-error" hidden></div>',
                '<div class="ord2-actions">',
                  '<button type="submit" class="ord2-btn ord2-btn--primary" id="ord2-submit-form">Choisir ma date de livraison →</button>',
                '</div>',
              '</form>',
            '</div>',
          '</div>',

          /* Step 2 — Date & créneau */
          '<div id="ord2-s2" class="ord2-panel" hidden>',
            '<div class="ord2-panel__inner">',
              '<p class="ord2-kicker">Livraison & onboarding</p>',
              '<h2 class="ord2-title">Quand voulez-vous<br><span class="ord2-grad">être livré ?</span></h2>',
              '<div id="ord2-delivery-info" class="ord2-delivery-info"></div>',
              '<div class="ord2-slot-section">',
                '<p class="ord2-slot-label">Créneau d\'appel onboarding (30 min)</p>',
                '<p class="ord2-slot-sub">Un appel de prise en main le jour de la livraison — on vous explique tout, vous prenez les rênes.</p>',
                '<div id="ord2-slots" class="ord2-slots"></div>',
              '</div>',
              '<div id="ord2-date-error" class="ord2-error" hidden></div>',
              '<div class="ord2-actions ord2-actions--split">',
                '<button class="ord2-btn ord2-btn--ghost" id="ord2-back-1">← Modifier le brief</button>',
                '<button class="ord2-btn ord2-btn--primary" id="ord2-to-payment">Voir le récapitulatif →</button>',
              '</div>',
            '</div>',
          '</div>',

          /* Step 3 — Récap & paiement */
          '<div id="ord2-s3" class="ord2-panel" hidden>',
            '<div class="ord2-panel__inner">',
              '<p class="ord2-kicker">Récapitulatif</p>',
              '<h2 class="ord2-title">On est prêts à<br><span class="ord2-grad">démarrer.</span></h2>',
              '<div id="ord2-recap" class="ord2-recap"></div>',
              '<div id="ord2-pay-error" class="ord2-error" hidden></div>',
              '<div class="ord2-actions ord2-actions--split">',
                '<button class="ord2-btn ord2-btn--ghost" id="ord2-back-2">← Modifier la date</button>',
                '<button class="ord2-btn ord2-btn--primary" id="ord2-pay-btn">',
                  '<span id="ord2-pay-label">Payer & démarrer</span>',
                  '<svg class="ord2-lock" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/></svg>',
                '</button>',
              '</div>',
              '<p class="ord2-secure-note">Paiement sécurisé via Stripe · Données chiffrées · Aucun accès à votre carte</p>',
            '</div>',
          '</div>',

          /* Step 4 — Confirmation */
          '<div id="ord2-s4" class="ord2-panel" hidden>',
            '<div class="ord2-panel__inner ord2-panel__inner--center">',
              '<div class="ord2-success-icon">',
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
              '</div>',
              '<h2 class="ord2-title">Commande confirmée.</h2>',
              '<p class="ord2-lead" id="ord2-confirm-text"></p>',
              '<div id="ord2-confirm-details" class="ord2-confirm-details"></div>',
              '<button class="ord2-btn ord2-btn--ghost ord2-btn--sm" id="ord2-close-confirm">Fermer</button>',
            '</div>',
          '</div>',

        '</div>', /* end #ord2-shell */
      '</div>'   /* end #ord2-modal */
    ].join('');

    document.body.insertAdjacentHTML('beforeend', html);
  }

  /* ── Références DOM ── */
  function cacheRefs() {
    modal    = document.getElementById('ord2-modal');
    backdrop = document.getElementById('ord2-backdrop');
    shell    = document.getElementById('ord2-shell');
    panels   = {
      0: document.getElementById('ord2-s0'),
      1: document.getElementById('ord2-s1'),
      2: document.getElementById('ord2-s2'),
      3: document.getElementById('ord2-s3'),
      4: document.getElementById('ord2-s4')
    };
  }

  /* ── Progress bar ── */
  var PROGRESS = { 0: 10, 1: 30, 2: 60, 3: 85, 4: 100 };
  function setProgress(step) {
    var fill = document.getElementById('ord2-prog-fill');
    if (fill) fill.style.width = (PROGRESS[step] || 0) + '%';
  }

  /* ── Transition entre étapes ── */
  function showPanel(id, fromRight) {
    if (fromRight === undefined) fromRight = true;
    Object.keys(panels).forEach(function (k) {
      panels[k].hidden = true;
    });
    var panel = panels[id];
    if (!panel) return;
    panel.hidden = false;
    panel.scrollTop = 0;

    if (typeof gsap !== 'undefined') {
      var dir = fromRight ? 28 : -28;
      gsap.fromTo(panel,
        { opacity: 0, x: dir },
        { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out',
          onComplete: function () { isAnimating = false; } }
      );
    } else {
      isAnimating = false;
    }
  }

  /* ── Ouvrir / fermer ── */
  function openModal() {
    if (!modal) { injectModal(); cacheRefs(); bindEvents(); }
    if (isAnimating) return;
    isAnimating = true;
    modal.classList.add('is-open');
    modal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    setProgress(0);
    currentStep = 0;
    chosenDate = null;
    chosenSlot = null;
    fillStep0();
    showPanel(0, true);

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(shell,
        { opacity: 0, y: 22, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.38, ease: 'power3.out',
          onComplete: function () { isAnimating = false; } }
      );
    } else {
      isAnimating = false;
    }
  }

  function closeModal() {
    if (!modal) return;
    if (typeof gsap !== 'undefined') {
      gsap.to(shell, { opacity: 0, y: 14, scale: 0.97, duration: 0.22, ease: 'power2.in', onComplete: finishClose });
      gsap.to(backdrop, { opacity: 0, duration: 0.22 });
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
    currentStep = 0;
  }

  function goToStep(step, fromRight) {
    if (isAnimating) return;
    isAnimating = true;
    currentStep = step;
    setProgress(step);
    showPanel(step, fromRight !== false);
  }

  /* ── Remplir étape 0 (choix) ── */
  function fillStep0() {
    if (!currentService) return;
    var b = BRIQUES[currentService];
    if (!b) return;

    var nameEl  = document.getElementById('ord2-s0-name');
    var priceEl = document.getElementById('ord2-s0-price');
    if (nameEl)  nameEl.textContent  = b.name;
    if (priceEl) priceEl.textContent = formatPrice(b);
  }

  function formatPrice(b) {
    var s = b.price.toLocaleString('fr-BE') + ' €';
    if (b.mode === 'month') s += ' / mois';
    if (b.note) s += ' ' + b.note;
    return s;
  }

  /* ── Remplir le récap service dans le formulaire ── */
  function fillServiceRecap() {
    var el = document.getElementById('ord2-service-recap');
    if (!el || !currentService) return;
    var b = BRIQUES[currentService];
    if (!b) return;
    el.innerHTML = '<div class="ord2-svc-pill"><span class="ord2-svc-pill__cat">' + b.cat + '</span><span class="ord2-svc-pill__name">' + b.name + '</span><span class="ord2-svc-pill__price">' + formatPrice(b) + '</span></div>';
  }

  /* ── Remplir étape 2 (date & créneaux) ── */
  function fillStep2() {
    if (!currentService) return;
    var b = BRIQUES[currentService];
    if (!b) return;

    var deliveryDate = addBusinessDays(new Date(), b.days);
    chosenDate = deliveryDate;

    var infoEl = document.getElementById('ord2-delivery-info');
    if (infoEl) {
      infoEl.innerHTML = [
        '<div class="ord2-delivery-card">',
          '<div class="ord2-delivery-card__row">',
            '<span class="ord2-delivery-card__label">Service</span>',
            '<span class="ord2-delivery-card__val">' + b.name + '</span>',
          '</div>',
          '<div class="ord2-delivery-card__row">',
            '<span class="ord2-delivery-card__label">Délai de livraison</span>',
            '<span class="ord2-delivery-card__val ord2-delivery-card__val--accent">J+' + b.days + ' ouvré' + (b.days > 1 ? 's' : '') + '</span>',
          '</div>',
          '<div class="ord2-delivery-card__row">',
            '<span class="ord2-delivery-card__label">Date estimée</span>',
            '<span class="ord2-delivery-card__val"><strong>' + formatDate(deliveryDate) + '</strong></span>',
          '</div>',
          '<p class="ord2-delivery-card__note">Les week-ends et jours fériés ne sont pas comptés. La date est confirmée après paiement.</p>',
        '</div>'
      ].join('');
    }

    /* Créneaux */
    var slotsEl = document.getElementById('ord2-slots');
    if (slotsEl) {
      slotsEl.innerHTML = '';
      SLOTS.forEach(function (slot) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ord2-slot';
        btn.textContent = slot;
        btn.setAttribute('data-slot', slot);
        if (chosenSlot === slot) btn.classList.add('is-selected');
        btn.addEventListener('click', function () {
          slotsEl.querySelectorAll('.ord2-slot').forEach(function (s) { s.classList.remove('is-selected'); });
          btn.classList.add('is-selected');
          chosenSlot = slot;
        });
        slotsEl.appendChild(btn);
      });
    }
  }

  /* ── Remplir étape 3 (récap paiement) ── */
  function fillStep3() {
    var recapEl = document.getElementById('ord2-recap');
    if (!recapEl || !currentService) return;
    var b = BRIQUES[currentService];
    if (!b) return;

    var fname = (document.getElementById('o2-fname') || {}).value || '';
    var lname = (document.getElementById('o2-lname') || {}).value || '';
    var email = (document.getElementById('o2-email') || {}).value || '';
    var biz   = (document.getElementById('o2-business') || {}).value || '';

    var dateStr = chosenDate ? formatDate(chosenDate) : '—';
    var slotStr = chosenSlot || '—';

    recapEl.innerHTML = [
      '<div class="ord2-recap__section">',
        '<div class="ord2-recap__row"><span>Service</span><strong>' + b.name + '</strong></div>',
        '<div class="ord2-recap__row"><span>Catégorie</span><span>' + b.cat + '</span></div>',
        '<div class="ord2-recap__row ord2-recap__row--total">',
          '<span>' + (b.mode === 'month' ? 'Abonnement mensuel' : 'Paiement unique') + '</span>',
          '<strong class="ord2-recap__price">' + formatPrice(b) + '</strong>',
        '</div>',
      '</div>',
      '<div class="ord2-recap__section">',
        '<div class="ord2-recap__row"><span>Livraison estimée</span><strong>' + dateStr + '</strong></div>',
        '<div class="ord2-recap__row"><span>Appel onboarding</span><span>' + dateStr + ' à ' + slotStr + '</span></div>',
      '</div>',
      (fname || biz) ? [
        '<div class="ord2-recap__section">',
          biz ? '<div class="ord2-recap__row"><span>Entreprise</span><span>' + biz + '</span></div>' : '',
          fname ? '<div class="ord2-recap__row"><span>Contact</span><span>' + fname + ' ' + lname + '</span></div>' : '',
          email ? '<div class="ord2-recap__row"><span>Email</span><span>' + email + '</span></div>' : '',
        '</div>'
      ].join('') : '',
      '<div class="ord2-recap__vat"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>Prix HTVA · franchise TVA art. 56bis (si applicable)</div>'
    ].join('');

    var payLabel = document.getElementById('ord2-pay-label');
    if (payLabel) payLabel.textContent = 'Payer ' + formatPrice(b) + ' →';
  }

  /* ── Validation formulaire ── */
  function validateForm() {
    var required = ['o2-objective', 'o2-deadline', 'o2-project-desc', 'o2-business', 'o2-sector', 'o2-city', 'o2-business-desc', 'o2-fname', 'o2-lname', 'o2-email', 'o2-phone'];
    for (var i = 0; i < required.length; i++) {
      var el = document.getElementById(required[i]);
      if (!el) continue;
      if (!el.value.trim()) {
        el.focus();
        return 'Veuillez remplir tous les champs obligatoires (marqués *).';
      }
    }
    var email = document.getElementById('o2-email');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      return 'Adresse email invalide.';
    }
    return null;
  }

  /* ── Soumettre paiement Stripe ── */
  function submitPayment() {
    var btn = document.getElementById('ord2-pay-btn');
    var errEl = document.getElementById('ord2-pay-error');
    if (btn) { btn.disabled = true; btn.classList.add('is-loading'); }
    if (errEl) errEl.hidden = true;

    var b = BRIQUES[currentService];
    if (!b) return;

    /* Collecter données formulaire */
    var formData = {};
    var form = document.getElementById('ord2-form');
    if (form) {
      var inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(function (el) {
        if (!el.name || el.name === 'ord2_hp') return;
        if (el.type === 'checkbox') {
          if (!formData[el.name]) formData[el.name] = [];
          if (el.checked) formData[el.name].push(el.value);
        } else {
          formData[el.name] = el.value;
        }
      });
    }

    var payload = {
      serviceId:    currentService,
      priceId:      b.stripe,
      mode:         b.mode === 'month' ? 'subscription' : 'payment',
      deliveryDate: chosenDate ? chosenDate.toISOString().split('T')[0] : null,
      deliverySlot: chosenSlot,
      intake:       formData
    };

    fetch('/api/order/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        throw new Error(data.error || 'Erreur serveur');
      }
    })
    .catch(function (err) {
      if (btn) { btn.disabled = false; btn.classList.remove('is-loading'); }
      if (errEl) {
        errEl.textContent = 'Une erreur s\'est produite : ' + err.message + '. Réessayez ou contactez-nous.';
        errEl.hidden = false;
      }
    });
  }

  /* ── Lier les événements ── */
  function bindEvents() {
    /* Fermer */
    document.getElementById('ord2-close').addEventListener('click', closeModal);
    document.getElementById('ord2-backdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) closeModal();
    });

    /* Étape 0 → form */
    document.getElementById('ord2-go-form').addEventListener('click', function () {
      fillServiceRecap();
      goToStep(1, true);
    });

    /* Lien contact — ferme le modal */
    document.getElementById('ord2-go-contact').addEventListener('click', function () {
      closeModal();
    });

    /* Submit formulaire → step 2 */
    document.getElementById('ord2-form').addEventListener('submit', function (e) {
      e.preventDefault();
      /* Honeypot */
      var hp = this.querySelector('[name="ord2_hp"]');
      if (hp && hp.value) return;

      var err = validateForm();
      var errEl = document.getElementById('ord2-form-error');
      if (err) {
        if (errEl) { errEl.textContent = err; errEl.hidden = false; }
        return;
      }
      if (errEl) errEl.hidden = true;
      fillStep2();
      goToStep(2, true);
    });

    /* Retour step 1 */
    document.getElementById('ord2-back-1').addEventListener('click', function () {
      goToStep(1, false);
    });

    /* Step 2 → step 3 */
    document.getElementById('ord2-to-payment').addEventListener('click', function () {
      var errEl = document.getElementById('ord2-date-error');
      if (!chosenSlot) {
        if (errEl) { errEl.textContent = 'Choisissez un créneau d\'appel onboarding.'; errEl.hidden = false; }
        return;
      }
      if (errEl) errEl.hidden = true;
      fillStep3();
      goToStep(3, true);
    });

    /* Retour step 2 */
    document.getElementById('ord2-back-2').addEventListener('click', function () {
      goToStep(2, false);
    });

    /* Paiement */
    document.getElementById('ord2-pay-btn').addEventListener('click', submitPayment);

    /* Fermer confirmation */
    document.getElementById('ord2-close-confirm').addEventListener('click', closeModal);
  }

  /* ── API publique ── */
  function openOrderV2(serviceId) {
    currentService = serviceId && BRIQUES[serviceId] ? serviceId : null;
    if (!modal) { injectModal(); cacheRefs(); bindEvents(); }
    openModal();
  }

  /* ── Activer les boutons [data-order-v2] dans le DOM ── */
  function initTriggers() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-order-v2]');
      if (!btn) return;
      e.preventDefault();
      var sid = btn.getAttribute('data-order-v2');
      openOrderV2(sid);
    });
  }

  /* ── Stripe return URL (succès) ── */
  function handleReturn() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('order') === 'success') {
      /* Afficher confirmation */
      if (!modal) { injectModal(); cacheRefs(); bindEvents(); }
      currentStep = 4;
      var confirmText = document.getElementById('ord2-confirm-text');
      if (confirmText) confirmText.textContent = 'Votre commande est enregistrée. Vous recevrez un email de confirmation dans quelques minutes. À très vite !';
      modal.classList.add('is-open');
      modal.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden';
      setProgress(4);
      showPanel(4, true);
      /* Nettoyer URL */
      history.replaceState(null, '', window.location.pathname);
    }
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function () {
    initTriggers();
    handleReturn();
  });

  /* Export global */
  window.openOrderV2 = openOrderV2;

}());
