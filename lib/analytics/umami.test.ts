import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  analyticsAllowed,
  analyticsConfig,
  getSocialClickData,
  sanitizeAnalyticsPayload,
  trackEvent,
  flushAnalyticsEvents,
} from './umami.ts';

void test('only production product routes collect analytics; DNT and internal routes are excluded', () => {
  for (const locale of ['uk', 'en', 'es']) {
    assert.equal(
      analyticsAllowed('bakeagain.com', `/${locale}/recipes/banana-bread/cook`),
      true,
    );
    assert.equal(
      analyticsAllowed(analyticsConfig.hostname, `/${locale}/drafts`),
      false,
    );
  }
  assert.equal(analyticsAllowed('localhost', '/uk'), false);
  assert.equal(analyticsAllowed('preview.example.com', '/uk'), false);
  assert.equal(
    analyticsAllowed(
      'bake-again-warm-precision.matveychuk-a.chatgpt.site',
      '/uk',
    ),
    false,
  );
  assert.equal(
    analyticsAllowed(analyticsConfig.hostname, '/design-system'),
    false,
  );
  assert.equal(analyticsAllowed(analyticsConfig.hostname, '/uk', '1'), false);
});

void test('search, hash, referring URL, page title, identity and unapproved data never leave the payload boundary', () => {
  const result = sanitizeAnalyticsPayload('event', {
    url: '/uk?q=private-search#private-note',
    title: 'private-search',
    referrer: 'https://example.com/private-path?email=private-email',
    id: 'private-user-id',
    name: 'recipe_save',
    data: {
      recipe_id: 'banana-bread',
      locale: 'uk',
      question: 'private-question',
      note: 'private-note',
      email: 'private-email',
    },
  });
  assert.ok(result);
  assert.equal(result.url, '/uk');
  assert.equal(result.referrer, 'https://example.com');
  assert.deepEqual(result.data, { recipe_id: 'banana-bread', locale: 'uk' });
  assert.equal(JSON.stringify(result).includes('private-'), false);
  assert.equal(sanitizeAnalyticsPayload('identify', { url: '/uk' }), false);
  assert.equal(
    sanitizeAnalyticsPayload('event', { url: '/uk', name: 'unapproved' }),
    false,
  );
  assert.equal(
    sanitizeAnalyticsPayload('event', { url: '/design-system' }),
    false,
  );
  assert.equal(
    sanitizeAnalyticsPayload('event', { url: 'https://elsewhere.com/uk' }),
    false,
  );
});

void test('events are queued until ready, keep the original page, and tracker failures never break actions', async () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const location = {
    hostname: analyticsConfig.hostname,
    pathname: '/uk/recipes/banana-bread',
  };
  const calls: unknown[] = [];
  const fakeWindow = { location } as unknown as Window;
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: fakeWindow,
  });
  try {
    trackEvent('recipe_save', { recipe_id: 'banana-bread' });
    location.pathname = '/uk/saved';
    fakeWindow.umami = {
      track: (update) => {
        calls.push(update({}));
      },
    };
    flushAnalyticsEvents();
    assert.deepEqual(calls, [
      {
        name: 'recipe_save',
        data: { recipe_id: 'banana-bread' },
        url: '/uk/recipes/banana-bread',
      },
    ]);
    flushAnalyticsEvents();
    assert.equal(calls.length, 1);
    fakeWindow.umami = {
      track: () => {
        throw new Error('blocked');
      },
    };
    assert.doesNotThrow(() => trackEvent('search_submit'));
    fakeWindow.umami = { track: () => Promise.reject(new Error('offline')) };
    trackEvent('search_submit');
    await new Promise((resolve) => setImmediate(resolve));
    location.hostname = 'localhost';
    fakeWindow.umami = {
      track: () => {
        assert.fail('local activity must not be sent');
      },
    };
    trackEvent('search_submit');
  } finally {
    if (original) Object.defineProperty(globalThis, 'window', original);
    else Reflect.deleteProperty(globalThis, 'window');
  }
});

void test('social profile clicks distinguish platform and placement, not confirmed follows', () => {
  for (const platform of ['instagram', 'facebook']) {
    for (const placement of ['header', 'follow', 'footer']) {
      const expected = { platform, placement, locale: 'uk' };
      assert.deepEqual(
        getSocialClickData(platform, placement, '/uk/recipes/banana-bread'),
        expected,
      );
      const payload = sanitizeAnalyticsPayload('event', {
        url: '/uk/recipes/banana-bread?scale=2#ingredients',
        name: 'social_profile_open',
        data: {
          ...expected,
          href: 'https://example.com/private',
          username: 'private-name',
          followed: true,
        },
      });
      assert.ok(payload);
      assert.deepEqual(payload.data, expected);
      assert.equal(payload.url, '/uk/recipes/banana-bread');
    }
  }
});

void test('social analytics reject unknown dimensions, non-Ukrainian and internal pages', () => {
  for (const [platform, placement, path] of [
    ['instagram', 'header', '/en'],
    ['facebook', 'follow', '/es/about'],
    ['instagram', 'footer', '/uk/drafts'],
    ['instagram', 'header', '/design-system'],
    ['other', 'header', '/uk'],
    ['instagram', 'private-value', '/uk'],
    [undefined, 'footer', '/uk'],
    ['facebook', undefined, '/uk'],
  ] as const) {
    assert.equal(getSocialClickData(platform, placement, path), null);
    assert.equal(
      sanitizeAnalyticsPayload('event', {
        url: path,
        name: 'social_profile_open',
        data: { platform, placement },
      }),
      false,
    );
  }
});

void test('private account and authentication callback pages are excluded from analytics',()=>{
 for(const locale of ['uk','es','en'])assert.equal(analyticsAllowed('bakeagain.com',`/${locale}/account`),false);
 assert.equal(sanitizeAnalyticsPayload('event',{url:'https://bakeagain.com/uk/account?code=secret-code&recovery=1'}),false);
});
