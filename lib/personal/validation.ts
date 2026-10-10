import {
  PERSONAL_MAX_KEY_LENGTH,
  PERSONAL_MAX_PAYLOAD_BYTES,
  personalKinds,
  type PersonalDataV1,
  type PersonalKind,
} from './contracts.ts';

type ObjectValue = Record<string, unknown>;
function object(v: unknown): v is ObjectValue {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}
function exact(v: ObjectValue, required: string[], optional: string[] = []) {
  return (
    required.every((k) => Object.hasOwn(v, k)) &&
    Object.keys(v).every((k) => required.includes(k) || optional.includes(k))
  );
}
function id(v: unknown): v is string {
  return typeof v === 'string' && /^[a-z0-9][a-z0-9-]{0,127}$/.test(v);
}
function text(v: unknown, max: number): v is string {
  return typeof v === 'string' && v.length <= max && !v.includes('\0');
}
function iso(v: unknown) {
  return (
    typeof v === 'string' &&
    Number.isFinite(Date.parse(v)) &&
    new Date(v).toISOString() === v
  );
}
function positive(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v) && v > 0;
}
const units = new Set([
  'g',
  'ml',
  'piece',
  'tsp',
  'tbsp',
  'cup',
  'packet',
  'pinch',
]);
function unit(v: unknown) {
  return typeof v === 'string' && units.has(v);
}

function configuration(v: unknown): boolean {
  if (!object(v)) return false;
  if (v.kind === 'base') return exact(v, ['kind']);
  if (
    v.kind !== 'adjusted' ||
    !exact(v, ['kind', 'geometryId', 'quantityAdjustment']) ||
    !id(v.geometryId) ||
    !object(v.quantityAdjustment)
  )
    return false;
  const q = v.quantityAdjustment;
  if (q.mode === 'batchScale')
    return (
      exact(q, ['mode', 'factor']) &&
      [0.5, 1, 1.5, 2].includes(q.factor as number)
    );
  return (
    q.mode === 'useWhatIHave' &&
    exact(q, ['mode', 'anchorIngredientLineId', 'availableAmount']) &&
    id(q.anchorIngredientLineId) &&
    object(q.availableAmount) &&
    exact(q.availableAmount, ['value', 'unit']) &&
    positive(q.availableAmount.value) &&
    unit(q.availableAmount.unit)
  );
}
function reference(v: ObjectValue) {
  return (
    id(v.recipeId) && id(v.recipeVersionId) && configuration(v.configuration)
  );
}
function quantity(v: unknown) {
  if (v === null) return true;
  if (!object(v) || !unit(v.unit)) return false;
  return v.kind === 'exact'
    ? exact(v, ['kind', 'value', 'unit']) && positive(v.value)
    : v.kind === 'range' &&
        exact(v, ['kind', 'min', 'max', 'unit']) &&
        positive(v.min) &&
        positive(v.max) &&
        v.min <= v.max;
}
function source(v: unknown) {
  if (!object(v)) return false;
  const fields = [
    'recipeId',
    'recipeVersionId',
    'ingredientLineId',
    'sectionId',
    'selectedIngredientId',
  ];
  return (
    exact(v, fields, ['configurationKey', 'batchId']) &&
    fields.every((k) => id(v[k])) &&
    (v.configurationKey === undefined ||
      (typeof v.configurationKey === 'string' &&
        /^[a-z0-9][a-z0-9:.-]{0,255}$/.test(v.configurationKey))) &&
    (v.batchId === undefined || id(v.batchId))
  );
}
export function isPersonalKind(v: unknown): v is PersonalKind {
  return (
    typeof v === 'string' && (personalKinds as readonly string[]).includes(v)
  );
}
export function isPersonalKey(v: unknown): v is string {
  return text(v, PERSONAL_MAX_KEY_LENGTH) && v.length > 0;
}

/** Strict read boundary: no unknown fields, silent truncation or inherited provenance. */
export function parsePersonalData(
  kind: unknown,
  value: unknown,
): PersonalDataV1 | null {
  if (!isPersonalKind(kind) || !object(value)) return null;
  try {
    if (
      new TextEncoder().encode(JSON.stringify(value)).length >
      PERSONAL_MAX_PAYLOAD_BYTES
    )
      return null;
  } catch {
    return null;
  }
  let valid = false;
  switch (kind) {
    case 'saved-recipe':
      valid = exact(value, ['recipeId']) && id(value.recipeId);
      break;
    case 'recipe-note':
      valid =
        exact(value, [
          'recipeId',
          'recipeVersionId',
          'configuration',
          'text',
        ]) &&
        reference(value) &&
        text(value.text, 2000);
      break;
    case 'bake-record':
      valid =
        exact(value, [
          'recipeId',
          'recipeVersionId',
          'configuration',
          'completedAt',
          'note',
          'noteUpdatedAt',
        ]) &&
        reference(value) &&
        iso(value.completedAt) &&
        text(value.note, 2000) &&
        iso(value.noteUpdatedAt);
      break;
    case 'collection':
      valid =
        exact(value, ['id', 'name', 'recipeIds']) &&
        id(value.id) &&
        text(value.name, 120) &&
        value.name.trim().length > 0 &&
        Array.isArray(value.recipeIds) &&
        value.recipeIds.length <= 200 &&
        value.recipeIds.every(id) &&
        new Set(value.recipeIds).size === value.recipeIds.length;
      break;
    case 'shopping-item':
      valid =
        exact(value, [
          'id',
          'ingredientId',
          'quantity',
          'checked',
          'createdAt',
          'updatedAt',
          'sources',
        ]) &&
        text(value.id, 256) &&
        value.id.length > 0 &&
        id(value.ingredientId) &&
        quantity(value.quantity) &&
        typeof value.checked === 'boolean' &&
        iso(value.createdAt) &&
        iso(value.updatedAt) &&
        Array.isArray(value.sources) &&
        value.sources.length > 0 &&
        value.sources.length <= 100 &&
        value.sources.every(source);
      break;
  }
  return valid ? ({ kind, payload: value } as PersonalDataV1) : null;
}

/** Canonical tuples avoid delimiter collisions and object property-order dependence. */
export function personalRecordKey(data: PersonalDataV1): string {
  if (data.kind === 'saved-recipe') return data.payload.recipeId;
  if (data.kind === 'shopping-item' || data.kind === 'collection')
    return data.payload.id;
  const { recipeId, recipeVersionId, configuration: c } = data.payload;
  const q = c.kind === 'adjusted' ? c.quantityAdjustment : null;
  const config =
    c.kind === 'base'
      ? ['base']
      : q?.mode === 'batchScale'
        ? ['adjusted', c.geometryId, 'batch', q.factor]
        : q?.mode === 'useWhatIHave'
          ? [
              'adjusted',
              c.geometryId,
              'anchor',
              q.anchorIngredientLineId,
              q.availableAmount.value,
              q.availableAmount.unit,
            ]
          : [];
  return JSON.stringify([recipeId, recipeVersionId, config]);
}
