import { recipeInventory } from './inventory.ts';
import { catalogLocaleCopy } from './catalog-locales.ts';
import { getRecipeContent } from './registry.ts';
import type { AppLocale } from '../../lib/i18n/config.ts';
import { formatDuration } from '../../lib/i18n/format.ts';
import { getUiMessages } from '../../lib/i18n/messages.ts';
import { getLocalizedRecipeCollection } from './collections.ts';
import type { RecipeCollectionId } from './collections.ts';

export type RecipeCatalogEntry = {
  id: string;
  title: string;
  eyebrow: string;
  detail: string;
  status: string;
  statusKind: 'draft';
  statusDetail: string;
  image: string;
  alt: string;
  href: string;
  publicationStatus: 'draft';
  imageKind: 'generated-preview' | 'author-photo';
  collections: Array<{ id: RecipeCollectionId; label: string }>;
};

export function getRecipeCatalog(locale: AppLocale): RecipeCatalogEntry[] {
  return recipeInventory.map((recipe) => {
    const copy = catalogLocaleCopy[recipe.id];
    const localized = copy?.title[locale];
    const overview = getRecipeContent(recipe.id, locale)?.overview;
    const minutes =
      overview?.timing.totalElapsedMinutes ??
      overview?.timing.activeMinutes ??
      null;
    return {
      id: recipe.id,
      title: localized ?? recipe.title,
      eyebrow: copy?.category[locale] ?? recipe.category,
      detail:
        (minutes === null
          ? null
          : formatDuration(locale, {
              kind: 'exact',
              value: minutes % 60 === 0 ? minutes / 60 : minutes,
              unit: minutes % 60 === 0 ? 'hour' : 'minute',
            })) ??
        getUiMessages(locale).catalog.detailsToConfirm,
      status: getUiMessages(locale).catalog.workingRecord,
      statusKind: 'draft',
      statusDetail: overview?.flour.replace(' Bread', '') ?? '',
      image: recipe.image,
      imageKind: recipe.imageKind,
      alt: copy?.alt[locale] ?? recipe.imageAlt,
      href: `/recipes/${recipe.slug}`,
      publicationStatus: 'draft',
      collections: recipe.collectionIds.map((id) => ({
        id,
        label: getLocalizedRecipeCollection(id, locale),
      })),
    };
  });
}

/** @deprecated Use getRecipeCatalog(locale) in locale-aware surfaces. */
export const recipeCatalog = getRecipeCatalog('en');
