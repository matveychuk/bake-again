import { recipeIdForSlug } from '@/lib/seo/recipes';
import { recipeMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RecipePage } from '@/components/recipe/recipe-page';
import { isReusableComponentRecipeId } from '@/content/recipes/recipe-component-records';
import { getInventoryRecipe } from '@/content/recipes/inventory';
import { isAppLocale, supportedLocales } from '@/lib/i18n/config';
import {
  getLegacySlugForRecipeId,
  getLocalizedRecipePath,
  getRecipeIdFromLocalizedSlug,
} from '@/lib/i18n/routes';
import { recipeDocuments } from '@/content/recipes/registry';

type LocalizedRecipePageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return supportedLocales.flatMap((locale) =>
    recipeDocuments
      .filter((document) => document.recipe.publicationStatus === 'published')
      .map((document) => ({
        locale,
        slug: getLocalizedRecipePath(document.recipe.id, locale)!
          .split('/')
          .pop()!,
      })),
  );
}

export async function generateMetadata({
  params,
}: LocalizedRecipePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isAppLocale(locale)) return {};
  const id = recipeIdForSlug(locale, slug);
  return id
    ? recipeMetadata(id, locale)
    : { robots: { index: false, follow: false } };
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
    (!getInventoryRecipe(legacySlug) &&
      !isReusableComponentRecipeId(legacySlug))
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
