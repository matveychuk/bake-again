import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RecipePage } from '@/components/recipe/recipe-page';
import {
  getComponentCopy,
  isReusableComponentRecipeId,
  reusableComponentRecipeIds,
} from '@/content/recipes/recipe-component-records';
import { getInventoryRecipe } from '@/content/recipes/inventory';
import {
  catalogLocaleCopy,
  recipeDetailTitles,
} from '@/content/recipes/catalog-locales';
import {
  isAppLocale,
  localeMetadata,
  supportedLocales,
} from '@/lib/i18n/config';
import {
  getPreviewRobots,
  getPublishableRecipeLocales,
  isRecipeLocalePublishable,
} from '@/lib/i18n/publication';
import {
  getLegacySlugForRecipeId,
  getLocalizedRecipePath,
  getRecipeIdFromLocalizedSlug,
} from '@/lib/i18n/routes';
import { personalStateRecipes } from '@/content/recipes/registry';

type LocalizedRecipePageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const localizedRecipes = personalStateRecipes;

export function generateStaticParams() {
  return supportedLocales.flatMap((locale) => [
    ...localizedRecipes.map((recipe) => ({
      locale,
      slug: recipe.slug[locale],
    })),
    ...reusableComponentRecipeIds.map((slug) => ({ locale, slug })),
  ]);
}

export async function generateMetadata({
  params,
}: LocalizedRecipePageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isAppLocale(localeParam)) return {};

  if (isReusableComponentRecipeId(slug)) {
    const copy = getComponentCopy(slug, localeParam);
    return {
      title: `${copy.title} — Bake Again`,
      description: copy.description,
      robots: { index: false, follow: false },
    };
  }

  const recipeId = getRecipeIdFromLocalizedSlug(localeParam, slug);
  const recipe = localizedRecipes.find(
    (candidate) => candidate.id === recipeId,
  );
  if (!recipe) {
    const legacyRecipe = getInventoryRecipe(slug);
    const copy = legacyRecipe ? catalogLocaleCopy[legacyRecipe.id] : null;
    const detailTitle = legacyRecipe
      ? (recipeDetailTitles[legacyRecipe.id]?.[localeParam] ??
        copy?.title[localeParam] ??
        legacyRecipe.title)
      : null;
    return legacyRecipe
      ? {
          title: `${detailTitle} — Bake Again`,
          description: copy?.summary[localeParam] ?? legacyRecipe.summary,
          robots: { index: false, follow: false },
          openGraph: {
            title: `${detailTitle} — Bake Again`,
            description: copy?.summary[localeParam] ?? legacyRecipe.summary,
            locale: localeMetadata[localeParam].bcp47,
          },
        }
      : {};
  }

  const currentPath = getLocalizedRecipePath(recipe.id, localeParam)!;
  const isPublishable = isRecipeLocalePublishable(recipe, localeParam);
  const publishedLocales = getPublishableRecipeLocales(recipe);
  const detailTitle =
    recipeDetailTitles[recipe.id]?.[localeParam] ?? recipe.title[localeParam];
  return {
    title: `${detailTitle} — Bake Again`,
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
      title: `${detailTitle} — Bake Again`,
      description: recipe.summary[localeParam],
      locale: localeMetadata[localeParam].bcp47,
    },
  };
}

export default async function LocalizedRecipePage({
  params,
  searchParams,
}: LocalizedRecipePageProps) {
  const { locale, slug } = await params;
  if (!isAppLocale(locale)) notFound();

  const recipeId = getRecipeIdFromLocalizedSlug(locale, slug);
  const legacySlug = recipeId
    ? (getLegacySlugForRecipeId(recipeId) ?? recipeId)
    : slug;
  if (
    !legacySlug ||
    (!getInventoryRecipe(legacySlug) && !isReusableComponentRecipeId(legacySlug))
  )
    notFound();

  const requestedSearchParams = await searchParams;
  const requestedCream = requestedSearchParams.cream;
  const selectedCreamRecipeId = Array.isArray(requestedCream)
    ? requestedCream[0]
    : requestedCream;

  return (
    <RecipePage
      slug={legacySlug}
      locale={locale}
      pathname={`/${locale}/recipes/${slug}`}
      selectedCreamRecipeId={selectedCreamRecipeId}
      configurationSearch={new URLSearchParams(
        Object.entries(requestedSearchParams).flatMap(([key, value]) =>
          value === undefined
            ? []
            : (Array.isArray(value) ? value : [value]).map(
                (item) => [key, item] as [string, string],
              ),
        ),
      ).toString()}
    />
  );
}
