import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getRecipeDocument,
  recipeDocuments,
} from '../../../content/recipes/registry.ts';
import { calculateRecipeConfiguration } from '../../../content/recipes/calculate-configuration.ts';
import { buildTrustedRecipeContext } from './context.ts';
import type {
  ContextInput,
  ContextUnavailableCode,
  TrustedRecipeContext,
} from './context.types.ts';
import type { RecipeVariation } from '../../../content/recipes/recipe.types.ts';

const base: ContextInput = {
  recipeId: 'gluten-free-napoleon',
  locale: 'en',
  scope: 'recipe',
};
const context = (changes: Partial<ContextInput> = {}): TrustedRecipeContext => {
  const result = buildTrustedRecipeContext({ ...base, ...changes });
  assert.equal(result.available, true);
  return result.context;
};
function unavailable(input: unknown, code: ContextUnavailableCode) {
  const result = buildTrustedRecipeContext(input);
  assert.equal(result.available, false);
  if (result.available) throw new Error('Expected unavailable');
  assert.equal(result.code, code);
  assert.equal('context' in result, false);
  assert.ok(result.message.length > 0);
}

void test('rejects malformed input and caller-provided context, status, or preview policy', () => {
  for (const input of [null, undefined, [], 'napoleon', 42])
    unavailable(input, 'INVALID_REQUEST');
  for (const key of [
    'recipe',
    'ingredients',
    'provenance',
    'status',
    'preview',
    'system',
    'sourceIds',
  ]) {
    unavailable({ ...base, [key]: 'untrusted' }, 'INVALID_REQUEST');
  }
});

void test('validates stable recipe IDs without aliases, paths or URLs', () => {
  for (const recipeId of [
    '',
    '../napoleon',
    'https://example.com',
    '__proto__',
    'a'.repeat(129),
    null,
    12,
  ]) {
    unavailable({ ...base, recipeId }, 'INVALID_RECIPE_ID');
  }
  unavailable({ ...base, recipeId: 'not-a-recipe' }, 'RECIPE_NOT_FOUND');
  unavailable({ ...base, recipeId: 'napoleon-cake' }, 'RECIPE_NOT_FOUND');
});

void test('validates locale and scope rather than silently falling back', () => {
  for (const locale of ['ua', 'UK', 'fr', '', 'en-US', undefined, 12])
    unavailable({ ...base, locale }, 'INVALID_LOCALE');
  for (const scope of ['all', 'substitution', '', undefined, {}])
    unavailable({ ...base, scope }, 'INVALID_SCOPE');
});

void test('step scope requires real, unique canonical steps; titles and ordinals are not IDs', () => {
  unavailable({ ...base, scope: 'step' }, 'INVALID_STEP_ID');
  unavailable({ ...base, stepId: 'mix-wet-dough' }, 'INVALID_STEP_ID');
  unavailable({ ...base, scope: 'step', stepId: '../step' }, 'INVALID_STEP_ID');
  unavailable({ ...base, scope: 'step', stepId: '01' }, 'STEP_NOT_FOUND');
  unavailable(
    { ...base, scope: 'step', stepId: 'not-a-step' },
    'STEP_NOT_FOUND',
  );
  for (const stepIds of [
    [],
    ['mix-wet-dough', 'mix-wet-dough'],
    ['a', 'b', 'c'],
    [null],
    'mix-wet-dough',
  ]) {
    unavailable({ ...base, scope: 'step', stepIds }, 'INVALID_STEP_ID');
  }
  unavailable(
    {
      ...base,
      scope: 'step',
      stepId: 'mix-wet-dough',
      stepIds: ['mix-wet-dough'],
    },
    'INVALID_STEP_ID',
  );
  assert.deepEqual(
    context({
      scope: 'step',
      stepIds: ['rest-assembled-cake', 'refrigerate-cake'],
    }).steps.map((step) => step.id),
    ['rest-assembled-cake', 'refrigerate-cake'],
  );
});

void test('every sourceDraft is explicitly unavailable, even when its source method is complete', () => {
  const drafts = recipeDocuments.filter(
    (document) => document.kind === 'sourceDraft',
  );
  assert.ok(drafts.length > 0);
  for (const document of drafts)
    unavailable(
      { ...base, recipeId: document.recipe.id },
      'SOURCE_DRAFT_UNAVAILABLE',
    );
  const result = buildTrustedRecipeContext({
    ...base,
    recipeId: drafts[0].recipe.id,
    locale: 'uk',
  });
  assert.ok(!result.available && result.message.includes('чернетку'));
});

void test('published detailed recipes preserve locale review state', () => {
  for (const document of recipeDocuments) {
    if (document.kind !== 'detailed') continue;
    const result = context({ recipeId: document.recipe.id });
    assert.equal(result.recipe.title, document.recipe.title.en);
    assert.equal(result.recipeVersionId, document.recipe.versionId);
    assert.equal(result.publication.status, 'published');
    assert.equal(result.publication.recipeLocalePublishable, true);
  }
});

void test('all three locales use canonical copy with shared facts and provenance', () => {
  const english = context();
  const document = getRecipeDocument(base.recipeId);
  assert.ok(document?.kind === 'detailed');
  for (const locale of ['en', 'es', 'uk'] as const) {
    const result = context({ locale });
    assert.equal(result.recipe.title, document.recipe.title[locale]);
    assert.equal(result.recipe.summary, document.recipe.summary[locale]);
    assert.deepEqual(
      result.ingredients.map((line) => line.amount),
      english.ingredients.map((line) => line.amount),
    );
    assert.equal(
      result.ingredients[0].options[0].name,
      document.recipe.ingredientSections[0].lines[0].options[0].name[locale],
    );
    assert.ok(result.gaps.every((gap) => gap.message.length > 0));
  }
});

void test('flour context only contains flour-system lines, not custard or unrelated content', () => {
  const result = context({ scope: 'flour' });
  assert.deepEqual(result.ingredients.map((line) => line.id).sort(), [
    'schar-mix-b',
  ]);
  assert.equal(result.timing, null);
  assert.equal(result.storage, null);
  assert.deepEqual(result.steps, []);
  assert.deepEqual(result.variations, []);
  assert.deepEqual(result.beforeStart, []);
  assert.deepEqual(result.gaps, []);
  assert.equal(result.flour?.evidence.status, 'Tested');
  assert.deepEqual(result.flour?.testedAlternatives, []);
  assert.ok(
    result.unknowns.some(
      (item) => item.reason === 'no-tested-alternative-recorded',
    ),
  );
  assert.ok(
    JSON.stringify(result).length < JSON.stringify(context()).length / 2,
  );
});

void test('step context uses the confirmed sour-cream method without the resolved dairy gap', () => {
  const result = context({
    scope: 'step',
    stepId: 'mix-wet-dough',
    locale: 'uk',
  });
  const document = getRecipeDocument(base.recipeId);
  assert.ok(document?.kind === 'detailed');
  const step = document.recipe.steps.find(
    (item) => item.id === 'mix-wet-dough',
  );
  assert.ok(step);
  assert.equal(result.steps.length, 1);
  assert.equal(result.steps[0].instruction.value, step.instruction.uk);
  assert.equal(result.steps[0].instruction.evidence.status, 'Tested');
  assert.deepEqual(result.steps[0].instruction.evidence.gapIds, []);
  assert.equal(result.flour, null);
  assert.ok(
    result.ingredients.some(
      (line) => line.id === 'cultured-dairy-dough' && line.options.length === 1,
    ),
  );
  assert.deepEqual(
    result.gaps.map((gap) => gap.id),
    [],
  );
});

void test('checkpoints and practical tips preserve canonical types, IDs and language', () => {
  for (const stepId of ['cut-in-butter', 'roll-layer']) {
    const result = context({ scope: 'step', stepId, locale: 'es' });
    const document = getRecipeDocument(base.recipeId);
    assert.ok(document?.kind === 'detailed');
    const step = document.recipe.steps.find((item) => item.id === stepId);
    assert.ok(step);
    assert.deepEqual(
      result.steps[0].guidance.map((item) => item.value),
      (step.guidance ?? []).map((item) => ({
        id: item.id,
        kind: item.kind,
        text: item.text.es,
      })),
    );
  }
});

void test('verified custard and narrower dairy guidance preserve their own provenance', () => {
  const result = context();
  assert.equal(result.recipe.evidence.status, 'Tested');
  const milk = result.ingredients.find((line) => line.id === 'milk-custard');
  assert.equal(milk?.amount.evidence.sourceState, 'tested');
  assert.equal(milk?.amount.evidence.status, 'Tested');
  assert.deepEqual(milk?.amount.evidence.gapIds, []);
  const dairy = result.ingredients.find(
    (line) => line.id === 'cultured-dairy-dough',
  );
  assert.equal(dairy?.amount.evidence.sourceState, 'tested');
  assert.equal(dairy?.amount.evidence.status, 'Tested');
  assert.equal(
    result.ingredients.find((line) => line.id === 'schar-mix-b')?.amount
      .evidence.status,
    'Tested',
  );
});

void test('unknowns stay null and gaps omit private editorial questions and source paths', () => {
  const document = getRecipeDocument(base.recipeId)!;
  assert.equal(document.kind, 'detailed');
  if (document.kind !== 'detailed') throw new Error('Expected detailed recipe');
  const recordedTime = document.recipe.timing.totalElapsedMinutes;
  let result: TrustedRecipeContext;
  try {
    document.recipe.timing.totalElapsedMinutes = null;
    result = context();
  } finally {
    document.recipe.timing.totalElapsedMinutes = recordedTime;
  }
  assert.equal(result.timing?.totalElapsedMinutes.value, null);
  assert.equal(result.timing?.totalElapsedMinutes.evidence.status, null);
  assert.equal(result.storage?.value, null);
  assert.ok(result.unknowns.some((item) => item.field === 'storage'));
  const serialized = JSON.stringify(result);
  for (const excluded of [
    'docs/reference',
    'Current ChatGPT',
    'locator',
    'sourceIds',
    'question',
    'SourceRef',
    'http://',
    'https://',
    'author-update',
  ])
    assert.equal(serialized.includes(excluded), false, excluded);
  assert.equal(
    result.gaps.some((gap) => gap.id === 'confirm-dairy-choice'),
    false,
  );
  assert.equal(
    result.gaps.some(
      (gap) => gap.area === 'image' || gap.area === 'translation',
    ),
    false,
  );
});

void test('geometry alternatives and variations have their own status, never base inheritance', () => {
  const result = context();
  assert.equal(result.geometry.base.value.kind, 'roundTemplate');
  assert.equal(result.geometry.base.value.application, 'roll-and-trim');
  assert.equal(result.yield.base.value.amount, 2);
  const preview = result.geometry.alternatives.find(
    (item) => item.value.id === 'round-28cm-preview',
  );
  assert.equal(preview?.evidence.status, 'Calculated');
  assert.equal(preview?.value.layerCount, null);
  assert.equal(preview?.value.availability, 'previewOnly');
  assert.ok(preview?.evidence.gapIds.includes('validate-28cm-form'));
  const document = getRecipeDocument(base.recipeId);
  assert.ok(document?.kind === 'detailed');
  for (const variation of result.variations) {
    const source: RecipeVariation = document.recipe.variations.find(
      (item) => item.id === variation.value.id,
    )!;
    assert.equal(variation.evidence.sourceState, source.provenance.state);
    if (!['tested', 'repeatedlyVerified'].includes(source.provenance.state))
      assert.notEqual(variation.evidence.status, 'Tested');
  }
});

void test('adjusted quantities are recomputed without inheriting Tested', () => {
  const configuration = {
    kind: 'adjusted',
    geometryId: 'round-28cm-preview',
    quantityAdjustment: { mode: 'batchScale', factor: 0.5 },
  } as const;
  const result = context({ configuration });
  const document = getRecipeDocument(base.recipeId);
  assert.ok(document?.kind === 'detailed');
  const calculated = calculateRecipeConfiguration(
    document.recipe,
    configuration.geometryId,
    configuration.quantityAdjustment,
  );
  assert.equal(result.configuration.status, 'Calculated');
  assert.equal(
    result.configuration.cookModeEligible,
    calculated.cookMode.eligible,
  );
  assert.equal(result.configuration.cookModeEligible, false);
  assert.ok(
    result.configuration.warnings.some(
      (item) => item.code === 'unverified-timing',
    ),
  );
  for (const line of result.ingredients) {
    assert.deepEqual(
      line.amount.value,
      calculated.ingredientAmounts.find(
        (item) => item.ingredientLineId === line.id,
      )?.amount,
    );
    assert.notEqual(line.amount.evidence.status, 'Tested');
    assert.equal(line.amountBasis, 'calculated');
  }
  const milk = result.ingredients.find((line) => line.id === 'milk-custard')!;
  assert.equal(milk.amount.evidence.status, 'Calculated');
  assert.equal(milk.amount.evidence.sourceState, 'tested');
  assert.deepEqual(milk.amount.evidence.limitations, []);
  assert.deepEqual(milk.amount.evidence.gapIds, []);
  assert.equal(result.timing?.basis, 'canonical-base');
  assert.deepEqual(result.timing, context().timing);
  assert.deepEqual(result.yield, context().yield);
});

void test('a 1× adjusted selection and adjusted step guidance never become Tested', () => {
  const configuration = {
    kind: 'adjusted',
    geometryId: 'round-24cm-6-layers-each',
    quantityAdjustment: { mode: 'batchScale', factor: 1 },
  } as const;
  const result = context({
    configuration,
    scope: 'step',
    stepId: 'cut-in-butter',
  });
  assert.equal(result.configuration.status, 'Calculated');
  assert.equal(result.configuration.totalScaleFactor, 1);
  assert.equal(result.steps[0].instruction.evidence.status, null);
  assert.ok(
    result.steps[0].guidance.every((item) => item.evidence.status !== 'Tested'),
  );
  assert.ok(
    result.ingredients.every(
      (item) => item.amount.evidence.status !== 'Tested',
    ),
  );
});

void test('use-what-I-have quantities come from the canonical calculator', () => {
  const result = context({
    configuration: {
      kind: 'adjusted',
      geometryId: 'round-24cm-6-layers-each',
      quantityAdjustment: {
        mode: 'useWhatIHave',
        anchorIngredientLineId: 'schar-mix-b',
        availableAmount: { value: 200, unit: 'g' },
      },
    },
  });
  assert.deepEqual(
    result.ingredients.find((item) => item.id === 'schar-mix-b')?.amount.value,
    { kind: 'exact', value: 200, unit: 'g' },
  );
  assert.equal(result.configuration.cookModeEligible, false);
  assert.ok(
    result.unknowns.some(
      (item) => item.reason === 'calculation-needs-resolution',
    ),
  );
});

void test('rejects forged, unsupported, non-finite and overflowing configurations', () => {
  const adjusted = {
    kind: 'adjusted',
    geometryId: 'round-24cm-6-layers-each',
    quantityAdjustment: { mode: 'batchScale', factor: 2 },
  };
  for (const configuration of [
    null,
    { kind: 'base', status: 'Tested' },
    { ...adjusted, amount: 123 },
    { ...adjusted, geometryId: 'nonexistent' },
    { ...adjusted, quantityAdjustment: { mode: 'batchScale', factor: 4 } },
  ]) {
    unavailable({ ...base, configuration }, 'INVALID_CONFIGURATION');
  }
  for (const value of [
    NaN,
    Infinity,
    -Infinity,
    -1,
    0,
    99,
    Number.MAX_VALUE,
    '200',
  ]) {
    unavailable(
      {
        ...base,
        configuration: {
          ...adjusted,
          quantityAdjustment: {
            mode: 'useWhatIHave',
            anchorIngredientLineId: 'schar-mix-b',
            availableAmount: { value, unit: 'g' },
          },
        },
      },
      'INVALID_CONFIGURATION',
    );
  }
  for (const unit of ['ml', 'kg', { toString: () => 'g' }]) {
    unavailable(
      {
        ...base,
        configuration: {
          ...adjusted,
          quantityAdjustment: {
            mode: 'useWhatIHave',
            anchorIngredientLineId: 'schar-mix-b',
            availableAmount: { value: 200, unit },
          },
        },
      },
      'INVALID_CONFIGURATION',
    );
  }
});

void test('output and selection are detached; mutations never alter canonical records or later calls', () => {
  const before = JSON.stringify(recipeDocuments);
  const first = context();
  first.ingredients[0].options[0].name = 'changed';
  first.geometry.base.value.diameterCm = 999;
  first.flour?.additionalStarchLineIds.push('changed');
  const amount = first.ingredients[0].amount.value;
  if (amount?.kind === 'exact') amount.value = 999;
  assert.equal(JSON.stringify(recipeDocuments), before);
  assert.notEqual(context().ingredients[0].options[0].name, 'changed');
  assert.equal(context().geometry.base.value.diameterCm, 24);
});
