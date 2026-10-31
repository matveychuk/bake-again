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
  kind: 'result',
  experience: 'as-written',
  cooked: true,
  rating: 4,
};
const scope = {
  recipeId: 'crepes',
  version: 'test-v1',
  configuration: 'base',
  isBase: true,
};
const context = {
  fingerprintSecret: 'synthetic-test-key-'.repeat(3),
  browserId: 'b'.repeat(64),
  moderation: 'published' as const,
};
const migration = readFileSync(
  new URL(
    '../../../supabase/migrations/20261031210000_community_probe.sql',
    import.meta.url,
  ),
  'utf8',
);

void test('community PostgreSQL transaction, permissions, retry, duplicates and rolling quota', async (t) => {
  const db = new PGlite();
  t.after(() => db.close());
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
    CREATE TABLE personal_sentinel (value text); INSERT INTO personal_sentinel VALUES ('keep');`);
  await db.exec(migration);
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
  assert.equal(duplicate.status, 'pending');
  assert.equal(
    (
      await db.query<{ count: number }>(
        "SELECT count(*)::int FROM bake_again_community.contributions WHERE state='published' AND rating IS NOT NULL",
      )
    ).rows[0].count,
    1,
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
