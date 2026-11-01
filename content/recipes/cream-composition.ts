import type { AppLocale } from '../../lib/i18n/config.ts';
import { getRecipe, projectRecipeContent } from './registry.ts';
import { composeRecipe } from './compose-recipe.ts';
import type { StructuredRecipeContent } from './localized-recipe.types.ts';

export function resolveSelectedCreamRecipeId(
  content: Pick<StructuredRecipeContent, 'creamOptions'> | null | undefined,
  requestedRecipeId: string | null | undefined,
): string | null {
  if (!requestedRecipeId || !content?.creamOptions) return null;
  return content.creamOptions.recipeIds.includes(requestedRecipeId)
    ? requestedRecipeId
    : null;
}

/** Compose canonical records first, then produce the requested localized view. */
export function composeRecipeWithCream(
  host: StructuredRecipeContent,
  cream: StructuredRecipeContent | null,
  creamRecipeId: string | null,
  locale: AppLocale = host.locale ?? 'en',
): StructuredRecipeContent {
  if (!host.creamOptions || !cream || !creamRecipeId) return host;
  if (!host.recipeId || cream.recipeId !== creamRecipeId)
    throw new Error('Composition requires canonical recipe identity');
  const canonicalHost = getRecipe(host.recipeId);
  const canonicalCream = getRecipe(creamRecipeId);
  if (!canonicalHost || !canonicalCream)
    throw new Error('Recipe is unavailable');
  return projectRecipeContent(
    composeRecipe(canonicalHost, canonicalCream),
    locale,
  );
}
