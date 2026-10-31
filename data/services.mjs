// Catalogue officiel des 14 prestations Purity Agency
// Rédigé strictement du point de vue du client cible : l'artisan indépendant et le gérant de PME en Belgique (Wallonie).
// Zéro jargon d'agence web, zéro terme technique prétentieux, 100 % concret, rentable et orienté résultats métier.
// Mentions légales réelles : BCE 1036.775.590 · Régime particulier art. 56bis CTVA · Conformité Peppol 2026.

export const services = [
  {
    id: 'M01',
    slug: 'diagnostic-digital',
    name: 'Diagnostic digital (15 min)',
    pillar: 'Pilier 04 · Diagnostic & Cadrage',
    kicker: '15 min par téléphone ou visio · 100 % gratuit · Sans engagement',
    headline: 'Découvrez en 15 minutes ce qui freine vos demandes de devis et ce qu’il faut corriger en priorité.',
    summary: 'Avant de dépenser le moindre euro dans un site web, des réseaux sociaux ou de la publicité, Amir Kebiyeb examine votre situation avec vous et vous indique l’action concrète la plus rentable pour décrocher plus de chantiers.',
    price: 'Offert',
    priceSetup: '0 €',
    promoSetup: 'Offert',
    promoTag: 'Gratuit · sans engagement',
    monthlyPrice: null,
    monthlyNote: 'Aucun abonnement, aucun moyen de paiement requis.',
    delay: 'Créneau immédiat (15 min chrono)',
    targetAudience: 'Indépendants, artisans du bâtiment, dépanneurs et gérants de PME en Wallonie (Charleroi, Namur, Mons, Liège, Nivelles) qui veulent savoir pourquoi leur présence en ligne ne leur rapporte pas assez d’appels.',
    utility: 'Éviter de jeter votre argent par les fenêtres dans des outils ou des publicités inutiles. Vous repartez avec un avis d’expert direct, honnête et chiffré sur votre situation locale.',
    searchIntentKeywords: [
      'audit site internet gratuit charleroi',
      'diagnostic digital pme wallonie',
      'conseil agence web indépendant belgique',
      'pourquoi mon site ne convertit pas'
    ],
    relatedCases: [
      { id: 'renovation', name: 'Atelier Noma', sector: 'Rénovation & Bâtiment' },
      { id: 'chauffage', name: 'Thermiq', sector: 'Chauffage & Énergie' }
    ],
    comparison: [
      { aspect: 'Approche commerciale', others: 'Tentative de vous forcer la main pour signer un pack à 5 000 € dès la 5ème minute', purity: '100 % conseil transparent : si votre site actuel suffit ou si vous n’avez besoin de rien, on vous le dit' },
      { aspect: 'Interlocuteur', others: 'Commercial junior qui n’y connaît rien à votre métier et lit un argumentaire', purity: 'Échange direct avec Amir Kebiyeb, fondateur de l’agence' },
      { aspect: 'Ce que vous recevez', others: 'Un devis générique automatique envoyé sans explication', purity: 'Un récapitulatif clair sous 1h avec l’action prioritaire à mener' }
    ],
    deliverables: [
      {
        title: 'Vérification en direct de votre visibilité sur votre commune',
        desc: 'On regarde ensemble comment votre entreprise apparaît sur Google et Google Maps par rapport à vos 3 principaux concurrents locaux (Charleroi, Namur, Mons, etc.).'
      },
      {
        title: 'Test de vitesse et d’affichage sur smartphone (4G)',
        desc: 'Vérification du temps de chargement sur téléphone : si votre site met plus de 2,5 secondes à s’ouvrir, vos clients s’impatientent et appellent un autre artisan.'
      },
      {
        title: 'Contrôle de vos boîtes e-mails (Anti-Spam devis)',
        desc: 'Vérification que vos devis envoyés aux clients n’atterrissent pas directement dans leur dossier de courriers indésirables (spams).'
      },
      {
        title: 'Feuille de route écrite envoyée sous 1 heure',
        desc: 'Un e-mail de synthèse simple et sans jargon récapitulant les points faibles constatés, la solution la plus rentable et le budget exact à prévoir.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Budget publicitaire jeté par les fenêtres',
        desc: 'Payer des annonces Google ou Facebook qui envoient des clients vers un site lent ou mal fait : jusqu’à 500 € par mois gaspillés pour aucun appel entrant.'
      },
      {
        title: 'Des chantiers rentables qui partent chez vos concurrents',
        desc: 'Pendant que vous hésitez, les confrères de votre région modernisent leur présence et signent les plus gros chantiers.'
      },
      {
        title: 'Des devis qui dorment dans les spams de vos clients',
        desc: 'Croire qu’un client ne donne pas suite à votre devis alors qu’il ne l’a tout simplement jamais reçu dans sa boîte de réception.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Choix de votre créneau', desc: 'Vous sélectionnez l’heure qui vous convient le mieux dans l’agenda en ligne, selon vos disponibilités entre deux chantiers.' },
      { step: '02', title: 'Préparation du dossier', desc: 'Amir regarde votre site et vos concurrents locaux avant l’appel pour ne pas vous faire perdre une minute.' },
      { step: '03', title: 'Échange de 15 minutes chrono', desc: 'Par téléphone ou en visio sur votre écran, droit au but, centré uniquement sur la rentabilité de votre entreprise.' },
      { step: '04', title: 'Récapitulatif écrit', desc: 'Vous recevez la synthèse de ce qu’il faut corriger, libre à vous de le faire seul ou avec notre accompagnement.' }
    ],
    includedMaintenance: 'Non applicable (rendez-vous de diagnostic 100 % offert).',
    faq: [
      {
        q: 'Est-ce vraiment 100 % gratuit sans aucun engagement ?',
        a: 'Oui, totalement. Aucun numéro de carte bancaire n’est demandé. Le but est de vérifier si nous pouvons réellement vous faire gagner du temps et des chantiers avant de vous proposer quoi que ce soit.'
      },
      {
        q: 'De quoi ai-je besoin pour le rendez-vous ?',
        a: 'De rien de particulier : juste de votre adresse de site web (ou page Facebook si vous n’avez pas de site) et de nous expliquer le type de chantiers que vous aimeriez décrocher davantage.'
      },
      {
        q: 'Que se passe-t-il après le diagnostic ?',
        a: 'Vous repartez avec les idées claires. Si une solution Purity est pertinente pour votre activité, on vous envoie une offre détaillée. Si ce que vous avez déjà fonctionne très bien, on vous conseille de ne rien changer.'
      },
      {
        q: 'Comment se passe l’échange ?',
        a: 'Soit par un simple coup de téléphone, soit par un lien Google Meet en un clic sur votre smartphone ou PC, sans rien devoir installer.'
      }
    ]
  },
  {
    id: 'M03',
    slug: 'page-essentielle',
    name: 'Page Essentielle (1 page)',
    pillar: 'Pilier 01 · Sites Web & Référencement',
    kicker: 'Lancement rapide · Artisans solos & Indépendants · Appels directs',
    headline: 'Une page professionnelle ultra-rapide qui présente votre métier et fait sonner votre téléphone.',
    summary: 'La formule idéale pour les artisans et indépendants (électriciens, plombiers, dépanneurs, coaches) qui veulent remplacer une simple page Facebook ou un vieux site par une vitrine nette, crédible et contactable en 1 clic.',
    price: '490 € + 79 €/mois',
    priceSetup: '490 €',
    promoSetup: '367 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '79 €/mois',
    monthlyNote: 'Hébergement haute vitesse, nom de domaine .be, boîte e-mail pro et modifications de vos coordonnées incluses.',
    delay: '5 à 7 jours ouvrés',
    targetAudience: 'Artisans solos, dépanneurs, réparateurs, indépendants en bâtiment et prestataires de services en Wallonie qui exercent une activité ciblée.',
    utility: 'Rassurer immédiatement un client local qui cherche votre métier sur son smartphone et lui permettre de vous appeler ou de vous écrire sur WhatsApp sans chercher votre numéro.',
    searchIntentKeywords: [
      'création site one page artisan belgique',
      'prix site internet indépendant charleroi',
      'création landing page conversion wallonie',
      'site web rapide artisan bâtiment'
    ],
    relatedCases: [
      { id: 'chauffage', name: 'Thermiq', sector: 'Chauffage & Énergie' },
      { id: 'animaux', name: 'Patte Douce', sector: 'Toilettage Animalier' }
    ],
    comparison: [
      { aspect: 'Vitesse sur smartphone', others: '3 à 6 secondes d’attente sur mobile (le client s’impatiente et appelle un autre artisan)', purity: 'Affichage instantané en moins d’une seconde : le client vous contacte tout de suite' },
      { aspect: 'Prise de contact mobile', others: 'Numéro minuscule caché dans un coin, impossible à cliquer avec les doigts', purity: 'Bouton d’appel et WhatsApp bien visible au pouce en 1 clic' },
      { aspect: 'Mises à jour & Suivi', others: 'Facturées 80 € pour changer un tarif ou un numéro de téléphone', purity: 'Incluses dans votre forfait mensuel sans surcoût sur simple message' }
    ],
    deliverables: [
      {
        title: 'Présentation sur-mesure de votre métier (Zéro modèle générique)',
        desc: 'Mise en valeur de vos vrais chantiers, de vos compétences clés et de vos tarifs indicatifs : une présentation nette qui donne immédiatement confiance à vos clients locaux et justifie vos devis.'
      },
      {
        title: 'Affichage instantané sur smartphone en moins d’une seconde',
        desc: 'Le site s’ouvre immédiatement sur le téléphone de vos clients sans lenteur ni temps de chargement, ce qui évite qu’ils repartent voir un confrère.'
      },
      {
        title: 'Bouton d’appel direct & WhatsApp au pouce',
        desc: 'Un bouton toujours accessible en bas de l’écran sur mobile : le client appuie avec son pouce et votre téléphone sonne directement sans qu’il doive recopier votre numéro.'
      },
      {
        title: 'Votre nom de domaine officiel .be & Boîte e-mail pro',
        desc: 'Votre adresse internet officielle (ex: www.votre-nom.be) et une adresse e-mail professionnelle (contact@votre-nom.be) synchronisée sur votre smartphone.'
      },
      {
        title: 'Conformité légale belge complète (BCE, TVA, RGPD)',
        desc: 'Mentions légales obligatoires en Belgique (numéro BCE, régime de franchise TVA art. 56bis ou numéro de TVA) pour être 100 % en règle avec l’administration.'
      },
      {
        title: 'Vous êtes propriétaire à 100 % de votre site',
        desc: 'Zéro location forcée, zéro abonnement logiciel captif : votre nom de domaine et tous vos fichiers vous appartiennent définitivement.'
      }
    ],
    lossOfInaction: [
      {
        title: '70 % des clients sur smartphone perdus si le site est lent',
        desc: 'Sur téléphone, un particulier sur deux quitte une page si elle met plus de 3 secondes à s’ouvrir : vous perdez des appels sans même le savoir.'
      },
      {
        title: 'Une image d’amateur qui pousse les clients à négocier vos prix',
        desc: 'Donner une adresse Gmail gratuite ou une simple page Facebook renvoie une image de bricoleur et incite les clients à marchander vos devis à la baisse.'
      },
      {
        title: 'Zéro appel quand vous êtes occupé sur un chantier',
        desc: 'Quand vous avez les mains prises, un client qui cherche un artisan disponible appelle le premier qui affiche un bouton d’appel direct sur Google.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Échange de 20 min sur votre activité', desc: 'On note vos spécialités, vos communes d’intervention en Wallonie et vos photos de chantiers.' },
      { step: '02', title: 'Rédaction et mise en page complètes', desc: 'Nous écrivons tous les textes commerciaux et créons la mise en page sans que vous n’ayez rien à rédiger.' },
      { step: '03', title: 'Test direct sur votre téléphone', desc: 'Vous recevez un lien privé sur votre smartphone pour tester la rapidité et vérifier que tout vous convient.' },
      { step: '04', title: 'Mise en ligne & Indexation Google', desc: 'On branche votre nom de domaine .be et on signale immédiatement votre nouveau site à Google.' }
    ],
    includedMaintenance: 'Hébergement haute performance, renouvellement annuel de votre nom de domaine .be, surveillance anti-panne et prise en charge rapide de vos changements de tarifs, horaires ou photos.',
    faq: [
      {
        q: 'Puis-je agrandir mon site plus tard avec plus de pages ?',
        a: 'Oui, tout à fait. La structure est pensée pour évoluer : nous pourrons ajouter des pages de services ou une galerie de réalisations quand votre activité grandira sans devoir tout refaire.'
      },
      {
        q: 'Dois-je rédiger les textes moi-même ?',
        a: 'Non, pas du tout. Nous rédigeons l’ensemble des textes à partir des quelques questions posées lors de notre premier appel de cadrage.'
      },
      {
        q: 'Le site fonctionne-t-il sur tous les téléphones ?',
        a: 'Oui, le site est rigoureusement testé sur iPhone et Android, pour que chaque bouton soit parfaitement cliquable avec le pouce.'
      },
      {
        q: 'Combien de temps suis-je engagé pour le suivi ?',
        a: 'L’engagement initial est de 12 mois pour amortir les frais techniques de mise en place, puis renouvelable au mois le mois sans frais de résiliation.'
      }
    ]
  },
  {
    id: 'M04',
    slug: 'site-vitrine',
    name: 'Site Vitrine (5 pages)',
    pillar: 'Pilier 01 · Sites Web & Référencement',
    kicker: 'Le standard professionnel · Artisans confirmés & PME locales',
    headline: 'Le site vitrine complet pour asseoir votre réputation locale et signer des chantiers rentables.',
    summary: 'La formule la plus demandée : 5 pages complètes et structurées (Accueil rassurant, Prestations détaillées, Galerie de réalisations avec comparateur avant/après, Présentation de l’entreprise, Contact et demande de devis) conçues pour faire de vous le premier choix dans votre région.',
    price: '1 490 € + 79 €/mois',
    priceSetup: '1 490 €',
    promoSetup: '1 117 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '79 €/mois',
    monthlyNote: 'Hébergement infogéré, domaine .be, boîtes e-mails pro, sauvegardes et modifications courantes incluses.',
    delay: '7 à 10 jours ouvrés',
    targetAudience: 'Chauffagistes, entreprises de rénovation, carrosseries, garagistes, électriciens, plombiers, toitures et PME régionales en Wallonie.',
    utility: 'Devenir le professionnel de référence dans votre commune et filtrer les demandes pour ne vous déplacer que sur des chantiers rentables avec des clients sérieux.',
    searchIntentKeywords: [
      'création site vitrine pme charleroi',
      'tarif création site web artisan wallonie',
      'agence web namur site vitrine professionnel',
      'devis site internet entreprise bâtiment belgique'
    ],
    relatedCases: [
      { id: 'renovation', name: 'Atelier Noma', sector: 'Rénovation Intérieure' },
      { id: 'garage', name: 'Garage Rive', sector: 'Garage & Carrosserie' }
    ],
    comparison: [
      { aspect: 'Filtrage des curieux', others: 'Formulaire basique : vous perdez votre temps sur des devis sans budget', purity: 'Formulaire de devis avec critères et photos smartphone pour chiffrer avant déplacement' },
      { aspect: 'Preuve de savoir-faire', others: 'Quelques photos mal cadrées que personne ne regarde', purity: 'Curseur interactif tactile Avant / Après qui met en valeur la qualité de votre travail' },
      { aspect: 'Présence locale', others: 'Site invisible dès qu’on dépasse le bout de votre rue', purity: 'Référencement calé sur votre zone réelle pour capter les chantiers de vos communes cibles' }
    ],
    deliverables: [
      {
        title: '5 pages complètes pour rassurer et convaincre vos clients',
        desc: 'Accueil rassurant, fiches détaillées pour chaque prestation, galerie de réalisations concrètes, présentation de votre entreprise et formulaire de contact guidé.'
      },
      {
        title: 'Formulaire de devis avec photos smartphone (Chiffrage avant déplacement)',
        desc: 'Vos clients peuvent joindre directement des photos de leur problème depuis leur smartphone (ex: photos chaudière et m² pour un chauffagiste, 4 photos dégâts pour un carrossier, photos toiture) : vous estimez le projet avant de prendre la route.'
      },
      {
        title: 'Filtre kilométrique de zone d’intervention (ex: 25 km)',
        desc: 'Définition claire de votre secteur pour éliminer les demandes trop lointaines et ne plus perdre 2h par jour dans les bouchons pour des petites interventions non rentables.'
      },
      {
        title: 'Curseur interactif tactile Avant / Après',
        desc: 'Un outil visuel sur lequel le client fait glisser son doigt pour voir la transformation avant et après vos travaux (idéal pour la rénovation, carrosserie, toiture).'
      },
      {
        title: 'Référencement local certifié pour Google (Wallonie)',
        desc: 'Configuration de vos communes d’intervention et de vos spécialités selon les critères officiels de Google pour ressortir en tête des recherches locales.'
      },
      {
        title: 'Chargement ultra-rapide & Propriété totale du site',
        desc: 'Ouverture instantanée sur smartphone (Quality Score maximal pour la publicité Google) et remise complète des accès : vous êtes propriétaire de votre site à vie.'
      }
    ],
    lossOfInaction: [
      {
        title: '15 à 30 gros chantiers perdus chaque année',
        desc: 'Quand un propriétaire compare 3 devis pour une pompe à chaleur ou une toiture à 18 500 €, il choisit l’artisan dont le site donne immédiatement confiance avec des preuves de chantiers récents.'
      },
      {
        title: '2 heures perdues par jour sur des devis pour des curieux',
        desc: 'Passer ses soirées à faire des chiffrages à l’aveugle pour des personnes qui n’ont pas le budget, faute d’avoir un formulaire qui qualifie le projet au préalable.'
      },
      {
        title: 'Dépendance dangereuse au seul bouche-à-oreille',
        desc: 'Le bouche-à-oreille est précieux mais imprévisible : un site vitrine solide vous assure un flux régulier de nouveaux contacts toute l’année.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Entretien de cadrage (30 min)', desc: 'On liste vos prestations les plus rentables, vos tarifs indicatifs et les communes où vous voulez travailler en priorité.' },
      { step: '02', title: 'Création et rédaction de vos 5 pages', desc: 'Nous rédigeons les textes, mettons en forme vos photos de chantiers et créons un parcours de contact sans friction.' },
      { step: '03', title: 'Validation ensemble sur smartphone', desc: 'Vous testez la version interactive sur votre téléphone et nous ajustons chaque détail selon vos préférences.' },
      { step: '04', title: 'Mise en ligne & Remise des clés', desc: 'Activation de votre nom de domaine .be, signalement à Google et envoi de vos accès.' }
    ],
    includedMaintenance: 'Hébergement infogéré haute vitesse, sauvegardes quotidiennes automatiques, surveillance anti-panne et ajout de vos nouveaux chantiers ou avis clients sur simple message WhatsApp.',
    faq: [
      {
        q: 'Suis-je propriétaire de mon site et de mon nom de domaine ?',
        a: 'Oui, à 100 %. Tous les fichiers, les textes, les photos et le nom de domaine sont votre entière propriété. Vous n’êtes jamais enfermé chez nous.'
      },
      {
        q: 'Combien de temps le projet va-t-il me prendre ?',
        a: 'Environ 45 minutes en tout : 30 minutes au début pour nous expliquer votre activité, et 15 minutes à la fin pour valider le résultat. Nous nous occupons de toute la rédaction et de la technique.'
      },
      {
        q: 'Puis-je modifier mes tarifs ou mes photos moi-même ?',
        a: 'Oui, vous avez un accès simple si vous le souhaitez. Mais le plus pratique reste de nous envoyer un message : nous faisons vos mises à jour sans surcoût dans le cadre de votre suivi.'
      },
      {
        q: 'Ce site est-il adapté si je veux lancer de la pub Google Ads ?',
        a: 'Parfaitement. Sa rapidité d’ouverture et son formulaire bien placé permettent d’obtenir la meilleure note de qualité sur Google Ads, ce qui réduit le coût de chaque clic.'
      }
    ]
  },
  {
    id: 'M05',
    slug: 'site-complet',
    name: 'Site Complet (10+ pages)',
    pillar: 'Pilier 01 · Sites Web & Référencement',
    kicker: 'Grandes PME · Multi-équipes & Multi-villes en Wallonie',
    headline: 'La plateforme complète pour les PME multi-métiers qui veulent dominer leur région sur Google.',
    summary: 'Plus de 10 pages complètes pour couvrir chacun de vos métiers et chacune de vos villes d’intervention en Wallonie (Charleroi, Namur, Mons, Liège, Nivelles, Brabant Wallon), avec des formulaires spécifiques par équipe et un espace de recrutement.',
    price: '2 490 € + 149 €/mois',
    priceSetup: '2 490 €',
    promoSetup: '1 867 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '149 €/mois',
    monthlyNote: 'Maintenance avancée, sauvegardes bi-quotidiennes, interventions prioritaires et 2h de modifications incluses chaque mois.',
    delay: '12 à 18 jours ouvrés',
    targetAudience: 'Entreprises générales de bâtiment, bureaux d’études, promoteurs, concessions, installateurs avec plusieurs équipes sur la route.',
    utility: 'Capter les plus gros contrats de votre région en ayant une page dédiée pour chaque spécialité et chaque grande commune, tout en facilitant le recrutement d’ouvriers qualifiés.',
    searchIntentKeywords: [
      'création site web entreprise générale wallonie',
      'site internet multi services charleroi pme',
      'référencement naturel multi villes belgique',
      'plateforme digitale b2b wallonie'
    ],
    relatedCases: [
      { id: 'architecture', name: 'Ligne Claire', sector: 'Bureau d’Architecture' },
      { id: 'immobilier', name: 'Beaux Jours', sector: 'Agence Immobilière' }
    ],
    comparison: [
      { aspect: 'Couverture géographique', others: 'Une seule page générale qui n’apparaît que dans sa propre commune', purity: 'Pages dédiées par ville et arrondissement pour capter les chantiers de toute la région' },
      { aspect: 'Tri des demandes', others: 'Tous les messages mélangés dans une boîte mail unique', purity: 'Formulaires intelligents qui envoient directement le devis au bon responsable d’équipe' },
      { aspect: 'Assistance technique', others: 'Délai d’attente de 5 à 10 jours pour la moindre modification', purity: 'Ligne directe prioritaire avec prise en charge sous 24h ouvrées' }
    ],
    deliverables: [
      {
        title: 'Arborescence complète de 10 à 15 pages sur mesure',
        desc: 'Une page détaillée pour chaque corps de métier, des pages géographiques par grande commune de Wallonie, des études de chantiers détaillées et un espace carrières.'
      },
      {
        title: 'Pages dédiées par ville et spécialité pour dominer votre région',
        desc: 'Chaque ville ciblée (Charleroi, Namur, Mons, Liège, Nivelles, etc.) dispose de sa propre page optimisée pour que Google vous affiche en tête sur les chantiers à fort panier.'
      },
      {
        title: 'Formulaires de devis avec envoi direct au bon conducteur de travaux',
        desc: 'Le formulaire adapte ses questions selon le métier choisi (ex: toiture, chauffage, maçonnerie) et transmet le dossier pré-rempli directement au chef d’équipe concerné.'
      },
      {
        title: 'Espace Recrutement pour attirer des ouvriers qualifiés (CP 124)',
        desc: 'Une page soignée pour attirer des techniciens et chefs d’équipe sérieux, qui refusent de postuler dans des entreprises à l’image vieillissante.'
      },
      {
        title: 'Statistiques de visites simples et privées (100 % conforme RGPD)',
        desc: 'Un tableau de bord clair pour voir combien de personnes consultent vos pages et d’où viennent vos demandes, sans bandeau de cookies pénible pour vos visiteurs.'
      },
      {
        title: 'Support technique prioritaire garanti sous 24h ouvrées',
        desc: 'Canal direct réservé avec notre équipe technique pour toute mise à jour urgente de vos chantiers ou plannings.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Les chantiers majeurs abandonnés aux concurrents mieux organisés',
        desc: 'Un site basique de 3 pages ne fait pas le poids face à des concurrents qui disposent d’une page soignée pour chaque commune de Wallonie.'
      },
      {
        title: 'Des devis à 5 et 6 chiffres perdus par manque de standing',
        desc: 'Les architectes, syndics et promoteurs exigent une vitrine d’entreprise irréprochable avant de confier des chantiers d’envergure.'
      },
      {
        title: 'Difficulté à recruter du personnel qualifié',
        desc: 'Dans un secteur où la main-d’œuvre compétente est rare, les meilleurs artisans choisissent les entreprises dont la présentation reflète le sérieux et la solidité.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Plan d’arborescence par ville et métier', desc: 'On valide ensemble les communes clés et les spécialités que vous voulez développer en priorité.' },
      { step: '02', title: 'Rédaction de toutes vos pages', desc: 'Notre équipe rédige chaque fiche métier avec vos photos de réalisations et vos conditions d’intervention.' },
      { step: '03', title: 'Validation et réglage des formulaires', desc: 'Test complet de l’envoi des demandes vers vos différents responsables d’équipes.' },
      { step: '04', title: 'Mise en ligne et indexation Google', desc: 'Déploiement complet et enregistrement de toutes vos nouvelles pages auprès de Google.' }
    ],
    includedMaintenance: 'Supervision continue 24/7, sauvegardes automatiques de sécurité, support prioritaire sous 24h et 2 heures de modifications incluses chaque mois pour vos contenus.',
    faq: [
      {
        q: 'Combien de pages exactes sont incluses ?',
        a: 'Jusqu’à 15 pages complètes rédigées et intégrées sont incluses dans le forfait de base. Vous pouvez en ajouter d’autres au fil du développement de votre entreprise.'
      },
      {
        q: 'Peut-on mettre des catalogues ou des plans PDF en téléchargement ?',
        a: 'Oui, nous pouvons intégrer des visionneuses de plans ou des brochures techniques téléchargeables pour vos clients professionnels.'
      },
      {
        q: 'Comment s’organise l’envoi des devis ?',
        a: 'Chaque formulaire peut être envoyé vers une adresse e-mail différente selon le métier choisi (ex: devis toiture vers le chef d’équipe toiture).'
      },
      {
        q: 'Cet investissement est-il déductible pour mon entreprise ?',
        a: 'Oui, à 100 %. La création de votre site web et son suivi mensuel sont des charges d’exploitation entièrement déductibles pour votre société ou entreprise individuelle en Belgique.'
      }
    ]
  },
  {
    id: 'M06',
    slug: 'boutique-en-ligne',
    name: 'Boutique en ligne (E-commerce)',
    pillar: 'Pilier 01 · Sites Web & Référencement',
    kicker: 'Vente directe 24/7 · Bancontact & Payconiq · 0 % de commission',
    headline: 'Votre boutique en ligne pour vendre vos produits et services en Belgique sans commissions abusives.',
    summary: 'Une boutique rapide et sécurisée, connectée aux moyens de paiement préférés des Belges (Bancontact, Payconiq, Apple Pay, cartes bancaires), adaptée aussi bien aux commerçants qu’aux restaurateurs (commandes à emporter et réservations anti-no-show).',
    price: '3 990 € + 149 €/mois',
    priceSetup: '3 990 €',
    promoSetup: '2 992 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '149 €/mois',
    monthlyNote: 'Sécurité bancaire continue, surveillance des paiements, maintenance des passerelles et assistance technique.',
    delay: '15 à 25 jours ouvrés',
    targetAudience: 'Commerçants, artisans créateurs, producteurs locaux, restaurateurs (Horeca) et distributeurs en Belgique souhaitant vendre en direct.',
    utility: 'Encaisser des commandes 24h/24 et 7j/7 sans reverser 30 % de vos marges à des plateformes tierces, avec une expérience d’achat sur smartphone simple et rassurante.',
    searchIntentKeywords: [
      'création boutique en ligne belgique bancontact',
      'site e-commerce artisan charleroi',
      'tarif boutique e commerce pme wallonie',
      'création site vente en ligne sans commissions'
    ],
    relatedCases: [
      { id: 'decoration', name: 'Matière Commune', sector: 'Commerce & Décoration' }
    ],
    comparison: [
      { aspect: 'Commissions sur vos ventes', others: '15 % à 30 % prélevés par les plateformes (Takeaway, Deliveroo, Amazon)', purity: '0 % de commission Purity : vous conservez 100 % de votre marge' },
      { aspect: 'Paiements belges', others: 'Uniquement carte de crédit (abandon massif par les clients belges)', purity: 'Bancontact, Payconiq, Apple Pay et cartes bancaires intégrés nativement' },
      { aspect: 'Facilité de commande', others: '5 étapes compliquées avec création de compte obligatoire', purity: 'Paiement express en 1 écran sans compte obligatoire' }
    ],
    deliverables: [
      {
        title: 'Catalogue jusqu’à 100 produits ou formules',
        desc: 'Fiches produits claires avec variantes (tailles, finitions, options), photos zoomables, gestion de stock en temps réel et suggestions de ventes complémentaires.'
      },
      {
        title: 'Paiements belges sécurisés (Bancontact & Payconiq en direct)',
        desc: 'Encaissement direct via Bancontact, Payconiq by Bancontact, Apple Pay et cartes bancaires avec virement automatique sur votre compte professionnel belge.'
      },
      {
        title: 'Paiement rapide en un seul écran (Anti-abandon de panier)',
        desc: 'Validation de commande ultra-rapide sur mobile sans formulaire à rallonge, ce qui évite que vos clients renoncent au moment de payer.'
      },
      {
        title: 'Livraisons Bpost, Mondial Relay & Retrait gratuit en atelier (Click & Collect)',
        desc: 'Calcul automatique des frais de livraison pour la Belgique et les pays voisins, choix du point relais sur carte et option de retrait gratuit sur place.'
      },
      {
        title: 'Commande directe à 0 % de commission & Empreinte anti-no-show',
        desc: 'Pour l’Horeca et les traiteurs : commande directe à emporter sans payer de commission aux plateformes, et prise d’empreinte bancaire pour bloquer les no-shows lors des réservations de tables.'
      },
      {
        title: 'Factures automatiques conformes TVA belge (6 % et 21 %) & Peppol 2026',
        desc: 'Génération instantanée de factures PDF légales avec distinction stricte des taux de TVA belges et formats prêts pour votre comptable.'
      }
    ],
    lossOfInaction: [
      {
        title: '30 % de vos marges abandonnées aux plateformes de livraison',
        desc: 'Laisser 1 500 € à 3 000 € chaque mois à des intermédiaires au lieu de fidéliser votre propre clientèle sur votre site.'
      },
      {
        title: 'Des commandes perdues en dehors de vos heures d’ouverture',
        desc: '42 % des achats et réservations en ligne en Belgique se font entre 20h et minuit : sans boutique web, vos clients fidèles finissent par commander ailleurs.'
      },
      {
        title: 'Des tables réservées qui restent vides sans dédommagement',
        desc: 'Subir 3 à 5 tables réservées non honorées le vendredi soir sans aucune compensation financière.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Organisation de vos produits et tarifs', desc: 'On configure vos catégories, vos moyens de paiement et vos modes de livraison.' },
      { step: '02', title: 'Mise en valeur visuelle de vos articles', desc: 'Intégration de vos photos, rédaction des descriptions et tests d’affichage sur smartphone.' },
      { step: '03', title: 'Test de paiement réel à 1 €', desc: 'On effectue une vraie commande de test avec Bancontact pour s’assurer que l’argent arrive bien sur votre compte et que vous recevez l’alerte.' },
      { step: '04', title: 'Formation courte de 20 min', desc: 'On vous montre comment gérer vos commandes et modifier un prix en 10 secondes depuis votre téléphone.' }
    ],
    includedMaintenance: 'Sécurisation permanente des passerelles bancaires, sauvegardes quotidiennes de vos commandes et clients, et assistance technique réactive.',
    faq: [
      {
        q: 'Prenez-vous une commission sur mes ventes ?',
        a: 'Non, 0 % de commission. Vous ne payez que les frais bancaires classiques de la passerelle (ex: environ 0,25 € par paiement Bancontact).'
      },
      {
        q: 'Est-il facile de modifier un prix ou un stock ?',
        a: 'Très facile : depuis votre smartphone ou votre ordinateur, vous changez une quantité ou désactivez un article en quelques secondes.'
      },
      {
        q: 'Le système gère-t-il la TVA belge à 6 % et 21 % ?',
        a: 'Oui, les taux de TVA sont configurés précisément par produit (ex: alimentation à 6 %, matériel à 21 %) pour une comptabilité sans erreur.'
      },
      {
        q: 'Puis-je proposer le retrait gratuit dans mon magasin ?',
        a: 'Oui, vos clients peuvent choisir entre la livraison à domicile, le point relais ou le retrait gratuit dans votre atelier.'
      }
    ]
  },
  {
    id: 'M07',
    slug: 'refonte-modernisation',
    name: 'Refonte & modernisation de site web',
    pillar: 'Pilier 01 · Sites Web & Référencement',
    kicker: 'Zéro perte de vos clients · Fin des lenteurs · Score maximal',
    headline: 'Transformez votre vieux site lent et dépassé en une vitrine moderne qui redonne confiance.',
    summary: 'Votre site a plusieurs années, s’affiche mal sur smartphone ou a été fait sur un WordPress qui plante tout le temps ? Nous le reconstruisons entièrement en conservant rigoureusement vos adresses et votre positionnement Google sans rien casser.',
    price: '890 à 2 490 € + 79 €/mois',
    priceSetup: 'dès 890 €',
    promoSetup: 'dès 667 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '79 €/mois',
    monthlyNote: 'Hébergement, maintenance technique et garantie contractuelle de zéro perte de trafic Google.',
    delay: '7 à 14 jours ouvrés',
    targetAudience: 'Entreprises en Wallonie qui ont déjà un site web mais qui ont honte de le montrer, qui ne reçoivent plus de demandes, ou qui ont peur de tout perdre en le refaisant.',
    utility: 'Diviser par 4 le temps de chargement, récupérer vos visiteurs mobiles et doubler vos demandes de devis sans perdre un seul lien Google déjà acquis.',
    searchIntentKeywords: [
      'refonte site internet charleroi avis',
      'moderniser vieux site web entreprise belgique',
      'migration wordpress vers site sur mesure',
      'refonte site web sans perte référencement'
    ],
    relatedCases: [
      { id: 'renovation', name: 'Atelier Noma', sector: 'Rénovation' }
    ],
    comparison: [
      { aspect: 'Conservation de vos liens Google', others: 'Liens cassés et chute de moitié de vos visites Google après la refonte', purity: 'Garantie zéro lien cassé : chaque ancienne adresse renvoie vers la nouvelle page' },
      { aspect: 'Technologie employée', others: 'Nouveau thème WordPress lourd avec des dizaines d’extensions qui ralentiront dans 6 mois', purity: 'Code artisanal ultra-léger et durable, sans mises à jour qui cassent votre affichage' },
      { aspect: 'Sécurité & Fiabilité', others: 'Risque permanent d’attaques et de piratages sur les vieux plugins', purity: 'Structure sécurisée et fermée, impossible à pirater par les robots du web' }
    ],
    deliverables: [
      {
        title: 'Inventaire complet de votre ancien site sans rien oublier',
        desc: 'Relevé de l’ensemble de vos anciennes pages et de vos photos pour s’assurer qu’aucun contenu utile ni aucun contact régulier ne soit perdu lors de la modernisation.'
      },
      {
        title: 'Garantie de zéro perte de positionnement Google',
        desc: 'Chaque ancienne adresse internet de votre site est redirigée de manière transparente vers sa nouvelle page équivalente pour préserver 100 % de votre historique.'
      },
      {
        title: 'Modernisation visuelle pensée pour vos clients locaux',
        desc: 'Remplacement de votre ancien site vieillot par une vitrine lumineuse, moderne et rassurante : vos réalisations récentes et vos avis clients 5 étoiles sont mis en premier plan.'
      },
      {
        title: 'Suppression définitive des extensions lourdes & des failles de sécurité',
        desc: 'Élimination des dizaines de plugins qui ralentissent votre site et créent des failles de piratage, au profit d’un code propre et fiable qui démarre au quart de tour.'
      },
      {
        title: 'Formulaire de devis moderne avec questions clés',
        desc: 'Remplacement de votre vieux formulaire spammé par un parcours clair demandant la commune, le type de projet et le délai souhaité.'
      },
      {
        title: 'Mise en conformité légale belge complète (BCE, TVA, RGPD)',
        desc: 'Nettoyage des vieux scripts de suivi et mise aux normes de vos mentions légales pour une tranquillité d’esprit totale.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Pénalités de Google et recul dans les résultats de recherche',
        desc: 'Google relègue systématiquement en deuxième page les sites trop lents qui mettent plus de 3 secondes à s’afficher sur mobile.'
      },
      {
        title: 'Risque de piratage et avertissement rouge de sécurité',
        desc: 'Les vieux sites non mis à jour finissent par afficher un message d’alerte de sécurité sur Google qui fait fuir 100 % de vos visiteurs.'
      },
      {
        title: 'Plus des trois quarts des visiteurs sur smartphone perdus',
        desc: 'Un site qui s’affiche mal sur les téléphones modernes décourage immédiatement les clients qui tentent de vous appeler.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Inventaire de ce qui fonctionne', desc: 'On relève les pages qui vous rapportent déjà des contacts et vos plus belles photos de chantiers.' },
      { step: '02', title: 'Création du nouveau site en privé', desc: 'Nous concevons la nouvelle version sur un espace de test privé : votre ancien site continue de tourner sans interruption.' },
      { step: '03', title: 'Vérification complète de tous les liens', desc: 'Contrôle méticuleux pour garantir que chaque ancien lien renvoie immédiatement vers la bonne page sans jamais afficher d’erreur.' },
      { step: '04', title: 'Bascule transparente en quelques minutes', desc: 'Le nouveau site prend le relais sans aucune coupure pour vos clients.' }
    ],
    includedMaintenance: 'Hébergement haute vitesse, renouvellement du domaine .be, surveillance anti-panne et assistance réactive pour vos mises à jour.',
    faq: [
      {
        q: 'Vais-je perdre ma place sur Google ?',
        a: 'Non. Nous redirigeons rigoureusement chaque ancienne adresse vers la nouvelle page. Google comprend tout de suite que le site a été modernisé et maintient votre visibilité.'
      },
      {
        q: 'Mon site sera-t-il coupé pendant les travaux ?',
        a: 'Pas une seule seconde. Le nouveau site est préparé sur un serveur de test privé. La bascule finale se fait en quelques minutes sans aucune interruption.'
      },
      {
        q: 'Mes adresses e-mails vont-elles continuer de fonctionner ?',
        a: 'Oui, exactement comme avant, sans aucune coupure de vos e-mails professionnels.'
      },
      {
        q: 'Quel est le prix exact pour moderniser mon site ?',
        a: 'Le tarif dépend de la taille de votre site : 890 € pour un petit site ou une page unique, jusqu’à 2 490 € pour un grand site de plus de 10 pages. Le tarif est fixé à l’avance sans mauvaise surprise.'
      }
    ]
  },
  {
    id: 'M08',
    slug: 'google-business',
    name: 'Fiche Google Business & Maps',
    pillar: 'Pilier 01 · Sites Web & Référencement',
    kicker: 'Visibilité locale immédiate · Avis 5 étoiles · Appel en 1 clic',
    headline: 'Faites apparaître votre entreprise en tête de Google Maps sur votre commune.',
    summary: 'En Belgique, 65 % des personnes qui cherchent un artisan sur leur téléphone appellent directement depuis la carte Google Maps sans visiter de site web. Nous validons et optimisons votre fiche pour que votre téléphone sonne dès qu’un client cherche votre métier à proximité.',
    price: '290 €',
    priceSetup: '290 €',
    promoSetup: '217 €',
    promoTag: '-25 % 24h',
    monthlyPrice: null,
    monthlyNote: 'Paiement unique sans abonnement obligatoire.',
    delay: '3 à 5 jours ouvrés',
    targetAudience: 'Tous les artisans, dépanneurs, commerçants et PME en Wallonie dont les clients se trouvent dans un rayon de 10 à 30 km.',
    utility: 'Capter les appels directs des personnes qui ont un besoin immédiat dans votre commune et s’assurer que votre entreprise affiche des avis 5 étoiles rassurants.',
    searchIntentKeywords: [
      'créer fiche google business belgique',
      'optimiser google maps artisan charleroi',
      'référencement local google maps pme',
      'tarif optimisation fiche google my business'
    ],
    relatedCases: [
      { id: 'garage', name: 'Garage Rive', sector: 'Carrosserie' }
    ],
    comparison: [
      { aspect: 'Validation officielle', others: 'Fiche bloquée en attente de code postal pendant des semaines', purity: 'Validation officielle garantie avec Google sans blocage' },
      { aspect: 'Collecte des avis', others: 'Aucun système : 3 vieux avis qui datent de 2 ans', purity: 'Kit QR Code imprimable + lien direct pour récolter facilement des 5 étoiles' },
      { aspect: 'Présentation de vos tarifs', others: 'Fiche vide sans prestations ni photos', purity: 'Catalogue complet de vos spécialités avec photos valorisées' }
    ],
    deliverables: [
      {
        title: 'Validation officielle de votre fiche avec Google',
        desc: 'Prise en charge complète des démarches auprès de Google pour obtenir le badge officiel vérifié sans blocage administratif.'
      },
      {
        title: 'Choix des catégories de métiers les plus recherchées',
        desc: 'Sélection des catégories précises pour que votre fiche apparaisse dès qu’un client tape votre métier dans votre commune.'
      },
      {
        title: 'Protection de votre adresse privée si vous travaillez à domicile',
        desc: 'Configuration de votre zone d’intervention sans afficher votre adresse privée si votre atelier ou bureau se trouve chez vous.'
      },
      {
        title: 'Catalogue complet de vos prestations et tarifs indicatifs',
        desc: 'Mise en ligne de vos services phares avec photos de chantiers pour que le client voie immédiatement votre savoir-faire.'
      },
      {
        title: 'Kit d’avis clients 5 étoiles avec QR Code prêt à imprimer',
        desc: 'Un QR Code à faire scanner par vos clients satisfaits sur votre camionnette, vos factures ou au comptoir pour récolter des avis 5 étoiles en 5 secondes.'
      },
      {
        title: 'Cohérence complète de vos coordonnées avec le registre BCE',
        desc: 'Vérification que votre nom, adresse et téléphone sont identiques partout pour renforcer votre crédibilité auprès de Google.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Invisibilité sur 65 % des recherches mobiles locales',
        desc: 'Ne pas être bien placé sur Google Maps, c’est laisser l’ensemble des appels téléphoniques directs aux concurrents du coin.'
      },
      {
        title: 'Des avis négatifs sans réponse qui font fuir les clients',
        desc: 'Une fiche abandonnée où des avis restent sans réponse donne l’impression d’une entreprise qui ne se soucie pas de ses clients.'
      },
      {
        title: 'Des clients qui trouvent un mauvais numéro de téléphone',
        desc: 'Un numéro erroné ou des horaires pas à jour provoquent la frustration immédiate des clients qui appellent un confrère.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Vérification de votre situation', desc: 'On regarde si vous avez déjà une fiche créée, des doublons ou des accès perdus à récupérer.' },
      { step: '02', title: 'Rédaction et remplissage complet', desc: 'Nous écrivons la présentation de votre entreprise et mettons en place vos services clés.' },
      { step: '03', title: 'Sélection de vos meilleures photos', desc: 'Mise en ligne de vos réalisations pour donner envie aux clients de vous choisir.' },
      { step: '04', title: 'Envoi de votre kit d’avis QR Code', desc: 'Vous recevez votre lien et votre QR Code pour commencer à récolter des avis positifs immédiatement.' }
    ],
    includedMaintenance: 'Prestation ponctuelle sans abonnement. Vos accès vous sont remis pour que la fiche vous appartienne définitivement.',
    faq: [
      {
        q: 'Je travaille chez moi, mon adresse privée sera-t-elle visible ?',
        a: 'Non. Nous configurons la fiche en "zone desservie" : Google affiche les communes où vous vous déplacez sans jamais afficher l’adresse de votre maison.'
      },
      {
        q: 'Combien de temps faut-il pour voir les résultats ?',
        a: 'La fiche est active immédiatement après validation. Vos premiers appels arrivent généralement dès les premières semaines grâce aux avis récoltés.'
      },
      {
        q: 'J’ai déjà des avis sur ma fiche, vais-je les perdre ?',
        a: 'Non, absolument pas. Nous reprenons et améliorons votre fiche existante sans rien supprimer.'
      },
      {
        q: 'Comment mes clients utilisent-ils le QR Code ?',
        a: 'Ils scannent simplement le QR Code avec l’appareil photo de leur smartphone : la page d’avis Google s’ouvre directement avec 5 étoiles pré-cochées.'
      }
    ]
  },
  {
    id: 'M09',
    slug: 'identite-visuelle-logo',
    name: 'Identité visuelle & Logo',
    pillar: 'Pilier 02 · Image de Marque & Studio',
    kicker: 'Image haut de gamme · Camionnettes & Devis · Propriété totale',
    headline: 'Une identité visuelle claire qui inspire confiance et justifie vos devis.',
    summary: 'Fini les logos bricolés ou pixélisés : nous créons une identité de marque nette, lisible et professionnelle, pensée pour le monde réel (flocage de véhicules utilitaires, vêtements de travail, devis et factures).',
    price: '690 €',
    priceSetup: '690 €',
    promoSetup: '517 €',
    promoTag: '-25 % 24h',
    monthlyPrice: null,
    monthlyNote: 'Paiement unique · cession totale de propriété incluse.',
    delay: '7 à 10 jours ouvrés',
    targetAudience: 'Artisans du bâtiment, indépendants qui se lancent, commerces locaux et entreprises voulant une image sérieuse qui inspire confiance dès le premier coup d’œil.',
    utility: 'Inspirer le sérieux et la solidité, éviter d’être pris pour un travailleur du dimanche et donner envie aux clients de signer vos devis sans marchander.',
    searchIntentKeywords: [
      'création logo entreprise charleroi',
      'tarif identité visuelle artisan belgique',
      'graphiste logo pme namur mons',
      'flocage camionnette logo vectoriel'
    ],
    relatedCases: [
      { id: 'animaux', name: 'Patte Douce', sector: 'Toilettage Animalier' }
    ],
    comparison: [
      { aspect: 'Fichiers fournis', others: 'Une simple image JPEG pixélisée que votre imprimeur refuse', purity: 'Fichiers vectoriels professionnels haute définition utilisables pour toute taille' },
      { aspect: 'Propriété du logo', others: 'Droits conservés par le graphiste avec factures supplémentaires pour chaque support', purity: 'Cession totale et définitive de tous les droits de propriété' },
      { aspect: 'Usage sur camionnette', others: 'Logo trop complexe illisible quand le véhicule roule', purity: 'Pensé spécifiquement pour le lettrage de véhicules et les vêtements de travail' }
    ],
    deliverables: [
      {
        title: '3 propositions de logos uniques adaptées à votre métier',
        desc: 'Nous vous présentons trois pistes graphiques différentes, appliquées sur des exemples concrets (camionnette, t-shirt, carte de visite).'
      },
      {
        title: 'Fichiers professionnels haute définition (Pour imprimeur et lettrage)',
        desc: 'Votre logo livré aux formats vectoriels (PDF vectoriel, SVG, EPS) : vous pouvez l’agrandir à l’infini sans aucune pixellisation pour votre camionnette ou une bâche de chantier.'
      },
      {
        title: 'Pack d’images prêtes pour votre site et vos réseaux',
        desc: 'Images au fond transparent prêtes à l’emploi pour votre site web, votre profil Facebook/WhatsApp et vos factures.'
      },
      {
        title: 'Fiche mémo de vos couleurs officielles',
        desc: 'Un document d’une page avec les références exactes de vos couleurs pour que vos futurs t-shirts ou autocollants soient toujours identiques.'
      },
      {
        title: 'Gabarits prêts pour votre enseigniste ou floqueur',
        desc: 'Des fichiers préparés aux bonnes normes pour que votre prestataire de lettrage puisse travailler sans vous facturer de frais techniques.'
      },
      {
        title: 'Cession totale et définitive des droits d’auteur',
        desc: 'Un contrat officiel attestant que vous êtes le propriétaire exclusif de votre logo pour toujours.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Des clients qui négocient vos prix à cause d’un logo amateur',
        desc: 'Une image bricolée donne l’impression d’un petit indépendant débutant et pousse inconsciemment les clients à marchander vos prix.'
      },
      {
        title: 'Des frais supplémentaires chez les imprimeurs et floqueurs',
        desc: 'Donner un fichier de mauvaise qualité à un enseigniste entraîne des frais de redessinage facturés entre 150 € et 300 € en plus.'
      },
      {
        title: 'Une entreprise vite oubliée une fois le chantier fini',
        desc: 'Sans logo clair et marquant, vos clients satisfaits peinent à se souvenir de votre nom quand un voisin leur demande une recommandation.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Court échange sur vos préférences', desc: 'On parle de vos goûts, des couleurs que vous aimez et des supports où vous voulez mettre votre logo.' },
      { step: '02', title: 'Présentation de 3 projets', desc: 'Vous découvrez 3 pistes différentes présentées sur une camionnette et un vêtement de travail pour bien vous projeter.' },
      { step: '03', title: 'Ajustements sur votre préféré', desc: 'On peaufine les détails de la piste choisie (nuances, disposition du texte) selon vos remarques.' },
      { step: '04', title: 'Livraison de votre dossier complet', desc: 'Vous recevez tous vos fichiers classés, prêts à être transmis à votre imprimeur ou floqueur.' }
    ],
    includedMaintenance: 'Prestation ponctuelle sans abonnement. Vos fichiers restent sauvegardés sur nos serveurs si vous les perdez un jour.',
    faq: [
      {
        q: 'Combien de modifications sont possibles ?',
        a: 'Nous incluons jusqu’à 3 séries d’ajustements sur la piste retenue pour que le résultat final vous plaise à 100 %.'
      },
      {
        q: 'Mon floqueur de camionnette pourra-t-il utiliser ces fichiers ?',
        a: 'Oui, tout à fait. Nous livrons exactement les fichiers professionnels (vectoriels) que demandent tous les enseignistes et imprimeurs en Belgique.'
      },
      {
        q: 'Puis-je déposer ce logo comme marque si je le souhaite ?',
        a: 'Oui, le logo est 100 % original et vous en recevez la propriété totale, ce qui vous permet de le déposer officiellement auprès du bureau des marques (OBPI) si vous le souhaitez.'
      },
      {
        q: 'Que se passe-t-il si aucune des 3 premières pistes ne me plaît ?',
        a: 'Notre échange initial permet de bien cerner ce que vous voulez. Si nécessaire, on discute de ce qui coince et on vous prépare une proposition alternative sans surcoût.'
      }
    ]
  },
  {
    id: 'M10',
    slug: 'pack-visuels-reels',
    name: 'Pack Visuels & Reels Studio',
    pillar: 'Pilier 02 · Image de Marque & Studio',
    kicker: '4 vidéos montées + 6 visuels · Chantiers réels · Prêt à publier',
    headline: 'Des vidéos courtes et des visuels soignés de vos chantiers pour attirer des clients sur Instagram et Facebook.',
    summary: 'Les simples photos prises à la va-vite ne suffisent plus : nous prenons vos vidéos brutes filmées au smartphone sur vos chantiers et les transformons en vidéos dynamiques avec sous-titres et visuels prêts à publier.',
    price: '390 €',
    priceSetup: '390 €',
    promoSetup: '292 €',
    promoTag: '-25 % 24h',
    monthlyPrice: null,
    monthlyNote: 'Paiement unique sans abonnement.',
    delay: '4 à 7 jours ouvrés',
    targetAudience: 'Artisans du bâtiment, restaurateurs, instituts de beauté et commerçants qui veulent montrer la qualité de leur travail en vidéo sans y passer leurs soirées.',
    utility: 'Disposer d’un pack de contenus vidéo professionnels pour faire vivre vos réseaux sociaux, rassurer vos futurs clients et donner envie de faire appel à vous.',
    searchIntentKeywords: [
      'création reels instagram artisan belgique',
      'montage vidéo tiktok commerce wallonie',
      'pack visuels réseaux sociaux charleroi',
      'tarif monteur vidéo indépendant pme'
    ],
    relatedCases: [
      { id: 'animaux', name: 'Patte Douce', sector: 'Commerce Local' }
    ],
    comparison: [
      { aspect: 'Qualité vidéo', others: 'Vidéos bancales sans rythme ni texte que personne ne regarde jusqu’au bout', purity: 'Montage dynamique au bon format avec sous-titres synchronisés faciles à lire' },
      { aspect: 'Temps passé', others: '3 heures de galère sur son téléphone le soir pour un résultat décevant', purity: 'Vous envoyez vos vidéos sur WhatsApp, nous nous occupons de tout le montage' },
      { aspect: 'Droits musicaux', others: 'Vidéos muettes ou coupées par Instagram pour droits musicaux', purity: 'Musiques autorisées pour les comptes professionnels sans risque de coupure' }
    ],
    deliverables: [
      {
        title: '4 vidéos courtes (Reels / TikToks) montées de A à Z',
        desc: 'Montage rythmé mettant en avant votre savoir-faire dès les premières secondes, avec transitions soignées et musique adaptée.'
      },
      {
        title: 'Sous-titres dynamiques synchronisés mot à mot',
        desc: '80 % des gens regardent les vidéos sans le son dans les transports ou en famille : les sous-titres permettent à tout le monde de comprendre votre message.'
      },
      {
        title: '6 visuels carrés ou carrousels de réalisations',
        desc: 'Mise en page graphique soignée présentant vos étapes de chantier, vos avant/après et les avis de vos clients.'
      },
      {
        title: 'Textes de publication & mots-clés locaux rédigés',
        desc: 'Textes prêts à être copiés-collés avec des mots-clés ciblés sur votre région pour être vu par des clients près de chez vous.'
      },
      {
        title: 'Images de couverture personnalisées',
        desc: 'Des vignettes propres pour que votre page Instagram ou Facebook ait une allure soignée et cohérente.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Des photos simples que plus personne ne voit sur les réseaux',
        desc: 'Instagram et Facebook mettent désormais en avant presque uniquement les vidéos : une simple photo statique ne touche quasiment plus aucun nouveau client.'
      },
      {
        title: 'Des heures perdues à bricoler des vidéos sur son téléphone',
        desc: 'Passer son dimanche soir à galérer sur des applications de montage complexes au lieu de se reposer avant la semaine de chantiers.'
      },
      {
        title: 'Une image terne face aux confrères qui montrent leurs chantiers',
        desc: 'Les artisans qui publient des vidéos propres de leurs réalisations attirent naturellement les meilleurs clients de la région.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Envoi de vos vidéos brutes', desc: 'Vous filmez quelques secondes avec votre smartphone sur vos chantiers et vous nous les envoyez par WhatsApp ou lien partagé.' },
      { step: '02', title: 'Montage et sous-titrage', desc: 'Nous coupons les passages inutiles, ajustons le rythme sur la musique et ajoutons les textes explicatifs.' },
      { step: '03', title: 'Aperçu sur votre smartphone', desc: 'Vous regardez les vidéos sur votre téléphone et nous ajustons un mot ou une coupe si vous le souhaitez.' },
      { step: '04', title: 'Livraison des fichiers prêts à poster', desc: 'Vous recevez vos vidéos et vos textes prêts à être mis en ligne en un clic.' }
    ],
    includedMaintenance: 'Livraison sous forme de pack de fichiers. Si vous préférez que nous nous occupions aussi de publier vos vidéos chaque semaine, découvrez notre formule M16.',
    faq: [
      {
        q: 'Faut-il du matériel vidéo professionnel ?',
        a: 'Pas du tout ! Votre smartphone habituel suffit amplement. La qualité des caméras actuelles est excellente : notre travail consiste à faire le tri, le montage et le sous-titrage.'
      },
      {
        q: 'Comment filmer sur chantier sans perdre de temps ?',
        a: 'On vous donne 3 conseils très simples : poser le téléphone quelques secondes pendant que vous travaillez, filmer un plan avant et un plan après, c’est tout.'
      },
      {
        q: 'Puis-je mettre ces vidéos sur mon site internet ?',
        a: 'Oui, nous pouvons les ajouter directement sur votre site vitrine pour montrer vos chantiers à vos futurs clients.'
      },
      {
        q: 'Les musiques utilisées risquent-elles d’être bloquées ?',
        a: 'Non, nous choisissons des musiques autorisées pour un usage professionnel pour éviter toute coupure de son.'
      }
    ]
  },
  {
    id: 'M13',
    slug: 'referencement-local-seo',
    name: 'Référencement local (SEO)',
    pillar: 'Pilier 01 · Sites Web & Référencement',
    kicker: 'Visibilité durable · Mots-clés chantiers · 1ère page Google en Wallonie',
    headline: 'Soyez le premier artisan appelé quand un client cherche votre métier sur Google dans votre région.',
    summary: 'Un travail régulier pour placer votre site web en tête des résultats Google dès qu’un habitant de votre région cherche une intervention précise (ex: "chauffagiste agréé Charleroi", "carrossier Namur", "rénovation toiture Mons") sans dépendre de publicités payantes.',
    price: '590 € + 149 €/mois',
    priceSetup: '590 €',
    promoSetup: '442 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '149 €/mois',
    monthlyNote: 'Optimisations continues, création de contenus mensuels sur vos chantiers et bilan transparent sans jargon.',
    delay: 'Mise en place : 10 jours ouvrés',
    targetAudience: 'Entreprises établies en Wallonie qui ne veulent plus dépendre du bouche-à-oreille aléatoire et souhaitent devenir la référence évidente sur leur secteur.',
    utility: 'Générer des demandes de chantiers régulières chaque semaine sans devoir payer pour chaque clic publicitaire, en étant tout en haut de Google au moment précis où le client en a besoin.',
    searchIntentKeywords: [
      'agence référencement naturel seo charleroi',
      'expert seo local belgique wallonie',
      'comment être premier sur google artisan',
      'tarif référencement mensuel pme belgique'
    ],
    relatedCases: [
      { id: 'chauffage', name: 'Thermiq', sector: 'Chauffage & Énergie' },
      { id: 'renovation', name: 'Atelier Noma', sector: 'Rénovation' }
    ],
    comparison: [
      { aspect: 'Rentabilité à long terme', others: 'Publicité payante : dès qu’on arrête de payer, les appels s’arrêtent net', purity: 'Référencement naturel : une place acquise en tête de Google vous rapporte des chantiers pendant des années' },
      { aspect: 'Rapport d’activité', others: 'Rapport automatique de 30 pages incompréhensible plein de jargon', purity: 'Bilan mensuel simple d’une page avec vos vraies positions et les appels générés' },
      { aspect: 'Méthodes de travail', others: 'Bidouillages risqués qui peuvent faire bannir votre site par Google', purity: 'Méthodes saines et durables respectant rigoureusement les consignes de Google' }
    ],
    deliverables: [
      {
        title: 'Sélection des 20 recherches les plus rentables dans votre zone',
        desc: 'Identification des expressions exactes que tapent vos clients sur Google quand ils cherchent un artisan disponible chez vous, avec tri par volume et rentabilité.'
      },
      {
        title: 'Optimisation technique continue de votre site pour Google',
        desc: 'Réglage des titres, accélération des images et mise à jour des informations de votre entreprise pour que Google comprenne parfaitement ce que vous faites.'
      },
      {
        title: 'Rédaction mensuelle de fiches chantiers et conseils pratiques',
        desc: 'Création d’articles et de fiches d’interventions répondant aux vraies questions de vos clients (prix moyens, primes wallonnes, déroulement des travaux).'
      },
      {
        title: 'Inscription et présence sur les annuaires belges reconnus',
        desc: 'Renforcement de votre présence sur les annuaires et sites professionnels belges fiables pour prouver votre solidité à Google.'
      },
      {
        title: 'Bilan mensuel clair sur vos positions et vos appels',
        desc: 'Un compte-rendu simple chaque mois qui vous montre votre progression sur Google et le nombre de contacts apportés par le site.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Des milliers d’euros dépensés en publicité continue',
        desc: 'Dès que vous arrêtez de payer des annonces Google Ads, votre visibilité disparaît : le référencement naturel construit un actif qui vous appartient.'
      },
      {
        title: 'Une première place prise durablement par vos concurrents',
        desc: 'Rattraper un confrère installé depuis 2 ans en première page de Google demande deux fois plus d’efforts que de prendre la place maintenant.'
      },
      {
        title: 'Des demandes hors secteur venant de trop loin',
        desc: 'Recevoir des appels inexploitations venant de Bruxelles ou de France parce que votre site n’est pas clairement calé sur votre zone d’intervention.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Étude des recherches de vos clients', desc: 'On analyse ce que vos clients tapent réellement sur Google dans votre région pour trouver votre métier.' },
      { step: '02', title: 'Réglages de votre site', desc: 'On met à niveau les titres et les textes de votre site pour que Google vous classe parmi les premiers.' },
      { step: '03', title: 'Publication de nouveaux contenus', desc: 'On rédige et met en ligne des articles ciblés sur vos compétences les plus rentables.' },
      { step: '04', title: 'Suivi mensuel de vos gains de place', desc: 'Chaque mois, on mesure vos progrès et on ajuste les efforts sur les chantiers qui rapportent le plus.' }
    ],
    includedMaintenance: 'Surveillance des résultats sur Google Search Console, ajustement des textes en fonction des mises à jour de Google et assistance directe.',
    faq: [
      {
        q: 'Au bout de combien de temps voit-on les premiers résultats ?',
        a: 'En référencement local, les premières remontées visibles arrivent généralement entre 6 et 12 semaines. C’est un travail régulier qui sécurise vos chantiers sur le long terme.'
      },
      {
        q: 'Pouvez-vous garantir la première place absolue sur Google ?',
        a: 'Aucune agence sérieuse ne peut garantir contractuellement la première place à 100 %, car l’algorithme appartient à Google. En revanche, nous appliquons les méthodes exactes qui placent nos clients réguliers sur le podium.'
      },
      {
        q: 'Puis-je suspendre le suivi si je le souhaite ?',
        a: 'Nous recommandons une première période de 6 mois pour installer solidement vos positions. Ensuite, le suivi est renouvelable au mois le mois avec arrêt sur simple e-mail.'
      },
      {
        q: 'Dois-je écrire des articles moi-même ?',
        a: 'Non, pas du tout. Notre équipe rédige l’ensemble des textes après avoir validé les sujets principaux avec vous.'
      }
    ]
  },
  {
    id: 'M16',
    slug: 'gestion-reseaux-sociaux',
    name: 'Réseaux sociaux (3x/semaine)',
    pillar: 'Pilier 02 · Image de Marque & Studio',
    kicker: '12 posts/mois + 4 vidéos · 1er mois offert · Gestion 100 % déléguée',
    headline: 'Une présence active et soignée sur vos réseaux sociaux sans y passer une seule minute de votre temps.',
    summary: 'Vous n’avez ni le temps ni l’envie de passer vos soirées à chercher quoi publier sur Instagram et Facebook ? Nous nous occupons de tout : planning du mois, rédaction, visuels, montage des vidéos de chantiers et programmation automatique.',
    price: '290 € + 349 €/mois',
    priceSetup: '290 €',
    promoSetup: '217 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '349 €/mois',
    monthlyNote: 'Gestion complète, 12 publications par mois, 4 vidéos montées et réponses aux messages de base.',
    delay: 'Démarrage sous 5 jours ouvrés',
    targetAudience: 'Artisans, commerçants, restaurateurs et gérants de PME en Wallonie qui savent qu’il faut être visible sur les réseaux mais qui manquent de temps pour s’en occuper.',
    utility: 'Avoir une vitrine active et professionnelle qui rassure vos prospects et fait parler de votre entreprise, sans que vous n’ayez à toucher à votre téléphone après le travail.',
    searchIntentKeywords: [
      'gestion réseaux sociaux pme wallonie',
      'community manager artisan charleroi',
      'tarif gestion instagram entreprise belgique',
      'déléguer réseaux sociaux indépendant'
    ],
    relatedCases: [
      { id: 'animaux', name: 'Patte Douce', sector: 'Commerce Local' }
    ],
    comparison: [
      { aspect: 'Régularité des publications', others: '3 posts en une semaine puis plus rien pendant 6 mois', purity: '3 publications de qualité par semaine, chaque semaine, sans interruption' },
      { aspect: 'Variété des contenus', others: 'Photos de chantier brutes sans texte ni explication', purity: 'Mélange équilibré de vidéos courtes, photos de réalisations et avis clients' },
      { aspect: 'Offre découverte', others: 'Engagement immédiat de 12 mois sans tester le résultat', purity: '1er mois d’abonnement 100 % offert : vous ne réglez que la mise en place initiale' }
    ],
    deliverables: [
      {
        title: '12 publications soignées par mois (3 par semaine)',
        desc: 'Des publications régulières montrant vos réalisations récentes, vos coulisses d’atelier, vos avis clients et vos prestations clés.'
      },
      {
        title: '4 vidéos courtes montées par mois (Reels / TikToks)',
        desc: 'Des vidéos rythmées avec sous-titres pour capter de nouveaux clients locaux qui ne connaissent pas encore votre entreprise.'
      },
      {
        title: 'Rédaction complète des textes sans aucun jargon',
        desc: 'Chaque publication est accompagnée d’un texte clair, poli et direct invitant les personnes intéressées à vous demander un devis.'
      },
      {
        title: 'Planning du mois partagé à l’avance pour validation',
        desc: 'Vous validez l’ensemble des publications du mois en 5 minutes sur votre téléphone avant qu’elles ne soient programmées.'
      },
      {
        title: 'Diffusion automatique aux meilleures heures de la journée',
        desc: 'Vos contenus sont publiés automatiquement aux moments où vos clients locaux sont les plus attentifs (pauses déjeuner, soirées, week-ends).'
      },
      {
        title: '1er mois d’abonnement 100 % offert pour tester',
        desc: 'Vous ne payez que les frais de démarrage initial (avec la remise de 25 %). Le premier mois de gestion complet est totalement offert.'
      }
    ],
    lossOfInaction: [
      {
        title: 'L’effet négatif d’une page abandonnée depuis des mois',
        desc: 'Un client qui visite votre page Facebook et voit que le dernier post date de l’année dernière pense immédiatement que l’entreprise est fermée ou en difficulté.'
      },
      {
        title: 'Des week-ends gâchés à stresser sur quoi publier',
        desc: 'Passer son dimanche soir à chercher une idée de publication au lieu de profiter de ses proches.'
      },
      {
        title: 'Vos anciens clients qui vous oublient avec le temps',
        desc: 'Ne pas apparaître régulièrement sous les yeux de vos anciens clients les empêche de penser à vous quand un ami cherche un artisan fiable.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Court échange sur vos priorités', desc: 'On définit le style de communication, vos chantiers phares et les services à mettre en avant.' },
      { step: '02', title: 'Préparation du mois complet', desc: 'Nous rédigeons les 12 textes et préparons tous les visuels et vidéos du mois.' },
      { step: '03', title: 'Validation en 5 minutes', desc: 'Vous jetez un œil sur votre smartphone et vous validez ou demandez une correction en un clic.' },
      { step: '04', title: 'Diffusion automatique', desc: 'Nous nous chargeons de toutes les publications aux heures optimales sans que vous n’ayez rien à faire.' }
    ],
    includedMaintenance: 'Programmation des posts, assistance rapide si vous avez une annonce urgente (ex: congés annuels) et surveillance de vos comptes.',
    faq: [
      {
        q: 'Dois-je vous envoyer des photos chaque semaine ?',
        a: 'Non, il vous suffit de déposer vos photos de chantiers sur une conversation WhatsApp au fil de vos journées. Nous nous chargeons de les trier, recadrer et scénariser.'
      },
      {
        q: 'Comment fonctionne le 1er mois offert ?',
        a: 'Vous ne réglez que les frais de mise en place de départ (217 € au lieu de 290 €). Le premier mois complet d’abonnement (valeur 349 €) est totalement gratuit.'
      },
      {
        q: 'Puis-je continuer à poster moi-même de temps en temps ?',
        a: 'Oui, bien sûr ! Notre travail assure votre présence régulière, mais vous restez totalement libre de poster une story spontanée quand vous le souhaitez.'
      },
      {
        q: 'Sur quels réseaux sociaux publiez-vous ?',
        a: 'Principalement sur Facebook et Instagram pour les particuliers, ou sur LinkedIn si vous travaillez pour des clients professionnels (B2B).'
      }
    ]
  },
  {
    id: 'M21',
    slug: 'pilote-automatique-essentiel',
    name: 'Pilote Automatique Essentiel',
    pillar: 'Pilier 03 · Automatisation & Agents IA',
    kicker: '1 tâche automatisée · Gain de 5h/semaine · Fin des no-shows & devis oubliés',
    headline: 'Automatisez la corvée répétitive qui vous fait perdre le plus de temps chaque semaine.',
    summary: 'Mise en place clé en main d’une automatisation ciblée au choix : rappel automatique par SMS pour éliminer les rendez-vous manqués (no-shows), relance courtoise de vos devis en attente à J+3 et J+7, ou alerte SMS immédiate dès qu’un devis urgent arrive.',
    price: '490 € + 39 €/mois',
    priceSetup: '490 €',
    promoSetup: '367 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '39 €/mois',
    monthlyNote: 'Surveillance continue des connexions automatiques, alertes anti-erreurs et assistance technique.',
    delay: '5 à 7 jours ouvrés',
    targetAudience: 'Artisans et indépendants en Wallonie qui passent leurs soirées à taper les mêmes messages, relancer des devis non signés ou courir après des clients qui oublient leurs rendez-vous.',
    utility: 'Récupérer immédiatement 3 à 5 heures de temps libre chaque semaine, stopper les déplacements pour rien et signer plus de devis sans effort commercial supplémentaire.',
    searchIntentKeywords: [
      'automatiser devis artisan belgique',
      'prise de rendez-vous automatique pme wallonie',
      'automatisation tâches répétitives charleroi',
      'relance devis automatique indépendant'
    ],
    relatedCases: [
      { id: 'sante', name: 'Cabinet Horizon', sector: 'Santé & Médical' }
    ],
    comparison: [
      { aspect: 'Rapidité de réponse', others: 'Réponse le lendemain soir après le chantier (le client a déjà appelé un confrère)', purity: 'Confirmation ou accusé de réception envoyé automatiquement en 30 secondes chrono' },
      { aspect: 'Relance des devis', others: 'Devis oubliés dans un tiroir ou un carnet de notes', purity: 'Relances polies et automatiques à J+3 et J+7 sans y penser' },
      { aspect: 'Fiabilité du système', others: 'Bricolage maison qui plante dès qu’une application se met à jour', purity: 'Système professionnel surveillé en continu avec alertes anti-pannes' }
    ],
    deliverables: [
      {
        title: 'Mise en place de votre automatisation n°1 au choix',
        desc: 'Exemples concrets : Prise de rendez-vous en ligne avec rappel SMS automatique 24h avant, relance automatique des devis non signés à J+3 et J+7, ou alerte SMS instantanée sur votre smartphone dès qu’un gros chantier arrive.'
      },
      {
        title: 'Connexion directe avec vos outils habituels',
        desc: 'Liaison directe avec votre boîte e-mail, votre agenda Google/Outlook ou votre numéro de téléphone sans changer vos habitudes.'
      },
      {
        title: 'Modèles de messages rédigés dans votre ton naturel',
        desc: 'Les SMS et e-mails automatiques sont rédigés poliment et chaleureusement : vos clients ont l’impression exacte que vous leur écrivez personnellement.'
      },
      {
        title: 'Tests complets pour garantir zéro faux pas',
        desc: 'Vérification méticuleuse de tous les cas (annulations, doublons, week-ends) pour s’assurer que le système tourne sans le moindre bug.'
      },
      {
        title: 'Fiche d’utilisation simple d’une seule page',
        desc: 'Un mémo clair pour savoir comment suspendre le système en vacances ou modifier un texte en 30 secondes en toute autonomie.'
      }
    ],
    lossOfInaction: [
      {
        title: '40 % des devis oubliés qui finissent chez un concurrent',
        desc: 'Un client qui ne reçoit aucune relance finit très souvent par signer chez l’artisan qui a simplement pris la peine de lui envoyer un petit message de suivi.'
      },
      {
        title: '5 heures de paperasse inutile chaque semaine',
        desc: 'Ressaisir manuellement des coordonnées ou retaper les mêmes e-mails types le soir au lieu de se détendre en famille.'
      },
      {
        title: 'Des rendez-vous manqués qui vous font perdre votre temps',
        desc: 'Sans rappel automatique par SMS la veille, un client sur cinq oublie sa présence et vous fait perdre un déplacement ou un créneau d’intervention.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Choix de votre corvée prioritaire', desc: 'On identifie ensemble la tâche administrative qui vous prend le plus la tête au quotidien.' },
      { step: '02', title: 'Connexion de vos outils', desc: 'On relie votre boîte e-mail, votre calendrier ou votre téléphone en toute sécurité.' },
      { step: '03', title: 'Réglage des messages et des délais', desc: 'On configure ensemble le texte des messages et les moments précis où ils doivent partir.' },
      { step: '04', title: 'Mise en route & tranquillité', desc: 'Le système tourne tout seul en arrière-plan sans que vous n’ayez plus à vous en soucier.' }
    ],
    includedMaintenance: 'Surveillance technique permanente, maintien des connexions avec vos outils et dépannage rapide en cas de mise à jour.',
    faq: [
      {
        q: 'Mes clients vont-ils voir que c’est automatique ?',
        a: 'Non. Les messages sont rédigés dans votre style habituel, courtois et naturel. Les e-mails partent depuis votre vraie adresse professionnelle.'
      },
      {
        q: 'Puis-je modifier le texte des messages moi-même ?',
        a: 'Oui, très facilement. On vous montre comment changer un mot en quelques secondes, ou vous nous demandez et nous le faisons pour vous.'
      },
      {
        q: 'Que se passe-t-il si un client répond au message automatique ?',
        a: 'La réponse arrive directement dans votre boîte de réception ou sur votre téléphone comme d’habitude : vous reprenez la main immédiatement.'
      },
      {
        q: 'Mes données clients sont-elles en sécurité ?',
        a: 'Oui, à 100 %. Tout est traité selon les normes européennes strictes (RGPD) sans revente de données.'
      }
    ]
  },
  {
    id: 'M22',
    slug: 'pilote-automatique-business',
    name: 'Pilote Automatique Business',
    pillar: 'Pilier 03 · Automatisation & Agents IA',
    kicker: 'Écosystème PME · Devis, Facturation Peppol & Équipe · 0 ressaisie',
    headline: 'Reliez votre site, vos devis, votre planning et votre facturation sans aucune double saisie.',
    summary: 'Fini les post-its, les notes égarées et les ressaisies manuelles : nous connectons vos formulaires web, vos e-mails, votre planning d’équipe et votre logiciel de facturation pour que chaque nouveau contact crée son dossier complet automatiquement.',
    price: '990 € + 69 €/mois',
    priceSetup: '990 €',
    promoSetup: '742 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '69 €/mois',
    monthlyNote: 'Surveillance des liaisons multi-outils, ajustement des champs et assistance technique.',
    delay: '10 à 14 jours ouvrés',
    targetAudience: 'PME, entreprises du bâtiment avec plusieurs camionnettes sur la route, cabinets comptables et sociétés recevant plus de 10 demandes par semaine en Wallonie.',
    utility: 'Faire tourner votre entreprise comme une horloge : chaque demande web crée la fiche client, prévient l’équipe sur le terrain avec le lien GPS et prépare l’ébauche de facture sans rien taper.',
    searchIntentKeywords: [
      'connecter crm formulaire web wallonie',
      'automatisation facturation devis pme belgique',
      'logiciel gestion chantier interconnecté charleroi',
      'expert make n8n entreprise belgique'
    ],
    relatedCases: [
      { id: 'fiduciaire', name: 'Clarté & Associés', sector: 'Fiduciaire' }
    ],
    comparison: [
      { aspect: 'Gestion des dossiers', others: 'Fichiers Excel éparpillés, post-its sur le tableau de bord et doubles saisies', purity: 'Tableau de bord unique et partagé synchronisé en temps réel sur mobile et PC' },
      { aspect: 'Communication avec l’équipe', others: 'Messages WhatsApp perdus dans le fil de discussion', purity: 'Alerte instantanée sur le smartphone du technicien avec l’adresse et le GPS direct' },
      { aspect: 'Relance des impayés', others: 'Rappels manuels tardifs quand le compte bancaire est à sec', purity: 'Relances automatiques polies avant et après la date d’échéance de la facture' }
    ],
    deliverables: [
      {
        title: 'Fin des post-its et des doubles saisies administratives',
        desc: 'Chaque demande reçue sur votre site crée automatiquement la fiche client, prévient votre équipe sur mobile avec l’adresse GPS du chantier, et prépare le devis dans votre logiciel sans aucune ressaisie manuelle.'
      },
      {
        title: 'Connexion de 3 à 5 logiciels de votre entreprise',
        desc: 'Liaison directe entre votre formulaire web, votre boîte e-mail, votre agenda partagé d’équipe et votre logiciel comptable.'
      },
      {
        title: 'Tableau de bord de suivi partagé entre le bureau et le terrain',
        desc: 'Une vue d’ensemble claire (accessible sur smartphone et ordinateur) pour voir en un coup d’œil l’état de chaque devis et de chaque chantier.'
      },
      {
        title: 'Préparation des factures d’acompte & compatibilité Peppol 2026',
        desc: 'Pré-remplissage automatique des factures d’acompte avec le numéro BCE et les coordonnées du client, au format belge obligatoire.'
      },
      {
        title: 'Alertes d’urgence transmises au bon ouvrier avec bouton GPS',
        desc: 'Dès qu’une intervention prioritaire est validée, le technicien le plus proche reçoit un SMS ou WhatsApp avec les consignes et le bouton de guidage GPS en 1 clic.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Des erreurs d’adresses coûteuses entre le bureau et le chantier',
        desc: 'Des notes mal recopiées à la hâte, des ouvriers envoyés au mauvais endroit et des clients excédés par le manque d’organisation.'
      },
      {
        title: 'Des factures impayées oubliées qui plombent votre trésorerie',
        desc: 'Jusqu’à 15 % de retards de paiement en plus faute d’un rappel automatique courtois envoyé quelques jours avant et après l’échéance.'
      },
      {
        title: 'Le patron qui passe 15h par semaine à faire le standardiste',
        desc: 'Passer son temps à coordonner les plannings au téléphone au lieu de chiffrer des chantiers rentables et de développer l’entreprise.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Examen de vos logiciels actuels', desc: 'On regarde les outils que vous utilisez déjà : nous ne vous forçons pas à changer si ce que vous avez vous convient.' },
      { step: '02', title: 'Création des passerelles automatiques', desc: 'Nous programmons les transferts automatiques de données entre votre site, votre agenda et vos dossiers.' },
      { step: '03', title: 'Période de test avec vos équipes', desc: 'On teste le système sur de vraies interventions pour vérifier que tout arrive bien au bon endroit.' },
      { step: '04', title: 'Mise en route & prise en main rapide', desc: 'On montre à votre équipe comment utiliser le tableau sans aucune complication technique.' }
    ],
    includedMaintenance: 'Surveillance proactive des liaisons entre vos logiciels, ajustement des champs lors de vos changements de tarifs et assistance directe.',
    faq: [
      {
        q: 'Dois-je acheter des logiciels informatiques très chers ?',
        a: 'Non, nous privilégions des outils modernes très économiques, voire déjà inclus dans vos outils quotidiens (Google Workspace, Make, Notion, etc.).'
      },
      {
        q: 'Est-ce compatible avec mon logiciel de devis actuel ?',
        a: 'Dans la grande majorité des cas, oui : dès que votre logiciel permet d’exporter des données ou d’envoyer des e-mails normalisés, nous pouvons le relier.'
      },
      {
        q: 'Mes données d’entreprise sont-elles protégées ?',
        a: 'Oui, scrupuleusement. Toutes les transmissions sont chiffrées selon les normes européennes RGPD sans stockage chez des prestataires non autorisés.'
      },
      {
        q: 'Que se passe-t-il si un ouvrier n’est pas à l’aise avec l’informatique ?',
        a: 'Nous simplifions tout au maximum : vos ouvriers reçoivent simplement un SMS ou un WhatsApp avec l’adresse et un gros bouton GPS pour lancer la route.'
      }
    ]
  },
  {
    id: 'M23',
    slug: 'pilote-automatique-integral',
    name: 'Pilote Automatique Intégral',
    pillar: 'Pilier 03 · Automatisation & Agents IA',
    kicker: 'Assistant IA métier · Réponse 24/7 Web & WhatsApp · Zéro réponse inventée',
    headline: 'Un assistant intelligent 24h/24 pour renseigner vos clients et filtrer les demandes avant de vous déranger.',
    summary: 'La solution la plus aboutie : nous paramétrons un assistant IA sur mesure (comme OctoMask sur notre site), entraîné exclusivement sur vos vrais tarifs, vos zones d’intervention et vos règles métier, pour répondre à vos clients le soir et le week-end et ne vous transmettre que les dossiers prêts à signer.',
    price: '1 990 € + 119 €/mois',
    priceSetup: '1 990 €',
    promoSetup: '1 492 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '119 €/mois',
    monthlyNote: 'Surveillance de l’assistant, mises à jour de vos tarifs et ajustements continus.',
    delay: '15 à 20 jours ouvrés',
    targetAudience: 'Entreprises en forte croissance, sociétés de dépannage avec beaucoup d’appels et gérants qui n’en peuvent plus d’être dérangés en permanence pour des questions basiques.',
    utility: 'Répondre poliment aux clients le dimanche soir ou à 23h, vérifier si le projet entre dans votre secteur et votre budget, et ne vous passer que les dossiers chauds et qualifiés.',
    searchIntentKeywords: [
      'création agent ia entreprise belgique',
      'chatbot ia intelligent pme charleroi',
      'automatisation relation client ia wallonie',
      'agent conversationnel sur mesure pme'
    ],
    relatedCases: [
      { id: 'fiduciaire', name: 'Clarté & Associés', sector: 'Fiduciaire' },
      { id: 'immobilier', name: 'Beaux Jours', sector: 'Immobilier' }
    ],
    comparison: [
      { aspect: 'Intelligence des réponses', others: 'Vieux robot bête qui répète en boucle "Je n’ai pas compris votre question"', purity: 'Assistant moderne qui comprend le langage courant de vos clients et répond avec précision' },
      { aspect: 'Respect de vos prix', others: 'IA mal réglée qui invente des faux prix ou promet des réductions impossibles', purity: 'Verrouillage strict : l’assistant ne sort jamais de votre grille de tarifs officielle' },
      { aspect: 'Conformité aux lois européennes', others: 'Données clients envoyées n’importe où sans respecter la loi', purity: '100 % en règle avec les règles européennes RGPD et IA (transparence obligatoire)' }
    ],
    deliverables: [
      {
        title: 'Assistant IA paramétré sur vos règles métier exactes (Zéro réponse inventée)',
        desc: 'Votre assistant est programmé pour respecter scrupuleusement vos prix officiels, vos délais et vos conditions : il n’invente jamais un tarif, n’accorde aucune remise sans accord et reste toujours poli et professionnel.'
      },
      {
        title: 'Disponible là où vos clients vous écrivent (Site web & WhatsApp)',
        desc: 'L’assistant répond instantanément aux questions de vos clients 24h/24 et 7j/7, y compris les soirs et les week-ends quand vous êtes en famille.'
      },
      {
        title: 'Filtrage automatique des demandes & tri des chantiers rentables',
        desc: 'L’assistant demande les informations indispensables (commune, type de travaux, photos, urgence) et vérifie si le client se trouve bien dans votre secteur avant de vous alerter.'
      },
      {
        title: 'Dossier pré-rempli envoyé directement sur votre téléphone',
        desc: 'Dès qu’une demande sérieuse est qualifiée, vous recevez une fiche résumée claire sur votre smartphone avec toutes les informations nécessaires pour rappeler et signer.'
      },
      {
        title: 'Tableau de bord pour consulter toutes les discussions',
        desc: 'Vous pouvez relire l’ensemble des échanges menés par l’assistant à tout moment et reprendre la main sur une discussion quand vous le souhaitez.'
      },
      {
        title: 'Conformité légale européenne garantie (AI Act & RGPD)',
        desc: 'Avertissement clair indiquant au client qu’il dialogue avec un assistant automatisé, et sécurisation totale des coordonnées sans réutilisation externe.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Perte de 35 % des demandes envoyées le soir et le week-end',
        desc: 'Un client qui pose une question le samedi soir n’attend pas le lundi matin : si personne ne lui répond, il contacte immédiatement un concurrent.'
      },
      {
        title: 'Le coût d’une secrétaire téléphonique à temps plein',
        desc: 'Embaucher une personne juste pour décrocher et noter les coordonnées coûte plus de 35 000 € par an avec les charges belges.'
      },
      {
        title: 'Être dérangé en permanence pendant vos chantiers ou le week-end',
        desc: 'Avoir les mains pleines de plâtre ou de cambouis et devoir décrocher pour des personnes qui demandent juste une information basique disponible sur le site.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Notations de vos règles et tarifs', desc: 'On consigne vos prix, vos délais habituels, vos communes d’intervention et les questions fréquentes de vos clients.' },
      { step: '02', title: 'Entraînement de l’assistant sur vos cas réels', desc: 'Tests complets sur plus de 50 questions pièges de clients (tarifs, délais, urgences, secteur) pour valider qu’il répond toujours exactement comme vous le souhaitez.' },
      { step: '03', title: 'Connexion à votre site et à votre téléphone', desc: 'On branche l’assistant sur votre site web ou sur votre messagerie WhatsApp professionnelle.' },
      { step: '04', title: 'Mise en route sous surveillance', desc: 'Lancement avec vérification des premières conversations pour s’assurer d’un fonctionnement fluide à 100 %.' }
    ],
    includedMaintenance: 'Mise à jour régulière de vos tarifs et conditions, surveillance anti-erreur et assistance prioritaire 6 jours sur 7.',
    faq: [
      {
        q: 'L’assistant peut-il inventer des prix ou promettre n’importe quoi ?',
        a: 'Non. Nous intégrons un verrouillage strict de ses connaissances. Si un client pose une question qui sort de votre grille de tarifs ou de vos compétences, l’assistant lui propose poliment de vous transmettre ses coordonnées pour que vous le rappeliez directement.'
      },
      {
        q: 'L’outil respecte-t-il les lois européennes sur l’IA et la vie privée ?',
        a: 'Oui, scrupuleusement. Le client est clairement averti qu’il s’agit d’une assistance automatisée et aucune donnée n’est utilisée en dehors de votre entreprise.'
      },
      {
        q: 'Combien de temps faut-il pour qu’il soit opérationnel ?',
        a: 'La préparation, les tests de questions pièges et la mise en route prennent entre 15 et 20 jours ouvrés pour une solution livrée clés en main.'
      },
      {
        q: 'Puis-je couper l’assistant si je préfère ?',
        a: 'Oui, un simple bouton dans votre tableau de bord vous permet de mettre l’assistant en pause à tout moment pour repasser en formulaire classique.'
      }
    ]
  }
];

export const serviceGroups = {
  acquisition: ['M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M13'],
  visibilite: ['M16', 'M09', 'M10'],
  automatisation: ['M21', 'M22', 'M23'],
  outils: ['M01', 'M22', 'M23']
};

export function getServiceBySlug(slug) {
  return services.find(s => s.slug === slug);
}

export function getServiceById(id) {
  return services.find(s => s.id === id);
}
