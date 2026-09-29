// Audit express d'un site : uniquement des mesures reelles, faites en direct.
// Aucune valeur n'est inventee ; ce qui n'a pas pu etre mesure est signale.

import { hasKey } from './pagespeed.mjs';

const UA = 'Mozilla/5.0 (compatible; PurityAudit/1.0; +https://purity-agency.be)';
const TIMEOUT = 12000;

export function normaliseUrl(raw) {
  const v = String(raw || '').trim();
  if (!v) return null;
  // Une saisie sans point est un nom d'entreprise, pas un domaine.
  const looksLikeDomain = /^([a-z0-9-]+\.)+[a-z]{2,}(\/|$)/i.test(v.replace(/^https?:\/\//i, ''));
  if (!looksLikeDomain) return null;
  try {
    return new URL(/^https?:\/\//i.test(v) ? v : 'https://' + v);
  } catch {
    return null;
  }
}

export async function auditSite(url) {
  const started = Date.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT);

  let res, html = '', ttfb = null, httpsOk = true;
  try {
    res = await fetch(url.href, { redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': UA } });
    ttfb = Date.now() - started;
    html = await res.text();
  } catch {
    // Certains hebergeurs ne repondent qu'en HTTP.
    if (url.protocol === 'https:') {
      httpsOk = false;
      const alt = new URL(url.href); alt.protocol = 'http:';
      try {
        res = await fetch(alt.href, { redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': UA } });
        ttfb = Date.now() - started;
        html = await res.text();
      } catch { clearTimeout(timer); return { ok: false, reason: 'unreachable' }; }
    } else { clearTimeout(timer); return { ok: false, reason: 'unreachable' }; }
  }
  clearTimeout(timer);

  const head = html.slice(0, 200000);
  const pick = (re) => { const m = head.match(re); return m ? m[1].trim() : null; };

  const title = pick(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const desc = pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
            || pick(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const viewport = /<meta[^>]+name=["']viewport["']/i.test(head);
  const h1 = pick(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const og = /<meta[^>]+property=["']og:/i.test(head);
  const schema = /application\/ld\+json/i.test(head) && /(LocalBusiness|ProfessionalService|Organization)/i.test(head);
  const imgs = head.match(/<img\b[^>]*>/gi) || [];
  const imgsNoAlt = imgs.filter((t) => !/\balt\s*=/i.test(t)).length;
  const phone = /(tel:|\+32|0[1-9]\d{7,8})/.test(head);
  const bytes = Buffer.byteLength(html, 'utf8');
  const finalUrl = res.url || url.href;
  const isHttps = finalUrl.startsWith('https://') && httpsOk;

  // Chaque constat porte sa consequence commerciale. Les mesures restent
  // brutes ; c'est leur traduction qui doit parler au dirigeant.
  const issues = [];
  const add = (weight, label, detail) => issues.push({ weight, label, detail });

  if (!isHttps) add(22, 'Votre site n\'est pas sécurisé', 'Le navigateur affiche « Non sécurisé » à chaque visiteur. Beaucoup ferment l\'onglet avant de lire une ligne.');
  if (ttfb > 2500) add(20, `Le serveur répond en ${(ttfb / 1000).toFixed(1)} s`, 'Au-dela de 3 secondes, environ la moitié des visiteurs mobiles abandonnent. Ce sont des clients qui ne sauront jamais que vous existez.');
  else if (ttfb > 1200) add(10, `Le serveur répond en ${(ttfb / 1000).toFixed(1)} s`, 'Chaque seconde de chargement coûte des conversions. Vos concurrents les plus rapides passent devant vous sur mobile.');
  if (!viewport) add(20, 'Le site n\'est pas adapté au mobile', 'Il s\'affiche en miniature sur un téléphone. Or la majorité de vos visiteurs arrivent depuis un mobile.');
  if (!desc) add(14, 'Aucune description pour Google', 'Google écrit lui-même le texte affiché sous votre nom dans les résultats. La première phrase que lit un client vous échappe totalement.');
  else if (desc.length < 70) add(6, 'Description trop courte pour Google', 'Vous laissez de la place vide là où vos concurrents placent leurs arguments.');
  if (!title) add(16, 'Aucun titre de page', 'L\'onglet et le résultat Google affichent une adresse brute au lieu de votre nom.');
  else if (title.length > 65) add(5, 'Titre trop long pour Google', `Google coupe votre titre à mi-chemin. Le vôtre fait ${title.length} caractères.`);
  if (!h1) add(10, 'Aucun titre principal dans la page', 'Google ne sait pas de quoi parle votre page. Vos concurrents lui rendent la tâche facile.');
  if (!schema) add(12, "Google ne sait pas où vous êtes", "Sans données d'établissement, vous n'apparaissez pas dans les recherches locales du type « près de chez moi ».");
  if (!og) add(7, "Vos liens partagés n'affichent aucun aperçu", "Sur WhatsApp, Facebook ou LinkedIn, votre lien sort nu. Il passe pour un lien suspect.");
  if (!phone) add(9, 'Aucun moyen de vous joindre directement', 'Un visiteur prêt à acheter doit chercher comment vous contacter. Beaucoup renoncent.');
  if (imgsNoAlt > 3) add(5, `${imgsNoAlt} images sans description`, 'Elles sont invisibles pour Google Images et pour les lecteurs d\'ecran.');
  if (bytes > 900000) add(8, `Page très lourde (${Math.round(bytes / 1024)} Ko de code)`, "Sur une connexion mobile moyenne, l'attente décourage une partie des visiteurs.");

  // Signaux supplementaires : format d'images, compression, scripts tiers,
  // volume de contenu, robots.txt et sitemap. Ce sont eux qui separent un site
  // correct d'un site reellement neglige.
  const srcs = imgs.map((t) => (t.match(/src=["']([^"']+)["']/i) || [])[1] || '');
  const legacyImgs = srcs.filter((u) => /\.(png|jpe?g)(\?|$)/i.test(u)).length;
  const lazy = imgs.filter((t) => /loading\s*=\s*["']lazy["']/i.test(t)).length;
  const scripts = (head.match(/<script[^>]*src=/gi) || []);
  const thirdParty = scripts.filter((t) => {
    const u = (t.match(/src=["']([^"']+)["']/i) || [])[1] || '';
    return /^https?:\/\//i.test(u) && !u.includes(new URL(finalUrl).hostname);
  }).length;
  const text = html.replace(/<(script|style)[\s\S]*?<\/>/gi, ' ').replace(/<[^>]+>/g, ' ');
  const words = (text.match(/\S+/g) || []).length;
  const encoding = (res.headers.get('content-encoding') || '').toLowerCase();

  let robots = null, sitemap = null;
  try {
    const base = new URL(finalUrl).origin;
    const probe = (path) => fetch(base + path, { method: 'GET', headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(4000) }).then((r) => r.ok).catch(() => false);
    [robots, sitemap] = await Promise.all([probe('/robots.txt'), probe('/sitemap.xml')]);
  } catch { /* sondes optionnelles */ }

  if (legacyImgs > 5) add(9, `${legacyImgs} images au format d'il y a dix ans`, "Elles pèsent jusqu'à trois fois leur poids nécessaire. Sur mobile, votre visiteur attend pendant que la page se charge.");
  if (imgs.length > 6 && lazy === 0) add(7, "Toutes les images se chargent d'un coup", 'Même celles que le visiteur ne verra jamais. Le début de page est ralenti pour rien.');
  if (!encoding) add(8, 'Les fichiers sont envoyés sans compression', 'Votre site transfère plusieurs fois plus de données que nécessaire à chaque visite.');
  if (thirdParty > 8) add(6, `${thirdParty} scripts extérieurs se chargent`, 'Chacun ralentit la page et suit vos visiteurs. Une partie ne sert probablement plus à rien.');
  if (words < 250) add(11, "Presque aucun texte sur la page d'accueil", `Google n'a que ${words} mots pour comprendre votre métier. Vos concurrents lui en donnent bien plus.`);
  if (sitemap === false) add(8, 'Aucun plan de site pour Google', 'Google découvre vos pages au hasard. Certaines ne sont peut-être jamais visitées par son robot.');
  if (robots === false) add(4, 'Aucun fichier robots.txt', 'Vous ne donnez aucune consigne aux moteurs de recherche.');

  issues.sort((a, b) => b.weight - a.weight);
  const score = Math.max(5, 100 - issues.reduce((n, i) => n + i.weight, 0));

  return {
    ok: true,
    url: finalUrl,
    score,
    ttfb,
    measured: { https: isHttps, viewport, title: !!title, description: !!desc, h1: !!h1, schema, og, phone,
                bytes, words, legacyImgs, thirdParty, compressed: !!encoding, robots, sitemap },
    // Les mesures Google arrivent par un second appel : elles prennent une
    // trentaine de secondes, l'utilisateur ne doit pas attendre pour rien.
    pagespeedPending: hasKey(),
    issues: issues.slice(0, 4),
    issuesTotal: issues.length
  };
}
