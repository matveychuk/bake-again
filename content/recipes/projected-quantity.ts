import { scaleQuantity } from './calculate-configuration.ts';
import type { StructuredIngredient } from './localized-recipe.types.ts';

/** Shared arithmetic for detail, shopping, Cook and print projections. */
export function calculateProjectedIngredient(
  ingredient: StructuredIngredient,
  factor: number,
) {
  const rule =
    ingredient.scalingRule ??
    (ingredient.scaling === 'fixed'
      ? { kind: 'fixed' as const }
      : { kind: 'linear' as const });
  const base = scaleQuantity(ingredient.quantity.base, rule, factor);
  const equivalent = scaleQuantity(
    ingredient.quantity.equivalent ?? null,
    rule,
    factor,
  );
  return {
    base: base.amount,
    equivalent: equivalent.amount,
    requiresResolution: base.requiresResolution,
    rule: rule.kind,
  };
}
