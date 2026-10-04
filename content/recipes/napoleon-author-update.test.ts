import assert from 'node:assert/strict';
import test from 'node:test';
import { glutenFreeNapoleonRecipe as recipe } from './gluten-free-napoleon.recipe.ts';
import { getRecipeContent } from './registry.ts';
import { applySourceRecipeConfiguration } from './source-recipe-configuration.ts';
import {
  createSourceCookIngredients,
  createSourceCookSteps,
} from './cook-mode-adapter.ts';
import { formatQuantity } from '../../lib/i18n/format.ts';

for (const locale of ['uk', 'en', 'es'] as const) {
  void test(`author Napoleon keeps two flour portions, photographs and oven settings consistent (${locale})`, () => {
    const source = getRecipeContent(recipe.id, locale)!;
    assert.equal(source.evidence?.status, 'tested');
    assert.equal(recipe.geometry.default.diameterCm, 24);
    assert.equal(
      recipe.steps.find((s) => s.id === 'bake-layer')?.temperature?.value,
      200,
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
    assert.equal(photos.length, 9);
    assert(
      photos.every(
        (p) => p.fit === 'cover' && p.src.endsWith('.webp') && p.alt,
      ),
    );
    for (const factor of [1, 2]) {
      const configured = applySourceRecipeConfiguration(
        source,
        factor === 1
          ? { kind: 'base', mode: 'scale', scaleFactor: 1 }
          : { kind: 'adjusted', scaleFactor: factor },
        locale,
      );
      const steps = createSourceCookSteps(configured, locale);
      const portion = formatQuantity(locale, {
        kind: 'exact',
        value: 250 * factor,
        unit: 'g',
      });
      for (const id of ['cut-in-butter', 'combine-dough']) {
        const step = steps.find((s) => s.stepIds.includes(id))!;
        assert.equal(
          step.ingredients.find((i) => i.id === 'schar-mix-b')?.primary,
          portion,
        );
        assert(
          configured.steps.find((s) => s.id === id)!.body.includes(portion),
        );
      }
      assert.equal(
        createSourceCookIngredients(configured, locale).find(
          (i) => i.id === 'schar-mix-b',
        )?.primary,
        formatQuantity(locale, {
          kind: 'exact',
          value: 500 * factor,
          unit: 'g',
        }),
      );
      assert.deepEqual(
        steps.find((s) => s.stepIds.includes('mix-wet-dough'))
          ?.timerOptionsSeconds,
        [120, 180],
      );
      assert.deepEqual(
        steps.find((s) => s.stepIds.includes('divide-and-chill'))
          ?.timerOptionsSeconds,
        [3600, 7200],
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
