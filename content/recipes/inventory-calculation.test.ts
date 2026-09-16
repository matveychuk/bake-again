import assert from 'node:assert/strict';
import test from 'node:test';
import { findScalingAnchor } from './inventory-calculation.ts';
import { getRecipeContent } from './registry.ts';

void test('uses the recipe-specific egg anchor for crepes', () => {
  const recipe = getRecipeContent('crepes', 'uk');
  const ingredients =
    recipe?.ingredientSections.flatMap((section) => section.ingredients) ?? [];
  const anchor = findScalingAnchor(ingredients, 'eggs');

  assert.equal(anchor?.ingredient.name, 'Яйця');
  assert.deepEqual(anchor?.amount, {
    minimum: 5,
    maximum: null,
    unit: 'piece',
  });
});
