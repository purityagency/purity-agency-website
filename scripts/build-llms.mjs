// Génère llms.txt (index) et llms-full.txt (détaillé) depuis data/services.mjs et les pages ville/métier.
// Usage : node scripts/build-llms.mjs
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { services } from '../data/services.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const O = 'https://purity-agency.be';
const meta = (rel) => {
  const h = readFileSync(join(ROOT, rel), 'utf8');
  const t = (/<title>([^<]*)/.exec(h)?.[1] || '').split('|')[0].trim();
  const d = /name="description" content="([^"]*)/.exec(h)?.[1] || '';
  const c = /rel="canonical" href="([^"]*)/.exec(h)?.[1] || '';
  return { t, d, c };
};
const pages = (dir) => readdirSync(join(ROOT, dir)).filter(f => f.endsWith('.html') && f !== 'index.html').map(f => meta(`${dir}/${f}`));
const villes = pages('agence-web');
const metiers = pages('site-internet');
const cases = pages('cas-concrets');
const articles = readdirSync(ROOT).filter(f => /^article-.+\.html$/.test(f)).map(meta);
// Texte brut d'un fragment HTML (balises retirées, entités courantes décodées).
const txt = (html) => html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, '’').replace(/\s+/g, ' ').trim();
// Articles : titre (H1) et phrase-réponse = première phrase de l'encadré « En bref ».
const articleAnswers = readdirSync(ROOT).filter(f => /^article-.+\.html$/.test(f)).map(f => {
  const h = readFileSync(join(ROOT, f), 'utf8');
  const { c, d } = meta(f);
  const h1 = txt(/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(h)?.[1] || '').replace(/\.$/, '');
  const brief = txt(/<p class="article-brief__label">[^<]*<\/p>\s*<p>([\s\S]*?)<\/p>/.exec(h)?.[1] || '') || d;
  const first = brief.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ý«])/u)[0];
  return `- [${h1}](${c}): ${first}`;
});
// Fondateur : repris de la page À propos (chapô + sections « Qui », « Pourquoi », « Comment »).
const fondateur = (() => {
  const h = readFileSync(join(ROOT, 'a-propos.html'), 'utf8');
  const main = /<main[\s\S]*?<\/main>/.exec(h)?.[0] || '';
  const lead = txt(/<p class="content-hero__lead">([\s\S]*?)<\/p>/.exec(main)?.[1] || '');
  const parts = main.split(/<h2[^>]*>/).slice(1).map(sec => {
    const title = txt(sec.slice(0, sec.indexOf('</h2>')));
    const body = sec.slice(sec.indexOf('</h2>') + 5);
    const items = [...body.matchAll(/<(p|li)[^>]*>([\s\S]*?)<\/(?:p|li)>/g)].map(m => (m[1] === 'li' ? '- ' : '') + txt(m[2])).filter(t => t.replace(/^- /, ''));
    return { title, items };
  }).filter(p => /^(Qui est|Pourquoi|Comment on travaille)/.test(p.title));
  return [lead, ...parts.map(p => `### ${p.title}\n\n${p.items.join('\n')}`)].join('\n\n');
})();
const prix = (s) => s.price || [s.priceSetup, s.monthlyPrice].filter(Boolean).join(' + ');

const IDENT = `Purity Agency est le nom commercial d'Amir Kebiyeb, entreprise personne physique. Numéro d'entreprise (BCE) et TVA : BE 1036.775.590. Régime de la franchise TVA (article 56bis du Code de la TVA) : TVA non applicable. Adresse : Boulevard Frans Dewandre 14, 6000 Charleroi, Belgique. Contact : contact@purity-agency.be.`;
const HEAD = `# Purity Agency

> Agence digitale basée à Charleroi, Belgique. Purity Agency aide les indépendants et PME de Wallonie à moderniser et optimiser leur activité : sites web et e-commerce, visibilité locale, réseaux sociaux, automatisation, intégration d'IA, identité visuelle et outils métier.

${IDENT}

Zone servie : Charleroi et toute la Wallonie (Namur, Mons, La Louvière, Liège, Brabant wallon), à distance ou sur place. Langue : français.`;
const FIABLE = `## Informations fiables

- Les repères de prix affichés sur le site sont indicatifs ; le devis accepté par écrit fixe le périmètre et le prix.
- Une fois la création réglée, le client est propriétaire de ses contenus, visuels, logo et nom de domaine (conditions générales, art. 6).
- Les entreprises présentées dans « Démos par métier » sont fictives : ce sont des démonstrations par métier, pas des références clients.
- OctoMask est l'assistant IA du site : il oriente les visiteurs, ne fixe aucun prix et ne confirme ni paiement ni réservation.
- Premier contact : diagnostic digital gratuit de 15 minutes, sans engagement, réservable sur ${O}/contact ou par e-mail à contact@purity-agency.be.`;
const LEGAL = `## Pages légales

- [Mentions légales](${O}/legal)
- [Politique de confidentialité](${O}/confidentialite)
- [Cookies](${O}/cookies)
- [Conditions générales](${O}/conditions-generales)`;
const list = (arr) => arr.map(p => `- [${p.t}](${p.c}): ${p.d}`).join('\n');

const short = `${HEAD}

## Pages principales

- [Accueil](${O}/): présentation de l'agence et de ses solutions.
- [Services et tarifs](${O}/services): les ${services.length} solutions, avec leurs repères de prix.
- [Agence web par ville](${O}/agence-web): Charleroi, Gosselies, Fleurus, Châtelet, Namur, Mons, La Louvière, Liège, Brabant wallon.
- [Site internet par métier](${O}/site-internet/): pages dédiées à ${metiers.length} métiers.
- [Démos par métier](${O}/cas-concrets): ${cases.length} démonstrations interactives par métier.
- [Blog](${O}/blog): guides pratiques sur l'acquisition, le SEO local, la conversion, l'automatisation et l'IA.
- [À propos](${O}/a-propos): Amir Kebiyeb, fondateur, statut d'entreprise (personne physique, BCE 1036.775.590) et façon de travailler.
- [Contact](${O}/contact): formulaire et réservation d'un appel de 15 minutes, sans engagement.
- [Version détaillée pour IA](${O}/llms-full.txt): offres, livrables, délais et FAQ complets.

## Services et prix indicatifs

${services.map(s => `- [${s.name}](${O}/services/${s.slug}): ${prix(s)}${s.delay ? (/^[0-9]/.test(s.delay) ? `, délai ${s.delay}` : `, ${s.delay[0].toLowerCase() + s.delay.slice(1)}`) : ''}. ${s.summary || ''}`.trim()).join('\n')}

## Agence web par ville

${list(villes)}

## Site internet par métier

${list(metiers)}

## Articles

${articleAnswers.join('\n')}

## Démos par métier (démonstrations fictives)

${cases.map(p => `- [${p.t}](${p.c})`).join('\n')}

${FIABLE}

${LEGAL}
`;

const full = `${HEAD}

Ce fichier détaille chaque offre (prix indicatifs, délais, livrables, FAQ). Index court : ${O}/llms.txt

## Fondateur

${fondateur}

${services.map(s => `## ${s.name}

URL : ${O}/services/${s.slug}
Prix indicatif : ${prix(s)}${s.monthlyNote ? ` (mensuel : ${s.monthlyNote})` : ''}
${s.delay ? `Délai : ${s.delay}\n` : ''}${s.commitment ? `Engagement : ${s.commitment.text}\n` : ''}Pour qui : ${s.targetAudience}
Utilité : ${s.utility}
${s.summary ? `\n${s.summary}\n` : ''}
Livrables :
${s.deliverables.map(d => `- ${d.title || d}${d.desc ? ` : ${d.desc}` : ''}`).join('\n')}
${s.includedMaintenance ? `\nInclus dans le suivi : ${s.includedMaintenance}\n` : ''}
Déroulement :
${s.howItWorks.map((h, i) => `${i + 1}. ${h.title || h}${h.desc ? ` : ${h.desc}` : ''}`).join('\n')}

Questions fréquentes :
${s.faq.map(f => `- ${f.q}\n  ${f.a}`).join('\n')}
`).join('\n')}
## Agence web par ville

${list(villes)}

## Site internet par métier

${list(metiers)}

## Articles du blog

${list(articles)}

## Démos par métier (démonstrations fictives)

${list(cases)}

${FIABLE}

${LEGAL}
`;

writeFileSync(join(ROOT, 'llms.txt'), short);
writeFileSync(join(ROOT, 'llms-full.txt'), full);
console.log(`llms.txt ${short.length} car., llms-full.txt ${full.length} car.`);
