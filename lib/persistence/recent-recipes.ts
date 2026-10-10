import {
  getBrowserStorage,
  readStorageValue,
  writeStorageValue,
  type StorageLike,
} from './storage.ts';

export const recentRecipesKey = 'bake-again:recent-recipes:v1';
export const recentRecipesLimit = 12;

/** Canonical IDs only: no queries, notes, titles or browsing timestamps. */
export function readRecentRecipes(
  allowedIds: readonly string[],
  storage: StorageLike | null = getBrowserStorage(),
): string[] {
  try {
    const raw: unknown = JSON.parse(
      readStorageValue(recentRecipesKey, storage) ?? '[]',
    );
    if (!Array.isArray(raw)) return [];
    const allowed = new Set(allowedIds);
    return [
      ...new Set(
        raw.filter(
          (id): id is string => typeof id === 'string' && allowed.has(id),
        ),
      ),
    ].slice(0, recentRecipesLimit);
  } catch {
    return [];
  }
}

export function recordRecentRecipe(
  id: string,
  allowedIds: readonly string[],
  storage: StorageLike | null = getBrowserStorage(),
): boolean {
  if (!allowedIds.includes(id)) return false;
  const recent = readRecentRecipes(allowedIds, storage);
  const next = [id, ...recent.filter((entry) => entry !== id)].slice(
    0,
    recentRecipesLimit,
  );
  return writeStorageValue(recentRecipesKey, JSON.stringify(next), storage);
}

export function clearRecentRecipes(
  storage: StorageLike | null = getBrowserStorage(),
): boolean {
  return writeStorageValue(recentRecipesKey, '[]', storage);
}
