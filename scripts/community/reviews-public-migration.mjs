/** SQL Editor transaction + migration history for public reviews (2026-11-01). */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const version = '20261101190000';
const name = 'community_reviews_public';
export function communityReviewsMigrationSql() {
  const source = readFileSync(
    new URL(
      `../../supabase/migrations/${version}_${name}.sql`,
      import.meta.url,
    ),
    'utf8',
  );
  if (!/^BEGIN;$/m.test(source) || !/COMMIT;\s*$/.test(source))
    throw new Error('Expected transaction-delimited migration');
  return [
    'BEGIN;',
    `-- ${version}: SHA-256 ${createHash('sha256').update(source).digest('hex')}`,
    source.replace(/^BEGIN;\s*$/m, '').replace(/COMMIT;\s*$/, ''),
    `INSERT INTO supabase_migrations.schema_migrations(version,name) VALUES ('${version}','${name}');
COMMIT;
SELECT version,name FROM supabase_migrations.schema_migrations
WHERE version LIKE '202610%' OR version LIKE '202611%' ORDER BY version;`,
  ].join('\n');
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const target = new URL('../../tmp/community-reviews/', import.meta.url);
  mkdirSync(target, { recursive: true });
  writeFileSync(
    new URL('apply-reviews-public.sql', target),
    communityReviewsMigrationSql(),
  );
  console.log(
    `Prepared ${fileURLToPath(new URL('apply-reviews-public.sql', target))}; no external mutation.`,
  );
}
