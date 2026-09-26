import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RecipePage as RecipePageShell } from '@/components/recipe/recipe-page';
import {
  getComponentCopy,
  isReusableComponentRecipeId,
  reusableComponentRecipeIds,
} from '@/content/recipes/recipe-component-records';
import { recipeDetailTitles } from '@/content/recipes/catalog-locales';
import {
  getInventoryRecipe,
  recipeInventory,
} from '@/content/recipes/inventory';

type RecipePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return [
    ...recipeInventory.map((recipe) => ({ slug: recipe.slug })),
    ...reusableComponentRecipeIds.map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  if (isReusableComponentRecipeId(slug)) {
    const copy = getComponentCopy(slug, 'en');
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
  if (!recipe && !isReusableComponentRecipeId(slug)) notFound();
  const requestedSearchParams = await searchParams;
  const requestedCream = requestedSearchParams.cream;
  return (
    <RecipePageShell
      slug={slug}
      selectedCreamRecipeId={
        Array.isArray(requestedCream) ? requestedCream[0] : requestedCream
      }
      configurationSearch={new URLSearchParams(
        Object.entries(requestedSearchParams).flatMap(([key, value]) =>
          key === 'from' || value === undefined
            ? []
            : (Array.isArray(value) ? value : [value]).map(
                (item) => [key, item] as [string, string],
              ),
        ),
      ).toString()}
    />
  );
}
