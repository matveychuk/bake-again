import assert from 'node:assert/strict';
import test from 'node:test';
import type { IngredientLine } from './recipe.types.ts';
import { glutenFreeNapoleonRecipe as recipe } from './gluten-free-napoleon.recipe.ts';
import { getRecipeContent } from './registry.ts';
import { applyRecipeContentConfiguration } from './recipe-content-configuration.ts';
import {
  createRecipeCookIngredients,
  createRecipeCookSteps,
} from './cook-mode-adapter.ts';
import { formatQuantity } from '../../lib/i18n/format.ts';

for (const locale of ['uk', 'en', 'es'] as const) {
  void test(`author custard revision stays consistent in ingredients, steps and scaled Cook Mode (${locale})`, () => {
    const source = getRecipeContent(recipe.id, locale)!;
    const lines = source.ingredientSections.flatMap(
      (section) => section.ingredients,
    );
    for (const [id, value] of [
      ['milk-custard', 2000],
      ['eggs-custard', 6],
      ['sugar-custard', 400],
      ['vanilla-sugar-custard', 16],
      ['flour-custard', 40],
      ['starch-custard', 30],
      ['butter-custard', 100],
    ] as const) {
      const amount = lines.find((line) => line.id === id)?.quantity.base;
      assert.equal(amount?.kind, 'exact');
      assert.equal(amount?.kind === 'exact' && amount.value, value);
    }
    assert.equal(lines.find((line) => line.id === 'walnuts')?.optional, true);
    assert(
      !lines.some((line) =>
        ['flaked-almonds', 'tapioca-custard', 'corn-starch-custard'].includes(
          line.id,
        ),
      ),
    );
    const starch = recipe.ingredientSections
      .flatMap<IngredientLine>((section) => section.lines)
      .find((line) => line.id === 'starch-custard')!;
    assert.deepEqual(
      starch.options.map((option) => option.ingredientId),
      ['corn-starch', 'tapioca-starch'],
    );
    assert.equal(starch.choose, 1);
    assert.equal(source.steps.length, 16);
    assert.equal(
      source.steps.slice(7).flatMap((step) => step.media ?? []).length,
      7,
    );
    assert(
      source.steps
        .slice(7)
        .flatMap((step) => step.media ?? [])
        .every(
          (media) =>
            media.fit === 'cover' &&
            media.src.includes('author-custard-2026-10-04'),
        ),
    );
    assert.equal(recipe.heroMediaId, 'napoleon-author-hero-preview-2359-v1');
    for (const factor of [0.5, 1, 2]) {
      const adjusted = applyRecipeContentConfiguration(
        source,
        { kind: 'adjusted', scaleFactor: factor },
        locale,
      );
      const steps = createRecipeCookSteps(adjusted, locale);
      const base = steps.find((step) =>
        step.stepIds.includes('mix-custard-base'),
      )!;
      assert.equal(
        base.ingredients.find((line) => line.id === 'flour-custard')?.primary,
        formatQuantity(locale, {
          kind: 'exact',
          value: 40 * factor,
          unit: 'g',
        }),
      );
      assert.equal(
        base.ingredients.find((line) => line.id === 'starch-custard')?.primary,
        formatQuantity(locale, {
          kind: 'exact',
          value: 30 * factor,
          unit: 'g',
        }),
      );
      assert(!base.ingredients.some((line) => line.id === 'milk-custard'));
      assert(
        !steps.find((step) => step.stepIds.includes('cook-custard'))
          ?.timerOptionsSeconds?.length,
      );
      assert(
        adjusted.steps
          .find((step) => step.id === 'temper-custard')!
          .body.includes(
            formatQuantity(locale, {
              kind: 'exact',
              value: 2 * factor,
              unit: 'cup',
            }),
          ),
      );
    }
  });

  void test(`author Napoleon v5 keeps unleavened dough, photographs and Cook Mode consistent (${locale})`, () => {
    const source = getRecipeContent(recipe.id, locale)!;
    assert.equal(source.evidence?.status, 'tested');
    assert.equal(recipe.geometry.default.diameterCm, 24);
    assert.equal(
      recipe.steps.find((s) => s.id === 'bake-layer')?.temperature?.value,
      200,
    );
    assert.equal(
      recipe.steps.find((s) => s.id === 'bake-layer')?.temperature?.ovenMode,
      'fan',
    );
    assert.equal(recipe.versionId, 'gluten-free-napoleon-v5');
    assert.equal(recipe.geometry.default.layerCount, 7);
    assert.deepEqual(recipe.yield.default.count, { kind: 'exact', value: 2 });
    assert(
      !recipe.ingredientSections[0].lines.some((line) =>
        ['baking-soda', 'citric-acid', 'flour-leavener'].includes(line.id),
      ),
    );
    assert.deepEqual(
      source.steps.slice(0, 7).map((s) => s.id),
      [
        'cut-in-butter',
        'mix-wet-dough',
        'combine-dough',
        'divide-and-chill',
        'roll-layer',
        'trim-layer',
        'bake-layer',
      ],
    );
    const photos = source.steps.slice(0, 7).flatMap((s) => s.media ?? []);
    assert.equal(photos.length, 6);
    assert(
      photos.every(
        (p) => p.fit === 'cover' && p.src.endsWith('.webp') && p.alt,
      ),
    );
    for (const factor of [0.5, 1, 1.5, 2]) {
      const configured = applyRecipeContentConfiguration(
        source,
        factor === 1
          ? { kind: 'base', mode: 'scale', scaleFactor: 1 }
          : { kind: 'adjusted', scaleFactor: factor },
        locale,
      );
      const steps = createRecipeCookSteps(configured, locale);
      const wholeFlour = formatQuantity(locale, {
        kind: 'exact',
        value: 500 * factor,
        unit: 'g',
      });
      const crumb = steps.find((s) => s.stepIds.includes('cut-in-butter'))!;
      assert.equal(
        crumb.ingredients.find((i) => i.id === 'schar-mix-b')?.primary,
        wholeFlour,
      );
      assert(
        configured.steps
          .find((s) => s.id === 'cut-in-butter')!
          .body.includes(wholeFlour),
      );
      assert(
        !steps
          .find((s) => s.stepIds.includes('combine-dough'))
          ?.ingredients.some((i) => i.id === 'schar-mix-b'),
      );
      assert.equal(
        createRecipeCookIngredients(configured, locale).find(
          (i) => i.id === 'schar-mix-b',
        )?.primary,
        wholeFlour,
      );
      assert(
        !steps.find((s) => s.stepIds.includes('mix-wet-dough'))
          ?.timerOptionsSeconds?.length,
      );
      assert.deepEqual(
        steps.find((s) => s.stepIds.includes('divide-and-chill'))
          ?.timerOptionsSeconds,
        [900, 86400],
      );
      assert.match(
        configured.steps.find((s) => s.id === 'bake-layer')!.body,
        /200°C/,
      );
      assert.equal(
        configured.evidence?.status,
        factor === 1 ? 'tested' : 'calculated',
      );
    }
  });
}
