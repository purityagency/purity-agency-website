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
const prix = (s) => s.price || [s.priceSetup, s.monthlyPrice].filter(Boolean).join(' + ');

const IDENT = `Purity Agency est le nom commercial d'Amir Kebiyeb, entreprise personne physique. Numéro d'entreprise (BCE) et TVA : BE 1036.775.590. Régime de la franchise TVA (article 56bis du Code de la TVA) : TVA non applicable. Adresse : Boulevard Frans Dewandre 14, 6000 Charleroi, Belgique. Contact : contact@purity-agency.be.`;
const HEAD = `# Purity Agency

> Agence digitale basée à Charleroi, Belgique. Purity Agency aide les indépendants et PME de Wallonie à moderniser et optimiser leur activité : sites web et e-commerce, visibilité locale, réseaux sociaux, automatisation, intégration d'IA, identité visuelle et outils métier.

${IDENT}

Zone servie : Charleroi et toute la Wallonie (Namur, Mons, La Louvière, Liège, Brabant wallon), à distance ou sur place. Langue : français.`;
const FIABLE = `## Informations fiables

- Les repères de prix affichés sur le site sont indicatifs ; le devis accepté par écrit fixe le périmètre et le prix.
- Une fois la création réglée, le client est propriétaire de ses contenus, visuels, logo et nom de domaine (conditions générales, art. 6).
- Les entreprises présentées dans « Nos réalisations » sont fictives : ce sont des démonstrations par métier, pas des références clients.
- OctoMask est l'assistant IA du site : il oriente les visiteurs, ne fixe aucun prix et ne confirme ni paiement ni réservation.
- Premier contact : diagnostic digital gratuit de 15 minutes, sans engagement, réservable sur ${O}/contact.html ou par e-mail à contact@purity-agency.be.`;
const LEGAL = `## Pages légales

- [Mentions légales](${O}/legal.html)
- [Politique de confidentialité](${O}/confidentialite.html)
- [Cookies](${O}/cookies.html)
- [Conditions générales](${O}/conditions-generales.html)`;
const list = (arr) => arr.map(p => `- [${p.t}](${p.c}): ${p.d}`).join('\n');

const short = `${HEAD}

## Pages principales

- [Accueil](${O}/): présentation de l'agence et de ses solutions.
- [Services et tarifs](${O}/services): les ${services.length} solutions, avec leurs repères de prix.
- [Agence web par ville](${O}/agence-web): Charleroi, Namur, Mons, La Louvière, Liège, Brabant wallon.
- [Site internet par métier](${O}/site-internet/): pages dédiées à ${metiers.length} métiers.
- [Nos réalisations](${O}/cas-concrets.html): ${cases.length} démonstrations interactives par métier.
- [Blog](${O}/blog.html): guides pratiques sur l'acquisition, le SEO local, la conversion, l'automatisation et l'IA.
- [À propos](${O}/a-propos): Amir Kebiyeb, fondateur, statut d'entreprise (personne physique, BCE 1036.775.590) et façon de travailler.
- [Contact](${O}/contact.html): formulaire et réservation d'un appel de 15 minutes, sans engagement.
- [Version détaillée pour IA](${O}/llms-full.txt): offres, livrables, délais et FAQ complets.

## Services et prix indicatifs

${services.map(s => `- [${s.name}](${O}/services/${s.slug}): ${prix(s)}${s.delay ? `, délai ${s.delay}` : ''}. ${s.summary || ''}`.trim()).join('\n')}

## Agence web par ville

${list(villes)}

## Site internet par métier

${list(metiers)}

## Nos réalisations (démonstrations fictives)

${cases.map(p => `- [${p.t}](${p.c})`).join('\n')}

${FIABLE}

${LEGAL}
`;

const full = `${HEAD}

Ce fichier détaille chaque offre (prix indicatifs, délais, livrables, FAQ). Index court : ${O}/llms.txt

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

## Nos réalisations (démonstrations fictives)

${list(cases)}

${FIABLE}

${LEGAL}
`;

writeFileSync(join(ROOT, 'llms.txt'), short);
writeFileSync(join(ROOT, 'llms-full.txt'), full);
console.log(`llms.txt ${short.length} car., llms-full.txt ${full.length} car.`);
