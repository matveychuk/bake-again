import { recipeConfigurationQueryIssue } from './recipe-configuration-query.ts';
import { calculateRecipeConfiguration } from './calculate-configuration.ts';
import { glutenFreeNapoleonRecipe } from './gluten-free-napoleon.recipe.ts';
import type { AppLocale } from '../../lib/i18n/config.ts';
import { getUiMessages } from '../../lib/i18n/messages.ts';
import type {
  BatchScaleFactor,
  CalculatedRecipeConfiguration,
  Quantity,
  QuantityAdjustmentSelection,
} from './recipe.types.ts';

export const NAPOLEON_BASE_GEOMETRY_ID = 'round-24cm-6-layers-each';
export const NAPOLEON_PREVIEW_GEOMETRY_ID = 'round-28cm-preview';

export type NapoleonConfigurationSelection = {
  geometryId: string;
  quantityAdjustment: QuantityAdjustmentSelection;
};

export const napoleonBaseSelection: NapoleonConfigurationSelection = {
  geometryId: NAPOLEON_BASE_GEOMETRY_ID,
  quantityAdjustment: { mode: 'batchScale', factor: 1 },
};

export function calculateNapoleonConfiguration(
  selection: NapoleonConfigurationSelection,
): CalculatedRecipeConfiguration {
  return calculateRecipeConfiguration(
    glutenFreeNapoleonRecipe,
    selection.geometryId,
    selection.quantityAdjustment,
  );
}

export function encodeNapoleonConfiguration(
  selection: NapoleonConfigurationSelection,
) {
  const params = new URLSearchParams({ geometry: selection.geometryId });
  if (selection.quantityAdjustment.mode === 'batchScale') {
    params.set('mode', 'scale');
    params.set('scale', String(selection.quantityAdjustment.factor));
  } else {
    params.set('mode', 'ingredient');
    params.set(
      'ingredient',
      selection.quantityAdjustment.anchorIngredientLineId,
    );
    params.set(
      'amount',
      String(selection.quantityAdjustment.availableAmount.value),
    );
    params.set('unit', selection.quantityAdjustment.availableAmount.unit);
  }
  return params.toString();
}

export function parseNapoleonConfiguration(
  params: URLSearchParams,
): NapoleonConfigurationSelection {
  const geometryId = params.get('geometry');
  const supportedGeometry = [
    NAPOLEON_BASE_GEOMETRY_ID,
    NAPOLEON_PREVIEW_GEOMETRY_ID,
  ].includes(geometryId ?? '')
    ? geometryId!
    : NAPOLEON_BASE_GEOMETRY_ID;

  if (params.get('mode') === 'ingredient') {
    const amount = Number(params.get('amount'));
    if (Number.isFinite(amount) && amount >= 100) {
      return {
        geometryId: supportedGeometry,
        quantityAdjustment: {
          mode: 'useWhatIHave',
          anchorIngredientLineId: 'schar-mix-b',
          availableAmount: { value: amount, unit: 'g' },
        },
      };
    }
  }

  const requestedScale = Number(params.get('scale'));
  const allowedScales: BatchScaleFactor[] = [0.5, 1, 1.5, 2];
  const factor = allowedScales.includes(requestedScale as BatchScaleFactor)
    ? (requestedScale as BatchScaleFactor)
    : 1;
  return {
    geometryId: supportedGeometry,
    quantityAdjustment: { mode: 'batchScale', factor },
  };
}

/** Resolve the requested Cook version without substituting a different recipe. */
export function resolveNapoleonCookConfiguration(
  search: string,
  locale: AppLocale,
) {
  const params = new URLSearchParams(search);
  const messages = getUiMessages(locale);
  const issue = recipeConfigurationQueryIssue(
    params,
    NAPOLEON_BASE_GEOMETRY_ID,
  );
  if (issue)
    return {
      kind: 'blocked',
      reason:
        issue === 'geometry'
          ? messages.scaling.unsupportedGeometry
          : messages.cook.unsupportedConfiguration,
    } as const;
  if (params.get('mode') === 'ingredient') {
    const amount = Number(params.get('amount'));
    if (!Number.isFinite(amount) || amount <= 0) {
      return {
        kind: 'blocked',
        reason: messages.scaling.positiveAmount,
      } as const;
    }
    if (
      amount < 100 ||
      (params.has('ingredient') &&
        params.get('ingredient') !== 'schar-mix-b') ||
      (params.has('unit') && params.get('unit') !== 'g')
    ) {
      return {
        kind: 'blocked',
        reason: messages.scaling.supportedAmount,
      } as const;
    }
  }
  const selection = parseNapoleonConfiguration(params);
  const configuration = calculateNapoleonConfiguration(selection);
  if (!configuration.cookMode.eligible) {
    return {
      kind: 'blocked',
      reason: configuration.warnings.some(
        (warning) => warning.code === 'fractional-discrete-ingredient',
      )
        ? messages.cook.fractionalIngredients
        : messages.cook.unsupportedConfiguration,
    } as const;
  }
  return {
    kind: 'ready',
    selection,
    configuration,
    isAdjusted:
      selection.geometryId !== napoleonBaseSelection.geometryId ||
      Math.abs(configuration.totalScaleFactor - 1) > 0.000001,
  } as const;
}

export function formatQuantity(amount: Quantity | null) {
  if (!amount) return 'As needed';
  const format = (value: number) =>
    Number.isInteger(value)
      ? String(value)
      : value
          .toFixed(value < 2 ? 2 : 1)
          .replace(/0+$/, '')
          .replace(/\.$/, '');
  if (amount.kind === 'range') {
    return `${format(amount.min)}–${format(amount.max)} ${amount.unit}`;
  }
  return `${format(amount.value)} ${amount.unit === 'piece' ? '' : amount.unit}`.trim();
}
