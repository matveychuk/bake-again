import { resolveStepHelp } from './step-help.ts';
import type {
  CookIngredient,
  CookStep,
} from '../../components/cook-mode/cook-mode.types.ts';
import type { AppLocale } from '../../lib/i18n/config.ts';
import { formatQuantity } from '../../lib/i18n/format.ts';
import type { Quantity } from './recipe.types.ts';
import type {
  StructuredIngredient,
  StructuredRecipeContent,
  StructuredRecipeStep,
} from './source-recipe.types.ts';

export function isSourceCookModeAvailable(
  structured: StructuredRecipeContent | null | undefined,
): boolean {
  return Boolean(
    structured &&
    structured.completeness !== 'incompleteSource' &&
    structured.steps.length > 0,
  );
}

function durationOptionsSeconds(
  structured: StructuredRecipeContent,
  stepIds: string[],
): number[] | undefined {
  const phases = structured.timing?.phases.filter(
    (phase) => phase.relatedStepId && stepIds.includes(phase.relatedStepId),
  );
  if (!phases?.length) return undefined;
  return [
    ...new Set(
      phases.flatMap(({ duration }) => {
        const multiplier =
          duration.unit === 'hour' ? 3600 : duration.unit === 'minute' ? 60 : 1;
        if (duration.kind === 'range') {
          return [duration.min * multiplier, duration.max * multiplier];
        }
        const value =
          duration.kind === 'minimum' ? duration.min : duration.value;
        return [value * multiplier];
      }),
    ),
  ];
}

function timerOptionLabels(
  structured: StructuredRecipeContent,
  stepIds: string[],
) {
  const phases = structured.timing?.phases.filter(
    (phase) => phase.relatedStepId && stepIds.includes(phase.relatedStepId),
  );
  if (!phases || phases.length < 2) return undefined;
  const labels: Record<number, string> = {};
  for (const phase of phases) {
    const seconds = durationOptionsSeconds(
      { ...structured, timing: { ...structured.timing!, phases: [phase] } },
      stepIds,
    )!;
    for (const value of seconds) {
      labels[value] = labels[value]
        ? `${labels[value]} / ${phase.label}`
        : phase.label;
    }
  }
  return labels;
}

function ingredientMap(structured: StructuredRecipeContent) {
  return new Map(
    structured.ingredientSections
      .flatMap((section) => section.ingredients)
      .map((ingredient) => [ingredient.id, ingredient]),
  );
}

function cookIngredient(
  ingredient: StructuredIngredient,
  locale: AppLocale,
  usage: NonNullable<StructuredRecipeStep['cookIngredients']>[number],
): CookIngredient {
  const showQuantity = usage.quantity !== 'omit';
  const portion = (amount: Quantity | null | undefined): Quantity | null => {
    if (!amount) return null;
    const fraction = usage.fraction ?? 1;
    return amount.kind === 'range'
      ? { ...amount, min: amount.min * fraction, max: amount.max * fraction }
      : { ...amount, value: amount.value * fraction };
  };
  return {
    id: ingredient.id,
    name: ingredient.name,
    primary: showQuantity
      ? formatQuantity(
          locale,
          portion(ingredient.quantity.base ?? ingredient.quantity.equivalent),
        )
      : undefined,
    secondary:
      showQuantity && ingredient.quantity.base && ingredient.quantity.equivalent
        ? formatQuantity(locale, portion(ingredient.quantity.equivalent))
        : undefined,
    note: usage.note ?? ingredient.note,
  };
}

export function createSourceCookIngredients(
  structured: StructuredRecipeContent,
  locale: AppLocale,
): CookIngredient[] {
  return structured.ingredientSections.flatMap((section) =>
    section.ingredients.map((ingredient) =>
      cookIngredient(ingredient, locale, {
        ingredientId: ingredient.id,
      }),
    ),
  );
}

export function createSourceCookIngredientSections(
  structured: StructuredRecipeContent,
  locale: AppLocale,
) {
  return structured.ingredientSections.map((section) => ({
    id: section.id,
    title: section.title,
    items: section.ingredients.map((ingredient) =>
      cookIngredient(ingredient, locale, { ingredientId: ingredient.id }),
    ),
  }));
}

/**
 * Build Cook Mode screens from canonical steps. Consecutive steps may share a
 * `cookGroup`; this changes presentation only and preserves their source IDs.
 */
export function createSourceCookSteps(
  structured: StructuredRecipeContent,
  locale: AppLocale,
): CookStep[] {
  const ingredients = ingredientMap(structured);
  const groups: StructuredRecipeStep[][] = [];

  for (const step of structured.steps) {
    const previous = groups.at(-1);
    if (step.cookGroup && previous?.at(-1)?.cookGroup === step.cookGroup) {
      previous.push(step);
    } else {
      groups.push([step]);
    }
  }

  return groups.map((steps, index) => {
    const stepIds = steps.map((step) => step.id);
    const ingredientUsages = steps.flatMap(
      (step) => step.cookIngredients ?? [],
    );
    const timers = durationOptionsSeconds(structured, stepIds);
    const media = steps.flatMap((step) =>
      (step.media ?? []).map(({ id, src, alt, title, caption, type, fit }) => ({
        fit,
        type,
        id,
        src,
        alt,
        title,
        caption,
      })),
    );

    return {
      preparedAnswers: steps.flatMap(resolveStepHelp),
      stepIds: stepIds as [string, ...string[]],
      technique: steps.find((step) => step.technique)?.technique,
      number: String(index + 1).padStart(2, '0'),
      meta: steps.find((step) => step.meta)?.meta ?? '',
      title: steps[0].cookTitle ?? steps[0].title,
      instructions: steps.flatMap(
        (step) => step.cookInstructions ?? [step.body],
      ),
      ingredients: ingredientUsages.flatMap((usage) => {
        const ingredient = ingredients.get(usage.ingredientId);
        return ingredient ? [cookIngredient(ingredient, locale, usage)] : [];
      }),
      checkpoint:
        steps.flatMap((step) => step.checkpoint ?? []).join(' ') || undefined,
      tip: steps.flatMap((step) => step.tip ?? []).join(' ') || undefined,
      timerSeconds: timers?.[0],
      timerOptionsSeconds: timers,
      timerOptionLabels: timerOptionLabels(structured, stepIds),
      media: media.length > 0 ? media : undefined,
    };
  });
}
