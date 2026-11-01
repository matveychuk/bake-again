import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { communityPhotoMigrationSql } from './photo-admission-migration.mjs';
import { communityReviewsMigrationSql } from './reviews-public-migration.mjs';
void test('the public reviews wrapper applies on top of the hosted community schema once', async (t) => {
  const db = new PGlite();
  t.after(() => db.close());
  await db.exec(
    'CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role; CREATE SCHEMA supabase_migrations; CREATE TABLE supabase_migrations.schema_migrations (version text PRIMARY KEY, name text);',
  );
  await db.exec(communityPhotoMigrationSql());
  const sql = communityReviewsMigrationSql();
  await db.exec(sql);
  assert.equal(
    (await db.query('SELECT * FROM supabase_migrations.schema_migrations')).rows
      .length,
    3,
  );
  await assert.rejects(db.exec(sql), /already exists/);
  await db.exec('ROLLBACK');
});
