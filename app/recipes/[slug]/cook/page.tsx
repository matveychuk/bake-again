import { cookCompletionReview } from '@/components/community/recipe-reviews';
import { notFound } from 'next/navigation';
import { CookModePage } from '@/components/cook-mode/cook-mode-page';
import { getCookModeDefinition } from '@/content/recipes/cook-mode-registry';

type CookRouteProps = { params: Promise<{ slug: string }> };

export default async function RecipeCookModeRoute({ params }: CookRouteProps) {
  const { slug } = await params;
  const definition = getCookModeDefinition(slug);
  if (!definition) notFound();
  return (
    <CookModePage
      recipeSlug={slug}
      completionReview={await cookCompletionReview(definition.recipeId, 'en')}
    />
  );
}
