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

export function answerFor(svc) {
  if (isFree(svc)) return 'Le diagnostic digital est un appel gratuit de 15 minutes avec Amir Kebiyeb, fondateur de Purity Agency à Charleroi. Il regarde votre site, votre fiche Google et vos concurrents locaux, puis vous dit quoi corriger en premier. Vous recevez un récapitulatif écrit. Aucun paiement, aucun engagement, et parfois la réponse est qu’il ne faut rien acheter.';
  const prix = svc.monthlyPrice
    ? `${svc.priceSetup} de mise en place, puis ${svc.monthlyPrice} de suivi, résiliable chaque mois`
    : `${svc.priceSetup} en paiement unique, sans abonnement`;
  const txt = `${svc.name} par Purity Agency, à Charleroi : ${prix}. Délai : ${cleanDelay(svc.delay)}. ${firstSentence(svc.headline)} Un diagnostic gratuit de 15 minutes précède tout devis.`;
  const n = txt.split(/\s+/).length;
  if (n < 40 || n > 60) console.warn(`Paragraphe-réponse hors 40-60 mots (${n}) : ${svc.slug}`);
  return txt;
}

export function objectionsFor(svc) {
  if (isFree(svc)) return [];
  const has = re => svc.faq.some(f => re.test(f.q));
  const out = [{
    q: 'Est-ce que je m’engage sur une durée ?',
    a: svc.monthlyPrice
      ? `Non. La mise en place se paie une fois. Le suivi à ${svc.monthlyPrice} se résilie par écrit chaque mois avec un mois de préavis, sauf durée différente écrite noir sur blanc dans votre devis.`
      : 'Non. C’est un paiement unique, sans abonnement ni reconduction.'
  }];
  if (svc.monthlyPrice && !has(/arrête|résili/i)) out.push({ q: 'Que se passe-t-il si j’arrête le suivi ?', a: 'Le service s’arrête à la fin du préavis. Ce qui a été créé pour vous (textes, visuels, nom de domaine, fichiers) vous reste acquis et vous est remis pour continuer ailleurs si vous le souhaitez.' });
  if (!has(/propriétaire|appartient/i)) out.push({ q: 'À qui appartient ce qui est livré ?', a: 'À vous. Une fois la facture réglée, les fichiers, textes et visuels créés pour votre entreprise vous appartiennent.' });
  if (!has(/délai|combien de temps|quand/i)) out.push({ q: 'Quand est-ce prêt ?', a: `Comptez ${cleanDelay(svc.delay).toLowerCase()} après l’entretien de cadrage. Le délai est écrit dans votre devis.` });
  return out;
}

export function linksFor(svc, esc) {
  const items = [
    ['/agence-web/charleroi', 'Agence web à Charleroi : qui on est, où on intervient'],
    ...(METIERS[svc.slug] || []).map(m => [`/site-internet/${m}`, `Site internet pour ${METIER_LABEL[m]}`]),
    ...ARTICLES[articleGroup(svc.slug)].map(([u, t]) => [`/${u}.html`, t])
  ];
  return items.map(([h, t]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('\n        ');
}

export function notForHtml(svc, esc) {
  const t = NOT_FOR[svc.slug];
  return t ? `<div class="sd-notfor"><strong>Ce n’est pas pour vous si</strong><p>${esc(t)}</p></div>` : '';
}
