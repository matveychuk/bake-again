import assert from 'node:assert/strict';
import test from 'node:test';
import { getLocaleSwitchPath, getLocalizedRecipePath, localeSavedPath, localeShoppingListPath } from './routes.ts';

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

void test('sends an unknown legacy recipe detail to the localized home page', () => {
  assert.equal(getLocaleSwitchPath('/uk/recipes/banana-bread', 'en'), '/en');
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
  assert.equal(getLocaleSwitchPath('/uk/shopping-list', 'en'), '/en/shopping-list');
});
