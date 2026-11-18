import type { StorageLike } from './storage.ts';
/** Temporary cooking/UI state only. Old guest records are never read or imported. */
export function createGuestStorage(
  uiStorage?: () => StorageLike | null,
  cookStorage?: () => StorageLike | null,
): StorageLike {
  const memory = new Map<string, string>();
  const uiKey = (key: string) =>
    key === 'bake-again:preferences:v1' ||
    key === 'bake-again:recent-recipes:v1';
  const protectedKey = (key: string) =>
    /^bake-again:(recipe-memory|shopping|bake-memory|collections):/.test(key);
  const cookKey = (key: string) => key.startsWith('bake-again:cook-mode:');
  const sessionKey = (key: string) => `bake-again:guest-session:${key}`;
  function readCookProgress(key: string) {
    try {
      return (
        cookStorage?.()?.getItem(sessionKey(key)) ?? memory.get(key) ?? null
      );
    } catch {
      return memory.get(key) ?? null;
    }
  }
  return {
    getItem: (key) =>
      protectedKey(key)
        ? null
        : uiKey(key)
          ? (uiStorage?.()?.getItem(key) ?? null)
          : cookKey(key)
            ? readCookProgress(key)
            : (memory.get(key) ?? null),
    setItem(key, value) {
      if (protectedKey(key)) throw new Error('AUTH_REQUIRED');
      if (uiKey(key)) {
        uiStorage?.()?.setItem(key, value);
        return;
      }
      if (cookKey(key)) {
        const progress = JSON.parse(value);
        value = JSON.stringify({ ...progress, note: '', completedAt: null });
        try {
          cookStorage?.()?.setItem(sessionKey(key), value);
        } catch {
          // Restricted browser storage still permits cooking on the current page.
        }
      }
      memory.set(key, value);
    },
  };
}
