import type {
  Duration,
  GeometryApplication,
  GeometryKind,
  IngredientQuantity,
  Quantity,
  RecipeCreamOptions,
  RecipeDifficulty,
  RecipeLocale,
  TranslationState,
  YieldOption,
} from './recipe.types.ts';

export type StructuredRecipeOverview = {
  difficulty: RecipeDifficulty | null;
  timing: {
    activeMinutes: number | null;
    totalElapsedMinutes: number | null;
    planningNote: string | null;
  };
  yieldLabel: string | null;
  flour: string;
};

export type StructuredRecipeYield = {
  id: string;
  label: string;
  count:
    | { kind: 'exact'; value: number }
    | { kind: 'range'; min: number; max: number };
  unit: YieldOption['unit'] | 'crepe' | 'dumpling' | 'g';
};

export type StructuredRecipeGeometry = {
  id: string;
  label: string;
  kind: GeometryKind;
  application: GeometryApplication;
  shape: 'round' | 'rectangular' | 'freeform' | 'other';
  diameterCm: number | null;
  widthCm?: number | null;
  lengthCm?: number | null;
};

export type StructuredRecipeTiming = {
  activeMinutes: number | null;
  totalElapsedMinutes: number | null;
  /** Optional planning copy; durations come from the canonical phase by ID. */
  planningNote?: { text: string; phaseId?: string } | null;
  phases: Array<{
    id: string;
    label: string;
    duration: Duration;
    relatedStepId?: string;
  }>;
};

export type StructuredIngredient = {
  id: string;
  name: string;
  /** Canonical data, never a localized numeric string. */
  quantity: IngredientQuantity;
  note?: string;
  optional?: boolean;
  /** Keep unmeasured kitchen aids, such as a pinch, unchanged when scaling. */
  scaling?: 'fixed';
};

export type StructuredIngredientSection = {
  id: string;
  title: string;
  ingredients: StructuredIngredient[];
};

export type StructuredRecipeStep = {
  help?: import('./step-help.ts').StepHelpDefinition[];
  technique?: import('../techniques/types.ts').TechniqueReference;
  id: string;
  title: string;
  body: string;
  /** Explicit ingredient amounts in prose; timings and technique counts are never scaled. */
  quantityMentions?: Array<{
    text: string;
    quantity: Quantity;
    numberOnly?: boolean;
  }>;
  meta?: string;
  checkpoint?: string;
  tip?: string;
  /** Optional Cook Mode composition; canonical recipe steps remain separate. */
  cookGroup?: string;
  /** Assembly steps shown after preparing the explicitly selected cream. */
  requiresCream?: boolean;
  cookTitle?: string;
  /** Short action sequence for Cook Mode without changing canonical recipe copy. */
  cookInstructions?: string[];
  cookIngredients?: Array<{
    ingredientId: string;
    quantity?: 'full' | 'omit';
    fraction?: number;
    note?: string;
  }>;
  media?: Array<{
    type?: 'image' | 'video';
    id: string;
    src: string;
    fit?: 'cover' | 'contain';
    alt: string;
    title?: string;
    caption?: string;
  }>;
};

/**
 * Source-backed draft used while a recipe is being migrated to the complete
 * multilingual RecipeDraft model. Reader-facing facts come only from the cited
 * archive; unresolved details remain explicit.
 */
export type RecipeSourceDraftContent = {
  /** Explicit revision for changed bake configurations; keeps saved sessions separate. */
  versionId?: string;
  /** Opt-in edited reading layout; independent of publication and evidence. */
  presentation?: 'concise';
  /** Optional editorial image overlay; image provenance remains in catalogue metadata. */
  showImageNote?: boolean;
  completeness: 'readyToReview' | 'incompleteSource';
  /** Reader-facing skill level for this exact recipe. */
  difficulty?: RecipeDifficulty;
  /** Evidence for the exact source-backed configuration, independent of publication readiness. */
  evidence?: {
    status: 'tested' | 'calculated' | 'suggested';
    explanation: string;
  };
  yield?: StructuredRecipeYield;
  geometry?: StructuredRecipeGeometry;
  timing?: StructuredRecipeTiming;
  beforeStart?: string[];
  /** Optional standalone components; full preparation stays inline. */
  relatedRecipes?: string[];
  /** Host-recipe choice: compatible creams and the one recommended by the recipe. */
  creamOptions?: RecipeCreamOptions;
  ingredientSections: StructuredIngredientSection[];
  steps: StructuredRecipeStep[];
  gapNote?: string;
};

export type RecipeSourceDraft = RecipeSourceDraftContent & {
  id: string;
  publicationStatus: 'unpublished' | 'published';
  translationState?: Record<RecipeLocale, TranslationState>;
  source?: { file: string; locator: string };
  /** Reviewed reader-facing translations; source facts are never inferred here. */
  translations?: Partial<Record<'es' | 'uk', RecipeSourceDraftContent>>;
};

/**
 * The reader-facing recipe shape. Every recipe, regardless of source maturity,
 * receives the same compact overview before it reaches product UI.
 */
export type StructuredRecipeContent = RecipeSourceDraftContent & {
  overview: StructuredRecipeOverview;
};
