// Exercises the real local D1 runtime through Wrangler. Every invocation is
// explicitly --local and uses a disposable configuration/database, never Sites.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(join(root, '.wrangler'), { recursive: true });
const temporary = mkdtempSync(join(root, '.wrangler', 'personal-d1-check-'));
const wrangler = join(root, 'node_modules/wrangler/bin/wrangler.js');
const journal = JSON.parse(readFileSync(join(root, 'drizzle/meta/_journal.json'), 'utf8'));
assert.equal(journal.entries[0].tag, '0000_assistant_quotas');
const files = journal.entries.map(entry => `${entry.tag}.sql`);

function scenario(name) {
  const dir = join(temporary, name);
  const migrations = join(dir, 'migrations');
  mkdirSync(migrations, { recursive: true });
  const config = join(dir, 'wrangler.json');
  writeFileSync(config, JSON.stringify({ name: 'bake-again-foundation-check', compatibility_date: '2026-10-01',
    d1_databases: [{ binding: 'ASSISTANT_QUOTAS', database_name: 'foundation-local-only',
      database_id: '00000000-0000-4000-8000-000000000000', migrations_dir: migrations }],
  }));
  function run(action, extra = []) {
    return execFileSync(process.execPath, [wrangler, 'd1', ...action, 'ASSISTANT_QUOTAS', '--local', '--config', config,
      '--persist-to', join(dir, 'state'), ...extra], {
      cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 60000,
      env: { ...process.env, CI: 'true', WRANGLER_SEND_METRICS: 'false', WRANGLER_WRITE_LOGS: 'false', MINIFLARE_REGISTRY_PATH: join(dir, 'registry') },
    });
  }
  function query(sql) {
    const output = JSON.parse(run(['execute'], ['--command', sql, '--json']));
    assert.ok(output.length > 0 && output.every(item => item.success), `${name}: D1 query failed`);
    return output.flatMap(item => item.results);
  }
  return { add: file => copyFileSync(join(root, 'drizzle', file), join(migrations, file)),
    apply: () => run(['migrations', 'apply']), query };
}

try {
  const fresh = scenario('fresh');
  files.forEach(fresh.add); fresh.apply();
  assert.equal(fresh.query('SELECT count(*) AS n FROM d1_migrations')[0].n, files.length);
  fresh.apply(); // Wrangler's journal must not replay an already applied CREATE TABLE.
  assert.equal(fresh.query('SELECT count(*) AS n FROM d1_migrations')[0].n, files.length);
  assert.deepEqual(fresh.query('PRAGMA foreign_key_check'), []);

  const upgrade = scenario('upgrade');
  upgrade.add(files[0]); upgrade.apply();
  upgrade.query("INSERT INTO assistant_quota_reservations VALUES ('migration-sentinel','synthetic-session','synthetic-network',0,0,17)");
  upgrade.query("INSERT INTO assistant_verification_attempts VALUES ('migration-verify','synthetic-network',0)");
  const before = upgrade.query("SELECT name, sql FROM sqlite_master WHERE name LIKE 'assistant_%' ORDER BY name");
  files.slice(1).forEach(upgrade.add); upgrade.apply();
  assert.deepEqual(upgrade.query("SELECT name, sql FROM sqlite_master WHERE name LIKE 'assistant_%' ORDER BY name"), before);
  assert.equal(upgrade.query('SELECT sum(reserved_microusd) AS n FROM assistant_quota_reservations')[0].n, 17);
  assert.equal(upgrade.query('SELECT count(*) AS n FROM assistant_verification_attempts')[0].n, 1);
  const tables = upgrade.query("SELECT name FROM sqlite_master WHERE name LIKE 'personal_%' AND type='table' ORDER BY name");
  assert.deepEqual(tables.map(row => row.name), ['personal_accounts', 'personal_identities', 'personal_records']);
  assert.deepEqual(upgrade.query('PRAGMA foreign_key_check'), []);
  console.log('Local D1: fresh install, journal replay, current quota-schema upgrade, preserved quota data/indexes and foreign keys PASS.');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
