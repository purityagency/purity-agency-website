import { mkdir, writeFile } from 'node:fs/promises';
const fonts = ['Bodoni Moda','Cormorant Garamond','Barlow Condensed','DM Serif Display','Marcellus','Libre Baskerville','Fraunces','Archivo Black','Lora','Bricolage Grotesque','Space Grotesk','Sora','DM Sans','Manrope','Source Sans 3'];
const root = new URL('../assets/cases/fonts/', import.meta.url);
await mkdir(root, { recursive:true });
let styles = '';
for (const family of fonts) {
  const response = await fetch(`https://fonts.googleapis.com/css2?family=${family.replaceAll(' ','+')}&display=swap`, {headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}});
  if (!response.ok) throw new Error(`Font stylesheet ${family}: ${response.status}`);
  const css = await response.text();
  const blocks = [...css.matchAll(/@font-face\s*\{[^}]+\}/g)].map(m=>m[0]);
  const latin = blocks.find(b=>/U\+0000-00FF/i.test(b)) || blocks.at(-1);
  const url = latin?.match(/url\(([^)]+)\)/)?.[1];
  if (!url) throw new Error(`No font asset: ${family}`);
  const font = await fetch(url);
  if (!font.ok) throw new Error(`Font asset ${family}: ${font.status}`);
  const filename = family.toLowerCase().replaceAll(' ','-') + '.woff2';
  const bytes = Buffer.from(await font.arrayBuffer());
  if (bytes.subarray(0,4).toString() !== 'wOF2') throw new Error(`Expected woff2 for ${family}`);
  await writeFile(new URL(filename,root),bytes);
  styles += `@font-face{font-family:'${family}';src:url('/assets/cases/fonts/${filename}') format('woff2');font-weight:400;font-display:swap;}\n`;
  console.log(`${family}: ${Math.round(bytes.length/1024)} KB`);
}
await writeFile(new URL('../css/demo-fonts.css',import.meta.url),styles);
