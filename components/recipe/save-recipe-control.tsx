'use client';

import { requestPersonalAction } from '@/lib/personal/action-gate';
import { trackEvent } from '@/lib/analytics/umami';
import { Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUiMessages } from '@/lib/i18n/messages';
import {
  readRecipeMemory,
  subscribeToRecipeMemory,
  toggleSavedRecipe,
} from '@/lib/persistence/recipe-memory';
import type { AppLocale } from '@/lib/i18n/config';
import styles from './save-recipe-control.module.css';

export function SaveRecipeControl({
  recipeId,
  title,
  locale,
}: {
  recipeId: string;
  title: string;
  locale: AppLocale;
}) {
  const [saved, setSaved] = useState(false);
  const messages = getUiMessages(locale).personal;

  useEffect(() => {
    const update = () =>
      setSaved(readRecipeMemory().savedRecipeIds.includes(recipeId));
    update();
    return subscribeToRecipeMemory(update);
  }, [recipeId]);

  return (
    <button
      aria-label={`${saved ? messages.removeSaved : messages.save}: ${title}`}
      aria-pressed={saved}
      className={styles.control}
      data-saved={saved}
      onClick={(event) => {
        event.stopPropagation();
        requestPersonalAction(locale, () => {
          // A guest asked to save. Do not toggle an existing account bookmark off
          // when that bookmark becomes visible only after sign-in.
          const alreadySaved = readRecipeMemory().savedRecipeIds.includes(recipeId);
          if (alreadySaved === !saved) {
            setSaved(alreadySaved);
            return;
          }
          const next = toggleSavedRecipe(recipeId);
          setSaved(next.savedRecipeIds.includes(recipeId));
          const persisted =
            readRecipeMemory().savedRecipeIds.includes(recipeId);
          if (persisted !== saved)
            trackEvent(persisted ? 'recipe_save' : 'recipe_unsave', {
              recipe_id: recipeId,
              locale,
            });
        });
      }}
      type="button"
    >
      <Bookmark
        aria-hidden="true"
        fill={saved ? 'currentColor' : 'none'}
        size={19}
      />
    </button>
  );
}
