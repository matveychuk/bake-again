'use client';

import type { MouseEvent, ReactNode } from 'react';
import {
  createRecipeReturnMarker,
  recipeReturnStorageKey,
} from '@/lib/i18n/recipe-return';

export function RecipeRelatedLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;

    const marker = createRecipeReturnMarker({
      sourceHref: window.location.href,
      targetHref: new URL(href, window.location.href).href,
    });

    if (marker) {
      try {
        window.sessionStorage.setItem(
          recipeReturnStorageKey,
          JSON.stringify(marker),
        );
      } catch {
        // The ordinary link still records browser history when storage is unavailable.
      }
    }
  };

  return (
    <a className={className} href={href} onClick={handleClick}>
      {children}
    </a>
  );
}
