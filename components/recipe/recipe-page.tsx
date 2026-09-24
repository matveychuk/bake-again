import { getPersonalStateRecipe } from '@/content/recipes/registry';
import { getInventoryRecipe } from '@/content/recipes/inventory';
import { getComponentPageRecipe } from '@/content/recipes/recipe-component-records';
import { isReusableComponentRecipeId } from '@/content/recipes/recipe-component-records';
import { defaultLocale, type AppLocale } from '@/lib/i18n/config';
import { InventoryRecipeDetail } from './inventory-recipe-detail';

type RecipePageProps = {
  slug: string;
  locale?: AppLocale;
  pathname?: string;
  selectedCreamRecipeId?: string | null;
  configurationSearch?: string;
};

/**
 * The single composition point for recipe detail routes. Recipe-specific
 * capabilities stay in data/adapters; routes only pass the requested slug.
 */
export function RecipePage({
  slug,
  locale = defaultLocale,
  pathname,
  selectedCreamRecipeId,
  configurationSearch = '',
}: RecipePageProps) {
  const recipe = getInventoryRecipe(slug) ?? getComponentPageRecipe(slug);
  return recipe ? (
    <InventoryRecipeDetail
      personalRecipe={getPersonalStateRecipe(recipe.id)}
      recipe={recipe}
      locale={locale}
      pathname={pathname}
      selectedCreamRecipeId={selectedCreamRecipeId}
      configurationSearch={configurationSearch}
      isStandaloneComponent={isReusableComponentRecipeId(slug)}
    />
  ) : null;
}
