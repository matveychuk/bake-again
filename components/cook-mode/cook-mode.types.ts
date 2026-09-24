import type { AssistantConfiguration } from '@/lib/assistant/contracts';
import type { StepMediaItem } from '@/components/recipe/step-media-sequence';

export type CookMediaItem = StepMediaItem;

export type CookIngredient = {
  id: string;
  name: string;
  primary?: string;
  secondary?: string;
  note?: string;
};

export type CookStep = {
  technique?: import('../../content/techniques/types.ts').TechniqueReference;
  stepIds: [string, ...string[]];
  number: string;
  meta: string;
  title: string;
  instructions: string[];
  ingredients: CookIngredient[];
  checkpoint?: string;
  tip?: string;
  timerSeconds?: number;
  timerOptionsSeconds?: number[];
  media?: CookMediaItem[];
};

export type CookModeDefinition = {
  recipeId: string;
  recipeVersionId: string;
  recipeTitle: string;
  detailHref: string;
  totalSteps: number;
  assistant?: {
    recipeId: string;
    recipeVersionId: string;
  };
  getState: (locationSearch: string) => {
    /** Exact composed version, including a selected cream when applicable. */
    recipeVersionId?: string;
    isAdjusted: boolean;
    steps: CookStep[];
    allIngredients?: CookIngredient[];
    assistantConfiguration?: AssistantConfiguration;
    unavailableReason?: string;
  };
};
