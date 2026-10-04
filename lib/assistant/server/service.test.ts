import assert from 'node:assert/strict';
import test from 'node:test';
import { glutenFreeNapoleonRecipe } from '../../../content/recipes/gluten-free-napoleon.recipe.ts';
import type { RecipeDraft } from '../../../content/recipes/recipe.types.ts';
import type { AssistantRequestV1 } from '../contracts.ts';
import type { AssistantRuntimeConfig } from './env.ts';
import { AssistantServiceError } from './errors.ts';
import type { AssistantProvider } from './openai.ts';
import { protectAssistantProvider } from './quotas.ts';
import { createAssistantService } from './service.ts';
import { resolveActionReview } from '../actions.ts';

const config: AssistantRuntimeConfig = {
  enabled: true,
  apiKey: 'test-key',
  sessionSecret: 's'.repeat(32),
  model: 'gpt-5.4-mini',
  maxOutputTokens: 2000,
};

const readyRecipe = structuredClone(glutenFreeNapoleonRecipe) as RecipeDraft;
readyRecipe.publicationStatus = 'published';
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
      geometryId: 'round-28cm-preview',
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
          geometryId: 'round-28cm-preview',
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

void test('records allowlisted content-free telemetry with model, latency, usage, recipe and scope', async () => {
  const events: unknown[] = [];
  const clock = [1_000, 1_037];
  const hardened = createAssistantService({
    config,
    provider: {
      async answer(_input, projection, context) {
        context.onTelemetry({
          providerRequestId: 'provider-123',
          usage: {
            inputTokens: 500,
            outputTokens: 75,
            totalTokens: 575,
            cachedInputTokens: 100,
          },
        });
        const evidenceId = projection.evidence.keys().next().value;
        assert.ok(evidenceId);
        return {
          locale: 'en',
          actionId: null,
          outcome: 'answered',
          blocks: [{ kind: 'evidence', evidenceId }],
        };
      },
    },
    resolveRecipe: () => ({ kind: 'detailed', recipe: readyRecipe }),
    isRecipeEnabled: () => true,
    isRecipeLocaleAllowed: () => true,
    isUiLocaleAllowed: () => true,
    telemetry: { record: (event) => events.push(event) },
    now: () => clock.shift() ?? 1_037,
  });

  await hardened.respond(request, {
    requestId: 'request-telemetry',
    signal: new AbortController().signal,
    safetyIdentifier: 'ba_private_identifier',
  });

  assert.equal(events.length, 1);
  const event = events[0] as Record<string, unknown>;
  assert.deepEqual(Object.keys(event).sort(), [
    'cachedInputTokens',
    'contextVersion',
    'errorCode',
    'event',
    'inputTokens',
    'latencyMs',
    'locale',
    'model',
    'outputTokens',
    'promptVersion',
    'providerRequestId',
    'recipeId',
    'recipeVersionId',
    'requestId',
    'scope',
    'status',
    'totalTokens',
  ]);
  assert.equal(event.model, config.model);
  assert.equal(event.latencyMs, 37);
  assert.equal(event.recipeId, request.recipeId);
  assert.equal(event.scope, 'flour');
  assert.equal(event.totalTokens, 575);
  const serialized = JSON.stringify(event);
  assert.doesNotMatch(
    serialized,
    /test-key|Which flour|ba_private_identifier/u,
  );
});

void test('shared quota denial remains a quota error instead of a generic provider failure', async () => {
  await assert.rejects(
    service({
      answer: async () => {
        throw new AssistantServiceError('BUDGET_EXHAUSTED', 503);
      },
    }).respond(request, {
      requestId: 'budget-denied',
      signal: new AbortController().signal,
    }),
    { code: 'BUDGET_EXHAUSTED' },
  );
});

void test('budget rejection prevents all model calls; provider failure still releases only concurrency', async () => {
  let calls = 0;
  let releases = 0;
  let reserved = 0;
  const upstream: AssistantProvider = {
    async answer() {
      calls++;
      throw new Error('timeout after possible billing');
    },
  };
  const denied = protectAssistantProvider(
    upstream,
    {
      async allowVerification() {},
      async reserve() {
        throw new AssistantServiceError('BUDGET_EXHAUSTED', 503);
      },
    },
    { sessionKey: 's', networkKey: 'n' },
    2000,
  );
  await assert.rejects(
    service(denied).respond(request, {
      requestId: 'denied',
      signal: new AbortController().signal,
    }),
    { code: 'BUDGET_EXHAUSTED' },
  );
  assert.equal(calls, 0);
  const protectedProvider = protectAssistantProvider(
    upstream,
    {
      async allowVerification() {},
      async reserve(_actor, _id, cost) {
        reserved += cost;
        return {
          async release() {
            releases++;
          },
        };
      },
    },
    { sessionKey: 's', networkKey: 'n' },
    2000,
  );
  await assert.rejects(
    service(protectedProvider).respond(request, {
      requestId: 'timed-out',
      signal: new AbortController().signal,
    }),
    { code: 'SERVICE_UNAVAILABLE' },
  );
  assert.equal(calls, 1);
  assert.equal(releases, 1);
  assert.equal(reserved, 33000);
});

for (const locale of ['uk', 'en', 'es'] as const) {
  void test(`keeps source quantities when ${locale} model redundantly repeats them in an explanation`, async () => {
    const input: AssistantRequestV1 = {
      ...request,
      locale,
      scope: { kind: 'step', stepIds: ['heat-milk'] },
    };
    const text = {
      uk: 'Залиште холодним 600–650 мл молока.',
      en: 'Keep 600–650 ml of milk cold.',
      es: 'Reserva 600–650 ml de leche fría.',
    }[locale];
    const response = await service({
      async answer(_request, projection) {
        const entry = [...projection.evidence.entries()].find(([, fact]) =>
          fact.text.includes('600–650'),
        );
        assert.ok(entry);
        return {
          locale,
          actionId: null,
          outcome: 'answered',
          blocks: [
            { kind: 'evidence', evidenceId: entry[0] },
            { kind: 'explanation', text, evidenceIds: [entry[0]] },
          ],
        };
      },
    }).respond(input, {
      requestId: 'numeric-repeat',
      signal: new AbortController().signal,
    });
    assert.ok(response.ok);
    assert.equal(response.blocks.length, 1);
    assert.equal(response.blocks[0]!.kind, 'evidence');
    assert.match(response.blocks[0]!.text, /600–650/);
  });
}
for (const scenario of [
  'invented-number',
  'unselected-source',
  'false-status',
  'suggestion',
  'unknown-source',
] as const) {
  void test(`numeric repetition recovery still rejects ${scenario}`, async () => {
    const input: AssistantRequestV1 = {
      ...request,
      locale: 'uk',
      scope: { kind: 'step', stepIds: ['heat-milk'] },
    };
    await assert.rejects(
      service({
        async answer(_request, projection) {
          const entry = [...projection.evidence.entries()].find(([, fact]) =>
            fact.text.includes('600–650'),
          );
          assert.ok(entry);
          return {
            locale: 'uk',
            actionId: null,
            outcome: 'answered',
            blocks: [
              ...(scenario === 'unselected-source'
                ? []
                : [{ kind: 'evidence' as const, evidenceId: entry[0] }]),
              {
                kind: scenario === 'suggestion' ? 'suggestion' : 'explanation',
                text:
                  scenario === 'invented-number'
                    ? 'Залиште 999 мл молока.'
                    : scenario === 'false-status'
                      ? 'Перевірено: залиште 600–650 мл.'
                      : 'Залиште 600–650 мл молока.',
                evidenceIds: [
                  scenario === 'unknown-source' ? 'e999999' : entry[0],
                ],
              },
            ],
          };
        },
      }).respond(input, {
        requestId: 'unsafe-numeric-repeat',
        signal: new AbortController().signal,
      }),
      { code: 'INVALID_UPSTREAM_RESPONSE' },
    );
  });
}
