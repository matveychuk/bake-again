import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PersonalSyncEngine,
  SyncFailure,
  type SyncTransport,
} from './sync-engine.ts';
import type {
  PersonalRecordV1,
  PersonalDataV1,
  PersonalMutationV1,
} from './contracts.ts';
import { personalRecordKey } from './validation.ts';
import {
  accountStorage,
  guestRecords,
  collectionsKey,
} from './legacy-bridge.ts';
const note = (text: string): PersonalDataV1 => ({
  kind: 'recipe-note',
  payload: {
    recipeId: 'gluten-free-napoleon',
    recipeVersionId: 'v1',
    configuration: { kind: 'base' },
    text,
  },
});
function cloud() {
  const records = new Map<string, PersonalRecordV1>();
  const receipts = new Map<string, string>();
  let loseReply = false;
  const snapshot = () => ({
    accountId: 'account-a',
    records: [...records.values()],
    imported: false,
  });
  const transport: SyncTransport = async (action, input) => {
    if (action === 'snapshot') return snapshot();
    const mutations = input.mutations as PersonalMutationV1[];
    const acknowledgements = [];
    for (const m of mutations) {
      const key = m.action === 'put' ? personalRecordKey(m) : m.key;
      const id = JSON.stringify([m.kind, key]);
      const receipt = receipts.get(m.operationId);
      if (receipt && receipt !== JSON.stringify(m))
        throw new SyncFailure('OPERATION_REUSED');
      if (!receipt) {
        if ((records.get(id)?.revision ?? 0) !== m.expectedRevision)
          throw new SyncFailure('REVISION_CONFLICT');
        records.set(id, {
          schemaVersion: 1,
          kind: m.kind,
          key,
          revision: m.expectedRevision + 1,
          updatedAt: new Date().toISOString(),
          deletedAt: m.action === 'delete' ? new Date().toISOString() : null,
          payload: m.action === 'put' ? m.payload : null,
        } as PersonalRecordV1);
        receipts.set(m.operationId, JSON.stringify(m));
      }
      acknowledgements.push({
        operationId: m.operationId,
        revision: m.expectedRevision + 1,
      });
    }
    if (loseReply) {
      loseReply = false;
      throw new SyncFailure('SERVICE_UNAVAILABLE', true);
    }
    return { acknowledgements };
  };
  return {
    transport,
    snapshot,
    loseNextReply: () => {
      loseReply = true;
    },
    receipts,
  };
}
void test('two devices preserve notes on conflict; explicit choice retries against the current revision', async () => {
  const c = cloud();
  const a = new PersonalSyncEngine(c.snapshot(), c.transport, () => {}),
    b = new PersonalSyncEngine(c.snapshot(), c.transport, () => {});
  a.replace(['recipe-note'], [note('First device')]);
  b.replace(['recipe-note'], [note('Second device')]);
  await a.flush();
  await b.flush();
  assert.equal(b.conflicts.length, 1);
  assert.deepEqual(b.records, [note('Second device')]);
  await b.resolve(b.conflicts[0].id, 'local');
  await b.flush();
  await a.refresh();
  assert.deepEqual(a.records, b.records);
  assert.equal(b.pendingCount, 0);
});
void test('lost reply, reload and newer edit keep the first operation immutable and do not lose the second edit', async () => {
  const c = cloud();
  let durable = '';
  const a = new PersonalSyncEngine(c.snapshot(), c.transport, (v) => {
    durable = v;
  });
  a.replace(['recipe-note'], [note('Before timeout')]);
  c.loseNextReply();
  await assert.rejects(a.flush());
  const b = new PersonalSyncEngine(c.snapshot(), c.transport, (v) => {
    durable = v;
  });
  b.restore(durable);
  b.replace(['recipe-note'], [note('After timeout')]);
  await b.flush();
  await b.flush();
  assert.deepEqual(b.records, [note('After timeout')]);
  assert.equal(c.receipts.size, 2);
  assert.equal(b.pendingCount, 0);
});
void test('stale offline changes cannot restore a deletion; taking cloud removes the local draft', async () => {
  const c = cloud();
  const a = new PersonalSyncEngine(c.snapshot(), c.transport, () => {});
  a.replace(['recipe-note'], [note('Original')]);
  await a.flush();
  const b = new PersonalSyncEngine(c.snapshot(), c.transport, () => {});
  b.replace(['recipe-note'], [note('Offline edit')]);
  a.replace(['recipe-note'], []);
  await a.flush();
  await b.flush();
  assert.equal(b.conflicts.length, 1);
  await b.resolve(b.conflicts[0].id, 'cloud');
  assert.equal(b.records.length, 0);
});
void test('account storage isolates all guest stores; logout stop rejects writes and mismatched cache cannot cross accounts', () => {
  const c = cloud();
  let durable = '';
  const a = new PersonalSyncEngine(c.snapshot(), c.transport, (v) => {
    durable = v;
  });
  const store = accountStorage(a);
  store.setItem(
    collectionsKey,
    JSON.stringify([{ id: 'weekend', name: 'Weekend', recipeIds: [] }]),
  );
  assert.equal(a.records.length, 1);
  const b = new PersonalSyncEngine(
    { ...c.snapshot(), accountId: 'account-b' },
    c.transport,
    () => {},
  );
  assert.throws(() => b.restore(durable), /INVALID_CACHE/);
  assert.equal(accountStorage(b).getItem(collectionsKey), '[]');
  a.stop();
  assert.equal(a.records.length, 0);
  assert.throws(() => store.setItem(collectionsKey, '[]'), /SIGNED_OUT/);
});
void test('storage failure rejects an edit instead of claiming durable offline support', () => {
  const c = cloud();
  const a = new PersonalSyncEngine(c.snapshot(), c.transport, () => {
    throw new Error('quota');
  });
  assert.throws(() => a.replace(['recipe-note'], [note('Do not lose me')]));
  assert.equal(a.pendingCount, 0);
  assert.equal(a.error, 'LOCAL_STORAGE_FAILED');
});
void test('Cook notes retain exact configuration, timers stay local and guest import deduplicates recipe identity', () => {
  const c = cloud();
  const a = new PersonalSyncEngine(c.snapshot(), c.transport, () => {});
  const store = accountStorage(a);
  const key =
    'bake-again:cook-mode:v1:gluten-free-napoleon:v1:adjusted%3Around%3Abatch%3A2';
  store.setItem(
    key,
    JSON.stringify({
      schemaVersion: 1,
      recipeId: 'gluten-free-napoleon',
      recipeVersionId: 'v1',
      updatedAt: '2026-10-09T00:00:00.000Z',
      currentStepId: 'mix',
      completedStepIds: [],
      timer: null,
      completedAt: null,
      note: 'Double batch',
    }),
  );
  assert.equal(a.records[0].kind, 'recipe-note');
  const saved = a.records[0];
  assert.equal(saved.kind, 'recipe-note');
  if (saved.kind === 'recipe-note') {
    assert.equal(saved.payload.configuration.kind, 'adjusted');
    if (
      saved.payload.configuration.kind === 'adjusted' &&
      saved.payload.configuration.quantityAdjustment.mode === 'batchScale'
    )
      assert.equal(saved.payload.configuration.quantityAdjustment.factor, 2);
  }
  assert.equal(JSON.parse(store.getItem(key)!).note, 'Double batch');
  const entries = new Map([
    [
      collectionsKey,
      JSON.stringify([{ id: 'weekend', name: 'Weekend', recipeIds: [] }]),
    ],
    [key, store.getItem(key)!],
  ]);
  const guest = {
    length: entries.size,
    key: (i: number) => [...entries.keys()][i],
    getItem: (key: string) => entries.get(key) ?? null,
  } as Storage;
  assert.equal(guestRecords(guest).length, 2);
});

void test('an open Cook form keeps its read revision across background refreshes, while own acknowledgements advance it', async () => {
  const c = cloud();
  const a = new PersonalSyncEngine(c.snapshot(), c.transport, () => {});
  a.replace(['recipe-note'], [note('Original')]);
  await a.flush();
  const b = new PersonalSyncEngine(c.snapshot(), c.transport, () => {});
  b.pin('recipe-note', personalRecordKey(note('')));
  a.replace(['recipe-note'], [note('Changed elsewhere')]);
  await a.flush();
  await b.refresh();
  b.replace(['recipe-note'], [note('From stale open form')]);
  await b.flush();
  assert.equal(b.conflicts.length, 1);
  await b.resolve(b.conflicts[0].id, 'local');
  await b.flush();
  b.replace(['recipe-note'], [note('Next own edit')]);
  await b.flush();
  assert.equal(b.conflicts.length, 0);
});
void test('Postgres JSON field order does not turn an unchanged local write into a new mutation', () => {
  const c = cloud();
  const data = note('Same');
  const snapshot = {
    ...c.snapshot(),
    records: [
      {
        schemaVersion: 1,
        key: personalRecordKey(data),
        revision: 1,
        updatedAt: '2026-10-09T00:00:00.000Z',
        deletedAt: null,
        kind: 'recipe-note',
        payload: {
          text: 'Same',
          configuration: { kind: 'base' },
          recipeVersionId: 'v1',
          recipeId: 'gluten-free-napoleon',
        },
      } as PersonalRecordV1,
    ],
  };
  const engine = new PersonalSyncEngine(snapshot, c.transport, () => {});
  engine.replace(['recipe-note'], [data]);
  assert.equal(engine.pendingCount, 0);
});
