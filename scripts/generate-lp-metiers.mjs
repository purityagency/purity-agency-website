import fs from 'node:fs';
import path from 'node:path';
import { caseStudies } from '../data/case-studies.mjs';

const targetDir = 'cas-concrets';

const DATA_METIERS = {
  renovation: {
    kicker: "Solution Digitale Métier · Rénovation & Bâtiment",
    h1: "Des chantiers qualifiés sans passer vos soirées à faire des devis sans suite.",
    subtitle: "Artisans & entrepreneurs du bâtiment en Wallonie : filtrez les curieux sans budget et signez des chantiers rentables grâce à un parcours client pensé pour votre métier.",
    demoUrl: "/demos/renovation/",
    demoName: "Atelier Noma",
    demoTagline: "Démonstration d'un artisan rénovateur haut de gamme",
    pains: [
      { bad: "Perte de 4 à 8h par semaine sur des devis sans suite", good: "Qualification en amont : photos, surface et budget connus avant tout déplacement." },
      { bad: "Photos de chantiers éparpillées sur WhatsApp ou Facebook", good: "Galerie avant/après ultra-rapide qui prouve votre savoir-faire en 3 secondes." },
      { bad: "Invisible sur Google face aux plateformes de devis payantes", good: "Référencement local Charleroi & Wallonie pour capter directement les propriétaires." }
    ],
    features: [
      { title: "Formulaire de brief chantier par pièce", desc: "Le client précise les travaux, la surface estimée et son budget prévisionnel avant de vous contacter." },
      { title: "Galerie de réalisations Avant / Après", desc: "Mise en scène valorisante de vos chantiers récents avec slider de comparaison immersif." },
      { title: "Qualification & relances automatisées", desc: "Confirmation immédiate au client par email/SMS et transmission du dossier prêt à chiffrer." }
    ]
  },
  restaurant: {
    kicker: "Solution Digitale Métier · Restaurants & Horeca",
    h1: "Remplissez votre salle midi et soir sans payer 30 % de commission aux plateformes.",
    subtitle: "Restaurateurs à Charleroi & Wallonie : reprenez le contrôle direct de vos clients avec une carte mobile instantanée et des réservations de table sans intermédiaire.",
    demoUrl: "/demos/restaurant/",
    demoName: "Table Serein",
    demoTagline: "Démonstration d'un restaurant de quartier moderne",
    pains: [
      { bad: "Commissions abusives des plateformes (jusqu'à 30 % par commande)", good: "100 % de votre chiffre d'affaires reste dans votre caisse, zéro commission sur vos couverts." },
      { bad: "Menus au format PDF lents et illisibles qui font fuir les clients", good: "Carte mobile fluide, appétissante, avec allergènes et suggestions du jour." },
      { bad: "Téléphone qui sonne en plein coup de feu pour réserver", good: "Module de réservation automatique en direct avec gestion des créneaux et couverts." }
    ],
    features: [
      { title: "Carte digitale mobile ultra-rapide", desc: "Navigation fluide par catégories, suggestions du chef et mise à jour facile des prix." },
      { title: "Réservation de table sans commission", desc: "Vos clients réservent en ligne 24h/24 avec choix du service et confirmation automatique." },
      { title: "Gestion des allergies & préférences", desc: "Collecte des régimes spécifiques en amont pour un accueil soigné sans stress en cuisine." }
    ]
  },
  garage: {
    kicker: "Solution Digitale Métier · Garages & Carrosserie",
    h1: "Automatisez vos prises de rendez-vous et vos devis carrosserie en 2 minutes.",
    subtitle: "Garagistes et carrossiers indépendants : recevez la plaque, les photos des dégâts et la description de panne directement sur votre atelier avant même le premier appel.",
    demoUrl: "/demos/garage/",
    demoName: "Garage Rive",
    demoTagline: "Démonstration d'un garage & carrosserie moderne",
    pains: [
      { bad: "Téléphone qui sonne sans arrêt pendant que vous êtes sous le pont", good: "Vos clients prennent rendez-vous et décrivent leur problème en ligne à toute heure." },
      { bad: "Devis carrosserie impossibles à estimer à distance", good: "Envoi rapide des photos du choc et du numéro de châssis depuis leur smartphone." },
      { bad: "Voitures réparées qui encombrent l'atelier sans nouvelles du client", good: "Alerte automatique par SMS ou WhatsApp dès que le véhicule est prêt à partir." }
    ],
    features: [
      { title: "Demande de rendez-vous avec immatriculation", desc: "Identification rapide du modèle et du motif d'intervention (entretien, freins, pneus, contrôle technique)." },
      { title: "Dépôt de photos des dégâts pour carrosserie", desc: "Téléversement simplifié de 3 photos pour chiffrer les réparations sans immobiliser le véhicule." },
      { title: "Organisation de l'atelier du jour", desc: "Vue synthétique des véhicules attendus pour cadencer le travail des mécaniciens." }
    ]
  },
  chauffage: {
    kicker: "Solution Digitale Métier · Chauffage, Sanitaire & Énergie",
    h1: "Filtrez les urgences dépannage et signez des installations rentables sans interruption.",
    subtitle: "Chauffagistes et installateurs sanitaires en Wallonie : séparez les pannes nocturnes des gros devis de pompes à chaleur grâce à un système de qualification intelligent.",
    demoUrl: "/demos/chauffage/",
    demoName: "Thermiq",
    demoTagline: "Démonstration d'une entreprise de chauffage & énergie",
    pains: [
      { bad: "Dépannages urgents qui viennent saboter vos gros chantiers programmés", good: "Aiguillage direct entre dépannage d'urgence 24h et projet d'installation neuve." },
      { bad: "Questions répétitives sur les primes de la Région Wallonne", good: "Explications claires sur les aides disponibles qui déclenchent la décision d'achat." },
      { bad: "Devis d'installation incomplets par manque d'infos techniques", good: "Collecte de la marque de chaudière, combustible actuel et photos de l'installation." }
    ],
    features: [
      { title: "Double entrée Urgence vs Nouveau Projet", desc: "Le client choisit son degré d'urgence, vous priorisez vos journées selon la rentabilité." },
      { title: "Questionnaire technique pré-rempli", desc: "Marque, âge de la chaudière, type de radiateurs ou plancher chauffant demandés d'avance." },
      { title: "Confirmation et rappel d'entretien annuel", desc: "Base de données client pour relancer automatiquement les entretiens obligatoires." }
    ]
  },
  beaute: {
    kicker: "Solution Digitale Métier · Instituts de Beauté & Spas",
    h1: "Un planning complet 24h/24 et zéro rendez-vous non honoré pour votre institut.",
    subtitle: "Esthéticiennes et gérantes de centres de soins : ne perdez plus vos soirées à fixer des créneaux par message Instagram. Automatisez vos réservations avec acompte.",
    demoUrl: "/demos/beaute/",
    demoName: "Maison Lune",
    demoTagline: "Démonstration d'un institut de beauté raffiné",
    pains: [
      { bad: "Rendez-vous oubliés (no-show) qui créent des trous irrécupérables", good: "Rappels automatiques par SMS/WhatsApp et possibilité d'acompte à la réservation." },
      { bad: "Soirées passées à échanger 15 messages pour caler une manucure", good: "Vos clientes choisissent leur prestation et leur créneau en toute autonomie." },
      { bad: "Clientes indécises face à une liste de prestations incompréhensible", good: "Parcours guidé par objectif beauté (éclat, minceur, détente, regard)." }
    ],
    features: [
      { title: "Réservation de soins en ligne 24h/24", desc: "Planning synchronisé avec vos horaires de cabine, temps de pose et pauses respectés." },
      { title: "Orientation selon le besoin esthétique", desc: "Aide au choix du rituel adapté au type de peau pour augmenter le panier moyen." },
      { title: "Rappels automatiques anti-oubli", desc: "Notifications SMS rassurantes 24h avant le soin pour sécuriser votre chiffre d'affaires." }
    ]
  },
  immobilier: {
    kicker: "Solution Digitale Métier · Agences Immobilières & Courtiers",
    h1: "Multipliez vos mandats exclusifs et qualifiez les acheteurs avant chaque visite.",
    subtitle: "Agents immobiliers IPI en Wallonie : démarquez-vous des grands réseaux franchisés avec une vitrine valorisante et un outil d'estimation qui génère des mandats de vente.",
    demoUrl: "/demos/immobilier/",
    demoName: "Beaux Jours",
    demoTagline: "Démonstration d'une agence immobilière indépendante",
    pains: [
      { bad: "Mandats exclusifs qui partent chez les grands réseaux franchisés", good: "Positionnement d'expert local haut de gamme avec outil d'estimation captateur de leads." },
      { bad: "Visites inutiles avec des acheteurs curieux sans budget validé", good: "Validation du projet et de la capacité financière avant validation du créneau." },
      { bad: "Fiches de biens lentes et mal adaptées aux écrans mobiles", good: "Présentation immersive avec visite virtuelle, plans, quartier et contact WhatsApp direct." }
    ],
    features: [
      { title: "Outil d'estimation vendeur en ligne", desc: "Le propriétaire saisit son bien pour recevoir une fourchette et vous confier le mandat." },
      { title: "Fiches biens immersives haute vitesse", desc: "Photos grand format, caractéristiques PEB, surface et simulation de mensualité." },
      { title: "Demande de visite pré-qualifiée", desc: "Questionnaire préalable sur le plan de financement pour des visites 100 % utiles." }
    ]
  },
  fiduciaire: {
    kicker: "Solution Digitale Métier · Fiduciaires & Experts-Comptables",
    h1: "Captez des PME locales solvables et automatisez la collecte des pièces comptables.",
    subtitle: "Experts-comptables et fiscalistes : modernisez votre image de marque, attirez des entrepreneurs à forte valeur et éliminez les relances incessantes de factures manquantes.",
    demoUrl: "/demos/fiduciaire/",
    demoName: "Clarté & Associés",
    demoTagline: "Démonstration d'une fiduciaire moderne et accessible",
    pains: [
      { bad: "Image de marque vieillotte perçue comme un simple coût administratif", good: "Positionnement de partenaire stratégique pour la rentabilité et l'optimisation fiscale." },
      { bad: "Clients qui déposent leurs factures dans une boîte le dernier jour", good: "Onboarding guidé avec espace de transmission et check-list par échéance." },
      { bad: "Demandes de devis émanant de micro-dossiers non rentables", good: "Orientation par profil d'entreprise (SRL, indépendant, holding) et taille d'activité." }
    ],
    features: [
      { title: "Onboarding interactif de nouveaux clients", desc: "Collecte méthodique des documents juridiques et comptables de départ sans friction." },
      { title: "Guide des obligations et échéances fiscales", desc: "Ressource utile qui valorise votre expertise et positionne votre cabinet en référence." },
      { title: "Premier échange qualifié en 1 clic", desc: "Prise de contact ciblée avec bilan des besoins pour un rendez-vous immédiatement utile." }
    ]
  },
  sante: {
    kicker: "Solution Digitale Métier · Cabinets Médicaux & Paramédicaux",
    h1: "Libérez votre secrétariat, remplissez vos créneaux et rassurez vos patients.",
    subtitle: "Kinésithérapeutes, ostéopathes et centres de santé en Wallonie : offrez une prise de rendez-vous intuitive conforme aux normes belges de confidentialité et gagnez 6h par semaine.",
    demoUrl: "/demos/sante/",
    demoName: "Cabinet Horizon",
    demoTagline: "Démonstration d'un cabinet de soins et rééducation",
    pains: [
      { bad: "Secrétariat débordé d'appels pour savoir quels documents apporter", good: "Consignes claires dès la réservation (prescription médicale, mutuelle, tenue souple)." },
      { bad: "Trous imprévus dans l'agenda suite à des désistements tardifs", good: "Liste d'attente automatisée qui comble immédiatement le moindre créneau libéré." },
      { bad: "Patients anxieux ou mal informés sur le déroulement de la séance", good: "Présentation bienveillante des praticiens, spécialités et conventions INAMI." }
    ],
    features: [
      { title: "Parcours patient première consultation", desc: "Aiguillage selon le motif (post-opératoire, dos, pédiatrie, rééducation sportive)." },
      { title: "Module d'explications pratiques & accès", desc: "Parking, accès PMR, remboursements mutuelle et moyens de paiement acceptés." },
      { title: "Prise de contact cadrée", desc: "Transmission sécurisée du motif de venue pour préparer la consultation sereinement." }
    ]
  },
  animaux: {
    kicker: "Solution Digitale Métier · Toilettage & Soins Animaliers",
    h1: "Bloquez vos créneaux de toilettage avec acompte et gérez chaque race sans stress.",
    subtitle: "Toiletteurs et éducateurs canins : ne perdez plus de temps au téléphone les mains dans le shampoing. Laissez vos clients réserver leur créneau selon la race de leur animal.",
    demoUrl: "/demos/animaux/",
    demoName: "Patte Douce",
    demoTagline: "Démonstration d'un salon de toilettage canin & félin",
    pains: [
      { bad: "Appels téléphoniques pendant que vous tenez un chien sur la table", good: "Réservation autonome en ligne avec sélection de la race, du poil et du gabarit." },
      { bad: "Clients qui réservent un forfait court pour un chien plein de nœuds", good: "Avertissement clair et tarification adaptée selon l'état du pelage." },
      { bad: "Oublis de rendez-vous qui vous laissent 2 heures sans aucun revenu", good: "Rappels automatiques WhatsApp la veille pour sécuriser votre planning." }
    ],
    features: [
      { title: "Sélecteur de formule par taille et race", desc: "Tarification transparente adaptée aux petits, moyens et grands chiens ou chats." },
      { title: "Agenda de réservation direct", desc: "Vos clients visualisent les créneaux libres sans monopoliser votre temps de travail." },
      { title: "Conseils et relances régulières d'entretien", desc: "Rappels programmés tous les 2 à 3 mois pour fidéliser votre clientèle sur l'année." }
    ]
  },
  architecture: {
    kicker: "Solution Digitale Métier · Bureaux d’Architecture & Design",
    h1: "Valorisez vos réalisations d'exception et attirez des maîtres d'ouvrage à fort budget.",
    subtitle: "Architectes et concepteurs d'intérieur : remplacez les portfolios PDF indigestes par une vitrine éditoriale minimaliste qui fait signer les projets résidentiels et tertiaires d'envergure.",
    demoUrl: "/demos/architecture/",
    demoName: "Ligne Claire",
    demoTagline: "Démonstration d'un bureau d'architecture contemporaine",
    pains: [
      { bad: "Demandes non qualifiées pour des budgets irréalistes", good: "Brief de projet progressif avec terrain, surface et enveloppe financière requise." },
      { bad: "Portfolio mal mis en valeur sur smartphone", good: "Présentation éditoriale grand angle, plans architecturaux nets et textures fluides." },
      { bad: "Processus d'étude mal compris par les clients particuliers", good: "Étapes claires de la phase esquisse au permis d'urbanisme." }
    ],
    features: [
      { title: "Galerie de réalisations filtrable par typologie", desc: "Mise en avant des extensions, rénovations écologiques et villas contemporaines." },
      { title: "Formulaire de cadrage terrain & budget", desc: "Sélection des projets en phase avec votre positionnement dès le premier échange." },
      { title: "Présentation de la méthode de travail", desc: "Transparence sur les honoraires, les phases d'études et le suivi de chantier." }
    ]
  },
  decoration: {
    kicker: "Solution Digitale Métier · Boutiques Déco & Artisans d’Art",
    h1: "Transformez les curieux en acheteurs avec retrait boutique et e-commerce sans friction.",
    subtitle: "Commerces de décoration et créateurs en Wallonie : donnez une seconde vie à votre boutique physique grâce à une vitrine digitale avec Click & Collect et paiement sécurisé.",
    demoUrl: "/demos/decoration/",
    demoName: "Matière Commune",
    demoTagline: "Démonstration d'une boutique de décoration et d'artisanat",
    pains: [
      { bad: "Clients qui hésitent en magasin et finissent par acheter en ligne ailleurs", good: "Click & Collect en 2h et paiement Bancontact/Payconiq sécurisé en 1 clic." },
      { bad: "Gestion de stock infernale entre la boutique et un site web complexe", good: "Catalogue épuré centré sur vos pièces phares et arrivages du moment." },
      { bad: "Manque de visibilité sur les recherches de cadeaux à proximité", good: "Référencement local Charleroi/Hainaut pour être le premier choix des acheteurs du coin." }
    ],
    features: [
      { title: "Catalogue filtrable par matière et pièce", desc: "Mise en scène chaleureuse des créations avec détails sur la provenance et les dimensions." },
      { title: "Module Click & Collect avec retrait magasin", desc: "Augmentez le panier moyen en faisant venir les clients directement dans votre boutique." },
      { title: "Alerte nouveautés et arrivages exclusifs", desc: "Fidélisation de vos meilleurs clients avec accès prioritaire aux séries limitées." }
    ]
  },
  sport: {
    kicker: "Solution Digitale Métier · Studios de Sport, Yoga & Fitness",
    h1: "Remplissez vos cours collectifs et boostez vos abonnements sans gestion manuelle.",
    subtitle: "Gérants de studios et coachs sportifs : éliminez les messages WhatsApp pour réserver un tapis et les relances de cotisations. Automatisez vos inscriptions et remplissez chaque séance.",
    demoUrl: "/demos/sport/",
    demoName: "Cadence Studio",
    demoTagline: "Démonstration d'un studio sportif urbain",
    pains: [
      { bad: "Temps perdu à compter les inscrits sur un groupe WhatsApp", good: "Planning interactif avec nombre de places restantes en temps réel." },
      { bad: "Nouveaux inscrits intimidés qui ne savent pas par où démarrer", good: "Séance d'essai découverte réservable en 30 secondes." },
      { bad: "Annulations de dernière minute qui bloquent les places des autres", good: "Délai de désistement automatique qui libère la place pour la liste d'attente." }
    ],
    features: [
      { title: "Planning des cours avec réservation instantanée", desc: "Visualisation immédiate des créneaux, intensités et coachs disponibles." },
      { title: "Formule séance d'essai découverte", desc: "Parcours sans friction pour attirer de nouveaux pratiquants chaque semaine." },
      { title: "Gestion des crédits de cours et abonnements", desc: "Paiement en ligne sécurisé sans manipulation de liquide à l'accueil." }
    ]
  }
};

for (const study of caseStudies) {
  const meta = DATA_METIERS[study.id] || {
    kicker: `Solution Digitale Métier · ${study.category}`,
    h1: `${study.name} : La solution digitale pensée pour ${study.descriptor}.`,
    subtitle: study.problem,
    demoUrl: `/demos/${study.id}/`,
    demoName: study.name,
    demoTagline: study.descriptor,
    pains: [
      { bad: "Processus manuel lent et dispersé", good: "Système digital automatisé clé en main." },
      { bad: "Manque de visibilité auprès des clients locaux", good: "SEO local ciblé sur votre zone d'activité." },
      { bad: "Perte de contacts et de devis potentiels", good: "Capture et qualification directe des prospects." }
    ],
    features: study.features.map(f => ({ title: f, desc: "Brique prête à déployer pour votre activité." }))
  };

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${meta.h1.replace(/"/g, '')} | Purity Agency</title>
<meta name="description" content="${meta.subtitle.replace(/"/g, '')}">
<link rel="canonical" href="https://purity-agency.be/cas-concrets/${study.id}.html">
<meta property="og:type" content="website">
<meta property="og:title" content="${meta.h1.replace(/"/g, '')} | Purity Agency">
<meta property="og:description" content="${meta.subtitle.replace(/"/g, '')}">
<meta property="og:image" content="https://purity-agency.be/assets/cases/${study.id}-og.svg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/css/app.css?v=16">
<link rel="stylesheet" href="/css/menu.css?v=3">
<link rel="stylesheet" href="/css/cases.css?v=2">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "${meta.h1.replace(/"/g, '')}",
      "description": "${meta.subtitle.replace(/"/g, '')}",
      "url": "https://purity-agency.be/cas-concrets/${study.id}.html",
      "isPartOf": { "@type": "WebSite", "name": "Purity Agency", "url": "https://purity-agency.be/" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://purity-agency.be/" },
        { "@type": "ListItem", "position": 2, "name": "Cas concrets", "item": "https://purity-agency.be/cas-concrets.html" },
        { "@type": "ListItem", "position": 3, "name": "${study.category}", "item": "https://purity-agency.be/cas-concrets/${study.id}.html" }
      ]
    }
  ]
}
</script>
</head>
<body>
<header class="header">
  <a class="header__brand" href="/"><img src="/assets/logo-mark.webp" alt="" aria-hidden="true" width="26" height="26"><span>Purity Agency</span></a>
  <nav class="header__nav" aria-label="Principal">
    <a href="/#services">Services</a>
    <a href="/tarifs.html">Tarifs</a>
    <a aria-current="page" href="/cas-concrets.html">Nos réalisations</a>
    <a href="/contact.html">Contact</a>
  </nav>
  <button class="burger" type="button" command="toggle-popover" commandfor="menu" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu">
    <span class="burger__box" aria-hidden="true"><span class="burger__bar"></span><span class="burger__bar"></span></span>
  </button>
</header>
<div id="menu" popover="auto" class="menu" aria-label="Menu">
  <div class="menu__top">
    <span class="menu__brand"><img src="/assets/logo-mark.webp" alt="" aria-hidden="true" width="24" height="24"><span>Purity Agency</span></span>
    <button class="burger burger--close" type="button" command="hide-popover" commandfor="menu" aria-label="Fermer le menu">
      <span class="burger__box" aria-hidden="true"><span class="burger__bar"></span><span class="burger__bar"></span></span>
    </button>
  </div>
  <nav class="menu__nav">
    <a href="/#services" style="--i:0">Services</a>
    <a href="/tarifs.html" style="--i:1">Tarifs</a>
    <a href="/cas-concrets.html" style="--i:2">Nos réalisations</a>
    <a href="/contact.html" style="--i:3">Contact</a>
  </nav>
</div>

<main class="case-detail">
  <nav class="case-crumb" aria-label="Fil d’Ariane">
    <a href="/cas-concrets.html">Nos réalisations</a>
    <span aria-hidden="true">/</span>
    <span>${study.category}</span>
  </nav>

  <!-- HERO HIGH-CONVERSION GOOGLE ADS -->
  <section class="case-detail__hero" style="--case-ink:${study.palette[0]};--case-paper:${study.palette[1]};--case-accent:${study.palette[2]}">
    <div>
      <div class="lp-badge"><span class="lp-badge__dot"></span> OFFRE SPÉCIALE : -25 % SUR LA CRÉATION SOUS 24H</div>
      <p class="section-kicker">${meta.kicker}</p>
      <h1>${meta.h1}</h1>
      <p>${meta.subtitle}</p>

      <div class="lp-hero__cta">
        <a class="lp-btn-primary" href="#devis-direct">Demander mon devis sous 24h (-25 %) <span aria-hidden="true">→</span></a>
        <a class="lp-btn-demo" href="${meta.demoUrl}">Tester la démo live en direct <span aria-hidden="true">↗</span></a>
      </div>

      <div class="lp-guarantee">
        <span><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg> Prêt en 7 jours chrono</span>
        <span><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg> Zéro commission cachée</span>
        <span><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg> Accompagnement local Wallonie</span>
      </div>
    </div>

    <!-- PREVIEW VISUELLE HAUTE RESOLUTION -->
    <div class="case-preview" style="--case-ink:${study.palette[0]};--case-paper:${study.palette[1]};--case-accent:${study.palette[2]}" aria-hidden="true">
      <picture>
        <source srcset="/assets/cases/visuals/${study.id}.webp" type="image/webp">
        <img src="/assets/cases/visuals/${study.id}.png" width="1536" height="1024" loading="eager" decoding="async" alt="Démonstration ${meta.demoName}">
      </picture>
      <span class="case-preview__wash"></span>
      <span class="case-preview__frame"></span>
      <span class="case-preview__orb"></span>
    </div>
  </section>

  <!-- CONTRASTE AVANT / AVEC PURITY -->
  <section class="lp-contrast">
    <div class="lp-contrast__inner">
      <p class="section-kicker">Pourquoi votre méthode actuelle vous coûte cher</p>
      <h2>Ce qui change pour votre activité dès la mise en ligne.</h2>

      <div class="lp-contrast__grid">
        <div class="lp-contrast__col lp-contrast__col--bad">
          <h3><span class="lp-icon-bad" aria-hidden="true">✕</span> Sans solution adaptée (Votre quotidien actuel)</h3>
          <ul class="lp-contrast__list">
            ${meta.pains.map(p => `<li><span class="lp-icon-bad" aria-hidden="true">✕</span> <span><b>Le problème :</b> ${p.bad}</span></li>`).join('\n            ')}
          </ul>
        </div>
        <div class="lp-contrast__col lp-contrast__col--good">
          <h3><span class="lp-icon-good" aria-hidden="true">✓</span> Avec la solution Purity (Clé en main en 7 jours)</h3>
          <ul class="lp-contrast__list">
            ${meta.pains.map(p => `<li><span class="lp-icon-good" aria-hidden="true">✓</span> <span><b>Le résultat :</b> ${p.good}</span></li>`).join('\n            ')}
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- CE QUI EST INCLUS -->
  <section class="case-detail__capabilities">
    <div style="max-width:var(--case-wrap);margin-inline:auto;padding-inline:clamp(1.25rem,4vw,3rem)">
      <p class="section-kicker">Votre système métier complet</p>
      <h2>Trois briques indispensables déjà prêtes à l'emploi.</h2>
      <div>
        ${meta.features.map((f, i) => `<article>
          <span>0${i+1}</span>
          <h3>${f.title}</h3>
          <p>${f.desc}</p>
        </article>`).join('\n        ')}
      </div>
    </div>
  </section>

  <!-- OFFRE & PRIX TRANSPARENT -->
  <section class="lp-package">
    <div class="lp-package__card">
      <div>
        <span class="lp-package__tag">Pack Métier Clé en Main</span>
        <h2 class="lp-package__title">Votre solution digitale complète pour ${study.category.toLowerCase()}.</h2>
        <p class="lp-package__desc">Une architecture haute performance mobile-first, module métier personnalisé, nom de domaine sécurisé et référencement local Charleroi & Wallonie.</p>
        <ul class="lp-package__features">
          <li><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg> Design sur-mesure haute conversion (Liquid Glass & Dark Theme)</li>
          <li><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg> Module métier spécifique (${meta.features[0].title})</li>
          <li><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg> Optimisation SEO Local Wallonie (Google Maps & recherche locale)</li>
          <li><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg> Intégration WhatsApp direct, contact rapide et conformité RGPD</li>
          <li><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg> Livraison complète garantie en 7 jours ouvrés</li>
        </ul>
      </div>

      <div class="lp-package__pricing-box">
        <span class="lp-package__strike">1 320 € HTVA</span>
        <div class="lp-package__price">
          <span class="lp-package__num">990</span>
          <span class="lp-package__unit">€ HTVA</span>
        </div>
        <span class="lp-package__sub">Avec le coupon -25 % sous 24h</span>
        <a class="lp-package__cta" href="#devis-direct">Réserver ce tarif (-25 %)</a>
        <span class="lp-package__bonus">🎁 BONUS : 1er mois de réseaux sociaux (3 posts/sem.) offert</span>
      </div>
    </div>
  </section>

  <!-- FORMULAIRE DE CONVERSION DIRECT -->
  <section id="devis-direct" class="lp-lead-section">
    <div class="lp-lead-section__inner">
      <div class="lp-badge"><span class="lp-badge__dot"></span> PROPOSITION SOUS 24H OUVRÉES</div>
      <h2>Discutons de votre projet pour ${study.category}.</h2>
      <p>Remplissez ces 3 informations. Amir Kebiyeb analyse votre besoin et vous recontacte avec une maquette indicative sous 24h.</p>

      <form class="lp-form" id="lp-form" action="/api/contact" method="POST">
        <input type="hidden" name="slot" value="Cas Métier: ${study.category} (Offre -25%)">
        <input type="text" name="_hp" style="display:none" tabindex="-1" autocomplete="off">

        <div class="lp-form__row">
          <label>
            Votre nom ou entreprise *
            <input type="text" name="name" required placeholder="Ex. Jean Dupont / Atelier Noma">
          </label>
          <label>
            Votre téléphone (pour un contact direct) *
            <input type="tel" name="phone" required placeholder="Ex. 0470 12 34 56">
          </label>
        </div>

        <div class="lp-form__row">
          <label>
            Votre adresse e-mail *
            <input type="email" name="email" required placeholder="Ex. jean@mon-activite.be">
          </label>
          <label>
            Votre ville / localité en Wallonie
            <input type="text" name="location" placeholder="Ex. Charleroi, Namur, Mons...">
          </label>
        </div>

        <label>
          Votre priorité principale pour ce projet *
          <textarea name="message" required placeholder="Décrivez votre besoin principal (ex: trouver plus de clients, refondre mon ancien site, automatiser mes réservations...)."></textarea>
        </label>

        <button type="submit" class="lp-form__btn">Bloquer mon offre -25 % et recevoir ma proposition</button>
        <div id="lp-status" class="lp-form__status"></div>
        <p class="lp-form__note">🔒 100 % confidentiel · Zéro engagement · Réponse directe sous 24h par Amir Kebiyeb</p>
      </form>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="site-footer__inner">
    <div>
      <a class="site-footer__brand" href="/"><img src="/assets/logo-mark.webp" alt="" width="32" height="32">Purity Agency</a>
      <p>Modernisation, optimisation et solutions digitales pour les indépendants et PME.</p>
    </div>
    <nav aria-label="Navigation de pied de page">
      <h2>Explorer</h2>
      <a href="/#services">Services</a>
      <a href="/tarifs.html">Tarifs</a>
      <a href="/cas-concrets.html">Nos réalisations</a>
      <a href="/blog.html">Blog</a>
      <a href="/contact.html">Contact</a>
    </nav>
    <div>
      <h2>Parlons-en</h2>
      <a href="mailto:contact@purity-agency.be">contact@purity-agency.be</a>
    </div>
  </div>
  <div class="site-footer__legal">
    <span>© 2026 Purity Agency</span>
    <a href="/legal.html">Légal</a>
    <a href="/confidentialite.html">Confidentialité</a>
    <a href="/cookies.html">Cookies</a>
    <a href="/conditions-generales.html">CGV</a>
  </div>
</footer>

<script src="/js/menu.js?v=2" defer></script>
<script>
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('lp-form');
  var status = document.getElementById('lp-status');
  if (!form || !status) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Envoi en cours...';

    var formData = new FormData(form);
    var payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      slot: formData.get('slot'),
      message: 'Ville: ' + (formData.get('location') || 'Non précisée') + ' | ' + formData.get('message'),
      _hp: formData.get('_hp')
    };

    try {
      var res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      var data = await res.json();
      if (res.ok && data.ok) {
        status.className = 'lp-form__status is-success';
        status.textContent = '✓ Demande bien reçue ! Amir Kebiyeb vous recontacte sous 24h avec votre proposition personnalisée.';
        form.reset();
        btn.textContent = 'Demande envoyée !';
      } else {
        throw new Error(data.error || 'Erreur lors de l’envoi');
      }
    } catch (err) {
      status.className = 'lp-form__status is-error';
      status.textContent = 'Une erreur est survenue. Contactez-nous directement à contact@purity-agency.be';
      btn.disabled = false;
      btn.textContent = 'Réessayer';
    }
  });
});
</script>
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, `${study.id}.html`), html, 'utf8');
  console.log(`✓ Generated High-Conversion Landing Page for: ${study.id}`);
}
