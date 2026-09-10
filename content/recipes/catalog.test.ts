import assert from 'node:assert/strict';
import test from 'node:test';
import { getRecipeCatalog } from './catalog.ts';

void test('renders catalogue discovery copy in the selected locale for every recipe', () => {
  for (const locale of ['en', 'es', 'uk'] as const) {
    const catalogue = getRecipeCatalog(locale);
    assert.equal(catalogue.length, 17);
    assert(catalogue.every((recipe) => recipe.title.length > 0));
    assert(catalogue.every((recipe) => recipe.eyebrow.length > 0));
    assert(catalogue.every((recipe) => recipe.alt.length > 0));
  }
});

void test('uses localized recipe titles and preserves the stable recipe identity', () => {
  const ukrainianNapoleon = getRecipeCatalog('uk').find((recipe) => recipe.id === 'gluten-free-napoleon');
  const spanishNapoleon = getRecipeCatalog('es').find((recipe) => recipe.id === 'gluten-free-napoleon');

  assert.equal(ukrainianNapoleon?.title, 'Безглютеновий Наполеон');
  assert.equal(spanishNapoleon?.title, 'Tarta Napoleón sin gluten');
  assert.equal(ukrainianNapoleon?.id, spanishNapoleon?.id);
});
