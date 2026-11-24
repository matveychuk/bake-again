import { cookCompletionReview } from '@/components/community/recipe-reviews';
import { CookModePage } from '@/components/cook-mode/cook-mode-page';

export default async function NapoleonCookModePage() {
  return (
    <CookModePage
      recipeSlug="napoleon-cake"
      completionReview={await cookCompletionReview(
        'gluten-free-napoleon',
        'en',
      )}
    />
  );
}
