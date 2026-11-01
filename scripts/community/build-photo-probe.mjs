/** Flatten maintained modules for Supabase's Dashboard editor. No credentials. */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import ts from 'typescript';
const root = new URL('../../', import.meta.url);
const files = [
  'scripts/community/wasm-photo.mjs',
  'lib/community/photo-constraints.ts',
  'lib/community/server/photo-admission.ts',
  'lib/community/server/photo-upload.ts',
  'lib/community/server/photo-storage.ts',
  'supabase/functions/community-photo-probe/admission-probe.mjs',
  'supabase/functions/community-photo-probe/index.mjs',
];
const parts = [];
for (const file of files) {
  let source = await readFile(new URL(file, root), 'utf8');
  // TypeScript is already checked by the application's tsc. This only erases
  // types and local imports for the single-file Deno artifact.
  source = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  source = source.replace(
    /^import\s+[\s\S]*?from\s+["']([^"']+)["'];/gm,
    (statement, path) => {
      if (path.startsWith('.')) return '';
      if (path === 'npm:@imagemagick/magick-wasm@0.0.45') return statement;
      throw new Error(`Unexpected probe import: ${path}`);
    },
  );
  source = source.replace(
    /^export\s*\{[^}]*\}\s*from\s*['"][^'"]+['"];?\s*$/gm,
    '',
  );
  source = source.replace(/^export (?!default)/gm, '');
  // Transpile of type-only modules may emit an empty ESM marker.
  source = source.replace(/^\{\s*\};?\s*$/gm, '');
  parts.push(`// Source: ${file}\n${source}`);
}
const bundled = parts.join('\n');
await mkdir(new URL('tmp/community-edge-probe/', root), { recursive: true });
await writeFile(new URL('tmp/community-edge-probe/index.mjs', root), bundled);
console.log('Prepared tmp/community-edge-probe/index.mjs (no secrets).');
