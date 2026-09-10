import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RecipePage } from '@/components/recipe/recipe-page';
import { getInventoryRecipe } from '@/content/recipes/inventory';
import { catalogLocaleCopy } from '@/content/recipes/catalog-locales';
import { isAppLocale, localeMetadata, supportedLocales } from '@/lib/i18n/config';
import { getPreviewRobots, getPublishableRecipeLocales, isRecipeLocalePublishable } from '@/lib/i18n/publication';
import {
  getLegacySlugForRecipeId,
  getLocalizedRecipePath,
  getRecipeIdFromLocalizedSlug,
} from '@/lib/i18n/routes';
import { personalStateRecipes } from '@/content/recipes/registry';

type LocalizedRecipePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const localizedRecipes = personalStateRecipes;

export function generateStaticParams() {
  return supportedLocales.flatMap((locale) =>
    localizedRecipes.map((recipe) => ({ locale, slug: recipe.slug[locale] })),
  );
}

export async function generateMetadata({ params }: LocalizedRecipePageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isAppLocale(localeParam)) return {};

  const recipeId = getRecipeIdFromLocalizedSlug(localeParam, slug);
  const recipe = localizedRecipes.find((candidate) => candidate.id === recipeId);
  if (!recipe) {
    const legacyRecipe = getInventoryRecipe(slug);
    const copy = legacyRecipe ? catalogLocaleCopy[legacyRecipe.id] : null;
    return legacyRecipe
      ? { title: `${copy?.title[localeParam] ?? legacyRecipe.title} — Bake Again`, description: copy?.summary[localeParam] ?? legacyRecipe.summary, robots: { index: false, follow: false }, openGraph: { title: `${copy?.title[localeParam] ?? legacyRecipe.title} — Bake Again`, description: copy?.summary[localeParam] ?? legacyRecipe.summary, locale: localeMetadata[localeParam].bcp47 } }
      : {};
  }

  const currentPath = getLocalizedRecipePath(recipe.id, localeParam)!;
  const isPublishable = isRecipeLocalePublishable(recipe, localeParam);
  const publishedLocales = getPublishableRecipeLocales(recipe);
  return {
    title: `${recipe.title[localeParam]} — Bake Again`,
    description: recipe.summary[localeParam],
    robots: getPreviewRobots(isPublishable),
    ...(isPublishable && {
      alternates: {
        canonical: currentPath,
        languages: Object.fromEntries(
          publishedLocales.map((locale) => [
            localeMetadata[locale].bcp47,
            getLocalizedRecipePath(recipe.id, locale)!,
          ]),
        ),
      },
    }),
    openGraph: {
      title: `${recipe.title[localeParam]} — Bake Again`,
      description: recipe.summary[localeParam],
      locale: localeMetadata[localeParam].bcp47,
    },
  };
}

export default async function LocalizedRecipePage({ params }: LocalizedRecipePageProps) {
  const { locale, slug } = await params;
  if (!isAppLocale(locale)) notFound();

  const recipeId = getRecipeIdFromLocalizedSlug(locale, slug);
  const legacySlug = recipeId ? getLegacySlugForRecipeId(recipeId) : slug;
  if (!legacySlug || !getInventoryRecipe(legacySlug)) notFound();

  return <RecipePage slug={legacySlug} locale={locale} pathname={`/${locale}/recipes/${slug}`} />;
}
