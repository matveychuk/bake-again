import assert from 'node:assert/strict';

const origin = process.env.SEO_CHECK_URL ?? 'http://localhost:3011';
const expectedVerification = process.env.SEO_EXPECT_VERIFICATION;
const request = (path, options = {}) =>
  fetch(new URL(path, origin), {
    redirect: 'manual',
    signal: AbortSignal.timeout(30_000),
    ...options,
  });
const attr = (tag, name) =>
  tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'))?.[1];
const meta = (html, name) =>
  [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .find(
      (tag) => attr(tag, 'name') === name || attr(tag, 'property') === name,
    );
const link = (html, language) =>
  [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((tag) => attr(tag, 'hreflang') === language);
const schemas = (html) =>
  [
    ...html.matchAll(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].map((match) => JSON.parse(match[1]));
const decode = (text) =>
  text
    .replaceAll('&amp;', '&')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#39;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
const checkVerification = (html) => {
  const value = meta(html, 'google-site-verification');
  if (expectedVerification)
    assert.equal(attr(value ?? '', 'content'), expectedVerification);
  else assert.equal(value, undefined);
};

for (const [language, target] of [
  [null, 'en'],
  ['uk-UA,uk;q=0.9,en;q=0.5', 'uk'],
  ['es-ES,es;q=0.9', 'es'],
  ['en-GB', 'en'],
  ['de-DE', 'en'],
]) {
  const response = await request('/?campaign=seo', {
    headers: language ? { 'Accept-Language': language } : {},
  });
  assert.equal(response.status, 307);
  const location = new URL(response.headers.get('location'), origin);
  assert.equal(location.pathname, `/${target}`);
  assert.equal(location.search, '?campaign=seo');
  assert.ok(
    response.headers.get('vary')?.toLowerCase().includes('accept-language'),
  );
  assert.match(response.headers.get('cache-control') ?? '', /no-store/);
}
const sitemapResponse = await request('/sitemap.xml');
assert.equal(sitemapResponse.status, 200);
const sitemap = await sitemapResponse.text();
const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(
  (match) => match[1],
);
assert.equal(entries.length, 78);
assert.equal(
  entries.filter((e) => /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/.test(e)).length,
  78,
);
for (const entry of entries) {
  assert.match(
    entry,
    /hreflang="x-default" href="https:\/\/bakeagain\.com\/en(?:\/|\")/,
  );
  assert.ok(
    !/\/(saved|shopping-list|account|api|drafts|cook)(\/|<)/.test(entry),
  );
}
const slugs = {
  uk: 'bezghliutenovyi-napoleon',
  en: 'gluten-free-napoleon-cake',
  es: 'tarta-napoleon-sin-gluten',
};
let recipePages = 0;
for (const entry of entries) {
  const path = new URL(entry.match(/<loc>(.*?)<\/loc>/)[1]).pathname;
  const response = await request(path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  const head = html.slice(0, html.indexOf('</head>'));
  assert.ok(head.toLowerCase().includes('hreflang="x-default"'), path);
  checkVerification(head);
  if (path.includes('/recipes/')) {
    const recipe = schemas(html).find((schema) => schema['@type'] === 'Recipe');
    assert.ok(recipe, path);
    assert.equal(
      recipe.description,
      decode(attr(meta(head, 'description'), 'content')),
    );
    assert.equal(attr(meta(head, 'og:type'), 'content'), 'article');
    assert.equal(recipe.suitableForDiet, 'https://schema.org/GlutenFreeDiet');
    assert.ok(recipe.author.name && recipe.author.url);
    assert.ok(recipe.dateModified, path);
    assert.ok(!('datePublished' in recipe));
    for (const forbidden of ['aggregateRating', 'review', 'nutrition'])
      assert.ok(!(forbidden in recipe));
    assert.equal(recipe.image.length, 2);
    recipePages++;
  }
}
assert.equal(recipePages, 66);
for (const [locale, slug] of Object.entries(slugs)) {
  const html = await (await request(`/${locale}/recipes/${slug}`)).text();
  assert.equal(
    attr(link(html, 'x-default'), 'href'),
    `https://bakeagain.com/en/recipes/${slugs.en}`,
  );
  const recipe = schemas(html).find((schema) => schema['@type'] === 'Recipe');
  assert.equal(recipe.prepTime, 'PT1H');
  const expected = {
    uk: 'борошно для підпилу — за потреби',
    en: 'flour for dusting, as needed',
    es: 'harina para espolvorear, al gusto',
  }[locale];
  assert.ok(recipe.recipeIngredient.includes(expected));
  for (const image of recipe.image) {
    const result = await request(new URL(image).pathname);
    assert.equal(result.status, 200, image);
    assert.match(result.headers.get('content-type'), /image\/webp/);
  }
  const home = await (await request(`/${locale}`)).text();
  const graph = schemas(home).find((schema) => schema['@graph'])?.['@graph'];
  assert.equal(graph?.length, 2);
  assert.ok(!JSON.stringify(graph).includes('SearchAction'));
  for (const path of ['saved', 'shopping-list', 'account']) {
    const response = await request(`/${locale}/${path}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.equal(attr(meta(html, 'robots'), 'content'), 'noindex, follow');
    checkVerification(html);
  }
}
console.log(
  `SEO render checks passed: ${recipePages} recipe pages, ${entries.length} sitemap URLs with lastmod/x-default, home graphs, 9 noindex pages, 5 language redirects, images and verification ${expectedVerification ? 'present' : 'absent'}.`,
);
