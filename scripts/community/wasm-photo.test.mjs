import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import * as magick from '@imagemagick/magick-wasm';
import { processEdgePhoto, EDGE_PHOTO_MAX_BYTES } from './wasm-photo.mjs';
await magick.initializeImageMagick(
  await readFile(
    new URL(import.meta.resolve('@imagemagick/magick-wasm/magick.wasm')),
  ),
);

void test('the exact edge WASM processor resizes real food and removes EXIF and XMP', async () => {
  const real = await readFile(
    new URL(
      '../../media/web-source/media/recipes/banana-fritters/selected/finished-pan-author-v1.jpg',
      import.meta.url,
    ),
  );
  const photo = await sharp(real)
    .withExif({ IFD0: { Artist: 'synthetic-private-author' } })
    .jpeg()
    .toBuffer();
  const started = performance.now();
  const result = processEdgePhoto(photo, 'image/jpeg', magick);
  for (const [part, max] of [
    [result.web, 1600],
    [result.thumbnail, 480],
  ]) {
    const meta = await sharp(part.data).metadata();
    assert.equal(meta.format, 'webp');
    assert.ok(meta.width <= max && meta.height <= max);
    assert.equal(meta.exif, undefined);
    assert.equal(meta.xmp, undefined);
  }
  console.log(
    `WASM local processing ${Math.round(performance.now() - started)} ms (not a hosted measurement)`,
  );
});
void test('edge bounds reject bad MIME, corrupt rasters, animations, bytes and pixels before processing', async () => {
  const input = await sharp({
    create: { width: 20, height: 20, channels: 3, background: 'red' },
  })
    .png()
    .toBuffer();
  assert.throws(
    () => processEdgePhoto(input, 'image/jpeg', magick),
    /PHOTO_FORMAT/,
  );
  assert.throws(
    () =>
      processEdgePhoto(
        new Uint8Array(EDGE_PHOTO_MAX_BYTES + 1),
        'image/png',
        magick,
      ),
    /PHOTO_SIZE/,
  );
  assert.throws(() =>
    processEdgePhoto(
      new Uint8Array([255, 216, 255, 0, 0]),
      'image/jpeg',
      magick,
    ),
  );
  const huge = await sharp({
    create: { width: 2500, height: 2000, channels: 3, background: 'red' },
  })
    .png()
    .toBuffer();
  assert.throws(
    () => processEdgePhoto(huge, 'image/png', magick),
    /PHOTO_PIXELS/,
  );
  const frames = Buffer.concat([
    Buffer.alloc(16, 255),
    Buffer.from([0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255]),
  ]);
  const animated = await sharp(frames, {
    raw: { width: 2, height: 4, channels: 4, pageHeight: 2 },
  })
    .webp({ delay: [100, 100] })
    .toBuffer();
  assert.throws(
    () => processEdgePhoto(animated, 'image/webp', magick),
    /PHOTO_ANIMATION/,
  );
});
