import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CookModePage } from '@/components/cook-mode/cook-mode-page';
import { getCookModeDefinition } from '@/content/recipes/cook-mode-registry';
import { personalStateRecipes } from '@/content/recipes/registry';
import { isAppLocale, localeMetadata } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { getPreviewRobots, getPublishableRecipeLocales, isRecipeLocalePublishable } from '@/lib/i18n/publication';
import {
  getLegacySlugForRecipeId,
  getLocalizedRecipePath,
  getRecipeIdFromLocalizedSlug,
  localeHomePath,
} from '@/lib/i18n/routes';

type LocalizedCookRouteProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: LocalizedCookRouteProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isAppLocale(localeParam)) return {};

  const recipeId = getRecipeIdFromLocalizedSlug(localeParam, slug);
  const recipe = personalStateRecipes.find((candidate) => candidate.id === recipeId);
  if (!recipe) return { robots: { index: false, follow: false } };

  const isPublishable = isRecipeLocalePublishable(recipe, localeParam);
  const metadata = getUiMessages(localeParam).metadata.cook(recipe.title[localeParam]);
  return {
    ...metadata,
    robots: getPreviewRobots(isPublishable),
    ...(isPublishable && {
      alternates: {
        canonical: getLocalizedRecipePath(recipe.id, localeParam, '/cook')!,
        languages: Object.fromEntries(
          getPublishableRecipeLocales(recipe).map((locale) => [
            localeMetadata[locale].bcp47,
            getLocalizedRecipePath(recipe.id, locale, '/cook')!,
          ]),
        ),
      },
    }),
  };
}

export default async function LocalizedRecipeCookModeRoute({ params }: LocalizedCookRouteProps) {
  const { locale, slug } = await params;
  if (!isAppLocale(locale)) notFound();

  const recipeId = getRecipeIdFromLocalizedSlug(locale, slug);
  const legacySlug = recipeId ? (getLegacySlugForRecipeId(recipeId) ?? slug) : slug;
  const definition = getCookModeDefinition(legacySlug);
  if (!definition) notFound();
  const detailHref = recipeId
    ? getLocalizedRecipePath(recipeId, locale)!
    : `/${locale}/recipes/${slug}`;

  return (
    <CookModePage
      recipeSlug={legacySlug}
      detailHref={detailHref}
      homeHref={localeHomePath(locale)}
      locale={locale}
    />
  );
}
