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
