import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const origin = process.env.DOWNLOAD_CHECK_URL ?? 'http://localhost:3011';
const get = (path) => fetch(new URL(path, origin), { signal: AbortSignal.timeout(30_000) });
const page = await get('/uk/mlyntsi-recept');
assert.equal(page.status, 200);
const html = await page.text();
assert.match(html, /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/);
assert.match(html, /Що далі/);
assert.match(html, /href="\/uk\/privacy"/);
assert.doesNotMatch(await (await get('/sitemap.xml')).text(), /mlyntsi-recept/);
const privacy = await get('/uk/privacy');
assert.equal(privacy.status, 200);
assert.match(await privacy.text(), /Brevo/);

for (const file of ['Bake-Again-Bezghliutenovi-mlyntsi.pdf', 'Bake-Again-Mlyntsi-kartka-yunoho-kukharia.pdf']) {
  const path = `/downloads/${file}`;
  assert.ok(html.includes(`href="${path}"`));
  const start = performance.now();
  const response = await get(path);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') ?? '', /application\/pdf/);
  // Sites serves static assets with max-age=0; local Wrangler applies _headers.
  // Both forms force validation before reusing a stable URL's cached response.
  const cache = response.headers.get('cache-control') ?? '';
  assert.match(cache, /(?:no-cache|max-age=0)/);
  assert.match(cache, /must-revalidate/);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
  assert.deepEqual(bytes, await readFile(new URL(`../public${path}`, import.meta.url)));
  console.log(JSON.stringify({ path, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), cache, httpMilliseconds: Math.round(performance.now() - start) }));
}
console.log('PASS: delivery page, noindex, sitemap exclusion, privacy, both PDF bodies and headers. HTTP timings are not phone opening/saving tests.');
