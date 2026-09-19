import { getPersonalStateRecipe } from '@/content/recipes/registry';
import { getInventoryRecipe } from '@/content/recipes/inventory';
import { defaultLocale, type AppLocale } from '@/lib/i18n/config';
import { InventoryRecipeDetail } from './inventory-recipe-detail';

type RecipePageProps = {
  slug: string;
  locale?: AppLocale;
  pathname?: string;
};

/**
 * The single composition point for recipe detail routes. Recipe-specific
 * capabilities stay in data/adapters; routes only pass the requested slug.
 */
export function RecipePage({ slug, locale = defaultLocale, pathname }: RecipePageProps) {
  const recipe = getInventoryRecipe(slug);
  return recipe ? <InventoryRecipeDetail personalRecipe={getPersonalStateRecipe(recipe.id)} recipe={recipe} locale={locale} pathname={pathname} /> : null;
}
