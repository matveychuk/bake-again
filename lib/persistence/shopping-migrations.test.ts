import assert from 'node:assert/strict';
import test from 'node:test';
import { parseShopping, type ShoppingSourceV1 } from './shopping.ts';
const date = '2026-09-27T00:00:00.000Z';
const source = (
  configurationKey?: string,
  batchId?: string,
): ShoppingSourceV1 => ({
  recipeId: 'apple-fritters',
  recipeVersionId: 'apple-fritters-source-v1',
  ingredientLineId: 'sweetener',
  sectionId: 'batter',
  selectedIngredientId: 'sweetener',
  configurationKey,
  batchId,
});
const item = (sources: ShoppingSourceV1[]) => ({
  id: 'sweetener:as-needed',
  ingredientId: 'sweetener',
  quantity: null,
  checked: true,
  createdAt: date,
  updatedAt: date,
  sources,
});
const parse = (items: unknown[]) =>
  parseShopping(JSON.stringify({ schemaVersion: 2, updatedAt: date, items }))!;
void test('restores old sweetener amounts for base, scale, ingredient and additional batches', () => {
  for (const [key, expected] of [
    [undefined, 1],
    ['base', 1],
    ['scale:0.5', 0.5],
    ['scale:1.5', 1.5],
    ['scale:2', 2],
    ['ingredient:flour:175:g', 1.75],
  ] as const) {
    const state = parse([item([source(key)])]);
    assert.deepEqual(state.items[0].quantity, {
      kind: 'exact',
      value: expected,
      unit: 'tbsp',
    });
    assert.equal(state.items[0].checked, true);
    assert.equal(state.items[0].createdAt, date);
    assert.deepEqual(parseShopping(JSON.stringify(state)), state);
  }
  const state = parse([
    item([source('scale:2'), source('scale:2'), source('scale:2', 'second')]),
  ]);
  assert.deepEqual(state.items[0].quantity, {
    kind: 'exact',
    value: 4,
    unit: 'tbsp',
  });
  assert.equal(state.items[0].sources.length, 2);
});
void test('combines old and new rows without double counting or changing unknown recipes', () => {
  const current = {
    ...item([source('scale:2')]),
    id: 'sweetener:tbsp',
    checked: false,
    quantity: { kind: 'exact', value: 2, unit: 'tbsp' },
  };
  const state = parse([
    item([source('scale:2'), source('scale:0.5')]),
    current,
  ]);
  assert.equal(state.items.length, 1);
  assert.deepEqual(state.items[0].quantity, {
    kind: 'exact',
    value: 2.5,
    unit: 'tbsp',
  });
  assert.equal(state.items[0].checked, false);
  const unknown = item([
    { ...source(), recipeVersionId: 'unknown-v1' },
    source('unresolved'),
  ]);
  assert.deepEqual(
    parse([unknown]).items,
    JSON.parse(JSON.stringify([unknown])),
  );
});
