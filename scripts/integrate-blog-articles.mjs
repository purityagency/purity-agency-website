import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

const siteUrl = 'https://purity-agency.be';

const oldArticles = [
  {
    slug: 'article-cheques-entreprises-wallonie',
    category: 'Financement',
    title: 'Chèques-Entreprises : ce qui change pour les projets numériques',
    description: 'Le point sur les aides wallonnes et les vérifications à faire avant de les intégrer à un projet digital.',
    date: '2026-09-24',
    meta: '4 min · 24 septembre 2026'
  },
  {
    slug: 'article-site-ne-convertit-pas',
    category: 'Conversion',
    title: 'Votre site ne convertit pas : 7 raisons fréquentes',
    description: 'Les fuites les plus courantes entre une visite et une demande, et comment les repérer sans tout refaire.',
    date: '2026-03-20',
    meta: '11 min · 20 mars 2026'
  },
  {
    slug: 'article-ia-pme-belgique',
    category: 'IA & automatisation',
    title: 'L’IA pour les indépendants et PME : par où commencer ?',
    description: 'Une approche pragmatique pour automatiser un vrai point de friction sans promettre de remplacer l’humain.',
    date: '2026-03-05',
    meta: '10 min · 5 mars 2026'
  },
  {
    slug: 'article-seo-local-wallonie',
    category: 'SEO local',
    title: 'Être trouvé à Charleroi et en Wallonie : le guide du SEO local',
    description: 'Fiche Google, avis, présence locale et site mobile : les bases qui aident vos clients à vous choisir.',
    date: '2026-02-15',
    meta: '11 min · 15 février 2026'
  },
  {
    slug: 'article-prix-site-web-belgique',
    category: 'Budget & prix',
    title: 'Combien coûte un site web professionnel en Belgique en 2026 ?',
    description: 'Vitrine, site sur mesure, e-commerce : ce qui change vraiment le budget et les questions à poser avant de signer.',
    date: '2026-02-10',
    meta: '12 min · 10 février 2026'
  }
];

const newArticles = [
  {
    slug: 'article-google-business-profile-suspendu-recuperation',
    category: 'SEO local',
    title: 'Google Business Profile suspendu : comment l’éviter et récupérer sa fiche',
    seoTitle: 'Fiche Google Business Profile suspendue : causes et solutions | Purity Agency',
    description: 'Les erreurs qui déclenchent une suspension Google Business Profile et la méthode pour remettre une fiche locale en conformité.',
    date: '2026-09-18',
    meta: '8 min · 18 septembre 2026',
    lead: 'Une fiche Google suspendue, ce n’est pas un détail technique. Pour un commerce local, un artisan ou une PME, c’est parfois la disparition immédiate des appels, des itinéraires et d’une partie de la confiance.',
    sections: [
      ['Ce qui déclenche souvent la suspension', 'Google suspend rarement une fiche “au hasard”. Les causes les plus fréquentes sont un nom d’établissement gonflé avec des mots-clés, une adresse qui ne correspond pas à un vrai lieu de réception, plusieurs fiches pour la même activité ou une catégorie choisie pour manipuler la visibilité plutôt que décrire le métier réel. Le réflexe à éviter : modifier dix éléments dans la panique. Chaque changement ajoute du bruit au dossier.'],
      ['Remettre la fiche en conformité avant l’appel', 'Avant de demander une révision, il faut corriger ce qui peut bloquer : nom strictement identique à l’enseigne, adresse cohérente, zone de service propre, photos réelles, horaires plausibles et catégories claires. Une demande de révision envoyée trop tôt peut rallonger le délai, car Google réexamine une fiche encore fragile.'],
      ['Documenter la réalité de l’entreprise', 'Préparez les preuves utiles : extrait BCE, facture récente, photo de devanture si vous recevez du public, site cohérent avec le nom, coordonnées identiques sur vos pages et annuaires. Le but n’est pas de plaider fort, mais de rendre l’établissement vérifiable.'],
      ['La prévention reste moins chère que la récupération', 'Une fiche locale doit être traitée comme un actif commercial. Mieux vaut la construire proprement dès le départ que courir après une suspension en pleine saison. Chez Purity, on préfère sécuriser le socle : fiche, site, coordonnées, avis et pages locales doivent raconter la même réalité.']
    ],
    cta: ['Vous voulez sécuriser votre visibilité locale ?', '/contact.html?service=seo-local', 'Faire vérifier ma présence locale']
  },
  {
    slug: 'article-mots-cles-large-google-ads-perte-budget',
    category: 'Publicité',
    title: 'Google Ads : pourquoi les mots-clés larges vident le budget des PME',
    seoTitle: 'Requête large Google Ads : l’erreur qui coûte cher aux PME | Purity Agency',
    description: 'Pourquoi la requête large Google Ads peut gaspiller un budget local et comment reprendre le contrôle avec les bons réglages.',
    date: '2026-09-03',
    meta: '7 min · 3 septembre 2026',
    lead: 'Quand un budget Google Ads disparaît sans demandes sérieuses derrière, le problème vient rarement du bouton “lancer la campagne”. Il vient souvent du niveau de contrôle laissé à Google.',
    sections: [
      ['Le piège de la requête large', 'La requête large donne beaucoup de liberté à Google. C’est utile pour explorer un marché, mais dangereux quand le budget est limité. Une entreprise qui vise “plombier Charleroi” peut payer des clics sur des recherches de formation, de salaire, de prix trop bas ou de documents administratifs. Le trafic existe, mais l’intention commerciale n’est pas là.'],
      ['Regarder les termes de recherche, pas seulement les mots-clés', 'Le vrai audit se fait dans le rapport des termes de recherche. C’est là que l’on voit ce que les internautes ont réellement tapé avant de cliquer. Les surprises sont souvent violentes : demandes hors zone, intentions informatives, concurrents, recrutements, recherches gratuites.'],
      ['Les négatifs sauvent la rentabilité', 'Une campagne saine possède une liste vivante de mots-clés négatifs : “emploi”, “formation”, “gratuit”, “salaire”, “occasion”, “pdf”, selon le secteur. Ce nettoyage ne se fait pas une fois au lancement. Il se fait chaque semaine au début, puis régulièrement quand la campagne mûrit.'],
      ['Une bonne campagne accepte de perdre du volume', 'Le but n’est pas d’obtenir le maximum de clics. Le but est de payer pour les clics qui peuvent devenir des conversations utiles. Une campagne plus petite, mieux ciblée et mieux mesurée bat souvent une campagne large qui donne l’illusion de bouger.']
    ],
    cta: ['Votre budget pub part trop vite ?', '/contact.html?service=campagnes', 'Auditer mes campagnes']
  },
  {
    slug: 'article-cacher-prix-site-web-conversion',
    category: 'Conversion',
    title: 'Cacher ses prix sur son site : pourquoi cela fait fuir les bons prospects',
    seoTitle: 'Pourquoi ne pas afficher ses prix détruit la conversion web | Purity Agency',
    description: 'Afficher des prix ou des fourchettes rassure, filtre et qualifie mieux les demandes entrantes.',
    date: '2026-08-22',
    meta: '6 min · 22 août 2026',
    lead: '“Demandez un devis” peut être utile. Mais quand c’est la seule information disponible, le visiteur ne sait pas s’il entre dans une conversation sérieuse ou dans une perte de temps.',
    sections: [
      ['L’opacité crée de la friction', 'Sur internet, personne n’a envie de remplir un formulaire pour découvrir que le budget est hors sujet. Même si chaque projet est différent, le visiteur cherche un ordre de grandeur. Sans repère, il compare ailleurs.'],
      ['Les prix filtrent sans fermer la porte', 'Afficher des forfaits, des prix de départ ou des fourchettes ne bloque pas les projets spécifiques. Cela évite surtout les demandes impossibles, les devis fantômes et les échanges avec des personnes qui n’ont pas du tout le bon niveau de budget.'],
      ['La transparence devient un signal de confiance', 'Une entreprise qui explique ses prix montre qu’elle assume sa valeur. Elle donne aussi au visiteur une base pour décider : ce qui est compris, ce qui fait varier le budget, ce qui est mensuel, ce qui est optionnel.'],
      ['Le bon format : clair, mais pas rigide', 'La meilleure page tarifs n’est pas un catalogue infini. Elle montre quelques portes d’entrée, explique les cas concrets et invite à cadrer le besoin. C’est exactement le rôle des repères : aider le prospect à comprendre avant de parler.']
    ],
    cta: ['Vous voulez des prix plus clairs sans vous enfermer ?', '/contact.html?service=conversion', 'Revoir ma stratégie de conversion']
  },
  {
    slug: 'article-core-web-vitals-impact-chiffre-affaires',
    category: 'Performance',
    title: 'Core Web Vitals : pourquoi la technique peut coûter du chiffre d’affaires',
    seoTitle: 'Core Web Vitals : pourquoi la technique de votre site impacte vos ventes | Purity Agency',
    description: 'LCP, INP et CLS expliqués simplement : pourquoi un site lent ou instable perd des prospects avant même le formulaire.',
    date: '2026-08-06',
    meta: '8 min · 6 août 2026',
    lead: 'Les Core Web Vitals ont des noms de tableau de bord technique. Pourtant, ils décrivent quelque chose de très simple : est-ce que votre site répond vite, reste stable et donne envie de continuer ?',
    sections: [
      ['LCP : le visiteur attend-il trop longtemps ?', 'Le Largest Contentful Paint mesure le moment où le contenu principal devient visible. Si le titre, l’image ou le bloc central arrive trop tard, le visiteur pense que le site est lourd ou cassé. Sur mobile, quelques secondes suffisent pour perdre une demande.'],
      ['INP : le site répond-il au clic ?', 'L’Interaction to Next Paint mesure la réactivité après une interaction. Un bouton qui semble ne rien faire, un menu qui tarde ou un formulaire lent crée une hésitation immédiate. La conversion commence souvent par une micro-réponse fluide.'],
      ['CLS : la page bouge-t-elle au mauvais moment ?', 'Le Cumulative Layout Shift mesure les décalages inattendus. Une image qui charge et pousse un bouton, une bannière qui apparaît trop tard, un formulaire qui saute : ce sont de petites frustrations qui donnent une impression d’amateurisme.'],
      ['La performance est une promesse silencieuse', 'Un site rapide ne garantit pas une vente. Mais un site lent peut empêcher une bonne offre d’être lue. La technique doit soutenir le message, pas voler l’attention.']
    ],
    cta: ['Votre site semble beau mais lent ?', '/contact.html?service=conversion', 'Demander un audit technique']
  },
  {
    slug: 'article-recuperer-paniers-abandones-emails-e-commerce',
    category: 'E-commerce',
    title: 'Paniers abandonnés : la séquence d’e-mails qui récupère des ventes',
    seoTitle: 'Paniers abandonnés e-commerce : la séquence d’e-mails qui convertit | Purity Agency',
    description: 'Une séquence simple en trois temps pour relancer les paniers abandonnés sans harceler le client.',
    date: '2026-07-19',
    meta: '7 min · 19 juillet 2026',
    lead: 'Un panier abandonné n’est pas toujours un refus. Souvent, c’est une hésitation, une distraction ou une question non résolue au moment du paiement.',
    sections: [
      ['Premier e-mail : rappeler sans brader', 'Le premier message doit arriver rapidement et rester factuel : le panier est encore disponible, les produits sont rappelés, le lien ramène directement au checkout. Pas besoin de réduction immédiate. Une remise trop rapide apprend au client à attendre.'],
      ['Deuxième e-mail : traiter l’objection', 'Après 24 heures, l’achat bloqué a souvent besoin de réassurance : retours, livraison, avis, service client, délai, sécurité du paiement. Le message doit répondre aux peurs, pas répéter “achetez maintenant”.'],
      ['Troisième e-mail : créer le dernier déclic', 'Après 48 à 72 heures, l’intention refroidit. Une livraison offerte, un rappel de stock ou une offre limitée peut aider, à condition de rester vrai. La fausse urgence abîme la confiance.'],
      ['Le cadre légal et technique compte', 'En Belgique et en Europe, la collecte de l’e-mail, le consentement et la configuration de l’outil doivent être propres. Une bonne automatisation n’est pas seulement un texte : c’est un scénario, des règles, une mesure et une sortie claire.']
    ],
    cta: ['Vous perdez des ventes après le panier ?', '/contact.html?service=relances', 'Automatiser mes relances']
  },
  {
    slug: 'article-site-one-page-ou-multi-pages-lancement',
    category: 'Stratégie web',
    title: 'One-page ou site multi-pages : que choisir pour lancer son activité ?',
    seoTitle: 'One-page vs multi-pages : le meilleur choix pour votre lancement | Purity Agency',
    description: 'Le choix entre une landing page et un site structuré dépend du besoin de conversion, de SEO et d’évolution.',
    date: '2026-07-02',
    meta: '7 min · 2 juillet 2026',
    lead: 'Un site one-page peut être parfait pour lancer vite. Il peut aussi devenir une limite si votre activité doit être trouvée sur plusieurs besoins, zones ou services.',
    sections: [
      ['Le one-page : simple, rapide, contrôlé', 'Une page unique fonctionne bien pour une offre précise, une campagne, un lancement ou un indépendant qui veut valider une première demande. Le récit est linéaire, le coût reste contenu et l’expérience mobile peut être très fluide.'],
      ['La limite : une seule page ne peut pas tout porter', 'Une URL unique ne peut pas répondre sérieusement à dix intentions de recherche différentes. Si vous proposez plusieurs services, chaque sujet mérite souvent sa propre page pour être compris par Google et par le visiteur.'],
      ['Le multi-pages : plus stratégique pour grandir', 'Un site multi-pages structure l’activité : accueil, services, cas, contact, contenus utiles. Chaque page peut traiter une question précise, recevoir des liens internes et devenir une porte d’entrée. C’est plus long à concevoir, mais plus durable.'],
      ['Le bon choix : commencer juste, prévoir la suite', 'On peut commencer par une page solide et prévoir une architecture extensible. L’erreur n’est pas de faire simple. L’erreur est de faire simple sans penser à ce qui devra arriver après.']
    ],
    cta: ['Vous lancez une activité et hésitez sur le format ?', '/contact.html?service=conversion', 'Choisir la bonne structure']
  },
  {
    slug: 'article-gerer-avis-client-negatif-google',
    category: 'Réputation',
    title: 'Avis négatif sur Google : répondre sans envenimer la situation',
    seoTitle: 'Répondre à un avis Google négatif : méthode pour PME locales | Purity Agency',
    description: 'Une méthode simple pour répondre à un avis négatif, protéger sa réputation et montrer son sérieux aux futurs clients.',
    date: '2026-06-17',
    meta: '6 min · 17 juin 2026',
    lead: 'Un avis négatif fait rarement plaisir. Mais la réponse publique compte parfois plus que la note elle-même : elle montre aux futurs clients comment vous gérez un problème.',
    sections: [
      ['Ne répondez pas à chaud', 'Une réponse défensive peut transformer un incident isolé en preuve publique de mauvaise gestion. Prenez le temps de relire, de vérifier les faits et de distinguer un vrai problème client d’un avis abusif.'],
      ['Répondez pour le prochain lecteur', 'La réponse ne s’adresse pas seulement à la personne mécontente. Elle s’adresse surtout aux futurs clients qui liront l’échange. Soyez calme, précis, professionnel et proposez une voie de résolution hors ligne.'],
      ['Ce qu’il faut éviter', 'Évitez les accusations, les détails personnels, les longs débats et les phrases passives-agressives. Même si le client exagère, votre réponse doit rester plus solide que l’avis.'],
      ['Transformer l’incident en signal de confiance', 'Une entreprise qui reconnaît un problème, explique brièvement et propose de corriger inspire souvent plus confiance qu’une fiche parfaite mais froide. La réputation locale se construit aussi dans les moments inconfortables.']
    ],
    cta: ['Votre image locale manque de méthode ?', '/contact.html?service=presence-marque', 'Structurer ma réputation']
  },
  {
    slug: 'article-mots-cles-faible-volume-seo-b2b',
    category: 'SEO',
    title: 'Mots-clés à faible volume : la stratégie SEO des niches B2B',
    seoTitle: 'Mots-clés à faible volume : stratégie SEO rentable en B2B | Purity Agency',
    description: 'Pourquoi des requêtes avec peu de volume peuvent générer de meilleures demandes qu’un mot-clé très concurrentiel.',
    date: '2026-06-04',
    meta: '7 min · 4 juin 2026',
    lead: 'Un mot-clé à faible volume n’est pas forcément un mauvais mot-clé. En B2B, il peut même signaler une intention très précise et très proche de l’achat.',
    sections: [
      ['Le volume ne dit pas tout', 'Les outils SEO affichent des volumes moyens. Ils ne montrent pas toujours la valeur commerciale d’une recherche. “Logiciel devis menuiserie Belgique” peut avoir peu de volume, mais une personne qui tape cela sait déjà ce qu’elle cherche.'],
      ['La longue traîne convertit mieux', 'Les requêtes spécifiques attirent moins de monde, mais moins de curieux. Elles permettent aussi de créer des pages plus concrètes : cas d’usage, secteur, zone, problème métier. C’est souvent là que les PME peuvent gagner sans affronter les gros acteurs.'],
      ['Construire des pages utiles, pas des pages artificielles', 'Une bonne page de niche ne répète pas un mot-clé. Elle répond à un vrai besoin : contexte, problèmes fréquents, critères de choix, exemples, étapes, limites. Google et le lecteur doivent sentir que la page a été écrite pour une situation réelle.'],
      ['La stratégie : couvrir un territoire de questions', 'Le SEO durable ressemble moins à un pari sur un mot-clé qu’à une cartographie. Une série de pages bien reliées autour d’un métier peut devenir une vraie source de demandes qualifiées.']
    ],
    cta: ['Votre activité est spécifique et difficile à expliquer ?', '/contact.html?service=seo-local', 'Construire ma stratégie SEO']
  },
  {
    slug: 'article-instagram-commerce-physique-clients',
    category: 'Social & local',
    title: 'Transformer ses abonnés Instagram en clients dans un commerce physique',
    seoTitle: 'Instagram pour commerce local : transformer les abonnés en clients | Purity Agency',
    description: 'Comment relier Instagram à des visites réelles en magasin, avec des contenus utiles et des appels à l’action simples.',
    date: '2026-05-21',
    meta: '6 min · 21 mai 2026',
    lead: 'Avoir des abonnés ne suffit pas. Pour un commerce physique, Instagram doit créer des visites, des réservations, des messages ou des passages en boutique.',
    sections: [
      ['Montrer ce qui donne envie de venir', 'Les publications trop parfaites peuvent éloigner. Un commerce local gagne souvent avec du concret : arrivages, coulisses, avant/après, conseils rapides, disponibilité, horaires, ambiance réelle.'],
      ['Créer des raisons de passer maintenant', 'Un abonné devient client quand l’action est évidente : réserver, demander une taille, venir voir une nouveauté, profiter d’un créneau, récupérer une commande. Chaque contenu doit pouvoir mener à une action simple.'],
      ['Utiliser les stories comme canal opérationnel', 'Les stories sont utiles pour les informations qui vieillissent vite : stock, horaires, météo, place restante, rappel événement. Elles doivent rester lisibles, pas devenir un mur de stickers.'],
      ['Relier Instagram au reste du système', 'Le lien en bio, la fiche Google, le site, WhatsApp et le point de vente doivent raconter la même chose. Sinon, l’intérêt créé par Instagram se perd dans le parcours.']
    ],
    cta: ['Votre présence sociale ne ramène pas assez de clients ?', '/contact.html?service=studio', 'Structurer mes contenus']
  },
  {
    slug: 'article-rgpd-cookies-popins-prospects',
    category: 'Confiance',
    title: 'RGPD et cookies : informer sans faire fuir vos prospects',
    seoTitle: 'RGPD et cookies : comment rester clair sans casser la conversion | Purity Agency',
    description: 'Une approche sobre des cookies, pop-ins et messages RGPD pour rester conforme sans dégrader l’expérience.',
    date: '2026-05-06',
    meta: '7 min · 6 mai 2026',
    lead: 'Le problème n’est pas d’informer l’utilisateur. Le problème, c’est de l’accueillir avec une avalanche de bandeaux, pop-ins et textes juridiques avant même qu’il comprenne votre offre.',
    sections: [
      ['La conformité ne doit pas devenir une agression', 'Un bandeau cookie peut être nécessaire selon les outils activés. Mais il doit rester clair, proportionné et honnête. Demander un consentement massif pour des outils inutiles dégrade la confiance.'],
      ['Distinguer nécessaire et marketing', 'Un stockage utile au fonctionnement d’un formulaire ou d’un assistant n’a pas le même statut qu’un pixel publicitaire. Le visiteur doit pouvoir comprendre ce qui est utilisé, pourquoi et combien de temps.'],
      ['Éviter les pop-ins prématurées', 'Une pop-in qui demande un e-mail au bout d’une seconde coupe la lecture. Si vous proposez une ressource ou un contact, attendez un signal d’intérêt : scroll, temps passé, clic, retour en haut, intention de sortie.'],
      ['La clarté rassure plus que le jargon', 'Les pages confidentialité, cookies et conditions doivent expliquer le fonctionnement réel du site. Déclarer des traitements inexistants ou cacher les vrais outils crée plus de risque que de valeur.']
    ],
    cta: ['Vos parcours manquent de clarté et de confiance ?', '/contact.html?service=conversion', 'Clarifier mon parcours']
  },
  {
    slug: 'article-retargeting-pme-visiteurs-indecis',
    category: 'Publicité',
    title: 'Retargeting pour PME : convertir les visiteurs qui hésitent',
    seoTitle: 'Retargeting pour PME : la stratégie pour convertir les indécis | Purity Agency',
    description: 'Comment utiliser le retargeting sans harceler : audiences simples, fréquence raisonnable et messages de réassurance.',
    date: '2026-04-18',
    meta: '7 min · 18 avril 2026',
    lead: 'La majorité des visiteurs ne contacte pas une entreprise lors de la première visite. Cela ne veut pas dire qu’ils ne sont pas intéressés. Souvent, ils comparent, réfléchissent ou remettent la décision à plus tard.',
    sections: [
      ['Le retargeting sert à revenir au bon moment', 'Le reciblage permet de reparler à des personnes qui ont déjà visité votre site. Elles connaissent au moins votre nom, ce qui rend le message moins froid et souvent moins coûteux qu’une campagne d’acquisition pure.'],
      ['Le message doit changer', 'Montrer la même annonce qu’à une audience froide est une erreur. Une personne qui revient a besoin de réassurance : avis, méthode, cas concret, garantie, disponibilité, exemple de résultat ou réponse à une objection.'],
      ['La fréquence protège votre image', 'Un bon retargeting reste présent sans devenir oppressant. Limitez la répétition, excluez les personnes qui ont déjà envoyé une demande et arrêtez les audiences trop anciennes.'],
      ['Le pixel n’est pas une stratégie', 'Installer un pixel ne suffit pas. Il faut un parcours clair : pages vues, actions importantes, exclusions, créas adaptées, mesure des conversions. Sans cela, on suit les visiteurs sans savoir quoi leur dire.']
    ],
    cta: ['Vous payez déjà du trafic ?', '/contact.html?service=campagnes', 'Rentabiliser mes visiteurs']
  },
  {
    slug: 'article-e-e-a-t-artisan-pme-locale',
    category: 'SEO',
    title: 'E-E-A-T : prouver votre expertise locale sur votre site',
    seoTitle: 'E-E-A-T Google : guide pour artisans et PME locales | Purity Agency',
    description: 'Comment montrer l’expérience, l’expertise et la fiabilité d’une entreprise locale sans discours creux.',
    date: '2026-04-03',
    meta: '8 min · 3 avril 2026',
    lead: 'Google et vos visiteurs cherchent la même chose : des signes que vous êtes une vraie entreprise, compétente, joignable et fiable.',
    sections: [
      ['Expérience : montrez le terrain', 'Les réalisations, photos, cas concrets, étapes de travail et exemples de problèmes résolus prouvent davantage qu’une phrase “expert depuis 10 ans”. Le détail crée la confiance.'],
      ['Expertise : expliquez vos choix', 'Une page service solide ne se contente pas de lister une prestation. Elle explique quand elle est utile, ce qu’elle inclut, ce qu’elle ne fait pas, et comment une décision se prend.'],
      ['Autorité : soignez les signaux externes', 'Avis, fiche Google, annuaires sérieux, partenaires, mentions locales, liens depuis des acteurs de votre secteur : ces signaux aident Google et les humains à vous situer.'],
      ['Fiabilité : rendez l’entreprise vérifiable', 'Coordonnées cohérentes, adresse, mentions légales, pages de confidentialité, politique de contact, prix ou repères : la confiance se construit dans les détails visibles.']
    ],
    cta: ['Votre site ne prouve pas assez votre sérieux ?', '/contact.html?service=presence-marque', 'Renforcer ma crédibilité']
  },
  {
    slug: 'article-minimalisme-digital-strategie-micro-entreprise',
    category: 'Stratégie',
    title: 'Minimalisme digital : faire plus avec moins de canaux',
    seoTitle: 'Stratégie digitale minimaliste pour micro-entreprises | Purity Agency',
    description: 'Une stratégie simple pour indépendants et micro-entreprises : moins de canaux, plus de cohérence, moins d’épuisement.',
    date: '2026-03-14',
    meta: '6 min · 14 mars 2026',
    lead: 'Une petite entreprise n’a pas besoin d’être partout. Elle a besoin d’être claire là où ses clients prennent vraiment leur décision.',
    sections: [
      ['Chaque canal ajoute une charge', 'Instagram, LinkedIn, Google, newsletter, blog, TikTok, publicité : chaque canal demande une stratégie, des contenus, du suivi et une régularité. Sans système, cela devient une fatigue permanente.'],
      ['Choisir un canal selon la cible', 'Un artisan local peut tirer plus de valeur d’une fiche Google vivante et de photos régulières que de cinq réseaux mal tenus. Un consultant B2B peut privilégier LinkedIn et quelques pages de fond. Le bon canal dépend de l’achat, pas de la mode.'],
      ['Recycler au lieu de recommencer', 'Un contenu pilier peut devenir plusieurs formats : post, story, e-mail, page conseil, script vidéo. La cohérence vient d’un système, pas d’une inspiration quotidienne.'],
      ['Moins de bruit, plus de profondeur', 'Le minimalisme digital n’est pas faire moins par paresse. C’est concentrer l’effort sur ce qui peut vraiment créer des contacts, de la confiance ou du temps gagné.']
    ],
    cta: ['Vous avez trop d’outils et pas assez de résultats ?', '/contact.html?solution=presence-marque', 'Simplifier ma stratégie']
  },
  {
    slug: 'article-above-the-fold-structure-conversion',
    category: 'UX',
    title: 'Above the fold : structurer le haut de page pour convertir',
    seoTitle: 'Above the Fold : comment structurer le haut de votre site | Purity Agency',
    description: 'Les éléments essentiels à placer dans le premier écran pour aider un visiteur à comprendre et agir en quelques secondes.',
    date: '2026-02-27',
    meta: '7 min · 27 février 2026',
    lead: 'Le premier écran d’un site n’a pas besoin de tout dire. Il doit faire comprendre assez vite pourquoi rester, quoi regarder et quelle action est logique.',
    sections: [
      ['Une promesse compréhensible en deux secondes', 'Le titre doit dire ce que l’entreprise aide à obtenir, pour qui ou dans quel contexte. Les mots vagues rassurent rarement. Les mots concrets orientent.'],
      ['Une explication courte qui lève l’objection', 'Le sous-titre complète le titre : zone, public, méthode, bénéfice, limite ou preuve. Il ne doit pas répéter le slogan, mais réduire l’incertitude.'],
      ['Un appel à l’action visible et simple', 'Le bouton principal doit être clair : parler du projet, réserver un échange, tester une page, demander un audit. Un second bouton peut aider, mais il ne doit pas créer un dilemme.'],
      ['Ce qu’il faut retirer', 'Carrousel, menu trop long, pop-in immédiate, phrases génériques, image décorative sans sens : le premier écran ne pardonne pas le bruit. Chaque élément doit aider à décider.']
    ],
    cta: ['Votre haut de page ne convertit pas assez vite ?', '/contact.html?service=conversion', 'Repenser mon premier écran']
  },
  {
    slug: 'article-piratage-wordpress-cout-pme-prevention',
    category: 'Sécurité',
    title: 'Piratage WordPress : le vrai coût pour une PME',
    seoTitle: 'Site WordPress piraté : impact financier et prévention | Purity Agency',
    description: 'Pourquoi un site WordPress mal entretenu peut coûter beaucoup plus qu’une intervention technique.',
    date: '2026-02-03',
    meta: '8 min · 3 février 2026',
    lead: 'Un site vitrine peut sembler trop petit pour intéresser un pirate. En réalité, beaucoup d’attaques sont automatisées : elles cherchent des failles, pas des marques connues.',
    sections: [
      ['Le coût dépasse la réparation', 'Un piratage peut provoquer une alerte navigateur, une baisse de trafic, une perte de mails, une suspension d’hébergement, une perte de confiance ou une désindexation temporaire. Le nettoyage technique n’est qu’une partie du problème.'],
      ['La base : mises à jour et sobriété', 'La majorité des incidents vient de versions obsolètes, plugins inutiles ou thèmes abandonnés. Moins il y a de composants, moins il y a de portes à surveiller.'],
      ['Sauvegardes et accès propres', 'Un mot de passe fort, des rôles limités, une authentification double facteur et des sauvegardes externes changent tout. La question n’est pas “est-ce que ça arrivera ?”, mais “comment on récupère si ça arrive ?”.'],
      ['La sécurité est une maintenance, pas un plugin', 'Un plugin de sécurité peut aider, mais il ne remplace pas une discipline : mises à jour, surveillance, hébergement sérieux, sauvegardes testées et décisions techniques sobres.']
    ],
    cta: ['Votre site WordPress est-il vraiment maintenu ?', '/contact.html?service=hebergement', 'Sécuriser mon site']
  },
  {
    slug: 'article-maillage-interne-seo-pages-services',
    category: 'SEO',
    title: 'Maillage interne : booster vos pages services sans chercher des backlinks',
    seoTitle: 'Maillage interne SEO : booster vos pages services | Purity Agency',
    description: 'Comment relier vos contenus aux pages qui convertissent pour aider Google et les visiteurs à comprendre vos priorités.',
    date: '2026-01-28',
    meta: '7 min · 28 janvier 2026',
    lead: 'Avant de chercher des liens ailleurs, beaucoup de sites devraient déjà mieux utiliser leurs propres pages. Le maillage interne est souvent le levier SEO le plus négligé.',
    sections: [
      ['Google suit vos liens pour comprendre vos priorités', 'Une page service liée seulement depuis le menu reçoit peu de contexte. Quand plusieurs articles et pages la citent naturellement, elle devient plus importante dans l’architecture du site.'],
      ['L’ancre doit dire quelque chose', '“Cliquez ici” n’aide personne. Une bonne ancre explique la destination : “optimiser votre fiche Google”, “automatiser les relances”, “créer un outil métier”. Le visiteur et Google comprennent le lien avant de cliquer.'],
      ['Le lien doit être placé en contexte', 'Un lien dans un paragraphe utile vaut souvent mieux qu’un lien perdu en footer. Il accompagne une idée : problème, exemple, suite logique, solution. Le maillage doit ressembler à un conseil, pas à une décoration.'],
      ['Les pages services doivent recevoir plus qu’elles n’émettent', 'Vos pages de conversion sont les destinations. Les articles servent à expliquer, rassurer et orienter. Un bon blog ne vit pas seul : il nourrit les pages qui transforment.']
    ],
    cta: ['Vos contenus n’envoient pas assez vers vos offres ?', '/contact.html?service=seo-local', 'Auditer mon maillage']
  }
];

const allCards = [...newArticles, ...oldArticles].sort((a, b) => b.date.localeCompare(a.date));

function esc(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function header(current = '') {
  return `<header class="header">
<a class="header__brand" href="/"><img src="/assets/logo-mark.webp" alt="" aria-hidden="true" width="26" height="26"><span>Purity Agency</span></a>
<nav class="header__nav" aria-label="Principal"><a href="/#services">Services</a><a href="/blog.html"${current === 'blog' ? ' aria-current="page"' : ''}>Blog</a><a href="/contact.html">Contact</a></nav>
<button class="burger" type="button" command="toggle-popover" commandfor="menu" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu"><span class="burger__box" aria-hidden="true"><span class="burger__bar"></span><span class="burger__bar"></span></span></button>
</header>
<div id="menu" popover="auto" class="menu" aria-label="Menu">
<div class="menu__top"><span class="menu__brand"><img src="/assets/logo-mark.webp" alt="" aria-hidden="true" width="24" height="24"><span>Purity Agency</span></span><button class="burger burger--close" type="button" command="hide-popover" commandfor="menu" aria-label="Fermer le menu"><span class="burger__box" aria-hidden="true"><span class="burger__bar"></span><span class="burger__bar"></span></span></button></div>
<nav class="menu__nav"><a href="/#services" style="--i:0">Services</a><a href="/blog.html" style="--i:1"${current === 'blog' ? ' aria-current="page"' : ''}>Blog</a><a href="/contact.html" style="--i:2">Contact</a></nav>
<div class="menu__foot" style="--i:3"><a class="btn btn--primary" href="/contact.html">Parler de votre projet</a><a class="menu__mail" href="mailto:contact@purity-agency.be">contact@purity-agency.be</a></div>
</div>`;
}

function footer() {
  return `<footer class="site-footer"><div class="site-footer__inner"><div><a class="site-footer__brand" href="/"><img src="/assets/logo-mark.webp" alt="" width="32" height="32">Purity Agency</a><p>Modernisation, optimisation et solutions digitales pour les indépendants et PME.</p></div><nav aria-label="Navigation de pied de page"><h2>Explorer</h2><a href="/#services">Services</a><a href="/blog.html">Blog</a><a href="/contact.html">Contact</a></nav><div><h2>Parlons-en</h2><a href="mailto:contact@purity-agency.be">contact@purity-agency.be</a></div></div><div class="site-footer__legal"><span>© 2026 Purity Agency</span><a href="/legal.html">Légal</a><a href="/confidentialite.html">Confidentialité</a><a href="/cookies.html">Cookies</a><a href="/conditions-generales.html">CGV</a></div></footer>`;
}

function articleHtml(article) {
  const body = [
    `<p class="lead">${esc(article.lead)}</p>`,
    ...article.sections.map(([title, text]) => `<h2>${esc(title)}</h2><p>${esc(text)}</p>`),
    `<blockquote>${esc(article.title).replace(/\.$/, '')} n’est pas un sujet isolé : c’est un morceau du système qui transforme une présence digitale en demandes plus qualifiées.</blockquote>`,
    `<div class="article-cta"><p>${esc(article.cta[0])}</p><a class="btn btn--primary" href="${esc(article.cta[1])}">${esc(article.cta[2])}</a></div>`
  ].join('');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: 'fr-BE',
    author: { '@type': 'Organization', name: 'Purity Agency' },
    publisher: { '@type': 'Organization', name: 'Purity Agency', url: siteUrl },
    mainEntityOfPage: `${siteUrl}/${article.slug}.html`
  };

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(article.seoTitle)}</title>
<meta name="description" content="${esc(article.description)}">
<link rel="canonical" href="${siteUrl}/${article.slug}.html">
<meta name="robots" content="index,follow">
<meta property="og:type" content="article">
<meta property="og:locale" content="fr_BE">
<meta property="og:title" content="${esc(article.title)}">
<meta property="og:description" content="${esc(article.description)}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/css/app.css?v=8">
<link rel="stylesheet" href="/css/menu.css">
<link rel="stylesheet" href="/css/site-additions.css">
<link rel="stylesheet" href="/css/content.css?v=3">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
${header()}
<main class="content-page">
<header class="content-hero">
<div class="content-hero__inner">
<p class="content-hero__eyebrow">${esc(article.category)}</p>
<h1>${esc(article.title)}</h1>
<p class="content-meta">${esc(article.meta)}</p>
</div>
</header>
<article class="content-main prose">${body}</article>
</main>
${footer()}
<script src="/js/menu.js" defer></script>
<script src="/js/cookie-notice.js" defer></script>
</body>
</html>
`;
}

function blogHtml() {
  const featured = allCards.slice(0, 3);
  const rest = allCards.slice(3);
  const card = (article, featuredClass = '') => `<a class="post-card${featuredClass}" href="/${article.slug}.html"><span class="post-card__cat">${esc(article.category)}</span><h2>${esc(article.title)}</h2><p>${esc(article.description)}</p><span class="post-card__meta">${esc(article.meta)}</span></a>`;
  const blogJson = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Le journal Purity',
    url: `${siteUrl}/blog.html`,
    inLanguage: 'fr-BE',
    publisher: { '@type': 'Organization', name: 'Purity Agency', url: siteUrl },
    blogPost: allCards.map(article => ({
      '@type': 'BlogPosting',
      headline: article.title,
      url: `${siteUrl}/${article.slug}.html`,
      datePublished: article.date
    }))
  };

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Blog acquisition, visibilité, automatisation et stratégie digitale | Purity Agency</title>
<meta name="description" content="Guides pratiques pour PME et indépendants : acquisition, SEO local, Google Ads, e-commerce, automatisation, IA, UX, sécurité et stratégie digitale.">
<link rel="canonical" href="${siteUrl}/blog.html">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_BE">
<meta property="og:title" content="Le journal Purity : acquisition, systèmes et IA sans jargon">
<meta property="og:description" content="Des guides utiles, datés et concrets pour les indépendants et PME de Wallonie.">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/css/app.css?v=8">
<link rel="stylesheet" href="/css/menu.css">
<link rel="stylesheet" href="/css/site-additions.css">
<link rel="stylesheet" href="/css/content.css?v=3">
<script type="application/ld+json">${JSON.stringify(blogJson)}</script>
</head>
<body>
${header('blog')}
<main class="blog">
<section class="blog-hero">
<div class="blog-hero__inner">
<p class="content-hero__eyebrow">Le journal Purity</p>
<h1>Des décisions digitales plus claires.</h1>
<p>Acquisition, visibilité locale, outils métier, IA, e-commerce, sécurité et conversion. Des guides courts, concrets, écrits pour aider une PME à choisir la bonne prochaine étape.</p>
</div>
</section>
<section class="blog-featured" aria-label="Articles récents">${featured.map(article => card(article, ' post-card--featured')).join('')}</section>
<section class="blog-index" aria-labelledby="blog-index-title">
<div class="blog-index__head"><p class="content-hero__eyebrow">Tous les guides</p><h2 id="blog-index-title">Un fond éditorial qui couvre tout le système.</h2></div>
<div class="blog-grid" aria-label="Articles">${rest.map(article => card(article)).join('')}</div>
</section>
</main>
${footer()}
<script src="/js/menu.js" defer></script>
<script src="/js/cookie-notice.js" defer></script>
</body>
</html>
`;
}

function sitemapXml() {
  const urls = [
    ['/', '1.0'],
    ['/contact.html', '0.8'],
    ['/blog.html', '0.8'],
    ...allCards.map(article => [`/${article.slug}.html`, '0.7'])
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(([loc, priority]) => `<url><loc>${siteUrl}${loc}</loc><priority>${priority}</priority></url>`).join('')}</urlset>
`;
}

for (const article of newArticles) {
  writeFileSync(join(root, `${article.slug}.html`), articleHtml(article));
}

writeFileSync(join(root, 'blog.html'), blogHtml());
writeFileSync(join(root, 'sitemap.xml'), sitemapXml());

console.log(`Integrated ${newArticles.length} new articles and ${allCards.length} blog cards.`);
