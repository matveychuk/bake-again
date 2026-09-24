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
    true,
  );
  assert.deepEqual(unselected.steps, eclairs.steps);
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
    composed.steps.at(-4)?.id.startsWith('cream-mascarpone-whipped-cream-'),
  );
  assert.equal(
    composed.ingredientSections.some((section) => section.id === 'cream'),
    false,
  );
});

void test('the complete roll method is visible before selection and follows either selected cream', () => {
  for (const locale of ['uk', 'en', 'es'] as const) {
    const roll = getRecipeContent('fruit-sponge-roll', locale)!;
    const baseIds = ['whip-eggs', 'fold-batter', 'bake-roll', 'roll-and-cool'];
    assert.deepEqual(
      composeRecipeWithCream(roll, null, null).steps.map((step) => step.id),
      [...baseIds, 'spread-jam', 'spread-cream', 'fill'],
    );
    const unselected = composeRecipeWithCream(roll, null, null);
    assert.deepEqual(unselected.ingredientSections, roll.ingredientSections);
    assert(unselected.steps.at(-1)?.tip);
    for (const id of ['roll-and-cool', 'spread-jam', 'spread-cream', 'fill']) {
      assert(unselected.steps.find((step) => step.id === id)?.media?.length);
    }
    for (const creamId of roll.creamOptions!.recipeIds) {
      const cream = getRecipeContent(creamId, locale)!;
      const composed = composeRecipeWithCream(roll, cream, creamId);
      assert.deepEqual(
        composed.steps.map((step) => step.id),
        [
          ...baseIds,
          ...cream.steps.map((step) => `cream-${creamId}-${step.id}`),
          'spread-jam',
          'spread-cream',
          'fill',
        ],
      );
      const ingredientIds = new Set(
        composed.ingredientSections.flatMap((section) =>
          section.ingredients.map((ingredient) => ingredient.id),
        ),
      );
      for (const step of composed.steps) {
        for (const ingredient of step.cookIngredients ?? [])
          assert(ingredientIds.has(ingredient.ingredientId));
      }
    }
  }
});
