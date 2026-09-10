export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

const changeEventName = 'bake-again:persistence-change';

export function getBrowserStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readStorageValue(key: string, storage = getBrowserStorage()): string | null {
  if (!storage) return null;

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorageValue(
  key: string,
  value: string,
  storage = getBrowserStorage(),
): boolean {
  if (!storage) return false;

  try {
    storage.setItem(key, value);
  } catch {
    return false;
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(changeEventName, { detail: key }));
  }
  return true;
}

export function subscribeToStorageKey(key: string, onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key === key) onChange();
  };
  const handleLocalChange = (event: Event) => {
    if (event instanceof CustomEvent && event.detail === key) onChange();
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(changeEventName, handleLocalChange);
  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(changeEventName, handleLocalChange);
  };
}
