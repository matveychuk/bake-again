import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { dashboardMigrationSql } from '../../../scripts/personal-supabase-migration.mjs';
import type {
  PersonalKind,
  PersonalPayloadsV1,
  PersonalDataV1,
} from '../contracts.ts';
import { personalRecordKey } from '../validation.ts';
const a = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  b = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const sa = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
  sb = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1';
const issuer = 'https://abcdefghijklmnopqrst.supabase.co/auth/v1';
async function setup(syncSql?: string) {
  const db = new PGlite();
  await db.exec(`CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE SCHEMA auth;
 CREATE TABLE auth.users(id uuid PRIMARY KEY,email_confirmed_at timestamptz,is_anonymous boolean,banned_until timestamptz);
 CREATE TABLE auth.sessions(id uuid PRIMARY KEY,user_id uuid,not_after timestamptz);
 CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$ SELECT COALESCE(NULLIF(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
 CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT NULLIF(auth.jwt()->>'sub','')::uuid $$;
 GRANT USAGE ON SCHEMA auth TO anon,authenticated;
 ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon,authenticated;`);
  for (const file of [
    '20261009183000_personal_foundation.sql',
    '20261009220000_personal_sync.sql',
  ])
    await db.exec(
      syncSql && file.includes('personal_foundation') ? dashboardMigrationSql() : file.includes('personal_sync') && syncSql ? syncSql : readFileSync(
        new URL('../../../supabase/migrations/' + file, import.meta.url),
        'utf8',
      ),
    );
  await assert.rejects(
    db.query("SELECT public.personal_sync('provision')"),
    /PERSONAL_FEATURES_DISABLED/,
  );
  const internalRls = await db.query<{ protected: boolean }>(`SELECT count(*)=3 AND bool_and(relrowsecurity) AS protected FROM pg_class WHERE oid IN ('bake_again_private.personal_sync_settings'::regclass,'bake_again_private.personal_receipts'::regclass,'bake_again_private.personal_imports'::regclass)`);
  assert.equal(internalRls.rows[0].protected, true);
  await db.exec(
    'UPDATE bake_again_private.personal_sync_settings SET enabled=true',
  );
  await db.query(
    'INSERT INTO auth.users VALUES ($1,now(),false,NULL),($2,now(),false,NULL)',
    [a, b],
  );
  await db.query('INSERT INTO auth.sessions VALUES ($1,$2,NULL),($3,$4,NULL)', [
    sa,
    a,
    sb,
    b,
  ]);
  return db;
}
async function as(
  db: PGlite,
  user: string,
  action: () => Promise<unknown>,
  extra = {},
) {
  await db.query("SELECT set_config('request.jwt.claims',$1,false)", [
    JSON.stringify({
      sub: user,
      iss: issuer,
      role: 'authenticated',
      session_id: user === a ? sa : sb,
      ...extra,
    }),
  ]);
  await db.exec('SET ROLE authenticated');
  try {
    return await action();
  } finally {
    await db.exec('RESET ROLE');
  }
}
async function rpc(db: PGlite, action: string, input: unknown = {}) {
  return (
    await db.query<{
      data: {
        accountId: string;
        records: {
          kind: string;
          revision: number;
          payload_json: string | null;
        }[];
        acknowledgements: { revision: number }[];
        alreadyImported: boolean;
      };
    }>('SELECT public.personal_sync($1,$2::jsonb) AS data', [
      action,
      JSON.stringify(input),
    ])
  ).rows[0].data;
}
const put = <K extends PersonalKind>(
  kind: K,
  payload: PersonalPayloadsV1[K],
  revision = 0,
  operationId = crypto.randomUUID(),
) => ({
  schemaVersion: 1,
  operationId,
  expectedRevision: revision,
  action: 'put',
  kind,
  key: personalRecordKey({ kind, payload } as PersonalDataV1),
  payload,
});
void test('C migration: verified sessions, direct RPC validation, A/B RLS, CAS, atomic import, deletion, retries and restore', async (t) => {
  const db = await setup();
  t.after(() => db.close());
  const saved = put('saved-recipe', { recipeId: 'napoleon' });
  let accountA = '';
  await as(db, a, async () => {
    await assert.rejects(rpc(db, 'snapshot'), /ACCOUNT_UNAVAILABLE/);
    accountA = (await rpc(db, 'provision')).accountId;
    assert.equal((await rpc(db, 'provision')).accountId, accountA);
    await rpc(db, 'mutate', { mutations: [saved] });
    const ack = await rpc(db, 'mutate', { mutations: [saved] });
    assert.equal(ack.acknowledgements[0].revision, 1);
    await assert.rejects(
      rpc(db, 'mutate', {
        mutations: [{ ...saved, payload: { recipeId: 'other' }, key: 'other' }],
      }),
      /OPERATION_REUSED/,
    );
    await assert.rejects(
      rpc(db, 'mutate', {
        mutations: [put('saved-recipe', { recipeId: 'napoleon' })],
      }),
      /REVISION_CONFLICT/,
    );
    for (const mutation of [
      {
        ...put('collection', { id: 'x', name: 'ok', recipeIds: [] }),
        payload: { id: 'x', name: 'ok', recipeIds: [], accountId: 'forged' },
      },
      { ...saved, operationId: null },
      { ...saved, schemaVersion: '1' },
      { ...saved, key: 'different', operationId: crypto.randomUUID() },
    ])
      await assert.rejects(
        rpc(db, 'mutate', { mutations: [mutation] }),
        /INVALID_REQUEST/,
      );
    await assert.rejects(
      db.exec('DELETE FROM public.personal_records'),
      /permission denied/,
    );
    const note = put('recipe-note', {
      recipeId: 'napoleon',
      recipeVersionId: 'v1',
      configuration: { kind: 'base' },
      text: 'First',
    });
    await rpc(db, 'mutate', { mutations: [note] });
    const browser1 = put(
      'recipe-note',
      { ...note.payload, text: 'Device one' },
      1,
    );
    const browser2 = put(
      'recipe-note',
      { ...note.payload, text: 'Device two' },
      1,
    );
    await rpc(db, 'mutate', { mutations: [browser1] });
    await assert.rejects(
      rpc(db, 'mutate', { mutations: [browser2] }),
      /REVISION_CONFLICT/,
    );
    const deletion = {
      schemaVersion: 1,
      operationId: crypto.randomUUID(),
      expectedRevision: 1,
      action: 'delete',
      kind: saved.kind,
      key: saved.key,
    };
    await rpc(db, 'mutate', { mutations: [deletion] });
    await rpc(db, 'mutate', { mutations: [saved] }); // lost-response retry must not revive deleted record
    const snapshot = await rpc(db, 'snapshot');
    assert.equal(
      snapshot.records.find((r) => r.kind === 'saved-recipe')?.revision,
      2,
    );
    assert.equal(
      snapshot.records.find((r) => r.kind === 'saved-recipe')?.payload_json,
      null,
    );
    await assert.rejects(
      rpc(db, 'mutate', { mutations: [put('saved-recipe', saved.payload)] }),
      /REVISION_CONFLICT/,
    );
    const collection = put('collection', {
      id: 'weekend',
      name: 'На вихідні',
      recipeIds: ['napoleon'],
    });
    await rpc(db, 'import', {
      mutations: [put('saved-recipe', saved.payload), collection],
    });
    assert.equal(
      (await rpc(db, 'import', { mutations: [collection] })).alreadyImported,
      true,
    );
    assert.equal((await rpc(db, 'export')).records.length, 3);
  });
  await as(db, b, async () => {
    assert.notEqual((await rpc(db, 'provision')).accountId, accountA);
    assert.equal((await rpc(db, 'snapshot')).records.length, 0);
    assert.equal(
      (await db.query('SELECT * FROM public.personal_records')).rows.length,
      0,
    );
    await rpc(db, 'mutate', { mutations: [saved] }); // operation UUID is scoped to owner
  });
  for (const extra of [
    { session_id: sb },
    { is_anonymous: true },
    { role: 'anon' },
  ])
    await as(
      db,
      a,
      async () => {
        await assert.rejects(rpc(db, 'snapshot'), /AUTH_REQUIRED/);
        assert.equal(
          (await db.query('SELECT * FROM public.personal_records')).rows.length,
          0,
        );
      },
      extra,
    );
  await as(db, a, async () => {
    await rpc(db, 'erase', { confirm: 'DELETE_PERSONAL_DATA' });
    await assert.rejects(rpc(db, 'provision'), /ACCOUNT_UNAVAILABLE/);
    assert.equal(
      (await db.query('SELECT * FROM public.personal_records')).rows.length,
      0,
    );
  });
  await as(db, b, async () =>
    assert.equal((await rpc(db, 'export')).records.length, 1),
  );
  await db.exec('SET ROLE anon');
  await assert.rejects(rpc(db, 'provision'), /permission denied/);
  await db.exec('RESET ROLE');
  await db.query('DELETE FROM auth.sessions WHERE user_id=$1', [b]);
  await as(
    db,
    b,
    async () => await assert.rejects(rpc(db, 'snapshot'), /AUTH_REQUIRED/),
  );
  const restored = new PGlite({ loadDataDir: await db.dumpDataDir() });
  t.after(() => restored.close());
  assert.equal(
    (await restored.query('SELECT * FROM public.personal_records')).rows.length,
    1,
  );
  await restored.query('INSERT INTO auth.sessions VALUES ($1,$2,NULL)',[sb,b]);
  await as(restored,b,async()=>assert.equal((await rpc(restored,'snapshot')).records.length,1));
  await as(restored,a,async()=>await assert.rejects(rpc(restored,'snapshot'),/ACCOUNT_UNAVAILABLE/));
});

void test('direct PostgreSQL RPC validates all five contracts, import refuses duplication and batch failure is atomic', async (t) => {
  const db = await setup();
  t.after(() => db.close());
  await as(db, a, async () => {
    await rpc(db, 'provision');
    const now = '2026-10-09T00:00:00.000Z';
    const shopping = put('shopping-item', {
      id: 'flour:g',
      ingredientId: 'flour',
      quantity: { kind: 'exact', value: 100, unit: 'g' },
      checked: false,
      createdAt: now,
      updatedAt: now,
      sources: [
        {
          recipeId: 'napoleon',
          recipeVersionId: 'v1',
          ingredientLineId: 'flour',
          sectionId: 'dough',
          selectedIngredientId: 'flour',
          configurationKey: 'base',
          batchId: 'batch-one',
        },
      ],
    });
    const bake = put('bake-record', {
      recipeId: 'napoleon',
      recipeVersionId: 'v1',
      configuration: {
        kind: 'adjusted',
        geometryId: 'round',
        quantityAdjustment: { mode: 'batchScale', factor: 1.5 },
      },
      completedAt: now,
      note: 'Успішно',
      noteUpdatedAt: now,
    });
    await rpc(db, 'import', { mutations: [shopping, bake] });
    await rpc(db, 'import', { mutations: [shopping, bake] });
    const exported = await rpc(db, 'export');
    assert.equal(exported.records.length, 2);
    assert.equal(
      JSON.parse(
        exported.records.find((r) => r.kind === 'shopping-item')!.payload_json!,
      ).quantity.value,
      100,
    );
    for (const payload of [
      {
        ...shopping.payload,
        quantity: { kind: 'exact', value: '100', unit: 'g' },
      },
      { ...shopping.payload, createdAt: '2026-02-30T00:00:00.000Z' },
      { ...shopping.payload, sources: [] },
    ])
      await assert.rejects(
        rpc(db, 'mutate', {
          mutations: [
            {
              ...shopping,
              operationId: crypto.randomUUID(),
              expectedRevision: 1,
              payload,
            },
          ],
        }),
        /INVALID_REQUEST/,
      );
    const note = put('recipe-note', {
      recipeId: 'napoleon',
      recipeVersionId: 'v1',
      configuration: { kind: 'base' },
      text: '😀'.repeat(1001),
    });
    await assert.rejects(
      rpc(db, 'mutate', {
        mutations: [put('saved-recipe', { recipeId: 'new' }), note],
      }),
      /INVALID_REQUEST/,
    );
    assert.equal((await rpc(db, 'snapshot')).records.length, 2); // preceding write rolled back too
    await assert.rejects(
      db.query('SELECT * FROM bake_again_private.personal_receipts'),
      /permission denied/,
    );
  });
  await as(db, b, async () => {
    await rpc(db, 'provision');
    await rpc(db, 'import', { mutations: [] });
    assert.equal((await rpc(db, 'snapshot')).records.length, 0);
  });
  const source = readFileSync(
    new URL(
      '../../../supabase/migrations/20261009220000_personal_sync.sql',
      import.meta.url,
    ),
    'utf8',
  );
  await assert.rejects(db.exec(source), /already exists/);
  await db.exec('ROLLBACK');
  await as(db, a, async () =>
    assert.equal((await rpc(db, 'export')).records.length, 2),
  );
});

void test('sync enforces mutation rate and account capacity without partial data', async (t) => {
  const db = await setup();
  t.after(() => db.close());
  let account = '';
  await as(db, a, async () => {
    account = (await rpc(db, 'provision')).accountId;
  });
  await db.query(
    `INSERT INTO bake_again_private.personal_receipts SELECT $1,gen_random_uuid(),sha256('x'::bytea),'{}',now() FROM generate_series(1,600)`,
    [account],
  );
  await as(
    db,
    a,
    async () =>
      await assert.rejects(
        rpc(db, 'mutate', {
          mutations: [put('saved-recipe', { recipeId: 'new' })],
        }),
        /RATE_LIMITED/,
      ),
  );
  await db.query(
    'DELETE FROM bake_again_private.personal_receipts WHERE account_id=$1',
    [account],
  );
  await db.query(
    `INSERT INTO public.personal_records SELECT $1,'saved-recipe','old-'||n,1,1,NULL,0,0 FROM generate_series(1,1000) n`,
    [account],
  );
  await as(
    db,
    a,
    async () =>
      await assert.rejects(
        rpc(db, 'mutate', {
          mutations: [put('saved-recipe', { recipeId: 'new' })],
        }),
        /PAYLOAD_TOO_LARGE/,
      ),
  );
  assert.equal(
    (
      await db.query(
        'SELECT * FROM public.personal_records WHERE account_id=$1',
        [account],
      )
    ).rows.length,
    1000,
  );
  assert.equal(
    (
      await db.query(
        'SELECT * FROM bake_again_private.personal_receipts WHERE account_id=$1',
        [account],
      )
    ).rows.length,
    0,
  );
});

void test('phase C dashboard wrapper records its own version once and does not replay A',async t=>{
 const sql=dashboardMigrationSql('20261009220000');const db=await setup(sql);t.after(()=>db.close());
 assert.deepEqual((await db.query('SELECT version,name FROM supabase_migrations.schema_migrations ORDER BY version')).rows,[{version:'20261009183000',name:'personal_foundation'},{version:'20261009220000',name:'personal_sync'}]);
 await assert.rejects(db.exec(sql),/already exists/);await db.exec('ROLLBACK');
 assert.equal((await db.query('SELECT * FROM supabase_migrations.schema_migrations')).rows.length,2);
});
