import type { StructuredIngredient } from './source-recipe.types';
import type { Quantity } from './recipe.types';

export type ParsedInventoryAmount = {
  minimum: number;
  maximum: number | null;
  unit: string;
};

const fractionValues: Record<string, number> = {
  '¼': 0.25,
  '½': 0.5,
  '¾': 0.75,
};

function parseNumber(value: string) {
  const mixed = value.match(/^(\d+)([¼½¾])$/);
  if (mixed) return Number(mixed[1]) + fractionValues[mixed[2]];
  if (fractionValues[value] !== undefined) return fractionValues[value];
  const numeric = Number(value.replace(',', '.'));
  return Number.isFinite(numeric) ? numeric : null;
}

export function parseInventoryAmount(
  amount: string,
): ParsedInventoryAmount | null {
  const match = amount
    .trim()
    .match(
      /^(\d+(?:[.,]\d+)?[¼½¾]?|[¼½¾])(?:\s*[–-]\s*(\d+(?:[.,]\d+)?[¼½¾]?|[¼½¾]))?\s*(.*)$/,
    );
  if (!match) return null;
  const minimum = parseNumber(match[1]);
  const maximum = match[2] ? parseNumber(match[2]) : null;
  if (minimum === null || (maximum === null && Boolean(match[2]))) return null;
  return { minimum, maximum, unit: match[3].trim() };
}

function formatValue(value: number) {
  const rounded = Math.round(value * 100) / 100;
  if (rounded === 0.25) return '¼';
  if (rounded === 0.5) return '½';
  if (rounded === 0.75) return '¾';
  const whole = Math.floor(rounded);
  const fraction = rounded - whole;
  if (whole > 0 && fraction === 0.25) return `${whole}¼`;
  if (whole > 0 && fraction === 0.5) return `${whole}½`;
  if (whole > 0 && fraction === 0.75) return `${whole}¾`;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

export function scaleInventoryAmount(amount: string, factor: number) {
  const parsed = parseInventoryAmount(amount);
  if (!parsed) return amount;
  const values =
    parsed.maximum === null
      ? formatValue(parsed.minimum * factor)
      : `${formatValue(parsed.minimum * factor)}–${formatValue(parsed.maximum * factor)}`;
  return `${values}${parsed.unit ? ` ${parsed.unit}` : ''}`;
}

export function findScalingAnchor(
  ingredients: StructuredIngredient[],
  ingredientId = 'flour',
) {
  const ingredient = ingredients.find((item) => item.id === ingredientId);
  if (!ingredient) return null;
  const amount = ingredient.quantity.base;
  if (!amount || amount.kind !== 'exact') return null;
  return {
    ingredient,
    amount: { minimum: amount.value, maximum: null, unit: amount.unit },
  };
}

export function scaleStructuredQuantity(
  amount: Quantity | null,
  factor: number,
): Quantity | null {
  if (!amount) return null;
  return amount.kind === 'exact'
    ? { ...amount, value: amount.value * factor }
    : { ...amount, min: amount.min * factor, max: amount.max * factor };
}
