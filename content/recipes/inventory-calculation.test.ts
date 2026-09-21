import assert from 'node:assert/strict';
import test from 'node:test';
import {
  findScalingAnchor,
  scaleStructuredQuantity,
} from './inventory-calculation.ts';
import { getRecipeContent } from './registry.ts';
import { recipeInventory } from './inventory.ts';

void test('scales carrot cake from its recorded 200 g carrot base in every locale', () => {
  const anchorId = recipeInventory.find(
    (recipe) => recipe.id === 'carrot-cake',
  )?.scalingAnchorIngredientId;
  assert.equal(anchorId, 'carrots');
  for (const locale of ['uk', 'en', 'es'] as const) {
    const recipe = getRecipeContent('carrot-cake', locale)!;
    const ingredients = recipe.ingredientSections.flatMap(
      (section) => section.ingredients,
    );
    const anchor: NonNullable<ReturnType<typeof findScalingAnchor>> =
      findScalingAnchor(ingredients, anchorId)!;
    assert.deepEqual(anchor.amount, { minimum: 200, maximum: null, unit: 'g' });
    for (const available of [100, 300, 400]) {
      const factor = available / anchor.amount.minimum;
      for (const ingredient of ingredients) {
        const base = ingredient.quantity.base;
        const scaled = scaleStructuredQuantity(base, factor);
        if (base?.kind === 'exact') {
          assert.deepEqual(scaled, { ...base, value: base.value * factor });
        } else assert.equal(scaled, null);
      }
      assert.deepEqual(
        scaleStructuredQuantity(
          ingredients.find((item) => item.id === 'flour')!.quantity.equivalent!,
          factor,
        ),
        {
          kind: 'exact',
          value: 8.5 * factor,
          unit: 'tbsp',
        },
      );
    }
  }
});

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

void test('scales both reviewed fruit cakes from their five-egg base', () => {
  for (const recipeId of ['apple-charlotte', 'plum-cake']) {
    const anchorId = recipeInventory.find(
      (recipe) => recipe.id === recipeId,
    )?.scalingAnchorIngredientId;
    const recipe = getRecipeContent(recipeId, 'uk')!;
    const ingredients = recipe.ingredientSections.flatMap(
      (section) => section.ingredients,
    );
    const anchor = findScalingAnchor(ingredients, anchorId)!;

    assert.equal(anchor.ingredient.id, 'eggs');
    assert.deepEqual(anchor.amount, {
      minimum: 5,
      maximum: null,
      unit: 'piece',
    });
    assert.deepEqual(
      scaleStructuredQuantity(anchor.ingredient.quantity.base, 2),
      {
        kind: 'exact',
        value: 10,
        unit: 'piece',
      },
    );
    assert.deepEqual(
      scaleStructuredQuantity(
        ingredients.find((ingredient) => ingredient.id === 'flour')!.quantity
          .base,
        2,
      ),
      { kind: 'exact', value: 240, unit: 'g' },
    );
  }
});

void test('scales the reviewed dumpling base and spoon equivalents from cottage cheese', () => {
  for (const locale of ['uk', 'en', 'es'] as const) {
    const recipe = getRecipeContent('lazy-dumplings', locale)!;
    const ingredients = recipe.ingredientSections.flatMap(
      (section) => section.ingredients,
    );
    const anchor = findScalingAnchor(ingredients, 'cottage-cheese')!;
    assert.equal(anchor.amount.minimum, 450);
    for (const factor of [0.5, 2, 300 / 450]) {
      for (const [id, base] of [
        ['cottage-cheese', 450],
        ['eggs', 2],
        ['sugar', 60],
        ['flour', 100],
        ['tapioca', 7],
      ] as const) {
        const ingredient = ingredients.find((item) => item.id === id)!;
        assert.deepEqual(
          scaleStructuredQuantity(ingredient.quantity.base, factor),
          {
            kind: 'exact',
            value: base * factor,
            unit: id === 'eggs' ? 'piece' : 'g',
          },
        );
      }
      assert.deepEqual(
        scaleStructuredQuantity(
          ingredients.find((item) => item.id === 'tapioca')!.quantity
            .equivalent!,
          factor,
        ),
        {
          kind: 'exact',
          value: factor,
          unit: 'tbsp',
        },
      );
    }
  }
});
