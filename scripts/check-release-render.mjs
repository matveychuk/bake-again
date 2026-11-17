import assert from 'node:assert/strict';

// Run against a local production build. Inspect rendered sections, not RSC payloads,
// so a working data helper cannot hide a component rendering the unscaled source.
const origin = process.env.RELEASE_CHECK_URL ?? 'http://localhost:3011';
const paths = {
  uk: [
    'bezghliutenovyi-slyvovyi-pyrih',
    'bezghliutenovyi-napoleon',
    'bezghliutenovyi-tort-z-chornoslyvom',
    'bezghliutenovi-yabluchni-oladky',
  ],
  en: [
    'gluten-free-plum-cake',
    'gluten-free-napoleon-cake',
    'gluten-free-prune-cake',
    'gluten-free-apple-fritters',
  ],
  es: [
    'bizcocho-de-ciruelas-sin-gluten',
    'tarta-napoleon-sin-gluten',
    'tarta-de-ciruelas-pasas-sin-gluten',
    'tortitas-de-manzana-sin-gluten',
  ],
};
function section(html, id) {
  const start = html.indexOf(`id="${id}"`);
  assert(start >= 0, `Missing rendered section: ${id}`);
  let depth = 1;
  for (const tag of html
    .slice(start)
    .matchAll(/<section\b[^>]*>|<\/section>/g)) {
    depth += tag[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return html.slice(start, start + tag.index);
  }
  throw new Error(`Unclosed rendered section: ${id}`);
}
let checks = 0;
for (const [locale, [plum, napoleon, prune, apple]] of Object.entries(paths)) {
  for (const scale of [0.5, 1.5, 2]) {
    const formatted = (number) => new Intl.NumberFormat(locale).format(number);
    for (const { slug, expected } of [
      {
        slug: plum,
        expected: [
          `${formatted(50 * scale)} ${locale === 'uk' ? 'г' : 'g'}`,
          `${formatted(2 * scale)} ${{ uk: 'ст. л.', en: 'tbsp', es: scale === 0.5 ? 'cda.' : 'cdas.' }[locale]}`,
        ],
      },
      {
        slug: napoleon,
        expected: [
          `${6 * scale} ${{ uk: 'шт.', en: 'pcs', es: 'uds.' }[locale]}`,
          String(16 * scale),
          `${formatted(2000 * scale)} ${locale === 'uk' ? 'мл' : 'ml'}`,
        ],
      },
    ]) {
      const path = `/${locale}/recipes/${slug}?mode=scale&scale=${scale}`;
      const response = await fetch(new URL(path, origin));
      assert.equal(response.status, 200, path);
      const html = await response.text();
      const method = section(html, 'recipe-method');
      for (const amount of expected)
        assert(method.includes(amount), `${path}: method is missing ${amount}`);
      assert(
        !html.includes('type="application/ld+json"'),
        `${path}: adapted Recipe JSON-LD`,
      );
      checks++;
    }
  }
  for (const [slug, obsolete] of [
    [prune, `700 ${locale === 'uk' ? 'г' : 'g'}`],
    [
      apple,
      { uk: 'Візьміть 1 ст. л.', en: 'Use 1 tbsp', es: 'Usa 1 cucharada' }[
        locale
      ],
    ],
  ]) {
    const response = await fetch(
      new URL(`/${locale}/recipes/${slug}?mode=scale&scale=2`, origin),
    );
    assert.equal(response.status, 200);
    const html = await response.text();
    const visible = html
      .slice(0, html.indexOf('</main>'))
      .replace(/<[^>]*>/g, '');
    assert(!visible.includes(obsolete), `${slug}: obsolete batch instruction`);
    checks++;
  }
  for (const query of [
    'geometry=round-24cm-preview',
    'geometry=bogus',
    'mode=scale&scale=0',
    'mode=scale&scale=3',
    'mode=scale&scale=NaN',
  ]) {
    for (const suffix of ['', '/cook']) {
      const response = await fetch(
        new URL(`/${locale}/recipes/${napoleon}${suffix}?${query}`, origin),
      );
      assert.equal(response.status, 200);
      const html = await response.text();
      const visible = html.slice(0, html.indexOf('</main>'));
      assert(
        !visible.includes('data-status=') &&
          !html.includes('type="application/ld+json"'),
        query,
      );
      assert(
        visible.includes(
          suffix ? 'cook-mode-unavailable-title' : 'recipe-content',
        ),
        query,
      );
      checks++;
    }
  }
  for (const amount of [200, 250, 500, 1000]) {
    const response = await fetch(
      new URL(
        `/${locale}/recipes/${napoleon}/cook?mode=ingredient&ingredient=schar-mix-b&amount=${amount}&unit=g`,
        origin,
      ),
    );
    assert.equal(response.status, 200);
    const html = await response.text();
    const visible = html.slice(0, html.indexOf('</main>'));
    if (amount === 200 || amount === 250) {
      assert(visible.includes('id="cook-mode-unavailable-title"'));
      assert(
        !visible.includes('data-status='),
        'Blocked SSR must not show Tested',
      );
      assert(
        visible.includes(`amount=${amount}`),
        'Blocked SSR must preserve the requested amount',
      );
    } else {
      assert(
        visible.includes(
          `data-status="${amount === 500 ? 'tested' : 'calculated'}"`,
        ),
      );
      // v6 starts with the wet base: 250 g sour cream and 3 eggs per 500 g flour.
      // The flour is used in the next step; check only the visible first article.
      const firstStep = visible.slice(visible.indexOf('<article'));
      assert(firstStep.includes(`${amount / 2} ${locale === 'uk' ? 'г' : 'g'}`));
      assert(firstStep.includes(`${3 * amount / 500} ${{uk: 'шт.', en: 'pcs', es: 'uds.'}[locale]}`));
    }
    checks++;
  }
}
// The published lesson uses the native checkout and stays absent from cooking/print.
for (const [locale, [, napoleon]] of Object.entries(paths)) {
  for (const [suffix, query, expected] of [
    ['', '', true],
    ['', '?mode=scale&scale=2', true],
    ['', '?view=print', false],
    ['/cook', '', false],
  ]) {
    const response = await fetch(
      new URL(`/${locale}/recipes/${napoleon}${suffix}${query}`, origin),
    );
    assert.equal(response.status, 200);
    const html = await response.text();
    const visible = html.slice(0, html.indexOf('</main>'));
    assert.equal(visible.includes('data-video-lesson="available"'), expected);
    assert(!visible.includes('data-video-lesson="planned"'));
    assert(
      !/href="https:\/\/payhip\.com/.test(visible),
      'Recipe offers must use the native checkout, not a raw provider URL',
    );
    if (expected)
      assert(
        section(visible, 'video-lesson').includes('href="/uk/urok/napoleon/kupyty"'),
        'The available lesson must link to its native checkout',
      );
    checks++;
  }
}
console.log(`Passed ${checks} rendered recipe regression checks (UK/EN/ES).`);
