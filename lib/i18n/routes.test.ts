import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getLocaleSwitchPath,
  getLocalizedRecipePath,
  localeAboutPath,
  localeSavedPath,
  localeShoppingListPath,
} from './routes.ts';

void test('builds a localized slug from the stable recipe ID', () => {
  assert.equal(
    getLocalizedRecipePath('gluten-free-napoleon', 'uk'),
    '/uk/recipes/bezghliutenovyi-napoleon',
  );
});

void test('preserves the same known recipe when a language changes', () => {
  assert.equal(
    getLocaleSwitchPath('/uk/recipes/bezghliutenovyi-napoleon', 'es'),
    '/es/recipes/tarta-napoleon-sin-gluten',
  );
});

void test('preserves a source-backed recipe when the language changes', () => {
  assert.equal(
    getLocaleSwitchPath('/uk/recipes/banana-bread', 'en'),
    '/en/recipes/banana-bread',
  );
});

void test('keeps a reusable cream recipe available in every locale', () => {
  assert.equal(
    getLocalizedRecipePath('vanilla-egg-custard', 'uk'),
    '/uk/recipes/vanilla-egg-custard',
  );
  assert.equal(
    getLocaleSwitchPath('/uk/recipes/vanilla-egg-custard', 'es'),
    '/es/recipes/vanilla-egg-custard',
  );
});

void test('sends the former localized catalogue to the localized home page', () => {
  assert.equal(getLocaleSwitchPath('/uk/recipes', 'en'), '/en');
});

void test('preserves a Cook Mode suffix for a known recipe', () => {
  assert.equal(
    getLocaleSwitchPath('/en/recipes/gluten-free-napoleon-cake/cook', 'uk'),
    '/uk/recipes/bezghliutenovyi-napoleon/cook',
  );
});

void test('builds locale-aware personal-state paths and preserves them when switching language', () => {
  assert.equal(localeSavedPath('uk'), '/uk/saved');
  assert.equal(localeShoppingListPath('es'), '/es/shopping-list');
  assert.equal(
    getLocaleSwitchPath('/uk/shopping-list', 'en'),
    '/en/shopping-list',
  );
});

void test('builds and preserves the localized About path', () => {
  assert.equal(localeAboutPath('uk'), '/uk/about');
  assert.equal(getLocaleSwitchPath('/uk/about', 'es'), '/es/about');
});
