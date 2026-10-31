// Catalogue officiel exhaustif des 14 services Purity Agency
// Structure de référence pour les pages de détails, SEO local, Google Ads Quality Score et conversion Fitts.

export const services = [
  {
    id: 'M01',
    slug: 'diagnostic-digital',
    name: 'Diagnostic digital (15 min)',
    pillar: 'Pilier 04 · Diagnostic & Cadrage',
    kicker: '15 min en visio · 100 % gratuit · sans engagement',
    headline: 'Identifiez en 15 minutes le point de friction précis qui bloque vos demandes clients en ligne.',
    summary: 'Avant d’investir le moindre euro dans un site web, des réseaux sociaux ou de la publicité, on examine votre présence actuelle et on isole l’action la plus rentable pour votre activité.',
    price: 'Offert',
    priceSetup: '0 €',
    promoSetup: 'Offert',
    promoTag: 'Gratuit · sans engagement',
    monthlyPrice: null,
    monthlyNote: 'Aucun abonnement, aucun moyen de paiement requis.',
    delay: 'Créneau immédiat (15 min chrono)',
    targetAudience: 'Indépendants, artisans, gérants de PME en Wallonie (Charleroi, Namur, Mons, Liège, Brabant Wallon) qui hésitent sur la priorité digitale à enclencher ou dont le site actuel ne génère aucun contact.',
    utility: 'Éviter de gaspiller des milliers d’euros dans un outil ou une refonte inutile. Vous obtenez un diagnostic technique et commercial honnête, sans jargon, directement avec Amir Kebiyeb.',
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
      { aspect: 'Interlocuteur', others: 'Commercial junior qui lit une grille de vente', purity: 'Échange direct avec Amir Kebiyeb, fondateur & ingénieur' },
      { aspect: 'Résultat délivré', others: 'Devis générique copier-coller', purity: 'Synthèse écrite sous 1h avec la priorité n°1 à débloquer' }
    ],
    deliverables: [
      {
        title: 'Audit en direct de votre visibilité web',
        desc: 'Analyse sur écran partagé de votre site, de votre fiche Google Maps et de vos réseaux sociaux par rapport à vos concurrents locaux directs.'
      },
      {
        title: 'Détection du goulot d\'étranglement mobile',
        desc: 'Identification exacte de ce qui bloque : temps de chargement > 3s, offre confuse sur smartphone, formulaire trop long ou invisibilité locale.'
      },
      {
        title: 'Plan d\'action prioritaire chiffré',
        desc: 'Recommandation claire de l\'étape n°1 la plus rentable à appliquer, avec estimation budgétaire exacte sans frais cachés.'
      },
      {
        title: 'Compte-rendu écrit de synthèse sous 1 heure',
        desc: 'Un mémo actionnable envoyé par e-mail récapitulant les points faibles détectés et la marche à suivre immédiate.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Dépenses à l\'aveugle en publicité',
        desc: 'Payer des annonces Google Ads ou Facebook qui envoient des visiteurs sur un site qui ne convertit pas : argent jeté par la fenêtre.'
      },
      {
        title: 'Mois perdus dans l\'hésitation',
        desc: 'Reporter votre modernisation pendant que vos concurrents locaux mieux structurés s\'installent dans l\'esprit de vos futurs clients.'
      },
      {
        title: 'Clients qualifiés qui appellent ailleurs',
        desc: 'Continuer à perdre des personnes cherchant votre métier dans votre ville parce que votre présence mobile manque de crédibilité.'
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
        a: 'Par lien Google Meet accessible en un clic depuis votre ordinateur ou smartphone, sans aucun logiciel à installer.'
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
    summary: 'La solution idéale pour les indépendants qui ont une offre unique et veulent remplacer une simple page Facebook ou un site obsolète par une présence moderne, crédible et contactable 24h/24.',
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
        title: 'Architecture One-Page pensée pour la conversion',
        desc: 'Structure linéaire optimisée : Promesse forte au-dessus de la ligne de flottaison, preuves de réalisations, grille tarifaire indicative et formulaire direct.'
      },
      {
        title: 'Design Liquid Glass sur mesure (Dark Theme)',
        desc: 'Finition soignée 2026-2027 : fond near-black `#060309`, typographie General Sans, micro-interactions subtiles, 0% template générique.'
      },
      {
        title: 'Score PageSpeed 95+ sur smartphone',
        desc: 'Chargement instantané sans aucun CMS lourd, garantissant un score vert Google et un taux de rebond minimal.'
      },
      {
        title: 'Bouton d\'appel direct & WhatsApp au pouce',
        desc: 'Action bar ergonomique pour déclencher un appel téléphonique ou un message WhatsApp en 1 seconde chrono depuis un smartphone.'
      },
      {
        title: 'Nom de domaine .be & Certificat SSL HTTPS',
        desc: 'Configuration de votre adresse officielle de marque et cadenas de sécurité HTTPS obligatoire.'
      },
      {
        title: 'Conformité légale belge complète (BCE, TVA, RGPD)',
        desc: 'Mentions légales officielles (numéro d’entreprise, régime TVA art. 56bis le cas échéant), politique de confidentialité et sécurité des données.'
      }
    ],
    lossOfInaction: [
      {
        title: '70 % des prospects mobiles perdus',
        desc: 'Sur smartphone, un prospect sur deux quitte une page si elle met plus de 3 secondes à s\'afficher.'
      },
      {
        title: 'Image amateur qui tire vos tarifs vers le bas',
        desc: 'Envoyer un lien Facebook ou une boîte Gmail gratuite pousse les clients à négocier vos prix à la baisse.'
      },
      {
        title: 'Zéro demande pendant vos chantiers',
        desc: 'Pendant que vous travaillez sur le terrain, vous manquez les appels de clients qui finissent par appeler votre confrère.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Cadrage de l\'offre (20 min)', desc: 'On valide vos prestations phares, votre zone d\'intervention en Wallonie et vos photos de chantiers.' },
      { step: '02', title: 'Rédaction & Design Liquid Glass', desc: 'Nous rédigeons les textes percutants et intégrons l\'interface sans que vous n\'ayez à rédiger quoi que ce soit.' },
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
    kicker: 'Le standard professionnel · PME & Artisans confirmés',
    headline: 'Le site vitrine complet pour asseoir votre autorité locale et convertir chaque recherche Google en demande de devis qualifiée.',
    summary: 'La solution la plus demandée : 5 pages complètes et structurées (Accueil d’autorité, Services détaillés, Réalisations avec comparateur avant/après, À Propos, Contact & Devis) conçues pour dominer votre zone géographique.',
    price: '1 490 € + 79 €/mois',
    priceSetup: '1 490 €',
    promoSetup: '1 117 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '79 €/mois',
    monthlyNote: 'Hébergement infogéré, domaine .be, SSL, sauvegardes et modifications courantes incluses.',
    delay: '7 à 10 jours ouvrés',
    targetAudience: 'Entreprises de rénovation, électriciens, plombiers, garages, carrosseries, cabinets dentaires, agences immobilières et PME régionales en Wallonie.',
    utility: 'Devenir le choix évident dans votre ville et filtrer les demandes pour ne recevoir que des chantiers rentables avec des clients qui ont le budget.',
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
      { aspect: 'Filtrage des curieux', others: 'Formulaire basique : vous perdez votre temps sur des devis sans budget', purity: 'Formulaire qualifié par pièce/budget pour cibler les vrais chantiers' },
      { aspect: 'Preuve de savoir-faire', others: 'Photos compressées sans mise en valeur', purity: 'Comparateur interactif Avant / Après ultra-tactile' },
      { aspect: 'Référencement local', others: 'Site invisible dès qu’on dépasse le code postal', purity: 'Balises Schema.org ProfessionalService + maillage local' }
    ],
    deliverables: [
      {
        title: '5 pages complètes pensées pour convaincre',
        desc: 'Accueil d’autorité, Page Services avec fiches détaillées, Galerie de réalisations avant/après, Page Entreprise/Équipe et Contact avec devis guidé.'
      },
      {
        title: 'Parcours de devis qualifié par critères',
        desc: 'Formulaire intelligent demandant le type de projet, le délai souhaité et la commune, éliminant les curieux avant même votre premier appel.'
      },
      {
        title: 'Curseur interactif Avant / Après',
        desc: 'Composant interactif permettant au visiteur de glisser le curseur pour voir la qualité de vos finitions (comme sur notre propre site).'
      },
      {
        title: 'Optimisation SEO Local Wallonie',
        desc: 'Balises sémantiques Hn, métadonnées OpenGraph, données structurées Schema.org ProfessionalService et intégration de votre zone géographique.'
      },
      {
        title: 'Adresses e-mails professionnelles',
        desc: 'Configuration de vos boîtes e-mails personnalisées (ex: contact@votre-entreprise.be) synchronisées sur votre téléphone et PC.'
      },
      {
        title: 'Vitesse de pointe PageSpeed 95+',
        desc: 'Architecture ultra-rapide sans framework superflu garantissant un affichage instantané et un excellent Quality Score pour Google Ads.'
      }
    ],
    lossOfInaction: [
      {
        title: '15 à 30 chantiers perdus par an',
        desc: 'Lorsqu’un particulier compare 3 artisans locaux, celui qui n’a pas de site crédible est éliminé dès la première minute.'
      },
      {
        title: 'Des heures passées à faire des devis pour rien',
        desc: 'Se déplacer chez des clients qui n’ont pas le budget parce que votre site ne communiquait pas clairement votre positionnement.'
      },
      {
        title: 'Dépendance au bouche-à-oreille qui stagne',
        desc: 'Le bouche-à-oreille est excellent mais irrégulier : un site pro assure un flux constant de nouvelles demandes toute l’année.'
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
    kicker: 'Grande visibilité · Multi-services & Multi-villes',
    headline: 'La plateforme digitale exhaustive pour les PME multi-métiers qui veulent dominer plusieurs zones géographiques sur Google.',
    summary: 'Plus de 10 pages dédiées pour couvrir chacun de vos corps d’état ou villes d’intervention (ex: Charleroi, Namur, Mons, Nivelles, Brabant Wallon) avec un maillage SEO puissant et des formulaires spécifiques.',
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
        title: 'Arborescence 10 à 15 pages sur mesure',
        desc: 'Pages services approfondies, silos géographiques par ville/région, fiches de réalisations détaillées et page carrières/recrutement.'
      },
      {
        title: 'Silos sémantiques SEO avancés',
        desc: 'Structure de liens internes optimisée pour propulser vos pages stratégiques en première page sur les requêtes à fort panier moyen.'
      },
      {
        title: 'Formulaires conditionnels multi-services',
        desc: 'Parcours dynamique qui adapte automatiquement les questions selon la prestation sélectionnée par le prospect.'
      },
      {
        title: 'Section Actualités & Études de cas',
        desc: 'Moteur de publication pour présenter vos chantiers récents et maintenir votre autorité Google active.'
      },
      {
        title: 'Tableau de bord statistique privé RGPD',
        desc: 'Suivi transparent des visites réelles, du taux de contact et de la provenance de vos demandes sans cookies intrusifs.'
      },
      {
        title: 'Support prioritaire garanti sous 24h',
        desc: 'Canal direct réservé avec notre pôle technique pour vos demandes urgentes et modifications de planning.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Marchés régionaux abandonnés aux leaders concurrents',
        desc: 'Un site basique de 3 pages ne peut pas rivaliser avec des entreprises qui ont une page optimisée pour chaque ville de Wallonie.'
      },
      {
        title: 'Marges rognées sur les gros contrats',
        desc: 'Les clients à fort budget (architectes, promoteurs, entreprises) exigent une assise digitale irréprochable avant de signer des devis à 5 ou 6 chiffres.'
      },
      {
        title: 'Difficultés à recruter des ouvriers qualifiés',
        desc: 'Les meilleurs artisans et techniciens refusent de postuler dans des entreprises qui renvoient une image vieillissante en ligne.'
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
    kicker: 'Vente 24h/24 · Bancontact & Payconiq · Zéro commissions excessives',
    headline: 'Votre boutique e-commerce moderne, rapide et autonome pour vendre vos produits en Belgique et en Europe sans friction.',
    summary: 'Une boutique en ligne élégante, connectée aux moyens de paiement préférés des consommateurs belges (Bancontact, Payconiq, Apple Pay, cartes bancaires), optimisée pour convertir sur smartphone sans abandon de panier.',
    price: '3 990 € + 149 €/mois',
    priceSetup: '3 990 €',
    promoSetup: '2 992 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '149 €/mois',
    monthlyNote: 'Sécurité bancaire, monitoring des paiements, maintenance des passerelles et support technique.',
    delay: '15 à 25 jours ouvrés',
    targetAudience: 'Commerçants, artisans créateurs, producteurs locaux, marques de cosmétiques ou de mode, et distributeurs cherchant un canal de vente directe sans commissions de plateformes.',
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
      { aspect: 'Commissions sur ventes', others: '15 % à 30 % prélevés par les marketplaces (Amazon, etc.)', purity: '0 % de commission Purity : vous gardez 100 % de votre marge' },
      { aspect: 'Paiements belges', others: 'Cartes de crédit uniquement (abandon massif en Belgique)', purity: 'Bancontact, Payconiq, Apple Pay et Cartes intégrés nativement' },
      { aspect: 'Tunnel d’achat', others: '5 étapes lentes demandant un compte obligatoire', purity: 'Checkout express en 1 écran avec achat invité' }
    ],
    deliverables: [
      {
        title: 'Boutique complète jusqu\'à 100 produits',
        desc: 'Fiches produits soignées avec variantes (tailles, coloris, poids), galeries photos zoomables, gestion des stocks et produits recommandés.'
      },
      {
        title: 'Passerelle de paiement belge sécurisée',
        desc: 'Intégration directe de Bancontact, Payconiq, Carte Bancaire, Apple Pay et Google Pay via Stripe ou Mollie sans intermédiaire douteux.'
      },
      {
        title: 'Tunnel d\'achat One-Step anti-abandon',
        desc: 'Validation de commande en une seule page claire, réduisant la friction et augmentant le taux de conversion d\'au moins +25 %.'
      },
      {
        title: 'Expéditions Bpost, Mondial Relay & Click and Collect',
        desc: 'Configuration des zones de livraison (Belgique, France, Luxembourg), points relais automatiques et retrait gratuit en magasin.'
      },
      {
        title: 'E-mails transactionnels & Facturation automatique',
        desc: 'Confirmation de commande, notification d\'envoi avec numéro de suivi colis et génération de factures PDF conformes.'
      },
      {
        title: 'Formation vidéo personnalisée (20 min)',
        desc: 'Tutoriel simple pour ajouter de nouveaux produits, modifier vos prix et imprimer vos bordereaux d\'envoi en totale autonomie.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Ventes bloquées aux heures de fermeture physique',
        desc: '42 % des achats en ligne se font entre 20h et minuit : sans e-commerce, vos clients fidèles finissent par acheter ailleurs.'
      },
      {
        title: 'Marges détruites par les plateformes tierces',
        desc: 'Vendre sur des plateformes qui prélèvent 20 % de commission réduit à néant votre rentabilité commerciale.'
      },
      {
        title: 'Stocks dormants non valorisés',
        desc: 'Des invendus qui s\'accumulent en réserve au lieu d\'être proposés à une clientèle élargie sur toute la Wallonie et Bruxelles.'
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
    kicker: 'Transformation radicale · Conservation de vos acquis SEO',
    headline: 'Transformez votre ancien site web lent et dépassé en une machine de conversion moderne, fluide et crédible.',
    summary: 'Votre site actuel a plus de 4 ans, ne ressemble à rien sur smartphone ou ne génère plus aucun contact ? Nous le reconstruisons entièrement en conservant vos adresses et votre autorité Google acquise.',
    price: '890 à 2 490 € + 79 €/mois',
    priceSetup: 'dès 890 €',
    promoSetup: 'dès 667 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '79 €/mois',
    monthlyNote: 'Hébergement, maintenance technique et garantie stricte de zéro perte de trafic SEO.',
    delay: '7 à 14 jours ouvrés',
    targetAudience: 'Entreprises établies qui disposent déjà d\'un site web (ancien WordPress, Wix ou fait maison) mais qui ont honte de le montrer à leurs clients.',
    utility: 'Multiplier immédiatement votre taux de conversion par 3 sans perdre votre historique, vos liens externes ni vos positions actuelles sur Google.',
    searchIntentKeywords: [
      'refonte site internet charleroi',
      'moderniser vieux site web belgique',
      'refonte wordpress vers site rapide wallonie',
      'prix refonte site web pme'
    ],
    relatedCases: [
      { id: 'renovation', name: 'Atelier Noma', sector: 'Rénovation & Bâtiment' }
    ],
    comparison: [
      { aspect: 'Gestion des anciennes adresses', others: 'Liens cassés en 404 : tout votre référencement Google s’effondre', purity: 'Plan strict de redirections 301 pour transférer 100 % de votre autorité' },
      { aspect: 'Coupure de service', others: 'Site indisponible pendant 2 semaines', purity: 'Zéro coupure : votre ancien site reste en ligne jusqu’à la minute de bascule' },
      { aspect: 'Vitesse après refonte', others: 'Même lenteur car refait avec le même CMS lourd', purity: 'Temps de chargement divisé par 4 (PageSpeed 95+)' }
    ],
    deliverables: [
      {
        title: 'Audit complet de l\'existant & crawl technique',
        desc: 'Inventaire exhaustif de vos URLs historiques, des mots-clés qui vous amènent déjà du trafic et des points de friction majeurs.'
      },
      {
        title: 'Plan de redirections 301 chirurgical',
        desc: 'Garantie absolue de zéro perte de trafic : chaque ancienne adresse est redirigée de manière transparente vers sa nouvelle page équivalente.'
      },
      {
        title: 'Refonte graphique Liquid Glass 2026-2027',
        desc: 'Modernisation visuelle complète : finitions soignées, typographies haut de gamme et valorisation de vos compétences réelles.'
      },
      {
        title: 'Suppression des plugins lourds & code allégé',
        desc: 'Nettoyage des dizaines d\'extensions vulnérables et obsolètes au profit d\'un code vanilla ultra-léger et sécurisé.'
      },
      {
        title: 'Nouveaux formulaires de contact qualifiés',
        desc: 'Remplacement des vieux formulaires austères par des parcours fluides avec confirmation instantanée.'
      },
      {
        title: 'Mise en conformité RGPD & Sécurité renforcée',
        desc: 'Élimination des failles de sécurité et mise aux normes du bandeau de consentement selon l\'Autorité de Protection des Données belge.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Pénalités progressives infligées par Google',
        desc: 'Google déclasse les sites qui échouent aux tests Core Web Vitals (lenteur, éléments qui sautent lors du défilement mobile).'
      },
      {
        title: 'Risque de piratage massif sur vieux CMS non mis à jour',
        desc: 'Les sites aux plugins obsolètes sont la cible privilégiée des robots pirates (injections de spams, blocage d\'accès, vol d\'e-mails).'
      },
      {
        title: 'Taux de fuite de 80 % sur smartphone',
        desc: '8 visiteurs sur 10 quittent immédiatement un site qui nécessite de zoomer avec les doigts pour lire un texte.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Extraction des contenus de valeur', desc: 'Récupération de vos textes existants, avis clients et photos de qualité.' },
      { step: '02', title: 'Création en environnement privé', desc: 'Votre ancien site reste 100 % actif pendant que nous construisons le nouveau en coulisses.' },
      { step: '03', title: 'Comparatif Avant / Après', desc: 'Vous comparez les deux versions côte à côte et validez la nouvelle mouture.' },
      { step: '04', title: 'Bascule instantanée sans coupure', desc: 'Migration DNS fluide en quelques minutes avec application du plan de redirections.' }
    ],
    includedMaintenance: 'Surveillance anti-panne, gestion continue des redirections, hébergement haute performance et modifications de routine.',
    faq: [
      {
        q: 'Mon site actuel sera-t-il indisponible pendant la refonte ?',
        a: 'Non, jamais. Votre site actuel reste en ligne et continue de recevoir vos clients jusqu\'à la minute exacte où nous activons le nouveau.'
      },
      {
        q: 'Vais-je perdre mes adresses e-mails professionnelles ?',
        a: 'Non. Nous configurons les enregistrements DNS avec une rigueur absolue pour qu\'aucun e-mail ne soit perdu lors du transfert.'
      },
      {
        q: 'Mon classement Google risque-t-il de baisser ?',
        a: 'Au contraire. Grâce à notre plan de redirections 301 et au gain massif de vitesse, la majorité de nos clients constatent une remontée de leurs positions sous 3 à 4 semaines.'
      },
      {
        q: 'Pouvez-vous récupérer mes textes existants ?',
        a: 'Oui, nous récupérons vos textes existants et nous les retravaillons pour les rendre plus percutants et plus lisibles sur mobile.'
      }
    ]
  },
  {
    id: 'M08',
    slug: 'google-business',
    name: 'Fiche Google Business & Maps',
    pillar: 'Pilier 01 · Sites Web & Référencement',
    kicker: 'Pack Visibilité Locale · Présence Google Maps n°1',
    headline: 'Ressortez en tête de liste sur Google Maps quand vos voisins cherchent votre métier dans votre ville.',
    summary: 'Optimisation complète de votre fiche Google Business Profile pour apparaître dans le pack local de 3 résultats de Google et déclencher des appels téléphoniques quotidiens sans payer de publicité.',
    price: '290 €',
    priceSetup: '290 €',
    promoSetup: '217 €',
    promoTag: '-25 % 24h',
    monthlyPrice: null,
    monthlyNote: 'Paiement unique, sans abonnement obligatoire.',
    delay: '3 à 5 jours ouvrés',
    targetAudience: 'Commerces physiques, dépanneurs, artisans mobiles, restaurants, professions libérales et cabinets locaux en Wallonie.',
    utility: 'Capter le trafic de proximité le plus chaud : des prospects prêts à appeler immédiatement dans un rayon de 10 à 30 km autour de votre atelier.',
    searchIntentKeywords: [
      'optimiser fiche google business charleroi',
      'apparaitre premier sur google maps belgique',
      'création google my business artisan wallonie',
      'référencement local google maps pme'
    ],
    relatedCases: [
      { id: 'restaurant', name: 'Table Serein', sector: 'Horeca' },
      { id: 'garage', name: 'Garage Rive', sector: 'Automobile' }
    ],
    comparison: [
      { aspect: 'Catégorisation Google', others: 'Une seule catégorie basique choisie au hasard', purity: 'Catégorie principale et secondaires calibrées sur l’algorithme belge' },
      { aspect: 'Collecte d’avis 5 étoiles', others: 'Attendre passivement que les clients pensent à laisser un avis', purity: 'QR code d’atelier + lien court direct augmentant les avis de +300 %' },
      { aspect: 'Gestion des doublons', others: 'Fiches en doublon qui diluent votre score Google', purity: 'Nettoyage et harmonisation complète des signaux NAP' }
    ],
    deliverables: [
      {
        title: 'Revendication & validation officielle de la fiche',
        desc: 'Audit de statut, sécurisation de la propriété de votre établissement et validation auprès de Google.'
      },
      {
        title: 'Optimisation des catégories d\'activité',
        desc: 'Sélection des catégories exactes les plus recherchées par l\'algorithme Google en Belgique francophone.'
      },
      {
        title: 'Rédaction optimisée de la description d\'entreprise',
        desc: 'Texte professionnel de 750 caractères intégrant vos mots-clés prioritaires, zones desservies et réassurances.'
      },
      {
        title: 'Catalogue complet de vos services & tarifs indicatifs',
        desc: 'Ajout de chacune de vos prestations avec descriptif clair et liens vers votre site web ou WhatsApp.'
      },
      {
        title: 'Kit d\'avis clients 5 étoiles & QR Code imprimable',
        desc: 'Lien direct court + création d\'un QR code prêt à imprimer pour votre comptoir, camionnette ou factures.'
      },
      {
        title: 'Harmonisation des signaux de cohérence NAP',
        desc: 'Alignement du Nom, Adresse et Téléphone sur le web pour éviter toute pénalité de classement de Google.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Invisibilité sur 65 % des recherches mobiles',
        desc: 'Sur smartphone, 2 personnes sur 3 appellent directement depuis la carte Google Maps sans ouvrir de site web.'
      },
      {
        title: 'Avis négatifs sans réponse professionnelle',
        desc: 'Une fiche non gérée laisse des avis litigieux sans réponse constructive, faisant fuir les nouveaux prospects.'
      },
      {
        title: 'Clients qui trouvent porte close',
        desc: 'Horaires faux ou mauvaise adresse sur Google qui envoient vos clients directement chez le concurrent ouvert à côté.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Audit d\'accès', desc: 'Vous nous donnez accès comme gestionnaire à votre fiche existante ou nous la créons ensemble.' },
      { step: '02', title: 'Restructuration complète', desc: 'Nous renseignons l\'ensemble des champs techniques, balisons les zones d\'intervention et ajoutons vos services.' },
      { step: '03', title: 'Photos & identité', desc: 'Intégration de photos soignées valorisant vos locaux, votre équipe et votre savoir-faire.' },
      { step: '04', title: 'Remise du kit d\'avis', desc: 'Vous recevez vos accès propres et votre kit pour booster vos avis clients chaque semaine.' }
    ],
    includedMaintenance: 'Service ponctuel sans abonnement. Possibilité d’opter pour notre suivi mensuel pour la publication régulière de posts Google.',
    faq: [
      {
        q: 'Je n’ai pas d’adresse pour accueillir du public, est-ce possible ?',
        a: 'Oui. Google permet de créer une fiche en zone de desserte (ex: "Artisan itinérant couvrant Charleroi et 30 km aux alentours"), sans afficher votre adresse privée.'
      },
      {
        q: 'En combien de temps voit-on les effets sur les appels ?',
        a: 'La mise à jour technique est effective en 48h. L\'impact sur le classement local et les appels se fait généralement ressentir entre 10 et 20 jours après l\'optimisation.'
      },
      {
        q: 'Peut-on supprimer un faux avis calomnieux ?',
        a: 'Nous vous accompagnons pour signaler les faux avis contraires aux règles de Google et nous vous aidons à rédiger des réponses professionnelles pour désamorcer les avis litigieux.'
      },
      {
        q: 'Est-ce un paiement unique ou un abonnement ?',
        a: 'C\'est un paiement unique de 217 € (avec remise 24h). Aucun abonnement mensuel obligatoire.'
      }
    ]
  },
  {
    id: 'M09',
    slug: 'identite-visuelle-logo',
    name: 'Identité visuelle & Logo',
    pillar: 'Pilier 02 · Réseaux Sociaux & Image',
    kicker: 'Branding mémorable · Vectoriel haute définition · Charte complète',
    headline: 'Une identité de marque puissante et moderne qui inspire confiance et justifie des tarifs élevés.',
    summary: 'Création ou refonte complète de votre logo et de votre univers visuel (couleurs, typographies, déclinaisons) pour vous démarquer immédiatement de la concurrence bas de gamme.',
    price: '690 €',
    priceSetup: '690 €',
    promoSetup: '517 €',
    promoTag: '-25 % 24h',
    monthlyPrice: null,
    monthlyNote: 'Paiement unique, fichiers sources et droits d’exploitation 100 % cédés.',
    delay: '7 à 10 jours ouvrés',
    targetAudience: 'Créateurs d\'entreprise, indépendants en phase de repositionnement ou PME dont le logo actuel est pixelisé, démodé ou créé sous Word.',
    utility: 'Inspirer un respect professionnel instantané dès le premier contact et justifier des devis plus élevés auprès d\'une clientèle plus exigeante.',
    searchIntentKeywords: [
      'création logo entreprise charleroi',
      'refonte identité visuelle pme belgique',
      'tarif graphiste logo professionnel wallonie',
      'charte graphique entreprise artisanale'
    ],
    relatedCases: [
      { id: 'beaute', name: 'Maison Lune', sector: 'Institut de Beauté' },
      { id: 'sport', name: 'Cadence Studio', sector: 'Studio Sportif' }
    ],
    comparison: [
      { aspect: 'Originalité', others: 'Logo généré par IA ou icône de banque d’images vue partout', purity: 'Création vectorielle sur mesure originale et brevetable' },
      { aspect: 'Formats fournis', others: 'Simple fichier JPEG pixelisé inutilisable pour l’imprimerie', purity: 'Pack vectoriel complet (SVG, EPS, PDF HD, WebP transparent)' },
      { aspect: 'Droits de propriété', others: 'Droits flous ou licence mensuelle cachée', purity: 'Attestation de cession totale des droits patrimoniaux' }
    ],
    deliverables: [
      {
        title: '3 pistes créatives uniques et argumentées',
        desc: 'Propositions originales conçues selon votre positionnement, sans aucune icône générique de banque d\'images.'
      },
      {
        title: 'Logo final décliné sous tous les formats HD',
        desc: 'Fichiers vectoriels SVG, EPS, PDF (imprimerie haute résolution) et versions web transparentes PNG/WebP (fond clair et fond sombre).'
      },
      {
        title: 'Variations d\'usage complètes',
        desc: 'Version principale horizontale, version compacte badge/favicône pour réseaux sociaux et déclinaison monochrome.'
      },
      {
        title: 'Charte graphique de référence (Brand Guide PDF)',
        desc: 'Guide synthétique précisant vos codes couleurs exacts (HEX, RVB, CMJN pour l\'impression), polices de caractères et règles d\'interdiction.'
      },
      {
        title: 'Gabarits prêts pour flocage & signalétique',
        desc: 'Fichiers préparés aux bonnes dimensions pour vos véhicules utilitaires, cartes de visite, vêtements de travail ou enseigne de façade.'
      },
      {
        title: 'Cession totale des droits patrimoniaux',
        desc: 'Attestation formelle de cession de droits : le logo vous appartient à 100 % pour toute exploitation commerciale.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Négociations de prix permanentes',
        desc: 'Une identité visuelle négligée incite inconsciemment les clients à marchander vos devis et à vous traiter comme un exécutant discount.'
      },
      {
        title: 'Frais de réimpression inutiles',
        desc: 'Fournir un logo flou à un imprimeur qui donne un résultat désastreux sur vos camionnettes ou vos bâches publicitaires.'
      },
      {
        title: 'Confusion dans l\'esprit du public',
        desc: 'Avoir un logo différent sur Facebook, votre camionnette et vos factures détruit la mémorisation de votre marque.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Questionnaire de style (15 min)', desc: 'Vous partagez vos préférences, vos concurrents directs et les valeurs phares de votre métier.' },
      { step: '02', title: 'Présentation de 3 axes', desc: 'Amir vous présente 3 concepts distincts avec simulation sur supports réels (cartes, vêtements, mobile).' },
      { step: '03', title: 'Affinage de la piste retenue', desc: 'Jusqu\'à 2 séries d\'ajustements sur les couleurs, les formes et la typographie choisie.' },
      { step: '04', title: 'Remise du dossier complet', desc: 'Téléchargement d\'une archive organisée avec tous les formats professionnels classés.' }
    ],
    includedMaintenance: 'Livraison clé en main définitive. Les fichiers restent archivés chez nous à vie en cas de perte de votre côté.',
    faq: [
      {
        q: 'Puis-je protéger mon logo à l\'OBPI (Office Benelux) ?',
        a: 'Oui. Tous nos logos sont créés sur mesure et vectorisés selon les normes d\'enregistrement de marque du Benelux.'
      },
      {
        q: 'Fournissez-vous les cartes de visite imprimées ?',
        a: 'Nous vous livrons le fichier PDF d\'impression conforme avec traits de coupe et marges perdues, prêt à être envoyé à votre imprimeur local.'
      },
      {
        q: 'Que se passe-t-il si aucune des 3 pistes ne me plaît ?',
        a: 'Notre cadrage initial est si précis que cela n\'arrive quasiment jamais. Si c\'est le cas, nous analysons ce qui a manqué et concevons un axe supplémentaire corrigé.'
      },
      {
        q: 'Le logo est-il utilisable pour floquer mes camionnettes ?',
        a: 'Parfaitement. Les fichiers vectoriels (.EPS et .SVG) peuvent être agrandis à l’infini sans aucune perte de netteté.'
      }
    ]
  },
  {
    id: 'M10',
    slug: 'pack-visuels-reels',
    name: 'Pack Visuels & Reels Studio',
    pillar: 'Pilier 02 · Réseaux Sociaux & Image',
    kicker: 'Formats courts percutants · Instagram, TikTok, Facebook',
    headline: 'Des visuels percutants et vidéos courtes au format Reels prêtes à publier pour captiver votre audience locale.',
    summary: 'Création de visuels soignés et de 4 vidéos courtes au format Reels/TikTok pour mettre en lumière votre savoir-faire avec un montage dynamique et professionnel prêt à poster.',
    price: '390 €',
    priceSetup: '390 €',
    promoSetup: '292 €',
    promoTag: '-25 % 24h',
    monthlyPrice: null,
    monthlyNote: 'Pack ponctuel sans abonnement, réutilisable sur tous vos canaux.',
    delay: '5 à 7 jours ouvrés',
    targetAudience: 'Restaurants, commerces de bouche, instituts esthétiques, coachs sportifs et artisans réalisant des avant/après spectaculaires en Wallonie.',
    utility: 'Générer de l\'engagement rapide et multiplier par 5 la portée de vos publications grâce aux formats vidéo verticaux privilégiés par les algorithmes.',
    searchIntentKeywords: [
      'création reels instagram entreprise charleroi',
      'montage vidéo tiktok pme wallonie',
      'pack visuels réseaux sociaux artisan',
      'vidéo courte verticale commerce local'
    ],
    relatedCases: [
      { id: 'restaurant', name: 'Table Serein', sector: 'Horeca' },
      { id: 'beaute', name: 'Maison Lune', sector: 'Beauté' }
    ],
    comparison: [
      { aspect: 'Rétention d’attention', others: 'Vidéos sans sous-titres zappées en 2 secondes', purity: 'Accroche percutante dès 0,5s + sous-titres animés lisibles sans son' },
      { aspect: 'Temps passé par le gérant', others: '3 heures de galère sur une application mobile', purity: 'Vous envoyez vos vidéos brutes sur WhatsApp, on gère tout le montage' },
      { aspect: 'Qualité graphique', others: 'Polices criardes qui décrédibilisent l’artisan', purity: 'Charte graphique soignée, musique tendance libre de droits' }
    ],
    deliverables: [
      {
        title: '4 Reels / TikToks verticaux (9:16) montés',
        desc: 'Montage dynamique, accroche visuelle dès les 2 premières secondes, transitions soignées, musique tendance libre de droit.'
      },
      {
        title: 'Sous-titrage animé synchronisé',
        desc: '80 % des vidéos sont regardées sans le son : nous ajoutons des sous-titres animés lisibles pour maximiser la rétention.'
      },
      {
        title: '6 visuels carrousels ou posts carrés (1:1 & 4:5)',
        desc: 'Mise en page graphique épurée de vos conseils, promotions ou témoignages clients avec votre charte graphique.'
      },
      {
        title: 'Rédaction des légendes & hashtags locaux',
        desc: 'Textes d\'accompagnement prêts à copier-coller avec appel à l\'action clair et sélection de hashtags pertinents en Wallonie.'
      },
      {
        title: 'Miniatures de couverture personnalisées',
        desc: 'Visuels de couverture harmonieux pour que votre profil Instagram garde une grille soignée et professionnelle.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Portée organique quasi-nulle sur simple photo',
        desc: 'Les algorithmes Meta favorisent désormais à 80 % le format vidéo Reel : poster de simples images ne vous montre plus qu\'à vos propres amis.'
      },
      {
        title: 'Des heures passées à galérer sur votre téléphone',
        desc: 'Essayer de monter des vidéos sur mobile prend 3 heures par vidéo pour un résultat souvent bancal et peu vendeur.'
      },
      {
        title: 'Image terne comparée aux créateurs concurrents',
        desc: 'Des confrères plus jeunes utilisent la vidéo pour saturer le fil d\'actualité des clients locaux.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Envoi de vos rushs bruts', desc: 'Vous nous transmettez vos courtes vidéos filmées au smartphone via un lien de dépôt simple.' },
      { step: '02', title: 'Dérushage & scénarisation', desc: 'Nous sélectionnons les meilleures séquences et créons une narration rythmée avec accroche.' },
      { step: '03', title: 'Montage studio & sous-titres', desc: 'Étalonnage, mixage sonore et intégration des animations textuelles.' },
      { step: '04', title: 'Livraison prête à poster', desc: 'Vous recevez les vidéos par e-mail ou WhatsApp, avec l\'ordre de publication et les textes rédigés.' }
    ],
    includedMaintenance: 'Pack créatif ponctuel sans récurrence. Possibilité de basculer sur notre formule M16 (Gestion complète 3x/semaine).',
    faq: [
      {
        q: 'Dois-je avoir du matériel de tournage professionnel ?',
        a: 'Non, un simple smartphone récent suffit amplement ! Nous vous donnons 3 consignes simples de cadrage et de lumière avant de filmer, notre montage studio s\'occupe du reste.'
      },
      {
        q: 'Puis-je utiliser ces vidéos pour des publicités sponsorisées ?',
        a: 'Oui, les vidéos sont livrées en haute résolution MP4 et sont parfaitement calibrées pour Meta Ads (Instagram et Facebook).'
      },
      {
        q: 'Qui valide les vidéos avant diffusion ?',
        a: 'Vous avez un droit de regard et de retouche sur chaque vidéo avant de les diffuser.'
      },
      {
        q: 'Les musiques sont-elles libres de droits pour un compte pro ?',
        a: 'Oui, nous utilisons exclusivement des morceaux autorisés pour un usage commercial afin d’éviter toute coupure audio par Instagram.'
      }
    ]
  },
  {
    id: 'M13',
    slug: 'referencement-local-seo',
    name: 'Référencement local (SEO)',
    pillar: 'Pilier 01 · Sites Web & Référencement',
    kicker: 'Positionnement durable · Trafic organique Wallonie',
    headline: 'Remontez durablement dans les premiers résultats naturels de Google sur vos mots-clés les plus rentables.',
    summary: 'Une stratégie SEO technique et sémantique continue pour consolider votre positionnement sur Google dans votre région et générer un flux constant de prospects sans payer de publicité au clic.',
    price: '590 € + 149 €/mois',
    priceSetup: '590 €',
    promoSetup: '442 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '149 €/mois',
    monthlyNote: 'Optimisations continues, création de contenus et rapport mensuel de positions.',
    delay: 'Effets mesurables dès 30 à 60 jours',
    targetAudience: 'Indépendants et PME qui en ont marre de dépendre du budget Google Ads et veulent un flux régulier et gratuit de demandes organiques.',
    utility: 'Investir dans un actif digital qui prend de la valeur chaque mois et capte des prospects qualifiés au moment exact où ils ont besoin de vos services.',
    searchIntentKeywords: [
      'agence seo charleroi référencement naturel',
      'expert seo local wallonie indépendant',
      'remonter premier sur google artisan belgique',
      'prix référencement naturel site pme'
    ],
    relatedCases: [
      { id: 'renovation', name: 'Atelier Noma', sector: 'Rénovation' },
      { id: 'chauffage', name: 'Thermiq', sector: 'Chauffage' }
    ],
    comparison: [
      { aspect: 'Pérennité', others: 'Google Ads s’arrête dès que vous coupez votre budget', purity: 'Le SEO construit un actif qui continue d’amener des clients sans coût par clic' },
      { aspect: 'Qualité des contenus', others: 'Textes génériques bourrés de mots-clés illisibles', purity: 'Articles rédigés avec expertise locale répondant aux vraies questions clients' },
      { aspect: 'Transparence', others: 'Rapport mensuel automatique incompréhensible', purity: 'Bilan commenté avec suivi de vos positions et appels déclenchés' }
    ],
    deliverables: [
      {
        title: 'Audit sémantique & sélection de 20 mots-clés cibles',
        desc: 'Analyse précise des volumes de recherche réels en Belgique francophone et des intentions d\'achat.'
      },
      {
        title: 'Optimisation technique on-page continue',
        desc: 'Amélioration permanente des balises titles, méta-descriptions, données structurées Schema.org et temps de chargement.'
      },
      {
        title: 'Création mensuelle d\'articles & pages locales',
        desc: 'Rédaction et publication de contenus ciblés sur vos villes phares (Charleroi, La Louvière, Mons, Nivelles, etc.).'
      },
      {
        title: 'Stratégie de netlinking & citations locales',
        desc: 'Inscription dans les annuaires belges de référence (Pages d\'Or, annuaires professionnels régionaux) pour renforcer l\'autorité de votre domaine.'
      },
      {
        title: 'Rapport mensuel de visibilité transparent',
        desc: 'Un rapport vidéo ou écrit de 5 minutes vous montrant l\'évolution concrète de vos positions et du nombre de clics reçus.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Des milliers d\'euros brûlés en Google Ads',
        desc: 'Payer 3 à 8 € par clic sur Google Ads qui s\'arrête net dès que vous coupez votre budget au lieu de construire une position acquise.'
      },
      {
        title: 'Prise de monopole par les concurrents',
        desc: 'Une fois qu\'un confrère s\'installe en première position depuis 2 ans sur Google, il devient deux fois plus coûteux de le déloger.'
      },
      {
        title: 'Trafic non qualifié ou hors zone',
        desc: 'Recevoir des appels de personnes situées à 100 km parce que votre zone géographique n\'est pas proprement balisée dans Google.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Mise en place & audit initial', desc: 'Scan technique de votre site, correction des erreurs 404 et connexion à Google Search Console.' },
      { step: '02', title: 'Plan sémantique trimestriel', desc: 'Définition des 20 requêtes les plus rentables pour votre trésorerie.' },
      { step: '03', title: 'Optimisations mensuelles régulières', desc: 'Chaque mois, nous injectons de nouveaux contenus optimisés et consolidons vos positions.' },
      { step: '04', title: 'Mesure & ajustement', desc: 'Analyse des conversions réelles et réorientation vers les mots-clés qui déclenchent le plus d\'appels.' }
    ],
    includedMaintenance: 'Suivi de positionnement 24/7, corrections techniques préventives contre les mises à jour d\'algorithmes Google, rapport mensuel commenté par Amir.',
    faq: [
      {
        q: 'Au bout de combien de temps les résultats apparaissent-ils ?',
        a: 'Le SEO est un travail de fond. Les premiers frémissements sont visibles dès 3 à 4 semaines, les résultats significatifs sur le trafic et les appels se stabilisent entre le 2ème et le 4ème mois.'
      },
      {
        q: 'Dois-je écrire les textes des articles ?',
        a: 'Non, notre pôle rédaction prend en charge 100 % de la création de contenu optimisé, validé par vos soins avant mise en ligne.'
      },
      {
        q: 'Quelle est la durée d\'engagement ?',
        a: 'Engagement initial de 6 mois recommandé pour laisser le temps aux moteurs d\'indexer et de valoriser le travail, résiliable mensuellement par la suite.'
      },
      {
        q: 'Garantissez-vous la position numéro 1 sur Google ?',
        a: 'Aucune agence éthique ne peut promettre contractuellement une première place garantie (Google restant seul juge). En revanche, nous appliquons une méthodologie éprouvée qui place régulièrement nos clients dans le top 3 local.'
      }
    ]
  },
  {
    id: 'M16',
    slug: 'gestion-reseaux-sociaux',
    name: 'Réseaux sociaux (3x/semaine)',
    pillar: 'Pilier 02 · Réseaux Sociaux & Image',
    kicker: 'Présence continue · 1er mois 349 € offert · Zéro prise de tête',
    headline: 'Une présence active et professionnelle sur Instagram, Facebook et LinkedIn sans y passer vos soirées.',
    summary: '12 publications soignées par mois (3x/semaine) + 4 vidéos courtes Reels montées, programmées et animées pour faire grandir votre communauté locale.',
    price: '290 € + 349 €/mois',
    priceSetup: '290 €',
    promoSetup: '217 €',
    promoTag: '1er mois 349 € offert',
    monthlyPrice: '349 €/mois',
    monthlyNote: 'Création des visuels, montage des vidéos, rédaction des textes et programmation clé en main.',
    delay: 'Démarrage sous 5 jours ouvrés',
    targetAudience: 'Artisans débordés, gérants de commerces, restaurants et dirigeants de PME en Wallonie qui n\'ont pas le temps de poster régulièrement.',
    utility: 'Montrer chaque semaine à vos prospects et clients que votre entreprise est active, réactive et en pleine croissance, tout en restant concentré à 100 % sur vos chantiers et votre métier.',
    searchIntentKeywords: [
      'community manager charleroi pme',
      'gestion réseaux sociaux entreprise belgique',
      'tarif animation instagram facebook wallonie',
      'agence réseaux sociaux artisan namur'
    ],
    relatedCases: [
      { id: 'restaurant', name: 'Table Serein', sector: 'Horeca' },
      { id: 'beaute', name: 'Maison Lune', sector: 'Beauté' }
    ],
    comparison: [
      { aspect: 'Régularité', others: 'Un post par-ci par-là, puis 3 mois de silence total', purity: '3 publications soignées par semaine, calendrier planifié 1 mois à l’avance' },
      { aspect: 'Temps requis', others: 'Vos soirées et dimanches gâchés sur Canva', purity: '20 minutes de briefing mensuel avec nous, zéro charge mentale' },
      { aspect: 'Offre découverte', others: 'Plein tarif dès le premier jour', purity: '1er mois d’abonnement mensuel (349 €) 100 % offert' }
    ],
    deliverables: [
      {
        title: '12 publications professionnelles par mois (3 par semaine)',
        desc: 'Posts carrousels, focus chantiers, témoignages clients et actualités, chartés à vos couleurs.'
      },
      {
        title: '4 vidéos Reels / TikToks montées par mois',
        desc: 'Montage dynamique avec musique tendance, accroches percutantes et sous-titres animés inclus.'
      },
      {
        title: 'Rédaction intégrale des textes & appels à l\'action',
        desc: 'Copywriting professionnel sans fautes d\'orthographe, incitant vos abonnés à commenter ou à demander un devis.'
      },
      {
        title: 'Planning éditorial & calendrier partagé',
        desc: 'Vous visualisez à l\'avance tout ce qui va être publié le mois prochain pour une sérénité totale.'
      },
      {
        title: 'Programmation automatique aux heures d\'affluence',
        desc: 'Diffusion automatique aux créneaux où votre audience locale est la plus attentive (soirées, pauses de midi).'
      },
      {
        title: 'Offre promotionnelle : 1er mois d\'abonnement offert',
        desc: 'Bénéficiez immédiatement de 349 € d\'économie pour tester la régularité et l\'impact de notre accompagnement.'
      }
    ],
    lossOfInaction: [
      {
        title: 'L\'effet "Entreprise fantôme"',
        desc: 'Un client qui visite une page Facebook dont le dernier post date de 2023 se demande si vous êtes toujours en activité.'
      },
      {
        title: 'Des week-ends gâchés à chercher quoi poster',
        desc: 'Passer son dimanche soir à angoisser sur son téléphone pour trouver une photo et une légende à la va-vite.'
      },
      {
        title: 'Zéro recommandation spontanée',
        desc: 'Vos anciens clients vous oublient s\'ils ne voient jamais passer vos actualités dans leur fil au fil des mois.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Briefing mensuel de 20 minutes', desc: 'Un court appel chaque début de mois pour collecter vos nouveautés, chantiers terminés et promotions.' },
      { step: '02', title: 'Création du calendrier du mois', desc: 'Notre équipe conçoit les 12 visuels, monte les 4 vidéos et rédige les textes.' },
      { step: '03', title: 'Validation en 1 clic', desc: 'Vous relisez et validez le programme sur votre espace dédié sans effort.' },
      { step: '04', title: 'Publication & engagement', desc: 'Nous programmons tout automatiquement et veillons au bon déroulement des posts.' }
    ],
    includedMaintenance: 'Accompagnement continu, gestion des formats selon les mises à jour Meta, programmation automatique et assistance par messagerie dédiée.',
    faq: [
      {
        q: 'Dois-je vous donner le mot de passe de mes comptes ?',
        a: 'Non, nous nous connectons proprement via Meta Business Suite en tant qu\'agence partenaire autorisée, sans jamais avoir besoin de connaître vos identifiants personnels.'
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
    kicker: '1 automatisation ciblée · Gain de 5h/semaine · Zéro ressaisie',
    headline: 'Automatisez la tâche répétitive qui vous fait perdre le plus de temps chaque semaine.',
    summary: 'Mise en place clé en main d’une automatisation chirurgicale (prise de rendez-vous en ligne, relance automatique de devis ou tri des demandes d’intervention) pour ne plus rien oublier.',
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
        title: 'Cadrage précis d\'un flux unique à fort impact',
        desc: 'Exemples concrets au choix : Prise de RDV synchronisée avec votre agenda, Relance automatique des devis à J+3 et J+7, ou Notification SMS instantanée sur demande urgente.'
      },
      {
        title: 'Configuration d\'une passerelle d\'automatisation robuste',
        desc: 'Architecture via Make ou n8n sécurisée sans dépendance fragile, gestion des pannes et alertes en cas de coupure.'
      },
      {
        title: 'Modèles de messages personnalisés',
        desc: 'Rédaction de messages automatiques au ton chaleureux et humain, donnant l\'impression que vous répondez personnellement.'
      },
      {
        title: 'Tests intensifs de bout en bout',
        desc: 'Vérification de tous les cas particuliers (annulation, doublons, horaires non ouvrés) pour zéro bug en production.'
      },
      {
        title: 'Documentation de bord simplifiée',
        desc: 'Une fiche mémo d\'une page expliquant le fonctionnement exact du flux et comment le suspendre temporairement en cas de congés.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Devis oubliés sans relance',
        desc: '40 % des devis qui ne sont pas relancés sous 48h finissent par être signés chez un concurrent qui a simplement rappelé en premier.'
      },
      {
        title: '5 à 8 heures de paperasse inutile par semaine',
        desc: 'Ressaisir manuellement des numéros de téléphone et envoyer les mêmes e-mails types le soir au lieu de profiter de sa famille.'
      },
      {
        title: 'Rendez-vous manqués (No-shows)',
        desc: 'Sans rappel automatique par SMS 24h avant, 1 client sur 5 oublie son créneau et vous fait perdre un déplacement.'
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
    kicker: 'Écosystème multi-outils · Zéro saisie manuelle · Facturation & CRM',
    headline: 'Reliez votre site web, votre agenda, vos devis et votre suivi client dans un flux automatisé sans couture.',
    summary: 'Fini les doubles saisies et les tableurs éparpillés : nous connectons tous vos logiciels du quotidien pour que chaque nouveau contact devienne un dossier parfaitement géré automatiquement.',
    price: '990 € + 69 €/mois',
    priceSetup: '990 €',
    promoSetup: '742 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '69 €/mois',
    monthlyNote: 'Monitoring des flux, maintenance multi-connecteurs et évolutions mineures.',
    delay: '10 à 14 jours ouvrés',
    targetAudience: 'PME, cabinets comptables, entreprises du bâtiment avec plusieurs équipes et sociétés recevant plus de 10 demandes par semaine.',
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
        title: 'Cartographie complète de vos flux de données',
        desc: 'Schéma clair de circulation des informations entre votre formulaire web, votre messagerie, votre agenda et votre logiciel comptable ou CRM.'
      },
      {
        title: 'Mise en place de 3 à 5 automatisations interconnectées',
        desc: 'Création automatique du contact CRM, génération du dossier de suivi, notification de l\'équipe sur WhatsApp ou Slack et relance de satisfaction post-intervention.'
      },
      {
        title: 'Centralisation dans une base de données unique',
        desc: 'Tableau de bord dynamique (Airtable, Notion ou CRM dédié) accessible sur ordinateur et mobile pour voir en un coup d\'œil où en est chaque chantier.'
      },
      {
        title: 'Synchronisation comptable & pré-facturation',
        desc: 'Liaison avec vos outils de facturation pour préparer les factures d\'acompte sans ressaisir les coordonnées du client.'
      },
      {
        title: 'Gestion des notifications d\'équipe en temps réel',
        desc: 'Alerte instantanée des bons collaborateurs dès qu\'une intervention urgente est confirmée.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Erreurs de transmission coûteuses entre collaborateurs',
        desc: 'Notes perdues sur un carnet, mauvaises adresses transmises à l\'équipe sur le terrain et clients frustrés par le manque de suivi.'
      },
      {
        title: 'Factures impayées oubliées dans un coin',
        desc: 'Jusqu\'à 15 % de retards de paiement supplémentaires faute de système automatisé de relance avant échéance.'
      },
      {
        title: 'Goulet d\'étranglement sur le gérant',
        desc: 'Le patron passe 15h par semaine à faire le standardiste et le secrétaire au lieu de développer son chiffre d\'affaires.'
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
    kicker: 'Système complet sur mesure · Agent IA métier · Zéro friction',
    headline: 'Un système autonome sur mesure avec agent IA pour qualifier vos prospects et gérer vos opérations 24h/24.',
    summary: 'La solution la plus avancée : nous intégrons un agent IA formé sur vos règles métier (comme OctoMask sur notre site) couplé à une infrastructure d’automatisation totale.',
    price: '1 990 € + 119 €/mois',
    priceSetup: '1 990 €',
    promoSetup: '1 492 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '119 €/mois',
    monthlyNote: 'Maintenance de l\'IA, mise à jour des connaissances métier et optimisation continue.',
    delay: '15 à 20 jours ouvrés',
    targetAudience: 'Entreprises en forte croissance, sociétés de services avec fort volume de sollicitations, et dirigeants souhaitant déléguer le premier niveau de relation client à une IA sur-mesure.',
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
        title: 'Agent IA personnalisé sur mesure (sans hallucination)',
        desc: 'Intelligence artificielle entraînée exclusivement sur vos tarifs, vos zones géographiques et vos conditions de service, avec garde-fous stricts.'
      },
      {
        title: 'Intégration multi-canaux (Site web, WhatsApp, E-mail)',
        desc: 'Votre agent répond avec politesse, précision et sans jargon là où vos clients vous écrivent.'
      },
      {
        title: 'Qualification automatique des demandes & scoring',
        desc: 'L\'IA évalue l\'urgence, le budget estimé et prépare une fiche de synthèse pré-remplie avant votre appel de validation.'
      },
      {
        title: 'Orchestration complète des flux opérationnels',
        desc: 'Connexion directe avec votre planning, votre gestion commerciale et vos alertes SMS d\'urgence.'
      },
      {
        title: 'Tableau de bord de pilotage analytique',
        desc: 'Suivi transparent des conversations de l\'IA, des demandes traitées et des devis déclenchés.'
      },
      {
        title: 'Entraînement & révision continue du modèle',
        desc: 'Chaque mois, nous analysons les cas particuliers rencontrés pour enrichir la base de connaissances de votre agent.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Perte de 35 % des demandes nocturnes et de week-end',
        desc: 'Un client qui pose une question urgente le samedi soir attend rarement le lundi 9h : il contacte le premier concurrent qui lui apporte une réponse immédiate.'
      },
      {
        title: 'Salaire d\'un temps plein de secrétariat téléphonique',
        desc: 'Embaucher une personne dédiée au tri des e-mails répétitifs coûte 30 000 à 40 000 € par an avec les charges belges.'
      },
      {
        title: 'Épuisement mental du dirigeant',
        desc: 'Être dérangé en permanence pour des questions basiques alors que votre valeur ajoutée est sur le terrain et la négociation.'
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
