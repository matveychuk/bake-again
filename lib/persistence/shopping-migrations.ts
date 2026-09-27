import type { ShoppingItemV1, ShoppingSourceV1 } from './shopping.ts';

function sourceKey(source: ShoppingSourceV1) {
  return JSON.stringify([
    source.recipeId,
    source.recipeVersionId,
    source.configurationKey ?? 'base',
    source.ingredientLineId,
    source.batchId ?? 'base',
  ]);
}

/** This published version used one tablespoon per 100 g flour, but stored null. */
function sweetenerAmount(source: ShoppingSourceV1): number | null {
  if (
    source.recipeId !== 'apple-fritters' ||
    source.recipeVersionId !== 'apple-fritters-source-v1' ||
    source.ingredientLineId !== 'sweetener' ||
    source.selectedIngredientId !== 'sweetener'
  )
    return null;
  const key = source.configurationKey ?? 'base';
  if (key === 'base') return 1;
  if (/^scale:(0\.5|1|1\.5|2)$/.test(key)) return Number(key.slice(6));
  const match = /^ingredient:flour:([0-9]+(?:\.[0-9]+)?):g$/.exec(key);
  const amount = match ? Number(match[1]) / 100 : 0;
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

/** Pure, idempotent recovery. Unknown sources remain unchanged; no storage is erased. */
export function recoverShoppingSweetener(
  items: ShoppingItemV1[],
): ShoppingItemV1[] {
  const result = items
    .filter(
      (item) => item.ingredientId !== 'sweetener' || item.quantity !== null,
    )
    .map((item) => ({ ...item, sources: [...item.sources] }));
  for (const item of items) {
    if (item.ingredientId !== 'sweetener' || item.quantity !== null) continue;
    const unknown: ShoppingSourceV1[] = [];
    for (const source of item.sources) {
      const amount = sweetenerAmount(source);
      if (amount === null) {
        unknown.push(source);
        continue;
      }
      let target = result.find((entry) => entry.id === 'sweetener:tbsp');
      if (
        target?.sources.some((entry) => sourceKey(entry) === sourceKey(source))
      )
        continue;
      if (!target) {
        target = {
          ...item,
          id: 'sweetener:tbsp',
          quantity: { kind: 'exact', value: amount, unit: 'tbsp' },
          sources: [source],
        };
        result.push(target);
      } else {
        const quantity = target.quantity!;
        target.quantity =
          quantity.kind === 'exact'
            ? { ...quantity, value: quantity.value + amount }
            : {
                ...quantity,
                min: quantity.min + amount,
                max: quantity.max + amount,
              };
        target.sources.push(source);
        target.checked = target.checked && item.checked;
        target.createdAt =
          target.createdAt < item.createdAt ? target.createdAt : item.createdAt;
        target.updatedAt =
          target.updatedAt > item.updatedAt ? target.updatedAt : item.updatedAt;
      }
    }
    if (unknown.length) result.push({ ...item, sources: unknown });
  }
  return result;
}
