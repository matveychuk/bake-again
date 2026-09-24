import { recipeInventory } from './inventory.ts';
import { catalogLocaleCopy } from './catalog-locales.ts';
import { getRecipeContent } from './registry.ts';
import { getRecipePublicationStatus } from './publication.ts';
import type { AppLocale } from '../../lib/i18n/config.ts';
import { formatElapsedMinutes } from '../../lib/i18n/format.ts';
import { getUiMessages } from '../../lib/i18n/messages.ts';
import {
  getLocalizedRecipeCollection,
  type RecipeCollectionId,
} from './collections.ts';
import type { PublicationStatus } from './recipe.types.ts';
import type { StructuredRecipeOverview } from './source-recipe.types.ts';

export type CatalogScope = 'published' | 'unpublished' | 'all';
export type RecipeCatalogEntry = {
  id: string;
  title: string;
  /** Search-only classification; never rendered above the title. */
  category: string;
  detail: string | null;
  difficulty: string | null;
  flour: string;
  image: string;
  alt: string;
  href: string;
  publicationStatus: PublicationStatus;
  imageKind: 'generated-preview' | 'author-photo' | 'edited-author-photo';
  collections: Array<{ id: RecipeCollectionId; label: string }>;
};

export function cardTime(
  locale: AppLocale,
  timing: StructuredRecipeOverview['timing'],
): string | null {
  const total = timing.totalElapsedMinutes;
  const minutes = total ?? timing.activeMinutes;
  if (minutes === null) return null;
  const duration = formatElapsedMinutes(locale, minutes);
  const messages = getUiMessages(locale).recipe;
  return `${total === null ? messages.activeTime : messages.totalTime}: ${duration}`;
}

/** Public by default. Editorial callers must explicitly request unpublished records. */
export function getRecipeCatalog(
  locale: AppLocale,
  scope: CatalogScope = 'published',
): RecipeCatalogEntry[] {
  return recipeInventory.flatMap((recipe) => {
    const publicationStatus = getRecipePublicationStatus(recipe.id);
    if (
      !publicationStatus ||
      publicationStatus === 'archived' ||
      (scope !== 'all' && publicationStatus !== scope)
    )
      return [];
    const copy = catalogLocaleCopy[recipe.id];
    const overview = getRecipeContent(recipe.id, locale)?.overview;
    const messages = getUiMessages(locale).recipe;
    const difficulty = overview?.difficulty;
    return [
      {
        id: recipe.id,
        title: copy?.title[locale] ?? recipe.title,
        category: copy?.category[locale] ?? recipe.category,
        detail: overview ? cardTime(locale, overview.timing) : null,
        difficulty: difficulty
          ? `${messages.difficulty}: ${difficulty === 'easy' ? messages.difficultyEasy : difficulty === 'medium' ? messages.difficultyMedium : messages.difficultyAdvanced}`
          : null,
        flour: overview?.flour.replace(' Bread', '') ?? '',
        image: recipe.image,
        imageKind: recipe.imageKind,
        alt: copy?.alt[locale] ?? recipe.imageAlt,
        href: `/recipes/${recipe.slug}`,
        publicationStatus,
        collections: recipe.collectionIds.map((id) => ({
          id,
          label: getLocalizedRecipeCollection(id, locale),
        })),
      },
    ];
  });
}

/** @deprecated Use getRecipeCatalog(locale) in locale-aware surfaces. */
export const recipeCatalog = getRecipeCatalog('en');
