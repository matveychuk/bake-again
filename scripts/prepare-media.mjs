import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const sourceRoot = path.join(projectRoot, 'media/web-source');
const publicRoot = path.join(projectRoot, 'public');
const generatedRoots = ['images', 'media', 'social'];
const codeRoots = ['app', 'components', 'content', 'lib'];
const rasterExtensions = new Set(['.png', '.jpg', '.jpeg']);
const sourceExtensions = new Set([...rasterExtensions, '.mp4']);
const codeExtensions = new Set(['.ts', '.tsx', '.css']);
const maximumWidth = 1800;
const webpQuality = 82;
const publishBudgetBytes = 64 * 1024 * 1024;

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const filename = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(filename) : [filename];
    }),
  );
  return nested.flat();
}

async function readProductSource() {
  const files = (
    await Promise.all(
      codeRoots.map((root) => walk(path.join(projectRoot, root))),
    )
  )
    .flat()
    .filter((filename) => codeExtensions.has(path.extname(filename)));
  return (
    await Promise.all(files.map((filename) => fs.readFile(filename, 'utf8')))
  ).join('\n');
}

function publishRelativePath(sourceFilename) {
  const relative = path.relative(sourceRoot, sourceFilename);
  const extension = path.extname(relative).toLowerCase();
  return rasterExtensions.has(extension)
    ? `${relative.slice(0, -extension.length)}.webp`
    : relative;
}

function isReferenced(relative, productSource) {
  const normalized = relative.split(path.sep).join('/');
  return (
    productSource.includes(`/${normalized}`) ||
    productSource.includes(path.basename(normalized))
  );
}

async function prepareAsset(sourceFilename, outputFilename) {
  await fs.mkdir(path.dirname(outputFilename), { recursive: true });
  if (!rasterExtensions.has(path.extname(sourceFilename).toLowerCase())) {
    await fs.copyFile(sourceFilename, outputFilename);
    return;
  }

  await sharp(sourceFilename)
    .rotate()
    .resize({ width: maximumWidth, withoutEnlargement: true })
    .webp({ quality: webpQuality, effort: 6, smartSubsample: true })
    .toFile(outputFilename);
}

function formatMiB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

const productSource = await readProductSource();
const oldRasterReferences =
  productSource.match(
    /\/(?:images|media|social)\/[^'"`\s)]+\.(?:png|jpe?g)/gi,
  ) ?? [];
if (oldRasterReferences.length) {
  throw new Error(
    `Use generated .webp URLs in product code:\n${[...new Set(oldRasterReferences)].join('\n')}`,
  );
}

const sourceFiles = (await walk(sourceRoot)).filter((filename) =>
  sourceExtensions.has(path.extname(filename).toLowerCase()),
);

for (const root of generatedRoots) {
  await fs.rm(path.join(publicRoot, root), { recursive: true, force: true });
}

let generatedBytes = 0;
let generatedCount = 0;
let skippedCount = 0;
for (const sourceFilename of sourceFiles) {
  const relative = publishRelativePath(sourceFilename);
  if (!isReferenced(relative, productSource)) {
    skippedCount += 1;
    continue;
  }
  const outputFilename = path.join(publicRoot, relative);
  await prepareAsset(sourceFilename, outputFilename);
  generatedBytes += (await fs.stat(outputFilename)).size;
  generatedCount += 1;
}

const literalReferences = [
  ...productSource.matchAll(
    /['"`](\/(?:images|media|social)\/[^'"`$\s)]+)['"`]/g,
  ),
].map((match) => match[1]);
const missing = [];
for (const reference of new Set(literalReferences)) {
  try {
    await fs.access(path.join(publicRoot, reference.slice(1)));
  } catch {
    missing.push(reference);
  }
}
if (missing.length) {
  throw new Error(
    `Missing generated media for product references:\n${missing.join('\n')}`,
  );
}
if (generatedBytes > publishBudgetBytes) {
  throw new Error(
    `Generated media is ${formatMiB(generatedBytes)}; keep it under ${formatMiB(publishBudgetBytes)}.`,
  );
}

console.log(
  `Prepared ${generatedCount} referenced media files (${formatMiB(generatedBytes)}); ` +
    `left ${skippedCount} source files out of the publish bundle.`,
);
