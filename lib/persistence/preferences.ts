import { isAppLocale, type AppLocale } from '../i18n/config.ts';
import {
  getBrowserStorage,
  readStorageValue,
  subscribeToStorageKey,
  writeStorageValue,
  type StorageLike,
} from './storage.ts';

export const preferencesStorageKey = 'bake-again:preferences:v1';
export const localeCookieName = 'ba_locale';
const oneYearInSeconds = 60 * 60 * 24 * 365;

export type PreferencesV1 = {
  schemaVersion: 1;
  locale: AppLocale;
  localeSource: 'user';
  updatedAt: string;
};

type PreferencesEnvironment = {
  storage?: StorageLike | null;
  cookieWriter?: (serializedCookie: string) => void;
  now?: () => Date;
};

export function parsePreferences(rawValue: string | null): PreferencesV1 | null {
  if (!rawValue) return null;

  try {
    const value: unknown = JSON.parse(rawValue);
    if (
      !value ||
      typeof value !== 'object' ||
      !('schemaVersion' in value) ||
      !('locale' in value) ||
      !('localeSource' in value) ||
      !('updatedAt' in value)
    ) {
      return null;
    }

    const candidate = value as Record<string, unknown>;
    const locale = typeof candidate.locale === 'string' ? candidate.locale : null;
    if (
      candidate.schemaVersion !== 1 ||
      !isAppLocale(locale) ||
      candidate.localeSource !== 'user' ||
      typeof candidate.updatedAt !== 'string'
    ) {
      return null;
    }

    return {
      schemaVersion: 1,
      locale,
      localeSource: 'user',
      updatedAt: candidate.updatedAt,
    };
  } catch {
    return null;
  }
}

export function readLocalePreference(storage: StorageLike | null | undefined): PreferencesV1 | null {
  return parsePreferences(readStorageValue(preferencesStorageKey, storage));
}

export function serializeLocaleCookie(locale: AppLocale, isSecure = false): string {
  return [
    `${localeCookieName}=${encodeURIComponent(locale)}`,
    'Path=/',
    `Max-Age=${oneYearInSeconds}`,
    'SameSite=Lax',
    ...(isSecure ? ['Secure'] : []),
  ].join('; ');
}

function writeBrowserCookie(serializedCookie: string): void {
  if (typeof document !== 'undefined') document.cookie = serializedCookie;
}

export function persistLocalePreference(
  locale: AppLocale,
  environment: PreferencesEnvironment = {},
): PreferencesV1 {
  const preference: PreferencesV1 = {
    schemaVersion: 1,
    locale,
    localeSource: 'user',
    updatedAt: (environment.now ?? (() => new Date()))().toISOString(),
  };

  const storage = environment.storage ?? getBrowserStorage();
  writeStorageValue(preferencesStorageKey, JSON.stringify(preference), storage);

  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  (environment.cookieWriter ?? writeBrowserCookie)(serializeLocaleCookie(locale, isSecure));

  return preference;
}

export function subscribeToLocalePreference(onChange: () => void): () => void {
  return subscribeToStorageKey(preferencesStorageKey, onChange);
}
