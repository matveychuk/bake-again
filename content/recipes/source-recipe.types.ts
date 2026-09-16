import type {
  Duration,
  GeometryApplication,
  GeometryKind,
  IngredientQuantity,
  YieldOption,
} from './recipe.types.ts';

export type StructuredRecipeYield = {
  id: string;
  label: string;
  count:
    | { kind: 'exact'; value: number }
    | { kind: 'range'; min: number; max: number };
  unit: YieldOption['unit'] | 'crepe';
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
};

export type StructuredIngredientSection = {
  id: string;
  title: string;
  ingredients: StructuredIngredient[];
};

export type StructuredRecipeStep = {
  id: string;
  title: string;
  body: string;
  meta?: string;
  checkpoint?: string;
  tip?: string;
  /** Optional Cook Mode composition; canonical recipe steps remain separate. */
  cookGroup?: string;
  cookTitle?: string;
  /** Short action sequence for Cook Mode without changing canonical recipe copy. */
  cookInstructions?: string[];
  cookIngredients?: Array<{
    ingredientId: string;
    quantity?: 'full' | 'omit';
    note?: string;
  }>;
  media?: Array<{
    id: string;
    src: string;
    alt: string;
    title: string;
    caption: string;
  }>;
};

/**
 * Source-backed draft used while a recipe is being migrated to the complete
 * multilingual RecipeDraft model. Reader-facing facts come only from the cited
 * archive; unresolved details remain explicit.
 */
export type RecipeSourceDraftContent = {
  completeness: 'readyToReview' | 'incompleteSource';
  yield?: StructuredRecipeYield;
  geometry?: StructuredRecipeGeometry;
  timing?: StructuredRecipeTiming;
  beforeStart?: string[];
  ingredientSections: StructuredIngredientSection[];
  steps: StructuredRecipeStep[];
  gapNote?: string;
};

export type RecipeSourceDraft = RecipeSourceDraftContent & {
  id: string;
  publicationStatus?: 'draft';
  source?: { file: string; locator: string };
  /** Reviewed reader-facing translations; source facts are never inferred here. */
  translations?: Partial<Record<'es' | 'uk', RecipeSourceDraftContent>>;
};

export type StructuredRecipeContent = RecipeSourceDraftContent;
