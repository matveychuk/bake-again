function isRecipeDetailPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const recipesIndex = segments[0] === 'recipes' ? 0 : 1;

  return (
    segments[recipesIndex] === 'recipes' &&
    segments.length === recipesIndex + 2
  );
}

export const recipeReturnStorageKey = 'bake-again:recipe-return';

export type RecipeReturnMarker = {
  sourceHref: string;
  targetHref: string;
  createdAt: number;
};

function navigationHref(href: string) {
  const url = new URL(href);
  return `${url.origin}${url.pathname}${url.search}`;
}

export function canReturnToPreviousRecipe({
  currentHref,
  referrer,
}: {
  currentHref: string;
  referrer: string;
}) {
  if (!referrer) return false;

  try {
    const current = new URL(currentHref);
    const previous = new URL(referrer);

    return (
      previous.origin === current.origin &&
      previous.pathname !== current.pathname &&
      isRecipeDetailPath(current.pathname) &&
      isRecipeDetailPath(previous.pathname)
    );
  } catch {
    return false;
  }
}

export function createRecipeReturnMarker({
  sourceHref,
  targetHref,
  createdAt = Date.now(),
}: {
  sourceHref: string;
  targetHref: string;
  createdAt?: number;
}): RecipeReturnMarker | null {
  if (!canReturnToPreviousRecipe({ currentHref: targetHref, referrer: sourceHref }))
    return null;

  return { sourceHref, targetHref, createdAt };
}

export function canReturnFromMarker({
  currentHref,
  marker,
  now = Date.now(),
}: {
  currentHref: string;
  marker: RecipeReturnMarker;
  now?: number;
}) {
  try {
    return (
      now >= marker.createdAt &&
      now - marker.createdAt <= 120_000 &&
      navigationHref(currentHref) === navigationHref(marker.targetHref) &&
      canReturnToPreviousRecipe({
        currentHref,
        referrer: marker.sourceHref,
      })
    );
  } catch {
    return false;
  }
}
