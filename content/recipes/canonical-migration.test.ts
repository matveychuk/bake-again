import { buildShoppingRecipe } from './shopping-projection.ts';
import { getInventoryRecipe } from './inventory.ts';
import { getComponentPageRecipe } from './recipe-component-records.ts';
import { getLegacySlugForRecipeId } from '../../lib/i18n/routes.ts';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { recipes, getRecipeContent, projectRecipeContent } from './registry.ts';
import { validateRecipe } from './validate.ts';
import { calculateRecipeConfiguration } from './calculate-configuration.ts';
import { applyRecipeContentConfiguration } from './recipe-content-configuration.ts';
import {
  recipeLocales,
  type Recipe,
  type RecipeLocale,
} from './recipe.types.ts';
import { composeRecipe } from './compose-recipe.ts';
import type { StructuredRecipeContent } from './localized-recipe.types.ts';

type Baseline = {
  routeSlug: string;
  document: {
    recipe: {
      id: string;
      versionId?: string;
      publicationStatus: string;
      translationState: Recipe['translationState'];
    };
  };
  content: Record<RecipeLocale, StructuredRecipeContent>;
};
const baseline = JSON.parse(
  readFileSync(
    new URL('./__fixtures__/pre-unification-2026-10-31.json', import.meta.url),
    'utf8',
  ),
) as Baseline[];

void test('all canonical records preserve the independent pre-migration identities and localized cooking content', () => {
  assert.deepEqual(
    recipes.map((r) => r.id),
    baseline.map((b) => b.document.recipe.id),
  );
  for (const recipe of recipes) {
    const original = baseline.find((b) => b.document.recipe.id === recipe.id)!;
    assert.equal(recipe.routeSlug, original.routeSlug);
    const routeSlug = getLegacySlugForRecipeId(recipe.id) ?? recipe.id;
    assert.equal(
      (getInventoryRecipe(routeSlug) ?? getComponentPageRecipe(routeSlug))?.id,
      recipe.id,
    );
    assert.equal(
      recipe.versionId,
      original.document.recipe.versionId ?? `${recipe.id}-source-v1`,
    );
    assert.equal(
      recipe.publicationStatus,
      original.document.recipe.publicationStatus,
    );
    assert.deepEqual(
      recipe.translationState,
      original.document.recipe.translationState,
    );
    validateRecipe(recipe, new Set(recipes.map((r) => r.id)));
    for (const locale of recipeLocales) {
      const old = original.content[locale],
        current = getRecipeContent(recipe.id, locale)!;
      const context = `${recipe.id}/${locale}`;
      assert.equal(current.presentation, old.presentation, context);
      assert.equal(current.completeness, old.completeness, context);
      assert.equal(current.evidence?.status, old.evidence?.status, context);
      if (old.evidence?.explanation)
        assert.equal(
          current.evidence?.explanation,
          old.evidence.explanation,
          context,
        );
      const correctedCreamYield: Record<
        string,
        { value: number; unit: 'g' | 'kg' }
      > = {
        'mascarpone-whipped-cream': { value: 580, unit: 'g' },
        'vanilla-egg-custard': { value: 900, unit: 'g' },
        'eggless-vanilla-custard': { value: 1.8, unit: 'kg' },
        'vanilla-buttercream': { value: 450, unit: 'g' },
      };
      const correction = correctedCreamYield[recipe.id];
      // These recorded labels already stated the approximate weight, while their old
      // numeric source incorrectly said one batch. Preserve copy and structure its stated weight.
      assert.deepEqual(
        current.yield,
        correction
          ? {
              ...old.yield,
              count: { kind: 'exact', value: correction.value },
              unit: correction.unit,
              approximate: true,
            }
          : old.yield,
        context,
      );
      assert.deepEqual(current.beforeStart, old.beforeStart, context);
      assert.deepEqual(current.creamOptions, old.creamOptions, context);
      assert.equal(current.gapNote, old.gapNote, context);
      const ingredients = (content: StructuredRecipeContent) =>
        content.ingredientSections.map((section) => ({
          id: section.id,
          title: section.title,
          ingredients: section.ingredients.map((i) => ({
            id: i.id,
            name: i.name,
            quantity: i.quantity,
            optional: i.optional,
            note: i.note,
            scaling: i.scaling,
          })),
        }));
      assert.deepEqual(ingredients(current), ingredients(old), context);
      const steps = (content: StructuredRecipeContent) =>
        content.steps.map((s) => ({
          id: s.id,
          title: s.title,
          body: s.body,
          meta: s.meta,
          checkpoint: s.checkpoint,
          tip: s.tip,
          cookGroup: s.cookGroup,
          requiresCream: s.requiresCream,
          cookTitle: s.cookTitle,
          cookInstructions: s.cookInstructions,
          cookIngredients: s.cookIngredients ?? [],
          quantityMentions: s.quantityMentions,
          media: s.media?.map((m) => ({
            id: m.id,
            src: m.src,
            type: m.type ?? 'image',
            alt: m.alt,
            caption: m.caption,
            title: m.title,
            fit: m.fit,
          })),
        }));
      assert.deepEqual(
        JSON.parse(JSON.stringify(steps(current))),
        JSON.parse(JSON.stringify(steps(old))),
        context,
      );
      const timing = (content: StructuredRecipeContent) => ({
        active: content.overview.timing.activeMinutes,
        total: content.overview.timing.totalElapsedMinutes,
        note: content.overview.timing.planningNote,
      });
      assert.deepEqual(timing(current), timing(old), context);
      for (const phase of old.timing?.phases ?? []) {
        const actual = current.timing?.phases.find(
          (item) => item.id === phase.id,
        );
        assert.ok(actual, context);
        assert.deepEqual(actual.duration, phase.duration, context);
        assert.equal(actual.label, phase.label, context);
        if (phase.relatedStepId)
          assert.equal(actual.relatedStepId, phase.relatedStepId, context);
      }
      if (old.geometry) {
        const {
          id,
          label,
          kind,
          application,
          shape,
          diameterCm,
          widthCm,
          lengthCm,
        } = current.geometry!;
        assert.deepEqual(
          {
            id,
            label,
            kind,
            application,
            shape,
            diameterCm,
            widthCm,
            lengthCm,
          },
          { widthCm: undefined, lengthCm: undefined, ...old.geometry },
          context,
        );
      }
    }
  }
});

void test('canonical and localized arithmetic agree for every supported batch and ingredient anchor', () => {
  for (const recipe of recipes) {
    const base = projectRecipeContent(recipe, 'uk');
    for (const factor of recipe.configuration.quantityAdjustment.batchScale
      ?.allowed ?? []) {
      const calculation = calculateRecipeConfiguration(
        recipe,
        recipe.configuration.base.geometryId,
        { mode: 'batchScale', factor },
      );
      const view = applyRecipeContentConfiguration(
        base,
        factor === 1
          ? { kind: 'base', mode: 'scale', scaleFactor: 1 }
          : { kind: 'adjusted', mode: 'scale', scaleFactor: factor },
        'uk',
      );
      const shopping = buildShoppingRecipe(
        {
          id: recipe.id,
          versionId: recipe.versionId,
          title: recipe.title.uk,
          ingredientSections: base.ingredientSections,
        },
        factor,
        factor === 1 ? 'base' : `scale:${factor}`,
      );
      for (const result of calculation.ingredientAmounts) {
        const line = view.ingredientSections
          .flatMap((s) => s.ingredients)
          .find((i) => i.id === result.ingredientLineId)!;
        const purchase = shopping.ingredientSections
          .flatMap((section) => section.lines)
          .find((item) => item.id === result.ingredientLineId)!;
        assert.deepEqual(purchase.quantity.base, result.amount);
        const canonical = recipe.ingredientSections
          .flatMap((section) => section.lines)
          .find((item) => item.id === result.ingredientLineId)!;
        assert.deepEqual(
          purchase.options.map((option) => option.ingredientId),
          canonical.options.map((option) => option.ingredientId),
        );
        assert.deepEqual(
          line.quantity.base,
          result.amount,
          `${recipe.id}/${factor}/${line.id}`,
        );
      }
      assert.equal(
        calculation.cookMode.eligible,
        !view.configurationWarnings?.some((w) => w.severity === 'blocking'),
      );
      if (recipe.baseProvenance.state === 'suggested')
        assert.equal(view.evidence?.status, 'suggested');
    }
    for (const anchor of recipe.configuration.quantityAdjustment.useWhatIHave
      ?.scalingAnchors ?? []) {
      const line = recipe.ingredientSections
        .flatMap((s) => s.lines)
        .find((i) => i.id === anchor.ingredientLineId)!;
      assert.equal(line.quantity.base?.kind, 'exact');
      if (line.quantity.base?.kind !== 'exact') continue;
      const value = Math.max(anchor.minimum ?? 0, line.quantity.base.value);
      const calc = calculateRecipeConfiguration(
        recipe,
        recipe.configuration.base.geometryId,
        {
          mode: 'useWhatIHave',
          anchorIngredientLineId: line.id,
          availableAmount: { value, unit: anchor.allowedUnit },
        },
      );
      assert.equal(calc.totalScaleFactor, value / line.quantity.base.value);
    }
    assert.throws(() =>
      calculateRecipeConfiguration(recipe, 'nonexistent-geometry', {
        mode: 'batchScale',
        factor: 1,
      }),
    );
  }
});

void test('a canonical cream composition preserves IDs, amounts, media and independent evidence', () => {
  const host = recipes.find((r) => r.id === 'fruit-sponge-roll')!;
  for (const id of host.creamOptions!.recipeIds) {
    const cream = recipes.find((r) => r.id === id)!;
    const composed = composeRecipe(host, cream);
    validateRecipe(composed);
    assert.equal(composed.baseProvenance.state, 'suggested');
    assert.equal(composed.versionId, `${host.versionId}-cream-${id}`);
    for (const section of cream.ingredientSections)
      for (const line of section.lines)
        assert.deepEqual(
          composed.ingredientSections
            .flatMap((s) => s.lines)
            .find((i) => i.id === `cream-${id}-${line.id}`)?.quantity,
          line.quantity,
        );
  }
});

void test('approximate cream weights scale the recorded mass rather than replacing it with a batch count', () => {
  for (const [id, doubled] of [
    ['mascarpone-whipped-cream', 1160],
    ['vanilla-egg-custard', 1800],
    ['eggless-vanilla-custard', 3.6],
    ['vanilla-buttercream', 900],
  ] as const) {
    for (const locale of recipeLocales) {
      const result = applyRecipeContentConfiguration(
        getRecipeContent(id, locale)!,
        { kind: 'adjusted', mode: 'scale', scaleFactor: 2 },
        locale,
      );
      assert.deepEqual(result.yield?.count, { kind: 'exact', value: doubled });
      assert.ok(result.yield?.approximate);
      assert.ok(
        result.yield?.label.includes(
          new Intl.NumberFormat(locale).format(doubled),
        ),
      );
    }
  }
});

void test('range and unknown yields remain explicit and manual rules agree across projections', () => {
  const recipe: Recipe = structuredClone(
    recipes.find((recipe) => recipe.id === 'crepes')!,
  );
  recipe.yield.default.count = { kind: 'range', min: 10, max: 12 };
  recipe.yield.default.label = {
    en: '10–12 crepes',
    es: '10–12 crepes',
    uk: '10–12 млинців',
  };
  const view = projectRecipeContent(recipe, 'uk');
  assert.deepEqual(
    applyRecipeContentConfiguration(
      view,
      { kind: 'adjusted', mode: 'scale', scaleFactor: 0.5 },
      'uk',
    ).yield?.count,
    { kind: 'range', min: 5, max: 6 },
  );
  recipe.yield.default.count = { kind: 'unknown' };
  recipe.yield.default.unit = null;
  recipe.yield.default.label = { en: '', es: '', uk: '' };
  recipe.geometry = { state: 'notApplicable', default: null, alternatives: [] };
  const flour = recipe.ingredientSections
    .flatMap((section) => section.lines)
    .find((line) => line.id === 'flour')!;
  flour.scaling = {
    kind: 'manual',
    reason: {
      en: 'Manual adjustment',
      es: 'Ajuste manual',
      uk: 'Ручне коригування',
    },
  };
  validateRecipe(recipe);
  const base = projectRecipeContent(recipe, 'uk');
  assert.equal(base.yield, undefined);
  assert.equal(base.geometry, undefined);
  assert.equal(base.overview.yieldLabel, null);
  const calculation = calculateRecipeConfiguration(
    recipe,
    recipe.configuration.base.geometryId,
    { mode: 'batchScale', factor: 2 },
  );
  const adjusted = applyRecipeContentConfiguration(
    base,
    { kind: 'adjusted', mode: 'scale', scaleFactor: 2 },
    'uk',
  );
  assert.equal(calculation.cookMode.eligible, false);
  assert.ok(
    adjusted.configurationWarnings?.some(
      (warning) => warning.code === 'manual-scaling-required',
    ),
  );
  assert.equal(
    adjusted.ingredientSections
      .flatMap((section) => section.ingredients)
      .find((line) => line.id === 'flour')?.quantity.base,
    null,
  );
  assert.ok(
    !calculateRecipeConfiguration(
      recipe,
      recipe.configuration.base.geometryId,
      { mode: 'batchScale', factor: 1 },
    ).warnings.length,
  );
});
