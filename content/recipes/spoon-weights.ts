import type { IngredientQuantity } from './recipe.types.ts';

export type SpoonUnit = 'tsp' | 'tbsp';

export type SpoonWeightIngredient =
  | 'schar-mix-b'
  | 'granulated-sugar'
  | 'powdered-sugar'
  | 'fine-salt'
  | 'corn-starch'
  | 'cocoa-powder'
  | 'tapioca-starch'
  | 'baking-powder'
  | 'baking-soda'
  | 'xanthan-gum';

type MeasurementEvidence =
  | 'author-measured'
  | 'derived-from-author-measurement'
  | 'reference';

type SpoonWeight = {
  grams: number;
  evidence: MeasurementEvidence;
};

type SpoonWeightEntry = {
  label: string;
  preferredUnit: SpoonUnit;
  measures: Partial<Record<SpoonUnit, SpoonWeight>>;
  note: string;
};

/**
 * Bake Again's one spoon-to-mass table for dry recipe ingredients.
 *
 * Author measurements use the author's normal measuring method and supersede generic
 * density charts for this recipe collection. A tablespoon is three teaspoons only where
 * the smaller measure is explicitly marked as derived. Mix B intentionally has no
 * teaspoon conversion because it is not a useful kitchen measure for this product.
 */
export const spoonWeightTable = {
  'schar-mix-b': {
    label: 'Schär Mix B Bread',
    preferredUnit: 'tbsp',
    measures: {
      tbsp: { grams: 20, evidence: 'author-measured' },
    },
    note: 'Author measurement: 10 tbsp = 200 g.',
  },
  'granulated-sugar': {
    label: 'Granulated sugar',
    preferredUnit: 'tbsp',
    measures: {
      tsp: {
        grams: 20 / 3,
        evidence: 'derived-from-author-measurement',
      },
      tbsp: { grams: 20, evidence: 'author-measured' },
    },
    note: 'Author measurement: 10 tbsp = 200 g.',
  },
  'powdered-sugar': {
    label: 'Powdered sugar, unsifted',
    preferredUnit: 'tbsp',
    measures: {
      tsp: { grams: 113 / 48, evidence: 'reference' },
      tbsp: { grams: 113 / 16, evidence: 'reference' },
    },
    note: 'Reference value derived from 113 g per 240 ml cup.',
  },
  'fine-salt': {
    label: 'Fine table salt',
    preferredUnit: 'tsp',
    measures: {
      tsp: { grams: 6, evidence: 'reference' },
      tbsp: { grams: 18, evidence: 'reference' },
    },
    note: 'Only for fine table salt; coarse and kosher salts need separate entries.',
  },
  'corn-starch': {
    label: 'Corn starch',
    preferredUnit: 'tbsp',
    measures: {
      tsp: { grams: 7 / 3, evidence: 'reference' },
      tbsp: { grams: 7, evidence: 'reference' },
    },
    note: 'Reference value derived from 28 g per 4 tbsp.',
  },
  'cocoa-powder': {
    label: 'Unsweetened cocoa powder',
    preferredUnit: 'tbsp',
    measures: {
      tsp: { grams: 5 / 3, evidence: 'reference' },
      tbsp: { grams: 5, evidence: 'reference' },
    },
    note: 'Practical rounded reference: 5 g per tablespoon; the source chart lists 42 g per 1/2 cup.',
  },
  'tapioca-starch': {
    label: 'Tapioca starch',
    preferredUnit: 'tbsp',
    measures: {
      tsp: { grams: 5, evidence: 'derived-from-author-measurement' },
      tbsp: { grams: 15, evidence: 'author-measured' },
    },
    note: 'Author measurement: 10 tbsp = 150 g.',
  },
  'baking-powder': {
    label: 'Baking powder',
    preferredUnit: 'tsp',
    measures: {
      tsp: { grams: 5, evidence: 'author-measured' },
      tbsp: {
        grams: 15,
        evidence: 'derived-from-author-measurement',
      },
    },
    note: 'Author measurement: 3 tsp = 15 g.',
  },
  'baking-soda': {
    label: 'Baking soda',
    preferredUnit: 'tsp',
    measures: {
      tsp: { grams: 6, evidence: 'reference' },
      tbsp: { grams: 18, evidence: 'reference' },
    },
    note: 'Reference value derived from 3 g per 1/2 tsp.',
  },
  'xanthan-gum': {
    label: 'Xanthan gum',
    preferredUnit: 'tsp',
    measures: {
      tsp: { grams: 3, evidence: 'reference' },
      tbsp: { grams: 9, evidence: 'reference' },
    },
    note: 'Reference value from a 9 g tablespoon serving.',
  },
} as const satisfies Record<SpoonWeightIngredient, SpoonWeightEntry>;

type Shopping = IngredientQuantity['shopping'];

function round(value: number, fractionDigits = 4) {
  const multiplier = 10 ** fractionDigits;
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
}

function gramsPerSpoon(
  ingredient: SpoonWeightIngredient,
  unit: SpoonUnit,
): number {
  const measures: Partial<Record<SpoonUnit, SpoonWeight>> =
    spoonWeightTable[ingredient].measures;
  const measure = measures[unit];
  if (!measure) {
    throw new Error(
      `${spoonWeightTable[ingredient].label} has no ${unit} conversion`,
    );
  }
  return measure.grams;
}

/** Create a gram-first quantity while retaining the recorded spoon amount as an aid. */
export function quantityFromSpoons(
  ingredient: SpoonWeightIngredient,
  value: number,
  unit: SpoonUnit,
  shopping: Shopping = { mode: 'base' },
): IngredientQuantity {
  return {
    base: {
      kind: 'exact',
      value: round(value * gramsPerSpoon(ingredient, unit)),
      unit: 'g',
    },
    equivalent: { kind: 'exact', value, unit },
    shopping,
  };
}

/** Add a calculated spoon aid to an already canonical gram amount. */
export function quantityFromGrams(
  ingredient: SpoonWeightIngredient,
  grams: number,
  unit: SpoonUnit = spoonWeightTable[ingredient].preferredUnit,
  shopping: Shopping = { mode: 'base' },
): IngredientQuantity {
  return {
    base: { kind: 'exact', value: grams, unit: 'g' },
    equivalent: {
      kind: 'exact',
      value: round(grams / gramsPerSpoon(ingredient, unit)),
      unit,
    },
    shopping,
  };
}
