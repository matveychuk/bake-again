import { personalStateRecipes } from '../../content/recipes/registry.ts';
import { recipeInventory } from '../../content/recipes/inventory.ts';
import { isReusableCreamRecipeId } from '../../content/recipes/cream-option-copy.ts';
import { isAppLocale, type AppLocale } from './config.ts';

const localizedRecipes = personalStateRecipes;

const legacyRecipeIds: Record<string, string> = {
  'napoleon-cake': 'gluten-free-napoleon',
  'crinkle-cookies': 'crinkle-cookies',
};

const legacySlugByRecipeId: Record<string, string> = Object.fromEntries(
  Object.entries(legacyRecipeIds).map(([slug, recipeId]) => [recipeId, slug]),
);

export function localeHomePath(locale: AppLocale): string {
  return `/${locale}`;
}

export function localeAboutPath(locale: AppLocale): string {
  return `/${locale}/about`;
}

export function localeRecipesPath(locale: AppLocale): string {
  return `/${locale}/recipes`;
}

export function localeDraftsPath(locale: AppLocale): string {
  return `/${locale}/drafts`;
}

export function localeSavedPath(locale: AppLocale): string {
  return `/${locale}/saved`;
}

export function localeShoppingListPath(locale: AppLocale): string {
  return `/${locale}/shopping-list`;
}

export function getLocalizedRecipePath(
  recipeId: string,
  locale: AppLocale,
  suffix = '',
): string | null {
  if (isReusableCreamRecipeId(recipeId)) {
    return `${localeRecipesPath(locale)}/${recipeId}${suffix}`;
  }
  const recipe = localizedRecipes.find(
    (candidate) => candidate.id === recipeId,
  );
  if (recipe)
    return `${localeRecipesPath(locale)}/${recipe.slug[locale]}${suffix}`;
  const inventoryRecipe = recipeInventory.find(
    (candidate) => candidate.id === recipeId,
  );
  return inventoryRecipe
    ? `${localeRecipesPath(locale)}/${inventoryRecipe.slug}${suffix}`
    : null;
}

export function getRecipeIdFromLocalizedSlug(
  locale: AppLocale,
  slug: string,
): string | null {
  if (isReusableCreamRecipeId(slug)) return slug;
  return (
    localizedRecipes.find((recipe) => recipe.slug[locale] === slug)?.id ?? null
  );
}

export function getRecipeIdFromLegacySlug(slug: string): string | null {
  return legacyRecipeIds[slug] ?? null;
}

export function getLegacySlugForRecipeId(recipeId: string): string | null {
  return legacySlugByRecipeId[recipeId] ?? null;
}

export function getLocaleFromPathname(pathname: string): AppLocale | null {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return isAppLocale(firstSegment) ? firstSegment : null;
}

export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (isAppLocale(segments[0])) segments.shift();
  return segments.length === 0 ? '/' : `/${segments.join('/')}`;
}

/**
 * Returns the equivalent localized path when it is known. Unknown recipe details
 * fall back to the localized home page rather than carrying an English-only slug
 * into a different locale.
 */
export function getLocaleSwitchPath(
  pathname: string,
  targetLocale: AppLocale,
): string {
  const unlocalizedPath = stripLocalePrefix(pathname);
  const recipeMatch = unlocalizedPath.match(/^\/recipes\/([^/]+)(\/cook)?$/);

  if (recipeMatch) {
    const [, slug, cookSuffix = ''] = recipeMatch;
    const currentLocale = getLocaleFromPathname(pathname);
    const recipeId =
      (currentLocale
        ? getRecipeIdFromLocalizedSlug(currentLocale, slug)
        : null) ??
      getRecipeIdFromLegacySlug(slug) ??
      recipeInventory.find((recipe) => recipe.slug === slug)?.id ??
      null;
    const localizedPath = recipeId
      ? getLocalizedRecipePath(recipeId, targetLocale, cookSuffix)
      : null;
    return localizedPath ?? localeHomePath(targetLocale);
  }

  if (unlocalizedPath === '/' || unlocalizedPath === '')
    return localeHomePath(targetLocale);
  if (unlocalizedPath === '/recipes') return localeHomePath(targetLocale);

  return `${localeHomePath(targetLocale)}${unlocalizedPath}`;
}
