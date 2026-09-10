import type { Quantity, Unit } from '../../content/recipes/recipe.types.ts';
import { readStorageValue, subscribeToStorageKey, writeStorageValue, type StorageLike } from './storage.ts';

export const shoppingStorageKey = 'bake-again:shopping:v1';

export type ShoppingSourceV1 = {
  recipeId: string;
  recipeVersionId: string;
  ingredientLineId: string;
  sectionId: string;
  selectedIngredientId: string;
};

export type ShoppingItemV1 = {
  id: string;
  ingredientId: string;
  quantity: Quantity | null;
  checked: boolean;
  createdAt: string;
  updatedAt: string;
  sources: ShoppingSourceV1[];
};

export type ShoppingV1 = {
  schemaVersion: 1;
  updatedAt: string;
  items: ShoppingItemV1[];
};

export type ShoppingIngredientInput = {
  ingredientId: string;
  quantity: Quantity | null;
  source: ShoppingSourceV1;
};

const units: readonly Unit[] = ['g', 'ml', 'piece', 'tsp', 'tbsp', 'packet', 'pinch'];
const emptyShopping = (): ShoppingV1 => ({ schemaVersion: 1, updatedAt: new Date(0).toISOString(), items: [] });
const isIsoDate = (value: unknown): value is string => typeof value === 'string' && !Number.isNaN(Date.parse(value));
const isId = (value: unknown): value is string => typeof value === 'string' && /^[a-z0-9][a-z0-9-]{0,127}$/.test(value);
const isUnit = (value: unknown): value is Unit => typeof value === 'string' && units.includes(value as Unit);

function isQuantity(value: unknown): value is Quantity | null {
  if (value === null) return true;
  if (!value || typeof value !== 'object') return false;
  const quantity = value as Record<string, unknown>;
  if (!isUnit(quantity.unit)) return false;
  if (quantity.kind === 'exact') return typeof quantity.value === 'number' && Number.isFinite(quantity.value) && quantity.value > 0;
  return quantity.kind === 'range' && typeof quantity.min === 'number' && typeof quantity.max === 'number' && Number.isFinite(quantity.min) && Number.isFinite(quantity.max) && quantity.min > 0 && quantity.min <= quantity.max;
}

function isSource(value: unknown): value is ShoppingSourceV1 {
  if (!value || typeof value !== 'object') return false;
  const source = value as Record<string, unknown>;
  return isId(source.recipeId) && isId(source.recipeVersionId) && isId(source.ingredientLineId) && isId(source.sectionId) && isId(source.selectedIngredientId);
}

function mergeKey(ingredientId: string, quantity: Quantity | null): string {
  return `${ingredientId}:${quantity?.unit ?? 'as-needed'}`;
}

function sourceKey(source: ShoppingSourceV1): string {
  return [source.recipeId, source.recipeVersionId, source.ingredientLineId].join(':');
}

function isItem(value: unknown): value is ShoppingItemV1 {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return isId(item.ingredientId) && typeof item.id === 'string' && isQuantity(item.quantity) && typeof item.checked === 'boolean' && isIsoDate(item.createdAt) && isIsoDate(item.updatedAt) && Array.isArray(item.sources) && item.sources.length > 0 && item.sources.every(isSource);
}

export function parseShopping(rawValue: string | null): ShoppingV1 | null {
  if (!rawValue) return null;
  try {
    const value: unknown = JSON.parse(rawValue);
    if (!value || typeof value !== 'object') return null;
    const candidate = value as Record<string, unknown>;
    if (candidate.schemaVersion !== 1 || !isIsoDate(candidate.updatedAt) || !Array.isArray(candidate.items)) return null;
    const items = candidate.items.filter(isItem).slice(0, 1000);
    return { schemaVersion: 1, updatedAt: candidate.updatedAt, items };
  } catch {
    return null;
  }
}

export function readShopping(storage?: StorageLike | null): ShoppingV1 {
  return parseShopping(readStorageValue(shoppingStorageKey, storage)) ?? emptyShopping();
}

export function persistShopping(state: ShoppingV1, storage?: StorageLike | null): ShoppingV1 {
  const valid = parseShopping(JSON.stringify(state)) ?? emptyShopping();
  writeStorageValue(shoppingStorageKey, JSON.stringify(valid), storage);
  return valid;
}

function combinedQuantity(left: Quantity, right: Quantity): Quantity {
  if (left.kind === 'exact' && right.kind === 'exact') return { kind: 'exact', unit: left.unit, value: left.value + right.value };
  const leftRange = left.kind === 'exact' ? { min: left.value, max: left.value } : left;
  const rightRange = right.kind === 'exact' ? { min: right.value, max: right.value } : right;
  return { kind: 'range', unit: left.unit, min: leftRange.min + rightRange.min, max: leftRange.max + rightRange.max };
}

/** Adds each unique source once, aggregating compatible ingredient quantities. */
export function addShoppingIngredients(
  ingredients: ShoppingIngredientInput[],
  now = new Date(),
  storage?: StorageLike | null,
): ShoppingV1 {
  const current = readShopping(storage);
  const items = current.items.map((item) => ({ ...item, sources: [...item.sources] }));
  for (const input of ingredients) {
    if (!isId(input.ingredientId) || !isQuantity(input.quantity) || !isSource(input.source)) continue;
    const id = mergeKey(input.ingredientId, input.quantity);
    const existing = items.find((item) => item.id === id);
    if (!existing) {
      items.push({ id, ingredientId: input.ingredientId, quantity: input.quantity, checked: false, createdAt: now.toISOString(), updatedAt: now.toISOString(), sources: [input.source] });
      continue;
    }
    if (existing.sources.some((source) => sourceKey(source) === sourceKey(input.source))) continue;
    existing.sources.push(input.source);
    if (existing.quantity && input.quantity) existing.quantity = combinedQuantity(existing.quantity, input.quantity);
    existing.checked = false;
    existing.updatedAt = now.toISOString();
  }
  return persistShopping({ schemaVersion: 1, updatedAt: now.toISOString(), items }, storage);
}

export function setShoppingItemChecked(id: string, checked: boolean, now = new Date(), storage?: StorageLike | null): ShoppingV1 {
  const current = readShopping(storage);
  return persistShopping({ ...current, updatedAt: now.toISOString(), items: current.items.map((item) => item.id === id ? { ...item, checked, updatedAt: now.toISOString() } : item) }, storage);
}

export function removeShoppingItem(id: string, now = new Date(), storage?: StorageLike | null): ShoppingV1 {
  const current = readShopping(storage);
  return persistShopping({ ...current, updatedAt: now.toISOString(), items: current.items.filter((item) => item.id !== id) }, storage);
}

export function subscribeToShopping(onChange: () => void): () => void {
  return subscribeToStorageKey(shoppingStorageKey, onChange);
}
