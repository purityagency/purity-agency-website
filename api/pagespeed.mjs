// Core Web Vitals reels via PageSpeed Insights. La cle vient de
// PAGESPEED_API_KEY ou de secrets/.pagespeed-key ; sans cle l'API repond
// encore mais tombe vite en 429, donc le module se desactive proprement.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));

function readKey() {
  if (process.env.PAGESPEED_API_KEY) return process.env.PAGESPEED_API_KEY.trim();
  try {
    return readFileSync(resolve(HERE, '../../secrets/.pagespeed-key'), 'utf8').trim();
  } catch {
    return '';
  }
}

export const hasKey = () => !!readKey();

export async function pagespeed(url) {
  const key = readKey();
  if (!key) return null;

  const api = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  api.searchParams.set('url', url);
  api.searchParams.set('strategy', 'mobile');   // la majorite des visiteurs
  api.searchParams.set('category', 'performance');
  api.searchParams.set('key', key);

  let data;
  try {
    const r = await fetch(api, { signal: AbortSignal.timeout(45000) });
    if (!r.ok) return null;
    data = await r.json();
  } catch {
    return null;
  }

  const lh = data?.lighthouseResult;
  if (!lh) return null;
  const audits = lh.audits || {};
  const num = (id) => audits[id]?.numericValue ?? null;

  return {
    score: Math.round((lh.categories?.performance?.score ?? 0) * 100),
    lcp: num('largest-contentful-paint'),
    cls: audits['cumulative-layout-shift']?.numericValue ?? null,
    tbt: num('total-blocking-time')
  };
}

// Traduit les mesures en consequences comprehensibles par un dirigeant.
export function pagespeedIssues(ps) {
  const out = [];
  if (!ps) return out;

  if (ps.score < 50) {
    out.push({ weight: 24, label: `Performance mobile : ${ps.score}/100 selon Google`,
      detail: "C'est la note que Google attribue lui-même à votre site sur mobile. En dessous de 50, il vous fait descendre dans les résultats de recherche." });
  } else if (ps.score < 80) {
    out.push({ weight: 12, label: `Performance mobile : ${ps.score}/100 selon Google`,
      detail: 'Votre site passe, sans plus. Vos concurrents mieux notés vous passent devant à contenu égal.' });
  }

  if (ps.lcp && ps.lcp > 4000) {
    out.push({ weight: 20, label: `${(ps.lcp / 1000).toFixed(1)} s avant de voir le contenu principal`,
      detail: "C'est le temps réel mesuré sur un mobile. Passé 3 secondes, une bonne partie des visiteurs est déjà repartie chez un concurrent." });
  } else if (ps.lcp && ps.lcp > 2500) {
    out.push({ weight: 10, label: `${(ps.lcp / 1000).toFixed(1)} s avant de voir le contenu principal`,
      detail: 'Google considère au-delà de 2,5 secondes que l\u2019expérience est dégradée, et en tient compte dans son classement.' });
  }

  if (ps.cls && ps.cls > 0.25) {
    out.push({ weight: 12, label: 'La page bouge pendant le chargement',
      detail: 'Le visiteur clique au mauvais endroit parce que le contenu se décale sous son doigt. C\u2019est agaçant, et ça fait fuir.' });
  }

  if (ps.tbt && ps.tbt > 600) {
    out.push({ weight: 10, label: 'La page reste figée quelques instants',
      detail: 'Pendant ce temps les clics ne répondent pas. Le visiteur croit que le site est cassé.' });
  }

  return out;
}
