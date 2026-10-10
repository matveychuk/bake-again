import assert from 'node:assert/strict';
import test from 'node:test';
import {
  readRecentRecipes,
  recordRecentRecipe,
  clearRecentRecipes,
  recentRecipesKey,
  recentRecipesLimit,
} from './recent-recipes.ts';

function memory() {
  const values = new Map<string, string>();
  return {
    values,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}
void test('recent history moves repeats to front, caps growth and excludes unpublished recipes', () => {
  const storage = memory();
  const allowed = Array.from({ length: 20 }, (_, index) => `recipe-${index}`);
  allowed.forEach((id) => recordRecentRecipe(id, allowed, storage));
  recordRecentRecipe('recipe-10', allowed, storage);
  assert.equal(recordRecentRecipe('draft', allowed, storage), false);
  const recent = readRecentRecipes(allowed, storage);
  assert.equal(recent.length, recentRecipesLimit);
  assert.equal(recent[0], 'recipe-10');
  assert.equal(new Set(recent).size, recentRecipesLimit);
  assert.ok(!recent.includes('recipe-0'));
  assert.deepEqual(readRecentRecipes(['recipe-10'], storage), ['recipe-10']);
});
void test('malformed history and unavailable storage do not break recipe reading', () => {
  const storage = memory();
  for (const value of ['broken', '{}', 'null', '12']) {
    storage.setItem(recentRecipesKey, value);
    assert.deepEqual(readRecentRecipes(['a'], storage), []);
  }
  storage.setItem(
    recentRecipesKey,
    JSON.stringify(['a', 'a', null, 2, 'removed', 'b']),
  );
  assert.deepEqual(readRecentRecipes(['a', 'b'], storage), ['a', 'b']);
  assert.equal(recordRecentRecipe('a', ['a'], null), false);
  const blocked = {
    getItem() {
      throw Error('blocked');
    },
    setItem() {
      throw Error('full');
    },
  };
  assert.deepEqual(readRecentRecipes(['a'], blocked), []);
  assert.equal(recordRecentRecipe('a', ['a'], blocked), false);
  assert.equal(clearRecentRecipes(blocked), false);
});
void test('clearing history preserves saved recipes and private notes', () => {
  const storage = memory();
  storage.setItem('private-notes', 'keep');
  recordRecentRecipe('a', ['a'], storage);
  assert.equal(clearRecentRecipes(storage), true);
  assert.deepEqual(readRecentRecipes(['a'], storage), []);
  assert.equal(storage.getItem('private-notes'), 'keep');
});
