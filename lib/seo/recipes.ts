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
import type {
  StructuredIngredient,
  StructuredRecipeContent,
} from '../../content/recipes/source-recipe.types.ts';
import {
  recipeSearchMetadata,
  recipeLastModified,
} from '../../content/recipes/search-metadata.ts';
import { recipeSearchImages } from '../../content/recipes/search-images.ts';

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
  const facts = recipeSearchMetadata[id];
  const dateModified = recipeLastModified(getRecipeDocument(id)!.recipe);
  const totalMinutes = content.timing?.totalElapsedMinutes;
  const activeMinutes = content.timing?.activeMinutes;
  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    '@id': `${absoluteUrl(page.path)}#recipe`,
    url: absoluteUrl(page.path),
    name: page.title,
    description: page.seoDescription,
    inLanguage: locale,
    image: (
      recipeSearchImages[id]?.images.map((image) => image.url) ?? [page.image]
    ).map(absoluteUrl),
    author: {
      '@type': 'Person',
      name: locale === 'uk' ? 'Саша' : 'Sasha',
      url: absoluteUrl(`/${locale}/about`),
    },
    publisher: { '@id': absoluteUrl('/#organization') },
    suitableForDiet: 'https://schema.org/GlutenFreeDiet',
    ...(facts?.datePublished && { datePublished: facts.datePublished }),
    ...(dateModified && { dateModified }),
    ...(facts?.recipeCuisine[locale] && {
      recipeCuisine: facts.recipeCuisine[locale],
    }),
    ...(facts?.keywords[locale]?.length && {
      keywords: facts.keywords[locale].join(', '),
    }),
    ...(activeMinutes != null && { prepTime: isoMinutes(activeMinutes) }),
    ...(facts?.cookTimeMinutes != null && {
      cookTime: isoMinutes(facts.cookTimeMinutes),
    }),
    recipeCategory: page.category,
    ...(content.yield && { recipeYield: content.yield.label }),
    ...(totalMinutes != null && { totalTime: isoMinutes(totalMinutes) }),
    recipeIngredient: content.ingredientSections.flatMap((section) =>
      section.ingredients.map((ingredient) =>
        structuredIngredient(locale, ingredient),
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

export function isoMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `PT${hours ? `${hours}H` : ''}${remainder || !hours ? `${remainder}M` : ''}`;
}

/** Keep unmeasured ingredients readable without repeating the quantity as a note. */
export function structuredIngredient(
  locale: AppLocale,
  ingredient: StructuredIngredient,
): string {
  const quantity = ingredient.quantity.base ?? ingredient.quantity.equivalent;
  const optional = ingredient.optional
    ? { uk: '(необов’язково)', en: '(optional)', es: '(opcional)' }[locale]
    : '';
  if (quantity)
    return [
      formatQuantity(locale, quantity),
      ingredient.name,
      ingredient.note,
      optional,
    ]
      .filter(Boolean)
      .join(' ');
  const note = ingredient.note?.trim();
  const asNeeded = { uk: 'за потреби', en: 'as needed', es: 'al gusto' }[
    locale
  ];
  const generic =
    /^(as needed|to taste|add to taste|за потреби|за смаком|al gusto|según sea necesario)[.!]?$/i;
  const detail = !note || generic.test(note) ? asNeeded : note;
  return `${ingredient.name}${locale === 'uk' ? ' — ' : ', '}${detail}${optional ? ` ${optional}` : ''}`;
}
