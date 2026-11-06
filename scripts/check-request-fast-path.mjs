import assert from 'node:assert/strict';

const origin = process.env.FAST_PATH_CHECK_URL ?? 'http://localhost:3012';
const get = (path, init = {}) =>
  fetch(new URL(path, origin), { redirect: 'manual', ...init });

for (const path of [
  '/favicon.ico',
  '/uk/favicon.ico',
  '/en/favicon.ico',
  '/es/favicon.svg',
]) {
  for (const method of ['GET', 'HEAD']) {
    const response = await get(path, { method });
    assert.equal(response.status, 308, path);
    assert.equal(response.headers.get('location'), '/favicon.svg', path);
    assert.equal(await response.text(), '', path);
  }
}
const icon = await get('/favicon.svg');
assert.equal(icon.status, 200);
assert.match(icon.headers.get('content-type') ?? '', /image\/svg\+xml/);
assert.match(await icon.text(), /<svg/);

for (const path of [
  '/wp-login.php',
  '/uk/wp-admin/install.php?step=1',
  '/.env',
  '/.git/config',
  '/uk/backup.sql',
]) {
  const response = await get(path);
  assert.equal(response.status, 404, path);
  assert.equal(await response.text(), 'Not found', path);
}
const missing = await get('/images/fast-path-missing.webp');
assert.equal(missing.status, 404);
assert.doesNotMatch(await missing.text(), /<html|__vite|react/i);

const home = await get('/uk');
assert.equal(home.status, 200);
const html = await home.text();
assert.match(html, /<html[^>]+lang="uk"/);
const imageTags = html.match(/<img\b[^>]*>/g) ?? [];
assert(imageTags.length > 0, 'Homepage should contain food images');
for (const image of imageTags) assert(!image.includes('/_next/image'), image);
assert(
  imageTags.some((image) =>
    /src="\/(?:images|media)\/[^"]+\.webp"/.test(image),
  ),
  'Food uses prepared WebP assets',
);
for (const path of ['/robots.txt', '/sitemap.xml']) {
  const response = await get(path);
  assert.equal(response.status, 200, path);
}
for (const path of ['/share-image.webp', '/share-image-v4.webp']) {
  const response = await get(path);
  assert.equal(response.status, 200, path);
  assert.match(response.headers.get('content-type') ?? '', /image\/webp/, path);
}
console.log(
  'Production Worker fast paths, favicon, metadata and direct WebP rendering passed.',
);
