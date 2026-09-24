import assert from 'node:assert/strict';
import test from 'node:test';
import { getRecipeCatalog } from './catalog.ts';
import { searchRecipes } from './search.ts';
import { getRecipeDocument } from './registry.ts';
import { canReadRecipe } from './publication.ts';
import { isLocalDevelopment } from '../../lib/runtime/local-development.ts';

void test('draft preview requires both development and an exact loopback host', () => {
  for (const host of ['localhost:3000', '127.0.0.1:3000', '[::1]:3000']) {
    assert.equal(isLocalDevelopment(host, 'development'), true);
    assert.equal(isLocalDevelopment(host, 'production'), false);
    assert.equal(isLocalDevelopment(host, undefined), false);
  }
  for (const host of [
    null,
    'example.com',
    'localhost.example.com',
    '192.168.1.2:3000',
    'localhost@evil.com',
    'localhost:3000,example.com',
  ]) {
    assert.equal(isLocalDevelopment(host, 'development'), false);
  }
});

void test('reviewed recipes are published, searchable and absent from drafts', () => {
  for (const locale of ['uk', 'en', 'es'] as const) {
    for (const id of [
      'cottage-cheese-waffles',
      'crepes',
      'lazy-dumplings',
      'carrot-cake',
      'crinkle-cookies',
      'banana-bread',
      'sponge-cake',
      'easter-bread',
      'prune-cake',
      'gluten-free-napoleon',
      'fruit-sponge-roll',
      'eclairs',
      'apple-charlotte',
      'plum-cake',
      'banana-fritters',
    ]) {
      assert(getRecipeCatalog(locale).some((recipe) => recipe.id === id));
      assert(
        !getRecipeCatalog(locale, 'unpublished').some(
          (recipe) => recipe.id === id,
        ),
      );
      assert(searchRecipes(locale, '').some((recipe) => recipe.id === id));
      assert.equal(canReadRecipe(id, false), true);
    }
  }
  assert.equal(searchRecipes('uk', 'млинці')[0]?.id, 'crepes');
  assert.equal(searchRecipes('uk', 'гофре')[0]?.id, 'cottage-cheese-waffles');
  assert.equal(searchRecipes('uk', 'ліниві вареники')[0]?.id, 'lazy-dumplings');
  assert.equal(searchRecipes('uk', 'морквяний кекс')[0]?.id, 'carrot-cake');
  assert.equal(searchRecipes('uk', 'тріщинки')[0]?.id, 'crinkle-cookies');
});

void test('published reusable creams stay linked-only instead of becoming catalogue cards', () => {
  for (const id of [
    'mascarpone-whipped-cream',
    'vanilla-egg-custard',
    'eggless-vanilla-custard',
    'vanilla-buttercream',
  ]) {
    assert.equal(canReadRecipe(id, false), true);
    assert(!getRecipeCatalog('uk').some((recipe) => recipe.id === id));
    assert(
      !getRecipeCatalog('uk', 'unpublished').some((recipe) => recipe.id === id),
    );
  }
});

void test('publication moves the same record between public catalogue and drafts without changing evidence', () => {
  const document = getRecipeDocument('banana-bread')!;
  const original = document.recipe.publicationStatus;
  const before = JSON.stringify(document.recipe);
  try {
    document.recipe.publicationStatus = 'unpublished';
    assert(
      !getRecipeCatalog('uk').some((recipe) => recipe.id === 'banana-bread'),
    );
    assert(
      !searchRecipes('uk', 'банановий хліб').some(
        (recipe) => recipe.id === 'banana-bread',
      ),
    );
    assert(
      getRecipeCatalog('uk', 'unpublished').some(
        (recipe) => recipe.id === 'banana-bread',
      ),
    );
    assert.equal(canReadRecipe('banana-bread', false), false);
    assert.equal(canReadRecipe('banana-bread', true), true);
    document.recipe.publicationStatus = 'published';
    assert(
      getRecipeCatalog('uk').some((recipe) => recipe.id === 'banana-bread'),
    );
    assert(
      searchRecipes('uk', 'банановий хліб').some(
        (recipe) => recipe.id === 'banana-bread',
      ),
    );
    assert(
      !getRecipeCatalog('uk', 'unpublished').some(
        (recipe) => recipe.id === 'banana-bread',
      ),
    );
    assert.equal(canReadRecipe('banana-bread', false), true);
  } finally {
    document.recipe.publicationStatus = original;
  }
  assert.equal(JSON.stringify(document.recipe), before);
  assert.equal(canReadRecipe('nonexistent', true), false);
});
