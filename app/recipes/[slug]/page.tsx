import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RecipePage as RecipePageShell } from '@/components/recipe/recipe-page';
import { getInventoryRecipe, recipeInventory } from '@/content/recipes/inventory';

type RecipePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return recipeInventory
    .map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getInventoryRecipe(slug);
  if (!recipe) return {};
  return { title: `${recipe.title} — Bake Again`, description: recipe.summary };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = getInventoryRecipe(slug);
  if (!recipe) notFound();
  return <RecipePageShell slug={slug} />;
}
