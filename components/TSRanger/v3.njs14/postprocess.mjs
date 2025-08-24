import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist.njs14');

async function listFiles(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await listFiles(full)));
    } else if (e.isFile() && e.name.endsWith('.js')) {
      out.push(full);
    }
  }
  return out;
}

function rewriteImports(src) {
  const re = /((?:from\s+|import\s*\()\s*['"])(\.\.?(?:\/[A-Za-z0-9_.-]+)+)(['"]\s*\)?)/g;
  return src.replace(re, (_, pre, spec, post) => {
    // leave Node built-ins and non-relative as-is
    let s = spec;
    if (s.endsWith('.js') || s.endsWith('.json') || s.endsWith('.node')) return `${pre}${s}${post}`;
    if (s.endsWith('.ts')) s = s.slice(0, -3) + '.js';
    else s = s + '.js';
    return `${pre}${s}${post}`;
  });
}

async function main() {
  const files = await listFiles(DIST);
  await Promise.all(
    files.map(async f => {
      const orig = await fs.readFile(f, 'utf8');
      const next = rewriteImports(orig);
      if (next !== orig) {
        await fs.writeFile(f, next);
      }
    })
  );
  console.log(`[njs14] postprocess complete: ${files.length} files scanned`);
}

main().catch(err => {
  console.error('[njs14] postprocess failed:', err?.stack || err);
  process.exit(1);
});