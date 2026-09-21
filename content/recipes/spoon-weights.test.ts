import assert from 'node:assert/strict';
import test from 'node:test';
import { recipeDocuments, getRecipeContent } from './registry.ts';
import {
  quantityFromGrams,
  quantityFromSpoons,
  spoonWeightTable,
} from './spoon-weights.ts';

void test('records the author-measured spoon weights', () => {
  assert.equal(spoonWeightTable['schar-mix-b'].measures.tbsp?.grams, 20);
  assert.equal(spoonWeightTable['tapioca-starch'].measures.tbsp?.grams, 15);
  assert.equal(spoonWeightTable['baking-powder'].measures.tsp?.grams, 5);
  assert.equal(spoonWeightTable['granulated-sugar'].measures.tbsp?.grams, 20);
  assert.equal(spoonWeightTable['cocoa-powder'].measures.tbsp?.grams, 5);
});

void test('turns spoon sources into gram-first ingredient quantities', () => {
  assert.deepEqual(quantityFromSpoons('baking-powder', 3, 'tsp'), {
    base: { kind: 'exact', value: 15, unit: 'g' },
    equivalent: { kind: 'exact', value: 3, unit: 'tsp' },
    shopping: { mode: 'base' },
  });
  assert.deepEqual(quantityFromSpoons('tapioca-starch', 10, 'tbsp'), {
    base: { kind: 'exact', value: 150, unit: 'g' },
    equivalent: { kind: 'exact', value: 10, unit: 'tbsp' },
    shopping: { mode: 'base' },
  });
});

void test('calculates spoon aids from canonical grams', () => {
  assert.deepEqual(quantityFromGrams('schar-mix-b', 140), {
    base: { kind: 'exact', value: 140, unit: 'g' },
    equivalent: { kind: 'exact', value: 7, unit: 'tbsp' },
    shopping: { mode: 'base' },
  });
  assert.deepEqual(quantityFromGrams('granulated-sugar', 67), {
    base: { kind: 'exact', value: 67, unit: 'g' },
    equivalent: { kind: 'exact', value: 3.35, unit: 'tbsp' },
    shopping: { mode: 'base' },
  });
});

function usesSpoonWeightTable(name: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes('sugar or honey')) return false;
  if (normalized.includes('coconut') || normalized.includes('brown sugar'))
    return false;
  if (normalized.includes('baking powder or')) return false;
  return (
    normalized.includes('schär') ||
    normalized === 'sugar' ||
    normalized.startsWith('sugar for ') ||
    normalized === 'powdered sugar' ||
    normalized === 'icing sugar' ||
    normalized === 'salt' ||
    normalized === 'corn starch' ||
    normalized === 'tapioca starch' ||
    normalized === 'baking powder' ||
    normalized === 'baking soda' ||
    normalized === 'xanthan gum'
  );
}

void test('keeps managed dry ingredients gram-first across every recipe', () => {
  for (const document of recipeDocuments) {
    const recipe = getRecipeContent(document.recipe.id, 'en');
    assert(recipe);
    for (const ingredient of recipe.ingredientSections.flatMap(
      (section) => section.ingredients,
    )) {
      if (!usesSpoonWeightTable(ingredient.name) || !ingredient.quantity.base)
        continue;
      assert.equal(
        ingredient.quantity.base.unit,
        'g',
        `${recipe.overview.flour}: ${ingredient.name} must use grams as base`,
      );
      assert(
        ingredient.quantity.equivalent?.unit === 'tsp' ||
          ingredient.quantity.equivalent?.unit === 'tbsp',
        `${ingredient.name} must expose a spoon equivalent`,
      );
    }
  }
});
