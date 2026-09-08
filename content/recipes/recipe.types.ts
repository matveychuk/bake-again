export const recipeLocales = ["uk", "en", "es"] as const;

export type RecipeLocale = (typeof recipeLocales)[number];
export type LocalizedText = Record<RecipeLocale, string>;

export type TranslationState =
  | "sourceDraft"
  | "draftTranslation"
  | "reviewed";

export type EvidenceState =
  | "repeatedlyVerified"
  | "tested"
  | "calculated"
  | "authorGuidance"
  | "suggested"
  | "missing"
  | "needsRetest"
  | "draft";

export type PublicationStatus = "draft" | "ready" | "archived";
export type Availability =
  | "default"
  | "selectable"
  | "previewOnly"
  | "hiddenUntilConfirmed";

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
  | "g"
  | "ml"
  | "piece"
  | "tsp"
  | "tbsp"
  | "packet"
  | "pinch";

export type Quantity =
  | { kind: "exact"; value: number; unit: Unit }
  | { kind: "range"; min: number; max: number; unit: Unit };

export type Duration =
  | { kind: "exact"; value: number; unit: "second" | "minute" | "hour" }
  | {
      kind: "range";
      min: number;
      max: number;
      unit: "second" | "minute" | "hour";
    }
  | { kind: "minimum"; min: number; unit: "minute" | "hour" };

export interface IngredientOption {
  ingredientId: string;
  name: LocalizedText;
}

export interface IngredientLine {
  id: string;
  options: [IngredientOption, ...IngredientOption[]];
  choose?: 1;
  amount: Quantity | null;
  optional?: boolean;
  preparation?: LocalizedText;
  qualifier?: LocalizedText;
  condition?: LocalizedText;
  provenance?: Provenance;
}

export interface IngredientSection {
  id: string;
  title: LocalizedText;
  provenance?: Provenance;
  lines: IngredientLine[];
}

export interface FlourConfiguration {
  commercialMixLineId: string;
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
  id: string;
  label: LocalizedText;
  amount: number | null;
  unit: "cookie" | "cake" | "serving" | "batch";
  details?: LocalizedText;
  provenance: Provenance;
  availability: Availability;
}

export interface FormOption {
  id: string;
  label: LocalizedText;
  shape: "round" | "bakingSheet";
  diameterCm: number | null;
  layerCount: number | null;
  material: string | null;
  provenance: Provenance;
  availability: Availability;
  blockingGapIds?: string[];
}

export interface Temperature {
  value: number;
  unit: "C";
  ovenMode: "conventional" | "fan" | null;
}

export interface StepGuidance {
  id: string;
  kind: "checkpoint" | "practicalTip";
  text: LocalizedText;
  provenance?: Provenance;
}

export interface RecipeStep {
  id: string;
  instruction: LocalizedText;
  ingredientLineIds: string[];
  duration?: Duration;
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
  action: "add" | "replace" | "remove";
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
    | "fat"
    | "sweetness"
    | "dietary"
    | "filling"
    | "flavour"
    | "method"
    | "form"
    | "yield";
  label: LocalizedText;
  description: LocalizedText;
  provenance: Provenance;
  availability: Availability;
  ingredientChanges?: VariationIngredientChange[];
  stepChanges?: VariationStepChange[];
  blockingGapIds?: string[];
}

export interface RecipeMedia {
  id: string;
  type: "image" | "video";
  path: string;
  posterPath?: string;
  usage: Array<"hero" | "step" | "gallery" | "social">;
  alt: LocalizedText;
  caption?: LocalizedText;
  transcript?: LocalizedText;
}

export interface ContentGap {
  id: string;
  area:
    | "timing"
    | "yield"
    | "form"
    | "ingredient"
    | "method"
    | "variation"
    | "image"
    | "translation"
    | "storage";
  field: string;
  question: string;
  publicationBlocking: boolean;
  sourceIds: string[];
}

export interface RecipeDraft {
  schemaVersion: 1;
  id: string;
  versionId: string;
  publicationStatus: PublicationStatus;
  translationState: Record<RecipeLocale, TranslationState>;
  slug: LocalizedText;
  title: LocalizedText;
  summary: LocalizedText;
  categoryIds: string[];
  situationIds: string[];
  difficulty: "easy" | "medium" | "advanced" | null;
  baseProvenance: Provenance;
  timing: {
    activeMinutes: number | null;
    totalElapsedMinutes: number | null;
    phases: Array<{ id: string; label: LocalizedText; duration: Duration }>;
  };
  yield: {
    default: YieldOption;
    alternatives: YieldOption[];
  };
  forms: {
    default: FormOption;
    alternatives: FormOption[];
  };
  equipment: Array<{ id: string; name: LocalizedText }>;
  flourConfiguration: FlourConfiguration;
  beforeStart: BeforeStartItem[];
  ingredientSections: IngredientSection[];
  steps: RecipeStep[];
  storage: LocalizedText | null;
  makeAhead: LocalizedText | null;
  variations: RecipeVariation[];
  heroMediaId: string | null;
  media: RecipeMedia[];
  relatedRecipeIds: string[];
  sources: SourceRef[];
  contentGaps: ContentGap[];
}
