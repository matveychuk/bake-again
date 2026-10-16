import assert from 'node:assert/strict';

const origin = new URL(
  process.env.LANGUAGE_CHECK_URL ?? 'http://localhost:3011',
);
const paths = {
  uk: '/uk/recipes/bezghliutenovi-mlyntsi',
  es: '/es/recipes/crepes-sin-gluten',
  en: '/en/recipes/gluten-free-crepes',
};
const cases = [
  ['Ukrainian browser', 'uk-UA,uk;q=0.9,en;q=0.8', null, 'uk'],
  ['Spanish browser', 'es-ES,es;q=0.9,en;q=0.8', null, 'es'],
  ['English browser', 'en-GB,en;q=0.9', null, 'en'],
  ['Spanish regional variant', 'es-MX', null, 'es'],
  ['Weighted supported language', 'fr-FR,en;q=0.5,es;q=0.9', null, 'es'],
  ['Unsupported browser', 'fr-FR,de;q=0.8', null, 'uk'],
  ['Missing language', null, null, 'uk'],
  ['Excluded language', 'es;q=0,en;q=0.8', null, 'en'],
  ['Saved Ukrainian wins', 'es-ES', 'ba_locale=uk', 'uk'],
  ['Saved Spanish wins', 'en-US', 'ba_locale=es', 'es'],
  ['Saved English wins', 'uk-UA', 'ba_locale=en', 'en'],
  ['Invalid saved choice', 'es-ES', 'ba_locale=fr', 'es'],
];
let checks = 0;
async function request(path, headers = {}) {
  return fetch(new URL(path, origin), {
    redirect: 'manual',
    headers,
    signal: AbortSignal.timeout(30_000),
  });
}
for (const entry of ['/recipes/crepes', '/', '/recipes']) {
  for (const [name, language, cookie, locale] of cases) {
    const headers = {};
    if (language) headers['accept-language'] = language;
    if (cookie) headers.cookie = cookie;
    const response = await request(entry, headers);
    const label = `${entry}: ${name}`;
    assert.equal(response.status, 307, label);
    assert.equal(
      new URL(response.headers.get('location'), origin).pathname,
      entry === '/recipes/crepes' ? paths[locale] : `/${locale}`,
      label,
    );
    assert.match(
      response.headers.get('cache-control') ?? '',
      /no-store/i,
      name,
    );
    const vary = response.headers.get('vary')?.toLowerCase() ?? '';
    assert(
      vary.includes('accept-language') && vary.includes('cookie'),
      `${name}: Vary`,
    );
    await response.arrayBuffer();
    checks++;
  }
}
for (const entry of ['/', '/recipes']) {
  const query = '?utm_source=instagram&collection=breakfast&q=crepes';
  const response = await request(entry + query, { 'accept-language': 'es' });
  assert.equal(response.status, 307);
  const target = new URL(response.headers.get('location'), origin);
  assert.equal(target.pathname, '/es');
  assert.equal(target.search, query);
  await response.arrayBuffer();
  checks++;
}
for (const suffix of ['', '/cook']) {
  const query = '?utm_source=instagram&mode=scale&scale=1.5';
  const response = await request(`/recipes/crepes${suffix}${query}`, {
    'accept-language': 'es',
  });
  assert.equal(response.status, 307);
  const target = new URL(response.headers.get('location'), origin);
  assert.equal(target.pathname, paths.es + suffix);
  assert.equal(target.search, query);
  await response.arrayBuffer();
  checks++;
}
for (const [locale, path] of Object.entries(paths)) {
  const response = await request(path, {
    'accept-language': locale === 'es' ? 'en' : 'es',
    cookie: `ba_locale=${locale === 'es' ? 'en' : 'es'}`,
  });
  assert.equal(response.status, 200, `Explicit ${locale} URL must win`);
  const html = await response.text();
  assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`));
  assert(html.includes('id="ingredients"'), `${locale}: rendered ingredients`);
  assert(html.includes('id="recipe-method"'), `${locale}: rendered method`);
  checks++;
}
for (const locale of Object.keys(paths)) {
  const response = await request(`/${locale}`, {
    'accept-language': locale === 'es' ? 'en' : 'es',
    cookie: `ba_locale=${locale === 'es' ? 'en' : 'es'}`,
  });
  assert.equal(response.status, 200, `Explicit ${locale} home must win`);
  const html = await response.text();
  assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`));
  assert(html.includes('id="recipes"'), `${locale}: rendered catalogue`);
  checks++;
}
console.log(`PASS: ${checks} language-link HTTP checks at ${origin.origin}`);
