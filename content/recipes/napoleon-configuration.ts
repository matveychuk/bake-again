import { calculateRecipeConfiguration } from './calculate-configuration.ts';
import { glutenFreeNapoleonRecipe } from './gluten-free-napoleon.recipe.ts';
import type {
  BatchScaleFactor,
  CalculatedRecipeConfiguration,
  Quantity,
  QuantityAdjustmentSelection,
} from './recipe.types.ts';

export const NAPOLEON_BASE_GEOMETRY_ID = 'round-28cm-6-layers-each';
export const NAPOLEON_PREVIEW_GEOMETRY_ID = 'round-24cm-preview';

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
    params.set('ingredient', selection.quantityAdjustment.anchorIngredientLineId);
    params.set('amount', String(selection.quantityAdjustment.availableAmount.value));
    params.set('unit', selection.quantityAdjustment.availableAmount.unit);
  }
  return params.toString();
}

export function parseNapoleonConfiguration(
  params: URLSearchParams,
): NapoleonConfigurationSelection {
  const geometryId = params.get('geometry');
  const supportedGeometry = [NAPOLEON_BASE_GEOMETRY_ID, NAPOLEON_PREVIEW_GEOMETRY_ID]
    .includes(geometryId ?? '')
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
    ? requestedScale as BatchScaleFactor
    : 1;
  return {
    geometryId: supportedGeometry,
    quantityAdjustment: { mode: 'batchScale', factor },
  };
}

export function formatQuantity(amount: Quantity | null) {
  if (!amount) return 'As needed';
  const format = (value: number) =>
    Number.isInteger(value)
      ? String(value)
      : value.toFixed(value < 2 ? 2 : 1).replace(/0+$/, '').replace(/\.$/, '');
  if (amount.kind === 'range') {
    return `${format(amount.min)}–${format(amount.max)} ${amount.unit}`;
  }
  return `${format(amount.value)} ${amount.unit === 'piece' ? '' : amount.unit}`.trim();
}
