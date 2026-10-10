import assert from 'node:assert/strict';
import test from 'node:test';
import { createPersonalSyncHandler } from './sync-http.ts';
const bindings = {
  PERSONAL_SYNC_ENABLED: 'true',
  PERSONAL_BACKEND: 'supabase',
  SUPABASE_URL: 'https://abcdefghijklmnopqrst.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_' + 'a'.repeat(32),
};
const user = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const request = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('https://bakeagain.test/api/personal/v1/sync', {
    method: 'POST',
    headers: {
      origin: 'https://bakeagain.test',
      'content-type': 'application/json',
      authorization: 'Bearer a.b.c',
      ...headers,
    },
    body: JSON.stringify(body),
  });
void test('sync HTTP rejects cross-origin, account injection, bad input and oversized streams before a mutation', async () => {
  let mutations = 0;
  const fetcher: typeof fetch = async (input) => {
    if (
      (input instanceof Request ? input.url : input.toString()).includes(
        '/auth/v1/user',
      )
    )
      return Response.json({
        id: user,
        aud: 'authenticated',
        role: 'authenticated',
        email_confirmed_at: '2026-10-09',
      });
    mutations++;
    return Response.json({ accountId: user, records: [], imported: false });
  };
  const handler = createPersonalSyncHandler(async () => bindings, fetcher);
  assert.equal(
    (
      await handler(
        request(
          { action: 'snapshot', input: {} },
          { origin: 'https://evil.test' },
        ),
      )
    ).status,
    403,
  );
  assert.equal(
    (await handler(request({ action: 'snapshot', input: { accountId: user } })))
      .status,
    400,
  );
  assert.equal(
    (await handler(request({ action: 'erase', input: { confirm: 'yes' } })))
      .status,
    400,
  );
  assert.equal(
    (await handler(request({ action: 'mutate', input: { mutations: [] } })))
      .status,
    400,
  );
  assert.equal(
    (
      await handler(
        request({ action: 'snapshot', input: { huge: 'x'.repeat(1048576) } }),
      )
    ).status,
    413,
  );
  assert.equal(mutations, 0);
  const result = await handler(request({ action: 'snapshot', input: {} }));
  assert.equal(result.status, 200);
  assert.equal(result.headers.get('cache-control'), 'private, no-store');
  assert.equal(mutations, 1);
  assert.equal(
    (await createPersonalSyncHandler(async () => ({}), fetcher)(request({})))
      .status,
    503,
  );
});
void test('sync HTTP derives canonical keys, forwards only user JWT and permits an explicit empty import refusal', async () => {
  const calls: {
    headers: Headers;
    body: { input: { mutations: { key: string }[] } };
  }[] = [];
  const fetcher: typeof fetch = async (input, init) => {
    if (
      (input instanceof Request ? input.url : input.toString()).includes(
        '/auth/v1/user',
      )
    )
      return Response.json({
        id: user,
        aud: 'authenticated',
        role: 'authenticated',
        email_confirmed_at: '2026-10-09',
      });
    calls.push({
      headers: new Headers(init?.headers),
      body: JSON.parse(init?.body as string),
    });
    return Response.json({ acknowledgements: [] });
  };
  const handler = createPersonalSyncHandler(async () => bindings, fetcher);
  assert.equal(
    (await handler(request({ action: 'import', input: { mutations: [] } })))
      .status,
    200,
  );
  assert.equal(
    (
      await handler(
        request({
          action: 'mutate',
          input: {
            mutations: [
              {
                schemaVersion: 1,
                operationId: crypto.randomUUID(),
                expectedRevision: 0,
                action: 'put',
                kind: 'saved-recipe',
                payload: { recipeId: 'napoleon' },
              },
            ],
          },
        }),
      )
    ).status,
    200,
  );
  assert.equal(calls[1].body.input.mutations[0].key, 'napoleon');
  assert.equal(calls[1].headers.get('authorization'), 'Bearer a.b.c');
});
