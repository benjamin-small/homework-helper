import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { LISTS } from '../src/lists.js';
import { validateCatalog } from '../src/list-schema.js';
validateCatalog(LISTS);
const root = new URL('../', import.meta.url);
await rm(new URL('dist/', root), { recursive: true, force: true });
await mkdir(new URL('dist/', root), { recursive: true });
for (const file of ['index.html', 'favicon.svg', 'styles.css', 'src']) await cp(new URL(file, root), new URL(`dist/${file}`, root), { recursive: true });
async function scriptPaths(directory = 'src') {
  const entries = await readdir(new URL(`${directory}/`, root), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) files.push(...await scriptPaths(path));
    else if (entry.name.endsWith('.js')) files.push(path);
  }
  return files.sort();
}
const scripts = await scriptPaths();
const hash = createHash('sha256');
for (const file of ['index.html', 'styles.css', ...scripts]) hash.update(file).update(await readFile(new URL(file, root)));
const version = hash.digest('hex').slice(0, 12);
// Version every import, not only the entrypoint: browsers cache modules separately.
for (const file of scripts) {
  const source = await readFile(new URL(file, root), 'utf8');
  const versioned = source.replace(/((?:from|import)\s*['"])(\.{1,2}\/[^'"]+\.js)(['"])/g, `$1$2?v=${version}$3`);
  await writeFile(new URL(`dist/${file}`, root), versioned);
}
const html = await readFile(new URL('index.html', root), 'utf8');
await writeFile(new URL('dist/index.html', root), html.replaceAll('./styles.css', `./styles.css?v=${version}`).replaceAll('./src/main.js', `./src/main.js?v=${version}`));
await writeFile(new URL('dist/.nojekyll', root), '');
console.log('Built static site in dist/ (HTML, CSS, JavaScript only).');
