import assert from 'node:assert/strict';
import test from 'node:test';
import {
  newsletterPromptAllowed,
  newsletterQuietUntil,
} from './prompt-policy.ts';

const now = Date.UTC(2026, 9, 10);
void test('invitation dismissal suppresses repeat prompts across visits for 30 days', () => {
  assert.equal(newsletterPromptAllowed(null, now), true);
  const until = newsletterQuietUntil(now);
  assert.equal(until - now, 30 * 86_400_000);
  assert.equal(
    newsletterPromptAllowed(String(until), now + 29 * 86_400_000),
    false,
  );
  assert.equal(newsletterPromptAllowed(String(until), until), true);
});
void test('provider handoff gets a longer pause without claiming subscription', () => {
  const until = newsletterQuietUntil(now, true);
  assert.equal(until - now, 180 * 86_400_000);
  assert.equal(
    newsletterPromptAllowed(String(until), now + 31 * 86_400_000),
    false,
  );
});
void test('malformed preferences fail closed', () => {
  for (const value of ['', 'invalid', 'NaN', 'Infinity', '-1', '0', '{}']) {
    assert.equal(newsletterPromptAllowed(value, now), false, value);
  }
});
