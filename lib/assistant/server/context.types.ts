import type {
  Availability,
  ConfigurationWarning,
  ContentGap,
  Duration,
  GeometryApplication,
  GeometryKind,
  Quantity,
  QuantityAdjustmentSelection,
  RecipeLocale,
  RecipeDraft,
  Temperature,
} from '../../../content/recipes/recipe.types.ts';
import type { ContextEvidence } from './provenance.ts';

export type ContextConfiguration =
  | { kind: 'base' }
  | {
      kind: 'adjusted';
      geometryId: string;
      quantityAdjustment: QuantityAdjustmentSelection;
    };

export type ContextInput = {
  recipeId: string;
  locale: RecipeLocale;
  scope: 'recipe' | 'flour' | 'step';
  stepId?: string;
  /** ADR grouped Cook Mode steps; mutually exclusive with stepId. */
  stepIds?: string[];
  configuration?: ContextConfiguration;
};

export type ContextFact<T> = {
  field: string;
  value: T;
  evidence: ContextEvidence;
};
export type ContextIngredient = {
  id: string;
  sectionId: string;
  sectionTitle: string;
  options: Array<{ ingredientId: string; name: string }>;
  choose: 1 | null;
  optional: boolean;
  amount: ContextFact<Quantity | null>;
  amountBasis: 'base' | 'calculated';
  preparation: string | null;
  qualifier: string | null;
  condition: string | null;
  requiresResolution: boolean;
};

export type ContextGeometry = ContextFact<{
  id: string;
  label: string;
  kind: GeometryKind;
  application: GeometryApplication;
  shape: 'round' | 'rectangular' | 'freeform' | 'other';
  diameterCm: number | null;
  widthCm: number | null;
  lengthCm: number | null;
  layerCount: number | null;
  material: string | null;
  availability: Availability;
}>;

export type ContextYield = ContextFact<{
  id: string;
  label: string;
  amount: number | null;
  unit: 'cookie' | 'cake' | 'serving' | 'batch';
  details: string | null;
  availability: Availability;
}>;

export type ContextStep = {
  id: string;
  instruction: ContextFact<string>;
  ingredientLineIds: string[];
  duration: Duration | null;
  temperature: Temperature | null;
  equipment: Array<{ id: string; name: string }>;
  guidance: Array<
    ContextFact<{
      id: string;
      kind: 'checkpoint' | 'practicalTip';
      text: string;
    }>
  >;
};

export type TrustedRecipeContext = {
  schemaVersion: 1;
  policyVersion: 'context-v1';
  recipeId: string;
  recipeVersionId: string;
  locale: RecipeLocale;
  scope: ContextInput['scope'];
  publication: {
    status: RecipeDraft['publicationStatus'];
    translation: RecipeDraft['translationState'][RecipeLocale];
    recipeLocalePublishable: boolean;
    uiLocalePublishable: boolean;
  };
  /** Describes the canonical base, including when selected quantities differ. */
  recipe: {
    basis: 'canonical-base';
    title: string;
    summary: string;
    evidence: ContextEvidence;
  };
  configuration: {
    selection: ContextConfiguration;
    status: ContextEvidence['status'];
    totalScaleFactor: number;
    warnings: Array<
      Pick<ConfigurationWarning, 'code' | 'severity' | 'ingredientLineId'>
    >;
    cookModeEligible: boolean;
  };
  ingredients: ContextIngredient[];
  flour: null | {
    basis: 'canonical-base';
    commercialMixLineId: string;
    additionalStarchLineIds: string[];
    xanthanLineId: string | null;
    evidence: ContextEvidence;
    testedAlternatives: Array<
      ContextFact<{
        mixId: string;
        name: string;
        notes: string | null;
        availability: Availability;
      }>
    >;
    knownUnsupportedMixes: Array<
      ContextFact<{
        mixId: string;
        name: string;
        notes: string | null;
        availability: Availability;
      }>
    >;
  };
  /** Base timings and yields are never scaled or predicted by this builder. */
  timing: null | {
    basis: 'canonical-base';
    activeMinutes: ContextFact<number | null>;
    totalElapsedMinutes: ContextFact<number | null>;
    phases: Array<{ id: string; label: string; duration: Duration }>;
  };
  yield: {
    basis: 'canonical-base';
    base: ContextYield;
    alternatives: ContextYield[];
  };
  geometry: {
    base: ContextGeometry;
    alternatives: ContextGeometry[];
    selectedId: string;
  };
  steps: ContextStep[];
  beforeStart: Array<{
    id: string;
    text: string;
    relatedStepId: string | null;
  }>;
  storage: ContextFact<string | null> | null;
  makeAhead: ContextFact<string | null> | null;
  variations: Array<
    ContextFact<{
      id: string;
      dimension: string;
      label: string;
      description: string;
      availability: Availability;
    }>
  >;
  gaps: Array<{
    id: string;
    field: string;
    area: ContentGap['area'];
    publicationBlocking: boolean;
    message: string;
  }>;
  unknowns: Array<{
    field: string;
    reason:
      | 'not-recorded'
      | 'no-tested-alternative-recorded'
      | 'calculation-needs-resolution';
  }>;
};

export type ContextUnavailableCode =
  | 'INVALID_REQUEST'
  | 'INVALID_RECIPE_ID'
  | 'INVALID_LOCALE'
  | 'INVALID_SCOPE'
  | 'INVALID_STEP_ID'
  | 'STEP_NOT_FOUND'
  | 'RECIPE_NOT_FOUND'
  | 'SOURCE_DRAFT_UNAVAILABLE'
  | 'RECIPE_ARCHIVED'
  | 'INVALID_CONFIGURATION'
  | 'CONTEXT_TOO_LARGE';
export type ContextResult =
  | { available: true; context: TrustedRecipeContext }
  | { available: false; code: ContextUnavailableCode; message: string };
