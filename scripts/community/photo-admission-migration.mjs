/** Exact SQL Editor transaction + migration history for the initial two files. */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const photoMigrationFiles = [
  ['20261031210000', 'community_probe'],
  ['20261031223000', 'community_photo_admissions'],
];
export function communityPhotoMigrationSql() {
  const parts = ['BEGIN;'];
  for (const [version, name] of photoMigrationFiles) {
    const source = readFileSync(
      new URL(
        `../../supabase/migrations/${version}_${name}.sql`,
        import.meta.url,
      ),
      'utf8',
    );
    if (!/^BEGIN;$/m.test(source) || !/COMMIT;\s*$/.test(source))
      throw new Error('Expected transaction-delimited migration');
    parts.push(
      `-- ${version}: SHA-256 ${createHash('sha256').update(source).digest('hex')}`,
    );
    parts.push(source.replace(/^BEGIN;\s*$/m, '').replace(/COMMIT;\s*$/, ''));
  }
  parts.push(`INSERT INTO supabase_migrations.schema_migrations(version,name) VALUES
    ('20261031210000','community_probe'),('20261031223000','community_photo_admissions');
COMMIT;
SELECT version,name FROM supabase_migrations.schema_migrations
WHERE version IN ('20261031210000','20261031223000') ORDER BY version;`);
  return parts.join('\n');
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const target = new URL('../../tmp/community-edge-probe/', import.meta.url);
  mkdirSync(target, { recursive: true });
  writeFileSync(
    new URL('apply-admissions.sql', target),
    communityPhotoMigrationSql(),
  );
  console.log(
    `Prepared ${fileURLToPath(new URL('apply-admissions.sql', target))}; no external mutation.`,
  );
}
