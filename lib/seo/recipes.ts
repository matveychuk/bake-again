import { getRecipeDocument } from '../../content/recipes/registry.ts';
import {
  getInventoryRecipe,
  recipeInventory,
} from '../../content/recipes/inventory.ts';
import { getComponentPageRecipe } from '../../content/recipes/recipe-component-records.ts';
import {
  catalogLocaleCopy,
  recipeDetailTitles,
} from '../../content/recipes/catalog-locales.ts';
import { recipeSeo } from '../../content/recipes/seo.ts';
import {
  getLocalizedRecipePath,
  getRecipeIdFromLocalizedSlug,
} from '../i18n/routes.ts';
import { isRecipeLocalePublishable } from '../i18n/publication.ts';
import { formatQuantity } from '../i18n/format.ts';
import { type AppLocale, supportedLocales } from '../i18n/config.ts';
import { absoluteUrl } from './site.ts';
import type { StructuredRecipeContent } from '../../content/recipes/source-recipe.types.ts';

export function recipeIdForSlug(
  locale: AppLocale,
  slug: string,
): string | null {
  return (
    getRecipeIdFromLocalizedSlug(locale, slug) ??
    getInventoryRecipe(slug)?.id ??
    null
  );
}

export function recipePresentation(id: string, locale: AppLocale) {
  const document = getRecipeDocument(id);
  const inventory =
    recipeInventory.find((recipe) => recipe.id === id) ??
    getComponentPageRecipe(id);
  if (!document || !inventory) return null;
  const copy = catalogLocaleCopy[id];
  const title =
    recipeDetailTitles[id]?.[locale] ?? copy?.title[locale] ?? inventory.title;
  const description = copy?.summary[locale] ?? inventory.summary;
  const path = getLocalizedRecipePath(id, locale)!;
  return {
    id,
    title,
    description,
    path,
    seoTitle: recipeSeo[id]?.[locale]?.title?.trim() || title,
    seoDescription: recipeSeo[id]?.[locale]?.description?.trim() || description,
    image: inventory.image,
    alt: copy?.alt[locale] ?? inventory.imageAlt,
    category: copy?.category[locale] ?? inventory.category,
    indexable: isRecipeLocalePublishable(document.recipe, locale),
    locales: supportedLocales.filter((language) =>
      isRecipeLocalePublishable(document.recipe, language),
    ),
  };
}

/** Structured data reflects the exact content rendered for the requested configuration. */
export function recipeStructuredData(
  id: string,
  locale: AppLocale,
  content: StructuredRecipeContent,
) {
  const page = recipePresentation(id, locale);
  if (
    !page?.indexable ||
    content.completeness !== 'readyToReview' ||
    !content.steps.length
  )
    return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    '@id': `${absoluteUrl(page.path)}#recipe`,
    url: absoluteUrl(page.path),
    name: page.title,
    description: page.description,
    inLanguage: locale,
    image: [absoluteUrl(page.image)],
    recipeCategory: page.category,
    ...(content.yield && { recipeYield: content.yield.label }),
    // Active time includes hands-on cooking, so it must not be mislabelled prepTime.
    ...(content.timing?.totalElapsedMinutes != null && {
      totalTime: `PT${content.timing.totalElapsedMinutes}M`,
    }),
    recipeIngredient: content.ingredientSections.flatMap((section) =>
      section.ingredients.map((ingredient) =>
        [
          formatQuantity(
            locale,
            ingredient.quantity.base ?? ingredient.quantity.equivalent ?? null,
          ),
          ingredient.name,
          ingredient.note,
          ingredient.optional
            ? { uk: '(необов’язково)', en: '(optional)', es: '(opcional)' }[
                locale
              ]
            : null,
        ]
          .filter(Boolean)
          .join(' '),
      ),
    ),
    recipeInstructions: content.steps.map((step) => ({
      '@type': 'HowToStep',
      name: step.title,
      text: [step.body, step.meta, step.checkpoint, step.tip]
        .filter(Boolean)
        .join(' '),
      ...(step.media?.find((media) => media.type !== 'video') && {
        image: absoluteUrl(
          step.media.find((media) => media.type !== 'video')!.src,
        ),
      }),
    })),
  };
}

/** Prevent HTML/script termination without altering the parsed JSON. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
