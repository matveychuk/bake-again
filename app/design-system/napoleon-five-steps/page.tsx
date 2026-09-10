import type { Metadata } from 'next';
import { NapoleonRecipePage } from '@/components/recipe/napoleon-recipe-page';
import { glutenFreeNapoleonRecipe } from '@/content/recipes/gluten-free-napoleon.recipe';

export const metadata: Metadata = {
  title: 'Napoleon — five-step review — Bake Again',
  description: 'A fixed five-step visual reference for comparing the Napoleon recipe layout.',
  robots: { index: false },
};

/** A stable review route; it intentionally shares the live recipe component and styles. */
export default function NapoleonFiveStepsReviewPage() {
  return <NapoleonRecipePage methodStepLimit={5} recipe={glutenFreeNapoleonRecipe} />;
}
