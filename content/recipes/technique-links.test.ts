import assert from 'node:assert/strict';
import test from 'node:test';
import { getRecipeContent } from './registry.ts';
import { composeRecipeWithCream } from './cream-composition.ts';
import { createSourceCookSteps } from './cook-mode-adapter.ts';
import { getLocaleSwitchPath } from '../../lib/i18n/routes.ts';

const recipes = [
  'banana-bread',
  'crinkle-cookies',
  'cinnamon-rolls',
  'eggless-vanilla-custard',
  'vanilla-buttercream',
  'lemon-cream-cheese',
];

void test('butter technique references reach all locales and Cook Mode at the relevant step', () => {
  for (const locale of ['uk', 'en', 'es'] as const) {
    for (const id of recipes) {
      const content = getRecipeContent(id, locale)!;
      const step = content.steps.find((step) => step.technique);
      assert.ok(step, `${id}/${locale}`);
      assert.equal(step.technique?.id, 'soften-butter');
      assert.ok(
        createSourceCookSteps(content, locale).some(
          (cook) =>
            cook.stepIds.includes(step.id) &&
            cook.technique?.id === 'soften-butter',
        ),
      );
    }
    assert.equal(
      getRecipeContent('cinnamon-rolls', locale)!.steps.find((s) => s.technique)
        ?.technique?.condition,
      'cinnamon-filling',
    );
    for (const id of [
      'gluten-free-napoleon',
      'apple-meringue-pie',
      'banana-fritters',
      'cottage-cheese-waffles',
      'easter-bread',
    ]) {
      assert.ok(
        !getRecipeContent(id, locale)?.steps.some((s) => s.technique),
        `${id}: cold or melted butter must not get softening advice`,
      );
    }
  }
});

void test('selected cream carries technique help without suggesting it for other cream choices', () => {
  const host = getRecipeContent('fruit-sponge-roll', 'uk')!;
  for (const creamId of ['vanilla-buttercream', 'mascarpone-whipped-cream']) {
    const composed = composeRecipeWithCream(
      host,
      getRecipeContent(creamId, 'uk'),
      creamId,
    );
    assert.equal(
      composed.steps.some((s) => s.technique),
      creamId === 'vanilla-buttercream',
    );
    assert.equal(
      createSourceCookSteps(composed, 'uk').some((s) => s.technique),
      creamId === 'vanilla-buttercream',
    );
  }
  assert.ok(
    getRecipeContent('celebration-sponge-cake', 'uk')!.steps.some(
      (s) => s.technique,
    ),
    'inline lemon frosting carries its technique',
  );
});

void test('technique page language switching retains the guide', () => {
  assert.equal(
    getLocaleSwitchPath('/uk/techniques/soften-butter', 'es'),
    '/es/techniques/soften-butter',
  );
});
