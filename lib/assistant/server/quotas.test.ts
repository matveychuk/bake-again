import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { createD1AssistantQuotaStore, maximumRequestCostMicrousd, type QuotaDatabase, type QuotaStatement } from './quotas.ts';
import { AssistantServiceError } from './errors.ts';

function fixture(daily = 1_000_000_000, monthly = 1_000_000_000) {
  const sql = new DatabaseSync(':memory:');
  sql.exec(readFileSync(new URL('../../../drizzle/0000_assistant_quotas.sql', import.meta.url), 'utf8'));
  let now = Date.UTC(2026, 8, 27, 12) / 1000;
  const db: QuotaDatabase = { prepare(query) {
    const text = query.replaceAll("unixepoch('now','start of month')", "unixepoch('2026-09-01')").replaceAll("unixepoch('now')", String(now)).replace(/\?(\d+)/g, ':p$1');
    const stmt = sql.prepare(text);
    let args: Record<string, string | number | null> = {};
    const wrapper: QuotaStatement = {
      bind(...values) { args = Object.fromEntries(values.map((v, i) => [`p${i + 1}`, v])); return wrapper; },
      async first<T>() { return (stmt.get(args) as T | undefined) ?? null; },
      async run() { return stmt.run(args); },
    };
    return wrapper;
  } };
  return { sql, db, store: createD1AssistantQuotaStore(db, { dailyMicrousd: daily, monthlyMicrousd: monthly }), advance(seconds: number) { now += seconds; }, now: () => now };
}
const actor = { sessionKey: 'session', networkKey: 'network' };
const isError = (code: string) => (error: unknown) => error instanceof AssistantServiceError && error.code === code;

void test('five requests across two independent stores; reopening does not reset the rolling window', async t => {
  const f = fixture(); t.after(() => f.sql.close());
  const second = createD1AssistantQuotaStore(f.db, { dailyMicrousd: 1e9, monthlyMicrousd: 1e9 });
  for (let i = 0; i < 5; i++) await (await (i % 2 ? second : f.store).reserve(actor, String(i), 1)).release();
  await assert.rejects(second.reserve(actor, 'six', 1), isError('RATE_LIMITED'));
  f.advance(7200);
  await (await second.reserve(actor, 'after-window', 1)).release();
});
void test('ten per rolling day survives a new cooking window', async t => {
  const f = fixture(); t.after(() => f.sql.close());
  for (let i = 0; i < 10; i++) { if (i === 5) f.advance(7201); await (await f.store.reserve(actor, String(i), 1)).release(); }
  f.advance(7201);
  await assert.rejects(f.store.reserve(actor, 'eleven', 1), isError('RATE_LIMITED'));
  f.advance(86401);
  await (await f.store.reserve(actor, 'new-day', 1)).release();
});
void test('simultaneous requests for one identity admit exactly one', async t => {
  const f = fixture(); t.after(() => f.sql.close());
  const results = await Promise.allSettled(Array.from({ length: 20 }, (_, i) => f.store.reserve(actor, String(i), 1)));
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
});
void test('site concurrency admits at most three even with rotating sessions and networks', async t => {
  const f = fixture(); t.after(() => f.sql.close());
  const results = await Promise.allSettled(Array.from({ length: 20 }, (_, i) => f.store.reserve({ sessionKey: `s${i}`, networkKey: `n${i}` }, String(i), 1)));
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 3);
  f.advance(61);
  await f.store.reserve(actor, 'lease-expired', 1);
});
void test('network limits survive cookie rotation: 20/minute and 40/day', async t => {
  const f = fixture(); t.after(() => f.sql.close());
  for (let i = 0; i < 40; i++) {
    if (i === 20) { await assert.rejects(f.store.reserve({ ...actor, sessionKey: 'extra' }, 'fast', 1), isError('RATE_LIMITED')); f.advance(61); }
    await (await f.store.reserve({ ...actor, sessionKey: String(i) }, String(i), 1)).release();
  }
  f.advance(61);
  await assert.rejects(f.store.reserve({ ...actor, sessionKey: 'extra' }, 'daily', 1), isError('RATE_LIMITED'));
});
void test('100 site requests per rolling day despite rotating every identity and network', async t => {
  const f = fixture(); t.after(() => f.sql.close());
  for (let i = 0; i < 100; i++) await (await f.store.reserve({ sessionKey: `s${i}`, networkKey: `n${i}` }, String(i), 1)).release();
  await assert.rejects(f.store.reserve(actor, '101', 1), isError('RATE_LIMITED'));
});
void test('atomic budget reservations do not overspend under competing identities', async t => {
  const f = fixture(99, 1000); t.after(() => f.sql.close());
  const results = await Promise.allSettled(Array.from({ length: 30 }, (_, i) => f.store.reserve({ sessionKey: `s${i}`, networkKey: `n${i}` }, String(i), 50)));
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
  assert.equal(f.sql.prepare('SELECT SUM(reserved_microusd) AS cost FROM assistant_quota_reservations').get()!.cost, 50);
});
void test('release retains spend; monthly limit survives the next day', async t => {
  const f = fixture(100, 150); t.after(() => f.sql.close());
  await (await f.store.reserve(actor, 'one', 100)).release();
  await assert.rejects(f.store.reserve(actor, 'two', 1), isError('BUDGET_EXHAUSTED'));
  f.advance(86401);
  await assert.rejects(f.store.reserve(actor, 'three', 51), isError('BUDGET_EXHAUSTED'));
  await (await f.store.reserve(actor, 'four', 50)).release();
});
void test('zero budgets stop all model reservations; duplicate IDs never call twice', async t => {
  const f = fixture(0); t.after(() => f.sql.close());
  await assert.rejects(f.store.reserve(actor, 'zero', 1), isError('BUDGET_EXHAUSTED'));
  const store = createD1AssistantQuotaStore(f.db, { dailyMicrousd: 100, monthlyMicrousd: 100 });
  await (await store.reserve(actor, 'one', 1)).release();
  await assert.rejects(store.reserve(actor, 'one', 1), isError('RATE_LIMITED'));
});
void test('verification flooding is limited without reserving any AI spend', async t => {
  const f = fixture(); t.after(() => f.sql.close());
  for (let i = 0; i < 20; i++) await f.store.allowVerification('network', String(i));
  await assert.rejects(f.store.allowVerification('network', '21'), isError('RATE_LIMITED'));
  assert.equal(f.sql.prepare('SELECT COUNT(*) AS n FROM assistant_quota_reservations').get()!.n, 0);
  for (let i = 20; i < 300; i++) await f.store.allowVerification(String(i), String(i));
  await assert.rejects(f.store.allowVerification('fresh', '301'), isError('RATE_LIMITED'));
  f.advance(61); await f.store.allowVerification('network', 'later');
});
void test('missing tables or failed database close the paid path', async () => {
  const store = createD1AssistantQuotaStore({ prepare() { throw new Error('offline'); } }, { dailyMicrousd: 1e6, monthlyMicrousd: 1e7 });
  await assert.rejects(store.reserve(actor, 'one', 1), isError('SERVICE_UNAVAILABLE'));
  await assert.rejects(store.allowVerification('network', 'one'), isError('SERVICE_UNAVAILABLE'));
});
void test('spend ledger drops identities after 48 hours, retaining monthly totals', async t => {
  const f = fixture(); t.after(() => f.sql.close());
  await (await f.store.reserve(actor, 'old', 33)).release(); f.advance(172801);
  await (await f.store.reserve(actor, 'new', 10)).release();
  assert.deepEqual({ ...f.sql.prepare("SELECT session_key, network_key, reserved_microusd FROM assistant_quota_reservations WHERE id = 'old'").get() }, { session_key: null, network_key: null, reserved_microusd: 33 });
});
void test('reservation includes full byte-bound input, protocol allowance and maximum output', () => {
  assert.equal(maximumRequestCostMicrousd(2000), 33000);
  assert.equal(maximumRequestCostMicrousd(4000), 42000);
  assert.throws(() => maximumRequestCostMicrousd(4001), isError('ASSISTANT_DISABLED'));
});
