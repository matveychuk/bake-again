import assert from 'node:assert/strict';
import test from 'node:test';
import {
  cookModeStorageKey,
  parseCookModeSession,
  persistCookModeSession,
  readCookModeSession,
  resolveCookModeEntry,
  cookStepHref,
  cookEntrySearch,
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

void test('direct entry into a grouped step preserves saved progress, timer and note', () => {
  const storage = new MemoryStorage();
  const saved: CookModeSessionV1 = {
    schemaVersion: 1,
    recipeId: 'crepes',
    recipeVersionId: 'v1',
    updatedAt: '2026-11-18T10:00:00.000Z',
    currentStepId: 'mix',
    completedStepIds: ['prepare'],
    timer: {
      stepId: 'rest',
      durationSeconds: 900,
      remainingSeconds: 600,
      endAt: '2026-11-18T10:10:00.000Z',
    },
    completedAt: null,
    note: 'Keep this note.',
  };
  const configurationKey = 'adjusted:batch:1.5';
  persistCookModeSession(saved, storage, configurationKey);
  const restored = readCookModeSession(
    'crepes',
    'v1',
    storage,
    configurationKey,
  )!;
  const steps = [
    { stepIds: ['prepare', 'mix'] },
    { stepIds: ['rest'] },
    { stepIds: ['fry', 'flip'] },
  ];
  const entry = resolveCookModeEntry(steps, 'flip', restored);
  assert.deepEqual(entry, { stepIndex: 2, showCompletion: false });
  persistCookModeSession(
    { ...restored, currentStepId: steps[entry.stepIndex].stepIds[0] },
    storage,
    configurationKey,
  );
  assert.deepEqual(
    readCookModeSession('crepes', 'v1', storage, configurationKey),
    { ...saved, currentStepId: 'fry' },
  );
  assert.equal(readCookModeSession('crepes', 'v1', storage), null);
});

void test('missing or unknown step resumes progress, while a finished recipe can be revisited', () => {
  const steps = [{ stepIds: ['mix'] }, { stepIds: ['rest', 'thin'] }];
  const saved = {
    currentStepId: 'thin',
    completedAt: '2026-11-18T10:00:00.000Z',
  };
  for (const requested of [null, '', 'old-step']) {
    assert.deepEqual(resolveCookModeEntry(steps, requested, saved), {
      stepIndex: 1,
      showCompletion: true,
    });
  }
  assert.deepEqual(resolveCookModeEntry(steps, 'mix', saved), {
    stepIndex: 0,
    showCompletion: false,
  });
  assert.equal(saved.completedAt, '2026-11-18T10:00:00.000Z');
  assert.deepEqual(resolveCookModeEntry(steps, 'thin', null), {
    stepIndex: 1,
    showCompletion: false,
  });
  assert.deepEqual(resolveCookModeEntry(steps, 'invalid', null), {
    stepIndex: 0,
    showCompletion: false,
  });
});

void test('step links retain quantities and cream, but return URLs do not carry step selection', () => {
  const source =
    '/uk/recipes/napoleon/cook?mode=anchor&amount=300&scale=1.5&cream=vanilla&geometry=round&diameter=24';
  const href = cookStepHref(source, 'cream:mix');
  const params = new URL(href, 'https://bakeagain.com').searchParams;
  assert.equal(params.get('step'), 'cream:mix');
  const entry = cookEntrySearch(params.toString());
  assert.equal(entry.requestedStepId, 'cream:mix');
  assert.equal(`/uk/recipes/napoleon/cook${entry.configurationSearch}`, source);
  assert.equal(
    cookStepHref('/en/recipes/crepes/cook', 'rest'),
    '/en/recipes/crepes/cook?step=rest',
  );
  assert.equal(
    cookStepHref('/es/recipes/crepes/cook?step=mix', 'rest'),
    '/es/recipes/crepes/cook?step=rest',
  );
  assert.deepEqual(cookEntrySearch('?step=rest'), {
    requestedStepId: 'rest',
    configurationSearch: '',
  });
});
