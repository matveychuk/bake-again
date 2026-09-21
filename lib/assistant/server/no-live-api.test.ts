import assert from 'node:assert/strict';
import test from 'node:test';
import type { Response as OpenAIResponse } from 'openai/resources/responses/responses';
import type { AssistantRequestV1 } from '../contracts.ts';
import type { AssistantContextProjection } from './context.ts';
import { createOpenAIAssistantProvider } from './openai.ts';

void test('assistant unit tests use an injected client and never call the live API', async () => {
  let globalFetchCalls = 0;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    globalFetchCalls += 1;
    throw new Error('Live network access is forbidden in unit tests.');
  };
  try {
    const provider = createOpenAIAssistantProvider(
      {
        enabled: true,
        apiKey: 'mock-only-not-a-live-key',
        sessionSecret: 's'.repeat(32),
        model: 'gpt-5.4-mini',
        maxOutputTokens: 256,
      },
      {
        responses: {
          async create() {
            return {
              status: 'completed',
              output: [],
              output_text: JSON.stringify({
                locale: 'en',
                actionId: null,
                outcome: 'insufficient-context',
                blocks: [
                  {
                    kind: 'limitation',
                    text: 'The recipe does not record that detail.',
                    evidenceIds: [],
                  },
                ],
              }),
            } as unknown as OpenAIResponse;
          },
        },
      },
    );
    const request: AssistantRequestV1 = {
      schemaVersion: 1,
      recipeId: 'gluten-free-napoleon',
      recipeVersionId: 'gluten-free-napoleon-v2',
      locale: 'en',
      surface: 'recipe-detail',
      scope: { kind: 'recipe' },
      configuration: { kind: 'base' },
      question: 'Is another flour recorded?',
      history: [],
    };
    await provider.answer(
      request,
      {
        context: {} as AssistantContextProjection['context'],
        evidence: new Map(),
        estimatedInputTokens: 1,
      },
      {
        signal: new AbortController().signal,
        requestId: 'no-live-api',
        safetyIdentifier: 'ba_no_live_api',
        onTelemetry() {},
      },
    );
    assert.equal(globalFetchCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
