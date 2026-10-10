import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import {
  fixture,
  accountA,
  accountB,
  oldMigration,
  newMigration,
} from './test-fixture.ts';
import {
  createD1AssistantQuotaStore,
  type QuotaDatabase,
  type QuotaStatement,
} from '../../assistant/server/quotas.ts';

void test('fresh migrations and foreign keys are valid; no schema change targets AI tables', (t) => {
  const f = fixture();
  t.after(() => f.sql.close());
  assert.equal(
    f.sql.prepare('PRAGMA integrity_check').get()!.integrity_check,
    'ok',
  );
  assert.deepEqual(f.sql.prepare('PRAGMA foreign_key_check').all(), []);
  assert.doesNotMatch(
    newMigration,
    /^\s*(?:ALTER|DROP|DELETE|UPDATE|INSERT)\b/im,
  );
  assert.doesNotMatch(newMigration, /assistant_/i);
  const journal = JSON.parse(
    readFileSync(
      new URL('../../../drizzle/meta/_journal.json', import.meta.url),
      'utf8',
    ),
  );
  assert.deepEqual(
    journal.entries.map((e: { tag: string }) => e.tag),
    ['0000_assistant_quotas', '0001_personal_foundation'],
  );
});
void test('upgrade preserves existing quota data/indexes and the old quota code still reserves/releases', async (t) => {
  const sql = new DatabaseSync(':memory:');
  t.after(() => sql.close());
  sql.exec(oldMigration);
  sql.exec(
    "INSERT INTO assistant_quota_reservations VALUES ('before', 'session', 'network', unixepoch('now'), 0, 17)",
  );
  sql.exec(
    "INSERT INTO assistant_verification_attempts VALUES ('verify-before', 'network', unixepoch('now'))",
  );
  const before = sql
    .prepare(
      "SELECT name,sql FROM sqlite_master WHERE name LIKE 'assistant_%' ORDER BY name",
    )
    .all();
  const rows = sql.prepare('SELECT * FROM assistant_quota_reservations').all();
  sql.exec(newMigration);
  assert.deepEqual(
    sql
      .prepare(
        "SELECT name,sql FROM sqlite_master WHERE name LIKE 'assistant_%' ORDER BY name",
      )
      .all(),
    before,
  );
  assert.deepEqual(
    sql.prepare('SELECT * FROM assistant_quota_reservations').all(),
    rows,
  );
  assert.equal(
    sql
      .prepare('SELECT count(*) AS n FROM assistant_verification_attempts')
      .get()!.n,
    1,
  );
  const db: QuotaDatabase = {
    prepare(query) {
      const statement = sql.prepare(query.replace(/\?(\d+)/g, ':p$1'));
      let args: Record<string, string | number | null> = {};
      const wrapper: QuotaStatement = {
        bind(...values) {
          args = Object.fromEntries(values.map((v, i) => [`p${i + 1}`, v]));
          return wrapper;
        },
        async first<T>() {
          return (statement.get(args) as T | undefined) ?? null;
        },
        async run() {
          return statement.run(args);
        },
      };
      return wrapper;
    },
  };
  const store = createD1AssistantQuotaStore(db, {
    dailyMicrousd: 1000,
    monthlyMicrousd: 1000,
  });
  await (
    await store.reserve(
      { sessionKey: 'new-session', networkKey: 'new-network' },
      'after',
      23,
    )
  ).release();
  assert.equal(
    sql
      .prepare(
        'SELECT sum(reserved_microusd) AS cost FROM assistant_quota_reservations',
      )
      .get()!.cost,
    40,
  );
});
void test('DB rejects orphan owners, duplicate identity mapping, invalid domain/version and invalid tombstones', (t) => {
  const f = fixture();
  t.after(() => f.sql.close());
  const insert = f.sql.prepare(
    'INSERT INTO personal_records(account_id,kind,record_key,schema_version,revision,payload_json,updated_at,deleted_at) VALUES (?,?,?,?,?,?,?,?)',
  );
  for (const args of [
    [
      'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
      'saved-recipe',
      'a',
      1,
      1,
      '{}',
      0,
      null,
    ],
    [accountA, 'purchase', 'a', 1, 1, '{}', 0, null],
    [accountA, 'saved-recipe', 'a', 2, 1, '{}', 0, null],
    [accountA, 'saved-recipe', 'a', 1, 0, '{}', 0, null],
    [accountA, 'saved-recipe', 'a', 1, 1, 'not JSON', 0, null],
    [
      accountA,
      'saved-recipe',
      'a',
      1,
      1,
      JSON.stringify('я'.repeat(17000)),
      0,
      null,
    ],
    [accountA, 'saved-recipe', 'a', 1, 1, '{}', 0, 0],
    [accountA, 'saved-recipe', 'a', 1, 1, null, 0, null],
  ])
    assert.throws(() => insert.run(...args));
  assert.throws(() =>
    f.sql
      .prepare('UPDATE personal_identities SET subject=? WHERE account_id=?')
      .run('reader-a', accountB),
  );
});
void test('account deletion cascades only its personal domain; other users and AI survive', (t) => {
  const f = fixture();
  t.after(() => f.sql.close());
  for (const account of [accountA, accountB])
    f.seed(account, {
      kind: 'saved-recipe',
      payload: { recipeId: 'gluten-free-napoleon' },
    });
  f.sql.exec(
    "INSERT INTO assistant_quota_reservations VALUES ('keep',null,null,0,0,21)",
  );
  f.sql.prepare('DELETE FROM personal_accounts WHERE id=?').run(accountA);
  assert.equal(
    f.sql
      .prepare('SELECT count(*) AS n FROM personal_records WHERE account_id=?')
      .get(accountA)!.n,
    0,
  );
  assert.equal(
    f.sql
      .prepare(
        'SELECT count(*) AS n FROM personal_identities WHERE account_id=?',
      )
      .get(accountA)!.n,
    0,
  );
  assert.equal(
    f.sql
      .prepare('SELECT count(*) AS n FROM personal_records WHERE account_id=?')
      .get(accountB)!.n,
    1,
  );
  assert.equal(
    f.sql
      .prepare('SELECT reserved_microusd FROM assistant_quota_reservations')
      .get()!.reserved_microusd,
    21,
  );
});
void test('personal tables can be restored to a fresh schema with stable IDs and tombstones', (t) => {
  const f = fixture();
  const target = new DatabaseSync(':memory:');
  t.after(() => {
    f.sql.close();
    target.close();
  });
  target.exec('PRAGMA foreign_keys=ON');
  target.exec(oldMigration);
  target.exec(newMigration);
  f.seed(accountA, {
    kind: 'saved-recipe',
    payload: { recipeId: 'gluten-free-napoleon' },
  });
  f.seed(accountB, {
    kind: 'saved-recipe',
    payload: { recipeId: 'crinkle-cookies' },
  });
  f.sql
    .prepare(
      'UPDATE personal_records SET payload_json=NULL, deleted_at=updated_at WHERE account_id=?',
    )
    .run(accountB);
  for (const table of [
    'personal_accounts',
    'personal_identities',
    'personal_records',
  ]) {
    const rows = f.sql.prepare(`SELECT * FROM ${table}`).all();
    for (const row of rows)
      target
        .prepare(
          `INSERT INTO ${table} (${Object.keys(row).join(',')}) VALUES (${Object.keys(
            row,
          )
            .map(() => '?')
            .join(',')})`,
        )
        .run(...Object.values(row));
    assert.deepEqual(target.prepare(`SELECT * FROM ${table}`).all(), rows);
  }
  assert.deepEqual(target.prepare('PRAGMA foreign_key_check').all(), []);
});
