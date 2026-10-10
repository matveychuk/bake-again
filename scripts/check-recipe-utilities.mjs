import assert from 'node:assert/strict';

const origin = process.env.RELEASE_CHECK_URL ?? 'http://localhost:3012';
const recipes = {
  uk: [
    'bezghliutenovyi-slyvovyi-pyrih',
    'bezghliutenovyi-napoleon',
    'bezghliutenovi-profitroli',
  ],
  en: [
    'gluten-free-plum-cake',
    'gluten-free-napoleon-cake',
    'gluten-free-profiteroles',
  ],
  es: [
    'bizcocho-de-ciruelas-sin-gluten',
    'tarta-napoleon-sin-gluten',
    'profiteroles-sin-gluten',
  ],
};
let checks = 0;
async function rendered(path) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, path);
  const html = await response.text();
  const start = html.indexOf('<main');
  assert(start !== -1, `No main at ${path}`);
  return html.slice(start, html.indexOf('</main>', start));
}
for (const [locale, [plum, napoleon, profiteroles]] of Object.entries(
  recipes,
)) {
  const gram = locale === 'uk' ? 'г' : 'g';
  for (const scale of [0.5, 1, 2]) {
    const view = await rendered(
      `/${locale}/recipes/${plum}?view=print&mode=scale&scale=${scale}&from=private&email=do-not-share`,
    );
    assert(view.includes('data-recipe-print'), 'Print view must render');
    assert(
      view.includes(`data-status="${scale === 1 ? 'tested' : 'calculated'}"`),
    );
    const text = view.replace(/<[^>]*>/g, '');
    assert(
      text.includes(`${120 * scale} ${gram}`),
      'Ingredient flour must match the batch',
    );
    assert(
      text.includes(`${50 * scale} ${gram}`),
      'Method butter must match the batch',
    );
    assert(!view.includes('do-not-share') && !view.includes('from=private'));
    assert(
      !view.includes('recipe-save') && !view.includes('assistant-trigger'),
    );
    checks++;
  }
  const ingredient = await rendered(
    `/${locale}/recipes/${napoleon}?view=print&mode=ingredient&ingredient=schar-mix-b&amount=1000&unit=g`,
  );
  assert(
    ingredient.includes('data-recipe-print') &&
      ingredient.includes('data-status="calculated"'),
  );
  assert(
    ingredient
      .replace(/<[^>]*>/g, '')
      .includes(`${new Intl.NumberFormat(locale).format(1000)} ${gram}`),
  );
  checks++;
  for (const query of [
    'mode=scale&scale=3',
    'mode=ingredient&ingredient=schar-mix-b&amount=-1&unit=g',
  ]) {
    const invalid = await rendered(
      `/${locale}/recipes/${napoleon}?view=print&${query}`,
    );
    assert(
      !invalid.includes('data-recipe-print'),
      'Invalid quantities must never print a tested base recipe',
    );
    checks++;
  }
  const composed = await rendered(
    `/${locale}/recipes/${profiteroles}?view=print&cream=vanilla-egg-custard&mode=scale&scale=2`,
  );
  assert(composed.includes('data-recipe-print'));
  assert(
    composed.includes('data-status="suggested"'),
    'Cream combination must retain its own provenance',
  );
  assert(composed.includes('cream=vanilla-egg-custard'));
  assert(
    composed.includes('cream-vanilla-egg-custard'),
    'Printed source version retains the cream',
  );
  checks++;
  const page = await rendered(`/${locale}/recipes/${plum}`);
  assert(page.includes('view=print'));
  assert(!page.includes('forms.example.com'));
  assert(!page.includes('NEWSLETTER_'));
  checks++;
}
console.log(`Passed ${checks} rendered recipe utility checks (UK/EN/ES).`);
