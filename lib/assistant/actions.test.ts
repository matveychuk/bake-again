import assert from 'node:assert/strict';
import test from 'node:test';
import { glutenFreeNapoleonRecipe as recipe } from '../../content/recipes/gluten-free-napoleon.recipe.ts';
import { calculateRecipeConfiguration } from '../../content/recipes/calculate-configuration.ts';
import {
  createActionProposal,
  createActionCatalog,
  resolveActionReview,
  shoppingInputsFromReview,
} from './actions.ts';
import type { AssistantRequestV1 } from './contracts.ts';
import type { ActionProposal } from './action-contract.ts';

export const actionRequest: AssistantRequestV1 = {
  schemaVersion: 1,
  recipeId: recipe.id,
  recipeVersionId: recipe.versionId,
  locale: 'en',
  surface: 'recipe-detail',
  scope: { kind: 'flour' },
  configuration: { kind: 'base' },
  question: 'Add these ingredients',
  history: [],
};

void test('catalog offers proposals only; all quantities and source IDs come from canonical code', () => {
  const before = JSON.stringify(recipe);
  const catalog = createActionCatalog(actionRequest, 'request');
  assert.deepEqual([...catalog.keys()], ['a1', 'a2']);
  const proposal = catalog.get('a2')!;
  assert.equal(proposal.status, 'Suggested');
  assert.equal('quantities' in proposal, false);
  const review = resolveActionReview(proposal);
  const calculated = calculateRecipeConfiguration(
    recipe,
    recipe.geometry.default.id,
    { mode: 'batchScale', factor: 1 },
  );
  for (const line of review.lines)
    assert.deepEqual(
      line.quantity,
      calculated.ingredientAmounts.find(
        (amount) => amount.ingredientLineId === line.ingredientLineId,
      )!.amount,
    );
  const inputs = shoppingInputsFromReview(review, {});
  assert.ok(
    inputs.every((input) => input.source.recipeVersionId === recipe.versionId),
  );
  assert.equal(JSON.stringify(recipe), before);
});

void test('both sides can reject forged payloads, arbitrary IDs, scale factors and provenance upgrades', () => {
  const proposal = createActionProposal(
    actionRequest,
    'add-shopping-items',
    'request:a2',
  );
  const forged: unknown[] = [
    { ...proposal, status: 'Tested' },
    { ...proposal, kind: 'write-recipe' },
    { ...proposal, quantities: [999] },
    { ...proposal, ingredientIds: ['arsenic'] },
    { ...proposal, url: 'https://attacker.example' },
    { ...proposal, ingredientLineIds: ['forged'] },
    {
      ...proposal,
      ingredientLineIds: [
        ...proposal.ingredientLineIds,
        proposal.ingredientLineIds[0],
      ],
    },
    {
      ...proposal,
      context: { ...proposal.context, recipeId: 'crinkle-cookies' },
    },
    { ...proposal, context: { ...proposal.context, recipeVersionId: 'stale' } },
    { ...proposal, context: { ...proposal.context, locale: 'fr' } },
    { ...proposal, context: { ...proposal.context, status: 'Tested' } },
    ...[NaN, Infinity, 0, -1, 3, 0.75].map((factor) => ({
      ...proposal,
      context: {
        ...proposal.context,
        configuration: {
          kind: 'adjusted',
          geometryId: recipe.geometry.default.id,
          quantityAdjustment: { mode: 'batchScale', factor },
        },
      },
    })),
    { ...proposal, cookModeEligible: false },
    { ...proposal, ingredientLineIds: ['custard-eggs'] },
  ];
  for (const value of forged) assert.throws(() => resolveActionReview(value));
  assert.throws(() =>
    resolveActionReview(proposal, {
      [proposal.ingredientLineIds[0]]: 'forged',
    }),
  );
  assert.throws(() => resolveActionReview(proposal, { unrelated: 'butter' }));
  assert.throws(() =>
    resolveActionReview(proposal, JSON.parse('{"__proto__":"forged"}')),
  );
});

void test('supported scale factors use the calculator and never inherit Tested', () => {
  for (const factor of [0.5, 1, 1.5, 2] as const) {
    const request: AssistantRequestV1 = {
      ...actionRequest,
      configuration: {
        kind: 'adjusted',
        geometryId: recipe.geometry.default.id,
        quantityAdjustment: { mode: 'batchScale', factor },
      },
    };
    const result = calculateRecipeConfiguration(
      recipe,
      recipe.geometry.default.id,
      { mode: 'batchScale', factor },
    );
    const open = createActionProposal(
      request,
      'open-scaling',
      `scale-${factor}`,
    );
    assert.equal(open.configurationStatus, 'Calculated');
    assert.equal(open.cookModeEligible, result.cookMode.eligible);
    assert.throws(() =>
      resolveActionReview({ ...open, configurationStatus: 'Tested' }),
    );
    if (!result.cookMode.eligible)
      assert.throws(() =>
        createActionProposal(request, 'add-shopping-items', 'blocked'),
      );
    else {
      const review = resolveActionReview(
        createActionProposal(request, 'add-shopping-items', 'calculated'),
      );
      assert.ok(review.lines.every((line) => line.status !== 'Tested'));
    }
  }
});

void test('Cook Mode ineligibility cannot be forged; open-scaling only opens repair controls', () => {
  const request: AssistantRequestV1 = {
    ...actionRequest,
    surface: 'cook-mode',
    configuration: {
      kind: 'adjusted',
      geometryId: 'round-28cm-preview',
      quantityAdjustment: { mode: 'batchScale', factor: 0.5 },
    },
  };
  const open = createActionProposal(request, 'open-scaling', 'open');
  assert.equal(open.cookModeEligible, false);
  assert.deepEqual(resolveActionReview(open).lines, []);
  assert.throws(() => resolveActionReview({ ...open, cookModeEligible: true }));
  assert.throws(() =>
    resolveActionReview({
      ...open,
      kind: 'add-shopping-items',
      ingredientLineIds: ['schar-mix-b'],
    }),
  );
});

void test('single-option lines resolve canonically and preserve unresolved gaps', () => {
  const request: AssistantRequestV1 = {
    ...actionRequest,
    scope: { kind: 'recipe' },
  };
  const proposal = createActionProposal(
    request,
    'add-shopping-items',
    'choice',
  );
  const review = resolveActionReview(proposal);
  const flour = review.lines.find((line) => line.ingredientLineId === 'schar-mix-b')!;
  assert.equal(flour.options.length, 1);
  assert.equal(flour.selectedIngredientId, flour.options[0].ingredientId);
  assert.throws(() => resolveActionReview(proposal, { [flour.ingredientLineId]: 'forged' }, true));
  const gap = review.lines.find((line) => line.hasGaps)!;
  assert.ok(gap);
  assert.notEqual(gap.status, 'Tested');
  assert.throws(() => resolveActionReview(proposal, {}, true), { code: 'CHOICE_REQUIRED' });
  const choices = Object.fromEntries(review.lines.filter(line => line.options.length > 1).map(line => [line.ingredientLineId, line.options[0].ingredientId]));
  const confirmed = resolveActionReview(proposal, choices, true);
  assert.equal(confirmed.proposal.status, 'Suggested');
  assert.notEqual(
    confirmed.lines.find((line) => line.ingredientLineId === gap.ingredientLineId)!.status,
    'Tested',
  );
});

void test('stale recipe version is rejected even when all other fields remain valid', () => {
  const proposal: ActionProposal = createActionProposal(
    actionRequest,
    'open-scaling',
    'stale',
  );
  proposal.context.recipeVersionId = 'gluten-free-napoleon-v0';
  assert.throws(() => resolveActionReview(proposal), { code: 'STALE_RECIPE' });
});
