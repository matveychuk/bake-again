import assert from 'node:assert/strict';
import test from 'node:test';
import { createPersonalRecordHandler } from './http.ts';
import { disabledPersonalAuthenticator } from './identity.ts';
import {
  fixture,
  accountA,
  accountB,
  identityA,
  identityB,
  now,
} from './test-fixture.ts';
import { GET, POST } from '../../../app/api/personal/v1/record/route.ts';
import type { PersonalResponseV1 } from '../contracts.ts';

const query = 'kind=saved-recipe&key=gluten-free-napoleon';
function request(search = query, init?: RequestInit) {
  return new Request(
    `https://bakeagain.test/api/personal/v1/record?${search}`,
    init,
  );
}
function privateResponse(response: Response) {
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.equal(response.headers.get('vary'), 'Cookie, Authorization');
  assert.equal(response.headers.get('access-control-allow-origin'), null);
}
async function recordResponse(response: Response) {
  const body = (await response.json()) as PersonalResponseV1;
  assert.ok(body.ok);
  return body.record;
}
void test('actual route is disabled even with forged Sites headers, cookies and bearer tokens', async () => {
  const response = await GET(
    request(query, {
      headers: {
        'oai-authenticated-user-id': 'victim',
        'oai-authenticated-user-email': 'victim@example.test',
        cookie: 'accountId=victim; __sites_local_session=1',
        authorization: 'Bearer invented',
      },
    }),
  );
  assert.equal(response.status, 503);
  privateResponse(response);
  const body = (await response.json()) as PersonalResponseV1;
  assert.ok(!body.ok);
  assert.equal(body.error.code, 'PERSONAL_FEATURES_DISABLED');
});
void test('disabled and anonymous requests never open a database', async () => {
  for (const [auth, status] of [
    [disabledPersonalAuthenticator, 503],
    [{ authenticate: async () => null }, 401],
  ] as const) {
    let touched = false;
    const handler = createPersonalRecordHandler({
      auth,
      repository: async () => {
        touched = true;
        throw new Error('must not run');
      },
    });
    const response = await handler(request());
    assert.equal(response.status, status);
    assert.equal(touched, false);
    privateResponse(response);
  }
});
void test('account A cannot retrieve account B records; identical record keys remain isolated', async (t) => {
  const f = fixture();
  t.after(() => f.sql.close());
  f.seed(accountB, {
    kind: 'saved-recipe',
    payload: { recipeId: 'gluten-free-napoleon' },
  });
  const handlerA = createPersonalRecordHandler({
    auth: { authenticate: async () => identityA },
    repository: async () => f.repository,
  });
  assert.equal((await handlerA(request())).status, 404);
  const handlerB = createPersonalRecordHandler({
    auth: { authenticate: async () => identityB },
    repository: async () => f.repository,
  });
  const responseB = await handlerB(request());
  assert.equal(responseB.status, 200);
  privateResponse(responseB);
  f.seed(accountA, {
    kind: 'saved-recipe',
    payload: { recipeId: 'gluten-free-napoleon' },
  });
  f.sql
    .prepare('UPDATE personal_records SET revision=2 WHERE account_id=?')
    .run(accountB);
  assert.equal((await recordResponse(await handlerA(request()))).revision, 1);
  assert.equal((await recordResponse(await handlerB(request()))).revision, 2);
});
void test('caller cannot select an account or provider through query, duplicates or injected SQL', async (t) => {
  const f = fixture();
  t.after(() => f.sql.close());
  f.seed(accountB, {
    kind: 'saved-recipe',
    payload: { recipeId: 'gluten-free-napoleon' },
  });
  const handler = createPersonalRecordHandler({
    auth: { authenticate: async () => identityA },
    repository: async () => f.repository,
  });
  for (const bad of [
    `${query}&accountId=${accountB}`,
    `${query}&subject=reader-b`,
    `${query}&key=second`,
    'kind=purchase&key=x',
    'kind=saved-recipe',
    `kind=saved-recipe&key=${'x'.repeat(1025)}`,
  ]) {
    const response = await handler(request(bad));
    assert.equal(response.status, 400);
    privateResponse(response);
  }
  assert.equal(
    (await handler(request("kind=saved-recipe&key=' OR 1=1 --"))).status,
    404,
  );
});
void test('same subject in another issuer, unknown identities, revoked identities and disabled accounts are denied', async (t) => {
  const f = fixture();
  t.after(() => f.sql.close());
  for (const identity of [
    { ...identityA, issuer: 'urn:test:provider:project-two' },
    { ...identityA, subject: 'unknown' },
  ]) {
    const handler = createPersonalRecordHandler({
      auth: { authenticate: async () => identity },
      repository: async () => f.repository,
    });
    assert.equal((await handler(request())).status, 403);
  }
  f.sql
    .prepare('UPDATE personal_identities SET revoked_at=? WHERE account_id=?')
    .run(now, accountA);
  assert.equal(await f.repository.resolveAccount(identityA), null);
  f.sql
    .prepare('UPDATE personal_accounts SET disabled_at=? WHERE id=?')
    .run(now, accountB);
  assert.equal(await f.repository.resolveAccount(identityB), null);
  assert.equal(
    await f.repository.readRecord(
      accountB,
      'saved-recipe',
      'gluten-free-napoleon',
    ),
    null,
  );
});
void test('private note values cannot cross the account boundary; tombstones contain no old text', async (t) => {
  const f = fixture();
  t.after(() => f.sql.close());
  const key = f.seed(accountB, {
    kind: 'recipe-note',
    payload: {
      recipeId: 'gluten-free-napoleon',
      recipeVersionId: 'v2',
      configuration: { kind: 'base' },
      text: 'Private B text',
    },
  });
  assert.equal(
    await f.repository.readRecord(accountA, 'recipe-note', key),
    null,
  );
  f.sql
    .prepare(
      'UPDATE personal_records SET payload_json=NULL, deleted_at=?, updated_at=?, revision=2 WHERE account_id=?',
    )
    .run(now, now, accountB);
  const record = await f.repository.readRecord(accountB, 'recipe-note', key);
  assert.equal(record?.payload, null);
  assert.equal(record?.revision, 2);
  assert.equal(record?.deletedAt, new Date(now).toISOString());
});
void test('provider/database failures expose no raw error or PII and remain non-cacheable', async (t) => {
  const f = fixture();
  t.after(() => f.sql.close());
  for (const location of ['auth', 'database']) {
    const handler = createPersonalRecordHandler({
      auth: {
        authenticate: async () => {
          if (location === 'auth') throw new Error('secret@example.test');
          return identityA;
        },
      },
      repository: async () => {
        throw new Error('SQL private note');
      },
    });
    const response = await handler(request());
    assert.equal(response.status, 503);
    privateResponse(response);
    const body = await response.text();
    assert.doesNotMatch(body, /secret@example|SQL private|reader-a/);
  }
});
void test('malformed verified identity fails before database access', async () => {
  for (const identity of [
    { ...identityA, subject: 'bad\nsubject' },
    { ...identityA, issuer: '' },
    { ...identityA, subject: 'x'.repeat(1025) },
  ]) {
    let touched = false;
    const handler = createPersonalRecordHandler({
      auth: { authenticate: async () => identity },
      repository: async () => {
        touched = true;
        throw new Error('must not run');
      },
    });
    assert.equal((await handler(request())).status, 503);
    assert.equal(touched, false);
  }
});
void test('invalid stored payload and mismatched key fail closed instead of returning arbitrary JSON', async (t) => {
  const f = fixture();
  t.after(() => f.sql.close());
  f.seed(accountA, {
    kind: 'saved-recipe',
    payload: { recipeId: 'gluten-free-napoleon' },
  });
  const handler = createPersonalRecordHandler({
    auth: { authenticate: async () => identityA },
    repository: async () => f.repository,
  });
  for (const body of [
    { email: 'private@example.test' },
    { recipeId: 'another-recipe' },
    { recipeId: 'gluten-free-napoleon', status: 'Tested' },
  ]) {
    f.sql
      .prepare('UPDATE personal_records SET payload_json=?')
      .run(JSON.stringify(body));
    const response = await handler(request());
    assert.equal(response.status, 503);
    privateResponse(response);
  }
});
void test('phase A rejects writes and sets Allow; no request payload is persisted', async () => {
  const response = await POST(
    request(query, { method: 'POST', body: '{"accountId":"victim"}' }),
  );
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET');
  privateResponse(response);
});
