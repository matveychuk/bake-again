import type { AppLocale } from '../../lib/i18n/config.ts';
import type { LocalizedText } from './recipe.types.ts';

/** Stable IDs for reader-facing recipe collections. A recipe may belong to more than one. */
export const recipeCollectionIds = [
  'breakfast',
  'everyday',
  'celebration',
  'cottage-cheese',
  'batter-on-hand',
] as const;

export type RecipeCollectionId = (typeof recipeCollectionIds)[number];

export type RecipeCollection = {
  id: RecipeCollectionId;
  title: LocalizedText;
};

export const recipeCollections: readonly RecipeCollection[] = [
  {
    id: 'breakfast',
    title: { uk: 'На сніданок', en: 'For breakfast', es: 'Para desayunar' },
  },
  {
    id: 'everyday',
    title: {
      uk: 'На щодень',
      en: 'For every day',
      es: 'Para cada día',
    },
  },
  {
    id: 'celebration',
    title: { uk: 'Для свята', en: 'For a celebration', es: 'Para una celebración' },
  },
  {
    id: 'cottage-cheese',
    title: { uk: 'Із сиром', en: 'With curd cheese', es: 'Con tvorog' },
  },
  {
    id: 'batter-on-hand',
    title: { uk: 'Тісто про запас', en: 'Batter on hand', es: 'Masa lista' },
  },
] as const;

export function isRecipeCollectionId(value: string | undefined): value is RecipeCollectionId {
  return recipeCollectionIds.some((id) => id === value);
}

export function getRecipeCollection(
  id: RecipeCollectionId,
): RecipeCollection {
  const collection = recipeCollections.find((candidate) => candidate.id === id);
  if (!collection) throw new Error(`Unknown recipe collection: ${id}`);
  return collection;
}

export function getLocalizedRecipeCollection(
  id: RecipeCollectionId,
  locale: AppLocale,
): string {
  return getRecipeCollection(id).title[locale];
}
