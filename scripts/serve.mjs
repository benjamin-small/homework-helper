import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(new URL('../', import.meta.url).pathname);
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relative = path === '/' ? 'index.html' : path.slice(1);
    const file = resolve(root, relative);
    if (!file.startsWith(root + sep) || relative.split('/').some(part => part.startsWith('.')) || !types[extname(file)]) {
      response.writeHead(404).end('Not found'); return;
    }
    const content = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)], 'Cache-Control': 'no-store' }).end(content);
  } catch { response.writeHead(404).end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Word Workshop: http://127.0.0.1:${port}`));
