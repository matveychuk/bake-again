import assert from 'node:assert/strict';
import test from 'node:test';
import { recipePublicLink } from './recipe-public-link.ts';
import { parseSourceRecipeConfiguration } from './source-recipe-configuration.ts';

void test('shared recipe URLs retain locale and scale without caller queries or fragments', () => {
  const configuration = parseSourceRecipeConfiguration(
    'mode=scale&scale=2&from=private&email=secret@example.com&view=print',
    null,
  );
  for (const locale of ['uk', 'en', 'es'] as const) {
    const result = recipePublicLink('plum-cake', locale, configuration)!;
    const url = new URL(result.url);
    assert.equal(url.origin, 'https://bakeagain.com');
    assert.ok(url.pathname.startsWith(`/${locale}/recipes/`));
    assert.equal(url.search, '?mode=scale&scale=2');
    assert.ok(result.printHref.endsWith('&view=print'));
  }
});
void test('links preserve selected cream and ingredient amounts, including base-equivalent amounts', () => {
  const result = recipePublicLink(
    'gluten-free-napoleon',
    'uk',
    {
      kind: 'base',
      mode: 'ingredient',
      scaleFactor: 1,
      ingredientId: 'flour',
      availableAmount: 450,
      unit: 'g',
    },
    'vanilla-egg-custard',
  )!;
  const params = new URL(result.url).searchParams;
  assert.equal(params.get('cream'), 'vanilla-egg-custard');
  assert.equal(params.get('ingredient'), 'flour');
  assert.equal(params.get('amount'), '450');
});
void test('invalid configuration cannot be shared or printed as the tested base', () => {
  assert.equal(
    recipePublicLink('plum-cake', 'uk', {
      kind: 'invalid',
      mode: 'ingredient',
      ingredientId: 'flour',
      availableAmount: '-1',
      unit: 'g',
      reason: 'positive',
    }),
    null,
  );
  assert.equal(
    recipePublicLink('missing', 'uk', {
      kind: 'base',
      mode: 'scale',
      scaleFactor: 1,
    }),
    null,
  );
});
