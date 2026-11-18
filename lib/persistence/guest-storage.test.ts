import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGuestStorage } from './guest-storage.ts';

void test('guest cannot read or write old personal records, even if they remain on disk', () => {
  const old = new Map([['bake-again:recipe-memory:v1', 'private']]);
  const guest = createGuestStorage(() => ({
    getItem: (k) => old.get(k) ?? null,
    setItem: (k, v) => {
      old.set(k, v);
    },
  }));
  for (const key of [
    'bake-again:recipe-memory:v1',
    'bake-again:shopping:v2',
    'bake-again:bake-memory:v1',
    'bake-again:collections:v1',
  ]) {
    assert.equal(guest.getItem(key), null);
    assert.throws(() => guest.setItem(key, 'data'), /AUTH_REQUIRED/);
  }
  assert.equal(old.get('bake-again:recipe-memory:v1'), 'private');
});
void test('guest cooking progress is ephemeral and contains no saved note or bake record', () => {
  const guest = createGuestStorage();
  const key = 'bake-again:cook-mode:v1:recipe:v1';
  guest.setItem(
    key,
    JSON.stringify({
      currentStepId: 'mix',
      note: 'private draft',
      completedAt: '2026-10-10',
    }),
  );
  assert.deepEqual(JSON.parse(guest.getItem(key)!), {
    currentStepId: 'mix',
    note: '',
    completedAt: null,
  });
  assert.equal(createGuestStorage().getItem(key), null);
});
void test('language and recent-history preferences remain independent of personal saves', () => {
  const data = new Map<string, string>();
  const guest = createGuestStorage(() => ({
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => {
      data.set(k, v);
    },
  }));
  guest.setItem('bake-again:preferences:v1', 'uk');
  assert.equal(data.get('bake-again:preferences:v1'), 'uk');
});

void test('guest navigation keeps cooking progress in this tab, without private notes or bake history', () => {
  const values = new Map<string, string>();
  const tab = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
  const firstPage = createGuestStorage(undefined, () => tab);
  const key = 'bake-again:cook-mode:v1:crepes:v1:adjusted';
  firstPage.setItem(
    key,
    JSON.stringify({
      currentStepId: 'rest',
      completedStepIds: ['mix'],
      timer: { stepId: 'rest', endAt: '2026-11-18T10:15:00Z' },
      note: 'private',
      completedAt: '2026-11-18T10:00:00Z',
    }),
  );
  const nextPage = createGuestStorage(undefined, () => tab);
  assert.deepEqual(JSON.parse(nextPage.getItem(key)!), {
    currentStepId: 'rest',
    completedStepIds: ['mix'],
    timer: { stepId: 'rest', endAt: '2026-11-18T10:15:00Z' },
    note: '',
    completedAt: null,
  });
  assert.equal(createGuestStorage().getItem(key), null);
  assert.equal(nextPage.getItem('bake-again:recipe-memory:v1'), null);
  assert.equal(values.size, 1);
});

void test('blocked tab storage falls back to the current page memory', () => {
  const guest = createGuestStorage(undefined, () => {
    throw new Error('BLOCKED');
  });
  const key = 'bake-again:cook-mode:v1:crepes:v1';
  guest.setItem(key, JSON.stringify({ currentStepId: 'mix', note: '' }));
  assert.equal(JSON.parse(guest.getItem(key)!).currentStepId, 'mix');
});
