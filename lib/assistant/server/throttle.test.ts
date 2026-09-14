import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ASSISTANT_SESSION_REQUESTS_PER_DAY,
  ASSISTANT_SESSION_REQUESTS_PER_MINUTE,
  createMemoryAssistantThrottle,
} from './throttle.ts';

void test('enforces per-session concurrency and minute limits with stable retry seconds', () => {
  let now = 1_000_000;
  const throttle = createMemoryAssistantThrottle(() => now);
  const first = throttle.acquire('session-a', null);
  assert.equal(first.allowed, true);
  const concurrent = throttle.acquire('session-a', null);
  assert.deepEqual(concurrent, { allowed: false, retryAfterSeconds: 1 });
  if (first.allowed) first.release();

  for (let index = 1; index < ASSISTANT_SESSION_REQUESTS_PER_MINUTE; index++) {
    const lease = throttle.acquire('session-a', null);
    assert.equal(lease.allowed, true);
    if (lease.allowed) lease.release();
  }
  const limited = throttle.acquire('session-a', null);
  assert.equal(limited.allowed, false);
  if (!limited.allowed) assert.equal(limited.retryAfterSeconds, 60);

  now += 60_001;
  const recovered = throttle.acquire('session-a', null);
  assert.equal(recovered.allowed, true);
  if (recovered.allowed) recovered.release();
});

void test('enforces the daily session limit across minute windows', () => {
  let now = 2_000_000;
  const throttle = createMemoryAssistantThrottle(() => now);
  for (let index = 0; index < ASSISTANT_SESSION_REQUESTS_PER_DAY; index++) {
    const lease = throttle.acquire('session-day', null);
    assert.equal(lease.allowed, true);
    if (lease.allowed) lease.release();
    now += 60_001;
  }
  const limited = throttle.acquire('session-day', null);
  assert.equal(limited.allowed, false);
  if (!limited.allowed) assert.ok(limited.retryAfterSeconds > 0);
});

void test('Retry-After covers every exhausted window, including concurrent requests', () => {
  let now = 2_000_000;
  const start = now;
  const throttle = createMemoryAssistantThrottle(() => now);
  for (let batch = 0; batch < 6; batch++) {
    for (let index = 0; index < 5; index++) {
      const lease = throttle.acquire('combined', null);
      assert.equal(lease.allowed, true);
      if (lease.allowed && !(batch === 5 && index === 4)) lease.release();
    }
    if (batch < 5) now += 60_001;
  }
  assert.deepEqual(throttle.acquire('combined', null), {
    allowed: false,
    retryAfterSeconds: Math.ceil((start + 86_400_000 - now) / 1_000),
  });
});
