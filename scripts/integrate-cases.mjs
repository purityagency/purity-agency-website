import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { caseStudies } from '../data/case-studies.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const today = '2026-09-30';

function addCasesNavigation(html) {
  // Desktop header nav: check specifically inside header__nav
  const headerNavMatch = html.match(/<nav class="header__nav"[^>]*>([\s\S]*?)<\/nav>/i);
  if (headerNavMatch && !headerNavMatch[1].includes('href="/cas-concrets.html"')) {
    html = html.replace(/(<nav class="header__nav"[^>]*>[\s\S]*?<a [^>]*href="(?:\/#services|#services)"[^>]*>Services<\/a>)([\s\S]*?<a [^>]*href="\/?blog\.html")/gi, (m, p1, p2) => {
      return `${p1}\n    <a href="/cas-concrets.html">Cas concrets</a>${p2}`;
    });
  }
  // Mobile popover menu nav
  html = html.replace(/(<nav class="menu__nav">[\s\S]*?<a [^>]*href="(?:\/#services|#services)"[^>]*style="--i:0"[^>]*>Services<\/a>)([\s\S]*?<a [^>]*href="\/?blog\.html")/gi, (m, p1, p2) => {
    if (m.includes('/cas-concrets.html')) return m;
    return `${p1}\n    <a href="/cas-concrets.html" style="--i:1">Cas concrets</a>${p2}`;
  });
  return html.replace(/(<a [^>]*href="\/?blog\.html"[^>]*style=")--i:1("[^>]*>Blog<\/a>)/gi, '$1--i:2$2');
}

const rootFiles = (await readdir(root)).filter((file) => file.endsWith('.html') && file !== 'cas-concrets.html');
for (const file of rootFiles) {
  const path = join(root, file);
  const original = await readFile(path, 'utf8');
  const updated = addCasesNavigation(original);
  if (updated !== original) await writeFile(path, updated);
}

const sitemapPath = join(root, 'sitemap.xml');
let sitemap = await readFile(sitemapPath, 'utf8');
sitemap = sitemap.replace(/\s*<url>\s*<loc>https:\/\/purity-agency\.be\/cas-concrets(?:\/[a-z0-9-]+)?\.html<\/loc>[\s\S]*?<\/url>/g, '');
const caseUrls = [
  'cas-concrets.html',
  ...caseStudies.map((item) => `cas-concrets/${item.id}.html`)
].map((path) => `  <url><loc>https://purity-agency.be/${path}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${path === 'cas-concrets.html' ? '0.8' : '0.7'}</priority></url>`).join('\n');
sitemap = sitemap.replace('</urlset>', `${caseUrls}\n</urlset>`);
await writeFile(sitemapPath, sitemap);

const llmsPath = join(root, 'llms.txt');
let llms = await readFile(llmsPath, 'utf8');
if (!llms.includes('/cas-concrets.html')) {
  llms += `\n## Cas concrets\n- https://purity-agency.be/cas-concrets.html — Douze démonstrations de solutions digitales par métier.\n`;
}
await writeFile(llmsPath, llms);

console.log(`Navigation, sitemap et llms mis à jour pour ${caseStudies.length} cas concrets.`);
