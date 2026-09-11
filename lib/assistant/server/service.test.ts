import assert from 'node:assert/strict';
import test from 'node:test';
import { glutenFreeNapoleonRecipe } from '../../../content/recipes/gluten-free-napoleon.recipe.ts';
import type { RecipeDraft } from '../../../content/recipes/recipe.types.ts';
import type { AssistantRequestV1 } from '../contracts.ts';
import type { AssistantRuntimeConfig } from './env.ts';
import { AssistantServiceError } from './errors.ts';
import type { AssistantProvider } from './openai.ts';
import { createAssistantService } from './service.ts';
import { resolveActionReview } from '../actions.ts';

const config: AssistantRuntimeConfig = {
  enabled: true,
  apiKey: 'test-key',
  model: 'gpt-5.4-mini',
  maxOutputTokens: 2000,
};

const readyRecipe = structuredClone(glutenFreeNapoleonRecipe) as RecipeDraft;
readyRecipe.publicationStatus = 'ready';
readyRecipe.translationState.en = 'reviewed';

const request: AssistantRequestV1 = {
  schemaVersion: 1,
  recipeId: readyRecipe.id,
  recipeVersionId: readyRecipe.versionId,
  locale: 'en',
  surface: 'recipe-detail',
  scope: { kind: 'flour' },
  configuration: { kind: 'base' },
  question: 'Which flour is recorded?',
  history: [],
};

for (const actionId of ['a1', 'a2'] as const) {
  void test(`model can select ${actionId}, but server builds the entire Suggested proposal`, async () => {
    const response = await service({
      answer: async () => ({
        locale: 'en',
        actionId,
        outcome: 'answered',
        blocks: [
          {
            kind: 'limitation',
            text: 'Review the proposed action.',
            evidenceIds: [],
          },
        ],
      }),
    }).respond(request, {
      requestId: 'action-request',
      signal: new AbortController().signal,
    });
    assert.ok(response.ok && response.proposedAction);
    assert.equal(response.proposedAction.status, 'Suggested');
    assert.equal(response.proposedAction.id, `action-request:${actionId}`);
    assert.equal(
      response.proposedAction.context.recipeVersionId,
      request.recipeVersionId,
    );
    assert.ok(resolveActionReview(response.proposedAction));
  });
}

void test('model-selected shopping action is rejected when the deterministic catalog disallows it', async () => {
  const adjusted: AssistantRequestV1 = {
    ...request,
    configuration: {
      kind: 'adjusted',
      geometryId: 'round-24cm-preview',
      quantityAdjustment: { mode: 'batchScale', factor: 0.5 },
    },
  };
  await assert.rejects(
    service({
      answer: async () => ({
        locale: 'en',
        actionId: 'a2',
        outcome: 'answered',
        blocks: [
          {
            kind: 'limitation',
            text: 'Review the proposed action.',
            evidenceIds: [],
          },
        ],
      }),
    }).respond(adjusted, {
      requestId: 'action-request',
      signal: new AbortController().signal,
    }),
    { code: 'INVALID_UPSTREAM_RESPONSE' },
  );
});

function service(provider: AssistantProvider) {
  return createAssistantService({
    config,
    provider,
    resolveRecipe: () => ({ kind: 'detailed', recipe: readyRecipe }),
    isRecipeEnabled: () => true,
    isRecipeLocaleAllowed: () => true,
    isUiLocaleAllowed: () => true,
  });
}

void test('assembles evidence text and status only from the server projection', async () => {
  let calls = 0;
  const provider: AssistantProvider = {
    async answer(_request, projection) {
      calls += 1;
      const evidenceId = projection.evidence.keys().next().value;
      if (evidenceId === undefined)
        throw new Error('Expected projected evidence.');
      return {
        locale: 'en',
        actionId: null,
        outcome: 'answered',
        blocks: [{ kind: 'evidence', evidenceId }],
      };
    },
  };
  const response = await service(provider).respond(request, {
    requestId: 'request-1',
    signal: new AbortController().signal,
  });
  assert.equal(response.ok, true);
  if (!response.ok) return;
  assert.equal(calls, 1);
  assert.equal(response.blocks[0]?.kind, 'evidence');
  assert.equal(response.blocks[0]?.status, 'Tested');
  assert.equal(response.blocks[0]?.references[0]?.recipeId, readyRecipe.id);
  assert.equal(response.proposedAction, null);
});

void test('rejects stale versions before calling the provider', async () => {
  let calls = 0;
  const provider: AssistantProvider = {
    async answer() {
      calls += 1;
      return { locale: 'en', actionId: null, outcome: 'answered', blocks: [] };
    },
  };
  await assert.rejects(
    service(provider).respond(
      { ...request, recipeVersionId: 'stale-version' },
      { requestId: 'request-2', signal: new AbortController().signal },
    ),
    (error) =>
      error instanceof AssistantServiceError &&
      error.code === 'RECIPE_VERSION_MISMATCH',
  );
  assert.equal(calls, 0);
});

void test('rejects unknown model evidence references', async () => {
  const provider: AssistantProvider = {
    async answer() {
      return {
        locale: 'en',
        actionId: null,
        outcome: 'answered',
        blocks: [{ kind: 'evidence', evidenceId: 'forged' }],
      };
    },
  };
  await assert.rejects(
    service(provider).respond(request, {
      requestId: 'request-3',
      signal: new AbortController().signal,
    }),
    (error) =>
      error instanceof AssistantServiceError &&
      error.code === 'INVALID_UPSTREAM_RESPONSE',
  );
});

void test('rejects a calculation preview that is ineligible for Cook Mode without a provider call', async () => {
  let calls = 0;
  const provider: AssistantProvider = {
    async answer() {
      calls += 1;
      return { locale: 'en', actionId: null, outcome: 'answered', blocks: [] };
    },
  };
  await assert.rejects(
    service(provider).respond(
      {
        ...request,
        surface: 'cook-mode',
        configuration: {
          kind: 'adjusted',
          geometryId: 'round-24cm-preview',
          quantityAdjustment: { mode: 'batchScale', factor: 0.5 },
        },
      },
      { requestId: 'request-4', signal: new AbortController().signal },
    ),
    (error) =>
      error instanceof AssistantServiceError &&
      error.code === 'CONFIGURATION_UNAVAILABLE',
  );
  assert.equal(calls, 0);
});
