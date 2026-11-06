import test from 'node:test';
import assert from 'node:assert/strict';
import { purchaseToken, readPurchaseToken } from './purchase-token.ts';
const key = 'a'.repeat(40);
const id = 'a0c4a10a-9c11-4dd4-a2c1-0fae6bebaa01';
void test('purchase capabilities reject tampering, expiry and wrong signing key', async () => {
  const now = 1800000000000;
  const token = await purchaseToken(id, key, now);
  assert.equal(await readPurchaseToken(token, key, now), id);
  assert.equal(await readPurchaseToken(token, 'b'.repeat(40), now), null);
  assert.equal(
    await readPurchaseToken(
      token.replace(id, id.replace('a0', 'b0')),
      key,
      now,
    ),
    null,
  );
  assert.equal(await readPurchaseToken(token, key, now + 90 * 86400000), null);
  assert.equal(await readPurchaseToken('purchase.invalid', key, now), null);
});
import { verifiedReader } from './server.ts';
import { parsePayhip, sha256 } from './payhip.ts';
import { readFile } from 'node:fs/promises';
void test('purchase session remains lesson-only and checks revocation on every read', async (t) => {
  const original = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = original;
  });
  let active = true;
  globalThis.fetch = async (input) => {
    const url = new URL(input instanceof Request ? input.url : input);
    assert.equal(url.pathname, '/rest/v1/lesson_entitlements');
    assert.equal(url.searchParams.get('id'), `eq.${id}`);
    assert.equal(url.searchParams.get('lesson_id'), 'eq.napoleon-video');
    assert.equal(url.searchParams.get('paid_seen'), 'eq.true');
    assert.equal(url.searchParams.get('status'), 'eq.active');
    return active
      ? Response.json({ id, email: 'buyer@example.com' })
      : Response.json({ code: 'PGRST116' }, { status: 406 });
  };
  const bindings = {
    LESSONS_ENABLED: 'true',
    PERSONAL_BACKEND: 'supabase',
    SUPABASE_URL: 'https://aaaaaaaaaaaaaaaaaaaa.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_' + 'a'.repeat(30),
    COMMUNITY_SUPABASE_SECRET_KEY: 'test',
    ASSISTANT_SESSION_SECRET: key,
  };
  const token = await purchaseToken(id, key);
  const reader = await verifiedReader(bindings, token);
  assert.equal(reader?.entitlementId, id);
  active = false;
  assert.equal(await verifiedReader(bindings, token), null);
});
void test('checkout metadata is read only from an authenticated paid webhook', async () => {
  const fixture = JSON.parse(
    await readFile(
      new URL('./fixtures/payhip-paid.json', import.meta.url),
      'utf8',
    ),
  );
  const payload = {
    ...fixture,
    signature: await sha256(key),
    metadata: { ba_checkout: id },
  };
  const event = await parsePayhip(payload, key, [fixture.items[0].product_id]);
  assert.equal(event?.checkoutId, id);
  await assert.rejects(
    parsePayhip({ ...payload, signature: 'invalid' }, key, [
      fixture.items[0].product_id,
    ]),
  );
});
