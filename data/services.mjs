// Catalogue officiel exhaustif des 14 services Purity Agency
// Structure de référence pour les pages de détails, SEO local, Google Ads Quality Score et conversion Fitts.
// Conforme au registre BCE 1036.775.590, TVA 56bis CTVA, Peppol 2026, et specs métiers Wallonie (Chauffage, Horeca, Esthétique, Carrosserie).

export const services = [
  {
    id: 'M01',
    slug: 'diagnostic-digital',
    name: 'Diagnostic digital (15 min)',
    pillar: 'Pilier 04 · Diagnostic & Cadrage',
    kicker: '15 min en visio ou téléphone · 100 % gratuit · Sans engagement',
    headline: 'Identifiez en 15 minutes le point de friction précis qui bloque vos demandes clients en ligne en Wallonie.',
    summary: 'Avant d’investir le moindre euro dans un site web, des réseaux sociaux ou de la publicité, Amir Kebiyeb analyse votre présence actuelle en direct sur écran partagé et isole l’action la plus rentable pour votre activité.',
    price: 'Offert',
    priceSetup: '0 €',
    promoSetup: 'Offert',
    promoTag: 'Gratuit · sans engagement',
    monthlyPrice: null,
    monthlyNote: 'Aucun abonnement, aucun moyen de paiement requis.',
    delay: 'Créneau immédiat (15 min chrono)',
    targetAudience: 'Indépendants, artisans, gérants de PME en Wallonie (Charleroi, Namur, Mons, Liège, Nivelles, Brabant Wallon) qui hésitent sur la priorité digitale à enclencher ou dont le site actuel ne génère aucun appel.',
    utility: 'Éviter de gaspiller des milliers d’euros dans un outil, une publicité ou une refonte inutile. Vous obtenez un diagnostic technique et commercial honnête, sans jargon, directement avec Amir Kebiyeb.',
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
      { aspect: 'Approche commerciale', others: 'Tentative de vente d’un pack complet à 5 000 € dès la 5ème minute', purity: '100 % conseil neutre : si vous n’avez besoin de rien, on vous le dit' },
      { aspect: 'Interlocuteur', others: 'Commercial junior qui lit une grille de vente pré-écrite', purity: 'Échange direct avec Amir Kebiyeb, fondateur & ingénieur' },
      { aspect: 'Résultat délivré', others: 'Devis générique copier-coller sans analyse réelle', purity: 'Synthèse écrite sous 1h avec la priorité n°1 à débloquer' }
    ],
    deliverables: [
      {
        title: 'Audit en direct de votre visibilité locale en Wallonie',
        desc: 'Examen de votre positionnement sur Google Maps (Pack Local 3) face à vos concurrents directs dans votre commune (Charleroi, Namur, Mons, Liège, Nivelles).'
      },
      {
        title: 'Détection du goulot d\'étranglement mobile & PageSpeed',
        desc: 'Analyse des Core Web Vitals en conditions réelles 4G (temps de chargement > 2,5s, fuite de 60% des visiteurs, boutons au pouce non cliquables selon la loi de Fitts).'
      },
      {
        title: 'Vérification de délivrabilité e-mail & conformité légale',
        desc: 'Contrôle SPF, DKIM, DMARC de votre domaine pour s\'assurer que vos devis n\'atterrissent pas dans les spams, et vérification des mentions BCE / TVA art. 56bis.'
      },
      {
        title: 'Plan d\'action prioritaire chiffré sous 1 heure',
        desc: 'Compte-rendu écrit d\'une page envoyé par e-mail récapitulant la priorité n°1 à débloquer et l\'estimation budgétaire exacte, sans aucun engagement commercial.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Budget publicitaire brûlé à l\'aveugle',
        desc: 'Payer des annonces Google Ads ou Meta qui envoient des prospects sur une page lente ou confuse : jusqu\'à 500 € par mois gaspillés pour zéro appel.'
      },
      {
        title: 'Mois perdus dans l\'hésitation',
        desc: 'Reporter sa modernisation pendant que des concurrents locaux mieux structurés s\'installent dans l\'esprit de vos futurs clients et signent les chantiers rentables.'
      },
      {
        title: 'Devis envoyés qui dorment dans les spams',
        desc: 'Continuer à envoyer des devis sans configuration SPF/DKIM valide et croire que le client ne répond pas alors qu\'il n\'a jamais reçu le document.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Réservation en ligne', desc: 'Vous choisissez un créneau de 15 minutes dans l\'agenda officiel selon vos disponibilités.' },
      { step: '02', title: 'Pré-analyse technique', desc: 'Amir inspecte votre site et vos concurrents en amont pour maximiser l\'utilité de l\'échange.' },
      { step: '03', title: 'Diagnostic 15 min chrono', desc: 'Échange vidéo ou téléphonique sans détour, centré uniquement sur votre chiffre d\'affaires.' },
      { step: '04', title: 'Feuille de route claire', desc: 'Vous repartez avec la priorité exacte à appliquer, que vous travailliez avec nous ou en interne.' }
    ],
    includedMaintenance: 'Non applicable (service ponctuel 100 % offert).',
    faq: [
      {
        q: 'Est-ce vraiment 100 % gratuit sans aucun engagement ?',
        a: 'Oui. Le diagnostic de 15 minutes est totalement offert et ne demande aucune carte bancaire. Il nous permet de valider si nous pouvons réellement vous apporter du résultat avant de proposer quoi que ce soit.'
      },
      {
        q: 'De quoi ai-je besoin pour le rendez-vous ?',
        a: 'Simplement de l\'adresse de votre site web actuel (ou page Facebook / fiche Google s\'il existe) et de votre objectif principal (plus d\'appels locaux, vente en ligne, gain de temps).'
      },
      {
        q: 'Que se passe-t-il après l\'échange ?',
        a: 'Si une formule Purity correspond parfaitement à votre besoin, nous vous transmettons une proposition détaillée. Si votre présence actuelle est déjà satisfaisante ou qu\'une simple correction gratuite suffit, nous vous l\'indiquons en toute transparence.'
      },
      {
        q: 'Comment se déroule la visio ?',
        a: 'Par lien Google Meet accessible en un clic depuis votre ordinateur ou smartphone, sans aucun logiciel à installer, ou directement par appel téléphonique à votre convenance.'
      }
    ]
  },
  {
    id: 'M03',
    slug: 'page-essentielle',
    name: 'Page Essentielle (1 page)',
    pillar: 'Pilier 01 · Sites Web & Référencement',
    kicker: 'Lancement rapide · Conversion directe · Artisans & Indépendants',
    headline: 'Une page professionnelle ultra-rapide qui présente votre métier et déclenche des appels dès le premier écran.',
    summary: 'La solution taillée pour les indépendants et artisans solos (électriciens, plombiers, coaches, dépanneurs) qui ont une offre unique et veulent remplacer une page Facebook ou un vieux site obsolète par une vitrine rapide, crédible et contactable 24h/24.',
    price: '490 € + 79 €/mois',
    priceSetup: '490 €',
    promoSetup: '367 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '79 €/mois',
    monthlyNote: 'Hébergement haute vitesse, nom de domaine .be, certificat SSL, sauvegardes et modifications courantes incluses.',
    delay: '5 à 7 jours ouvrés',
    targetAudience: 'Électriciens, plombiers, consultants, coaches, photographes, réparateurs, dépanneurs et indépendants en Wallonie ayant une activité ciblée.',
    utility: 'Rassurer instantanément un prospect qui cherche votre métier dans votre commune et lui offrir un bouton d’appel direct et WhatsApp sans friction.',
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
      { aspect: 'Temps de chargement', others: '3 à 6 secondes (CMS lourd type Wix/WordPress avec plugins)', purity: 'Moins de 0,8 seconde (Code vanilla pur optimisé)' },
      { aspect: 'Ergonomie mobile', others: 'Textes minuscules et boutons d’appel difficiles à cliquer', purity: 'Conçu selon la loi de Fitts : bouton d’appel au pouce en 1 clic' },
      { aspect: 'Maintenance & Modifications', others: 'Facturées 80 € de l’heure pour changer un numéro', purity: 'Incluses dans le suivi mensuel sans surcoût' }
    ],
    deliverables: [
      {
        title: 'Architecture One-Page taillée pour la conversion',
        desc: 'Structure linéaire optimisée : Promesse forte au-dessus de la ligne de flottaison, preuves de réalisations, grille tarifaire indicative et formulaire direct.'
      },
      {
        title: 'Design éditorial Purity sur-mesure (Fond blanc #FFFFFF)',
        desc: 'Conception graphique haut de gamme : fond blanc épuré, typographie General Sans contrastée, micro-ombres soignées et mise en avant claire de vos réalisations. Zéro template générique.'
      },
      {
        title: 'Score Google PageSpeed 95+ sur smartphone',
        desc: 'Chargement instantané sans aucun CMS lourd (100 % Vanilla HTML5 / CSS3 / ES6+), garantissant un score vert Google et un taux de rebond minimal.'
      },
      {
        title: 'Barre d\'action tactile : Appel direct & WhatsApp au pouce',
        desc: 'Action bar ergonomique conçue selon la loi de Fitts pour déclencher un appel téléphonique ou un message WhatsApp en 1 seconde chrono depuis un smartphone.'
      },
      {
        title: 'Nom de domaine .be, Certificat SSL HTTPS & E-mail pro',
        desc: 'Configuration de votre adresse officielle de marque, certificat SSL Let\'s Encrypt et 1 boîte e-mail professionnelle personnalisée (SPF/DKIM/DMARC).'
      },
      {
        title: 'Conformité légale belge complète (BCE, TVA, RGPD)',
        desc: 'Mentions légales officielles (numéro d’entreprise BCE, régime TVA art. 56bis le cas échéant), politique de confidentialité conforme APD et zéro cookie intrusif.'
      }
    ],
    lossOfInaction: [
      {
        title: '70 % des prospects mobiles perdus dès 3 secondes',
        desc: 'Sur smartphone, un prospect sur deux quitte une page si elle met plus de 3 secondes à s\'afficher : chaque seconde de lenteur détruit vos demandes de chantiers.'
      },
      {
        title: 'Image d\'amateur qui tire vos devis vers le bas',
        desc: 'Présenter une adresse Gmail gratuite ou une simple page Facebook incite les prospects à négocier systématiquement vos prix à la baisse.'
      },
      {
        title: 'Zéro appel pendant que vous travaillez sur chantier',
        desc: 'Quand vous avez les mains prises, les prospects qui cherchent un artisan disponible appellent le premier confrère qui affiche un bouton d\'appel direct sur Google.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Cadrage de l\'offre (20 min)', desc: 'On valide vos prestations phares, votre zone d\'intervention en Wallonie et vos photos de chantiers.' },
      { step: '02', title: 'Rédaction commerciale & Conception visuelle', desc: 'Nous rédigeons les textes percutants et intégrons l\'interface épurée sans que vous n\'ayez à rédiger quoi que ce soit.' },
      { step: '03', title: 'Test réel sur votre smartphone', desc: 'Vous recevez un lien de prévisualisation privé pour tester la fluidité et le parcours d\'appel.' },
      { step: '04', title: 'Mise en ligne & Indexation Google', desc: 'Connexion de votre nom de domaine .be et soumission immédiate à Google Search Console.' }
    ],
    includedMaintenance: 'Hébergement sur serveur haute performance européen, renouvellement annuel du nom de domaine .be, surveillance de sécurité 24/7 et prise en charge rapide de vos modifications de textes/tarifs/horaires.',
    faq: [
      {
        q: 'Puis-je transformer ma page en site multi-pages plus tard ?',
        a: 'Absolument. L\'architecture est conçue de façon modulaire : nous pouvons ajouter des pages de services ou de réalisations quand votre volume d\'affaires grandit sans devoir tout recommencer.'
      },
      {
        q: 'Dois-je écrire les textes moi-même ?',
        a: 'Non. Nous rédigeons l’intégralité des textes commerciaux et optimisés SEO à partir de notre court entretien de cadrage.'
      },
      {
        q: 'Le site fonctionne-t-il sur tous les téléphones ?',
        a: 'Oui, le site est rigoureusement testé sur iPhone (Safari), Android (Chrome, Samsung Internet) et tablettes, avec une adaptation parfaite de chaque bouton.'
      },
      {
        q: 'Quelle est la durée d’engagement pour la maintenance ?',
        a: 'Engagement initial de 12 mois pour amortir les coûts de configuration technique, renouvelable ensuite au mois le mois avec résiliation sur simple e-mail.'
      }
    ]
  },
  {
    id: 'M04',
    slug: 'site-vitrine',
    name: 'Site Vitrine (5 pages)',
    pillar: 'Pilier 01 · Sites Web & Référencement',
    kicker: 'Le standard d\'autorité · Artisans confirmés & PME locales',
    headline: 'Le site vitrine complet pour asseoir votre autorité locale et convertir chaque recherche Google en demande de devis qualifiée.',
    summary: 'La solution la plus demandée : 5 pages complètes et structurées (Accueil d’autorité, Services détaillés, Réalisations avec comparateur avant/après, À Propos, Contact & Devis guidé) conçues pour dominer votre zone géographique en Wallonie.',
    price: '1 490 € + 79 €/mois',
    priceSetup: '1 490 €',
    promoSetup: '1 117 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '79 €/mois',
    monthlyNote: 'Hébergement infogéré, domaine .be, SSL, sauvegardes et modifications courantes incluses.',
    delay: '7 à 10 jours ouvrés',
    targetAudience: 'Entreprises de rénovation, chauffagistes, électriciens, plombiers, carrosseries, garages, cabinets médicaux, agences immobilières et PME régionales en Wallonie.',
    utility: 'Devenir le choix évident dans votre commune et filtrer les demandes pour ne recevoir que des chantiers rentables avec des clients qui ont le budget.',
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
      { aspect: 'Filtrage des curieux', others: 'Formulaire basique : vous perdez votre temps sur des devis sans budget', purity: 'Formulaire qualifié par critères et upload photo pour chiffrer avant déplacement' },
      { aspect: 'Preuve de savoir-faire', others: 'Photos compressées sans mise en valeur', purity: 'Comparateur interactif tactile Avant / Après' },
      { aspect: 'Référencement local', others: 'Site invisible dès qu’on dépasse le code postal', purity: 'Balises Schema.org ProfessionalService + maillage local' }
    ],
    deliverables: [
      {
        title: '5 pages complètes pensées pour convaincre',
        desc: 'Accueil d’autorité, Page Services avec fiches détaillées, Galerie de réalisations avant/après, Page Entreprise/Équipe et Contact avec devis guidé.'
      },
      {
        title: 'Formulaire de devis qualifié avec photos smartphone',
        desc: 'Module intelligent intégrant l\'upload direct de photos (ex: 4 photos dégâts + numéro de châssis pour carrosseries, photos chaudière actuelle + surface m² pour chauffagistes) pour chiffrer avant déplacement.'
      },
      {
        title: 'Filtre kilométrique d\'intervention (ex: 25 km)',
        desc: 'Système de filtrage géographique prévenant les déplacements non rentables sur l\'E42/E19 et concentrant votre temps sur vos chantiers prioritaires.'
      },
      {
        title: 'Curseur interactif tactile Avant / Après',
        desc: 'Composant tactile exclusif permettant au visiteur de glisser le curseur pour apprécier la perfection de vos finitions (rénovation, carrosserie, toiture, isolation).'
      },
      {
        title: 'Optimisation SEO Local Wallonie & Données Schema.org',
        desc: 'Balisage sémantique ProfessionalService et LocalBusiness avec coordonnées GPS exactes, méta-titres géolocalisés et maillage interne pour ranker sur vos communes clés.'
      },
      {
        title: 'Vitesse de pointe PageSpeed 95+ & 100% Propriété',
        desc: 'Code Vanilla pur garantissant une note de pertinence maximale sur Google Ads (Quality Score élevé = coût par clic réduit). Cession totale du code source et du domaine sans verrou propriétaire.'
      }
    ],
    lossOfInaction: [
      {
        title: '15 à 30 chantiers majeurs perdus chaque année',
        desc: 'Quand un propriétaire compare 3 devis pour une pompe à chaleur ou une toiture à 18 500 €, il choisit l\'artisan dont le site rassure immédiatement avec des preuves concrètes.'
      },
      {
        title: '2 heures perdues par jour sur des devis pour curieux',
        desc: 'Passer ses soirées à faire des estimations à l\'aveugle pour des gens qui n\'ont pas le budget, faute d\'avoir un formulaire qui pré-qualifie le projet en amont.'
      },
      {
        title: 'Dépendance dangereuse au bouche-à-oreille',
        desc: 'Le bouche-à-oreille est précieux mais imprévisible : un site vitrine optimisé assure un flux régulier de nouveaux clients solvables toute l’année.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Atelier de cadrage (30 min)', desc: 'Cartographie de vos chantiers types, tarifs indicatifs et profils de clients recherchés.' },
      { step: '02', title: 'Conception & Rédaction intégrale', desc: 'Création des 5 pages, rédaction commerciale soignée et mise en valeur de vos réalisations.' },
      { step: '03', title: 'Revue collaborative', desc: 'Vous testez la version interactive sur votre téléphone et nous ajustons chaque détail à votre goût.' },
      { step: '04', title: 'Mise en ligne & Remise des clés', desc: 'Bascule DNS du domaine, indexation Google et envoi de vos accès administrateur.' }
    ],
    includedMaintenance: 'Supervision serveur 24/7, mises à jour techniques préventives, sauvegardes quotidiennes chiffrées et intégration de vos nouveaux chantiers ou avis clients au fil de l’eau sur simple message.',
    faq: [
      {
        q: 'Suis-je propriétaire de mon site et de mon nom de domaine ?',
        a: 'Oui, à 100 %. Le code, les visuels, les textes et le nom de domaine sont votre entière propriété. Vous n’êtes jamais enfermé chez nous.'
      },
      {
        q: 'Combien de temps le projet va-t-il me prendre ?',
        a: 'Environ 45 minutes en tout : 30 minutes d\'atelier initial et 15 minutes pour valider la maquette finale. Nous nous chargeons de l’ensemble de la rédaction et de la technique.'
      },
      {
        q: 'Puis-je modifier mes textes ou photos moi-même ?',
        a: 'Oui, vous disposez d\'un accès simple. Mais le plus pratique pour vous reste de nous envoyer un e-mail ou WhatsApp : notre équipe applique vos changements sans surcoût dans le cadre du suivi.'
      },
      {
        q: 'Cette page est-elle prête pour des campagnes Google Ads ?',
        a: 'Parfaitement. Son score technique de vitesse élevé (95+), son message clair et son formulaire bien placé permettent d\'obtenir une note de pertinence maximale sur Google Ads, réduisant le coût par clic.'
      }
    ]
  },
  {
    id: 'M05',
    slug: 'site-complet',
    name: 'Site Complet (10+ pages)',
    pillar: 'Pilier 01 · Sites Web & Référencement',
    kicker: 'Grande envergure · Multi-métiers & Multi-villes en Wallonie',
    headline: 'La plateforme digitale exhaustive pour les PME multi-métiers qui veulent dominer plusieurs zones géographiques sur Google.',
    summary: 'Plus de 10 pages dédiées pour couvrir chacun de vos corps d’état ou villes d’intervention en Wallonie (Charleroi, Namur, Mons, Liège, Nivelles, Brabant Wallon) avec une architecture de silos sémantiques et des formulaires de qualification spécifiques.',
    price: '2 490 € + 149 €/mois',
    priceSetup: '2 490 €',
    promoSetup: '1 867 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '149 €/mois',
    monthlyNote: 'Maintenance avancée, monitoring temps réel, sauvegardes bi-quotidiennes et interventions prioritaires.',
    delay: '12 à 18 jours ouvrés',
    targetAudience: 'Entreprises générales de construction, bureaux d\'architecture, promoteurs immobiliers, réseaux de concessions et PME disposant de plusieurs équipes.',
    utility: 'Capter un volume important de recherches locales sur Google (ex: "rénovation toiture Charleroi", "isolation façade Namur") avec des pages ultra-ciblées qui convertissent.',
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
      { aspect: 'Couverture géographique', others: 'Une seule page vague qui n’apparaît que dans sa propre commune', purity: 'Silos géographiques dédiés pour ranker sur chaque ville ciblée' },
      { aspect: 'Gestion des demandes', others: 'Boîte de réception submergée de messages non triés', purity: 'Formulaires conditionnels par métier routant vers la bonne équipe' },
      { aspect: 'Support technique', others: 'Délai de réponse de 5 à 10 jours ouvrés', purity: 'Ligne directe et prise en charge garantie sous 24h ouvrées' }
    ],
    deliverables: [
      {
        title: 'Arborescence sur-mesure de 10 à 15 pages complètes',
        desc: 'Fiches métiers exhaustives, silos géographiques ciblés par ville/arrondissement, études de cas de chantiers d\'envergure et page carrières/recrutement.'
      },
      {
        title: 'Silos sémantiques SEO avancés pour requêtes à fort panier',
        desc: 'Maillage interne stratégique propulsant vos pages prioritaires en première page sur les recherches à haute valeur ajoutée ("rénovation toiture Hainaut", "pose pompe à chaleur Namur").'
      },
      {
        title: 'Formulaires dynamiques avec routage conditionnel par équipe',
        desc: 'Questionnaires qui adaptent leurs critères selon le corps d\'état choisi et transmettent le dossier pré-qualifié directement au bon conducteur de travaux.'
      },
      {
        title: 'Espace Recrutement & Valorisation des équipes (CP 124 / Bâtiment)',
        desc: 'Page carrières soignée pour attirer des ouvriers qualifiés et des chefs de chantier fiables qui refusent de postuler auprès d\'entreprises à l\'image vieillissante.'
      },
      {
        title: 'Tableau de bord statistique privé 100% conforme RGPD',
        desc: 'Mesure des visites réelles, des taux de contact et des provenances géographiques sans cookies intrusifs, hébergé sur infrastructure européenne souveraine.'
      },
      {
        title: 'Support technique prioritaire garanti sous 24h ouvrées',
        desc: 'Canal direct dédié avec Amir Kebiyeb et l\'équipe technique pour toute mise à jour urgente de vos chantiers ou plannings.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Marchés régionaux abandonnés aux leaders concurrents',
        desc: 'Un site limité à 3 pages ne peut pas rivaliser avec des entreprises qui se positionnent méthodiquement sur chaque commune de Wallonie.'
      },
      {
        title: 'Marges écrasées sur les contrats à 5 et 6 chiffres',
        desc: 'Les architectes, syndics et promoteurs exigent une présence digitale irréprochable avant de signer des devis d\'envergure.'
      },
      {
        title: 'Pénurie d\'ouvriers et techniciens qualifiés',
        desc: 'Dans un secteur sous tension, les meilleurs professionnels choisissent les entreprises dont la vitrine reflète la rigueur et la modernité.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Audit sémantique & arborescence', desc: 'Analyse des volumes de recherche réels en Wallonie et découpage des silos thématiques.' },
      { step: '02', title: 'Production des contenus & maquettes', desc: 'Rédaction experte de chaque fiche métier et validation de l\'expérience utilisateur.' },
      { step: '03', title: 'Développement & tests de charge', desc: 'Intégration responsive, validation du routage des formulaires et tracking analytique.' },
      { step: '04', title: 'Mise en ligne & indexation massive', desc: 'Déploiement sécurisé avec soumission complète du sitemap pour indexation rapide.' }
    ],
    includedMaintenance: 'Supervision proactive 24/7, audits de sécurité réguliers, sauvegardes chiffrées automatiques, support prioritaire sous 24h et 2h de modifications incluses chaque mois.',
    faq: [
      {
        q: 'Combien de pages exactes sont incluses ?',
        a: 'Jusqu\'à 15 pages complètes rédigées et intégrées sont incluses dans le forfait initial. Des pages supplémentaires peuvent être ajoutées au fil de votre développement.'
      },
      {
        q: 'Peut-on intégrer des plans ou catalogues PDF ?',
        a: 'Oui, nous pouvons intégrer des visionneuses de plans haute définition ou des téléchargements de fiches techniques protégés.'
      },
      {
        q: 'Comment s’organise le routage des formulaires ?',
        a: 'Chaque formulaire peut être envoyé vers une boîte e-mail différente selon le service choisi (ex: devis toiture vers le chef d\'équipe toiture).'
      },
      {
        q: 'Quelle est la fiscalité de cet investissement en Belgique ?',
        a: 'La création de site web et sa maintenance sont des charges d\'exploitation 100 % déductibles pour votre société ou entreprise individuelle.'
      }
    ]
  },
  {
    id: 'M06',
    slug: 'boutique-en-ligne',
    name: 'Boutique en ligne (E-commerce)',
    pillar: 'Pilier 01 · Sites Web & Référencement',
    kicker: 'Vente directe 24/7 · Bancontact & Payconiq · 0 % de commission',
    headline: 'Votre boutique e-commerce moderne, rapide et autonome pour vendre en Belgique et en Europe sans commissions excessives.',
    summary: 'Une boutique en ligne ultra-rapide connectée nativement aux moyens de paiement des consommateurs belges (Bancontact, Payconiq, Apple Pay, cartes bancaires), intégrant les modules métiers (Click & Collect, réservations anti-no-show pour Horeca, expéditions Bpost/Mondial Relay).',
    price: '3 990 € + 149 €/mois',
    priceSetup: '3 990 €',
    promoSetup: '2 992 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '149 €/mois',
    monthlyNote: 'Sécurité bancaire, monitoring des paiements, maintenance des passerelles et support technique.',
    delay: '15 à 25 jours ouvrés',
    targetAudience: 'Commerçants, artisans créateurs, producteurs locaux, restaurateurs (Horeca), marques de cosmétiques ou de mode, et distributeurs cherchant un canal de vente directe sans commissions de plateformes.',
    utility: 'Encaisser des commandes 7j/7 et 24h/24 avec un panier fluide en 3 clics, un suivi des stocks transparent et une expérience d\'achat haut de gamme qui fidélise.',
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
      { aspect: 'Commissions sur ventes', others: '15 % à 30 % prélevés par les plateformes (Takeaway, Deliveroo, Amazon)', purity: '0 % de commission Purity : vous gardez 100 % de votre marge brute' },
      { aspect: 'Paiements belges', others: 'Cartes de crédit uniquement (abandon massif en Belgique)', purity: 'Bancontact, Payconiq, Apple Pay et Cartes intégrés nativement' },
      { aspect: 'Tunnel d’achat', others: '5 étapes lentes demandant un compte obligatoire', purity: 'Checkout express en 1 écran avec achat invité' }
    ],
    deliverables: [
      {
        title: 'Catalogue e-commerce jusqu\'à 100 références',
        desc: 'Fiches produits détaillées avec variantes (tailles, finitions, poids), galeries photos zoomables, gestion d\'inventaire en temps réel et recommandations croisées.'
      },
      {
        title: 'Passerelle bancaire belge sécurisée (Mollie / Stripe)',
        desc: 'Intégration directe de Bancontact, Payconiq by Bancontact, Carte Bancaire, Apple Pay et Google Pay avec reversement direct sur votre compte bancaire belge.'
      },
      {
        title: 'Tunnel d\'achat One-Step anti-abandon sur mobile',
        desc: 'Validation de commande en une seule page claire, réduisant la friction et augmentant le taux de conversion d\'au moins +25 % par rapport aux CMS traditionnels.'
      },
      {
        title: 'Expéditions Bpost, Mondial Relay & Click and Collect en atelier',
        desc: 'Configuration des zones de livraison (Belgique, France, Luxembourg), points relais automatiques et option de retrait gratuit sur place.'
      },
      {
        title: 'Module Anti-No-Show ou Commande directe Horeca 0% commission',
        desc: 'Pour restaurants et commerces de bouche : prise de commande directe sans les 30% des plateformes (Deliveroo/Takeaway) et empreinte bancaire Bancontact pour garantir les réservations de groupe.'
      },
      {
        title: 'Facturation automatique conforme Peppol 2026 & TVA 6%/21%',
        desc: 'Génération instantanée de factures PDF légales avec distinction stricte des taux de TVA belges et formats exportables pour votre comptable.'
      }
    ],
    lossOfInaction: [
      {
        title: '30 % de marge nette cédée aux plateformes de livraison',
        desc: 'Laisser 1 500 € à 3 000 € par mois à des plateformes tierces au lieu de fidéliser votre propre clientèle sur votre domaine.'
      },
      {
        title: 'Ventes manquées en dehors des heures d\'ouverture',
        desc: '42 % des achats et commandes en ligne en Belgique s\'effectuent entre 20h et minuit : sans boutique web, ce chiffre d\'affaires s\'évapore chez vos concurrents.'
      },
      {
        title: 'Tables réservées et abandonnées sans compensation',
        desc: 'Subir 3 à 5 tables vides le vendredi soir à cause de no-shows non garantis par empreinte bancaire.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Structure catalogue & bancaire', desc: 'Paramétrage des catégories, connexion de votre compte bancaire et paramétrage des transporteurs.' },
      { step: '02', title: 'Design & intégration fiches', desc: 'Mise en scène visuelle de vos produits et optimisation de l\'affichage sur mobile.' },
      { step: '03', title: 'Simulations d\'achats réels', desc: 'Tests de transactions réelles à 1 € pour valider le bon fonctionnement de Bancontact et des alertes.' },
      { step: '04', title: 'Lancement & session de formation', desc: 'Ouverture officielle de la boutique et prise en main guidée pour traiter vos premières commandes.' }
    ],
    includedMaintenance: 'Maintenance continue des protocoles bancaires sécurisés SSL/TLS, sauvegardes journalières de la base clients et commandes, et support technique réactif.',
    faq: [
      {
        q: 'Prenez-vous une commission sur mon chiffre d\'affaires ?',
        a: 'Non, 0 % de commission. Vous ne payez que les frais de transaction bancaires classiques de la passerelle (ex: Mollie ou Stripe, environ 0,25 € par paiement Bancontact).'
      },
      {
        q: 'Est-il simple de mettre à jour mes stocks ?',
        a: 'Très simple : depuis votre smartphone ou ordinateur, vous modifiez une quantité ou désactivez un produit en 10 secondes.'
      },
      {
        q: 'Le système gère-t-il la TVA belge à 6 % et 21 % ?',
        a: 'Oui, les taux de TVA sont configurés précisément par produit (alimentation à 6 %, produits manufacturés à 21 %) pour une comptabilité sans erreur.'
      },
      {
        q: 'Puis-je proposer le retrait gratuit en magasin (Click & Collect) ?',
        a: 'Oui, le client peut choisir entre la livraison à domicile, le point relais ou le retrait gratuit dans votre atelier/boutique.'
      }
    ]
  },
  {
    id: 'M07',
    slug: 'refonte-modernisation',
    name: 'Refonte & modernisation de site web',
    pillar: 'Pilier 01 · Sites Web & Référencement',
    kicker: 'Zéro perte SEO · Éradication WordPress lent · Score PageSpeed 95+',
    headline: 'Transformez votre ancien site web lent et dépassé en une machine de conversion moderne, fluide et sécurisée.',
    summary: 'Votre site a plus de 3 ans, s\'affiche mal sur smartphone ou a été construit sur un WordPress truffé de plugins vulnérables ? Nous le reconstruisons de fond en comble en conservant rigoureusement votre historique d\'adresses et votre positionnement Google existant.',
    price: '890 à 2 490 € + 79 €/mois',
    priceSetup: 'dès 890 €',
    promoSetup: 'dès 667 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '79 €/mois',
    monthlyNote: 'Hébergement, maintenance technique et garantie stricte de zéro perte de trafic SEO.',
    delay: '7 à 14 jours ouvrés',
    targetAudience: 'Entreprises établies en Wallonie ayant déjà un site web qui ne génère plus de résultats, qui a été piraté, ou dont le design ne reflète plus la qualité réelle de leurs prestations.',
    utility: 'Diviser votre temps de chargement par 4, récupérer vos visiteurs mobiles perdus et doubler votre taux de conversion sans perdre un seul lien Google déjà acquis.',
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
      { aspect: 'Conservation du SEO', others: 'Liens cassés et chute de 50 % du trafic Google après la refonte', purity: 'Plan de redirections 301 chirurgical : 0 % de perte de positionnement' },
      { aspect: 'Technologie', others: 'Nouveau thème WordPress lourd qui ralentira dans 6 mois', purity: 'Code Vanilla pur pérenne garanti sans mises à jour destructrices' },
      { aspect: 'Sécurité', others: 'Risque permanent d’attaques sur les extensions', purity: 'Architecture statique inviolable sans base de données exposée' }
    ],
    deliverables: [
      {
        title: 'Audit préalable de l\'existant & crawl technique complet',
        desc: 'Cartographie de l\'ensemble de vos adresses indexées sur Google pour identifier les pages qui vous apportent déjà du trafic naturel.'
      },
      {
        title: 'Plan de redirections 301 chirurgical sans perte de trafic',
        desc: 'Garantie absolue de zéro perte de trafic : chaque ancienne adresse est redirigée de manière transparente vers sa nouvelle page équivalente.'
      },
      {
        title: 'Design éditorial Purity sur-mesure (Fond blanc #FFFFFF)',
        desc: 'Modernisation visuelle complète : fond blanc pur #FFFFFF, typographie General Sans contrastée, micro-ombres subtiles et valorisation de vos chantiers réels. 0% template.'
      },
      {
        title: 'Suppression des plugins lourds & migration Vanilla',
        desc: 'Élimination des dizaines d’extensions inutiles responsables des lenteurs et des failles de sécurité, pour un site qui démarre au quart de tour.'
      },
      {
        title: 'Nouveaux formulaires de contact qualifiés par critères',
        desc: 'Remplacement des formulaires basiques spammés par des formulaires modernes demandant les critères clés de vos clients.'
      },
      {
        title: 'Mise en conformité RGPD, BCE & Sécurité renforcée',
        desc: 'Nettoyage des scripts tiers non déclarés, mise aux normes APD belge et chiffrement HTTPS moderne avec en-têtes CSP stricts.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Pénalités progressives et invisibilité sur Google',
        desc: 'Depuis les mises à jour Core Web Vitals, Google relègue impitoyablement en deuxième page les sites lents dont le temps de chargement dépasse 3 secondes.'
      },
      {
        title: 'Risque critique de piratage et liste noire Google',
        desc: 'Les vieux CMS non maintenus subissent des attaques automatisées régulières : un site hacké affiche un avertissement rouge de sécurité qui fait fuir 100% des clients.'
      },
      {
        title: 'Taux de fuite mobile supérieur à 75 %',
        desc: 'Un site non adapté aux smartphones modernes perd les trois quarts des prospects qui tentent d\'appeler ou de consulter vos réalisations.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Audit d\'extraction de l\'existant', desc: 'Inventaire complet de vos pages actuelles, images de qualité et mots-clés qui vous rapportent des visites.' },
      { step: '02', title: 'Nouvelle architecture & design', desc: 'Création de l\'interface moderne en valorisant vos atouts réels et vos avis récents.' },
      { step: '03', title: 'Recettage & tableau de redirection 301', desc: 'Vérification méticuleuse que chaque ancien lien pointe vers la nouvelle page sans aucune erreur 404.' },
      { step: '04', title: 'Bascule transparente sans coupure', desc: 'Mise en production sans interruption de service pour vos clients et resoumission à Google.' }
    ],
    includedMaintenance: 'Hébergement infogéré, renouvellement du domaine, surveillance proactive contre les pannes et assistance pour actualiser vos contenus.',
    faq: [
      {
        q: 'Vais-je perdre mon positionnement actuel sur Google ?',
        a: 'Non. Nous appliquons un plan de redirections 301 strict URL par URL. Google comprend immédiatement que vos pages ont simplement été modernisées et préserve votre autorité.'
      },
      {
        q: 'Mon site sera-t-il indisponible pendant les travaux ?',
        a: 'Pas une seule seconde. Le nouveau site est développé sur un serveur de test privé. La bascule finale ne prend que quelques minutes sans aucune coupure pour vos visiteurs.'
      },
      {
        q: 'Que deviennent mes anciennes adresses e-mails ?',
        a: 'Vos boîtes de messagerie continuent de fonctionner exactement comme avant sans interruption. Nous pouvons également les moderniser si nécessaire.'
      },
      {
        q: 'Quel est le tarif exact pour mon site ?',
        a: 'Le tarif dépend du nombre de pages à migrer : 890 € pour une page unique ou petit site, jusqu’à 2 490 € pour les sites denses de plus de 10 pages. Le devis est fixe et sans surprise.'
      }
    ]
  },
  {
    id: 'M08',
    slug: 'google-business',
    name: 'Fiche Google Business & Maps',
    pillar: 'Pilier 01 · Sites Web & Référencement',
    kicker: 'Visibilité locale immédiate · Avis 5 étoiles · Appel en 1 clic',
    headline: 'Positionnez votre entreprise dans le top 3 de Google Maps sur votre commune et déclenchez des appels directs chaque jour.',
    summary: 'En Belgique, 65 % des recherches mobiles locales se concluent sans même visiter un site web, directement depuis le bloc Google Maps. Nous configurons, validons et optimisons votre fiche d\'établissement pour que votre entreprise apparaisse en tête dès qu\'un client cherche votre métier à proximité.',
    price: '290 €',
    priceSetup: '290 €',
    promoSetup: '217 €',
    promoTag: '-25 % 24h',
    monthlyPrice: null,
    monthlyNote: 'Paiement unique · aucun abonnement obligatoire.',
    delay: '3 à 5 jours ouvrés',
    targetAudience: 'Tous les indépendants, commerces physiques et artisans du bâtiment en Wallonie dont les clients se trouvent dans un rayon de 10 à 30 km.',
    utility: 'Capter les appels d’urgence et les demandes de devis immédiates des personnes qui recherchent votre métier dans votre commune sur Google et Google Maps.',
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
      { aspect: 'Validation & Paramétrage', others: 'Fiche non vérifiée ou bloquée en attente de code postal', purity: 'Validation officielle garantie avec Google sans blocage' },
      { aspect: 'Collecte d’avis', others: 'Aucune méthode : 3 avis anciens qui se battent en duel', purity: 'Kit QR Code imprimable + lien direct d’évaluation 5 étoiles' },
      { aspect: 'Catalogue produits/services', others: 'Description vide sans mots-clés ni tarifs', purity: 'Catalogue complet avec prestations, tarifs et photos valorisées' }
    ],
    deliverables: [
      {
        title: 'Revendication & validation officielle avec Google',
        desc: 'Prise en charge des démarches de validation (courrier, vidéo ou téléphone) auprès de Google pour obtenir le badge officiel vérifié sans blocage.'
      },
      {
        title: 'Optimisation des catégories d\'activité principale & secondaires',
        desc: 'Sélection précise des catégories officielles Google pour maximiser vos apparitions sur les requêtes à fort volume d\'appels.'
      },
      {
        title: 'Définition de votre zone d\'intervention en Wallonie',
        desc: 'Configuration exacte des communes et codes postaux desservis pour protéger votre adresse privée si vous travaillez à domicile tout en couvrant votre zone commerciale.'
      },
      {
        title: 'Catalogue complet de vos prestations & tarifs indicatifs',
        desc: 'Intégration de fiches produits/services soignées avec photos professionnelles et descriptions ciblées.'
      },
      {
        title: 'Kit d\'avis clients 5 étoiles & QR Code imprimable',
        desc: 'Création d\'un lien court direct pour vos clients et fourniture d\'un fichier QR Code haute résolution prêt à imprimer pour vos camionnettes, factures ou comptoirs.'
      },
      {
        title: 'Harmonisation de la cohérence NAP (Nom, Adresse, Téléphone)',
        desc: 'Alignement rigoureux de vos informations avec le registre BCE et les annuaires professionnels belges pour consolider votre autorité locale.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Invisibilité totale sur 65 % des recherches mobiles',
        desc: 'Ne pas figurer dans le Pack Local 3 de Google Maps, c\'est laisser l\'ensemble des appels téléphoniques directs d\'urgence aux concurrents voisins.'
      },
      {
        title: 'Avis négatifs sans réponse qui détruisent la réputation',
        desc: 'Une fiche non revendiquée où s\'accumulent des avis sans réponse professionnelle fait fuir les prospects avant même le premier contact.'
      },
      {
        title: 'Clients qui trouvent porte close ou mauvais numéro',
        desc: 'Des horaires obsolètes ou un numéro erroné provoquent l\'agacement immédiat des clients et des pertes directes de chiffre d\'affaires.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Audit d\'accès & historique', desc: 'Vérification de l\'état actuel de votre fiche (propriété, doublons éventuels, pénalités).' },
      { step: '02', title: 'Rédaction & enrichissement', desc: 'Rédaction optimisée SEO de votre description d\'entreprise et intégration de votre catalogue.' },
      { step: '03', title: 'Sélection des visuels & mise en scène', desc: 'Mise en ligne de vos photos de réalisations au format optimal exigé par l\'algorithme Maps.' },
      { step: '04', title: 'Livraison du kit d\'avis clients', desc: 'Envoi de votre lien direct et de votre QR Code personnalisé pour collecter vos 5 étoiles.' }
    ],
    includedMaintenance: 'Service ponctuel sans abonnement. En cas de besoin de suivi continu ou de gestion des avis, nous proposons notre module d\'accompagnement mensuel.',
    faq: [
      {
        q: 'Je travaille à mon domicile, mon adresse personnelle sera-t-elle visible ?',
        a: 'Non, rassurez-vous. Nous configurons votre profil en "zone desservie" : Google affiche la zone de vos interventions (ex: Hainaut ou Namur) sans jamais révéler votre adresse privée.'
      },
      {
        q: 'Combien de temps faut-il pour voir les résultats ?',
        a: 'Dès la validation de la fiche, votre fiche optimisée est active. La remontée dans le top 3 s\'opère généralement sous 2 à 4 semaines au fur et à mesure que vous collectez vos premiers avis grâce à notre kit.'
      },
      {
        q: 'J’ai déjà une fiche avec des avis, vais-je les garder ?',
        a: 'Oui, bien sûr. Nous ne supprimons rien : nous revendiquons et optimisons votre fiche existante pour conserver 100 % de vos avis et de votre ancienneté.'
      },
      {
        q: 'Comment fonctionne le QR Code pour les avis ?',
        a: 'Il vous suffit de le faire scanner par votre client satisfait sur son smartphone à la fin d’un chantier : la page d’évaluation Google s’ouvre directement avec 5 étoiles pré-sélectionnées.'
      }
    ]
  },
  {
    id: 'M09',
    slug: 'identite-visuelle-logo',
    name: 'Identité visuelle & Logo',
    pillar: 'Pilier 02 · Image de Marque & Studio',
    kicker: 'Image haut de gamme · Cession totale des droits · Tous supports',
    headline: 'Une identité de marque mémorable et professionnelle qui inspire une confiance immédiate et justifie vos tarifs.',
    summary: 'Fini les logos bricolés sur Canva ou les images pixélisées : nous créons une identité visuelle complète, vectorielle et intemporelle, spécialement pensée pour le monde réel (flocage de véhicules utilitaires, enseignes, vêtements de travail, devis et factures).',
    price: '690 €',
    priceSetup: '690 €',
    promoSetup: '517 €',
    promoTag: '-25 % 24h',
    monthlyPrice: null,
    monthlyNote: 'Paiement unique · cession totale des droits incluse.',
    delay: '7 à 10 jours ouvrés',
    targetAudience: 'Artisans du bâtiment, indépendants lançant leur activité, commerces locaux et entreprises souhaitant moderniser une image de marque devenue désuète.',
    utility: 'Inspirer instantanément le sérieux et le savoir-faire, éviter d\'être perçu comme un bricoleur du dimanche et permettre à vos devis d\'être acceptés plus facilement.',
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
      { aspect: 'Formats livrés', others: 'Un simple fichier JPEG pixélisé inexploitable pour l’impression', purity: 'Fichiers vectoriels professionnels (SVG, PDF, EPS) haute résolution' },
      { aspect: 'Propriété juridique', others: 'Droits d’auteur conservés par le graphiste avec royalties', purity: 'Cession totale et définitive des droits patrimoniaux par contrat' },
      { aspect: 'Adaptation chantier', others: 'Logo trop complexe illisible sur une camionnette en mouvement', purity: 'Conçu spécifiquement pour le flocage de véhicules et textiles' }
    ],
    deliverables: [
      {
        title: '3 pistes créatives uniques et argumentées',
        desc: 'Présentation de trois concepts graphiques distincts, pensés selon votre positionnement métier et déclinés sur des mises en situation concrètes.'
      },
      {
        title: 'Fichiers sources vectoriels HD (SVG, PDF vectoriel, EPS)',
        desc: 'Votre logo livré aux formats professionnels pour un agrandissement infini sans aucune pixellisation, indispensable pour les imprimeurs et enseignistes.'
      },
      {
        title: 'Packs web prêts à l\'emploi (WebP, PNG transparents, Favicon)',
        desc: 'Déclinaisons optimisées pour votre site web, vos profils réseaux sociaux, vos signatures d\'e-mails et vos documents comptables.'
      },
      {
        title: 'Guide de marque officiel (Brand Guide PDF)',
        desc: 'Document récapitulant les codes couleurs exacts (HEX, CMJN pour impression, Pantone, RVB), les typographies associées et les règles d\'espacement.'
      },
      {
        title: 'Gabarits prêts pour flocage de camionnette & textiles',
        desc: 'Fichiers aux cotes exactes pour que votre prestataire de lettrage ou de broderie puisse travailler directement sans frais techniques supplémentaires.'
      },
      {
        title: 'Cession totale et définitive des droits patrimoniaux',
        desc: 'Document juridique officiel vous transférant la pleine et entière propriété intellectuelle de votre logo sans limite de durée ni de territoire.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Négociations de prix permanentes par manque de crédibilité',
        desc: 'Une identité visuelle amateur pousse inconsciemment les prospects à penser que votre travail est bon marché et à marchander vos devis.'
      },
      {
        title: 'Frais de réimpression et de lettrage doublés',
        desc: 'Fournir à un enseigniste un fichier JPG basse définition entraîne des coûts de vectorisation manuelle facturés entre 150 € et 300 € par l\'imprimeur.'
      },
      {
        title: 'Marque oubliée aussitôt le chantier terminé',
        desc: 'Sans identité visuelle marquante, vos clients satisfaits peinent à se rappeler du nom de votre entreprise lorsqu\'un voisin leur demande une recommandation.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Entretien d\'inspiration (20 min)', desc: 'Échange sur vos préférences visuelles, vos valeurs, vos concurrents et les supports prioritaires.' },
      { step: '02', title: 'Présentation des 3 pistes', desc: 'Vous découvrez 3 directions graphiques argumentées et appliquées sur des maquettes réelles.' },
      { step: '03', title: 'Affinage de la piste retenue', desc: 'Ajustement précis des nuances de couleurs, des polices et des équilibres jusqu\'à totale satisfaction.' },
      { step: '04', title: 'Export & remise de l\'archive', desc: 'Envoi d\'un dossier complet classé contenant tous vos fichiers haute définition et la cession de droits.' }
    ],
    includedMaintenance: 'Non applicable (prestation de création définitive). Archivage garanti de vos fichiers sur nos serveurs en cas de perte.',
    faq: [
      {
        q: 'Combien d’allers-retours de modifications sont inclus ?',
        a: 'Nous incluons jusqu’à 3 phases d’ajustements sur la piste que vous aurez choisie pour parfaire chaque détail (couleurs, espacements, typographies).'
      },
      {
        q: 'Puis-je déposer ce logo comme marque à l’OBPI ?',
        a: 'Oui. Le logo créé est 100 % original et vous en recevez la pleine cession de droits, ce qui vous permet de le déposer officiellement auprès de l’Office Benelux de la Propriété Intellectuelle si vous le souhaitez.'
      },
      {
        q: 'Mon enseigniste ou imprimeur saura-t-il utiliser les fichiers ?',
        a: 'Absolument. Nous livrons exactement les fichiers sources vectoriels (PDF vectoriel et EPS) requis par tous les professionnels du lettrage et de l’imprimerie.'
      },
      {
        q: 'Que se passe-t-il si aucune des 3 pistes initiales ne me convient ?',
        a: 'Notre atelier initial permet de cerner vos goûts très précisément. Si besoin, nous analysons ce qui bloque et vous proposons une piste alternative sans surcoût.'
      }
    ]
  },
  {
    id: 'M10',
    slug: 'pack-visuels-reels',
    name: 'Pack Visuels & Reels Studio',
    pillar: 'Pilier 02 · Image de Marque & Studio',
    kicker: '4 Reels montés + 6 visuels · Captation de vos chantiers · 100 % clé en main',
    headline: 'Des vidéos courtes percutantes et des visuels soignés pour mettre en valeur votre savoir-faire artisanal sur Instagram et TikTok.',
    summary: 'Les photos de chantiers prises à la va-vite ne suffisent plus : nous prenons vos rushes bruts (ou nous vous guidons pour les capturer en 2 minutes avec votre smartphone) et les transformons en vidéos dynamiques avec sous-titres animés et visuels de haute qualité.',
    price: '390 €',
    priceSetup: '390 €',
    promoSetup: '292 €',
    promoTag: '-25 % 24h',
    monthlyPrice: null,
    monthlyNote: 'Paiement unique sans abonnement.',
    delay: '4 à 7 jours ouvrés',
    targetAudience: 'Artisans du bâtiment, restaurateurs, instituts de beauté, commerçants locaux et prestataires de services en Wallonie souhaitant dynamiser leurs réseaux sociaux sans y passer des heures.',
    utility: 'Obtenir un pack de contenus professionnels prêts à être publiés pour capter l’attention des clients locaux et alimenter vos réseaux pendant plusieurs semaines.',
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
      { aspect: 'Rendu vidéo', others: 'Vidéos bancales sans rythme ni texte, boudées par l’algorithme', purity: 'Montage dynamique au format 9:16 avec sous-titrage synchronisé' },
      { aspect: 'Gain de temps', others: '3 heures passées à galérer sur une application mobile pour 1 vidéo', purity: 'Vous envoyez vos vidéos brutes sur WhatsApp, on s’occupe de tout' },
      { aspect: 'Droits musicaux', others: 'Vidéos muettes ou supprimées pour violation de droits musicaux', purity: 'Musiques libres de droits commerciales ou sons tendances certifiés' }
    ],
    deliverables: [
      {
        title: '4 vidéos verticales Reels / TikToks (9:16) montées de A à Z',
        desc: 'Montage rythmé avec accroche visuelle forte dès la première seconde, transitions fluides et musique libre de droits adaptée à votre secteur.'
      },
      {
        title: 'Sous-titrage animé synchronisé au mot près',
        desc: '80 % des vidéos sur réseaux sociaux sont regardées sans le son : nous intégrons des sous-titres dynamiques pour garantir une compréhension immédiate.'
      },
      {
        title: '6 visuels carrousels ou posts carrés (1:1 & 4:5)',
        desc: 'Mises en page graphiques soignées présentant vos étapes de fabrication, avant/après de chantiers, astuces d\'experts ou témoignages clients.'
      },
      {
        title: 'Rédaction complète des légendes & hashtags locaux',
        desc: 'Textes engageants rédigés dans un ton direct avec appels à l\'action clairs et sélection de hashtags géolocalisés en Wallonie.'
      },
      {
        title: 'Miniatures de couverture personnalisées',
        desc: 'Visuels de couverture cohérents avec votre charte graphique pour que votre grille Instagram conserve une esthétique irréprochable.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Portée organique réduite à zéro sur simple photo',
        desc: 'Les algorithmes d\'Instagram, Facebook et TikTok ne diffusent quasiment plus les photos statiques non travaillées : seule la vidéo courte apporte de nouveaux abonnés locaux.'
      },
      {
        title: 'Des heures passées à galérer sur des logiciels de montage',
        desc: 'Tenter de monter soi-même une vidéo sur son smartphone le soir après une journée de travail physique prend 3 heures pour un résultat souvent décevant.'
      },
      {
        title: 'Image terne face aux créateurs et confrères plus jeunes',
        desc: 'Les nouvelles générations d\'artisans et commerçants captent les meilleurs chantiers en montrant les coulisses de leurs ateliers avec des vidéos captivantes.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Envoi de vos séquences brutes', desc: 'Vous nous transmettez vos vidéos et photos prises sur le chantier via un simple dossier partagé ou WhatsApp.' },
      { step: '02', title: 'Sélection des moments forts & montage', desc: 'Nous coupons les temps morts, calons le rythme sur la musique et ajoutons les sous-titres dynamiques.' },
      { step: '03', title: 'Validation des rendus', desc: 'Vous visionnez les vidéos sur votre smartphone et nous ajustons un texte ou une coupe si souhaité.' },
      { step: '04', title: 'Remise des fichiers prêts à publier', desc: 'Vous recevez les fichiers MP4 optimisés avec le texte et les hashtags prêts à être copiés-collés.' }
    ],
    includedMaintenance: 'Prestation ponctuelle livrée sous forme de pack de fichiers. Si vous préférez une diffusion automatique chaque semaine, découvrez notre offre M16.',
    faq: [
      {
        q: 'Dois-je avoir du matériel vidéo professionnel ?',
        a: 'Absolument pas ! Un smartphone récent (iPhone ou Android) suffit amplement. La qualité des caméras actuelles est largement suffisante : notre valeur ajoutée réside dans le tri, le rythme du montage et le sous-titrage.'
      },
      {
        q: 'Comment filmer mes chantiers sans perdre de temps ?',
        a: 'Nous vous envoyons une fiche mémo de 5 conseils très simples (ex: poser le téléphone sur un escabeau pendant que vous travaillez, filmer 10 secondes avant et 10 secondes après).'
      },
      {
        q: 'Puis-je utiliser ces vidéos sur mon site web ?',
        a: 'Oui, nous pouvons intégrer ces vidéos courtes en haute performance sur votre site vitrine ou vos pages de services.'
      },
      {
        q: 'Les musiques utilisées sont-elles autorisées pour les comptes professionnels ?',
        a: 'Oui, nous sélectionnons exclusivement des musiques sous licence commerciale libre de droits ou éligibles aux comptes pro pour éviter tout blocage.'
      }
    ]
  },
  {
    id: 'M13',
    slug: 'referencement-local-seo',
    name: 'Référencement local (SEO)',
    pillar: 'Pilier 01 · Sites Web & Référencement',
    kicker: 'Présence durable · Mots-clés métiers · Première page Google en Wallonie',
    headline: 'Positionnez votre site web en tête des recherches Google sur vos prestations les plus rentables dans votre région.',
    summary: 'Une stratégie de référencement naturel méthodique et continue pour capter les prospects qui tapent des requêtes d\'achat précises (ex: "installation pompe à chaleur Charleroi", "carrossier agréé Namur", "rénovation toiture Mons") sans dépendre de budgets publicitaires éphémères.',
    price: '590 € + 149 €/mois',
    priceSetup: '590 €',
    promoSetup: '442 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '149 €/mois',
    monthlyNote: 'Audit continu, production de contenus mensuelle, netlinking local et reporting transparent.',
    delay: 'Mise en place : 10 jours ouvrés',
    targetAudience: 'Entreprises établies cherchant à réduire leur dépendance aux publicités payantes et souhaitant asseoir une position de leader incontournable dans leur zone d\'intervention en Wallonie.',
    utility: 'Générer un flux automatique de nouveaux prospects chaque semaine sans payer chaque clic, en étant le premier résultat affiché quand un client local a un besoin concret.',
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
      { aspect: 'Rentabilité à long terme', others: 'Google Ads : dès qu’on coupe le budget, les appels s’arrêtent net', purity: 'SEO : chaque position acquise reste un actif patrimonial qui rapporte des années' },
      { aspect: 'Transparence du travail', others: 'Rapport automatique incompréhensible de 40 pages de charabia', purity: 'Bilan mensuel vidéo d’une page avec les positions réelles et les appels générés' },
      { aspect: 'Pratiques appliquées', others: 'Achat de liens douteux risquant une pénalité Google', purity: 'Optimisations sémantiques 100 % conformes aux consignes Google pour les webmasters' }
    ],
    deliverables: [
      {
        title: 'Audit sémantique & sélection de 20 mots-clés prioritaires',
        desc: 'Identification des requêtes réellement tapées par vos prospects en Wallonie avec analyse des volumes de recherche et du niveau de concurrence locale.'
      },
      {
        title: 'Optimisation technique on-page continue',
        desc: 'Structuration des balises Hn, méta-titres, méta-descriptions, compression d\'images WebP et balisage Schema.org LocalBusiness maintenu à jour.'
      },
      {
        title: 'Création mensuelle de pages et articles à haute intention d\'achat',
        desc: 'Rédaction d\'articles experts et de pages locales répondant aux questions concrètes de vos clients (tarifs moyens, primes régionales wallonnes, étapes de chantier).'
      },
      {
        title: 'Stratégie de citations locales & netlinking belge',
        desc: 'Inscription et renforcement de vos signaux de confiance dans les annuaires professionnels belges reconnus et sites partenaires locaux.'
      },
      {
        title: 'Rapport mensuel de visibilité transparent',
        desc: 'Bilan clair sans jargon technique présentant l\'évolution de vos positions Google, le nombre d\'appels téléphoniques générés et le trafic naturel acquis.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Des milliers d\'euros brûlés en publicité continue',
        desc: 'Dès que vous coupez votre budget Google Ads, votre visibilité retombe à zéro : le SEO construit un actif patrimonial qui génère des contacts sans payer chaque clic.'
      },
      {
        title: 'Prise de monopole durable par vos concurrents',
        desc: 'Rattraper un concurrent installé depuis 2 ans en première page de Google demande deux fois plus de temps et d\'efforts que de prendre la place maintenant.'
      },
      {
        title: 'Trafic non qualifié ou hors secteur géographique',
        desc: 'Recevoir des demandes inexploitables venant de Bruxelles ou de France parce que votre référencement n\'est pas rigoureusement borné à votre rayon d\'action réel.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Audit sémantique initial', desc: 'Cartographie des mots-clés stratégiques et analyse des failles de vos concurrents directs.' },
      { step: '02', title: 'Optimisation technique du site', desc: 'Correction des facteurs bloquants (vitesse, balises, maillage interne, données structurées).' },
      { step: '03', title: 'Production de contenus experts', desc: 'Rédaction et mise en ligne de nouveaux contenus ciblant des intentions de recherche locales.' },
      { step: '04', title: 'Suivi des positions & ajustements', desc: 'Mesure mensuelle des gains de trafic et réorientation sur les requêtes les plus rentables.' }
    ],
    includedMaintenance: 'Surveillance hebdomadaire des erreurs d\'indexation sur Google Search Console, ajustement des balises en cas d\'évolution des algorithmes et support direct.',
    faq: [
      {
        q: 'Au bout de combien de temps voit-on les premiers résultats en SEO ?',
        a: 'En référencement local, les premiers gains de positions sont généralement mesurables entre 6 et 12 semaines. Le SEO est un marathon qui consolide durablement votre chiffre d’affaires.'
      },
      {
        q: 'Garantissez-vous la 1ère place sur Google ?',
        a: 'Aucune agence honnête ne peut promettre contractuellement la 1ère place absolue, car l’algorithme appartient à Google. En revanche, nous garantissons l’application rigoureuse des meilleures méthodes techniques et sémantiques qui ont déjà propulsé nos clients en première page.'
      },
      {
        q: 'Puis-je arrêter le suivi SEO quand je veux ?',
        a: 'Nous recommandons un cycle initial de 6 mois pour laisser le temps aux algorithmes d’asseoir vos positions. Ensuite, le contrat est renouvelable au mois le mois avec résiliation sur simple e-mail.'
      },
      {
        q: 'Dois-je fournir les textes des articles SEO ?',
        a: 'Non, notre pôle éditorial rédige l’intégralité des contenus après validation de vos thématiques clés avec vous.'
      }
    ]
  },
  {
    id: 'M16',
    slug: 'gestion-reseaux-sociaux',
    name: 'Réseaux sociaux (3x/semaine)',
    pillar: 'Pilier 02 · Image de Marque & Studio',
    kicker: '12 posts/mois + 4 Reels · 1er mois offert · Gestion 100 % déléguée',
    headline: 'Une présence active, régulière et professionnelle sur vos réseaux sociaux sans y consacrer la moindre minute de votre temps libre.',
    summary: 'Vous n\'avez ni le temps ni l\'envie de passer vos soirées à chercher quoi publier sur Instagram et Facebook ? Nous prenons en charge l\'intégralité de votre communication : planning éditorial, rédaction, création graphique, montage vidéo et programmation automatique.',
    price: '290 € + 349 €/mois',
    priceSetup: '290 €',
    promoSetup: '217 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '349 €/mois',
    monthlyNote: 'Création continue, 12 publications/mois, 4 Reels/mois et modération.',
    delay: 'Lancement sous 5 jours ouvrés',
    targetAudience: 'Dirigeants d\'entreprises, artisans, commerçants et restaurateurs en Wallonie qui savent que les réseaux sociaux sont indispensables pour rassurer leurs clients mais qui n\'ont pas le temps de s\'en occuper.',
    utility: 'Garantir une vitrine sociale active et irréprochable qui transforme les visiteurs curieux en clients réguliers, sans que vous n\'ayez à toucher à votre smartphone le soir.',
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
      { aspect: 'Régularité garantie', others: '3 posts en une semaine puis le silence radio pendant 4 mois', purity: '3 publications soignées par semaine, chaque semaine, sans interruption' },
      { aspect: 'Formats variés', others: 'Photos brutes sans texte ni mise en valeur', purity: 'Mélange équilibré de carrousels éducatifs, photos de chantiers et Reels vidéo' },
      { aspect: 'Offre découverte', others: 'Engagement immédiat de 12 mois sans garantie de qualité', purity: '1er mois d\'abonnement 100 % offert : vous ne payez que le cadrage initial' }
    ],
    deliverables: [
      {
        title: '12 publications professionnelles par mois (3 posts par semaine)',
        desc: 'Contenus réguliers alternant réalisations concrètes, coulisses d\'atelier, avis clients et focus sur vos prestations phares.'
      },
      {
        title: '4 vidéos Reels / TikToks montées par mois',
        desc: 'Format vertical avec accroches percutantes et sous-titres animés pour toucher de nouveaux prospects locaux hors de votre cercle d\'abonnés.'
      },
      {
        title: 'Rédaction intégrale des textes commerciaux & appels à l\'action',
        desc: 'Chaque publication est accompagnée d\'un texte clair, poli, sans jargon, invitant à demander un devis ou à visiter votre site web.'
      },
      {
        title: 'Planning éditorial mensuel partagé à l\'avance',
        desc: 'Vous validez les publications du mois suivant en 10 minutes grâce à un calendrier visuel accessible sur votre smartphone.'
      },
      {
        title: 'Programmation automatique aux heures de forte écoute',
        desc: 'Vos contenus sont diffusés au moment où vos clients cibles sont les plus actifs (pauses déjeuner, fins de journée, week-ends).'
      },
      {
        title: 'Offre promotionnelle : 1er mois d\'abonnement offert',
        desc: 'Vous ne réglez que les frais de cadrage initial (setup remisé à -25%). Le premier mois complet de gestion est 100 % offert pour tester l\'impact sans risque.'
      }
    ],
    lossOfInaction: [
      {
        title: 'L\'effet destructeur de "l\'entreprise fantôme"',
        desc: 'Un prospect qui découvre votre page Facebook avec un dernier post datant de 8 mois pense immédiatement que vous avez cessé votre activité ou manquez de sérieux.'
      },
      {
        title: 'Des week-ends gâchés à stresser sur quoi publier',
        desc: 'Passer son dimanche soir à tenter d\'écrire un post sans inspiration au lieu de se reposer avant la semaine de chantiers.'
      },
      {
        title: 'Zéro bouche-à-oreille numérique spontané',
        desc: 'Ne pas être présent dans le flux quotidien de vos clients passés les empêche de penser à vous quand un ami leur demande : "Tu connais un bon artisan ?".'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Atelier de ligne éditoriale (30 min)', desc: 'Définition de votre ton de voix, vos thématiques clés et votre charte visuelle.' },
      { step: '02', title: 'Création du calendrier mensuel', desc: 'Rédaction et mise en page des 12 publications et des 4 Reels du mois.' },
      { step: '03', title: 'Validation en 1 clic', desc: 'Vous validez le planning depuis votre smartphone ou nous demandez des ajustements.' },
      { step: '04', title: 'Diffusion & veille continue', desc: 'Nous programmons l\'ensemble des posts et surveillons les alertes sur vos comptes.' }
    ],
    includedMaintenance: 'Gestion des programmations, assistance réactive en cas de besoin de publication d\'urgence (ex: fermeture exceptionnelle ou congés) et veille technique.',
    faq: [
      {
        q: 'Dois-je vous fournir du contenu chaque semaine ?',
        a: 'Non, un simple dossier partagé ou une conversation WhatsApp dédiée où vous déposez vos photos de chantiers au fil de l’eau suffit. Nous nous chargeons de les trier, retoucher et scénariser.'
      },
      {
        q: 'Comment s\'applique le 1er mois offert ?',
        a: 'Vous ne réglez que les frais de cadrage initial (setup avec remise -25%). Le premier mois d\'abonnement mensuel de 349 € est 100 % gratuit.'
      },
      {
        q: 'Puis-je continuer à poster moi-même de temps en temps ?',
        a: 'Absolument ! Notre formule assure votre socle professionnel régulier, et vous restez totalement libre de poster des stories spontanées quand vous le souhaitez.'
      },
      {
        q: 'Sur quels réseaux publiez-vous ?',
        a: 'Principalement Instagram et Facebook pour le grand public, ou LinkedIn pour les prestataires de services B2B.'
      }
    ]
  },
  {
    id: 'M21',
    slug: 'pilote-automatique-essentiel',
    name: 'Pilote Automatique Essentiel',
    pillar: 'Pilier 03 · Automatisation & Agents IA',
    kicker: '1 flux chirurgical · Gain de 5h/semaine · Fin des no-shows & oublis',
    headline: 'Automatisez la tâche répétitive qui vous fait perdre le plus de temps chaque semaine et éliminez les rendez-vous manqués.',
    summary: 'Mise en place clé en main d\'une automatisation robuste au choix : prise de rendez-vous en ligne avec rappel SMS automatique anti-no-show, relance courtoise des devis en attente à J+3 et J+7, ou qualification de chantiers avec photos et notification SMS instantanée.',
    price: '490 € + 39 €/mois',
    priceSetup: '490 €',
    promoSetup: '367 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '39 €/mois',
    monthlyNote: 'Maintenance des webhooks, surveillance des erreurs et exécution garantie.',
    delay: '5 à 7 jours ouvrés',
    targetAudience: 'Indépendants et artisans en Wallonie qui passent leurs soirées à répondre à des e-mails, relancer des devis non signés ou fixer des rendez-vous par SMS.',
    utility: 'Récupérer immédiatement entre 3 et 6 heures de temps libre chaque semaine et répondre aux demandes 10 fois plus vite que vos concurrents.',
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
      { aspect: 'Temps de réponse', others: 'Réponse le lendemain soir après le chantier (le client a déjà signé ailleurs)', purity: 'Notification et confirmation envoyée en 30 secondes chrono' },
      { aspect: 'Oublis de relances', others: 'Devis oubliés dans un carnet', purity: 'Relances programmées avec tact à J+3 et J+7 sans effort' },
      { aspect: 'Fiabilité technique', others: 'Bricolage maison qui plante à la première mise à jour', purity: 'Flux monitoré sur serveur dédié avec alertes d’erreur automatiques' }
    ],
    deliverables: [
      {
        title: 'Cadrage précis d\'un flux automatisé unique à fort impact',
        desc: 'Sélection de votre priorité n°1 : Prise de RDV en ligne synchronisée avec agenda + rappel SMS anti-no-show 24h avant, Relance automatique des devis en attente, ou Alerte SMS immédiate sur devis urgent.'
      },
      {
        title: 'Infrastructure d\'automatisation robuste (Make / n8n)',
        desc: 'Connexion sécurisée de vos outils du quotidien sans code fragile, gestion des cas d\'erreur et alertes automatiques en cas de dysfonctionnement.'
      },
      {
        title: 'Modèles de messages personnalisés dans votre ton naturel',
        desc: 'Rédaction soignée des messages automatiques (SMS et e-mails) donnant l\'impression exacte que vous avez rédigé le texte vous-même.'
      },
      {
        title: 'Tests intensifs sur tous les cas limites',
        desc: 'Simulation de doublons, annulations de dernière minute, jours fériés et horaires non ouvrés pour garantir une fiabilité à 100%.'
      },
      {
        title: 'Fiche mémo de pilotage simplifiée d\'une page',
        desc: 'Guide clair pour mettre en pause le système pendant vos vacances ou modifier un texte en 30 secondes en totale autonomie.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Devis oubliés sans relance qui partent chez la concurrence',
        desc: '40 % des devis qui ne sont pas relancés dans les 48h finissent par être signés chez le concurrent qui a simplement rappelé le premier.'
      },
      {
        title: '5 à 8 heures de paperasse inutile par semaine',
        desc: 'Ressaisir manuellement des coordonnées et taper les mêmes messages types le soir au lieu de profiter de ses proches.'
      },
      {
        title: 'Rendez-vous manqués (No-shows) sans dédommagement',
        desc: 'En l\'absence de rappel automatique par SMS 24h avant, 1 client sur 5 oublie son créneau et vous fait perdre un déplacement ou une heure en atelier.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Choix du goulot d\'étranglement', desc: 'On identifie ensemble la tâche la plus chronophage à éliminer immédiatement.' },
      { step: '02', title: 'Connexion de vos outils', desc: 'On relie votre boîte e-mail, votre agenda Google/Outlook ou votre formulaire.' },
      { step: '03', title: 'Paramétrage des règles métier', desc: 'Nous configurons les délais, les modèles de texte et les conditions d\'envoi.' },
      { step: '04', title: 'Mise en route & sérénité', desc: 'Le flux tourne en continu en arrière-plan sans que vous n\'ayez plus à y penser.' }
    ],
    includedMaintenance: 'Supervision technique permanente, renouvellement des jetons de connexion API, résolution sous 24h en cas de mise à jour d\'un outil tiers.',
    faq: [
      {
        q: 'Mes clients vont-ils se rendre compte que c\'est un robot ?',
        a: 'Non. Nous rédigeons les messages dans votre style naturel et chaleureux. Les e-mails partent depuis votre propre adresse professionnelle.'
      },
      {
        q: 'Puis-je modifier le texte des e-mails automatiques ?',
        a: 'Tout à fait. Nous vous montrons comment adapter un mot ou une phrase en toute simplicité, ou nous le faisons pour vous sur simple demande.'
      },
      {
        q: 'Que se passe-t-il si un client répond à l\'e-mail automatique ?',
        a: 'La réponse arrive directement dans votre boîte de réception classique, vous reprenez la main comme d\'habitude.'
      },
      {
        q: 'Mes données clients sont-elles protégées ?',
        a: 'Oui, nous respectons strictement le RGPD. Toutes les automatisations transitent par des serveurs européens sécurisés.'
      }
    ]
  },
  {
    id: 'M22',
    slug: 'pilote-automatique-business',
    name: 'Pilote Automatique Business',
    pillar: 'Pilier 03 · Automatisation & Agents IA',
    kicker: 'Écosystème multi-outils · Devis, CRM & Facturation Peppol · 0 double saisie',
    headline: 'Reliez votre site web, votre agenda, vos fiches chantiers et votre facturation dans un flux automatisé sans couture.',
    summary: 'Éliminez définitivement les post-its, les notes éparpillées et les doubles saisies : nous connectons vos formulaires web, votre messagerie, votre agenda d\'équipe et votre outil de facturation pour que chaque nouveau contact crée son dossier complet en quelques secondes.',
    price: '990 € + 69 €/mois',
    priceSetup: '990 €',
    promoSetup: '742 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '69 €/mois',
    monthlyNote: 'Monitoring des flux, maintenance multi-connecteurs et évolutions mineures.',
    delay: '10 à 14 jours ouvrés',
    targetAudience: 'PME, cabinets comptables, entreprises du bâtiment avec plusieurs équipes et sociétés recevant plus de 10 demandes par semaine en Wallonie.',
    utility: 'Structurer votre entreprise comme une machine bien huilée : chaque demande web crée automatiquement la fiche client, le dossier dans votre CRM et génère l\'ébauche de devis.',
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
      { aspect: 'Centralisation', others: 'Fichiers Excel perdus, post-its et doubles saisies manuelles', purity: 'Tableau de bord unique synchronisé en temps réel sur mobile et PC' },
      { aspect: 'Coordination d’équipe', others: 'Messages WhatsApp perdus dans le fil de discussion', purity: 'Alertes automatiques assignées au bon collaborateur dès validation' },
      { aspect: 'Relance des impayés', others: 'Rappels manuels quand la trésorerie est dans le rouge', purity: 'Relances courtoises automatiques avant et après échéance' }
    ],
    deliverables: [
      {
        title: 'Cartographie complète de vos flux opérationnels',
        desc: 'Schéma visuel précis de circulation des informations entre votre formulaire web, votre boîte e-mail, votre calendrier d\'équipe et votre logiciel de devis/facturation.'
      },
      {
        title: 'Mise en place de 3 à 5 automatisations interconnectées',
        desc: 'Création automatique de la fiche client, génération du dossier chantier, notification des techniciens sur smartphone avec lien GPS et relance automatique avant échéance de facture.'
      },
      {
        title: 'Centralisation dans un tableau de bord unique (Airtable / Notion / CRM)',
        desc: 'Base de données claire et partagée permettant à l\'atelier et au bureau de voir en temps réel l\'état exact de chaque devis et intervention.'
      },
      {
        title: 'Pré-facturation & conformité Peppol 2026',
        desc: 'Liaison avec vos logiciels de facturation pour générer automatiquement les acomptes et exporter les pièces conformes au standard belge Peppol sans ressaisir l\'adresse ni le numéro BCE.'
      },
      {
        title: 'Notifications d\'urgence d\'équipe avec bouton d\'action',
        desc: 'Alerte instantanée sur WhatsApp ou SMS transmise au bon collaborateur dès qu\'une intervention prioritaire est validée par un client.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Erreurs de transmission coûteuses entre bureau et terrain',
        desc: 'Mauvaises adresses notées à la hâte, pièces oubliées et clients mécontents qui attendent un technicien envoyé au mauvais endroit.'
      },
      {
        title: 'Factures impayées et retards de trésorerie accumulés',
        desc: 'Jusqu\'à 15 % de retards de paiement supplémentaires faute d\'un rappel automatique courtois envoyé 3 jours avant et 3 jours après l\'échéance.'
      },
      {
        title: 'Goulot d\'étranglement permanent sur le dirigeant',
        desc: 'Passer 15 heures par semaine à faire le standardiste et le coordinateur administratif au lieu de chiffrer des projets rentables.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Audit de vos outils existants', desc: 'Analyse des logiciels que vous utilisez déjà (nous ne vous forçons pas à changer d\'outils si vos logiciels actuels conviennent).' },
      { step: '02', title: 'Conception des connecteurs', desc: 'Programmation des passerelles API et configuration des règles de validation des données.' },
      { step: '03', title: 'Période de rodage en parallèle', desc: 'Test sur les vraies demandes avec double contrôle pour valider l\'exactitude des transmissions.' },
      { step: '04', title: 'Basculement & prise en main équipe', desc: 'Formation courte de vos équipes pour utiliser le tableau de suivi sans aucune complication technique.' }
    ],
    includedMaintenance: 'Surveillance proactive des connecteurs API, ajustement des champs lors des évolutions de vos formulaires et assistance technique continue.',
    faq: [
      {
        q: 'Dois-je acheter des logiciels très chers ?',
        a: 'Non, nous privilégions des outils modernes très économiques, voire gratuits selon votre volume d\'activité (ex: Google Workspace, Make, Notion, Airtable).'
      },
      {
        q: 'Est-ce compatible avec mon logiciel métier spécifique ?',
        a: 'Dès lors que votre logiciel dispose d\'une API ou permet l\'envoi de notifications e-mails normalisées, nous pouvons l\'interconnecter.'
      },
      {
        q: 'Mes données clients sont-elles protégées ?',
        a: 'Oui, nous respectons strictement le RGPD. Toutes les données transitent par des flux chiffrés sans hébergement chez des tiers non conformes.'
      },
      {
        q: 'Que se passe-t-il si un collaborateur n’est pas à l’aise avec l’informatique ?',
        a: 'Nous simplifions l’interface à l’extrême : vos techniciens reçoivent un message clair sur leur téléphone avec l’adresse et le bouton GPS en 1 clic.'
      }
    ]
  },
  {
    id: 'M23',
    slug: 'pilote-automatique-integral',
    name: 'Pilote Automatique Intégral',
    pillar: 'Pilier 03 · Automatisation & Agents IA',
    kicker: 'Agent IA métier sur-mesure · 24/7 Web & WhatsApp · Zéro hallucination',
    headline: 'Un système autonome sur-mesure avec agent IA pour qualifier vos prospects, filtrer les demandes et gérer vos opérations 24h/24.',
    summary: 'La solution la plus aboutie : nous déployons un agent IA sur mesure (comme OctoMask sur notre site), entraîné exclusivement sur votre catalogue, vos tarifs, vos zones d\'intervention et vos règles métier, doté de garde-fous stricts sans aucune hallucination, pour ne transmettre au dirigeant que des dossiers qualifiés prêts à signer.',
    price: '1 990 € + 119 €/mois',
    priceSetup: '1 990 €',
    promoSetup: '1 492 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '119 €/mois',
    monthlyNote: 'Maintenance de l\'IA, mise à jour des connaissances métier et optimisation continue.',
    delay: '15 à 20 jours ouvrés',
    targetAudience: 'Entreprises en forte croissance, sociétés de services avec fort volume de sollicitations, et dirigeants souhaitant déléguer le premier niveau de relation client à une IA sur-mesure en Wallonie.',
    utility: 'Traiter les questions clients instantanément à 23h le dimanche, qualifier précisément le budget et l\'urgence, et ne transmettre au patron que les dossiers chauds et prêts à signer.',
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
      { aspect: 'Intelligence & Précision', others: 'Vieux chatbot rigide qui répète "Je n’ai pas compris"', purity: 'Agent IA moderne entraîné sur votre vrai catalogue avec garde-fous stricts' },
      { aspect: 'Gestion des prix', others: 'L’IA hallucine des remises ou invente des tarifs faux', purity: 'Zero-hallucination guard : l’IA ne dévie jamais de votre grille officielle' },
      { aspect: 'Conformité européenne', others: 'Données envoyées sur des serveurs non conformes', purity: '100 % conforme RGPD et AI Act européen avec mention claire de transparence' }
    ],
    deliverables: [
      {
        title: 'Agent IA personnalisé avec garde-fous déterministes (Zero-Hallucination)',
        desc: 'Modèle de langage paramétré avec des règles strictes garantissant qu\'il ne promet jamais de prix hors catalogue, n\'accorde aucune remise non autorisée et respecte votre déontologie.'
      },
      {
        title: 'Déploiement multi-canaux (Site web, WhatsApp Business, E-mail)',
        desc: 'Votre assistant IA répond avec politesse, rapidité et précision aux questions de vos prospects 24h/24 et 7j/7, y compris les soirs et week-ends.'
      },
      {
        title: 'Qualification intelligente des demandes & scoring de rentabilité',
        desc: 'L\'agent demande les informations clés (type de chantier, surface, commune, photos dégâts/équipements), vérifie si le projet entre dans votre rayon d\'action et calcule un score de priorité.'
      },
      {
        title: 'Orchestration complète avec planning & dossiers pré-remplis',
        desc: 'Connexion directe avec votre calendrier pour proposer des créneaux de visite qualifiée et génération d\'un récapitulatif structuré envoyé directement sur le téléphone du patron.'
      },
      {
        title: 'Tableau de bord d\'analyse des conversations & journal d\'audit',
        desc: 'Visualisation en direct des échanges menés par l\'agent IA, des motifs de sollicitation les plus fréquents et du taux de conversion des demandes.'
      },
      {
        title: 'Conformité stricte AI Act européen & RGPD belge',
        desc: 'Notification claire de transparence envers les utilisateurs (transparence IA obligatoire) et conservation souveraine des données sans réutilisation pour l\'entraînement de modèles publics.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Perte de 35 % des demandes formulées en soirée et le week-end',
        desc: 'Un particulier ou professionnel qui cherche une solution le dimanche soir n\'attend pas le lundi 9h : il contacte le premier confrère qui apporte une réponse immédiate et qualifiée.'
      },
      {
        title: 'Coût d\'un temps plein de secrétariat téléphonique',
        desc: 'Embaucher une personne pour filtrer les appels répétitifs et saisir les coordonnées représente plus de 35 000 € par an avec les charges sociales belges.'
      },
      {
        title: 'Charge mentale constante et interruptions permanentes',
        desc: 'Être dérangé sur le terrain ou en famille pour des questions basiques de tarifs ou d\'horaires que l\'IA gère à la perfection en quelques secondes.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Immersion & extraction de vos règles métier', desc: 'Nous formalisons votre catalogue, vos réponses types, vos délais et vos limites d\'intervention.' },
      { step: '02', title: 'Entraînement de l\'agent IA en sandbox', desc: 'Tests de résistance avec plus de 50 scénarios de questions complexes et adversarial prompts.' },
      { step: '03', title: 'Connexion aux flux d\'action', desc: 'L\'IA apprend à vérifier les disponibilités, à créer des dossiers et à notifier l\'équipe.' },
      { step: '04', title: 'Déploiement supervisé', desc: 'Mise en ligne avec double vérification humaine initiale pour garantir une fluidité totale.' }
    ],
    includedMaintenance: 'Maintenance continue des modèles de langage, monitoring anti-hallucination, mise à jour des grilles tarifaires et support prioritaire 6j/7.',
    faq: [
      {
        q: 'L\'IA peut-elle inventer des prix faux ou promettre n\'importe quoi ?',
        a: 'Non. Nous implémentons des garde-fous déterministes stricts (Zero-Shot Guardrails). Si une question sort du périmètre autorisé, l\'IA propose de transmettre la demande directement à un humain sans jamais inventer.'
      },
      {
        q: 'L\'outil est-il conforme au nouvel AI Act européen et au RGPD ?',
        a: 'Absolument. Nous respectons l\'obligation de transparence (l\'interlocuteur sait qu\'il échange avec une assistance IA) et aucune donnée confidentielle n\'est réutilisée pour entraîner des modèles publics.'
      },
      {
        q: 'Combien de temps faut-il pour qu\'il soit opérationnel ?',
        a: 'Le paramétrage, l\'entraînement et les tests prennent entre 15 et 20 jours ouvrés pour une solution livrée clés en main.'
      },
      {
        q: 'Puis-je couper l\'agent IA si nécessaire ?',
        a: 'Oui, un simple bouton dans votre tableau de bord vous permet de désactiver l\'agent ou de basculer en mode formulaire classique à tout moment.'
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
