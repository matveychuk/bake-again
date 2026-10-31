import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { prepareCommunityPhoto, PHOTO_MAX_BYTES } from './prepare-photo.mjs';

void test('photo probe decodes, bounds, rotates, re-encodes and strips private metadata', async () => {
  const input = await sharp({
    create: { width: 2000, height: 1200, channels: 3, background: 'red' },
  })
    .withExif({ IFD0: { Artist: 'private-test-author' } })
    .jpeg()
    .toBuffer();
  const output = await prepareCommunityPhoto(input, 'image/jpeg');
  for (const [bytes, max] of [
    [output.web, 1600],
    [output.thumbnail, 480],
  ]) {
    const meta = await sharp(bytes).metadata();
    assert.equal(meta.format, 'webp');
    assert.ok(meta.width <= max && meta.height <= max);
    assert.equal(meta.exif, undefined);
    assert.equal(meta.xmp, undefined);
    assert.ok(bytes.length < input.length);
  }
  const rotated = await sharp({
    create: { width: 100, height: 60, channels: 3, background: 'red' },
  })
    .withMetadata({ orientation: 6 })
    .jpeg()
    .toBuffer();
  const meta = await sharp(
    (await prepareCommunityPhoto(rotated, 'image/jpeg')).web,
  ).metadata();
  assert.equal(meta.width, 60);
  assert.equal(meta.height, 100);
});
void test('reject MIME mismatch, corrupt content, SVG, HEIC, animation, byte and pixel bombs', async () => {
  const png = await sharp({
    create: { width: 20, height: 20, channels: 3, background: 'red' },
  })
    .png()
    .toBuffer();
  await assert.rejects(
    prepareCommunityPhoto(png, 'image/jpeg'),
    /PHOTO_FORMAT/,
  );
  await assert.rejects(
    prepareCommunityPhoto(Buffer.from('not a photo'), 'image/png'),
  );
  await assert.rejects(
    prepareCommunityPhoto(Buffer.from('<svg/>'), 'image/svg+xml'),
    /PHOTO_FORMAT/,
  );
  await assert.rejects(
    prepareCommunityPhoto(png, 'image/heic'),
    /PHOTO_FORMAT/,
  );
  await assert.rejects(
    prepareCommunityPhoto(Buffer.alloc(PHOTO_MAX_BYTES + 1), 'image/jpeg'),
    /PHOTO_SIZE/,
  );
  const huge = await sharp({
    create: { width: 5000, height: 5000, channels: 3, background: 'red' },
  })
    .png()
    .toBuffer();
  await assert.rejects(prepareCommunityPhoto(huge, 'image/png'), /pixel limit/);
  const frames = Buffer.concat([
    Buffer.alloc(16, 255),
    Buffer.from([0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255]),
  ]);
  const animated = await sharp(frames, {
    raw: { width: 2, height: 4, channels: 4, pageHeight: 2 },
  })
    .webp({ delay: [100, 100] })
    .toBuffer();
  assert.equal((await sharp(animated, { animated: true }).metadata()).pages, 2);
  await assert.rejects(
    prepareCommunityPhoto(animated, 'image/webp'),
    /PHOTO_FORMAT/,
  );
});
