import assert from 'node:assert/strict';
import test from 'node:test';
import { getRecipeContent, getRecipeDocument } from './registry.ts';
import { recipePart } from './recipe-part.ts';
import { sourCreamContent } from './sour-cream.recipe.ts';
import { chocolateGlazeContent } from './chocolate-glaze.recipe.ts';
import { createSourceCookSteps } from './cook-mode-adapter.ts';
import {
  getComponentPageRecipe,
  reusableComponentRecipeIds,
} from './recipe-component-records.ts';

void test('author eight-egg formula is distinct from a scaled five-egg sponge in all locales', () => {
  const eggNames = { uk: 'Яйця', en: 'Eggs', es: 'Huevos' } as const;
  for (const locale of ['uk', 'en', 'es'] as const) {
    const cake = getRecipeContent('celebration-sponge-cake', locale)!;
    const ingredients = cake.ingredientSections.flatMap(
      (section) => section.ingredients,
    );
    const amount = (id: string) =>
      ingredients.find((item) => item.id === id)!.quantity.base;
    assert.deepEqual(amount('sponge-eggs'), {
      kind: 'exact',
      value: 8,
      unit: 'piece',
    });
    assert.equal(
      ingredients.find((item) => item.id === 'sponge-eggs')?.name,
      eggNames[locale],
    );
    assert.deepEqual(amount('sponge-tapioca'), {
      kind: 'exact',
      value: 15,
      unit: 'g',
    });
    assert.deepEqual(amount('sponge-corn-starch'), {
      kind: 'exact',
      value: 21,
      unit: 'g',
    });
    assert.deepEqual(amount('sponge-flour'), {
      kind: 'exact',
      value: 240,
      unit: 'g',
    });
    assert.deepEqual(amount('filling-sour-cream'), {
      kind: 'exact',
      value: 500,
      unit: 'g',
    });
    assert.equal(cake.geometry?.diameterCm, 24);
    assert.equal(cake.completeness, 'readyToReview');
    assert.equal(cake.evidence?.status, 'tested');
    assert.equal(cake.timing?.activeMinutes, 90);
    assert(cake.steps.some((step) => step.body.includes('200°C')));
    assert(
      cake.timing?.phases.some(
        (phase) =>
          phase.duration.kind === 'range' &&
          phase.duration.min === 60 &&
          phase.duration.max === 70,
      ),
    );
    assert.deepEqual(
      ingredients.find((item) => item.id === 'sponge-sugar-yolks')?.quantity
        .equivalent,
      { kind: 'exact', value: 3, unit: 'tbsp' },
    );
    assert.deepEqual(
      ingredients.find((item) => item.id === 'sponge-sugar-whites')?.quantity
        .equivalent,
      { kind: 'exact', value: 7, unit: 'tbsp' },
    );
    assert.deepEqual(amount('buttercream-butter'), {
      kind: 'exact',
      value: 200,
      unit: 'g',
    });
    assert.deepEqual(amount('buttercream-powdered-sugar'), {
      kind: 'exact',
      value: 100,
      unit: 'g',
    });
    assert(!ingredients.some((item) => item.id.startsWith('frosting-')));
    const ids = new Set(ingredients.map((item) => item.id));
    assert.equal(ids.size, ingredients.length);
    assert.equal(
      new Set(cake.steps.map((step) => step.id)).size,
      cake.steps.length,
    );
    for (const step of cake.steps)
      for (const usage of step.cookIngredients ?? [])
        assert(ids.has(usage.ingredientId));
    assert(
      cake.steps.findIndex((step) => step.id === 'fill') >
        cake.steps.findIndex((step) => step.id === 'filling-mix'),
    );
    assert.equal(cake.beforeStart, undefined);
    assert.equal(cake.gapNote, undefined);
    assert.equal(cake.showImageNote, false);
    assert.equal(
      cake.steps.find((step) => step.id === 'decorate')?.media?.[0]?.caption,
      undefined,
    );
    assert.equal(
      cake.steps.find((step) => step.id === 'buttercream-beat-buttercream')
        ?.technique?.condition,
      'room-temperature-butter',
    );
    const cookSteps = createSourceCookSteps(cake, locale);
    assert.deepEqual(
      cookSteps.find((step) => step.stepIds.includes('sponge-bake'))
        ?.timerOptionsSeconds,
      [3600, 4200],
    );
    assert(
      !cookSteps
        .flatMap((step) => step.media ?? [])
        .some((item) => item.type === 'video'),
    );
  }
  assert.equal(
    getRecipeDocument('celebration-sponge-cake')!.recipe.publicationStatus,
    'published',
  );
  assert.deepEqual(
    getRecipeContent('sponge-cake', 'en')!.ingredientSections[0].ingredients[0]
      .quantity.base,
    { kind: 'exact', value: 5, unit: 'piece' },
  );
});

void test('shared components have standalone records and namespace without sharing mutable ingredient objects or evidence', () => {
  assert.equal(
    new Set(reusableComponentRecipeIds).size,
    reusableComponentRecipeIds.length,
  );
  for (const id of ['sour-cream', 'lemon-cream-cheese', 'chocolate-glaze'])
    assert(getComponentPageRecipe(id));
  const original = sourCreamContent('uk');
  const part = recipePart(original, 'filling');
  assert.equal('evidence' in part, false);
  assert.equal(
    part.steps[0].cookIngredients?.[0].ingredientId,
    'filling-sour-cream',
  );
  assert.notEqual(
    part.ingredientSections[0].ingredients[0],
    original.ingredientSections[0].ingredients[0],
  );
  assert.equal(original.ingredientSections[0].ingredients[0].id, 'sour-cream');
});

void test('prune cake uses the shared glaze without changing its ingredient IDs or amounts', () => {
  for (const locale of ['en', 'uk'] as const) {
    const shared = chocolateGlazeContent(locale);
    const prune = getRecipeContent('prune-cake', locale)!;
    assert.deepEqual(
      prune.ingredientSections
        .find((section) => section.id === 'glaze')!
        .ingredients.map(({ id, name, quantity }) => ({ id, name, quantity })),
      shared.ingredientSections[0].ingredients.map(
        ({ id, name, quantity }) => ({ id, name, quantity }),
      ),
    );
    assert(prune.steps.at(-1)!.body.startsWith(shared.steps[0].body));
  }
});
