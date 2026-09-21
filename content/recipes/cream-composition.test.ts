import assert from 'node:assert/strict';
import test from 'node:test';
import {
  composeRecipeWithCream,
  resolveSelectedCreamRecipeId,
} from './cream-composition.ts';
import { getRecipeContent } from './registry.ts';

void test('a host recipe starts without an implied cream selection', () => {
  const eclairs = getRecipeContent('eclairs', 'uk');
  assert.ok(eclairs);

  assert.equal(resolveSelectedCreamRecipeId(eclairs, undefined), null);
  const unselected = composeRecipeWithCream(eclairs, null, null);
  assert.equal(unselected.ingredientSections.length, 1);
  assert.equal(
    unselected.steps.some((step) => step.id === 'fill'),
    false,
  );
});

void test('a selected cream contributes namespaced ingredients and steps before filling', () => {
  const eclairs = getRecipeContent('eclairs', 'uk');
  const custard = getRecipeContent('vanilla-egg-custard', 'uk');
  assert.ok(eclairs);
  assert.ok(custard);

  const selectedId = resolveSelectedCreamRecipeId(
    eclairs,
    'vanilla-egg-custard',
  );
  assert.equal(selectedId, 'vanilla-egg-custard');
  const composed = composeRecipeWithCream(eclairs, custard, selectedId);

  assert.equal(composed.ingredientSections.length, 2);
  assert(
    composed.ingredientSections[1].ingredients.every((ingredient) =>
      ingredient.id.startsWith('cream-vanilla-egg-custard-'),
    ),
  );
  assert.equal(composed.steps.at(-1)?.id, 'fill');
  assert(composed.steps.at(-2)?.id.startsWith('cream-vanilla-egg-custard-'));
  assert(
    composed.steps
      .flatMap((step) => step.cookIngredients ?? [])
      .filter((ingredient) => ingredient.ingredientId.includes('custard'))
      .every((ingredient) =>
        ingredient.ingredientId.startsWith('cream-vanilla-egg-custard-'),
      ),
  );
});

void test('an unsupported cream id is not accepted by the host recipe', () => {
  const eclairs = getRecipeContent('eclairs', 'en');
  assert.ok(eclairs);
  assert.equal(resolveSelectedCreamRecipeId(eclairs, 'unknown-cream'), null);
});

void test('fruit sponge roll recommends mascarpone cream and keeps buttercream as an alternative', () => {
  const roll = getRecipeContent('fruit-sponge-roll', 'uk');
  const mascarpone = getRecipeContent('mascarpone-whipped-cream', 'uk');
  assert.ok(roll);
  assert.ok(mascarpone);

  assert.deepEqual(roll.creamOptions, {
    recipeIds: ['mascarpone-whipped-cream', 'vanilla-buttercream'],
    recommendedRecipeId: 'mascarpone-whipped-cream',
  });
  const selectedId = resolveSelectedCreamRecipeId(
    roll,
    'mascarpone-whipped-cream',
  );
  const composed = composeRecipeWithCream(roll, mascarpone, selectedId);
  assert.equal(composed.steps.at(-1)?.id, 'fill');
  assert(
    composed.steps.at(-2)?.id.startsWith('cream-mascarpone-whipped-cream-'),
  );
  assert.equal(
    composed.ingredientSections.some((section) => section.id === 'cream'),
    false,
  );
});
