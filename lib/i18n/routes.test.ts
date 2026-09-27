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
    '/en/recipes/gluten-free-banana-bread',
  );
});

void test('keeps a reusable cream recipe available in every locale', () => {
  assert.equal(
    getLocalizedRecipePath('vanilla-egg-custard', 'uk'),
    '/uk/recipes/vanilnyi-zavarnyi-krem-z-yaitsiamy',
  );
  assert.equal(
    getLocaleSwitchPath('/uk/recipes/vanilla-egg-custard', 'es'),
    '/es/recipes/crema-pastelera-de-vainilla-con-huevo',
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

void test('preserves a selected cream, scale and section when changing language', () => {
  assert.equal(
    getLocaleSwitchPath(
      '/uk/recipes/eclairs?cream=vanilla-egg-custard&scale=2#cream-options',
      'es',
    ),
    '/es/recipes/profiteroles-sin-gluten?cream=vanilla-egg-custard&scale=2#cream-options',
  );
  assert.equal(
    getLocaleSwitchPath(
      '/en/recipes/gluten-free-napoleon-cake/cook?scale=0.5',
      'uk',
    ),
    '/uk/recipes/bezghliutenovyi-napoleon/cook?scale=0.5',
  );
});

void test('keeps discovery query and collection on the equivalent home page', () => {
  assert.equal(
    getLocaleSwitchPath('/uk?q=млинки&collection=breakfast#recipes', 'en'),
    '/en?q=млинки&collection=breakfast#recipes',
  );
});

void test('every recipe has unique localized canonical slugs and old aliases retain stable identity', async () => {
  const { recipeDocuments } = await import('../../content/recipes/registry.ts');
  const { recipeSlugs } = await import('./recipe-slugs.ts');
  const { getRecipeIdFromLocalizedSlug } = await import('./routes.ts');
  assert.deepEqual(Object.keys(recipeSlugs).sort(), recipeDocuments.map(d => d.recipe.id).sort());
  for (const locale of ['uk', 'en', 'es'] as const) {
    const slugs = Object.values(recipeSlugs).map(v => v[locale]);
    assert.equal(new Set(slugs).size, 27);
    for (const { recipe } of recipeDocuments) {
      const slug = recipeSlugs[recipe.id][locale];
      assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      assert.equal(getRecipeIdFromLocalizedSlug(locale, slug), recipe.id);
      assert.equal(getRecipeIdFromLocalizedSlug(locale, recipe.id), recipe.id);
      for (const target of ['uk', 'en', 'es'] as const)
        assert.equal(getLocaleSwitchPath(`/${locale}/recipes/${slug}/cook?mode=scale&scale=2#step`, target),
          `${getLocalizedRecipePath(recipe.id, target, '/cook')}?mode=scale&scale=2#step`);
    }
  }
});
