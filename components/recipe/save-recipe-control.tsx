'use client';

import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUiMessages } from '@/lib/i18n/messages';
import { readRecipeMemory, subscribeToRecipeMemory, toggleSavedRecipe } from '@/lib/persistence/recipe-memory';
import type { AppLocale } from '@/lib/i18n/config';
import styles from './save-recipe-control.module.css';

export function SaveRecipeControl({ recipeId, title, locale }: { recipeId: string; title: string; locale: AppLocale }) {
  const [saved, setSaved] = useState(false);
  const messages = getUiMessages(locale).personal;

  useEffect(() => {
    const update = () => setSaved(readRecipeMemory().savedRecipeIds.includes(recipeId));
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
        const next = toggleSavedRecipe(recipeId);
        setSaved(next.savedRecipeIds.includes(recipeId));
      }}
      type="button"
    >
      {saved ? <BookmarkCheck aria-hidden="true" size={19} /> : <Bookmark aria-hidden="true" size={19} />}
    </button>
  );
}
