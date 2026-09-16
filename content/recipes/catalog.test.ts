import assert from 'node:assert/strict';
import test from 'node:test';
import { getRecipeCatalog } from './catalog.ts';
import {
  getRecipeDetailTitleParts,
  recipeDetailTitles,
} from './catalog-locales.ts';
import { recipeInventory } from './inventory.ts';

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
  const ukrainianNapoleon = getRecipeCatalog('uk').find(
    (recipe) => recipe.id === 'gluten-free-napoleon',
  );
  const spanishNapoleon = getRecipeCatalog('es').find(
    (recipe) => recipe.id === 'gluten-free-napoleon',
  );

  assert.equal(ukrainianNapoleon?.title, 'Безглютеновий Наполеон');
  assert.equal(spanishNapoleon?.title, 'Tarta Napoleón sin gluten');
  assert.equal(ukrainianNapoleon?.id, spanishNapoleon?.id);
});

void test('shows the recorded crepe duration in every catalogue locale', () => {
  const crepes = recipeInventory.find((recipe) => recipe.id === 'crepes');

  assert.equal(crepes?.localizedFacts?.difficulty.uk, 'Середня');
  assert.equal(crepes?.localizedFacts?.activeTime.uk, '40 хв');
  assert.equal(
    getRecipeCatalog('en').find((recipe) => recipe.id === 'crepes')?.detail,
    '1 hr',
  );
  assert.equal(
    getRecipeCatalog('es').find((recipe) => recipe.id === 'crepes')?.detail,
    '1 h',
  );
  assert.equal(
    getRecipeCatalog('uk').find((recipe) => recipe.id === 'crepes')?.detail,
    '1 год',
  );
});

void test('keeps catalogue names concise and makes gluten-free explicit on recipe pages', () => {
  assert.equal(
    getRecipeCatalog('uk').find((recipe) => recipe.id === 'crepes')?.title,
    'Млинці',
  );
  assert.equal(recipeDetailTitles.crepes.uk, 'Безглютенові млинці');
  assert.equal(
    recipeDetailTitles['lazy-dumplings'].uk,
    'Безглютенові ліниві вареники',
  );

  for (const recipe of recipeInventory) {
    const detailTitle = recipeDetailTitles[recipe.id];
    assert(detailTitle, `${recipe.id}: missing localized detail title`);
    assert.match(detailTitle.en, /gluten-free/i);
    assert.match(detailTitle.es, /sin gluten/i);
    assert.match(detailTitle.uk, /безглютен/i);
  }
});

void test('splits localized detail titles into a gluten-free label and dish name', () => {
  assert.deepEqual(
    getRecipeDetailTitleParts(recipeDetailTitles.crepes.uk, 'uk'),
    {
      glutenFreeLabel: 'Безглютенові',
      recipeName: 'млинці',
    },
  );
  assert.deepEqual(
    getRecipeDetailTitleParts(recipeDetailTitles.crepes.en, 'en'),
    {
      glutenFreeLabel: 'Gluten-free',
      recipeName: 'crepes',
    },
  );
  assert.deepEqual(
    getRecipeDetailTitleParts(recipeDetailTitles.crepes.es, 'es'),
    {
      glutenFreeLabel: 'Sin gluten',
      recipeName: 'Crepes',
    },
  );
});
