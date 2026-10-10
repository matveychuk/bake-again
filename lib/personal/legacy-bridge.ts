import type { PersonalDataV1, PersonalKind } from './contracts.ts';
import type { AssistantConfiguration } from '../assistant/contracts.ts';
import { parsePersonalData, personalRecordKey } from './validation.ts';
import {
  parseRecipeMemory,
  recipeMemoryStorageKey,
} from '../persistence/recipe-memory.ts';
import { parseShopping, shoppingStorageKey } from '../persistence/shopping.ts';
import {
  parseBakeMemory,
  bakeMemoryStorageKey,
  bakeConfigurationKey,
} from '../persistence/bake-memory.ts';
import { parseCookModeSession } from '../persistence/cook-mode.ts';
import type { StorageLike } from '../persistence/storage.ts';
import type { PersonalSyncEngine } from './sync-engine.ts';
export const collectionsKey = 'bake-again:collections:v1';
const cookPrefix = 'bake-again:cook-mode:v1:';
export const isPersonalStorage = (key: string) =>
  key.startsWith('bake-again:') && !key.startsWith('bake-again:newsletter');
function configuration(key: string): AssistantConfiguration | null {
  const parts = decodeURIComponent(key).split(':');
  if (parts[0] === 'base') return { kind: 'base' };
  if (parts[0] !== 'adjusted') return null;
  const c =
    parts[2] === 'batch'
      ? {
          kind: 'adjusted',
          geometryId: parts[1],
          quantityAdjustment: { mode: 'batchScale', factor: Number(parts[3]) },
        }
      : {
          kind: 'adjusted',
          geometryId: parts[1],
          quantityAdjustment: {
            mode: 'useWhatIHave',
            anchorIngredientLineId: parts[3],
            availableAmount: { value: Number(parts[4]), unit: parts[5] },
          },
        };
  const parsed = parsePersonalData('recipe-note', {
    recipeId: 'x',
    recipeVersionId: 'v1',
    configuration: c,
    text: '',
  });
  return parsed?.kind === 'recipe-note' ? parsed.payload.configuration : null;
}
export function legacyRecords(
  key: string,
  raw: string | null,
): { kinds: PersonalKind[]; records: PersonalDataV1[] } | null {
  let kind: PersonalKind;
  let values: unknown[];
  if (key === recipeMemoryStorageKey) {
    kind = 'saved-recipe';
    values = (parseRecipeMemory(raw)?.savedRecipeIds ?? []).map((recipeId) => ({
      recipeId,
    }));
  } else if (key === shoppingStorageKey || key === 'bake-again:shopping:v1') {
    kind = 'shopping-item';
    values = parseShopping(raw)?.items ?? [];
  } else if (key === bakeMemoryStorageKey) {
    kind = 'bake-record';
    values = parseBakeMemory(raw)?.records ?? [];
  } else if (key === collectionsKey) {
    kind = 'collection';
    const v = raw ? JSON.parse(raw) : [];
    values = Array.isArray(v) ? v : [];
  } else if (key.startsWith(cookPrefix)) {
    const s = parseCookModeSession(raw);
    if (!s) return null;
    const suffix = key.slice(cookPrefix.length).split(':').slice(2).join(':');
    const c = configuration(suffix || 'base');
    if (!c) return null;
    kind = 'recipe-note';
    values = [
      {
        recipeId: s.recipeId,
        recipeVersionId: s.recipeVersionId,
        configuration: c,
        text: s.note,
      },
    ];
  } else return null;
  const records = values.map((v) => parsePersonalData(kind, v));
  if (records.some((v) => !v)) throw new Error('INVALID_GUEST_DATA');
  return { kinds: [kind], records: records as PersonalDataV1[] };
}
/** Legacy UI reads through the same contracts. Cook progress stays local to this tab. */
export function accountStorage(
  engine: PersonalSyncEngine,
  progress?: StorageLike,
): StorageLike {
  const memory = new Map<string, string>();
  const local = {
    get: (key: string) => progress?.getItem(key) ?? memory.get(key) ?? null,
    set: (key: string, value: string) => {
      progress?.setItem(key, value);
      memory.set(key, value);
    },
  };
  return {
    getItem(key) {
      const all = engine.records;
      const time = new Date().toISOString();
      if (key === recipeMemoryStorageKey)
        return JSON.stringify({
          schemaVersion: 1,
          updatedAt: time,
          savedRecipeIds: all
            .filter((r) => r.kind === 'saved-recipe')
            .map((r) => r.payload.recipeId),
        });
      if (key === shoppingStorageKey)
        return JSON.stringify({
          schemaVersion: 2,
          updatedAt: time,
          items: all
            .filter((r) => r.kind === 'shopping-item')
            .map((r) => r.payload),
        });
      if (key === bakeMemoryStorageKey)
        return JSON.stringify({
          schemaVersion: 1,
          updatedAt: time,
          records: all
            .filter((r) => r.kind === 'bake-record')
            .map((r) => r.payload),
        });
      if (key === collectionsKey)
        return JSON.stringify(
          all.filter((r) => r.kind === 'collection').map((r) => r.payload),
        );
      if (key.startsWith(cookPrefix)) {
        const [recipeId, recipeVersionId, ...rest] = key
          .slice(cookPrefix.length)
          .split(':');
        const config = configuration(rest.join(':') || 'base');
        if (config) {
          const reference = personalRecordKey({
            kind: 'recipe-note',
            payload: {
              recipeId,
              recipeVersionId,
              configuration: config,
              text: '',
            },
          });
          engine.pin('recipe-note', reference);
          engine.pin('bake-record', reference);
        }
        const note = all.find(
          (r) =>
            r.kind === 'recipe-note' &&
            r.payload.recipeId === recipeId &&
            r.payload.recipeVersionId === recipeVersionId &&
            config &&
            bakeConfigurationKey(r.payload.configuration) ===
              bakeConfigurationKey(config),
        );
        const current = parseCookModeSession(local.get(key) ?? null);
        if (current)
          return JSON.stringify({
            ...current,
            note: note?.kind === 'recipe-note' ? note.payload.text : '',
          });
        if (note?.kind === 'recipe-note')
          return JSON.stringify({
            schemaVersion: 1,
            recipeId,
            recipeVersionId,
            updatedAt: time,
            currentStepId: '',
            completedStepIds: [],
            timer: null,
            completedAt: null,
            note: note.payload.text,
          });
      }
      return local.get(key) ?? null;
    },
    setItem(key, value) {
      const slice = legacyRecords(key, value);
      if (slice) {
        if (key.startsWith(cookPrefix)) {
          const previous = parseCookModeSession(local.get(key));
          const next = parseCookModeSession(value);
          if (previous && previous.note === next?.note) {
            local.set(key, value);
            return;
          }
          const id = personalRecordKey(slice.records[0]);
          engine.replace(
            ['recipe-note'],
            [
              ...engine.records.filter(
                (r) => r.kind === 'recipe-note' && personalRecordKey(r) !== id,
              ),
              ...slice.records,
            ],
          );
        } else engine.replace(slice.kinds, slice.records);
      }
      local.set(key, value);
    },
  };
}
export function guestRecords(storage: Storage): PersonalDataV1[] {
  const map = new Map<string, PersonalDataV1>();
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i)!;
    if (key === 'bake-again:shopping:v1' && storage.getItem(shoppingStorageKey))
      continue;
    const slice = legacyRecords(key, storage.getItem(key));
    for (const r of slice?.records ?? [])
      map.set(JSON.stringify([r.kind, personalRecordKey(r)]), r);
  }
  if (map.size > 200) throw new Error('IMPORT_LIMIT');
  return [...map.values()];
}
