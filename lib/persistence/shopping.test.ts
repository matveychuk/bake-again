import assert from 'node:assert/strict';
import test from 'node:test';
import { addShoppingIngredients, clearShopping, readShopping, removeCheckedShoppingItems, removeShoppingItem, restoreShoppingItem, setShoppingItemChecked } from './shopping.ts';

class MemoryStorage {
  readonly values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

const butter = (recipeId: string, line: string, amount: number) => ({
  ingredientId: 'butter',
  quantity: { kind: 'exact' as const, value: amount, unit: 'g' as const },
  source: { recipeId, recipeVersionId: `${recipeId}-v1`, ingredientLineId: line, sectionId: 'base', selectedIngredientId: 'butter' },
});

void test('merges compatible quantities, retains sources, and does not add a source twice', () => {
  const storage = new MemoryStorage();
  const now = new Date('2026-09-09T10:00:00.000Z');
  addShoppingIngredients([butter('crinkle-cookies', 'butter', 60)], now, storage);
  addShoppingIngredients([butter('gluten-free-napoleon', 'butter-dough', 120)], now, storage);
  addShoppingIngredients([butter('crinkle-cookies', 'butter', 60)], now, storage);
  const item = readShopping(storage).items[0];
  assert.deepEqual(item.quantity, { kind: 'exact', value: 180, unit: 'g' });
  assert.equal(item.sources.length, 2);
});

void test('a merged checked item becomes unchecked and can be removed', () => {
  const storage = new MemoryStorage();
  const now = new Date('2026-09-09T10:00:00.000Z');
  addShoppingIngredients([butter('crinkle-cookies', 'butter', 60)], now, storage);
  setShoppingItemChecked('butter:g', true, now, storage);
  addShoppingIngredients([butter('gluten-free-napoleon', 'butter-dough', 120)], now, storage);
  assert.equal(readShopping(storage).items[0].checked, false);
  removeShoppingItem('butter:g', now, storage);
  assert.equal(readShopping(storage).items.length, 0);
});

void test('keeps name-only items unquantified and rounds discrete shopping bases up', () => {
  const storage = new MemoryStorage();
  const source = { recipeId: 'crepes', recipeVersionId: 'crepes-source-v1', ingredientLineId: 'eggs', sectionId: 'batter', selectedIngredientId: 'eggs' };
  addShoppingIngredients([{ ingredientId: 'eggs', quantity: { kind: 'exact', value: 2.5, unit: 'piece' }, shopping: { mode: 'base', increment: 1, rounding: 'up' }, source }], new Date('2026-09-09T10:00:00.000Z'), storage);
  addShoppingIngredients([{ ingredientId: 'salt', quantity: null, shopping: { mode: 'nameOnly' }, source: { ...source, ingredientLineId: 'salt', selectedIngredientId: 'salt' } }], new Date('2026-09-09T10:00:00.000Z'), storage);
  assert.deepEqual(readShopping(storage).items.find((item) => item.ingredientId === 'eggs')?.quantity, { kind: 'exact', value: 3, unit: 'piece' });
  assert.equal(readShopping(storage).items.find((item) => item.ingredientId === 'salt')?.quantity, null);
});

void test('adds another recipe batch only when its source has an explicit batch id', () => {
  const storage = new MemoryStorage();
  const now = new Date('2026-09-09T10:00:00.000Z');
  addShoppingIngredients([butter('crinkle-cookies', 'butter', 60)], now, storage);
  addShoppingIngredients([butter('crinkle-cookies', 'butter', 60)], now, storage);
  addShoppingIngredients([{ ...butter('crinkle-cookies', 'butter', 60), source: { ...butter('crinkle-cookies', 'butter', 60).source, batchId: 'batch-2' } }], now, storage);
  assert.deepEqual(readShopping(storage).items[0].quantity, { kind: 'exact', value: 120, unit: 'g' });
  assert.equal(readShopping(storage).items[0].sources.length, 2);
});

void test('removes bought items, restores one item, and clears only on request', () => {
  const storage = new MemoryStorage();
  const now = new Date('2026-09-09T10:00:00.000Z');
  addShoppingIngredients([butter('crinkle-cookies', 'butter', 60), butter('gluten-free-napoleon', 'butter-dough', 120)], now, storage);
  const item = readShopping(storage).items[0];
  setShoppingItemChecked(item.id, true, now, storage);
  assert.equal(removeCheckedShoppingItems(now, storage).items.length, 0);
  assert.equal(restoreShoppingItem(item, now, storage).items.length, 1);
  assert.equal(clearShopping(now, storage).items.length, 0);
});
