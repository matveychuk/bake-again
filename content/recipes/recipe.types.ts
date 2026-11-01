export const recipeLocales = ['en', 'es', 'uk'] as const;

export type RecipeLocale = (typeof recipeLocales)[number];
export type LocalizedText = Record<RecipeLocale, string>;

export type TranslationState = 'sourceDraft' | 'draftTranslation' | 'reviewed';
export type RecipeDifficulty = 'easy' | 'medium' | 'advanced';

export type EvidenceState =
  | 'repeatedlyVerified'
  | 'tested'
  | 'calculated'
  | 'authorGuidance'
  | 'suggested'
  | 'missing'
  | 'needsRetest'
  | 'draft';

export type PublicationStatus = 'unpublished' | 'published' | 'archived';
export type Availability =
  | 'default'
  | 'selectable'
  | 'previewOnly'
  | 'hiddenUntilConfirmed';

export interface SourceRef {
  id: string;
  file: string;
  locator: string;
  note?: string;
}

export interface Provenance {
  state: EvidenceState;
  sourceIds: string[];
  note?: string;
}

export type Unit =
  | 'g'
  | 'ml'
  | 'piece'
  | 'tsp'
  | 'tbsp'
  | 'cup'
  | 'packet'
  | 'pinch';

export type Quantity =
  | { kind: 'exact'; value: number; unit: Unit }
  | { kind: 'range'; min: number; max: number; unit: Unit };

/**
 * The one canonical ingredient quantity model. `base` is the only amount that
 * can be bought or aggregated. Dry ingredients covered by `spoon-weights.ts`
 * always use grams in `base`; their spoon measure is generated as `equivalent`.
 * `equivalent` is deliberately excluded from shopping.
 */
export interface IngredientQuantity {
  base: Quantity | null;
  equivalent?: Quantity | null;
  shopping: {
    mode: 'base' | 'nameOnly';
    increment?: number;
    rounding?: 'up';
    /** Household staples such as water remain available but start unchecked. */
    defaultSelected?: boolean;
  };
}

export type Duration =
  | { kind: 'exact'; value: number; unit: 'second' | 'minute' | 'hour' }
  | {
      kind: 'range';
      min: number;
      max: number;
      unit: 'second' | 'minute' | 'hour';
    }
  | { kind: 'minimum'; min: number; unit: 'minute' | 'hour' };

export interface IngredientOption {
  ingredientId: string;
  name: LocalizedText;
}

export interface IngredientLine {
  id: string;
  options: [IngredientOption, ...IngredientOption[]];
  choose?: 1;
  quantity: IngredientQuantity;
  optional?: boolean;
  preparation?: LocalizedText;
  qualifier?: LocalizedText;
  condition?: LocalizedText;
  provenance?: Provenance;
  /** Overrides the recipe-level ingredient scaling default. */
  scaling?: IngredientScalingRule;
}

export interface IngredientSection {
  id: string;
  title: LocalizedText;
  provenance?: Provenance;
  lines: IngredientLine[];
}

export interface FlourConfiguration {
  basis?: 'commercialMix' | 'customBlend';
  commercialMixLineId: string | null;
  flourLineIds?: string[];
  additionalStarchLineIds: string[];
  xanthanLineId?: string;
  provenance: Provenance;
  testedAlternativeMixes: FlourAlternative[];
  knownUnsupportedMixes: FlourAlternative[];
}

export interface FlourAlternative {
  commercialMixId: string;
  name: LocalizedText;
  notes?: LocalizedText;
  provenance: Provenance;
  availability: Availability;
}

export interface YieldOption {
  approximate?: boolean;
  id: string;
  label: LocalizedText;
  count:
    | { kind: 'exact'; value: number }
    | { kind: 'range'; min: number; max: number }
    | { kind: 'unknown' };
  unit:
    | 'cookie'
    | 'cake'
    | 'serving'
    | 'batch'
    | 'crepe'
    | 'dumpling'
    | 'g'
    | 'kg'
    | null;
  details?: LocalizedText;
  provenance: Provenance;
  availability: Availability;
}

export type GeometryKind =
  | 'bakingPan'
  | 'tray'
  | 'mould'
  | 'roundTemplate'
  | 'other';

export type GeometryApplication =
  | 'bake-in'
  | 'portion-on'
  | 'shape-in'
  | 'roll-and-trim'
  | 'other';

export interface GeometryOption {
  id: string;
  label: LocalizedText;
  kind: GeometryKind;
  application: GeometryApplication;
  shape: 'round' | 'rectangular' | 'freeform' | 'other';
  diameterCm: number | null;
  widthCm?: number | null;
  lengthCm?: number | null;
  layerCount: number | null;
  material: string | null;
  provenance: Provenance;
  availability: Availability;
  blockingGapIds?: string[];
}

export type IngredientScalingRule =
  | {
      kind: 'linear';
      precision?: number;
      rounding?: 'nearest' | 'up' | 'down';
    }
  | {
      kind: 'discrete';
      increment: number;
      rounding: 'nearest' | 'up' | 'down' | 'manual';
    }
  | {
      kind: 'range';
      precision?: number;
      rounding?: 'nearest' | 'up' | 'down';
    }
  | { kind: 'fixed' }
  | { kind: 'manual'; reason: LocalizedText };

export type BatchScaleFactor = 0.5 | 1 | 1.5 | 2;

export interface ScalingAnchor {
  ingredientLineId: string;
  allowedUnit: Unit;
  minimum?: number;
  maximum?: number;
}

export interface RecipeConfigurationModel {
  /** References the recipe's verified values; it never contains copied quantities. */
  base: {
    geometryId: string;
    yieldId: string;
    batchScale: 1;
  };
  geometryAdjustment: {
    optionIds: [string, ...string[]];
    quantityBasis: 'area';
    timingPolicy: 'unverifiedWhenChanged' | 'unchanged';
  } | null;
  quantityAdjustment: {
    batchScale: { allowed: [BatchScaleFactor, ...BatchScaleFactor[]] } | null;
    useWhatIHave: {
      scalingAnchors: [ScalingAnchor, ...ScalingAnchor[]];
    } | null;
  };
  ingredientScaling: {
    default: IngredientScalingRule;
  };
}

export type QuantityAdjustmentSelection =
  | { mode: 'batchScale'; factor: BatchScaleFactor }
  | {
      mode: 'useWhatIHave';
      anchorIngredientLineId: string;
      availableAmount: { value: number; unit: Unit };
    };

export interface ConfigurationWarning {
  code:
    | 'fractional-discrete-ingredient'
    | 'manual-scaling-required'
    | 'unverified-timing'
    | 'unsupported-selection';
  severity: 'warning' | 'blocking';
  ingredientLineId?: string;
  message: string;
}

export interface CalculatedIngredientAmount {
  ingredientLineId: string;
  /** Scaled kitchen-only equivalence; never a shopping quantity. */
  equivalent?: Quantity | null;
  amount: Quantity | null;
  rule: IngredientScalingRule['kind'];
  requiresResolution: boolean;
}

/** User/runtime data. It must not be written into a Recipe. */
export interface CalculatedRecipeConfiguration {
  recipeId: string;
  recipeVersionId: string;
  status: 'Calculated' | 'Suggested';
  provenance: 'Calculated' | 'Suggested';
  geometryId: string;
  quantityAdjustment: QuantityAdjustmentSelection;
  geometryScaleFactor: number;
  batchScaleFactor: number;
  totalScaleFactor: number;
  ingredientAmounts: CalculatedIngredientAmount[];
  warnings: ConfigurationWarning[];
  cookMode: { eligible: boolean };
}

export type Temperature = (
  | { value: number; range?: never }
  | { value?: never; range: { min: number; max: number } }
) & {
  unit: 'C';
  ovenMode: 'conventional' | 'fan' | null;
};

export interface StepGuidance {
  id: string;
  kind: 'checkpoint' | 'practicalTip';
  text: LocalizedText;
  provenance?: Provenance;
}

export interface RecipeStep {
  helpReference?: { recipeId: string; stepId: string };
  technique?: import('../techniques/types.ts').TechniqueReference;
  id: string;
  /** A concise action title may be added one reviewed locale at a time. */
  title?: Partial<LocalizedText>;
  instruction: LocalizedText;
  quantityMentions?: Array<{
    text: LocalizedText;
    quantity: Quantity;
    numberOnly?: boolean;
  }>;
  /** Original editorial metadata, retained independently of structured timers. */
  displayMeta?: LocalizedText;
  cook?: {
    group?: string;
    requiresCream?: boolean;
    title?: LocalizedText;
    instructions?: Array<{ id: string; text: LocalizedText }>;
    ingredients?: Array<{
      ingredientId: string;
      quantity?: 'full' | 'omit';
      note?: LocalizedText;
    }>;
  };
  ingredientLineIds: string[];
  /** Fraction of an ingredient's batch amount used in this step (default: all). */
  ingredientFractions?: Record<string, number>;
  duration?: Duration;
  durationPhaseId?: string;
  temperatureStages?: Array<{ phaseId: string; temperature: Temperature }>;
  temperature?: Temperature;
  equipmentIds?: string[];
  guidance?: StepGuidance[];
  mediaIds?: string[];
}

export interface BeforeStartItem {
  id: string;
  text: LocalizedText;
  relatedStepId?: string;
}

export interface VariationIngredientChange {
  action: 'add' | 'replace' | 'remove';
  lineId: string;
  line?: IngredientLine;
}

export interface VariationStepChange {
  stepId: string;
  instruction: LocalizedText;
}

export interface RecipeVariation {
  id: string;
  dimension:
    | 'fat'
    | 'sweetness'
    | 'dietary'
    | 'filling'
    | 'flavour'
    | 'method'
    | 'form'
    | 'yield';
  label: LocalizedText;
  description: LocalizedText;
  provenance: Provenance;
  availability: Availability;
  ingredientChanges?: VariationIngredientChange[];
  stepChanges?: VariationStepChange[];
  blockingGapIds?: string[];
}

/**
 * Reusable cream recipes that are confirmed for a finished dish. Compatibility and
 * recommendation belong to the host recipe; the cream keeps only its own evidence.
 */
export interface RecipeCreamOptions {
  recipeIds: [string, ...string[]];
  recommendedRecipeId: string;
}

export interface RecipeMedia {
  id: string;
  type: 'image' | 'video';
  path: string;
  /** Preserve the whole frame when process details must not be cropped. */
  fit?: 'cover' | 'contain';
  posterPath?: string;
  usage: Array<'hero' | 'card' | 'step' | 'gallery' | 'social'>;
  alt: LocalizedText;
  heroAlt?: LocalizedText;
  title?: LocalizedText;
  caption?: LocalizedText;
  transcript?: LocalizedText;
}

export interface ContentGap {
  id: string;
  area:
    | 'timing'
    | 'yield'
    | 'form'
    | 'ingredient'
    | 'method'
    | 'variation'
    | 'image'
    | 'translation'
    | 'storage';
  field: string;
  question: string;
  text?: LocalizedText;
  publicationBlocking: boolean;
  readerVisible?: boolean;
  sourceIds: string[];
}

/** Search facts shared by every translation of the same recipe. Null means unknown. */
export interface RecipeSearchMetadata {
  datePublished: string | null;
  dateModified: string | null;
  /** Keep a known date scoped to its confirmed revision when later edits are undated. */
  dateModifiedVersionId?: string;
  /** Whole-batch cooking only; never a per-layer/tray time or the midpoint of a range. */
  cookTimeMinutes: number | null;
  recipeCuisine: Record<RecipeLocale, string | null>;
  keywords: Record<RecipeLocale, string[]>;
}

export interface Recipe {
  searchMetadata?: RecipeSearchMetadata;
  seo?: Partial<Record<RecipeLocale, { title?: string; description?: string }>>;
  creamOption?: Record<RecipeLocale, { title: string; description: string }>;
  schemaVersion: 3;
  showImageNote?: boolean;
  /** Opt-in concise reading layout after editorial review. */
  presentation?: 'concise';
  id: string;
  versionId: string;
  publicationStatus: PublicationStatus;
  translationState: Record<RecipeLocale, TranslationState>;
  /** Stable neutral route/legacy slug, independent of localized slug roles. */
  routeSlug: string;
  slug: LocalizedText;
  title: LocalizedText;
  summary: LocalizedText;
  categoryIds: string[];
  situationIds: string[];
  difficulty: RecipeDifficulty | null;
  baseProvenance: Provenance;
  evidenceExplanation: LocalizedText;
  translationReview: {
    date: string;
    reviewer: 'implementation';
    scope: string;
  };
  discovery: {
    cardTitle: LocalizedText;
    shortTitle?: LocalizedText;
    category: LocalizedText;
    flourSummary: LocalizedText | null;
    collectionIds: import('./collections.ts').RecipeCollectionId[];
    catalogue: boolean;
    imageKind: 'generated-preview' | 'author-photo' | 'edited-author-photo';
    cardImagePosition?: 'left-quarter';
    publicationNote?: LocalizedText;
    sourceTitle: string;
    launchPriority: string;
    heroCandidate: 'Yes' | 'Possible' | 'No';
    source: string;
    archiveSections: Array<{ title: string; content: string }>;
    needsBeforePublishing: string;
  };
  cardMediaId?: string;
  timing: {
    activeMinutes: number | null;
    totalElapsedMinutes: number | null;
    /** Optional planning copy; {duration} is resolved from the referenced phase. */
    planningNote?: { text: LocalizedText; phaseId?: string } | null;
    phases: Array<{
      id: string;
      label: LocalizedText;
      duration: Duration;
      relatedStepId?: string;
    }>;
  };
  yield: {
    default: YieldOption;
    alternatives: YieldOption[];
  };
  geometry: {
    state: 'known' | 'unknown' | 'notApplicable';
    default: GeometryOption | null;
    alternatives: GeometryOption[];
  };
  configuration: RecipeConfigurationModel;
  equipment: Array<{ id: string; name: LocalizedText }>;
  flourConfiguration: FlourConfiguration | null;
  beforeStart: BeforeStartItem[];
  ingredientSections: IngredientSection[];
  steps: RecipeStep[];
  storage: LocalizedText | null;
  makeAhead: LocalizedText | null;
  creamOptions?: RecipeCreamOptions;
  variations: RecipeVariation[];
  heroMediaId: string | null;
  media: RecipeMedia[];
  relatedRecipeIds: string[];
  sources: SourceRef[];
  contentGaps: ContentGap[];
}
