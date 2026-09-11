import assert from 'node:assert/strict';
import test from 'node:test';
import type { AssistantRequestV1, AssistantResponseV1 } from '../../../lib/assistant/contracts.ts';
import { AssistantServiceError } from '../../../lib/assistant/server/errors.ts';
import type { AssistantService } from '../../../lib/assistant/server/service.ts';
import { createAssistantRouteHandler } from './route.ts';

const requestBody: AssistantRequestV1 = {
  schemaVersion: 1,
  recipeId: 'gluten-free-napoleon',
  recipeVersionId: 'gluten-free-napoleon-v1-draft',
  locale: 'en',
  surface: 'recipe-detail',
  scope: { kind: 'flour' },
  configuration: { kind: 'base' },
  question: 'Which flour is recorded?',
  history: [],
};

function request(body: string, headers: Record<string, string> = {}) {
  return new Request('https://bakeagain.example/api/assistant', {
    method: 'POST',
    headers: {
      origin: 'https://bakeagain.example',
      'content-type': 'application/json',
      ...headers,
    },
    body,
  });
}

function handler(service: AssistantService) {
  return createAssistantRouteHandler({
    getService: async () => service,
    createRequestId: () => 'request-test',
  });
}

void test('returns the successful service envelope with no-store headers', async () => {
  let receivedQuestion = '';
  const service: AssistantService = {
    async respond(input, { requestId }) {
      receivedQuestion = input.question;
      return {
        schemaVersion: 1,
        ok: true,
        requestId,
        recipeId: input.recipeId,
        recipeVersionId: input.recipeVersionId,
        locale: input.locale,
        configuration: input.configuration,
        outcome: 'answered',
        blocks: [
          {
            kind: 'limitation',
            text: 'Mock answer.',
            status: null,
            references: [],
          },
        ],
        proposedAction: null,
      };
    },
  };
  const response = await handler(service)(request(JSON.stringify(requestBody)));
  const body = (await response.json()) as AssistantResponseV1;
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('x-request-id'), 'request-test');
  assert.equal(body.ok, true);
  assert.equal(receivedQuestion, requestBody.question);
});

void test('rejects method, origin and media type before resolving the service', async () => {
  let serviceReads = 0;
  const route = createAssistantRouteHandler({
    getService: async () => {
      serviceReads += 1;
      throw new Error('must not run');
    },
    createRequestId: () => 'request-test',
  });
  const methodResponse = await route(
    new Request('https://bakeagain.example/api/assistant', { method: 'GET' }),
  );
  assert.equal(methodResponse.status, 405);
  assert.equal(methodResponse.headers.get('allow'), 'POST');
  const originResponse = await route(
    request(JSON.stringify(requestBody), { origin: 'https://attacker.example' }),
  );
  assert.equal(originResponse.status, 403);
  const mediaResponse = await route(
    request(JSON.stringify(requestBody), { 'content-type': 'text/plain' }),
  );
  assert.equal(mediaResponse.status, 415);
  assert.equal(serviceReads, 0);
});

void test('enforces the streaming 16 KiB limit without trusting Content-Length', async () => {
  const service: AssistantService = {
    async respond() {
      throw new Error('must not run');
    },
  };
  const response = await handler(service)(request(`{"question":"${'x'.repeat(17 * 1024)}"}`));
  const body = (await response.json()) as Extract<AssistantResponseV1, { ok: false }>;
  assert.equal(response.status, 413);
  assert.equal(body.error.code, 'PAYLOAD_TOO_LARGE');
});

void test('maps service errors to stable localized response codes', async () => {
  const service: AssistantService = {
    async respond() {
      throw new AssistantServiceError('UPSTREAM_TIMEOUT', 504, true);
    },
  };
  const response = await handler(service)(request(JSON.stringify({ ...requestBody, locale: 'uk' })));
  const body = (await response.json()) as Extract<AssistantResponseV1, { ok: false }>;
  assert.equal(response.status, 504);
  assert.equal(body.error.code, 'UPSTREAM_TIMEOUT');
  assert.equal(body.error.retryable, true);
  assert.match(body.error.message, /[А-Яа-яІіЇїЄє]/);
});
