'use client';

import { Button } from '@/components/ui/button';

import { useEffect, useState } from 'react';
import { type RecipeCatalogEntry } from '@/content/recipes/catalog';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { getLocalizedRecipePath, localeHomePath } from '@/lib/i18n/routes';
import {
  readRecipeMemory,
  subscribeToRecipeMemory,
} from '@/lib/persistence/recipe-memory';
import { RecipeCard } from '@/components/recipe/recipe-card';
import styles from './personal-state.module.css';

export function SavedRecipesPage({
  locale,
  recipeCatalog,
}: {
  locale: AppLocale;
  recipeCatalog: RecipeCatalogEntry[];
}) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const messages = getUiMessages(locale).personal;
  useEffect(() => {
    const update = () => setSavedIds(readRecipeMemory().savedRecipeIds);
    update();
    return subscribeToRecipeMemory(update);
  }, []);
  const recipes = savedIds
    .map((id) => recipeCatalog.find((recipe) => recipe.id === id))
    .filter((recipe): recipe is RecipeCatalogEntry => Boolean(recipe));

  return (
    <section className={styles.page} aria-labelledby="saved-title">
      <div className={styles.heading}>
        <p>{messages.savedEyebrow}</p>
        <h1 id="saved-title" tabIndex={-1}>
          {messages.savedTitle}
        </h1>
      </div>
      {recipes.length === 0 ? (
        <div className={styles.empty}>
          <h2>{messages.savedEmpty}</h2>
          <p>{messages.savedHint}</p>
          <Button href={`${localeHomePath(locale)}#recipes`}>
            {messages.browseRecipes}
          </Button>
        </div>
      ) : (
        <div className={styles.cards}>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              variant="compact"
              recipe={{
                ...recipe,
                locale,
                href: getLocalizedRecipePath(recipe.id, locale) ?? recipe.href,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
