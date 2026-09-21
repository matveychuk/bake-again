import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RecipePage as RecipePageShell } from '@/components/recipe/recipe-page';
import {
  getCreamOptionCopy,
  isReusableCreamRecipeId,
  reusableCreamRecipeIds,
} from '@/content/recipes/cream-option-copy';
import { recipeDetailTitles } from '@/content/recipes/catalog-locales';
import {
  getInventoryRecipe,
  recipeInventory,
} from '@/content/recipes/inventory';

type RecipePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cream?: string | string[] }>;
};

export function generateStaticParams() {
  return [
    ...recipeInventory.map((recipe) => ({ slug: recipe.slug })),
    ...reusableCreamRecipeIds.map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  if (isReusableCreamRecipeId(slug)) {
    const copy = getCreamOptionCopy(slug, 'en');
    return {
      title: `${copy.title} — Bake Again`,
      description: copy.description,
      robots: { index: false, follow: false },
    };
  }
  const recipe = getInventoryRecipe(slug);
  if (!recipe) return {};
  return {
    title: `${recipeDetailTitles[recipe.id]?.en ?? recipe.title} — Bake Again`,
    description: recipe.summary,
  };
}

export default async function RecipePage({
  params,
  searchParams,
}: RecipePageProps) {
  const { slug } = await params;
  const recipe = getInventoryRecipe(slug);
  if (!recipe && !isReusableCreamRecipeId(slug)) notFound();
  const requestedCream = (await searchParams).cream;
  return (
    <RecipePageShell
      slug={slug}
      selectedCreamRecipeId={
        Array.isArray(requestedCream) ? requestedCream[0] : requestedCream
      }
    />
  );
}
