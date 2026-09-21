import { isSaveableRecipeId } from '../../content/recipes/registry.ts';
import type { Unit } from '../../content/recipes/recipe.types.ts';
import type { AssistantConfiguration } from '../assistant/contracts.ts';
import {
  readStorageValue,
  subscribeToStorageKey,
  writeStorageValue,
  type StorageLike,
} from './storage.ts';

export const bakeMemoryStorageKey = 'bake-again:bake-memory:v1';

export type BakeRecordV1 = {
  recipeId: string;
  recipeVersionId: string;
  configuration: AssistantConfiguration;
  completedAt: string;
  note: string;
  noteUpdatedAt: string;
};

export type BakeMemoryV1 = {
  schemaVersion: 1;
  updatedAt: string;
  records: BakeRecordV1[];
};

const units = new Set<Unit>([
  'g',
  'ml',
  'piece',
  'tsp',
  'tbsp',
  'cup',
  'packet',
  'pinch',
]);

const emptyBakeMemory = (): BakeMemoryV1 => ({
  schemaVersion: 1,
  updatedAt: new Date(0).toISOString(),
  records: [],
});

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function parseConfiguration(value: unknown): AssistantConfiguration | null {
  if (!value || typeof value !== 'object') return null;
  const configuration = value as Record<string, unknown>;
  if (configuration.kind === 'base') return { kind: 'base' };
  if (
    configuration.kind !== 'adjusted' ||
    typeof configuration.geometryId !== 'string' ||
    !configuration.quantityAdjustment ||
    typeof configuration.quantityAdjustment !== 'object'
  ) {
    return null;
  }

  const quantityAdjustment = configuration.quantityAdjustment as Record<
    string,
    unknown
  >;
  if (
    quantityAdjustment.mode === 'batchScale' &&
    [0.5, 1, 1.5, 2].includes(quantityAdjustment.factor as number)
  ) {
    return {
      kind: 'adjusted',
      geometryId: configuration.geometryId,
      quantityAdjustment: {
        mode: 'batchScale',
        factor: quantityAdjustment.factor as 0.5 | 1 | 1.5 | 2,
      },
    };
  }

  const availableAmount = quantityAdjustment.availableAmount;
  if (
    quantityAdjustment.mode === 'useWhatIHave' &&
    typeof quantityAdjustment.anchorIngredientLineId === 'string' &&
    availableAmount &&
    typeof availableAmount === 'object'
  ) {
    const amount = availableAmount as Record<string, unknown>;
    if (
      typeof amount.value === 'number' &&
      Number.isFinite(amount.value) &&
      amount.value > 0 &&
      typeof amount.unit === 'string' &&
      units.has(amount.unit as Unit)
    ) {
      return {
        kind: 'adjusted',
        geometryId: configuration.geometryId,
        quantityAdjustment: {
          mode: 'useWhatIHave',
          anchorIngredientLineId: quantityAdjustment.anchorIngredientLineId,
          availableAmount: {
            value: amount.value,
            unit: amount.unit as Unit,
          },
        },
      };
    }
  }

  return null;
}

function parseRecord(value: unknown): BakeRecordV1 | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  const configuration = parseConfiguration(record.configuration);
  if (
    typeof record.recipeId !== 'string' ||
    !isSaveableRecipeId(record.recipeId) ||
    typeof record.recipeVersionId !== 'string' ||
    !configuration ||
    !isIsoDate(record.completedAt) ||
    typeof record.note !== 'string' ||
    !isIsoDate(record.noteUpdatedAt)
  ) {
    return null;
  }

  return {
    recipeId: record.recipeId,
    recipeVersionId: record.recipeVersionId,
    configuration,
    completedAt: record.completedAt,
    note: record.note.slice(0, 2000),
    noteUpdatedAt: record.noteUpdatedAt,
  };
}

export function bakeConfigurationKey(
  configuration: AssistantConfiguration,
): string {
  if (configuration.kind === 'base') return 'base';
  const adjustment = configuration.quantityAdjustment;
  if (adjustment.mode === 'batchScale') {
    return `adjusted:${configuration.geometryId}:batch:${adjustment.factor}`;
  }
  return [
    'adjusted',
    configuration.geometryId,
    'anchor',
    adjustment.anchorIngredientLineId,
    adjustment.availableAmount.value,
    adjustment.availableAmount.unit,
  ].join(':');
}

function recordKey(
  record: Pick<BakeRecordV1, 'recipeId' | 'recipeVersionId' | 'configuration'>,
) {
  return `${record.recipeId}:${record.recipeVersionId}:${bakeConfigurationKey(record.configuration)}`;
}

export function parseBakeMemory(rawValue: string | null): BakeMemoryV1 | null {
  if (!rawValue) return null;
  try {
    const value: unknown = JSON.parse(rawValue);
    if (!value || typeof value !== 'object') return null;
    const memory = value as Record<string, unknown>;
    if (
      memory.schemaVersion !== 1 ||
      !isIsoDate(memory.updatedAt) ||
      !Array.isArray(memory.records)
    ) {
      return null;
    }

    const records = new Map<string, BakeRecordV1>();
    for (const candidate of memory.records) {
      const record = parseRecord(candidate);
      if (record) records.set(recordKey(record), record);
      if (records.size >= 200) break;
    }
    return {
      schemaVersion: 1,
      updatedAt: memory.updatedAt,
      records: [...records.values()],
    };
  } catch {
    return null;
  }
}

export function readBakeMemory(storage?: StorageLike | null): BakeMemoryV1 {
  return (
    parseBakeMemory(readStorageValue(bakeMemoryStorageKey, storage)) ??
    emptyBakeMemory()
  );
}

export function readBakeRecord(
  recipeId: string,
  recipeVersionId: string,
  configuration: AssistantConfiguration,
  storage?: StorageLike | null,
) {
  const key = `${recipeId}:${recipeVersionId}:${bakeConfigurationKey(configuration)}`;
  return (
    readBakeMemory(storage).records.find(
      (record) => recordKey(record) === key,
    ) ?? null
  );
}

export function readLatestBakeRecord(
  recipeId: string,
  storage?: StorageLike | null,
) {
  return (
    readBakeMemory(storage)
      .records.filter((record) => record.recipeId === recipeId)
      .sort(
        (left, right) =>
          Date.parse(right.completedAt) - Date.parse(left.completedAt),
      )[0] ?? null
  );
}

export function persistBakeRecord(
  record: BakeRecordV1,
  storage?: StorageLike | null,
): boolean {
  const parsed = parseRecord(record);
  if (!parsed) return false;
  const state = readBakeMemory(storage);
  const key = recordKey(parsed);
  const records = [
    ...state.records.filter((candidate) => recordKey(candidate) !== key),
    parsed,
  ].slice(-200);
  const next: BakeMemoryV1 = {
    schemaVersion: 1,
    updatedAt: parsed.noteUpdatedAt,
    records,
  };
  return writeStorageValue(bakeMemoryStorageKey, JSON.stringify(next), storage);
}

export function subscribeToBakeMemory(onChange: () => void): () => void {
  return subscribeToStorageKey(bakeMemoryStorageKey, onChange);
}
