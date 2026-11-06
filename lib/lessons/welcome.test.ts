import test from 'node:test';
import assert from 'node:assert/strict';
import { deliverLessonWelcome } from './welcome.ts';
void test('welcome outbox: once per transaction, separate buyers list, safe retries and held ambiguous sends', async (t) => {
  const original = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = original;
  });
  const row: Record<string, unknown> = {
    id: 'a0c4a10a-9c11-4dd4-a2c1-0fae6bebaa01',
    email: 'customer@example.com',
    status: 'active',
    welcome_sent_at: null,
    buyers_synced_at: null,
    welcome_attempted_at: null,
    delivery_claimed_at: null,
    welcome_needs_review: false,
  };
  const messages: Record<string, unknown>[] = [];
  const contacts: Record<string, unknown>[] = [];
  let failSend = false;
  globalThis.fetch = async (input, init) => {
    const url = new URL(
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : input.url,
    );
    const method = init?.method ?? 'GET';
    if (url.hostname === 'api.brevo.com') {
      const body = JSON.parse(
        typeof init?.body === 'string' ? init.body : '{}',
      );
      if (url.pathname === '/v3/contacts') contacts.push(body);
      else if (url.pathname === '/v3/smtp/email') {
        if (failSend)
          return Response.json({ error: 'temporary' }, { status: 500 });
        messages.push(body);
      } else throw new Error('Unexpected Brevo path');
      return Response.json({ messageId: 'fixture' });
    }
    assert.equal(url.hostname, 'aaaaaaaaaaaaaaaaaaaa.supabase.co');
    assert.equal(url.pathname, '/rest/v1/lesson_entitlements');
    if (method === 'GET')
      return Response.json(
        row.status === 'active' &&
          !row.welcome_needs_review &&
          (!row.welcome_sent_at || !row.buyers_synced_at)
          ? [{ ...row }]
          : [],
      );
    assert.equal(method, 'PATCH');
    const body = JSON.parse(typeof init?.body === 'string' ? init.body : '{}');
    if (body.delivery_claimed_at && row.delivery_claimed_at)
      return Response.json([]);
    Object.assign(row, body);
    return Response.json([{ id: row.id }]);
  };
  const bindings = {
    ASSISTANT_SESSION_SECRET: 'test-secret-' + 's'.repeat(40),
    LESSONS_ENABLED: 'true',
    PERSONAL_BACKEND: 'supabase',
    SUPABASE_URL: 'https://aaaaaaaaaaaaaaaaaaaa.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: `sb_publishable_${'a'.repeat(30)}`,
    COMMUNITY_SUPABASE_SECRET_KEY: 'fixture-service-role',
    BREVO_API_KEY: 'fixture-brevo',
    BREVO_LESSON_BUYERS_LIST_ID: '123',
  };
  await deliverLessonWelcome(bindings);
  await deliverLessonWelcome(bindings);
  assert.equal(messages.length, 1);
  assert.equal(contacts.length, 1);
  assert.deepEqual(contacts[0], {
    email: 'customer@example.com',
    listIds: [123],
    attributes: { SOURCE: 'payhip' },
    updateEnabled: true,
  });
  assert.deepEqual(messages[0].headers, { idempotencyKey: row.id });
  assert.match(
    String(messages[0].htmlContent),
    /<a href="https:\/\/bakeagain\.com\/uk\/urok\/napoleon#lesson_access=purchase\./,
  );
  assert.match(
    String(messages[0].htmlContent),
    /Наполеон без глютену — відкрити урок<\/a>/,
  );
  row.welcome_sent_at = null;
  row.welcome_attempted_at = null;
  failSend = true;
  await assert.rejects(deliverLessonWelcome(bindings));
  assert.equal(row.delivery_claimed_at, null);
  assert(row.welcome_attempted_at);
  failSend = false;
  await deliverLessonWelcome(bindings);
  assert.equal(messages.length, 2);
  row.welcome_sent_at = null;
  row.welcome_attempted_at = new Date(Date.now() - 31 * 60000).toISOString();
  await deliverLessonWelcome(bindings);
  assert.equal(messages.length, 2);
  assert.equal(row.welcome_needs_review, true);
});
void test('entitlement checks use verified user email and RLS token; backend failures never grant access', async (t) => {
  const { verifiedReader, hasLessonAccess } = await import('./server.ts');
  const original = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = original;
  });
  const bindings = {
    ASSISTANT_SESSION_SECRET: 'test-secret-' + 's'.repeat(40),
    LESSONS_ENABLED: 'true',
    PERSONAL_BACKEND: 'supabase',
    SUPABASE_URL: 'https://aaaaaaaaaaaaaaaaaaaa.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: `sb_publishable_${'a'.repeat(30)}`,
  };
  let active = false;
  let failure = false;
  globalThis.fetch = async (input, init) => {
    const url = new URL(
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : input.url,
    );
    assert.equal(
      new Headers(init?.headers).get('authorization'),
      'Bearer test.reader.token',
    );
    if (url.pathname === '/auth/v1/user')
      return Response.json({
        id: 'reader',
        email: 'Customer@Example.COM',
        email_confirmed_at: '2026-11-04T00:00:00Z',
        role: 'authenticated',
      });
    assert.equal(url.pathname, '/rest/v1/lesson_entitlements');
    assert.equal(url.searchParams.get('email'), 'eq.customer@example.com');
    assert.equal(url.searchParams.get('status'), 'eq.active');
    assert.equal(url.searchParams.get('lesson_id'), 'eq.napoleon-video');
    assert.equal(
      url.searchParams.get('or'),
      '(source.eq.manual,paid_seen.eq.true)',
    );
    if (failure)
      return Response.json({ message: 'backend unavailable' }, { status: 500 });
    return Response.json(active ? [{ id: 'owned-purchase' }] : []);
  };
  const reader = await verifiedReader(bindings, 'test.reader.token');
  assert(reader);
  assert.equal(await hasLessonAccess(reader), false);
  active = true;
  assert.equal(await hasLessonAccess(reader), true);
  failure = true;
  await assert.rejects(hasLessonAccess(reader));
});

void test('explicit resend sends current HTML only to verified paid buyer and leaves outbox untouched', async (t) => {
  const { resendLessonWelcome } = await import('./welcome.ts');
  const original = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = original;
  });
  let active = true;
  let sent = 0;
  const id = 'a0c4a10a-9c11-4dd4-a2c1-0fae6bebaa01';
  const resendId = 'b0c4a10a-9c11-4dd4-a2c1-0fae6bebaa02';
  globalThis.fetch = async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : input);
    if (url.hostname === 'api.brevo.com') {
      const body = JSON.parse(typeof init?.body === 'string' ? init.body : '');
      assert.deepEqual(body.to, [{ email: 'customer@example.com' }]);
      assert.equal(body.headers.idempotencyKey, resendId);
      assert.match(body.htmlContent, /lesson_access=purchase\./);
      sent++;
      return Response.json({ messageId: 'fixture-resend' });
    }
    assert.equal(init?.method ?? 'GET', 'GET');
    assert.equal(url.searchParams.get('id'), `eq.${id}`);
    assert.equal(url.searchParams.get('status'), 'eq.active');
    assert.equal(url.searchParams.get('paid_seen'), 'eq.true');
    return Response.json(active ? { id, email: 'customer@example.com' } : null);
  };
  const bindings = {
    LESSONS_ENABLED: 'true',
    PERSONAL_BACKEND: 'supabase',
    SUPABASE_URL: 'https://aaaaaaaaaaaaaaaaaaaa.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: `sb_publishable_${'a'.repeat(30)}`,
    COMMUNITY_SUPABASE_SECRET_KEY: 'fixture',
    BREVO_API_KEY: 'fixture',
    ASSISTANT_SESSION_SECRET: 'test-secret-' + 's'.repeat(40),
  };
  assert.deepEqual(await resendLessonWelcome(bindings, id, resendId), {
    messageId: 'fixture-resend',
  });
  active = false;
  await assert.rejects(resendLessonWelcome(bindings, id, resendId));
  await assert.rejects(resendLessonWelcome(bindings, 'invalid', resendId));
  assert.equal(sent, 1);
});
