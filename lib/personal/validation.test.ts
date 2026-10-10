import assert from 'node:assert/strict';
import test from 'node:test';
import { parsePersonalData, personalRecordKey } from './validation.ts';
import { bakeConfigurationKey } from '../persistence/bake-memory.ts';
import type { PersonalDataV1 } from './contracts.ts';

const date = '2026-10-09T12:00:00.000Z';
const reference = {
  recipeId: 'gluten-free-napoleon',
  recipeVersionId: 'gluten-free-napoleon-v2',
  configuration: { kind: 'base' as const },
};
export const examples: PersonalDataV1[] = [
  { kind: 'saved-recipe', payload: { recipeId: reference.recipeId } },
  {
    kind: 'recipe-note',
    payload: {
      ...reference,
      text: 'Наступного разу — тонші коржі. Próxima vez. Next time.',
    },
  },
  {
    kind: 'bake-record',
    payload: {
      ...reference,
      note: 'Добре',
      noteUpdatedAt: date,
      completedAt: date,
    },
  },
  {
    kind: 'collection',
    payload: {
      id: 'weekend',
      name: 'На вихідні / Fin de semana',
      recipeIds: [reference.recipeId],
    },
  },
  {
    kind: 'shopping-item',
    payload: {
      id: 'flour:g',
      ingredientId: 'flour',
      quantity: { kind: 'exact', value: 250, unit: 'g' },
      checked: false,
      createdAt: date,
      updatedAt: date,
      sources: [
        {
          recipeId: reference.recipeId,
          recipeVersionId: reference.recipeVersionId,
          ingredientLineId: 'flour',
          sectionId: 'dough',
          selectedIngredientId: 'flour',
          configurationKey: 'base',
        },
      ],
    },
  },
];

void test('all personal domains round-trip multilingual data without adding provenance', () => {
  for (const data of examples)
    assert.deepEqual(parsePersonalData(data.kind, data.payload), data);
});
void test('personal payloads reject inherited Tested, email, consent and purchase fields', () => {
  for (const data of examples)
    for (const key of [
      'status',
      'email',
      'marketingConsent',
      'purchased',
      'accountId',
    ])
      assert.equal(
        parsePersonalData(data.kind, { ...data.payload, [key]: 'not-allowed' }),
        null,
      );
  assert.equal(parsePersonalData('purchase', {}), null);
});
void test('version/configuration keys do not collapse adjusted notes into tested base or other versions', () => {
  const base = {
    kind: 'recipe-note' as const,
    payload: { ...reference, text: '' },
  };
  const adjusted = {
    kind: 'adjusted' as const,
    geometryId: 'round-20',
    quantityAdjustment: { mode: 'batchScale' as const, factor: 2 as const },
  };
  assert.notEqual(
    personalRecordKey(base),
    personalRecordKey({
      ...base,
      payload: { ...base.payload, configuration: adjusted },
    }),
  );
  assert.notEqual(
    personalRecordKey(base),
    personalRecordKey({
      ...base,
      payload: { ...base.payload, recipeVersionId: 'v3' },
    }),
  );
  assert.equal(
    personalRecordKey({
      ...base,
      payload: { ...base.payload, configuration: adjusted },
    }),
    personalRecordKey({
      ...base,
      payload: {
        ...base.payload,
        configuration: {
          quantityAdjustment: adjusted.quantityAdjustment,
          geometryId: 'round-20',
          kind: 'adjusted',
        },
      },
    }),
  );
  assert.equal(bakeConfigurationKey(adjusted), 'adjusted:round-20:batch:2');
});
void test('reject invalid configuration, unknown fields and oversized/invalid content instead of truncating', () => {
  const note = { ...reference, text: '' };
  for (const configuration of [
    { kind: 'base', status: 'Tested' },
    { kind: 'adjusted' },
    { kind: 'suggested' },
  ])
    assert.equal(
      parsePersonalData('recipe-note', { ...note, configuration }),
      null,
    );
  for (const text of ['x'.repeat(2001), '\0'])
    assert.equal(parsePersonalData('recipe-note', { ...note, text }), null);
  assert.equal(
    parsePersonalData('collection', { id: 'a', name: '  ', recipeIds: [] }),
    null,
  );
  assert.equal(
    parsePersonalData('collection', {
      id: 'a',
      name: 'List',
      recipeIds: ['a', 'a'],
    }),
    null,
  );
  assert.equal(
    parsePersonalData('bake-record', {
      ...reference,
      note: '',
      completedAt: 'yesterday',
      noteUpdatedAt: date,
    }),
    null,
  );
});
void test('shopping uses base quantities, bounded sources and existing batch/configuration identity', () => {
  const data = examples.find((d) => d.kind === 'shopping-item')!;
  assert.equal(
    parsePersonalData(data.kind, {
      ...data.payload,
      equivalent: { value: 5, unit: 'tbsp' },
    }),
    null,
  );
  assert.equal(
    parsePersonalData(data.kind, {
      ...data.payload,
      quantity: { kind: 'exact', value: Infinity, unit: 'g' },
    }),
    null,
  );
  assert.equal(
    parsePersonalData(data.kind, {
      ...data.payload,
      sources: Array(101).fill(data.payload.sources[0]),
    }),
    null,
  );
  assert.ok(
    parsePersonalData(data.kind, {
      ...data.payload,
      sources: [
        {
          ...data.payload.sources[0],
          batchId: 'batch-2',
          configurationKey: 'adjusted:round-20:batch:2',
        },
      ],
    }),
  );
});
