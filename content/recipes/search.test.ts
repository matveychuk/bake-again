import assert from 'node:assert/strict';
import test from 'node:test';
import { cleanRecipeQuery, searchRecipes as search } from './search.ts';
import { getRecipeCatalog } from './catalog.ts';

const searchRecipes = (
  locale: 'en' | 'es' | 'uk',
  query: string,
  collection: Parameters<typeof search>[2] = null,
) => search(locale, query, collection, 'all');
const ids = (query: string) =>
  searchRecipes('uk', query).map((recipe) => recipe.id);

void test('blank queries retain catalogue order; punctuation and unknown queries have no results', () => {
  assert.deepEqual(searchRecipes('uk', '   '), getRecipeCatalog('uk', 'all'));
  for (const query of ['!!!', 'на', 'no-such-recipe-zzzz', 'оладки avocado']) {
    assert.deepEqual(ids(query), [], query);
  }
});

void test('finds curated crepe aliases and keeps fritters a separate dish family', () => {
  for (const query of [
    'млинці',
    'млинки',
    'млинчики',
    'налисники',
    'млинець',
  ]) {
    assert.deepEqual(ids(query), ['crepes'], query);
  }
  assert.deepEqual(
    new Set(ids('оладки')),
    new Set(['apple-fritters', 'banana-fritters', 'apple-banana-fritters']),
  );
});

void test('uses profiteroles as the primary name and keeps eclairs as search aliases', () => {
  assert.equal(
    getRecipeCatalog('uk', 'all').find((recipe) => recipe.id === 'eclairs')
      ?.title,
    'Профітролі',
  );
  for (const query of ['профітролі', 'еклери', 'еклер', 'eclairs', 'éclair']) {
    assert.equal(ids(query)[0], 'eclairs', query);
  }
});

void test('combines meaningful words across titles and canonical ingredients', () => {
  for (const query of ['гофре', 'сирні вафлі', 'творожні гофре']) {
    assert.deepEqual(ids(query), ['cottage-cheese-waffles'], query);
  }
  assert.deepEqual(
    new Set(ids('оладки з яблуками')),
    new Set(['apple-fritters', 'apple-banana-fritters']),
  );
  assert(ids('молоко').includes('crepes'));
  assert(ids('яйце').includes('crepes'));
  assert(ids('творог').includes('lazy-dumplings'));
  assert(!ids('творог').includes('cinnamon-rolls'));
});

void test('matches collection names and intersects searches with explicit collections', () => {
  const breakfast = getRecipeCatalog('uk', 'all').filter((recipe) =>
    recipe.collections.some((collection) => collection.id === 'breakfast'),
  );
  assert.deepEqual(
    new Set(ids('на сніданок')),
    new Set(breakfast.map((recipe) => recipe.id)),
  );
  assert.deepEqual(searchRecipes('uk', 'млинки', 'celebration'), []);
  assert.equal(searchRecipes('uk', 'млинки', 'breakfast')[0]?.id, 'crepes');
});

void test('accepts case, accents, prefixes, word forms and one small typo', () => {
  for (const query of ['  МЛИНКИ  ', 'млин', 'млниці', 'млинц', 'creps']) {
    assert.equal(ids(query)[0], 'crepes', query);
  }
  assert.equal(ids('NAPOLEON')[0], 'gluten-free-napoleon');
  assert(ids('platano').includes('banana-bread'));
  assert.deepEqual(ids('мл'), []);
});

void test('returns localized cards with unchanged evidence and prioritizes exact dish titles', () => {
  assert.equal(
    searchRecipes('es', 'млинки')[0]?.title,
    'Crepes finos para el desayuno',
  );
  assert.equal(
    searchRecipes('en', 'млинки')[0]?.title,
    getRecipeCatalog('en', 'all').find((recipe) => recipe.id === 'crepes')
      ?.title,
  );
  assert.equal(ids('Бананові панкейки')[0], 'banana-fritters');
  for (const result of searchRecipes('uk', 'оладки')) {
    assert.deepEqual(
      result,
      getRecipeCatalog('uk', 'all').find((recipe) => recipe.id === result.id),
    );
  }
});

void test('bounds URL input and rejects repeated query parameters', () => {
  assert.equal(cleanRecipeQuery(['млинці', 'оладки']), '');
  assert.equal(cleanRecipeQuery(undefined), '');
  assert.equal(cleanRecipeQuery('x'.repeat(500)).length, 200);
});
