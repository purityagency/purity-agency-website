import { mkdir, writeFile, readFile } from 'node:fs/promises';
// Pinned, self-hosted assets; browsers never contact a third-party CDN.
const root = new URL('../assets/cases/vendor/', import.meta.url);
await mkdir(root, {recursive:true});
for (const [source, file] of [
  ['https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js','three.module.min.js'],
  ['https://cdn.jsdelivr.net/npm/three@0.170.0/LICENSE','THREE-LICENSE.txt'],
]) {
  const response = await fetch(source);
  if (!response.ok) throw new Error(`${file}: ${response.status}`);
  const body = await response.text();
  if(file.endsWith('.js') && !body.includes('WebGLRenderer')) throw new Error('Unexpected module response');
  await writeFile(new URL(file,root),body);
  console.log(`${file}: ${body.length} bytes`);
}
const css = await readFile(new URL('../css/demo-fonts.css',import.meta.url),'utf8');
for(const family of [...css.matchAll(/font-family:'([^']+)'/g)].map(m=>m[1])) {
  const slug=family.toLowerCase().replaceAll(' ','');
  const response=await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${slug}/OFL.txt`);
  if(!response.ok) throw new Error(`License ${family}: ${response.status}`);
  await writeFile(new URL(`../assets/cases/fonts/${family.toLowerCase().replaceAll(' ','-')}-OFL.txt`,import.meta.url),await response.text());
}
