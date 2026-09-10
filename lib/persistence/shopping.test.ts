import assert from 'node:assert/strict';
import test from 'node:test';
import { addShoppingIngredients, readShopping, removeShoppingItem, setShoppingItemChecked } from './shopping.ts';

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
