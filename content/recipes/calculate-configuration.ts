import type {
  CalculatedIngredientAmount,
  CalculatedRecipeConfiguration,
  ConfigurationWarning,
  GeometryOption,
  IngredientScalingRule,
  Quantity,
  QuantityAdjustmentSelection,
  RecipeDraft,
} from './recipe.types';

const nearlyEqual = (left: number, right: number) =>
  Math.abs(left - right) < 1e-9;

const roundTo = (
  value: number,
  increment = 0,
  direction: 'nearest' | 'up' | 'down' = 'nearest',
) => {
  if (!increment) return value;
  const scaled = value / increment;
  const rounded =
    direction === 'up'
      ? Math.ceil(scaled)
      : direction === 'down'
        ? Math.floor(scaled)
        : Math.round(scaled);
  return rounded * increment;
};

const geometryArea = (geometry: GeometryOption) => {
  if (geometry.shape === 'round' && geometry.diameterCm) {
    return Math.PI * (geometry.diameterCm / 2) ** 2;
  }
  if (
    geometry.shape === 'rectangular' &&
    geometry.widthCm &&
    geometry.lengthCm
  ) {
    return geometry.widthCm * geometry.lengthCm;
  }
  return null;
};

const scaleQuantity = (
  amount: Quantity | null,
  rule: IngredientScalingRule,
  factor: number,
): { amount: Quantity | null; requiresResolution: boolean } => {
  if (amount === null) {
    return { amount: null, requiresResolution: rule.kind === 'manual' };
  }
  if (rule.kind === 'fixed') {
    return { amount, requiresResolution: false };
  }
  if (rule.kind === 'manual') {
    return nearlyEqual(factor, 1)
      ? { amount, requiresResolution: false }
      : { amount: null, requiresResolution: true };
  }

  if (rule.kind === 'discrete') {
    const scaleValue = (value: number) => value * factor;
    const raw =
      amount.kind === 'exact'
        ? scaleValue(amount.value)
        : scaleValue(amount.min);
    const rawValues =
      amount.kind === 'exact'
        ? [raw]
        : [scaleValue(amount.min), scaleValue(amount.max)];
    const unresolved =
      rule.rounding === 'manual' &&
      rawValues.some(
        (value) =>
          !nearlyEqual(
            value / rule.increment,
            Math.round(value / rule.increment),
          ),
      );
    const adjust = (value: number) =>
      rule.rounding === 'manual'
        ? value
        : roundTo(value, rule.increment, rule.rounding);
    return {
      amount:
        amount.kind === 'exact'
          ? { ...amount, value: adjust(scaleValue(amount.value)) }
          : {
              ...amount,
              min: adjust(scaleValue(amount.min)),
              max: adjust(scaleValue(amount.max)),
            },
      requiresResolution: unresolved,
    };
  }

  const precision = rule.precision ?? 0;
  const rounding = rule.rounding ?? 'nearest';
  return {
    amount:
      amount.kind === 'exact'
        ? {
            ...amount,
            value: roundTo(amount.value * factor, precision, rounding),
          }
        : {
            ...amount,
            min: roundTo(amount.min * factor, precision, rounding),
            max: roundTo(amount.max * factor, precision, rounding),
          },
    requiresResolution: false,
  };
};

export function calculateRecipeConfiguration(
  recipe: RecipeDraft,
  geometryId: string,
  quantityAdjustment: QuantityAdjustmentSelection,
): CalculatedRecipeConfiguration {
  const geometries = [recipe.geometry.default, ...recipe.geometry.alternatives];
  const geometry = geometries.find(({ id }) => id === geometryId);
  if (!geometry) throw new Error(`Unknown geometry: ${geometryId}`);

  const warnings: ConfigurationWarning[] = [];
  const baseGeometry = recipe.geometry.default;
  let geometryScaleFactor = 1;
  if (geometry.id !== baseGeometry.id) {
    const support = recipe.configuration.geometryAdjustment;
    if (!support?.optionIds.includes(geometry.id)) {
      throw new Error(`Geometry adjustment is not supported: ${geometry.id}`);
    }
    const baseArea = geometryArea(baseGeometry);
    const selectedArea = geometryArea(geometry);
    if (support.quantityBasis === 'area' && baseArea && selectedArea) {
      geometryScaleFactor = selectedArea / baseArea;
    }
    if (support.timingPolicy === 'unverifiedWhenChanged') {
      warnings.push({
        code: 'unverified-timing',
        severity: 'blocking',
        message: 'Timing for the selected geometry has not been tested.',
      });
    }
  }

  const lines = recipe.ingredientSections.flatMap(({ lines }) => lines);
  let batchScaleFactor: number;
  let totalScaleFactor: number;
  if (quantityAdjustment.mode === 'batchScale') {
    const allowed = recipe.configuration.quantityAdjustment.batchScale?.allowed;
    if (!allowed?.includes(quantityAdjustment.factor)) {
      throw new Error(
        `Batch scale is not supported: ${quantityAdjustment.factor}`,
      );
    }
    batchScaleFactor = quantityAdjustment.factor;
    totalScaleFactor = geometryScaleFactor * batchScaleFactor;
  } else {
    const anchors =
      recipe.configuration.quantityAdjustment.useWhatIHave?.scalingAnchors;
    const anchor = anchors?.find(
      ({ ingredientLineId }) =>
        ingredientLineId === quantityAdjustment.anchorIngredientLineId,
    );
    const line = lines.find(({ id }) => id === anchor?.ingredientLineId);
    const availableValue = quantityAdjustment.availableAmount.value;
    if (
      !anchor ||
      !line ||
      line.amount?.kind !== 'exact' ||
      line.amount.unit !== anchor.allowedUnit ||
      quantityAdjustment.availableAmount.unit !== anchor.allowedUnit
    ) {
      throw new Error('Invalid Use what I have anchor or unit');
    }
    if (
      availableValue <= 0 ||
      (anchor.minimum !== undefined && availableValue < anchor.minimum) ||
      (anchor.maximum !== undefined && availableValue > anchor.maximum)
    ) {
      throw new Error('Use what I have amount is outside the supported range');
    }
    totalScaleFactor = availableValue / line.amount.value;
    batchScaleFactor = totalScaleFactor / geometryScaleFactor;
  }

  const ingredientAmounts: CalculatedIngredientAmount[] = lines.map((line) => {
    const rule = line.scaling ?? recipe.configuration.ingredientScaling.default;
    const scaled = scaleQuantity(line.amount, rule, totalScaleFactor);
    if (scaled.requiresResolution) {
      warnings.push({
        code:
          rule.kind === 'discrete'
            ? 'fractional-discrete-ingredient'
            : 'manual-scaling-required',
        severity: 'blocking',
        ingredientLineId: line.id,
        message:
          rule.kind === 'discrete'
            ? `${line.id} does not resolve to the required increment.`
            : `${line.id} must be adjusted manually.`,
      });
    }
    return {
      ingredientLineId: line.id,
      amount: scaled.amount,
      rule: rule.kind,
      requiresResolution: scaled.requiresResolution,
    };
  });

  return {
    recipeId: recipe.id,
    recipeVersionId: recipe.versionId,
    status: 'Calculated',
    provenance: 'Calculated',
    geometryId,
    quantityAdjustment,
    geometryScaleFactor,
    batchScaleFactor,
    totalScaleFactor,
    ingredientAmounts,
    warnings,
    cookMode: {
      eligible: !warnings.some(({ severity }) => severity === 'blocking'),
    },
  };
}
