import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import {
  dashboardMigrationSql,
  personalMigrationVersion,
} from '../../../scripts/personal-supabase-migration.mjs';

const migration = readFileSync(
  new URL(
    '../../../supabase/migrations/20261009183000_personal_foundation.sql',
    import.meta.url,
  ),
  'utf8',
);
const issuer = 'https://abcdefghijklmnopqrst.supabase.co/auth/v1';
const a = '11111111-1111-4111-8111-111111111111',
  b = '22222222-2222-4222-8222-222222222222';
const ua = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  ub = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

async function database(sql = migration) {
  const db = new PGlite();
  // Real PostgreSQL grants, RLS and constraints. Only the Auth gateway's claim
  // injection is simulated here; this is not a test of live Supabase login.
  await db.exec(`
    CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN;
    CREATE SCHEMA auth;
    CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS
      $$ SELECT COALESCE(NULLIF(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS
      $$ SELECT NULLIF(auth.jwt()->>'sub', '')::uuid $$;
    GRANT USAGE ON SCHEMA auth TO anon, authenticated;
    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO anon, authenticated;
    -- Simulate Supabase's default public grants: migration must revoke them.
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
  `);
  await db.exec(sql);
  await db.query(
    'INSERT INTO public.personal_accounts VALUES ($1, 0, NULL), ($2, 0, NULL)',
    [a, b],
  );
  await db.query(
    'INSERT INTO public.personal_identities VALUES ($1, $2, $3, 0, NULL), ($1, $4, $5, 0, NULL)',
    [issuer, ua, a, ub, b],
  );
  await db.query(
    `INSERT INTO public.personal_records VALUES
    ($1, 'saved-recipe', 'napoleon', 1, 1, '{"recipeId":"napoleon"}', 0, NULL),
    ($2, 'saved-recipe', 'napoleon', 1, 2, '{"recipeId":"napoleon"}', 0, NULL)`,
    [a, b],
  );
  return db;
}

async function asUser<T>(
  db: PGlite,
  subject: string | null,
  action: () => Promise<T>,
  extras = {},
) {
  await db.query("SELECT set_config('request.jwt.claims', $1, false)", [
    JSON.stringify({
      sub: subject,
      iss: issuer,
      role: 'authenticated',
      is_anonymous: false,
      ...extras,
    }),
  ]);
  await db.exec('SET ROLE authenticated');
  try {
    return await action();
  } finally {
    await db.exec('RESET ROLE');
  }
}

void test('Postgres RLS filters unscoped direct reads and forged target filters to the owner', async (t) => {
  const db = await database();
  t.after(() => db.close());
  for (const [subject, account, revision] of [
    [ua, a, 1],
    [ub, b, 2],
  ] as const) {
    await asUser(
      db,
      subject,
      async () => {
        assert.deepEqual(
          (await db.query('SELECT id FROM public.personal_accounts')).rows,
          [{ id: account }],
        );
        assert.deepEqual(
          (await db.query('SELECT account_id FROM public.personal_identities'))
            .rows,
          [{ account_id: account }],
        );
        assert.deepEqual(
          (
            await db.query(
              'SELECT account_id, revision FROM public.personal_records',
            )
          ).rows,
          [{ account_id: account, revision }],
        );
        assert.equal(
          (
            await db.query(
              'SELECT * FROM public.personal_records WHERE account_id=$1',
              [account === a ? b : a],
            )
          ).rows.length,
          0,
        );
      },
      {
        user_metadata: {
          account_id: account === a ? b : a,
          role: 'service_role',
        },
      },
    );
  }
  for (const extra of [
    { iss: 'https://another-project.supabase.co/auth/v1' },
    { is_anonymous: true },
    { role: 'anon' },
  ]) {
    await asUser(
      db,
      ua,
      async () =>
        assert.equal(
          (await db.query('SELECT * FROM public.personal_records')).rows.length,
          0,
        ),
      extra,
    );
  }
  await asUser(db, null, async () =>
    assert.equal(
      (await db.query('SELECT * FROM public.personal_records')).rows.length,
      0,
    ),
  );
});

void test('Postgres refuses anonymous access, public helper execution, and all authenticated writes', async (t) => {
  const db = await database();
  t.after(() => db.close());
  await db.exec('SET ROLE anon');
  for (const sql of [
    'SELECT * FROM public.personal_records',
    'SELECT bake_again_private.current_account_id()',
  ])
    await assert.rejects(db.query(sql), /permission denied/);
  await db.exec('RESET ROLE');
  await asUser(db, ua, async () => {
    for (const sql of [
      'DELETE FROM public.personal_records',
      'UPDATE public.personal_accounts SET disabled_at=NULL',
      'INSERT INTO public.personal_accounts VALUES (gen_random_uuid(),0,NULL)',
      'TRUNCATE public.personal_records',
      `UPDATE public.personal_identities SET subject='${ub}'`,
    ])
      await assert.rejects(db.query(sql), /permission denied/);
  });
  const functions = await db.query<{ prosecdef: boolean; proconfig: string[] }>(
    `SELECT prosecdef, proconfig FROM pg_proc WHERE proname='current_account_id'`,
  );
  assert.equal(functions.rows[0].prosecdef, true);
  assert.deepEqual(functions.rows[0].proconfig, ['search_path=""']);
});

void test('Postgres rechecks disabled accounts and revoked identities on every read', async (t) => {
  const db = await database();
  t.after(() => db.close());
  await db.query(
    'UPDATE public.personal_accounts SET disabled_at=1 WHERE id=$1',
    [a],
  );
  await asUser(db, ua, async () => {
    for (const table of [
      'personal_accounts',
      'personal_identities',
      'personal_records',
    ])
      assert.equal(
        (await db.query(`SELECT * FROM public.${table}`)).rows.length,
        0,
      );
  });
  await db.query(
    'UPDATE public.personal_identities SET revoked_at=1 WHERE account_id=$1',
    [b],
  );
  await asUser(db, ub, async () =>
    assert.equal(
      (await db.query('SELECT * FROM public.personal_records')).rows.length,
      0,
    ),
  );
});

void test('Postgres migration preserves existing tables and fails atomically on replay', async (t) => {
  const db = await database();
  t.after(() => db.close());
  await db.exec(
    "CREATE TABLE unrelated_guard (value text); INSERT INTO unrelated_guard VALUES ('keep')",
  );
  await assert.rejects(db.exec(migration), /already exists/);
  await db.exec('ROLLBACK');
  assert.equal(
    (await db.query('SELECT * FROM public.personal_records')).rows.length,
    2,
  );
  assert.deepEqual((await db.query('SELECT * FROM unrelated_guard')).rows, [
    { value: 'keep' },
  ]);
  assert.doesNotMatch(
    migration,
    /assistant_|DROP TABLE|CREATE TRIGGER|INSERT INTO|UPDATE public\./,
  );
});

void test('Postgres constraints bound payloads, identities and tombstones; delete cascades only one account', async (t) => {
  const db = await database();
  t.after(() => db.close());
  for (const [column, value] of [
    ['revision', 0],
    ['schema_version', 2],
    ['kind', 'purchase'],
    ['record_key', ''],
    ['payload_json', 'invalid JSON'],
    ['payload_json', '[]'],
    ['payload_json', 'null'],
    ['payload_json', JSON.stringify({ text: 'я'.repeat(17000) })],
    ['deleted_at', 1],
    ['updated_at', -1],
  ] as const)
    await assert.rejects(
      db.query(
        `UPDATE public.personal_records SET ${column}=$1 WHERE account_id=$2`,
        [value, a],
      ),
    );
  await assert.rejects(
    db.query(
      'UPDATE public.personal_identities SET subject=$1 WHERE account_id=$2',
      [ua, b],
    ),
  );
  await db.query(
    'UPDATE public.personal_records SET payload_json=NULL, deleted_at=updated_at, revision=2 WHERE account_id=$1',
    [a],
  );
  assert.deepEqual(
    (
      await db.query(
        'SELECT payload_json, deleted_at FROM public.personal_records WHERE account_id=$1',
        [a],
      )
    ).rows,
    [{ payload_json: null, deleted_at: 0 }],
  );
  await db.query('DELETE FROM public.personal_accounts WHERE id=$1', [a]);
  assert.deepEqual(
    (await db.query('SELECT account_id FROM public.personal_records')).rows,
    [{ account_id: b }],
  );
  assert.deepEqual(
    (await db.query('SELECT account_id FROM public.personal_identities')).rows,
    [{ account_id: b }],
  );
});

void test('Postgres backup data restores with the same IDs, revisions and RLS isolation', async (t) => {
  const source = await database();
  t.after(() => source.close());
  // Local PostgreSQL data-directory restore preserves schema/data/roles. This
  // proves local restore semantics, not access to a hosted backup service.
  const dump = await source.dumpDataDir();
  const recovered = new PGlite({ loadDataDir: dump });
  t.after(() => recovered.close());
  await asUser(recovered, ua, async () =>
    assert.deepEqual(
      (
        await recovered.query(
          'SELECT account_id, revision FROM public.personal_records',
        )
      ).rows,
      [{ account_id: a, revision: 1 }],
    ),
  );
});

void test('SQL Editor wrapper records migration history atomically and prevents an untracked replay', async (t) => {
  const db = await database(dashboardMigrationSql());
  t.after(() => db.close());
  assert.deepEqual(
    (
      await db.query(
        'SELECT version, name FROM supabase_migrations.schema_migrations',
      )
    ).rows,
    [{ version: personalMigrationVersion, name: 'personal_foundation' }],
  );
  await assert.rejects(db.exec(dashboardMigrationSql()), /already exists/);
  await db.exec('ROLLBACK');
  assert.equal(
    (await db.query('SELECT * FROM supabase_migrations.schema_migrations')).rows
      .length,
    1,
  );
  await asUser(db, ua, async () => {
    await assert.rejects(
      db.query('SELECT * FROM supabase_migrations.schema_migrations'),
      /permission denied/,
    );
    assert.equal(
      (await db.query('SELECT * FROM public.personal_records')).rows.length,
      1,
    );
  });
});
