export type StructuredIngredient = {
  id: string;
  name: string;
  amount: string;
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
};

/**
 * Source-backed draft used while a recipe is being migrated to the complete
 * multilingual RecipeDraft model. Reader-facing facts come only from the cited
 * archive; unresolved details remain explicit.
 */
export type RecipeSourceDraftContent = {
  completeness: 'readyToReview' | 'incompleteSource';
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
