import assert from 'node:assert/strict';
import test from 'node:test';
import {
  cookModeStorageKey,
  parseCookModeSession,
  persistCookModeSession,
  readCookModeSession,
  type CookModeSessionV1,
} from './cook-mode.ts';

class MemoryStorage {
  readonly values = new Map<string, string>();
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

void test('persists position, completed source IDs, timer and private note', () => {
  const storage = new MemoryStorage();
  const session: CookModeSessionV1 = {
    schemaVersion: 1,
    recipeId: 'crepes',
    recipeVersionId: 'crepes-source-v1',
    updatedAt: '2026-09-16T10:00:00.000Z',
    currentStepId: 'add-milk',
    completedStepIds: ['start-batter'],
    timer: {
      stepId: 'rest',
      durationSeconds: 900,
      remainingSeconds: 900,
      endAt: '2026-09-16T10:15:00.000Z',
    },
    completedAt: null,
    note: 'Thin the next batch slightly less.',
  };
  persistCookModeSession(session, storage);
  assert.deepEqual(
    readCookModeSession('crepes', 'crepes-source-v1', storage),
    session,
  );
});

void test('rejects malformed sessions and limits note length', () => {
  assert.equal(parseCookModeSession('{not-json'), null);
  const parsed = parseCookModeSession(
    JSON.stringify({
      schemaVersion: 1,
      recipeId: 'crepes',
      recipeVersionId: 'crepes-source-v1',
      updatedAt: '2026-09-16T10:00:00.000Z',
      currentStepId: 'start-batter',
      completedStepIds: [],
      timer: null,
      completedAt: null,
      note: 'x'.repeat(2200),
    }),
  );
  assert.equal(parsed?.note.length, 2000);
});

void test('keeps adjusted configurations in separate session keys', () => {
  assert.equal(
    cookModeStorageKey('napoleon', 'v1'),
    'bake-again:cook-mode:v1:napoleon:v1',
  );
  assert.notEqual(
    cookModeStorageKey('napoleon', 'v1', 'adjusted:round-24:batch:0.5'),
    cookModeStorageKey('napoleon', 'v1'),
  );
});
