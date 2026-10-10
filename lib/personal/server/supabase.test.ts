import assert from 'node:assert/strict';
import test from 'node:test';
import { createConfiguredPersonalRecordHandler } from './configured-handler.ts';
import { createSupabasePersonalBackend } from './supabase.ts';
import { supabasePersonalConfig } from './supabase-config.ts';

const url = 'https://abcdefghijklmnopqrst.supabase.co';
const key = `sb_publishable_${'a'.repeat(32)}`;
const bindings = {
  PERSONAL_BACKEND: 'supabase',
  SUPABASE_URL: url,
  SUPABASE_PUBLISHABLE_KEY: key,
};
const userA = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const userB = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const accountA = '11111111-1111-4111-8111-111111111111';
const accountB = '22222222-2222-4222-8222-222222222222';
const tokenA = 'header.readerA.signature',
  tokenB = 'header.readerB.signature';
const request = (
  token: string | null = tokenA,
  query = 'kind=saved-recipe&key=napoleon',
  method = 'GET',
) =>
  new Request(`https://bakeagain.test/api/personal/v1/record?${query}`, {
    method,
    headers: token === null ? {} : { authorization: `Bearer ${token}` },
  });

function provider(
  options: {
    status?: number;
    role?: string;
    anonymous?: boolean;
    confirmed?: boolean;
    invalidRow?: boolean;
    missingAccount?: boolean;
    databaseFailure?: boolean;
  } = {},
) {
  const requests: { url: URL; headers: Headers; cache?: RequestCache }[] = [];
  const fetcher: typeof fetch = async (input, init) => {
    const target = new URL(
      input instanceof Request ? input.url : String(input),
    );
    const headers = new Headers(init?.headers);
    requests.push({ url: target, headers, cache: init?.cache });
    const isB = headers.get('authorization') === `Bearer ${tokenB}`;
    if (target.pathname === '/auth/v1/user') {
      if (options.status)
        return Response.json(
          { msg: 'private-provider-error', code: 'bad_jwt' },
          { status: options.status },
        );
      return Response.json({
        id: isB ? userB : userA,
        aud: 'authenticated',
        role: options.role ?? 'authenticated',
        is_anonymous: options.anonymous ?? false,
        email_confirmed_at:
          options.confirmed === false ? null : '2026-10-09T00:00:00Z',
      });
    }
    if (options.databaseFailure)
      return Response.json({ message: 'private-sql-error' }, { status: 500 });
    if (target.pathname === '/rest/v1/personal_identities')
      return Response.json(
        options.missingAccount
          ? []
          : [{ account_id: isB ? accountB : accountA }],
      );
    if (target.pathname === '/rest/v1/personal_records')
      return Response.json([
        {
          schema_version: 1,
          revision: isB ? 2 : 1,
          payload_json: JSON.stringify(
            options.invalidRow
              ? { recipeId: 'another' }
              : { recipeId: 'napoleon' },
          ),
          updated_at: 1791504000000,
          deleted_at: null,
        },
      ]);
    throw new Error('Unexpected outbound endpoint');
  };
  return { fetcher, requests };
}

void test('Supabase runtime configuration rejects secret keys, foreign URLs and partial activation', () => {
  assert.equal(supabasePersonalConfig({}), null);
  assert.equal(
    supabasePersonalConfig({ ...bindings, PERSONAL_BACKEND: 'disabled' }),
    null,
  );
  assert.equal(
    supabasePersonalConfig({ ...bindings, SUPABASE_URL: `${url}/` })?.issuer,
    `${url}/auth/v1`,
  );
  for (const patch of [
    { SUPABASE_URL: 'http://localhost:54321' },
    { SUPABASE_URL: `${url}.evil.test` },
    { SUPABASE_URL: `${url}/rest/v1` },
    { SUPABASE_URL: `${url}?x=1` },
    { SUPABASE_PUBLISHABLE_KEY: `sb_secret_${'a'.repeat(32)}` },
    { SUPABASE_PUBLISHABLE_KEY: 'legacy.jwt.key' },
    { SUPABASE_PUBLISHABLE_KEY: '' },
    { PERSONAL_BACKEND: 'd1' },
  ])
    assert.throws(() => supabasePersonalConfig({ ...bindings, ...patch }));
});

void test('missing/malformed bearer tokens and forged Sites headers never call Supabase', async () => {
  const f = provider();
  const handler = createConfiguredPersonalRecordHandler(
    async () => bindings,
    f.fetcher,
  );
  for (const authorization of [
    '',
    'Basic x',
    'Bearer public-key',
    'Bearer header.user.sig, Bearer second.user.sig',
    `Bearer ${'x'.repeat(8200)}`,
  ]) {
    const input = request(null);
    input.headers.set('authorization', authorization);
    input.headers.set('oai-authenticated-user-id', userB);
    input.headers.set('cookie', `accountId=${accountB}`);
    const response = await handler(input);
    assert.equal(response.status, 401);
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.equal(response.headers.get('access-control-allow-origin'), null);
  }
  assert.equal(f.requests.length, 0);
});

void test('provider rejects invalid tokens; unexpected provider errors stay generic and private', async () => {
  for (const [options, expected] of [
    [{ status: 401 }, 401],
    [{ status: 403 }, 401],
    [{ status: 429 }, 503],
    [{ anonymous: true }, 401],
    [{ confirmed: false }, 401],
    [{ role: 'service_role' }, 401],
    [{ databaseFailure: true }, 503],
    [{ missingAccount: true }, 403],
    [{ invalidRow: true }, 503],
  ] as const) {
    const f = provider(options);
    const response = await createConfiguredPersonalRecordHandler(
      async () => bindings,
      f.fetcher,
    )(request());
    assert.equal(response.status, expected);
    assert.doesNotMatch(
      await response.text(),
      /private-provider|private-sql|aaaaaaaa|publishable|signature/,
    );
  }
});

void test('same handler isolates simultaneous reader clients and applies owner filters after verified Auth', async () => {
  const f = provider();
  const handler = createConfiguredPersonalRecordHandler(
    async () => bindings,
    f.fetcher,
  );
  const results = await Promise.all([
    handler(request(tokenA)),
    handler(request(tokenB)),
  ]);
  assert.deepEqual(
    results.map((r) => r.status),
    [200, 200],
  );
  const bodies = (await Promise.all(results.map((r) => r.json()))) as {
    record: { revision: number };
  }[];
  assert.deepEqual(
    bodies.map((b) => b.record.revision),
    [1, 2],
  );
  for (const r of f.requests) {
    assert.equal(r.url.origin, url);
    assert.equal(r.headers.get('apikey'), key);
    assert.equal(r.cache, 'no-store');
    const isB = r.headers.get('authorization') === `Bearer ${tokenB}`;
    if (r.url.pathname.endsWith('personal_identities')) {
      assert.equal(r.url.searchParams.get('issuer'), `eq.${url}/auth/v1`);
      assert.equal(
        r.url.searchParams.get('subject'),
        `eq.${isB ? userB : userA}`,
      );
    }
    if (r.url.pathname.endsWith('personal_records'))
      assert.equal(
        r.url.searchParams.get('account_id'),
        `eq.${isB ? accountB : accountA}`,
      );
  }
});

void test('repository cannot be used before auth or with another identity/account', async () => {
  const f = provider();
  const backend = createSupabasePersonalBackend(
    supabasePersonalConfig(bindings)!,
    f.fetcher,
  );
  await assert.rejects(backend.repository());
  const identity = await backend.auth.authenticate(request());
  const repo = await backend.repository();
  assert.equal(
    await repo.resolveAccount({
      ...identity!,
      issuer: 'https://other.supabase.co/auth/v1',
    }),
    null,
  );
  assert.equal(
    await repo.resolveAccount({ ...identity!, subject: userB }),
    null,
  );
  assert.equal(await repo.resolveAccount(identity!), accountA);
  const count = f.requests.length;
  assert.equal(
    await repo.readRecord(accountB, 'saved-recipe', 'napoleon'),
    null,
  );
  assert.equal(f.requests.length, count);
});

void test('missing/invalid config fails closed; writes are rejected before reading configuration', async () => {
  const f = provider();
  for (const config of [
    {},
    { ...bindings, SUPABASE_PUBLISHABLE_KEY: 'secret' },
  ]) {
    assert.equal(
      (
        await createConfiguredPersonalRecordHandler(
          async () => config,
          f.fetcher,
        )(request())
      ).status,
      503,
    );
  }
  const handler = createConfiguredPersonalRecordHandler(async () => {
    throw new Error('must not run');
  }, f.fetcher);
  const response = await handler(request(tokenA, '', 'POST'));
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET');
  assert.equal(f.requests.length, 0);
});
