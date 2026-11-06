import { calculateProjectedIngredient } from './projected-quantity.ts';
import type { AssistantConfiguration } from '../../lib/assistant/contracts.ts';
import type { AppLocale } from '../../lib/i18n/config.ts';
import { formatNumber, formatQuantity } from '../../lib/i18n/format.ts';
import { getUiMessages } from '../../lib/i18n/messages.ts';
import {
  findScalingAnchor,
  scaleStructuredQuantity,
} from './inventory-calculation.ts';
import type { BatchScaleFactor, Recipe, Unit } from './recipe.types.ts';
import type {
  StructuredRecipeContent,
  StructuredRecipeYield,
} from './localized-recipe.types.ts';

export const recipeBatchScaleFactors = [0.5, 1, 1.5, 2] as const;

export type RecipeContentConfiguration =
  | { kind: 'base'; mode: 'scale'; scaleFactor: 1 }
  | {
      kind: 'base';
      mode: 'ingredient';
      scaleFactor: 1;
      ingredientId: string;
      availableAmount: number;
      unit: Unit;
    }
  | {
      kind: 'adjusted';
      mode: 'scale';
      scaleFactor: Exclude<BatchScaleFactor, 1>;
    }
  | {
      kind: 'adjusted';
      mode: 'ingredient';
      scaleFactor: number;
      ingredientId: string;
      availableAmount: number;
      unit: Unit;
    }
  | {
      kind: 'invalid';
      mode: 'ingredient';
      ingredientId: string;
      availableAmount: string;
      unit: Unit;
      reason: 'positive' | 'unsupported';
    };

export type RecipeScalingBounds = {
  minimum?: number;
  maximum?: number;
};

export function recipeScalingBounds(
  recipe: Recipe | null | undefined,
  ingredientId: string | undefined,
): RecipeScalingBounds | undefined {
  const anchor =
    recipe?.configuration.quantityAdjustment.useWhatIHave?.scalingAnchors.find(
      (candidate) => candidate.ingredientLineId === ingredientId,
    );
  return anchor
    ? { minimum: anchor.minimum, maximum: anchor.maximum }
    : undefined;
}

function isUnit(value: string): value is Unit {
  return ['g', 'ml', 'piece', 'tsp', 'tbsp', 'cup', 'packet', 'pinch'].includes(
    value,
  );
}

export function parseRecipeContentConfiguration(
  search: URLSearchParams | string,
  content: StructuredRecipeContent | null | undefined,
  scalingAnchorIngredientId?: string,
  bounds?: RecipeScalingBounds,
): RecipeContentConfiguration {
  const params =
    typeof search === 'string' ? new URLSearchParams(search) : search;
  const ingredients =
    content?.ingredientSections.flatMap((section) => section.ingredients) ?? [];
  const anchor = findScalingAnchor(ingredients, scalingAnchorIngredientId);

  if (params.get('mode') === 'ingredient' && anchor) {
    const ingredientId = params.get('ingredient') ?? anchor.ingredient.id;
    const unitParam = params.get('unit') ?? anchor.amount.unit;
    const unit = isUnit(unitParam) ? unitParam : anchor.amount.unit;
    const availableAmount = params.get('amount') ?? '';
    const numericAmount = Number(availableAmount);
    const positive = Number.isFinite(numericAmount) && numericAmount > 0;
    const supported =
      positive &&
      (bounds?.minimum === undefined || numericAmount >= bounds.minimum) &&
      (bounds?.maximum === undefined || numericAmount <= bounds.maximum);
    if (
      ingredientId !== anchor.ingredient.id ||
      unitParam !== anchor.amount.unit ||
      !supported
    ) {
      return {
        kind: 'invalid',
        mode: 'ingredient',
        ingredientId: anchor.ingredient.id,
        availableAmount,
        unit: anchor.amount.unit,
        reason: positive ? 'unsupported' : 'positive',
      };
    }
    const common = {
      mode: 'ingredient',
      ingredientId,
      availableAmount: numericAmount,
      unit,
    } as const;
    if (Math.abs(numericAmount - anchor.amount.minimum) < 0.000001) {
      return { kind: 'base', ...common, scaleFactor: 1 };
    }
    return {
      kind: 'adjusted',
      ...common,
      scaleFactor: numericAmount / anchor.amount.minimum,
    };
  }

  const factor = Number(params.get('scale'));
  if (
    params.get('mode') === 'scale' &&
    recipeBatchScaleFactors.includes(factor as BatchScaleFactor) &&
    factor !== 1
  ) {
    return {
      kind: 'adjusted',
      mode: 'scale',
      scaleFactor: factor as Exclude<BatchScaleFactor, 1>,
    };
  }

  return { kind: 'base', mode: 'scale', scaleFactor: 1 };
}

export function updateRecipeContentConfigurationParams(
  current: URLSearchParams | string,
  configuration:
    | { mode: 'scale'; scaleFactor: BatchScaleFactor }
    | {
        mode: 'ingredient';
        ingredientId: string;
        availableAmount: string;
        unit: Unit;
      },
) {
  const params = new URLSearchParams(
    typeof current === 'string' ? current : current.toString(),
  );
  for (const key of ['mode', 'scale', 'ingredient', 'amount', 'unit']) {
    params.delete(key);
  }
  if (configuration.mode === 'scale') {
    if (configuration.scaleFactor !== 1) {
      params.set('mode', 'scale');
      params.set('scale', String(configuration.scaleFactor));
    }
  } else {
    params.set('mode', 'ingredient');
    params.set('ingredient', configuration.ingredientId);
    params.set('amount', configuration.availableAmount);
    params.set('unit', configuration.unit);
  }
  return params;
}

function scaledYield(
  sourceYield: StructuredRecipeYield | undefined,
  factor: number,
  locale: AppLocale,
): StructuredRecipeYield | undefined {
  if (!sourceYield) return undefined;
  const count =
    sourceYield.count.kind === 'exact'
      ? { ...sourceYield.count, value: sourceYield.count.value * factor }
      : {
          ...sourceYield.count,
          min: sourceYield.count.min * factor,
          max: sourceYield.count.max * factor,
        };
  const values =
    count.kind === 'exact' ? [count.value] : [count.min, count.max];
  let valueIndex = 0;
  const label = sourceYield.label.replace(/\d+(?:[.,]\d+)?/g, (value) => {
    const next = values[valueIndex];
    if (next === undefined) return value;
    valueIndex += 1;
    return formatNumber(locale, Math.round(next * 100) / 100);
  });
  return { ...sourceYield, count, label };
}

/** Scale explicitly annotated amounts in prose, preserving times and temperatures. */
export function applyRecipeContentConfiguration(
  content: StructuredRecipeContent,
  configuration:
    | RecipeContentConfiguration
    | { kind: 'adjusted'; scaleFactor: number },
  locale: AppLocale,
): StructuredRecipeContent {
  if (configuration.kind !== 'adjusted') return content;
  const factor = configuration.scaleFactor;
  const recipeYield = scaledYield(content.yield, factor, locale);
  const configurationWarnings: import('./recipe.types.ts').ConfigurationWarning[] =
    [];
  const ingredientSections = content.ingredientSections.map((section) => ({
    ...section,
    ingredients: section.ingredients.map((ingredient) => {
      const result = calculateProjectedIngredient(ingredient, factor);
      if (result.requiresResolution)
        configurationWarnings.push({
          code:
            result.rule === 'discrete'
              ? 'fractional-discrete-ingredient'
              : 'manual-scaling-required',
          severity: 'blocking',
          ingredientLineId: ingredient.id,
          message: getUiMessages(locale).cook.unsupportedConfiguration,
        });
      return {
        ...ingredient,
        quantity: {
          ...ingredient.quantity,
          base: result.base,
          equivalent: result.equivalent,
        },
      };
    }),
  }));
  return {
    ...content,
    evidence: {
      status:
        content.evidence?.status === 'suggested' ? 'suggested' : 'calculated',
      explanation: [
        content.evidence?.status === 'suggested'
          ? content.evidence.explanation
          : null,
        getUiMessages(locale).status.calculated.explanation,
      ]
        .filter(Boolean)
        .join(' '),
    },
    steps: content.steps.map((step) => ({
      ...step,
      body: scaleStepProse(
        step.body,
        step.quantityMentions ?? [],
        factor,
        locale,
      ),
    })),
    yield: recipeYield,
    overview: {
      ...content.overview,
      yieldLabel: recipeYield?.label ?? content.overview.yieldLabel,
    },
    ingredientSections: ingredientSections.map(section => ({...section,ingredients:section.ingredients.map(ingredient => ({...ingredient,note: ingredient.note ? scaleStepProse(ingredient.note,ingredient.noteQuantityMentions ?? [],factor,locale) : undefined}))})),
    configurationWarnings,
  };
}

export function recipeContentConfigurationKey(
  configuration: RecipeContentConfiguration,
) {
  if (configuration.kind === 'base') return 'base';
  if (configuration.kind === 'invalid') return 'invalid';
  return configuration.mode === 'scale'
    ? `scale:${configuration.scaleFactor}`
    : `ingredient:${configuration.ingredientId}:${configuration.availableAmount}:${configuration.unit}`;
}

export function recipeAssistantConfiguration(
  recipeId: string,
  content: StructuredRecipeContent,
  configuration: RecipeContentConfiguration,
): AssistantConfiguration | undefined {
  if (configuration.kind === 'invalid') return undefined;
  if (configuration.kind === 'base') return { kind: 'base' };
  return {
    kind: 'adjusted',
    geometryId: content.geometry?.id ?? `${recipeId}-base`,
    quantityAdjustment:
      configuration.mode === 'scale'
        ? { mode: 'batchScale', factor: configuration.scaleFactor }
        : {
            mode: 'useWhatIHave',
            anchorIngredientLineId: configuration.ingredientId,
            availableAmount: {
              value: configuration.availableAmount,
              unit: configuration.unit,
            },
          },
  };
}

/** Substitute original mentions once, so 16 → 8 cannot then become 4. */
export function scaleStepProse(
  body: string,
  mentions: NonNullable<
    import('./localized-recipe.types.ts').StructuredRecipeStep['quantityMentions']
  >,
  factor: number,
  locale: AppLocale,
) {
  const replacements = new Map(
    mentions.map((mention) => [
      mention.text,
      mention.numberOnly && mention.quantity.kind === 'exact'
        ? formatNumber(locale, mention.quantity.value * factor)
        : formatQuantity(
            locale,
            scaleStructuredQuantity(mention.quantity, factor),
          ),
    ]),
  );
  if (!replacements.size) return body;
  const escaped = [...replacements.keys()]
    .sort((a, b) => b.length - a.length)
    .map((text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return body.replace(new RegExp(escaped.join('|'), 'g'), (match) =>
    replacements.get(match)!,
  );
}
