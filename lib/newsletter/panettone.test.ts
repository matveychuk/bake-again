import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { panettoneIsActive } from '../../content/articles/psyllium.ts';
import { deliveryStore, type DeliveryDatabase } from './delivery-store.ts';
import {
  createPanettoneService,
  createPancakesService,
  pancakesListId,
  parsePancakesRequest,
  panettoneListId,
  parsePanettoneRequest,
} from './panettone.ts';
import { brevoApi, type BrevoContact } from './brevo-api.ts';
import { sanitizeAnalyticsPayload } from '../analytics/umami.ts';
import { metaAllowed, metaLeadEvent } from '../analytics/meta-policy.ts';
import { verifyRecipeChallenge } from './delivery-runtime.ts';

void test('campaign expires after December 10 in Kyiv and is Ukrainian only', () => {
  assert.equal(panettoneIsActive('uk', new Date('2026-12-10T21:59:59Z')), true);
  assert.equal(
    panettoneIsActive('uk', new Date('2026-12-10T22:00:00Z')),
    false,
  );
  for (const locale of ['es', 'en'])
    assert.equal(panettoneIsActive(locale, new Date('2026-11-16')), false);
  assert.equal(panettoneListId({}), 13);
  for (const id of ['', '3', '-1', 'NaN', '4.5'])
    assert.equal(panettoneListId({ BREVO_PANETTONE_LIST_ID: id }), null);
  assert.equal(panettoneListId({ BREVO_PANETTONE_LIST_ID: '99' }), 99);
});

void test('input validation keeps source and rejects unsafe submissions', () => {
  const body = {
    email: ' Reader+Panettone@gmail.com ',
    token: 'challenge',
    consent: true,
  };
  assert.deepEqual(parsePanettoneRequest(body), {
    email: 'reader+panettone@gmail.com',
    token: 'challenge',
    source: 'direct',
    signupPage: 'blog-psyllium',
  });
  assert.equal(
    parsePanettoneRequest({ ...body, source: 'ig-bot-panettone' }).source,
    'ig-bot-panettone',
  );
  for (const extra of [
    { email: 'bad' },
    { consent: false },
    { website: 'bot' },
    { articlePath: '/unrelated' },
    { token: '' },
    { source: 'x'.repeat(201) },
    { source: 'bad\nsource' },
  ])
    assert.throws(() => parsePanettoneRequest({ ...body, ...extra }));
});

function fixture() {
  const db = new DatabaseSync(':memory:');
  for (const file of ['0002_lead_magnet_delivery', '0003_lead_magnet_registry'])
    db.exec(
      readFileSync(
        new URL(`../../drizzle/${file}.sql`, import.meta.url),
        'utf8',
      ),
    );
  const adapter: DeliveryDatabase = {
    prepare(sql) {
      let values: (string | number | null)[] = [];
      const args = () =>
        Object.fromEntries(values.map((v, i) => [`?${i + 1}`, v]));
      return {
        bind(...next) {
          values = next;
          return this;
        },
        async first<T>() {
          return (db.prepare(sql).get(args()) ?? null) as T | null;
        },
        async run() {
          return db.prepare(sql).run(args());
        },
      };
    },
  };
  let contact: BrevoContact | null = null;
  let fail = false;
  const requests: Record<string, unknown>[] = [];
  const api = brevoApi('test-only', async (_url, init) => {
    if (init?.method === 'GET')
      return contact
        ? Response.json(contact)
        : new Response(null, { status: 404 });
    if (fail) return new Response(null, { status: 503 });
    const payload = JSON.parse(
      typeof init?.body === 'string' ? init.body : '{}',
    );
    requests.push(payload);
    contact = { listIds: payload.listIds };
    return Response.json({ id: 1 }, { status: 201 });
  });
  return {
    db,
    requests,
    setContact(value: BrevoContact) {
      contact = value;
    },
    setFail(value: boolean) {
      fail = value;
    },
    subscribePancakes: createPancakesService(deliveryStore(adapter), api, 19),
    subscribe: createPanettoneService(
      deliveryStore(adapter),
      api,
      99,
      () => new Date('2026-11-16T12:00:00Z'),
    ),
  };
}

void test('new and repeated submissions register all three lists and exact attributes once', async () => {
  const f = fixture();
  await f.subscribe(
    'reader+panettone@gmail.com',
    'fb-bot-panettone',
    'network',
  );
  await f.subscribe(
    'reader+panettone@gmail.com',
    'fb-bot-panettone',
    'network',
  );
  assert.deepEqual(f.requests, [
    {
      email: 'reader+panettone@gmail.com',
      listIds: [3, 4, 99],
      attributes: {
        SOURCE: 'fb-bot-panettone',
        SIGNUP_PAGE: 'blog-psyllium',
        SIGNUP_POSITION: 'top-panettone',
      },
      updateEnabled: true,
    },
  ]);
  f.db.close();
});

void test('provider failure is retryable and suppressions are never reset', async () => {
  const f = fixture();
  f.setFail(true);
  await assert.rejects(f.subscribe('reader@gmail.com', 'direct', 'network'));
  f.setFail(false);
  await f.subscribe('reader@gmail.com', 'direct', 'network');
  assert.equal(f.requests.length, 1);
  f.db.close();
  for (const suppressed of [
    { emailBlacklisted: true },
    { listUnsubscribed: [99] },
    { listUnsubscribed: [3] },
  ]) {
    const blocked = fixture();
    blocked.setContact(suppressed);
    await blocked.subscribe('reader@gmail.com', 'direct', 'network');
    assert.equal(blocked.requests.length, 0);
    blocked.db.close();
  }
});

void test('Turnstile validates the campaign action, not a token from another form', async () => {
  const req = new Request('https://bakeagain.com/api/newsletter/panettone', {
    headers: { 'cf-connecting-ip': '192.0.2.1' },
  });
  const bindings = {
    TURNSTILE_SECRET_KEY: 'test',
    ASSISTANT_SESSION_SECRET: 'test',
  };
  await verifyRecipeChallenge(
    req,
    'test',
    bindings,
    async () =>
      Response.json({
        success: true,
        hostname: 'bakeagain.com',
        action: 'panettone_signup',
      }),
    'panettone_signup',
  );
  await assert.rejects(
    verifyRecipeChallenge(
      req,
      'test',
      bindings,
      async () =>
        Response.json({
          success: true,
          hostname: 'bakeagain.com',
          action: 'recipe_request',
        }),
      'panettone_signup',
    ),
  );
});

void test('xanthan article subscriptions use their own page and the same campaign lists', async () => {
  const input = parsePanettoneRequest({
    articlePath: '/uk/blog/xanthan-gum', email: 'reader@example.com', consent: true, token: 'test',
  });
  const f = fixture();
  await f.subscribe(input.email, input.source, 'network', input.signupPage);
  assert.deepEqual(f.requests[0]?.attributes, {
    SOURCE: 'direct', SIGNUP_PAGE: 'blog-xanthan-gum', SIGNUP_POSITION: 'top-panettone',
  });
  assert.deepEqual(f.requests[0]?.listIds, [3, 4, 99]);
  f.db.close();
});

void test('analytics admits the two campaign articles and omits form and query data', () => {
  const event = sanitizeAnalyticsPayload('event', {
    name: 'panettone_signup',
    url: '/uk/blog/psyllium?src=ig-bot-panettone#panettone',
    data: { email: 'private@gmail.com', source: 'private', locale: 'uk' },
  });
  assert.ok(event);
  assert.deepEqual(event.data, {});
  assert.equal(event.url, '/uk/blog/psyllium');
  const xanthan = sanitizeAnalyticsPayload('event', {
    name: 'panettone_signup', url: '/uk/blog/xanthan-gum?src=example#panettone',
    data: { source: 'private' },
  });
  assert.ok(xanthan);
  assert.equal(xanthan.url, '/uk/blog/xanthan-gum');
  assert.deepEqual(xanthan.data, {});
  assert.equal(
    sanitizeAnalyticsPayload('event', { name: 'panettone_signup', url: '/es' }),
    false,
  );
  assert.equal(metaLeadEvent({ placement: 'top-panettone' })?.name, 'Lead');
  assert.equal(
    metaAllowed(
      '123456',
      'https://bakeagain.com/uk/blog/psyllium?src=ig-bot-panettone#panettone',
    ),
    true,
  );
});

void test('pancake waitlist records only its own signup and uses the verified list', async () => {
  assert.equal(pancakesListId({ BREVO_PANCAKES_LIST_ID: '19' }), 19);
  for (const id of ['', '3', '4', '13', '18'])
    assert.equal(pancakesListId({ BREVO_PANCAKES_LIST_ID: id }), null);
  const input = {
    email: 'reader@example.com',
    token: 'challenge',
    consent: true,
    articlePath: '/uk/blog/xanthan-gum',
    source: 'ig-story-pancakes',
  };
  assert.throws(() => parsePancakesRequest({ ...input, articlePath: '/uk/blog/psyllium' }));
  assert.equal(parsePancakesRequest({ ...input, source: 'reader@example.com' }).source, 'direct');

  const f = fixture();
  const signup = parsePancakesRequest(input);
  await f.subscribePancakes(signup.email, signup.source, 'network');
  await f.subscribePancakes(signup.email, signup.source, 'network');
  assert.deepEqual(f.requests, [{
    email: 'reader@example.com',
    listIds: [3, 4, 19],
    attributes: {
      SOURCE: 'ig-story-pancakes',
      SIGNUP_PAGE: 'blog-xanthan-gum',
      SIGNUP_POSITION: 'top-pancakes',
    },
    updateEnabled: true,
  }]);
  assert.equal(f.db.prepare('select magnet from lead_magnet_requests').get()?.magnet, 'pancakes');
  f.db.close();
});
