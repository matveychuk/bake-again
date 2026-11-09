import assert from 'node:assert/strict';
import { test } from 'node:test';
import { GET } from '../../app/api/analytics/umami/[mode]/route.ts';
import { flushAnalyticsEvents, trackEvent } from './umami.ts';

void test('the service link sets and clears a browser preference before opening the homepage', async () => {
  const request = (mode: string, method = 'GET') =>
    GET(new Request(`https://bakeagain.com/api/analytics/umami/${mode}`, { method }), {
      params: Promise.resolve({ mode }),
    });
  const off = await request('off');
  assert.equal(off.status, 303);
  assert.equal(off.headers.get('location'), '/uk');
  assert.match(off.headers.get('cache-control') ?? '', /no-store/);
  assert.equal(
    off.headers.get('set-cookie'),
    '__Host-ba-umami-opt-out=1; Max-Age=31536000; Path=/; Secure; SameSite=Lax',
  );
  const on = await request('on');
  assert.equal(on.status, 303);
  assert.match(on.headers.get('set-cookie') ?? '', /^__Host-ba-umami-opt-out=; Max-Age=0; Path=\//);
  assert.equal((await request('off', 'HEAD')).headers.get('set-cookie'), null);
  const unknown = await request('unknown');
  assert.equal(unknown.status, 404);
  assert.equal(unknown.headers.get('set-cookie'), null);
});

void test('activating the preference discards queued events and suppresses consent events', (t) => {
  const doc = { cookie: '' };
  const browser: Partial<Window> = {
    location: new URL('https://bakeagain.com/uk/urok/napoleon') as unknown as Location,
  };
  const sent: unknown[] = [];
  for (const [key, value] of Object.entries({ document: doc, window: browser })) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    t.after(() => {
      if (previous) Object.defineProperty(globalThis, key, previous);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
  trackEvent('cookie_consent_accept');
  doc.cookie = 'another_cookie=1; __Host-ba-umami-opt-out=1';
  browser.umami = { track: (update) => { sent.push(update({}).name); } };
  flushAnalyticsEvents();
  trackEvent('cookie_consent_decline');
  assert.deepEqual(sent, []);

  doc.cookie = 'another_cookie=1';
  trackEvent('cookie_consent_decline');
  assert.deepEqual(sent, ['cookie_consent_decline']);
});
