// Catalogue officiel exhaustif des 14 services Purity Agency
// Structure de données de référence pour les pages de détails, livrables, utilité et coût de l'inaction.

export const services = [
  {
    id: 'M01',
    slug: 'diagnostic-digital',
    name: 'Diagnostic digital (15 min)',
    pillar: 'Pilier 04 · Diagnostic & Cadrage',
    kicker: '15 min en visio · 100 % gratuit · sans engagement',
    headline: 'Identifiez en 15 minutes le point de friction précis qui bloque vos demandes clients.',
    summary: 'Avant d’investir le moindre euro dans un site, des réseaux ou de la publicité, on examine votre présence actuelle et on isole l’action la plus rentable pour votre activité.',
    price: 'Offert',
    priceSetup: '0 €',
    promoSetup: 'Offert',
    promoTag: 'Gratuit · sans engagement',
    monthlyPrice: null,
    monthlyNote: 'Aucun abonnement, aucun moyen de paiement requis.',
    delay: 'Créneau immédiat (15 min)',
    targetAudience: 'Indépendants, artisans, gérants de PME en Wallonie qui hésitent sur la priorité digitale à enclencher ou dont le site actuel ne génère aucun contact.',
    utility: 'Éviter de dépenser des milliers d\'euros dans un outil ou une refonte inutile. Vous obtenez un avis technique et commercial honnête, sans jargon, directement avec Amir Kebiyeb.',
    deliverables: [
      {
        title: 'Audit direct en direct de votre visibilité',
        desc: 'Analyse sur écran partagé de votre site web, de votre fiche Google Maps et de vos réseaux sociaux.'
      },
      {
        title: 'Détection du goulot d\'étranglement',
        desc: 'Identification exacte de ce qui bloque : temps de chargement mobile, manque de clarté de l\'offre, friction sur le formulaire ou invisibilité locale.'
      },
      {
        title: 'Plan d\'action prioritaire chiffré',
        desc: 'Recommandation claire de l\'étape n°1 à réaliser, avec estimation budgétaire exacte sans frais cachés.'
      },
      {
        title: 'Compte-rendu écrit de synthèse',
        desc: 'Un récapitulatif synthétique envoyé par e-mail dans l\'heure suivant l\'échange pour que vous gardiez une trace exploitable.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Dépenses inutiles à l\'aveugle',
        desc: 'Lancer des publicités ou payer un prestataire sans savoir pourquoi vos visiteurs actuels ne convertissent pas.'
      },
      {
        title: 'Mois perdus dans le doute',
        desc: 'Reporter la modernisation de votre activité pendant que vos concurrents locaux captent les recherches Google.'
      },
      {
        title: 'Clients qualifiés non captés',
        desc: 'Continuer à perdre des prospects qui arrivent sur une page mal adaptée aux smartphones.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Réservation en ligne', desc: 'Vous choisissez un créneau de 15 minutes dans l\'agenda d\'Amir selon vos disponibilités.' },
      { step: '02', title: 'Pré-analyse', desc: 'Amir consulte votre site et votre présence en amont pour ne pas perdre une seule minute.' },
      { step: '03', title: 'Échange visio ou appel', desc: '15 minutes chrono de diagnostic chirurgical sans discours commercial agressif.' },
      { step: '04', title: 'Orientation claire', desc: 'Vous repartez avec la priorité exacte à appliquer, que vous travailliez avec nous ou non.' }
    ],
    includedMaintenance: 'Non applicable (service ponctuel gratuit).',
    faq: [
      {
        q: 'Est-ce vraiment 100 % gratuit sans piège ?',
        a: 'Oui. Le diagnostic de 15 minutes est totalement offert et ne vous engage à rien. Il nous permet de valider si nous pouvons réellement vous apporter du chiffre d\'affaires avant d\'émettre la moindre proposition.'
      },
      {
        q: 'De quoi ai-je besoin pour le rendez-vous ?',
        a: 'Rien de particulier : simplement l\'adresse de votre site ou de votre fiche Google s\'ils existent, et vos objectifs (nombre de devis souhaités, secteur géographique).'
      },
      {
        q: 'Que se passe-t-il après les 15 minutes ?',
        a: 'Si une solution Purity est pertinente, nous vous expliquons la formule exacte et son tarif. Si votre situation ne nécessite pas nos services, nous vous le disons en toute franchise.'
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
    summary: 'La solution idéale pour les indépendants qui ont une offre unique et veulent remplacer une page Facebook ou un vieux site par une présence moderne et percutante.',
    price: '490 € + 79 €/mois',
    priceSetup: '490 €',
    promoSetup: '367 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '79 €/mois',
    monthlyNote: 'Hébergement haute vitesse, nom de domaine .be, sécurité SSL, sauvegardes et modifications courantes incluses.',
    delay: '5 à 7 jours ouvrés',
    targetAudience: 'Électriciens, plombiers, consultants, coaches, photographes, réparateurs et prestataires de services qui ont besoin d’un point de contact sérieux et rapide.',
    utility: 'Rassurer immédiatement un prospect qui a entendu parler de vous et lui donner un moyen ultra-simple d\'appeler ou de demander un devis en 30 secondes chrono sur son smartphone.',
    deliverables: [
      {
        title: 'Architecture One-Page optimisée conversion',
        desc: 'Structure linéaire pensée selon les lois de Fitts et de Miller : Promesse forte, Preuves de savoir-faire, Témoignages réels, Tarifs/Services et Formulaire direct.'
      },
      {
        title: 'Design Liquid Glass sur mesure (Dark Theme)',
        desc: 'Identité soignée aux finitions 2026 : typographie General Sans, micro-interactions soignées, zéro template générique ou effet slop.'
      },
      {
        title: 'Vitesse de chargement PageSpeed 95+',
        desc: 'Code vanilla ultra-léger sans CMS lourd, affichage instantané en moins d\'une seconde sur réseau 4G/5G mobile.'
      },
      {
        title: 'Appel en un clic & Bouton WhatsApp',
        desc: 'Bouton d\'appel direct collé en bas d\'écran sur smartphone pour maximiser le taux de contact immédiat.'
      },
      {
        title: 'Nom de domaine .be & Certificat SSL HTTPS',
        desc: 'Configuration complète du domaine officiel de votre entreprise et sécurisation maximale des échanges.'
      },
      {
        title: 'Conformité légale belge & RGPD',
        desc: 'Mentions légales obligatoires (BCE, franchise TVA art. 56bis le cas échéant), politique de confidentialité et sécurité des données.'
      }
    ],
    lossOfInaction: [
      {
        title: '70 % des prospects mobiles perdus',
        desc: 'Sans page rapide et claire, un prospect sur deux quitte votre lien si le chargement dépasse 3 secondes.'
      },
      {
        title: 'Image d\'artisan amateur',
        desc: 'Envoyer une simple page Facebook ou une adresse Gmail gratuite réduit drastiquement la confiance des clients prêts à payer le juste prix.'
      },
      {
        title: 'Zéro conversion le soir et le week-end',
        desc: 'Quand vous êtes sur chantier ou en rendez-vous, vous perdez des demandes qui partent chez le confrère disponible en ligne.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Cadrage de votre offre (20 min)', desc: 'On valide ensemble vos 3 points forts, vos zones d\'intervention et vos photos de réalisations.' },
      { step: '02', title: 'Conception & rédaction', desc: 'Nous rédigeons les textes percutants et intégrons l\'interface Liquid Glass.' },
      { step: '03', title: 'Test sur votre smartphone', desc: 'Vous recevez un lien privé pour tester l\'expérience réelle avant toute mise en ligne.' },
      { step: '04', title: 'Lancement & connexion domaine', desc: 'Votre page est reliée à votre domaine .be et indexée sur Google en 24h.' }
    ],
    includedMaintenance: 'Hébergement sur serveur vert haute performance en Europe, renouvellement annuel de votre nom de domaine .be, certificat SSL HTTPS, surveillance 24/7 et prise en charge de vos modifications de coordonnées ou tarifs.',
    faq: [
      {
        q: 'Puis-je faire évoluer ma page vers un site multi-pages plus tard ?',
        a: 'Absolument. La base technique est modulaire : nous pouvons ajouter des pages de réalisations ou de services quand votre activité grandit sans devoir tout recommencer.'
      },
      {
        q: 'Fournissez-vous les textes ou dois-je tout écrire ?',
        a: 'Nous nous chargeons de la rédaction commerciale et SEO à partir de notre court entretien de cadrage. Vous n\'avez rien à rédiger vous-même.'
      },
      {
        q: 'Y a-t-il un engagement sur le suivi mensuel ?',
        a: 'Engagement initial de 12 mois pour amortir les frais techniques de lancement, résiliable ensuite sur simple demande par e-mail avec un préavis de 30 jours.'
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
    summary: 'La solution la plus populaire : 5 pages complètes et structurées (Accueil, Services, Réalisations, À Propos, Contact & Devis) conçues pour dominer votre zone géographique.',
    price: '1 490 € + 79 €/mois',
    priceSetup: '1 490 €',
    promoSetup: '1 117 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '79 €/mois',
    monthlyNote: 'Hébergement infogéré, domaine, SSL, sauvegardes et modifications courantes incluses.',
    delay: '7 à 10 jours ouvrés',
    targetAudience: 'Entrepreneurs du bâtiment, cabinets médicaux ou juridiques, garages, instituts, agences et PME locales voulant une vitrine d\'exception.',
    utility: 'Positionner votre entreprise comme la référence indiscutable dans votre ville (Charleroi, Namur, Mons, Liège, etc.) et filtrer les demandes pour ne recevoir que des clients qualifiés et solvables.',
    deliverables: [
      {
        title: '5 pages sur mesure complètes',
        desc: 'Page d\'Accueil d\'autorité, Page Services avec fiches d\'intervention, Galerie de Réalisations avant/après, Page Entreprise/Équipe et Contact avec formulaire multi-critères.'
      },
      {
        title: 'Formulaire de devis qualifié',
        desc: 'Un parcours qui demande le type de chantier, le délai souhaité et la commune, pour éliminer les curieux et vous faire gagner du temps.'
      },
      {
        title: 'Structure SEO Local Wallonie',
        desc: 'Optimisation sémantique des balises Hn, métadonnées OpenGraph, maillage interne et balises Schema.org ProfessionalService pour Google.'
      },
      {
        title: 'Galerie interactive Avant / Après',
        desc: 'Curseur interactif de comparaison visuelle (comme sur notre propre site) pour prouver immédiatement la qualité de vos travaux.'
      },
      {
        title: 'Design Liquid Glass & animations fluides',
        desc: 'Interface raffinée, transitions subtiles GSAP respectant les préférences d\'animation, contraste AA accessible.'
      },
      {
        title: 'E-mails professionnels personnalisés',
        desc: 'Configuration de vos adresses pro nom@votre-entreprise.be reliées à votre messagerie habituelle.'
      }
    ],
    lossOfInaction: [
      {
        title: '15 à 30 chantiers perdus par an',
        desc: 'Quand un prospect compare 3 entreprises locales, celle qui a un site obsolète ou absent est systématiquement écartée de la liste finale.'
      },
      {
        title: 'Gaspillage de temps au téléphone',
        desc: 'Répondre 20 fois par semaine aux mêmes questions basiques (tarifs, disponibilités, zones) au lieu de laisser votre site qualifier le besoin.'
      },
      {
        title: 'Perte de crédibilité face aux concurrents récents',
        desc: 'De nouveaux entrants avec un bon marketing digital captent les clients premium pendant que vous comptez uniquement sur le bouche-à-oreille.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Atelier de cadrage (30 min)', desc: 'On cartographie votre catalogue de services, vos réalisations phares et vos cibles prioritaires.' },
      { step: '02', title: 'Architecture & maquettage', desc: 'Nous concevons les 5 pages avec rédaction complète des argumentaires et mise en scène de vos photos.' },
      { step: '03', title: 'Revue collaborative', desc: 'Vous naviguez sur la démo interactive, nous ajustons les moindres détails selon vos retours.' },
      { step: '04', title: 'Mise en ligne & indexation', desc: 'Bascule du domaine, configuration DNS, soumission du sitemap à Google Search Console.' }
    ],
    includedMaintenance: 'Infogérance serveur 24/7, mises à jour de sécurité préventives, sauvegardes quotidiennes chiffrées, intégration de vos nouveaux avis et photos au fil de l\'eau sur simple e-mail.',
    faq: [
      {
        q: 'Puis-je ajouter d\'autres pages plus tard ?',
        a: 'Oui, nous pouvons intégrer de nouvelles pages de services ou d\'articles de blog à tout moment selon un tarif fixé à l\'avance.'
      },
      {
        q: 'Combien de temps dois-je consacrer au projet ?',
        a: 'Environ 45 minutes au total : 30 minutes d\'atelier initial et 15 minutes pour valider la maquette finale. Nous nous occupons de l\'intégralité de la technique et de la rédaction.'
      },
      {
        q: 'Le site m\'appartient-il ?',
        a: 'Oui. Le code, les textes, les visuels et le nom de domaine sont votre entière propriété. Vous n\'êtes jamais pris en otage.'
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
    summary: 'Plus de 10 pages dédiées pour couvrir chacun de vos corps d’état ou villes d’intervention (ex: Charleroi, Namur, Mons, Brabant Wallon) avec un maillage SEO puissant.',
    price: '2 490 € + 149 €/mois',
    priceSetup: '2 490 €',
    promoSetup: '1 867 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '149 €/mois',
    monthlyNote: 'Maintenance avancée, monitoring temps réel, sauvegardes bi-quotidiennes et interventions prioritaires.',
    delay: '12 à 18 jours ouvrés',
    targetAudience: 'Entreprises générales de construction, bureaux d\'études, concessions, réseaux de franchises, cliniques privées et PME en expansion.',
    utility: 'Capturer un volume massif de recherches spécifiques sur Google (ex: "rénovation toiture Charleroi", "isolation façade Namur") avec des pages ultra-pertinentes qui convertissent chaque secteur.',
    deliverables: [
      {
        title: 'Architecture 10 à 15 pages sur mesure',
        desc: 'Siloing thématique complet : pages services ultra-détaillées, silos géographiques régionaux, cas d\'études complets, espace recrutement / carrières.'
      },
      {
        title: 'Stratégie de maillage interne SEO avancé',
        desc: 'Structure de liens internes optimisée pour pousser les pages stratégiques en première position sur les requêtes à forte valeur ajoutée.'
      },
      {
        title: 'Formulaires conditionnels intelligents',
        desc: 'Formulaires dynamiques qui adaptent les questions posées selon le service sélectionné par le prospect pour un pré-chiffrage précis.'
      },
      {
        title: 'Espace Presse / Actualités / Blog',
        desc: 'Moteur de publication performant pour publier vos chantiers récents, conseils d\'experts et nouveautés d\'entreprise.'
      },
      {
        title: 'Tableau de bord statistique privé',
        desc: 'Accès sécurisé et respectueux du RGPD pour suivre vos visites, le taux de conversion et les formulaires reçus en temps réel.'
      },
      {
        title: 'Support technique prioritaire dédié',
        desc: 'Ligne directe et prise en charge de vos demandes sous 24h ouvrées garanties.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Centaines de recherches mensuelles abandonnées aux concurrents',
        desc: 'Un site vitrine basique de 3 pages ne peut pas ranker sur 10 métiers différents : vous laissez le champ libre aux leaders régionaux.'
      },
      {
        title: 'Marges réduites sur les chantiers d\'envergure',
        desc: 'Les clients institutionnels ou à gros budget exigent une assise technique et une structure corporate solide pour signer des contrats à 5 ou 6 chiffres.'
      },
      {
        title: 'Dépendance à la sous-traitance',
        desc: 'Sans génération directe de leads qualifiés sur vos spécialités, vous restez dépendant de tiers qui prennent une marge importante au passage.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Audit stratégique & mot-clés', desc: 'Étude sémantique des volumes de recherche en Wallonie et découpage de l\'arborescence.' },
      { step: '02', title: 'Production des contenus & design', desc: 'Rédaction experte de chaque fiche métier et création de l\'univers visuel.' },
      { step: '03', title: 'Recette & intégration des flux', desc: 'Tests de charge, vérification du tracking analytics et validation des formulaires.' },
      { step: '04', title: 'Déploiement & plan d\'indexation', desc: 'Mise en production sécurisée avec surveillance de l\'indexation URL par URL.' }
    ],
    includedMaintenance: 'Supervision continue, audit de sécurité mensuel, sauvegardes chiffrées automatiques, support prioritaire sous 24h et 2h de modifications graphiques ou de contenus incluses chaque mois.',
    faq: [
      {
        q: 'Combien de pages exactes comprend l\'offre ?',
        a: 'L\'offre standard comprend jusqu\'à 15 pages complètes rédigées et intégrées. Les pages supplémentaires peuvent être ajoutées par lots selon vos besoins.'
      },
      {
        q: 'Garantissez-vous la première place sur Google ?',
        a: 'Aucune agence sérieuse ne peut promettre contractuellement une position n°1 garantie. En revanche, nous appliquons rigoureusement les meilleures pratiques techniques, sémantiques et d\'autorité qui amènent nos clients dans le top 3 local.'
      },
      {
        q: 'Qui s\'occupe des photos de nos chantiers ?',
        a: 'Vous nous transmettez vos photos brutes même prises au smartphone. Nous les optimisons, les recadrons et améliorons leur colorimétrie avec nos outils studio.'
      }
    ]
  },
  {
    id: 'M06',
    slug: 'boutique-en-ligne',
    name: 'Boutique en ligne (E-commerce)',
    pillar: 'Pilier 01 · Sites Web & Référencement',
    kicker: 'Vente 24h/24 · Paiement Bancontact & CB · Sans commissions excessives',
    headline: 'Votre boutique e-commerce moderne, rapide et autonome pour vendre vos produits en Belgique et en Europe sans friction.',
    summary: 'Une boutique en ligne élégante, connectée aux moyens de paiement préférés des Belges (Bancontact, Payconiq, Apple Pay, Cartes), optimisée pour convertir sur mobile.',
    price: '3 990 € + 149 €/mois',
    priceSetup: '3 990 €',
    promoSetup: '2 992 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '149 €/mois',
    monthlyNote: 'Sécurité bancaire, monitoring des paiements, maintenance des passerelles et support technique.',
    delay: '15 à 25 jours ouvrés',
    targetAudience: 'Commerçants, artisans créateurs, producteurs locaux, marques de cosmétiques ou de mode, et distributeurs cherchant un canal de vente directe sans commissions exorbitantes.',
    utility: 'Encaisser des commandes 7j/7 et 24h/24 avec un panier fluide en 3 clics, un suivi des stocks transparent et une expérience d\'achat haut de gamme qui fidélise.',
    deliverables: [
      {
        title: 'Boutique complète jusqu\'à 100 produits',
        desc: 'Fiches produits attrayantes avec variantes (tailles, coloris), galeries photos zoomables, avis clients et produits suggérés.'
      },
      {
        title: 'Passerelle de paiement sécurisée belge',
        desc: 'Intégration directe de Bancontact, Payconiq, Carte Bancaire, Apple Pay et Google Pay via Stripe ou Mollie sans intermédiaire douteux.'
      },
      {
        title: 'Tunnel d\'achat optimisé sans abandon de panier',
        desc: 'Checkout express en une page (One-Step Checkout) réduisant la friction et augmentant le taux de commande de +25 %.'
      },
      {
        title: 'Gestion des livraisons & Click and Collect',
        desc: 'Configuration des frais de port par zone géographique (Belgique, France, Luxembourg), points relais (Bpost, Mondial Relay) et retrait en boutique.'
      },
      {
        title: 'E-mails transactionnels automatisés',
        desc: 'Confirmation de commande, notification d\'expédition avec suivi de colis et relance automatique des paniers abandonnés.'
      },
      {
        title: 'Formation vidéo complète à la gestion',
        desc: 'Tutoriel personnalisé de 20 minutes pour apprendre à ajouter vos nouveaux produits, gérer vos stocks et imprimer vos étiquettes en toute simplicité.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Ventes limitées aux heures d\'ouverture physique',
        desc: 'Pendant que votre commerce est fermé, 42 % des achats en ligne se font entre 20h et minuit sur les plateformes concurrentes.'
      },
      {
        title: 'Racket des commissions de marketplaces',
        desc: 'Vendre sur des plateformes tierces qui prélèvent entre 15 % et 30 % de commission sur votre chiffre d\'affaires au lieu de posséder votre canal direct.'
      },
      {
        title: 'Perte définitive de vos clients fidèles',
        desc: 'Un client qui ne peut pas réapprovisionner facilement ses produits préférés en ligne finit par commander sur Amazon.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Structure catalogue & paiements', desc: 'Paramétrage de vos catégories, de vos modes de livraison et connexion de votre compte bancaire.' },
      { step: '02', title: 'Design & intégration produits', desc: 'Mise en valeur visuelle de vos produits et conception du parcours d\'achat.' },
      { step: '03', title: 'Phase de tests de commande réels', desc: 'Simulations d\'achats complets en conditions réelles avec paiements réels de 1 € pour valider le flux.' },
      { step: '04', title: 'Lancement & session de formation', desc: 'Ouverture officielle de la boutique et prise en main guidée pour traiter vos premières commandes.' }
    ],
    includedMaintenance: 'Maintenance des passerelles bancaires et des protocoles de sécurité TLS/SSL, sauvegardes continues des commandes et de la base de données clients, assistance technique rapide en cas de bug de paiement.',
    faq: [
      {
        q: 'Prenez-vous une commission sur mes ventes ?',
        a: 'Absolument aucune commission ! Seuls s\'appliquent les frais bancaires standards de la passerelle de paiement (ex: Mollie ou Stripe, environ 0,25 € par transaction Bancontact).'
      },
      {
        q: 'Est-il facile d\'ajouter un produit moi-même ?',
        a: 'Très facile. Nous configurons une interface d\'administration intuitive où vous ajoutez un produit en 2 minutes chrono (photos, prix, stock, description).'
      },
      {
        q: 'Comment sont gérées les factures conformes en Belgique ?',
        a: 'Le système génère automatiquement des factures PDF numérotées avec votre numéro d\'entreprise, le taux de TVA applicable et les coordonnées complètes de l\'acheteur.'
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
    summary: 'Votre site a plus de 4 ans, ne ressemble à rien sur smartphone ou ne génère aucun appel ? Nous le reconstruisons de fond en comble en conservant vos adresses et votre référencement acquis.',
    price: '890 à 2 490 € + 79 €/mois',
    priceSetup: 'dès 890 €',
    promoSetup: 'dès 667 €',
    promoTag: '-25 % 24h',
    monthlyPrice: '79 €/mois',
    monthlyNote: 'Hébergement, maintenance et garantie zéro régression SEO.',
    delay: '7 à 14 jours ouvrés',
    targetAudience: 'Entreprises établies qui ont déjà un site existant (WordPress, Wix ou fait maison) mais qui ont honte de le montrer à leurs clients.',
    utility: 'Multiplier immédiatement votre taux de conversion par 3 sans perdre votre historique, vos liens externes ni vos positions actuelles sur Google.',
    deliverables: [
      {
        title: 'Audit complet de l\'existant',
        desc: 'Inventaire précis de toutes vos URLs, mots-clés qui vous amènent du trafic et points faibles de conversion de l\'ancienne version.'
      },
      {
        title: 'Plan de redirections 301 strict',
        desc: 'Garantie absolue de zéro perte de trafic : chaque ancienne adresse est redirigée proprement pour conserver votre autorité Google.'
      },
      {
        title: 'Refonte graphique Liquid Glass 2026',
        desc: 'Modernisation visuelle totale : finitions soignées, typographies actuelles, mise en valeur de vos compétences réelles.'
      },
      {
        title: 'Nettoyage du code & accélération',
        desc: 'Suppression des 40 plugins obsolètes, des thèmes lourds et du code inutile pour un temps de réponse divisé par 4.'
      },
      {
        title: 'Modernisation des formulaires de contact',
        desc: 'Remplacement des vieux formulaires austères par des parcours dynamiques avec confirmation visuelle immédiate.'
      },
      {
        title: 'Mise en conformité RGPD & Sécurité',
        desc: 'Élimination des failles de sécurité courantes des vieux sites et mise en règle des bandeaux de consentement.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Chute inexorable dans les classements Google',
        desc: 'Google pénalise activement les sites qui échouent aux tests Core Web Vitals (lenteur, sauts de mise en page sur mobile).'
      },
      {
        title: 'Risque de piratage massif sur vieux WordPress',
        desc: 'Les sites aux extensions non mises à jour sont la cible n°1 des robots pirates (injections de spams, vol de données, blocage complet).'
      },
      {
        title: 'Taux de rebond de 80 %',
        desc: '8 visiteurs sur 10 repartent immédiatement s\'ils tombent sur un design qui ressemble aux années 2012.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Extraction des contenus utiles', desc: 'Nous récupérons vos textes, logos et visuels de qualité de l\'ancien site.' },
      { step: '02', title: 'Développement sur environnement privé', desc: 'Votre ancien site reste 100 % en ligne pendant que nous construisons le nouveau en coulisses.' },
      { step: '03', title: 'Validation comparative', desc: 'Vous comparez les deux versions et validez la nouvelle mouture.' },
      { step: '04', title: 'Bascule instantanée sans coupure', desc: 'Migration DNS fluide en quelques minutes avec application instantanée du plan de redirection 301.' }
    ],
    includedMaintenance: 'Surveillance anti-panne, gestion des redirections, hébergement moderne et réactif, assistance technique et modifications de routine.',
    faq: [
      {
        q: 'Mon ancien site sera-t-il coupé pendant les travaux ?',
        a: 'Non, jamais. Votre site actuel reste en ligne et continue de recevoir vos clients jusqu\'à la minute exacte où nous activons le nouveau.'
      },
      {
        q: 'Vais-je perdre mes adresses e-mails professionnelles ?',
        a: 'Non, nous configurons les enregistrements MX et DNS avec une précision chirurgicale pour qu\'aucun e-mail ne soit perdu lors de la transition.'
      },
      {
        q: 'Mon classement Google va-t-il chuter ?',
        a: 'Au contraire. Grâce à notre plan strict de redirections 301 et au gain massif de vitesse, la majorité de nos clients constatent une remontée de leurs positions dans les 3 semaines.'
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
    summary: 'Optimisation chirurgicale de votre fiche Google Business Profile pour apparaître dans le pack local de 3 résultats de Google et déclencher des appels téléphoniques quotidiens.',
    price: '290 €',
    priceSetup: '290 €',
    promoSetup: '217 €',
    promoTag: '-25 % 24h',
    monthlyPrice: null,
    monthlyNote: 'Paiement unique, sans abonnement obligatoire.',
    delay: '3 à 5 jours ouvrés',
    targetAudience: 'Commerces physiques, dépanneurs, artisans mobiles, restaurants, professions libérales et cabinets locaux.',
    utility: 'Capter le trafic de proximité le plus chaud : des personnes prêtes à acheter ou à appeler immédiatement dans un rayon de 10 à 30 km autour de votre atelier.',
    deliverables: [
      {
        title: 'Revendication & validation complète de la fiche',
        desc: 'Audit de statut, vérification auprès de Google et sécurisation de la propriété de votre établissement.'
      },
      {
        title: 'Optimisation des catégories principales et secondaires',
        desc: 'Sélection des catégories exactes d\'activité les plus recherchées par l\'algorithme Google en Belgique.'
      },
      {
        title: 'Rédaction optimisée de la description d\'établissement',
        desc: 'Texte attractif de 750 caractères intégrant vos mots-clés prioritaires, zones desservies et arguments de réassurance.'
      },
      {
        title: 'Création du catalogue de services & produits',
        desc: 'Ajout de chacun de vos services avec descriptif clair, tarifs indicatifs et liens vers votre site ou WhatsApp.'
      },
      {
        title: 'Stratégie de collecte d\'avis 5 étoiles & QR Code',
        desc: 'Fourniture de votre lien direct d\'avis court + création d\'un QR code prêt à imprimer pour récolter des avis de vos clients satisfaits.'
      },
      {
        title: 'Nettoyage des doublons & signaux de cohérence NAP',
        desc: 'Harmonisation du Nom, Adresse et Téléphone pour éviter toute pénalité de classement de Google.'
      }
    ],
    lossOfInaction: [
      {
        title: 'Invisibilité totale pour 65 % des recherches mobiles',
        desc: 'Sur smartphone, 2 personnes sur 3 appellent directement depuis la carte Google Maps sans même ouvrir de site web.'
      },
      {
        title: 'Avis négatifs sans réponse qui plombent votre réputation',
        desc: 'Une fiche non gérée laisse des clients mécontents sans réponse constructive, faisant fuir les nouveaux prospects.'
      },
      {
        title: 'Informations erronées et clients devant porte close',
        desc: 'Horaires faux ou mauvaise adresse sur Google qui envoient vos clients chez le concurrent ouvert à côté.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Audit d\'accès', desc: 'Vous nous donnez accès comme gestionnaire à votre fiche existante ou nous la créons ensemble.' },
      { step: '02', title: 'Restructuration complète', desc: 'Nous renseignons l\'ensemble des champs techniques, balisons les zones et ajoutons vos services.' },
      { step: '03', title: 'Photos & identité', desc: 'Intégration de photos professionnelles valorisant vos locaux, votre équipe et votre savoir-faire.' },
      { step: '04', title: 'Remise du kit d\'avis', desc: 'Vous recevez vos accès propres et votre kit pour booster vos avis clients chaque semaine.' }
    ],
    includedMaintenance: 'Service ponctuel sans abonnement. Possibilité de souscrire à notre accompagnement mensuel Réseaux & Google pour la publication régulière de posts.',
    faq: [
      {
        q: 'Je n\'ai pas d\'adresse physique pour accueillir du public, est-ce possible ?',
        a: 'Oui. Google permet de créer une fiche en zone de desserte (ex: "Artisan itinérant couvrant Charleroi et 30 km aux alentours"), sans afficher votre adresse privée.'
      },
      {
        q: 'En combien de temps voit-on les effets sur les appels ?',
        a: 'La mise à jour technique est effective en 48h. L\'impact sur le classement local et les appels se fait généralement ressentir entre 10 et 20 jours après l\'optimisation.'
      },
      {
        q: 'Puis-je supprimer des avis injustes ?',
        a: 'Nous vous accompagnons pour signaler les faux avis contraires aux règles de Google et nous vous aidons à rédiger des réponses professionnelles pour désamorcer les avis litigieux.'
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
    monthlyNote: 'Paiement unique, fichiers sources et droits d\'exploitation 100 % cédés.',
    delay: '7 à 10 jours ouvrés',
    targetAudience: 'Créateurs d\'entreprise, indépendants en phase de repositionnement ou PME dont le logo actuel est pixelisé, démodé ou créé sous Word.',
    utility: 'Inspirer un respect professionnel instantané dès le premier contact et justifier des devis plus élevés auprès d\'une clientèle plus exigeante.',
    deliverables: [
      {
        title: '3 pistes créatives uniques et argumentées',
        desc: 'Propositions originales conçues selon votre positionnement, sans aucune icône générique de banque d\'images.'
      },
      {
        title: 'Logo final décliné sous tous les formats',
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
        title: 'Fichiers prêts pour flocage & signalétique',
        desc: 'Gabarits préparés pour vos véhicules utilitaires, cartes de visite, vêtements de travail ou enseigne de façade.'
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
        desc: 'Fournir un logo flou ou mal calibré à un imprimeur qui donne un résultat désastreux sur vos camionnettes ou vos bâches.'
      },
      {
        title: 'Confusion dans l\'esprit du public',
        desc: 'Avoir un logo différent sur Facebook, votre camion et vos factures détruit la mémorisation de votre marque.'
      }
    ],
    howItWorks: [
      { step: '01', title: 'Questionnaire de style (15 min)', desc: 'Vous partagez vos préférences, vos concurrents directs et les valeurs phares de votre métier.' },
      { step: '02', title: 'Présentation de 3 axes', desc: 'Amir vous présente 3 concepts distincts avec simulation sur supports réels (cartes, t-shirts, mobile).' },
      { step: '03', title: 'Affinage de la piste retenue', desc: 'Jusqu\'à 2 séries d\'ajustements sur les couleurs, les formes et la typographie choisie.' },
      { step: '04', title: 'Remise du dossier complet', desc: 'Téléchargement d\'une archive organisée avec tous les formats professionnels classés.' }
    ],
    includedMaintenance: 'Livraison clé en main définitive. Les fichiers restent archivés chez nous à vie en cas de perte de votre côté.',
    faq: [
      {
        q: 'Puis-je protéger mon logo à l\'OBPI (Office Benelux de la Propriété Intellectuelle) ?',
        a: 'Oui. Tous nos logos sont créés sur mesure et vectorisés selon les normes d\'enregistrement des marques.'
      },
      {
        q: 'Fournissez-vous les cartes de visite imprimées ?',
        a: 'Nous vous livrons le fichier PDF d\'impression conforme avec traits de coupe et marges perdues, prêt à être envoyé à votre imprimeur local ou en ligne (ex: VistaPrint ou imprimeur carolo).'
      },
      {
        q: 'Que se passe-t-il si aucune des 3 pistes ne me plaît ?',
        a: 'Notre cadrage initial est si précis que cela n\'arrive quasiment jamais. Si c\'est le cas, nous analysons ce qui a manqué et concevons un axe supplémentaire corrigé.'
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
    summary: 'Création de visuels percutants et de 4 vidéos courtes au format Reels/TikTok pour mettre en lumière votre savoir-faire avec un montage dynamique et professionnel.',
    price: '390 €',
    priceSetup: '390 €',
    promoSetup: '292 €',
    promoTag: '-25 % 24h',
    monthlyPrice: null,
    monthlyNote: 'Pack ponctuel sans abonnement, réutilisable sur tous vos canaux.',
    delay: '5 à 7 jours ouvrés',
    targetAudience: 'Restaurants, commerces de bouche, instituts esthétiques, coachs sportifs et artisans réalisant des avant/après spectaculaires.',
    utility: 'Générer de l\'engagement rapide et multiplier par 5 la portée de vos publications grâce aux formats vidéo verticaux privilégiés par les algorithmes.',
    deliverables: [
      {
        title: '4 Reels / TikToks verticaux (9:16) montés',
        desc: 'Montage dynamique, accroche visuelle dès les 2 premières secondes, transitions soignées, musique tendance libre de droit.'
      },
      {
        title: 'Sous-titrage animé synchronisé',
        desc: '80 % des vidéos sont regardées sans son : nous ajoutons des sous-titres animés lisibles pour maximiser la rétention.'
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
    includedMaintenance: 'Pack créatif sans récurrence. Possibilité de renouveler chaque mois ou de basculer sur notre offre M16 (Gestion complète 3x/semaine).',
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
    targetAudience: 'Artisans débordés, gérants de commerces, restaurants et dirigeants de PME qui n\'ont pas le temps de poster régulièrement.',
    utility: 'Montrer chaque semaine à vos prospects et clients que votre entreprise est active, réactive et en pleine croissance, tout en restant concentré à 100 % sur vos chantiers et votre métier.',
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
    targetAudience: 'Indépendants et artisans qui passent leurs soirées à répondre à des e-mails, relancer des devis non signés ou fixer des rendez-vous par SMS.',
    utility: 'Récupérer immédiatement entre 3 et 6 heures de temps libre chaque semaine et répondre aux demandes 10 fois plus vite que vos concurrents.',
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
    targetAudience: 'PME, cabinets de conseil, entreprises du bâtiment avec plusieurs équipes, et sociétés recevant plus de 10 demandes par semaine.',
    utility: 'Structurer votre entreprise comme une machine bien huilée : chaque demande web crée automatiquement la fiche client, le dossier dans votre CRM et génère l\'ébauche de devis.',
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
