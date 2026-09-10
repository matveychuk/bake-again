import assert from 'node:assert/strict';
import test from 'node:test';
import {
  localeCookieName,
  parsePreferences,
  persistLocalePreference,
  preferencesStorageKey,
  readLocalePreference,
  serializeLocaleCookie,
} from './preferences.ts';

class MemoryStorage {
  readonly values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

void test('accepts only a valid version-one explicit locale preference', () => {
  assert.deepEqual(
    parsePreferences('{"schemaVersion":1,"locale":"uk","localeSource":"user","updatedAt":"2026-09-09T00:00:00.000Z"}'),
    {
      schemaVersion: 1,
      locale: 'uk',
      localeSource: 'user',
      updatedAt: '2026-09-09T00:00:00.000Z',
    },
  );
  assert.equal(parsePreferences('{"schemaVersion":1,"locale":"ua"}'), null);
  assert.equal(parsePreferences('{not-json'), null);
});

void test('persists a user choice and mirrors the locale in the functional cookie', () => {
  const storage = new MemoryStorage();
  let writtenCookie = '';

  persistLocalePreference('es', {
    storage,
    cookieWriter: (value) => {
      writtenCookie = value;
    },
    now: () => new Date('2026-09-09T12:00:00.000Z'),
  });

  assert.deepEqual(readLocalePreference(storage), {
    schemaVersion: 1,
    locale: 'es',
    localeSource: 'user',
    updatedAt: '2026-09-09T12:00:00.000Z',
  });
  assert.equal(storage.values.has(preferencesStorageKey), true);
  assert.match(writtenCookie, new RegExp(`^${localeCookieName}=es; Path=/;`));
});

void test('serializes the production cookie with the expected functional attributes', () => {
  assert.equal(
    serializeLocaleCookie('uk', true),
    'ba_locale=uk; Path=/; Max-Age=31536000; SameSite=Lax; Secure',
  );
});
