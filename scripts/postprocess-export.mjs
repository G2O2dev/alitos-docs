import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? '.');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function stripExternalHeadReferences(html) {
  return html
    .replace(/<link[^>]+href="https:\/\/d4tuoctqmanu0\.cloudfront\.net\/katex\.min\.css"[^>]*>/g, '')
    .replace(/<link[^>]+href="https:\/\/fonts\.googleapis\.com[^"]*"[^>]*>/g, '')
    .replace(/<link[^>]+href="https:\/\/fonts\.gstatic\.com[^"]*"[^>]*>/g, '')
    .replace(/<meta[^>]+(?:property|name)="(?:og:image|og:image:width|og:image:height|twitter:image|twitter:image:width|twitter:image:height)"[^>]*>/g, '')
    .replace(/https:\/\/mintlify\.mintlify\.app\/_next\/image\?[^"\\<]+(?:\\u0026q=100|&amp;q=100|&q=100)?/g, '/logo/favicon.svg')
    .replace(/url\(https:\/\/d3gk2c5xim1je2\.cloudfront\.net\/[^)]+\)/g, 'none');
}

const htmlFiles = (await walk(root)).filter((file) => file.endsWith('.html'));

for (const file of htmlFiles) {
  const original = await fs.readFile(file, 'utf8');
  const next = stripExternalHeadReferences(original);

  if (next !== original) {
    await fs.writeFile(file, next);
  }
}

console.log(`Post-processed ${htmlFiles.length} HTML files in ${root}`);
