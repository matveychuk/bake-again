import type { StorageLike } from './storage.ts';
/** Temporary cooking/UI state only. Old guest records are never read or imported. */
export function createGuestStorage(
  uiStorage?: () => StorageLike | null,
): StorageLike {
  const memory = new Map<string, string>();
  const uiKey = (key: string) =>
    key === 'bake-again:preferences:v1' ||
    key === 'bake-again:recent-recipes:v1';
  const protectedKey = (key: string) =>
    /^bake-again:(recipe-memory|shopping|bake-memory|collections):/.test(key);
  return {
    getItem: (key) =>
      protectedKey(key)
        ? null
        : uiKey(key)
          ? (uiStorage?.()?.getItem(key) ?? null)
          : (memory.get(key) ?? null),
    setItem(key, value) {
      if (protectedKey(key)) throw new Error('AUTH_REQUIRED');
      if (uiKey(key)) {
        uiStorage?.()?.setItem(key, value);
        return;
      }
      if (key.startsWith('bake-again:cook-mode:')) {
        const progress = JSON.parse(value);
        value = JSON.stringify({ ...progress, note: '', completedAt: null });
      }
      memory.set(key, value);
    },
  };
}
