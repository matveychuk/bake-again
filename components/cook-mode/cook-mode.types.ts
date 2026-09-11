import type { AssistantConfiguration } from '@/lib/assistant/contracts';

export type CookMediaItem = {
  src: string;
  alt: string;
  title: string;
  caption: string;
};

export type CookStep = {
  stepIds: [string, ...string[]];
  number: string;
  meta: string;
  title: string;
  body: string;
  ingredients: string[];
  checkpoint?: string;
  tip?: string;
  timerSeconds?: number;
  media?: CookMediaItem[];
};

export type CookModeDefinition = {
  recipeTitle: string;
  detailHref: string;
  totalSteps: number;
  assistant?: {
    recipeId: string;
    recipeVersionId: string;
  };
  getState: (locationSearch: string) => {
    isAdjusted: boolean;
    steps: CookStep[];
    assistantConfiguration?: AssistantConfiguration;
    unavailableReason?: string;
  };
};
