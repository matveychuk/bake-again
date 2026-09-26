'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  canReturnFromMarker,
  canReturnToPreviousRecipe,
  recipeReturnStorageKey,
  type RecipeReturnMarker,
} from '@/lib/i18n/recipe-return';

export function RecipeBackLink({
  fallbackHref,
  fallbackLabel,
  returnLabel,
}: {
  fallbackHref: string;
  fallbackLabel: string;
  returnLabel: string;
}) {
  const [returnsToRecipe, setReturnsToRecipe] = useState(false);

  useEffect(() => {
    let marker: RecipeReturnMarker | null = null;
    let storedMarker: string | null = null;

    try {
      storedMarker = window.sessionStorage.getItem(recipeReturnStorageKey);
      window.sessionStorage.removeItem(recipeReturnStorageKey);
    } catch {
      storedMarker = null;
    }

    if (storedMarker) {
      try {
        marker = JSON.parse(storedMarker) as RecipeReturnMarker;
      } catch {
        marker = null;
      }
    }

    const shouldReturn =
      canReturnToPreviousRecipe({
        currentHref: window.location.href,
        referrer: document.referrer,
      }) ||
      Boolean(
        marker &&
          canReturnFromMarker({
            currentHref: window.location.href,
            marker,
          }),
      );
    const frame = window.requestAnimationFrame(() =>
      setReturnsToRecipe(shouldReturn),
    );

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      !returnsToRecipe ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;

    event.preventDefault();
    window.history.back();
  };

  return (
    <a href={fallbackHref} onClick={handleClick}>
      <ArrowLeft aria-hidden="true" size={15} />
      {returnsToRecipe ? returnLabel : fallbackLabel}
    </a>
  );
}
