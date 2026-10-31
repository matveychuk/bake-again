/** Node-only stage-0 decoder. NEVER import into the Cloudflare Worker bundle. */
import sharp from 'sharp';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const PHOTO_MAX_BYTES = 10 * 1024 * 1024;
export const PHOTO_MAX_PIXELS = 24_000_000;
export async function prepareCommunityPhoto(bytes, declaredType) {
  if (!bytes?.length || bytes.length > PHOTO_MAX_BYTES)
    throw new Error('PHOTO_SIZE');
  const allowed = {
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  const expected = allowed[declaredType];
  if (!expected) throw new Error('PHOTO_FORMAT');
  const options = {
    limitInputPixels: PHOTO_MAX_PIXELS,
    failOn: 'warning',
    animated: true,
  };
  const metadata = await sharp(bytes, options).metadata();
  if (
    metadata.format !== expected ||
    !metadata.width ||
    !metadata.height ||
    (metadata.pages ?? 1) !== 1
  )
    throw new Error('PHOTO_FORMAT');
  // Fresh encoding strips EXIF/GPS; decode validates content rather than trusting MIME.
  const image = sharp(bytes, options).rotate();
  const web = await image
    .clone()
    .resize({
      width: 1600,
      height: 1600,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toBuffer();
  const thumbnail = await image
    .clone()
    .resize({
      width: 480,
      height: 480,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 78 })
    .toBuffer();
  return { web, thumbnail };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const [source, mime, destination] = process.argv.slice(2);
  if (!source || !mime || !destination)
    throw new Error(
      'Usage: node scripts/community/prepare-photo.mjs SOURCE MIME OUTPUT_DIRECTORY',
    );
  const bytes = await readFile(source);
  const { web, thumbnail } = await prepareCommunityPhoto(bytes, mime);
  await mkdir(destination, { recursive: true });
  // Never overwrite reviewed files or originals on a repeated probe.
  await writeFile(resolve(destination, 'web.webp'), web, { flag: 'wx' });
  await writeFile(resolve(destination, 'thumbnail.webp'), thumbnail, {
    flag: 'wx',
  });
  console.log(
    JSON.stringify({
      runtime: 'local-node-only',
      originalBytes: bytes.length,
      webBytes: web.length,
      thumbnailBytes: thumbnail.length,
      remoteUpload: false,
    }),
  );
}
