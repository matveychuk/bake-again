import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CookModePage } from '@/components/cook-mode/cook-mode-page';
import { getCookModeDefinition } from '@/content/recipes/cook-mode-registry';
import { isAppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { recipeIdForSlug, recipePresentation } from '@/lib/seo/recipes';
import { absoluteUrl } from '@/lib/seo/site';
import {
  getLegacySlugForRecipeId,
  getLocalizedRecipePath,
  getRecipeIdFromLocalizedSlug,
  localeHomePath,
} from '@/lib/i18n/routes';

type LocalizedCookRouteProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: LocalizedCookRouteProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isAppLocale(localeParam)) return {};

  const recipeId = recipeIdForSlug(localeParam, slug);
  const page = recipeId ? recipePresentation(recipeId, localeParam) : null;
  return {
    ...(page && getUiMessages(localeParam).metadata.cook(page.title)),
    robots: { index: false, follow: true },
    ...(page && { alternates: { canonical: absoluteUrl(page.path) } }),
  };
}

export default async function LocalizedRecipeCookModeRoute({
  params,
  searchParams,
}: LocalizedCookRouteProps) {
  const { locale, slug } = await params;
  if (!isAppLocale(locale)) notFound();

  const recipeId = getRecipeIdFromLocalizedSlug(locale, slug);
  const legacySlug = recipeId
    ? (getLegacySlugForRecipeId(recipeId) ?? recipeId)
    : slug;
  const definition = getCookModeDefinition(legacySlug, locale);
  if (!definition) notFound();
  const detailHref = recipeId
    ? getLocalizedRecipePath(recipeId, locale)!
    : `/${locale}/recipes/${slug}`;
  const requestedSearchParams = await searchParams;
  const configurationSearch = new URLSearchParams(
    Object.entries(requestedSearchParams).flatMap(([key, value]) =>
      value === undefined
        ? []
        : (Array.isArray(value) ? value : [value]).map(
            (item) => [key, item] as [string, string],
          ),
    ),
  ).toString();

  return (
    <CookModePage
      recipeSlug={legacySlug}
      detailHref={detailHref}
      homeHref={localeHomePath(locale)}
      locale={locale}
      configurationSearch={configurationSearch}
    />
  );
}
