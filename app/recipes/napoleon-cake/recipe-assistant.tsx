'use client';

import type { ReactNode } from 'react';
import {
  AssistantProvider,
  AssistantTrigger as SharedAssistantTrigger,
} from '@/components/assistant';
import { assistantMessages } from '@/components/assistant/assistant.messages';
import type { RecipeDraft } from '@/content/recipes/recipe.types';
import type { AppLocale } from '@/lib/i18n/config';
import { useRecipeConfiguration } from './recipe-configuration';
import styles from './recipe.module.css';

type Scope = 'recipe' | 'flour' | 'step';

export function RecipeAssistantProvider({
  children,
  recipe,
  locale,
}: {
  children: ReactNode;
  recipe: RecipeDraft;
  locale: AppLocale;
}) {
  return (
    <AssistantProvider
      recipeId={recipe.id}
      recipeVersionId={recipe.versionId}
      recipeTitle={recipe.title[locale]}
      locale={locale}
      surface="recipe-detail"
    >
      {children}
    </AssistantProvider>
  );
}

export function AssistantTrigger({
  scope,
  stepIds,
  stepTitle,
  locale,
  compact = false,
}: {
  scope: Scope;
  stepIds?: [string, ...string[]];
  stepTitle?: string;
  locale: AppLocale;
  compact?: boolean;
}) {
  const { selection, isExactBase } = useRecipeConfiguration();
  const configuration = isExactBase
    ? { kind: 'base' as const }
    : {
        kind: 'adjusted' as const,
        geometryId: selection.geometryId,
        quantityAdjustment: selection.quantityAdjustment,
      };
  const assistantScope = scope === 'step'
    ? { kind: 'step' as const, stepIds: stepIds ?? ['mix-dry-dough'] }
    : ({ kind: scope } as const);

  return (
    <SharedAssistantTrigger
      className={compact ? styles.assistantTriggerCompact : styles.assistantTrigger}
      compact={compact}
      configuration={configuration}
      label={assistantMessages[locale].trigger[scope]}
      scope={assistantScope}
      stepTitle={stepTitle}
    />
  );
}
