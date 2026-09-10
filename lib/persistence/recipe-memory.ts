import { isSaveableRecipeId } from '../../content/recipes/registry.ts';
import { readStorageValue, subscribeToStorageKey, writeStorageValue, type StorageLike } from './storage.ts';

export const recipeMemoryStorageKey = 'bake-again:recipe-memory:v1';

export type RecipeMemoryV1 = {
  schemaVersion: 1;
  updatedAt: string;
  savedRecipeIds: string[];
};

const emptyRecipeMemory = (): RecipeMemoryV1 => ({
  schemaVersion: 1,
  updatedAt: new Date(0).toISOString(),
  savedRecipeIds: [],
});

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

export function parseRecipeMemory(rawValue: string | null): RecipeMemoryV1 | null {
  if (!rawValue) return null;
  try {
    const value: unknown = JSON.parse(rawValue);
    if (!value || typeof value !== 'object') return null;
    const candidate = value as Record<string, unknown>;
    if (candidate.schemaVersion !== 1 || !isIsoDate(candidate.updatedAt) || !Array.isArray(candidate.savedRecipeIds)) return null;

    const savedRecipeIds = [...new Set(candidate.savedRecipeIds)]
      .filter((id): id is string => typeof id === 'string' && isSaveableRecipeId(id))
      .slice(0, 200);
    return { schemaVersion: 1, updatedAt: candidate.updatedAt, savedRecipeIds };
  } catch {
    return null;
  }
}

export function readRecipeMemory(storage?: StorageLike | null): RecipeMemoryV1 {
  return parseRecipeMemory(readStorageValue(recipeMemoryStorageKey, storage)) ?? emptyRecipeMemory();
}

export function persistRecipeMemory(
  state: RecipeMemoryV1,
  storage?: StorageLike | null,
): RecipeMemoryV1 {
  const valid = parseRecipeMemory(JSON.stringify(state)) ?? emptyRecipeMemory();
  writeStorageValue(recipeMemoryStorageKey, JSON.stringify(valid), storage);
  return valid;
}

export function toggleSavedRecipe(
  recipeId: string,
  now = new Date(),
  storage?: StorageLike | null,
): RecipeMemoryV1 {
  const state = readRecipeMemory(storage);
  if (!isSaveableRecipeId(recipeId)) return state;
  const savedRecipeIds = state.savedRecipeIds.includes(recipeId)
    ? state.savedRecipeIds.filter((id) => id !== recipeId)
    : [...state.savedRecipeIds, recipeId];
  return persistRecipeMemory({ schemaVersion: 1, updatedAt: now.toISOString(), savedRecipeIds }, storage);
}

export function subscribeToRecipeMemory(onChange: () => void): () => void {
  return subscribeToStorageKey(recipeMemoryStorageKey, onChange);
}
