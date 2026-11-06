import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { parsePayhip, sha256, constantEqual, LessonError } from './payhip.ts';
import {
  napoleonLesson,
  lessonStepSummaries,
  validStreamUid,
} from '../../content/commerce/lessons/napoleon.ts';
import { streamToken } from './stream.ts';
import { verifiedReader } from './server.ts';
import { readAuthLink, verifyAuthLink } from '../personal/auth-link.ts';
import { sanitizeAnalyticsPayload } from '../analytics/umami.ts';
const fixture = JSON.parse(
  await readFile(
    new URL('./fixtures/payhip-paid.json', import.meta.url),
    'utf8',
  ),
);
const key = 'fixture-api-key';
const signature = await sha256(key);
const body = { ...fixture, signature };
void test('manifest: stable IDs, one free step, paired Ukrainian videos and matched durations', () => {
  const steps = napoleonLesson.steps;
  assert.equal(steps.length, 13);
  assert.equal(new Set(steps.map((s) => s.stepId)).size, 13);
  assert.deepEqual(
    steps.filter((s) => s.free).map((s) => s.stepId),
    ['s08-baked-layers'],
  );
  for (const step of steps) {
    assert(step.videos.uk);
    assert(step.videos.uk.wide.durationSec > 0);
    assert(
      Math.abs(
        step.videos.uk.wide.durationSec - step.videos.uk.vertical.durationSec,
      ) <= 0.5,
    );
    for (const v of [step.videos.uk.wide, step.videos.uk.vertical])
      assert(v.uid === '' || validStreamUid(v.uid));
  }
  assert.doesNotMatch(JSON.stringify(lessonStepSummaries()), /"uid"|"videos"/);
});
void test('webhook signature, matching product ID/key, normalization and malformed/foreign payload', async () => {
  assert(constantEqual('same', 'same'));
  assert(!constantEqual('same', 'same-longer'));
  await assert.rejects(
    parsePayhip({ ...body, signature: 'wrong' }, key, ['lesson-product']),
    (e: unknown) => e instanceof LessonError && e.status === 401,
  );
  assert.equal(await parsePayhip(body, key, ['foreign']), null);
  const event = await parsePayhip(body, key, ['lessonKey']);
  assert.equal(event?.email, 'customer@example.com');
  assert.equal(event?.productId, 'lesson-product');
  await assert.rejects(
    parsePayhip({ ...body, price: -1 }, key, ['lesson-product']),
  );
  await assert.rejects(
    parsePayhip({ ...body, type: 'refunded', amount_refunded: 1900 }, key, [
      'lesson-product',
    ]),
  );
});
void test('private playback has no anonymous identity; shared OTP callback only at reviewed paths', async () => {
  assert.equal(await verifiedReader({}, undefined), null);
  assert.equal(await verifiedReader({}, 'not-a-token'), null);
  const link = readAuthLink(
    new URL(
      'https://bakeagain.com/uk/urok/napoleon#token_hash=one-use&type=email',
    ),
  );
  assert.equal(link.kind, 'token');
  assert.equal(
    readAuthLink(
      new URL(
        'https://bakeagain.com/uk/urok/napoleon#token_hash=x&type=recovery',
      ),
    ).kind,
    'invalid',
  );
  assert.equal(
    readAuthLink(
      new URL('https://bakeagain.com/es/urok/napoleon#token_hash=x&type=email'),
    ).kind,
    'none',
  );
  await assert.rejects(
    verifyAuthLink(
      {
        verifyOtp: async () => ({
          data: { session: null },
          error: new Error('expired'),
        }),
        exchangeCodeForSession: async () => {
          throw new Error('unexpected');
        },
      },
      link,
    ),
    /INVALID_AUTH_LINK/,
  );
});
void test('Stream token: real RSA signature, exact UID, expiry and disabled downloads', async () => {
  const keys = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify'],
  );
  const jwk = await crypto.subtle.exportKey('jwk', keys.privateKey);
  const uid = 'a'.repeat(32);
  const token = await streamToken(uid, 'test-key', jwk, 1000);
  const [head, payload, sig] = token.split('.');
  const claims = JSON.parse(Buffer.from(payload, 'base64url').toString());
  assert.equal(claims.sub, uid);
  assert.equal(claims.exp, 15400);
  assert.equal(claims.downloadable, false);
  assert(
    await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      keys.publicKey,
      Buffer.from(sig, 'base64url'),
      new TextEncoder().encode(`${head}.${payload}`),
    ),
  );
  await assert.rejects(streamToken('invalid', 'key', jwk));
});
void test('lesson analytics strips identities and credentials and is confined to the lesson path', () => {
  const result = sanitizeAnalyticsPayload('event', {
    url: 'https://bakeagain.com/uk/urok/napoleon?email=private#token_hash=secret',
    name: 'lesson_step_play',
    data: {
      email: 'private',
      token: 'secret',
      stepId: 's05-rolling',
      orientation: 'wide',
    },
  });
  assert(result);
  assert.deepEqual(result.data, { stepId: 's05-rolling', orientation: 'wide' });
  assert.equal(result.url, '/uk/urok/napoleon');
  assert.equal(
    sanitizeAnalyticsPayload('event', {
      url: 'https://bakeagain.com/uk',
      name: 'lesson_buy_click',
    }),
    false,
  );
});
void test('Postgres integration: idempotency, refunds in either order, manual revocation, rate limits and reader RLS', async (t) => {
  const db = new PGlite();
  t.after(() => db.close());
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls; create schema auth;
    create function auth.jwt() returns jsonb language sql as $$ select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
    grant usage on schema auth to authenticated;`);
  await db.exec(
    await readFile(
      new URL(
        '../../supabase/migrations/20261104120000_lesson_access.sql',
        import.meta.url,
      ),
      'utf8',
    ),
  );
  const apply = async (payload: unknown) => {
    const event = await parsePayhip(payload, key, ['lesson-product']);
    assert(event);
    return (
      await db.query('select public.lesson_payhip_apply($1::jsonb) as id', [
        JSON.stringify(event),
      ])
    ).rows;
  };
  await apply(body);
  await apply(body);
  assert.equal(
    (await db.query('select * from lesson_entitlements')).rows.length,
    1,
  );
  assert.equal(
    (await db.query('select * from lesson_payhip_events')).rows.length,
    1,
  );
  const refund = {
    ...body,
    type: 'refunded',
    amount_refunded: 100,
    date_refunded: 1793746900,
  };
  await apply(refund);
  assert.equal(
    (
      await db.query<{ status: string }>(
        'select status from lesson_entitlements',
      )
    ).rows[0].status,
    'active',
  );
  await apply({ ...refund, amount_refunded: 1900 });
  await apply(body);
  assert.equal(
    (
      await db.query<{ status: string }>(
        'select status from lesson_entitlements',
      )
    ).rows[0].status,
    'refunded',
  );
  await apply({ ...refund, id: 'refund-first', amount_refunded: 1900 });
  await apply({ ...body, id: 'refund-first' });
  assert.equal(
    (
      await db.query<{ status: string }>(
        "select status from lesson_entitlements where payhip_transaction_id='refund-first'",
      )
    ).rows[0].status,
    'refunded',
  );
  await apply({ ...refund, id: 'partial-first' });
  assert.equal(
    (
      await db.query<{ paid_seen: boolean }>(
        "select paid_seen from lesson_entitlements where payhip_transaction_id='partial-first'",
      )
    ).rows[0].paid_seen,
    false,
  );
  await apply({ ...body, id: 'partial-first' });
  assert.equal(
    (
      await db.query<{ paid_seen: boolean }>(
        "select paid_seen from lesson_entitlements where payhip_transaction_id='partial-first'",
      )
    ).rows[0].paid_seen,
    true,
  );
  await db.exec(
    "update lesson_entitlements set status='revoked', revoked_at=now() where payhip_transaction_id='partial-first'",
  );
  await apply({ ...body, id: 'partial-first' });
  assert.equal(
    (
      await db.query<{ status: string }>(
        "select status from lesson_entitlements where payhip_transaction_id='partial-first'",
      )
    ).rows[0].status,
    'revoked',
  );
  for (let i = 0; i < 6; i++)
    assert.equal(
      (
        await db.query<{ allowed: boolean }>(
          'select lesson_login_consume($1::text[]) as allowed',
          [['hashed-ip', 'hashed-email']],
        )
      ).rows[0].allowed,
      i < 5,
    );
  await db.exec(
    "insert into lesson_entitlements(lesson_id,email,status,source) values('napoleon-video','other@example.com','active','manual')",
  );
  await db.exec(
    `set role authenticated; set request.jwt.claims = '{"email":"Customer@Example.COM"}';`,
  );
  assert(
    (
      await db.query<{ email: string }>('select email from lesson_entitlements')
    ).rows.every((r) => r.email === 'customer@example.com'),
  );
  await assert.rejects(
    db.exec(
      "insert into lesson_entitlements(lesson_id,email,status,source) values('napoleon-video','customer@example.com','active','manual')",
    ),
    /permission denied/,
  );
  await db.exec('reset role');
});
