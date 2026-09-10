import { recipeInventory } from './inventory.ts';
import { catalogLocaleCopy } from './catalog-locales.ts';
import type { AppLocale } from '../../lib/i18n/config.ts';
import { getUiMessages } from '../../lib/i18n/messages.ts';

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
};

export function getRecipeCatalog(locale: AppLocale): RecipeCatalogEntry[] {
  return recipeInventory.map((recipe) => {
    const copy = catalogLocaleCopy[recipe.id];
    const localized = copy?.title[locale];
    return {
  id: recipe.id,
  title: localized ?? recipe.title,
  eyebrow: copy?.category[locale] ?? recipe.category,
  detail: locale === 'en' ? (recipe.totalTime ?? recipe.activeTime ?? getUiMessages(locale).catalog.detailsToConfirm) : getUiMessages(locale).catalog.detailsToConfirm,
  status: getUiMessages(locale).catalog.workingRecord,
  statusKind: 'draft',
  statusDetail: recipe.flour.replace(' Bread', ''),
  image: recipe.image,
  imageKind: recipe.imageKind,
  alt: copy?.alt[locale] ?? recipe.imageAlt,
  href: `/recipes/${recipe.slug}`,
  publicationStatus: 'draft',
    };
  });
}

/** @deprecated Use getRecipeCatalog(locale) in locale-aware surfaces. */
export const recipeCatalog = getRecipeCatalog('en');
