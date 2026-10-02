import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
await rm(new URL('dist/', root), { recursive: true, force: true });
await mkdir(new URL('dist/', root), { recursive: true });
for (const file of ['index.html', 'favicon.svg', 'styles.css', 'src']) await cp(new URL(file, root), new URL(`dist/${file}`, root), { recursive: true });
await writeFile(new URL('dist/.nojekyll', root), '');
console.log('Built static site in dist/ (HTML, CSS, JavaScript only).');
