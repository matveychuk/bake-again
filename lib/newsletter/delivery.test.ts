import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { brevoApi, type BrevoContact } from './brevo-api.ts';
import { deliveryStore, type DeliveryDatabase } from './delivery-store.ts';
import {
  createDeliveryService,
  parseRecipeRequest,
  digest,
} from './delivery-service.ts';
import { recipeSubscription, isSuppressed } from './single-opt-in.ts';
import { recipeEmail } from './magnet-email.ts';
import {
  deliveryConfigured,
  readRecipeBody,
  requireRecipeOrigin,
  verifyRecipeChallenge,
} from './delivery-runtime.ts';

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
      let args: (string | number | null)[] = [];
      return {
        bind(...values) {
          args = values;
          return this;
        },
        async first<T>() {
          return (db
            .prepare(sql)
            .get(Object.fromEntries(args.map((v, i) => [`?${i + 1}`, v]))) ??
            null) as T | null;
        },
        async run() {
          return db
            .prepare(sql)
            .run(Object.fromEntries(args.map((v, i) => [`?${i + 1}`, v])));
        },
      };
    },
  };
  let time = 1_800_000_000,
    contact: BrevoContact | null = null,
    fail = false;
  const registrations: {
    email: string;
    subscription: ReturnType<typeof recipeSubscription>;
  }[] = [];
  const service = createDeliveryService(
    deliveryStore(adapter),
    {
      async contact() {
        return contact;
      },
      async subscribe(email, subscription) {
        registrations.push({ email, subscription });
        if (fail) throw new Error('Uncertain provider response');
      },
    },
    () => time,
  );
  return {
    db,
    service,
    registrations,
    setContact(value: BrevoContact | null) {
      contact = value;
    },
    fail(value: boolean) {
      fail = value;
    },
    advance(seconds: number) {
      time += seconds;
    },
  };
}
const email = 'reader@example.com';
void test('new signup registers all lists in one operation without DOI or a second email sender', async () => {
  const f = fixture();
  await f.service.request(email, 'mlyntsi', 'network', 'recipe');
  assert.equal(f.registrations.length, 1);
  assert.deepEqual(f.registrations[0].subscription, {
    listIds: [3, 4, 9],
    attributes: {
      SOURCE: 'website',
      SIGNUP_PAGE: '/uk/recipes/bezghliutenovi-mlyntsi',
      SIGNUP_POSITION: 'after-add-milk',
    },
  });
  await f.service.request(email, 'mlyntsi', 'network', 'recipe');
  assert.equal(f.registrations.length, 1);
  assert.equal(
    f.db.prepare('SELECT status FROM lead_magnet_requests').get()!.status,
    'sent',
  );
});
void test('existing subscriber can enter another bonus without replacing previous membership', async () => {
  const f = fixture();
  f.setContact({ listIds: [3, 4, 9], emailBlacklisted: false });
  await f.service.request(email, 'shokolad', 'network');
  assert.deepEqual(f.registrations[0].subscription.listIds, [3, 4, 11]);
});
void test('suppression and all relevant unsubscribe scopes are preserved', async () => {
  for (const contact of [
    { emailBlacklisted: true },
    ...[3, 4, 5, 6, 9, 11].map((id) => ({
      emailBlacklisted: false,
      listUnsubscribed: [id],
    })),
  ]) {
    const f = fixture();
    f.setContact(contact);
    await f.service.request(email, 'mlyntsi', 'network');
    assert.equal(f.registrations.length, 0);
    assert.ok(isSuppressed(contact));
  }
});
void test('parallel requests and retries preserve request identity and use idempotent list entry', async () => {
  const f = fixture();
  await Promise.all([
    f.service.request(email, 'mlyntsi', 'network'),
    f.service.request(email, 'mlyntsi', 'network'),
  ]);
  assert.equal(f.registrations.length, 1);
  const g = fixture();
  g.fail(true);
  await assert.rejects(g.service.request(email, 'shokolad', 'network'));
  const id = g.db.prepare('SELECT id FROM lead_magnet_requests').get()!.id;
  g.fail(false);
  await g.service.request(email, 'shokolad', 'network');
  assert.equal(
    g.db.prepare('SELECT id FROM lead_magnet_requests').get()!.id,
    id,
  );
  assert.equal(g.registrations.length, 2);
});
void test('D1 admission limits remain atomic across different addresses', async () => {
  const f = fixture();
  for (let i = 0; i < 15; i++)
    await f.service.request(`reader${i}@example.com`, 'mlyntsi', 'network');
  assert.equal(f.registrations.length, 10);
});
void test('old return tokens recover through list entry, never SMTP; sent rows remain untouched', async () => {
  const f = fixture();
  const token = 'a'.repeat(64);
  f.db
    .prepare(
      'INSERT INTO lead_magnet_requests VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
    )
    .run(
      'legacy',
      await digest(token),
      'legacy-key',
      email,
      'mlyntsi',
      'network',
      1_800_000_000,
      1_800_086_400,
      'awaiting_confirmation',
      null,
      null,
      null,
    );
  assert.equal(await f.service.confirm(token), 'mlyntsi');
  assert.equal(f.registrations.length, 1);
  await f.service.confirm(token);
  assert.equal(f.registrations.length, 1);
  await assert.rejects(f.service.confirm('bad'));
  f.advance(86401);
  await assert.rejects(f.service.confirm(token));
});
void test('provider payload never resets blocklist, merges identities or invokes DOI/SMTP', async () => {
  const calls: { url: string; body: Record<string, unknown> }[] = [];
  const api = brevoApi('test-secret', async (url, init) => {
    const req = new Request(url, init);
    calls.push({
      url: req.url,
      body: (await req.json()) as Record<string, unknown>,
    });
    return Response.json({ id: 123 });
  });
  await api.subscribe(email, recipeSubscription('mlyntsi', 'recipe'));
  assert.equal(calls[0].url, 'https://api.brevo.com/v3/contacts');
  assert.equal(calls[0].body.updateEnabled, true);
  for (const field of [
    'emailBlacklisted',
    'smsBlacklisted',
    'unlinkListIds',
    'forceMerge',
  ])
    assert.ok(!(field in calls[0].body));
  assert.deepEqual(calls[0].body.listIds, [3, 4, 9]);
  assert.ok(
    !('EMAIL' in (calls[0].body.attributes as Record<string, unknown>)),
  );
});
void test('card and chocolate have only their own fixed material', () => {
  const card = recipeEmail('mlyntsi'),
    cake = recipeEmail('shokolad');
  assert.ok(card.htmlContent.includes('kartka-yunoho-kukharia'));
  assert.ok(
    !card.htmlContent.includes('Bake-Again-Bezghliutenovi-mlyntsi.pdf'),
  );
  assert.ok(cake.htmlContent.includes('shokoladnyi'));
});
void test('validation rejects arbitrary positions, missing consent, honeypots and unsafe origins', async () => {
  assert.deepEqual(
    parseRecipeRequest({
      email: ' Reader@Example.com ',
      magnet: 'mlyntsi',
      token: 'token',
      consent: true,
    }),
    { email, magnet: 'mlyntsi', token: 'token', placement: 'landing' },
  );
  for (const patch of [
    { placement: 'arbitrary' },
    { placement: {} },
    { placement: 'recipe', magnet: 'shokolad' },
    { consent: false },
    { website: 'bot' },
    { magnet: 'unknown' },
  ])
    assert.throws(() =>
      parseRecipeRequest({
        email,
        magnet: 'mlyntsi',
        token: 'x',
        consent: true,
        ...patch,
      }),
    );
  assert.throws(() =>
    requireRecipeOrigin(
      new Request('https://bakeagain.com/api/newsletter/recipe', {
        method: 'POST',
        headers: {
          origin: 'https://evil.example',
          'content-type': 'application/json',
        },
      }),
    ),
  );
  await assert.rejects(
    readRecipeBody(
      new Request('https://bakeagain.com', {
        method: 'POST',
        body: 'x'.repeat(8193),
      }),
    ),
  );
  assert.equal(deliveryConfigured({}), false);
});
void test('local dummy Turnstile configuration cannot authorize a public production origin', async () => {
  const bindings = {
    NEWSLETTER_LOCAL_TEST: 'true',
    TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
    TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
    ASSISTANT_SESSION_SECRET: 'test-secret',
  };
  const local = new Request('http://127.0.0.1:3021/api/newsletter/recipe', {
    method: 'POST',
    headers: {
      origin: 'http://127.0.0.1:3021',
      'content-type': 'application/json',
    },
  });
  requireRecipeOrigin(local, bindings);
  assert.equal(
    (
      await verifyRecipeChallenge(local, 'dummy', bindings, async () =>
        Response.json({ success: true, hostname: 'localhost', action: 'test' }),
      )
    ).length,
    64,
  );
  const publicRequest = new Request(
    'https://bakeagain.com/api/newsletter/recipe',
    { headers: { 'cf-connecting-ip': '192.0.2.1' } },
  );
  await assert.rejects(
    verifyRecipeChallenge(publicRequest, 'dummy', bindings, async () =>
      Response.json({ success: true, hostname: 'localhost', action: 'test' }),
    ),
  );
  assert.throws(() => requireRecipeOrigin(local, {}));
});
