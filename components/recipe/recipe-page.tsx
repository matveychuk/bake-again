import { glutenFreeNapoleonRecipe } from '@/content/recipes/gluten-free-napoleon.recipe';
import { getInventoryRecipe } from '@/content/recipes/inventory';
import { InventoryRecipeDetail } from './inventory-recipe-detail';
import { NapoleonRecipePage } from './napoleon-recipe-page';

type RecipePageProps = {
  slug: string;
};

/**
 * The single composition point for recipe detail routes. Recipe-specific
 * capabilities stay in data/adapters; routes only pass the requested slug.
 */
export function RecipePage({ slug }: RecipePageProps) {
  if (slug === 'napoleon-cake') {
    return <NapoleonRecipePage recipe={glutenFreeNapoleonRecipe} />;
  }

  const recipe = getInventoryRecipe(slug);
  return recipe ? <InventoryRecipeDetail recipe={recipe} /> : null;
}
