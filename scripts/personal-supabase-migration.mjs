import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export const personalMigrationVersion = '20261009183000';
export const personalMigrationFile = new URL(
  '../supabase/migrations/20261009183000_personal_foundation.sql',
  import.meta.url,
);

/** SQL Editor application records the same version as the CLI, atomically.
 * The local migration file remains the source for replay; no personal data/secrets.
 */
export function dashboardMigrationSql(version = personalMigrationVersion) {
  if (![personalMigrationVersion, '20261009220000'].includes(version))
    throw new Error('Unknown migration');
  const sync = version === '20261009220000';
  const name = sync ? 'personal_sync' : 'personal_foundation';
  const source = readFileSync(
    sync
      ? new URL(
          '../supabase/migrations/20261009220000_personal_sync.sql',
          import.meta.url,
        )
      : personalMigrationFile,
    'utf8',
  );
  const hash = createHash('sha256').update(source).digest('hex');
  const tracking = `
${sync ? '' : `CREATE SCHEMA IF NOT EXISTS supabase_migrations;
CREATE TABLE IF NOT EXISTS supabase_migrations.schema_migrations (
  version text NOT NULL PRIMARY KEY, statements text[], name text
);`}
REVOKE ALL ON SCHEMA supabase_migrations FROM PUBLIC, anon, authenticated;
REVOKE ALL ON supabase_migrations.schema_migrations FROM PUBLIC, anon, authenticated;
INSERT INTO supabase_migrations.schema_migrations(version, name)
VALUES ('${version}', '${name}');
COMMIT;
SELECT version, name FROM supabase_migrations.schema_migrations
WHERE version = '${version}';
`;
  if (!/COMMIT;\s*$/.test(source))
    throw new Error('Expected transaction-delimited migration');
  return `-- Bake Again: exact local migration SHA-256 ${hash}\n${source.replace(/COMMIT;\s*$/, tracking)}`;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const directory = new URL('../outputs/personal/', import.meta.url);
  mkdirSync(directory, { recursive: true });
  const sync = process.argv.includes('--sync');
  writeFileSync(
    new URL(sync ? 'supabase-sync-apply.sql' : 'supabase-apply.sql', directory),
    dashboardMigrationSql(sync ? '20261009220000' : personalMigrationVersion),
  );
  console.log(
    'Prepared local SQL application file. No external request or migration performed.',
  );
}
