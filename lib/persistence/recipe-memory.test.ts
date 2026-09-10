import assert from 'node:assert/strict';
import test from 'node:test';
import { parseRecipeMemory, readRecipeMemory, recipeMemoryStorageKey, toggleSavedRecipe } from './recipe-memory.ts';

class MemoryStorage {
  readonly values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

void test('keeps stable recipe IDs and preserves save order', () => {
  const storage = new MemoryStorage();
  toggleSavedRecipe('banana-bread', new Date('2026-09-09T10:00:00.000Z'), storage);
  toggleSavedRecipe('gluten-free-napoleon', new Date('2026-09-09T10:01:00.000Z'), storage);
  assert.deepEqual(readRecipeMemory(storage).savedRecipeIds, ['banana-bread', 'gluten-free-napoleon']);
  toggleSavedRecipe('banana-bread', new Date('2026-09-09T10:02:00.000Z'), storage);
  assert.deepEqual(readRecipeMemory(storage).savedRecipeIds, ['gluten-free-napoleon']);
  assert.equal(storage.values.has(recipeMemoryStorageKey), true);
});

void test('rejects malformed state and drops unknown saved recipe IDs', () => {
  assert.equal(parseRecipeMemory('{not-json'), null);
  assert.deepEqual(
    parseRecipeMemory('{"schemaVersion":1,"updatedAt":"2026-09-09T00:00:00.000Z","savedRecipeIds":["unknown","crinkle-cookies","crinkle-cookies"]}')?.savedRecipeIds,
    ['crinkle-cookies'],
  );
});
