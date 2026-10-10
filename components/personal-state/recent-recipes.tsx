'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { RecipeCatalogEntry } from '@/content/recipes/catalog';
import type { AppLocale } from '@/lib/i18n/config';
import { recipeUtilityCopy } from '@/content/recipes/utility-copy';
import {
  clearRecentRecipes,
  readRecentRecipes,
  recentRecipesKey,
  recordRecentRecipe,
} from '@/lib/persistence/recent-recipes';
import { subscribeToStorageKey } from '@/lib/persistence/storage';
import { RecipeCard } from '@/components/recipe/recipe-card';
import { Button } from '@/components/ui/button';
import styles from './recent-recipes.module.css';

export function RecentRecipes({
  locale,
  recipes,
  currentRecipeId,
  preview = false,
}: {
  locale: AppLocale;
  recipes: RecipeCatalogEntry[];
  currentRecipeId?: string;
  /** Design Lab fixtures never read or write the visitor's history. */
  preview?: boolean;
}) {
  const [ids, setIds] = useState<string[]>(
    preview ? recipes.slice(0, 3).map((recipe) => recipe.id) : [],
  );
  const [status, setStatus] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const id = useId();
  const copy = recipeUtilityCopy[locale];
  useEffect(() => {
    if (preview) return;
    const allowed = recipes
      .filter((recipe) => recipe.publicationStatus === 'published')
      .map((recipe) => recipe.id);
    // Run once on recipe entry, not on storage notifications (clearing must stay cleared).
    if (currentRecipeId) recordRecentRecipe(currentRecipeId, allowed);
    const update = () => setIds(readRecentRecipes(allowed));
    update();
    return subscribeToStorageKey(recentRecipesKey, update);
  }, [currentRecipeId, preview, recipes]);
  const visible = ids
    .filter((entry) => entry !== currentRecipeId)
    .map((entry) =>
      recipes.find(
        (recipe) =>
          recipe.id === entry && recipe.publicationStatus === 'published',
      ),
    )
    .filter((recipe): recipe is RecipeCatalogEntry => Boolean(recipe))
    .slice(0, 3);
  if (visible.length === 0 && !status) return null;
  return (
    <section className={styles.section} aria-labelledby={id}>
      <div className={styles.header}>
        <div>
          <h2 id={id} ref={heading} tabIndex={-1}>
            {copy.recent}
          </h2>
          <p>{copy.local}</p>
        </div>
        {visible.length > 0 && (
          <Button
            variant="ghost"
            onClick={() => {
              const success = preview || clearRecentRecipes();
              if (success) setIds([]);
              setStatus(success ? copy.cleared : copy.clearFailed);
              if (success) heading.current?.focus();
            }}
          >
            {copy.clear}
          </Button>
        )}
      </div>
      <output className={styles.status}>{status}</output>
      {visible.length > 0 && (
        <div className={styles.cards}>
          {visible.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={{ ...recipe, locale }}
              variant="compact"
              headingLevel="h3"
            />
          ))}
        </div>
      )}
    </section>
  );
}
