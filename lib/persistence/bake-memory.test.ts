import assert from 'node:assert/strict';
import test from 'node:test';
import {
  bakeConfigurationKey,
  parseBakeMemory,
  persistBakeRecord,
  readBakeRecord,
  readLatestBakeRecord,
  type BakeRecordV1,
} from './bake-memory.ts';

class MemoryStorage {
  readonly values = new Map<string, string>();
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const baseRecord: BakeRecordV1 = {
  recipeId: 'crepes',
  recipeVersionId: 'crepes-source-v1',
  configuration: { kind: 'base' },
  completedAt: '2026-09-20T10:00:00.000Z',
  note: 'Use slightly less milk next time.',
  noteUpdatedAt: '2026-09-20T10:01:00.000Z',
};

void test('stores the latest note for an exact recipe version and configuration', () => {
  const storage = new MemoryStorage();
  assert.equal(persistBakeRecord(baseRecord, storage), true);
  assert.deepEqual(
    readBakeRecord('crepes', 'crepes-source-v1', { kind: 'base' }, storage),
    baseRecord,
  );

  const updated = {
    ...baseRecord,
    note: 'The pan needed a little more heat.',
    noteUpdatedAt: '2026-09-20T10:02:00.000Z',
  };
  persistBakeRecord(updated, storage);
  assert.equal(readLatestBakeRecord('crepes', storage)?.note, updated.note);
});

void test('keeps adjusted bakes separate from the tested base', () => {
  const storage = new MemoryStorage();
  const adjusted = {
    kind: 'adjusted' as const,
    geometryId: 'round-24-cm',
    quantityAdjustment: { mode: 'batchScale' as const, factor: 0.5 as const },
  };
  persistBakeRecord(baseRecord, storage);
  persistBakeRecord(
    {
      ...baseRecord,
      configuration: adjusted,
      completedAt: '2026-09-20T11:00:00.000Z',
      note: 'Half batch in the smaller form.',
    },
    storage,
  );

  assert.notEqual(bakeConfigurationKey(adjusted), 'base');
  assert.equal(
    readBakeRecord('crepes', 'crepes-source-v1', adjusted, storage)?.note,
    'Half batch in the smaller form.',
  );
  assert.equal(
    readBakeRecord('crepes', 'crepes-source-v1', { kind: 'base' }, storage)
      ?.note,
    baseRecord.note,
  );
});

void test('rejects malformed memory and bounds private notes', () => {
  assert.equal(parseBakeMemory('{not-json'), null);
  const parsed = parseBakeMemory(
    JSON.stringify({
      schemaVersion: 1,
      updatedAt: '2026-09-20T10:01:00.000Z',
      records: [{ ...baseRecord, note: 'x'.repeat(2200) }],
    }),
  );
  assert.equal(parsed?.records[0]?.note.length, 2000);
});
