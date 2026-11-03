// Compléments des pages services : paragraphe-réponse, « pas pour vous si », objections, maillage interne.
const isFree = svc => !/[1-9]/.test(svc.priceSetup);

export const NOT_FOR = {
  'diagnostic-digital': 'Vous attendez un audit écrit de 40 pages ou une étude de marché : ici, c’est 15 minutes pour trouver la priorité.',
  'page-essentielle': 'Vous avez plusieurs métiers, plusieurs villes ou un catalogue à présenter : le Site Vitrine ou le Site Complet vous conviendra mieux.',
  'site-vitrine': 'Vous vendez en ligne (voyez la Boutique) ou vous couvrez de nombreuses villes et services (voyez le Site Complet).',
  'site-complet': 'Vous démarrez seul avec un seul métier : la Page Essentielle ou le Site Vitrine suffit et coûte moins cher.',
  'boutique-en-ligne': 'Vous avez moins d’une dizaine de produits ou vous ne pouvez pas préparer les commandes : un site vitrine avec contact direct suffit.',
  'refonte-modernisation': 'Votre site actuel est rapide, clair et vous apporte déjà des demandes : une refonte ne vous rapportera pas assez.',
  'google-business': 'Vous n’avez ni adresse ni zone de service en Belgique : Google ne vous affichera pas sur Maps.',
  'identite-visuelle-logo': 'Vous cherchez une charte de 80 pages pour une grande marque : cette formule vise les indépendants et les PME.',
  'pack-visuels-reels': 'Vous ne pouvez pas filmer quelques séquences au smartphone : sans matière brute, pas de Reels.',
  'referencement-local-seo': 'Vous voulez des appels dès la semaine prochaine : le référencement prend des mois, la publicité est plus rapide.',
  'gestion-reseaux-sociaux': 'Vous ne pouvez pas nous envoyer de photos ou de vidéos de votre activité : le contenu serait générique, et on refuse ça.',
  'pilote-automatique-essentiel': 'Vous recevez deux demandes par mois : l’automatisation ne vous fera pas gagner assez de temps pour se justifier.',
  'pilote-automatique-business': 'Vous n’avez encore ni outil de facturation ni planning : on en choisit d’abord un, l’automatisation vient après.',
  'pilote-automatique-integral': 'Vous voulez qu’une IA décide à votre place ou s’engage sur des prix sans contrôle : elle répond, vous gardez la main.'
};

const METIERS = {
  'diagnostic-digital': ['chauffagiste', 'restaurant', 'comptable'],
  'page-essentielle': ['kinesitherapeute', 'toiletteur', 'institut-beaute'],
  'site-vitrine': ['chauffagiste', 'entreprise-renovation', 'garage'],
  'site-complet': ['entreprise-renovation', 'architecte', 'agence-immobiliere'],
  'boutique-en-ligne': ['boutique-decoration', 'restaurant'],
  'refonte-modernisation': ['comptable', 'architecte', 'garage'],
  'google-business': ['restaurant', 'garage', 'institut-beaute'],
  'identite-visuelle-logo': ['entreprise-renovation', 'toiletteur'],
  'pack-visuels-reels': ['salle-de-sport', 'restaurant', 'institut-beaute'],
  'referencement-local-seo': ['chauffagiste', 'entreprise-renovation', 'comptable'],
  'gestion-reseaux-sociaux': ['salle-de-sport', 'restaurant', 'boutique-decoration'],
  'pilote-automatique-essentiel': ['kinesitherapeute', 'garage', 'institut-beaute'],
  'pilote-automatique-business': ['comptable', 'entreprise-renovation', 'agence-immobiliere'],
  'pilote-automatique-integral': ['agence-immobiliere', 'salle-de-sport', 'chauffagiste']
};
const METIER_LABEL = {
  'agence-immobiliere': 'agence immobilière', architecte: 'architecte', 'boutique-decoration': 'boutique de décoration',
  chauffagiste: 'chauffagiste', comptable: 'comptable', 'entreprise-renovation': 'entreprise de rénovation', garage: 'garage',
  'institut-beaute': 'institut de beauté', kinesitherapeute: 'kinésithérapeute', restaurant: 'restaurant',
  'salle-de-sport': 'salle de sport', toiletteur: 'toiletteur'
};
const ARTICLES = {
  web: [['article-prix-site-web-belgique', 'Combien coûte un site web en Belgique'], ['article-site-ne-convertit-pas', 'Pourquoi un site ne génère pas de demandes']],
  seo: [['article-seo-local-wallonie', 'Le référencement local en Wallonie'], ['article-google-business-profile-suspendu-recuperation', 'Fiche Google suspendue : la récupérer']],
  social: [['article-instagram-commerce-physique-clients', 'Instagram pour un commerce physique'], ['article-e-e-a-t-artisan-pme-locale', 'Inspirer confiance en ligne quand on est artisan']],
  ia: [['article-ia-pme-belgique', 'L’IA utile pour une PME belge'], ['article-cheques-entreprises-wallonie', 'Les chèques-entreprises en Wallonie']],
  shop: [['article-recuperer-paniers-abandones-emails-e-commerce', 'Récupérer les paniers abandonnés'], ['article-prix-site-web-belgique', 'Combien coûte un site web en Belgique']]
};
const articleGroup = s => /pilote/.test(s) ? 'ia' : /reseaux|reels|logo/.test(s) ? 'social' : /seo|google/.test(s) ? 'seo' : /boutique/.test(s) ? 'shop' : 'web';
const firstSentence = t => (t.match(/^[^.!?]+[.!?]/) || [t])[0];
const cleanDelay = d => d.replace(/^Mise en place : /, '');
// Engagement lu dans data/services.mjs (champ commitment) : une seule vérité par page.
const commitmentShort = svc => svc.commitment && svc.commitment.minMonths
  ? `engagement de ${svc.commitment.minMonths} mois`
  : 'résiliable chaque mois';
export function commitmentAnswer(svc) {
  const c = svc.commitment || { minMonths: 0, text: '' };
  if (!svc.monthlyPrice) return c.text || 'Non. C’est un paiement unique, sans abonnement ni reconduction.';
  return c.minMonths
    ? `Oui. La mise en place se paie une fois. ${c.text} La durée est écrite noir sur blanc dans votre devis.`
    : `Non. La mise en place se paie une fois. ${c.text}`;
}

export function answerFor(svc) {
  if (isFree(svc)) return 'Le diagnostic digital est un appel gratuit de 15 minutes avec Amir Kebiyeb, fondateur de Purity Agency à Charleroi. Il regarde votre site, votre fiche Google et vos concurrents locaux, puis vous dit quoi corriger en premier. Vous recevez un récapitulatif écrit après l’appel. Aucun paiement, aucun engagement, et parfois la réponse est qu’il ne faut rien acheter.';
  const prix = svc.monthlyPrice
    ? `${svc.priceSetup} de mise en place, puis ${svc.monthlyPrice} de suivi, ${commitmentShort(svc)}`
    : `${svc.priceSetup} en paiement unique, sans abonnement`;
  const txt = `${svc.name} par Purity Agency, à Charleroi : ${prix}. Délai : ${cleanDelay(svc.delay)}. ${firstSentence(svc.headline)} Un diagnostic gratuit de 15 minutes précède tout devis.`;
  const n = txt.split(/\s+/).length;
  if (n < 40 || n > 60) console.warn(`Paragraphe-réponse hors 40-60 mots (${n}) : ${svc.slug}`);
  return txt;
}

export function objectionsFor(svc) {
  if (isFree(svc)) return [];
  const has = re => svc.faq.some(f => re.test(f.q));
  const out = [];
  // La réponse vient du champ commitment : la FAQ du catalogue ne porte plus de
  // question d'engagement, pour qu'une page ne dise jamais deux durées.
  if (!has(/engag/i)) out.push({ q: 'Est-ce que je m’engage sur une durée ?', a: commitmentAnswer(svc) });
  if (svc.monthlyPrice && !has(/arrête|résili/i)) out.push({ q: 'Que se passe-t-il si j’arrête le suivi ?', a: `Le service s’arrête à la fin du préavis${svc.commitment && svc.commitment.minMonths ? ', au plus tôt au terme de la durée minimale' : ''}. Vous restez propriétaire de vos contenus, visuels, logo et nom de domaine : ils vous sont remis pour continuer ailleurs si vous le souhaitez.` });
  if (!has(/propriétaire|appartient/i)) out.push({ q: 'À qui appartient ce qui est livré ?', a: 'À vous. Une fois la facture réglée, vous êtes propriétaire de vos contenus, visuels, logo et nom de domaine. Purity garde seulement ses outils et méthodes génériques.' });
  if (!has(/délai|combien de temps|quand/i)) out.push({ q: 'Quand est-ce prêt ?', a: `Comptez ${cleanDelay(svc.delay).toLowerCase()} après l’entretien de cadrage. Le délai est écrit dans votre devis.` });
  return out;
}

export function linksFor(svc, esc) {
  const items = [
    ['/agence-web/charleroi', 'Agence web à Charleroi : qui on est, où on intervient'],
    ...(METIERS[svc.slug] || []).map(m => [`/site-internet/${m}`, `Site internet pour ${METIER_LABEL[m]}`]),
    ...ARTICLES[articleGroup(svc.slug)].map(([u, t]) => [`/${u}`, t])
  ];
  return items.map(([h, t]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('\n        ');
}

export function notForHtml(svc, esc) {
  const t = NOT_FOR[svc.slug];
  return t ? `<div class="sd-notfor"><strong>Ce n’est pas pour vous si</strong><p>${esc(t)}</p></div>` : '';
}

// ---------------------------------------------------------------------------
// Couche visuelle des pages services : icônes, libellés courts (3 à 6 mots)
// alignés sur data/services.mjs, comparatif condensé et visuel du hero.
// Le texte long d'origine reste dans le bloc « En savoir plus » de chaque page.
// ---------------------------------------------------------------------------
const P = {
  pages: '<rect x="4" y="3" width="13" height="17" rx="2"/><path d="M8 8h5M8 12h5M8 16h3"/><path d="M20 7v12a2 2 0 0 1-2 2H8"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  slider: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M12 5v14"/><path d="m9 10-2 2 2 2M15 10l2 2-2 2"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l2 2M14 9l2 2"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13 7 4 4"/>',
  bolt: '<path d="M13 3 5 13h6l-1 8 8-10h-6z"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
  shield: '<path d="M12 21s7.5-3.5 7.5-9.5V5.5L12 3 4.5 5.5v6C4.5 17.5 12 21 12 21z"/><path d="m9 12 2 2 4-4"/>',
  route: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5c1.8.9 3 2.9 3 5.5"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="m8 15 3-4 3 2 5-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  cart: '<path d="M3 4h2l2.2 11h10.6L20 7H7"/><circle cx="9" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>',
  card: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>',
  truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.5-4.5L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.5 4.5L20 16"/><path d="M20 20v-4h-4"/>',
  brush: '<path d="M14.5 4.5 19.5 9.5 11 18l-5-5z"/><path d="M6 13c-2 0-3 1.5-3 3.5V20h3.5c2 0 3.5-1 3.5-3"/>',
  form: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  home: '<path d="M4 11 12 4l8 7v9H4z"/><path d="M10 20v-5h4v5"/>',
  qr: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 18h2v2h-2zM18 14h2M14 18v2"/>',
  id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.2"/><path d="M5.8 16c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4M15 10h3M15 13h3"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h4"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-1.4-1.3-1.6-1.3-2.8 0-.9.8-1.5 1.7-1.5H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
  text: '<path d="M4 6h16M4 11h16M4 16h10"/>',
  frame: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="m9 9 6 3-6 3z"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  gift: '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M3 9h18v3H3zM12 9v11"/><path d="M12 9c-3 0-4.5-1.5-4.5-3S9 3.5 12 9c3-5.5 4.5-4.5 4.5-3S15 9 12 9z"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  folder: '<path d="M3 6h6l2 2h10v11H3z"/>',
  filter: '<path d="M4 5h16l-6 7.5V19l-4 1.5v-8z"/>',
  bot: '<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9.5 16.5h5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5M12 16h.01"/>',
  cross: '<path d="m7 7 10 10M17 7 7 17"/>',
  tick: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  play: '<path d="M8 5v14l11-7z"/>'
};
export const icon = (name, cls = 'sd-ico') =>
  `<svg class="${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || P.check}</svg>`;

// hero.type : device (navigateur + téléphone d'une démo), beforeafter, audit,
// gbp (fiche composée), serp, flow (schéma), phones (Reels), week (planning),
// brands (identités des démos), photo (visuel de /assets/visuals/).
export const VISUALS = {
  'diagnostic-digital': {
    tiles: [['search', 'Visibilité locale vérifiée en direct'], ['phone', 'Test vitesse sur smartphone'], ['mail', 'Devis hors des spams'], ['file', 'Récapitulatif écrit après l’appel']],
    vs: [['Un pack vendu dès la 5e minute', 'Un avis franc, même « rien à acheter »'], ['Un commercial qui lit un script', 'Amir, le fondateur, en direct'], ['Un devis générique sans explication', 'Un récap écrit et l’action prioritaire']],
    hero: { type: 'audit' }
  },
  'page-essentielle': {
    tiles: [['pen', 'Votre métier, avec vos mots'], ['bolt', 'Rapide sur smartphone'], ['phone', 'Appel et WhatsApp en 1 clic'], ['globe', 'Domaine .be et e-mail pro'], ['shield', 'Conforme BCE, TVA et RGPD'], ['key', 'Tout reste à votre nom']],
    vs: [['Des secondes d’attente sur mobile', 'Une page légère, ouverte tout de suite'], ['Un numéro caché, pas cliquable', 'Le bouton d’appel sous le pouce'], ['80 € pour changer un tarif', 'Les modifications incluses dans le suivi']],
    hero: { type: 'device', demo: 'chauffage', name: 'Thermiq', sector: 'Chauffage' }
  },
  'site-vitrine': {
    tiles: [['pages', '5 pages qui rassurent'], ['camera', 'Devis avec photos du client'], ['pin', 'Filtre de zone en km'], ['slider', 'Curseur avant / après'], ['search', 'Référencement local réglé'], ['key', 'Site rapide, accès remis']],
    vs: [['Des devis pour des curieux sans budget', 'Un formulaire qui trie avant le déplacement'], ['Des photos mal cadrées', 'Un avant / après tactile'], ['Invisible au bout de votre rue', 'Calé sur vos communes']],
    hero: { type: 'device', demo: 'renovation', name: 'Atelier Noma', sector: 'Rénovation' }
  },
  'site-complet': {
    tiles: [['pages', '10 à 15 pages sur mesure'], ['pin', 'Une page par ville et métier'], ['route', 'Chaque devis au bon responsable'], ['users', 'Espace recrutement pour ouvriers'], ['chart', 'Statistiques privées, RGPD'], ['clock', 'Modifications sous 24 h ouvrées']],
    vs: [['Une page générale, une seule commune', 'Une page par ville et par spécialité'], ['Tous les messages mélangés', 'Chaque devis au bon responsable'], ['5 à 10 jours pour une modification', 'Amir en direct, sous 24 h ouvrées']],
    hero: { type: 'device', demo: 'architecture', name: 'Ligne Claire', sector: 'Architecture' }
  },
  'boutique-en-ligne': {
    tiles: [['cart', 'Jusqu’à 100 produits'], ['card', 'Bancontact et Payconiq'], ['bolt', 'Paiement en un seul écran'], ['truck', 'Bpost, point relais, retrait'], ['tag', '0 % de commission Purity'], ['receipt', 'Factures TVA et Peppol']],
    vs: [['15 à 30 % pris par les plateformes', '0 % de commission Purity'], ['La carte de crédit seulement', 'Bancontact, Payconiq et cartes'], ['5 étapes et un compte obligatoire', 'Un écran, sans compte obligatoire']],
    hero: { type: 'device', demo: 'decoration', name: 'Matière Commune', sector: 'Décoration' }
  },
  'refonte-modernisation': {
    tiles: [['list', 'Inventaire de l’ancien site'], ['refresh', 'Chaque adresse redirigée'], ['brush', 'Design remis à neuf'], ['shield', 'Extensions lourdes supprimées'], ['form', 'Formulaire de devis moderne'], ['id', 'Mentions légales belges en ordre']],
    vs: [['Liens cassés, visites Google en chute', 'Chaque ancienne adresse redirigée'], ['Un thème lourd et ses extensions', 'Un code léger et durable'], ['De vieux plugins faciles à pirater', 'Beaucoup moins de portes d’entrée']],
    hero: { type: 'beforeafter', demo: 'renovation', name: 'Atelier Noma' }
  },
  'google-business': {
    tiles: [['check', 'Fiche validée avec Google'], ['tag', 'Les bonnes catégories métier'], ['home', 'Adresse privée protégée'], ['list', 'Prestations et tarifs listés'], ['qr', 'Kit avis avec QR code'], ['id', 'Coordonnées alignées sur la BCE']],
    vs: [['Une fiche bloquée des semaines', 'Validation et relances gérées'], ['Aucun système pour les avis', 'Un QR code pour demander l’avis'], ['Une fiche vide, sans photos', 'Prestations et photos en place']],
    hero: { type: 'gbp' }
  },
  'identite-visuelle-logo': {
    tiles: [['brush', '3 propositions de logo'], ['file', 'Fichiers HD pour l’imprimeur'], ['image', 'Images site et réseaux'], ['palette', 'Fiche de vos couleurs'], ['truck', 'Gabarits lettrage et flocage'], ['key', 'Droits d’auteur cédés']],
    vs: [['Un JPEG pixélisé refusé', 'Des vectoriels pour toutes les tailles'], ['Des droits refacturés par support', 'Droits cédés, sans frais par support'], ['Illisible sur la camionnette', 'Pensé pour véhicule et vêtements']],
    hero: { type: 'photo', id: 'service-identite-visuelle-logo-hero' }
  },
  'pack-visuels-reels': {
    tiles: [['video', '4 Reels montés'], ['text', 'Sous-titres mot à mot'], ['image', '6 visuels de réalisations'], ['pen', 'Textes et mots-clés locaux'], ['frame', 'Couvertures de vidéo personnalisées']],
    vs: [['Des vidéos sans rythme ni texte', 'Un montage rythmé et sous-titré'], ['3 heures de montage le soir', 'Vous envoyez, on monte'], ['Le son coupé pour droits musicaux', 'Des musiques autorisées pour les pros']],
    hero: { type: 'photo', id: 'service-pack-visuels-reels-hero' }
  },
  'referencement-local-seo': {
    tiles: [['target', '20 recherches rentables ciblées'], ['gear', 'Site optimisé en continu'], ['pen', 'Contenus rédigés chaque mois'], ['list', 'Annuaires belges reconnus'], ['chart', 'Bilan mensuel d’une page']],
    vs: [['La pub : les appels s’arrêtent avec elle', 'Une place durable sur Google'], ['Un rapport de 30 pages de jargon', 'Un bilan clair d’une page'], ['Des bidouillages risqués', 'Des méthodes conformes à Google']],
    hero: { type: 'serp' }
  },
  'gestion-reseaux-sociaux': {
    tiles: [['image', '3 publications par semaine'], ['video', '3 vidéos courtes par semaine'], ['pen', 'Textes rédigés pour vous'], ['calendar', 'Planning validé à l’avance'], ['clock', 'Diffusion aux bonnes heures'], ['gift', '1er mois offert']],
    vs: [['3 posts, puis 6 mois de silence', '3 vidéos et 3 posts chaque semaine'], ['Des photos brutes sans texte', 'Vidéos, réalisations et avis mêlés'], ['12 mois d’engagement d’emblée', '1er mois offert pour essayer']],
    hero: { type: 'week' }
  },
  'pilote-automatique-essentiel': {
    tiles: [['bolt', '1 automatisation au choix'], ['link', 'Branchée sur vos outils'], ['chat', 'Messages dans votre ton'], ['check', 'Tous les cas testés'], ['file', 'Mode d’emploi d’une page']],
    vs: [['Une réponse le lendemain soir', 'Un accusé de réception en 30 s'], ['Des devis oubliés dans un carnet', 'Relances à J+3 et J+7'], ['Un bricolage qui plante', 'Un système surveillé, avec alertes']],
    hero: { type: 'flow', caption: 'Exemple : le rappel qui évite les rendez-vous manqués', steps: [['calendar', 'Rendez-vous pris'], ['bell', 'SMS de rappel la veille'], ['check', 'Le client confirme'], ['refresh', 'Agenda à jour']] }
  },
  'pilote-automatique-business': {
    tiles: [['file', 'Fin des doubles saisies'], ['link', '3 à 5 logiciels reliés'], ['chart', 'Tableau de bord partagé'], ['receipt', 'Acomptes et Peppol prêts'], ['pin', 'Alertes urgentes avec GPS']],
    vs: [['Excel et post-its éparpillés', 'Un tableau de bord partagé'], ['Des WhatsApp perdus dans le fil', 'L’alerte au technicien, GPS direct'], ['Des rappels d’impayés tardifs', 'Des relances automatiques polies']],
    hero: { type: 'flow', caption: 'Un nouveau contact crée son dossier complet, sans double saisie', steps: [['form', 'Demande sur le site'], ['folder', 'Dossier client créé'], ['calendar', 'Planning rempli'], ['receipt', 'Facture préparée']] }
  },
  'pilote-automatique-integral': {
    tiles: [['bot', 'Réglé sur vos tarifs et règles'], ['chat', 'Sur le site et WhatsApp'], ['filter', 'Demandes triées pour vous'], ['phone', 'Dossier sur votre téléphone'], ['chart', 'Toutes les discussions visibles'], ['shield', 'AI Act et RGPD accompagnés']],
    vs: [['« Je n’ai pas compris » en boucle', 'Il comprend le langage courant'], ['Des prix inventés', 'Vos tarifs, sinon il vous passe la main'], ['Des données envoyées n’importe où', 'Client informé, RGPD respecté']],
    hero: { type: 'flow', caption: 'Le soir et le week-end, l’assistant répond et vous prépare le dossier', steps: [['chat', 'Message à 21 h'], ['bot', 'L’assistant répond'], ['filter', 'Demande triée'], ['phone', 'Dossier sur votre téléphone']] }
  }
};

// Vignette de la carte du hub : capture réelle d'une démo ou visuel composé.
export const HUB_THUMB = {
  'diagnostic-digital': ['img', '/assets/visuals/service-diagnostic-digital-hero.webp', 1195, 896, "Deux personnes à une table de café qui passent en revue une page web sur un ordinateur, un sablier à côté"],
  'page-essentielle': ['img', '/assets/shots/chauffage-mobile-0.webp', 390, 844, 'Page d’accueil mobile de la démo chauffagiste Thermiq'],
  'site-vitrine': ['img', '/assets/shots/renovation-desktop-0.webp', 1440, 900, 'Accueil de la démo rénovation Atelier Noma'],
  'site-complet': ['img', '/assets/shots/architecture-desktop-0.webp', 1440, 900, 'Accueil de la démo bureau d’architecture Ligne Claire'],
  'boutique-en-ligne': ['img', '/assets/shots/decoration-desktop-0.webp', 1440, 900, 'Accueil de la démo boutique de décoration Matière Commune'],
  'refonte-modernisation': ['img', '/assets/shots/immobilier-desktop-0.webp', 1440, 900, 'Accueil de la démo agence immobilière Beaux Jours'],
  'google-business': ['img', '/assets/visuals/service-google-business-hero.webp', 1024, 768, "Smartphone affichant une carte, tenu dans une ruelle pavée de briques"],
  'identite-visuelle-logo': ['img', '/assets/shots/beaute-desktop-0.webp', 1440, 900, 'Identité de la démo institut de beauté Maison Lune'],
  'pack-visuels-reels': ['img', '/assets/visuals/service-pack-visuels-reels-hero.webp', 1195, 896, "Smartphone sur trépied qui filme un potier au tour dans son atelier"],
  'referencement-local-seo': ['img', '/assets/visuals/service-referencement-local-seo-hero.webp', 1195, 896, "Vue en hauteur sur les toits de briques de Charleroi et un terril"],
  'gestion-reseaux-sociaux': ['img', '/assets/visuals/service-gestion-reseaux-sociaux-resultat.webp', 896, 1195, "Commerçante souriante qui regarde son téléphone derrière son comptoir"],
  'pilote-automatique-essentiel': ['img', '/assets/visuals/service-pilote-automatique-essentiel-hero.webp', 1024, 768, "Commerçant devant son rideau baissé le soir, qui regarde une notification sur son téléphone"],
  'pilote-automatique-business': ['img', '/assets/visuals/service-pilote-automatique-business-hero.webp', 1195, 896, "Imprimante qui sort une facture dans un petit bureau administratif"],
  'pilote-automatique-integral': ['img', '/assets/visuals/service-pilote-automatique-integral-hero.webp', 1024, 768, "Coiffeuse qui consulte ses rendez-vous sur une tablette à l’accueil de son salon"]
};

// Visuels photo de /assets/visuals/ : [largeur, hauteur, variante 800 px, alt].
export const PHOTOS = {
  'service-identite-visuelle-logo-hero': [1195, 896, true, "Mains d’un designer qui esquisse un monogramme, nuanciers et cartes vierges sur la table"],
  'service-pack-visuels-reels-hero': [1195, 896, true, "Smartphone sur trépied qui filme un potier au tour dans son atelier"],
  'service-diagnostic-digital-hero': [1195, 896, true, "Deux personnes à une table de café qui passent en revue une page web sur un ordinateur, un sablier à côté"],
  'service-google-business-hero': [1024, 768, true, "Smartphone affichant une carte, tenu dans une ruelle pavée de briques"],
  'service-referencement-local-seo-hero': [1195, 896, true, "Vue en hauteur sur les toits de briques de Charleroi et un terril"],
  'service-gestion-reseaux-sociaux-resultat': [896, 1195, true, "Commerçante souriante qui regarde son téléphone derrière son comptoir"],
  'service-pilote-automatique-essentiel-hero': [1024, 768, true, "Commerçant devant son rideau baissé le soir, qui regarde une notification sur son téléphone"],
  'service-pilote-automatique-business-hero': [1195, 896, true, "Imprimante qui sort une facture dans un petit bureau administratif"],
  'service-pilote-automatique-integral-hero': [1024, 768, true, "Coiffeuse qui consulte ses rendez-vous sur une tablette à l’accueil de son salon"],
  'service-identite-visuelle-logo-resultat': [576, 768, false, "Artisan qui sort une carte de visite vierge de sa ceinture à outils"],
  'service-pack-visuels-reels-resultat': [896, 1195, true, "Smartphone qui affiche une vidéo de poteries tenu devant les étagères d’un atelier"],
  'service-pilote-automatique-business-resultat': [896, 1195, true, "Petit bureau administratif rangé, classeurs et ordinateur, sans personne"],
  'service-pilote-automatique-integral-resultat': [896, 1195, true, "Commerçant qui ferme la porte de sa boutique le soir, vu de dos"],
  'social-sport-post': [1024, 1024, true, "Mains d’un coach qui se mettent de la magnésie dans une salle de sport"],
  'social-restaurant-post': [1024, 1024, true, "Mains d’un chef qui dressent une assiette de saison en cuisine"],
  'social-decoration-post': [768, 768, false, "Mains qui emballent un vase en céramique dans du papier kraft sur un comptoir de boutique"],
  'social-garage-post': [768, 768, false, "Mains d’un mécanicien qui serrent un écrou de roue avec une clé"]
};

// <img> d'un visuel photo, avec srcset 800 px quand la variante existe.
export function photoImg(id, { lazy = true, high = false, sizes = '100vw' } = {}) {
  const [w, h, small, alt] = PHOTOS[id];
  const src = `/assets/visuals/${id}.webp`;
  const set = small ? ` srcset="/assets/visuals/${id}-800.webp 800w, ${src} ${w}w" sizes="${sizes}"` : '';
  const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  return `<img src="${src}"${set} width="${w}" height="${h}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ''}${high ? ' fetchpriority="high"' : ''} decoding="async">`;
}

// Bloc « au quotidien » : photo du résultat attendu. replaceCases : remplace les
// captures de démos (hors sujet pour une automatisation).
export const RESULT_PHOTO = {
  'identite-visuelle-logo': { id: 'service-identite-visuelle-logo-resultat', caption: 'Votre carte de visite, toujours sous la main sur le chantier.' },
  'pack-visuels-reels': { id: 'service-pack-visuels-reels-resultat', caption: 'Vos réalisations en vidéo verticale, prêtes à publier.' },
  'gestion-reseaux-sociaux': { id: 'service-gestion-reseaux-sociaux-resultat', caption: 'Vous suivez vos publications d’un coup d’œil, sans y passer vos soirées.' },
  'pilote-automatique-essentiel': { id: 'service-pilote-automatique-essentiel-hero', caption: 'Le message arrive après la fermeture : la réponse est déjà partie.', replaceCases: true },
  'pilote-automatique-business': { id: 'service-pilote-automatique-business-resultat', caption: 'Le bureau reste rangé : chaque demande remplit son dossier toute seule.', replaceCases: true },
  'pilote-automatique-integral': { id: 'service-pilote-automatique-integral-resultat', caption: 'Vous fermez boutique, l’assistant continue de répondre.', replaceCases: true }
};

// Planning réseaux sociaux : visuel photo du jour quand il existe, sinon visuel de démo.
export const WEEK_PHOTOS = { sport: 'social-sport-post', restaurant: 'social-restaurant-post', decoration: 'social-decoration-post', garage: 'social-garage-post' };

// <img> d'une case du planning (variante 800 px si elle existe).
export function weekImg(key, i) {
  const pr = i < 2 ? ' fetchpriority="high"' : '';
  const id = WEEK_PHOTOS[key];
  if (!id) return `<img src="/assets/cases/visuals/${key}.webp" width="1200" height="800" alt="" decoding="async"${pr}>`;
  const [w, h, small] = PHOTOS[id];
  return small
    ? `<img src="/assets/visuals/${id}-800.webp" width="800" height="${Math.round(800 * h / w)}" alt="" decoding="async"${pr}>`
    : `<img src="/assets/visuals/${id}.webp" width="${w}" height="${h}" alt="" decoding="async"${pr}>`;
}
