import assert from 'node:assert/strict';
import test from 'node:test';
import { isAssistantResponseV1, parseAssistantRequest } from './schemas.ts';

const validRequest = {
  schemaVersion: 1,
  recipeId: 'gluten-free-napoleon',
  recipeVersionId: 'gluten-free-napoleon-v1-draft',
  locale: 'en',
  surface: 'recipe-detail',
  scope: { kind: 'step', stepIds: ['toast-walnuts', 'toast-almonds'] },
  configuration: { kind: 'base' },
  question: '  How do I toast the nuts?  ',
  history: [{ role: 'user', text: ' Earlier question ' }],
};

void test('parses the strict request contract and trims prose', () => {
  const result = parseAssistantRequest(validRequest);
  assert.equal(result.success, true);
  if (!result.success) return;
  assert.equal(result.data.question, 'How do I toast the nuts?');
  assert.equal(result.data.history[0]?.text, 'Earlier question');
  assert.deepEqual(result.data.scope, {
    kind: 'step',
    stepIds: ['toast-walnuts', 'toast-almonds'],
  });
});

void test('rejects unknown fields, forged status and oversized grouped scopes', () => {
  for (const request of [
    { ...validRequest, status: 'Tested' },
    { ...validRequest, configuration: { kind: 'base', status: 'Tested' } },
    { ...validRequest, scope: { kind: 'step', stepIds: ['a', 'b', 'c'] } },
    { ...validRequest, locale: 'ua' },
  ]) {
    assert.equal(parseAssistantRequest(request).success, false);
  }
});

void test('rejects non-finite or unsupported adjusted values', () => {
  for (const value of [NaN, Infinity, -1, 0]) {
    assert.equal(
      parseAssistantRequest({
        ...validRequest,
        configuration: {
          kind: 'adjusted',
          geometryId: 'round-28cm-6-layers-each',
          quantityAdjustment: {
            mode: 'useWhatIHave',
            anchorIngredientLineId: 'schar-mix-b',
            availableAmount: { value, unit: 'g' },
          },
        },
      }).success,
      false,
    );
  }
});

void test('recognizes both response envelopes', () => {
  assert.equal(
    isAssistantResponseV1({
      schemaVersion: 1,
      ok: false,
      requestId: 'request-1',
      error: {
        code: 'INVALID_REQUEST',
        message: 'Invalid.',
        retryable: false,
        retryAfterSeconds: null,
      },
    }),
    true,
  );
});

void test('validates nested response blocks, qualifications and canonical references', () => {
  const reference = {
    id: 'e1',
    recipeId: validRequest.recipeId,
    recipeVersionId: validRequest.recipeVersionId,
    field: 'summary',
  };
  const block = {
    kind: 'evidence',
    text: 'Canonical text.',
    status: 'Tested',
    qualification: null,
    references: [reference],
  };
  const response = {
    schemaVersion: 1,
    ok: true,
    requestId: 'request-1',
    recipeId: validRequest.recipeId,
    recipeVersionId: validRequest.recipeVersionId,
    locale: 'en',
    configuration: { kind: 'base' },
    outcome: 'answered',
    blocks: [block],
    proposedAction: null,
  };
  assert.equal(isAssistantResponseV1(response), true);
  for (const invalid of [
    { ...block, status: 'Unknown' },
    { ...block, status: 'Calculated' },
    { ...block, status: 'Suggested' },
    { ...block, references: [{ ...reference, recipeId: 'other-recipe' }] },
    { ...block, references: [] },
    { ...block, text: '' },
    {
      kind: 'explanation',
      text: 'Claim.',
      status: 'Tested',
      references: [reference],
    },
    { kind: 'suggestion', text: 'Idea.', status: 'Suggested', references: [] },
  ])
    assert.equal(
      isAssistantResponseV1({ ...response, blocks: [invalid] }),
      false,
    );
  assert.equal(
    isAssistantResponseV1({ ...response, outcome: 'refused' }),
    false,
  );
});
