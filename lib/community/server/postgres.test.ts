import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { prepareGuestSubmission } from './submission.ts';

const guest = {
  operationId: '11111111-1111-4111-8111-111111111111',
  authorToken: 'a'.repeat(64),
  recipeId: 'crepes',
  name: 'Олена',
  email: 'guest@example.com',
  text: 'Вдалося!',
  rating: 4,
};
const scope = {
  recipeId: 'crepes',
  version: 'test-v1',
  configuration: 'base',
};
const context = {
  fingerprintSecret: 'synthetic-test-key-'.repeat(3),
  browserId: 'b'.repeat(64),
  moderation: 'published' as const,
};
const migrationSql = (name: string) =>
  readFileSync(
    new URL(`../../../supabase/migrations/${name}.sql`, import.meta.url),
    'utf8',
  );
const migration = migrationSql('20261031210000_community_probe');
const later = [
  '20261031223000_community_photo_admissions',
  '20261101190000_community_reviews_public',
].map(migrationSql);

void test('community PostgreSQL transaction, permissions, retry, duplicates and rolling quota', async (t) => {
  const db = new PGlite();
  t.after(() => db.close());
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
    CREATE TABLE personal_sentinel (value text); INSERT INTO personal_sentinel VALUES ('keep');`);
  await db.exec(migration);
  for (const sql of later) await db.exec(sql);
  const submit = async (command: unknown) => {
    await db.exec('SET ROLE service_role');
    try {
      return (
        await db.query<{
          result: { id: string; status: string; replayed: boolean };
        }>('SELECT public.community_submit_probe($1::jsonb) AS result', [
          JSON.stringify(command),
        ])
      ).rows[0].result;
    } finally {
      await db.exec('RESET ROLE');
    }
  };
  const command = await prepareGuestSubmission(guest, scope, context);
  const first = await submit(command);
  assert.equal(first.status, 'published');
  assert.equal(first.replayed, false);
  assert.deepEqual(Object.keys(first).sort(), ['id', 'replayed', 'status']);
  assert.deepEqual(await submit(command), { ...first, replayed: true });
  await assert.rejects(
    submit({ ...command, owner_hash: 'c'.repeat(64) }),
    /OPERATION_REUSED/,
  );
  await assert.rejects(
    submit({ ...command, fingerprint: 'c'.repeat(64) }),
    /OPERATION_REUSED/,
  );
  assert.equal(
    (await db.query('SELECT * FROM bake_again_community.contributions')).rows
      .length,
    1,
  );

  for (const role of ['anon', 'authenticated', 'service_role']) {
    await db.exec(`SET ROLE ${role}`);
    await assert.rejects(
      db.query('SELECT * FROM bake_again_community.guest_contacts'),
      /permission denied/,
    );
    await assert.rejects(
      db.query('SELECT * FROM bake_again_community.contributions'),
      /permission denied/,
    );
    if (role !== 'service_role')
      await assert.rejects(
        db.query('SELECT public.community_submit_probe($1::jsonb)', [
          JSON.stringify(command),
        ]),
        /permission denied/,
      );
    await db.exec('RESET ROLE');
  }
  const another = (n: number) =>
    `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
  const duplicate = await submit(
    await prepareGuestSubmission({ ...guest, operationId: another(2) }, scope, {
      ...context,
      browserId: 'd'.repeat(64),
    }),
  );
  // No moderation: a repeated rating from the same email is published too.
  assert.equal(duplicate.status, 'published');
  assert.equal(
    (
      await db.query<{ count: number }>(
        "SELECT count(*)::int FROM bake_again_community.contributions WHERE state='published' AND rating IS NOT NULL",
      )
    ).rows[0].count,
    2,
  );
  // Same unverified email cannot overwrite the earlier contribution or claim it.
  assert.equal(
    (
      await db.query<{ body: string }>(
        'SELECT body FROM bake_again_community.contributions WHERE id=$1',
        [first.id],
      )
    ).rows[0].body,
    guest.text,
  );
  const pending = await submit(
    await prepareGuestSubmission(
      { ...guest, operationId: another(3), email: 'pending@example.com' },
      scope,
      { ...context, moderation: 'pending' },
    ),
  );
  assert.equal(pending.status, 'pending');
  // Private-contact failure rolls back the public-looking contribution too.
  await assert.rejects(
    submit({ ...command, operation_id: another(4), email: null }),
    /null value/,
  );
  assert.equal(
    (
      await db.query(
        'SELECT id FROM bake_again_community.contributions WHERE operation_id=$1',
        [another(4)],
      )
    ).rows.length,
    0,
  );
  for (let n = 5; n < 13; n++)
    await submit(
      await prepareGuestSubmission(
        { ...guest, operationId: another(n), email: `test${n}@example.com` },
        scope,
        context,
      ),
    );
  await assert.rejects(
    submit(
      await prepareGuestSubmission(
        { ...guest, operationId: another(13) },
        scope,
        context,
      ),
    ),
    /RATE_LIMITED/,
  );
  // A retry still works when the daily quota has been reached.
  assert.equal((await submit(command)).replayed, true);
  assert.deepEqual((await db.query('SELECT * FROM personal_sentinel')).rows, [
    { value: 'keep' },
  ]);
  assert.equal(
    (
      await db.query<{ email_verified: boolean }>(
        'SELECT email_verified FROM bake_again_community.guest_contacts LIMIT 1',
      )
    ).rows[0].email_verified,
    false,
  );
  await assert.rejects(db.exec(migration), /already exists/);
  await db.exec('ROLLBACK');
  assert.equal((await submit(command)).id, first.id);
});

void test('public review list exposes only published fields and stored photos', async (t) => {
  const db = new PGlite();
  t.after(() => db.close());
  await db.exec(
    'CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;',
  );
  await db.exec(migration);
  for (const sql of later) await db.exec(sql);
  const asService = async <T>(sql: string, params: unknown[]) => {
    await db.exec('SET ROLE service_role');
    try {
      return (await db.query<{ result: T }>(sql, params)).rows[0].result;
    } finally {
      await db.exec('RESET ROLE');
    }
  };
  const submitted = await asService<{ id: string }>(
    'SELECT public.community_submit_probe($1::jsonb) AS result',
    [
      JSON.stringify(
        await prepareGuestSubmission(
          { ...guest, rating: null },
          scope,
          context,
        ),
      ),
    ],
  );
  const hidden = await asService<{ id: string }>(
    'SELECT public.community_submit_probe($1::jsonb) AS result',
    [
      JSON.stringify(
        await prepareGuestSubmission(
          {
            ...guest,
            operationId: '22222222-2222-4222-8222-222222222222',
            text: 'Приховано',
          },
          scope,
          context,
        ),
      ),
    ],
  );
  await db.query(
    "UPDATE bake_again_community.contributions SET state='hidden' WHERE id=$1",
    [hidden.id],
  );
  const photo = (n: number, state: string) =>
    db.query(
      `INSERT INTO bake_again_community.photo_upload_admissions
      (id,contribution_id,admission_hash,request_hash,mime,expected_bytes,sha256,object_base,state,issued_at,expires_at)
      VALUES ($1::uuid,$2::uuid,$3,$3,'image/webp',10,$3,$2::uuid::text || '/' || $1::uuid::text,$4,now(),now()+interval '120 seconds')`,
      [
        `33333333-3333-4333-8333-${String(n).padStart(12, '0')}`,
        submitted.id,
        'e'.repeat(64),
        state,
      ],
    );
  await photo(1, 'stored');
  await photo(2, 'failed');
  const list = await asService<Record<string, unknown>[]>(
    'SELECT public.community_recipe_reviews($1) AS result',
    ['crepes'],
  );
  assert.equal(list.length, 1);
  assert.deepEqual(Object.keys(list[0]).sort(), [
    'createdAt',
    'id',
    'name',
    'photos',
    'rating',
    'text',
  ]);
  assert.equal(list[0].name, guest.name);
  assert.equal(list[0].rating, null);
  assert.deepEqual(list[0].photos, ['33333333-3333-4333-8333-000000000001']);
  assert.ok(!JSON.stringify(list).includes(guest.email));
  const served = await asService<{ mime: string } | null>(
    'SELECT public.community_public_photo($1) AS result',
    ['33333333-3333-4333-8333-000000000001'],
  );
  assert.equal(served?.mime, 'image/webp');
  assert.equal(
    await asService('SELECT public.community_public_photo($1) AS result', [
      '33333333-3333-4333-8333-000000000002',
    ]),
    null,
  );
  await db.query(
    "UPDATE bake_again_community.contributions SET state='deleted' WHERE id=$1",
    [submitted.id],
  );
  assert.equal(
    await asService('SELECT public.community_public_photo($1) AS result', [
      '33333333-3333-4333-8333-000000000001',
    ]),
    null,
  );
  for (const role of ['anon', 'authenticated']) {
    await db.exec(`SET ROLE ${role}`);
    await assert.rejects(
      db.query('SELECT public.community_recipe_reviews($1)', ['crepes']),
      /permission denied/,
    );
    await db.exec('RESET ROLE');
  }
});
