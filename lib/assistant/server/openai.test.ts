import assert from 'node:assert/strict';
import test from 'node:test';
import type OpenAI from 'openai';
import type { Response as OpenAIResponse } from 'openai/resources/responses/responses';
import type { AssistantRequestV1 } from '../contracts.ts';
import {
  ASSISTANT_MAX_RETRIES,
  ASSISTANT_TIMEOUT_MS,
  type AssistantRuntimeConfig,
} from './env.ts';
import {
  createOpenAIAssistantProvider,
  createServerOpenAIClient,
  parseProviderAnswer,
  type ResponsesClient,
} from './openai.ts';

void test('action selector accepts only catalog IDs and never model-authored payloads', () => {
  const answer = {
    locale: 'en',
    outcome: 'answered',
    blocks: [
      {
        kind: 'limitation',
        text: 'Review the proposed action.',
        evidenceIds: [],
      },
    ],
    actionId: 'a1',
  };
  assert.ok(parseProviderAnswer(answer));
  for (const invalid of [
    { ...answer, actionId: 'a3' },
    { ...answer, actionId: ['a1', 'a2'] },
    { ...answer, actionId: { kind: 'add-shopping-items', quantities: [999] } },
    { ...answer, outcome: 'refused' },
    { ...answer, status: 'Tested' },
  ])
    assert.equal(parseProviderAnswer(invalid), null);
});

const config: AssistantRuntimeConfig = {
  enabled: true,
  apiKey: 'test-key',
  sessionSecret: 's'.repeat(32),
  model: 'gpt-5.4-mini',
  maxOutputTokens: 777,
};

const request: AssistantRequestV1 = {
  schemaVersion: 1,
  recipeId: 'gluten-free-napoleon',
  recipeVersionId: 'gluten-free-napoleon-v2',
  locale: 'en',
  surface: 'recipe-detail',
  scope: { kind: 'flour' },
  configuration: { kind: 'base' },
  question: 'Which flour is recorded?',
  history: [],
};

void test('constructs the server client with the ADR deadline and zero automatic retries', () => {
  let captured: ConstructorParameters<typeof OpenAI>[0];
  const client = createServerOpenAIClient(config, (options) => {
    captured = options;
    return { responses: { create: async () => ({}) as OpenAIResponse } };
  });
  assert.ok(client);
  assert.equal(captured!.apiKey, 'test-key');
  assert.equal(captured!.timeout, ASSISTANT_TIMEOUT_MS);
  assert.equal(captured!.maxRetries, ASSISTANT_MAX_RETRIES);
  assert.equal(ASSISTANT_TIMEOUT_MS, 15_000);
  assert.equal(ASSISTANT_MAX_RETRIES, 0);
});

void test('uses Responses Structured Outputs, store false and the configured output cap', async () => {
  let body: Parameters<OpenAI['responses']['create']>[0] | undefined;
  let signal: AbortSignal | null | undefined;
  let headers: Record<string, string> | undefined;
  let telemetry: unknown;
  const client: ResponsesClient = {
    responses: {
      async create(input, options) {
        body = input;
        signal = options?.signal;
        headers = options?.headers as Record<string, string> | undefined;
        return {
          _request_id: 'provider-request-test',
          status: 'completed',
          output_text: JSON.stringify({
            locale: 'en',
            actionId: null,
            outcome: 'answered',
            blocks: [{ kind: 'evidence', evidenceId: 'e1' }],
          }),
          output: [],
          usage: {
            input_tokens: 321,
            output_tokens: 45,
            total_tokens: 366,
            input_tokens_details: { cached_tokens: 120 },
          },
        } as unknown as OpenAIResponse;
      },
    },
  };
  const controller = new AbortController();
  const provider = createOpenAIAssistantProvider(config, client);
  const answer = await provider.answer(
    request,
    {
      context: {} as never,
      evidence: new Map(),
      estimatedInputTokens: 10,
    },
    {
      signal: controller.signal,
      requestId: 'request-test',
      safetyIdentifier: 'ba_test_identifier',
      onTelemetry(value) {
        telemetry = value;
      },
    },
  );

  assert.equal(body?.store, false);
  assert.equal(body?.safety_identifier, 'ba_test_identifier');
  assert.equal(body?.max_output_tokens, 777);
  assert.equal(body?.model, 'gpt-5.4-mini');
  assert.deepEqual(body?.reasoning, { effort: 'low' });
  assert.deepEqual(body?.tools, []);
  const format = body?.text?.format;
  assert.equal(format?.type, 'json_schema');
  assert.equal(format && 'strict' in format ? format.strict : undefined, true);
  assert.equal(signal, controller.signal);
  assert.equal(headers?.['X-Client-Request-Id'], 'request-test');
  assert.deepEqual(telemetry, {
    providerRequestId: 'provider-request-test',
    usage: {
      inputTokens: 321,
      outputTokens: 45,
      totalTokens: 366,
      cachedInputTokens: 120,
    },
  });
  assert.deepEqual(answer, {
    locale: 'en',
    actionId: null,
    outcome: 'answered',
    blocks: [{ kind: 'evidence', evidenceId: 'e1' }],
  });
});

void test('does not retry or repair malformed structured output', async () => {
  let calls = 0;
  const client: ResponsesClient = {
    responses: {
      async create() {
        calls += 1;
        return {
          status: 'completed',
          output_text: '{not-json',
          output: [],
        } as unknown as OpenAIResponse;
      },
    },
  };
  const provider = createOpenAIAssistantProvider(config, client);
  await assert.rejects(
    provider.answer(
      request,
      {
        context: {} as never,
        evidence: new Map(),
        estimatedInputTokens: 10,
      },
      {
        signal: new AbortController().signal,
        requestId: 'request-test',
        safetyIdentifier: 'ba_test_identifier',
        onTelemetry() {},
      },
    ),
    { kind: 'invalid-response' },
  );
  assert.equal(calls, 1);
});
