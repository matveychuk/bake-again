import assert from 'node:assert/strict';
import test from 'node:test';
import { glutenFreeNapoleonRecipe as recipe } from '../../../../../content/recipes/gluten-free-napoleon.recipe.ts';
import {
  createActionProposal,
  resolveActionReview,
} from '../../../../../lib/assistant/actions.ts';
import type { AssistantRequestV1 } from '../../../../../lib/assistant/contracts.ts';
import { createActionReviewHandler } from './route.ts';

const input: AssistantRequestV1 = {
  schemaVersion: 1,
  recipeId: recipe.id,
  recipeVersionId: recipe.versionId,
  locale: 'uk',
  surface: 'recipe-detail',
  scope: { kind: 'flour' },
  configuration: { kind: 'base' },
  question: 'Додай',
  history: [],
};
const proposal = createActionProposal(
  input,
  'add-shopping-items',
  'route-action',
);
const payload = { proposal, choices: {}, phase: 'review' };
const makeRequest = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('https://bakeagain.example/api/assistant/actions/review', {
    method: 'POST',
    headers: {
      origin: 'https://bakeagain.example',
      'content-type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });

void test('review and confirmation revalidate without model calls or persistence writes', async () => {
  let checks = 0;
  const handler = createActionReviewHandler(async () => {
    checks++;
    return true;
  });
  for (const phase of ['review', 'confirm']) {
    const response = await handler(makeRequest({ ...payload, phase }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await response.json(), {
      ok: true,
      review: resolveActionReview(proposal, {}, phase === 'confirm'),
    });
  }
  assert.equal(checks, 2);
});

void test('server rejects forged quantities, ingredient IDs, provenance, config and stale versions', async () => {
  const handler = createActionReviewHandler(async () => true);
  for (const forged of [
    { ...proposal, quantities: [{ value: 123 }] },
    { ...proposal, status: 'Tested' },
    { ...proposal, ingredientLineIds: ['forged'] },
    {
      ...proposal,
      context: {
        ...proposal.context,
        configuration: {
          kind: 'adjusted',
          geometryId: recipe.geometry.default.id,
          quantityAdjustment: { mode: 'batchScale', factor: 9 },
        },
      },
    },
  ])
    assert.equal(
      (await handler(makeRequest({ ...payload, proposal: forged }))).status,
      400,
    );
  const response = await handler(
    makeRequest({
      ...payload,
      proposal: {
        ...proposal,
        context: { ...proposal.context, recipeVersionId: 'stale' },
      },
    }),
  );
  assert.equal(response.status, 409);
  assert.deepEqual(await response.json(), { ok: false, code: 'STALE_RECIPE' });
});

void test('release gate, method, origin, media type and bounded body apply to action review', async () => {
  const handler = createActionReviewHandler(async () => false);
  assert.equal((await handler(makeRequest(payload))).status, 403);
  assert.equal(
    (
      await handler(
        makeRequest(payload, { origin: 'https://attacker.example' }),
      )
    ).status,
    403,
  );
  assert.equal(
    (await handler(makeRequest(payload, { 'content-type': 'text/plain' })))
      .status,
    415,
  );
  assert.equal(
    (await handler(makeRequest({ ...payload, padding: 'x'.repeat(17000) })))
      .status,
    413,
  );
  assert.equal(
    (
      await handler(
        new Request('https://bakeagain.example/api/assistant/actions/review'),
      )
    ).status,
    405,
  );
});
