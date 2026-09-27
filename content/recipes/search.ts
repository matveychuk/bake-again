import { getRecipeCatalog, type CatalogScope } from './catalog.ts';
import { recipeDetailTitles } from './catalog-locales.ts';
import { getRecipeContent } from './registry.ts';
import { supportedLocales, type AppLocale } from '../../lib/i18n/config.ts';
import type { RecipeCollectionId } from './collections.ts';

export const recipeSearchMaxLength = 200;

/** Editorial discovery vocabulary, never recipe facts or substitutions. */
const dishAliases: Record<string, string[]> = {
  eclairs: [
    'еклер',
    'еклери',
    'еклерів',
    'eclair',
    'eclairs',
    'éclair',
    'éclairs',
  ],
  'lazy-dumplings': ['tvorog', 'curd cheese', 'cottage cheese', 'requesón', 'vareniki', 'вареники'],
  'cottage-cheese-waffles': [
    'tvorog', 'curd cheese', 'cottage cheese', 'requesón',
    'гофре',
    'сирні вафлі',
    'творожні вафлі',
    'вафлі з кисломолочного сиру',
  ],
  crepes: [
    'млинці',
    'млинець',
    'млинців',
    'млинчики',
    'млинки',
    'налисники',
    'crepe',
    'crepes',
  ],
  'apple-fritters': [
    'оладки',
    'оладка',
    'оладок',
    'оладочки',
    'pancakes',
    'fritters',
    'tortitas',
  ],
  'banana-fritters': [
    'оладки',
    'оладка',
    'оладок',
    'оладочки',
    'pancakes',
    'fritters',
    'tortitas',
  ],
  'apple-banana-fritters': [
    'оладки',
    'оладка',
    'оладок',
    'оладочки',
    'pancakes',
    'fritters',
    'tortitas',
  ],
};

// Explicit word forms avoid guessing Ukrainian stems or treating unrelated foods as synonyms.
const wordForms = [
  ['яблуко', 'яблука', 'яблук', 'яблуками', 'яблучні', 'яблучний', 'яблучна'],
  [
    'банан',
    'банани',
    'бананів',
    'бананами',
    'бананові',
    'банановий',
    'бананова',
  ],
  ['творог', 'творогу', 'творогом', 'кисломолочний', 'кисломолочного'],
  ['сир', 'сиру', 'сиром', 'сирні', 'сирний'],
  ['молоко', 'молока', 'молоці', 'молоком'],
  ['яйце', 'яйця', 'яєць', 'яйцями'],
  ['сніданок', 'сніданку', 'сніданки'],
  ['свято', 'свята', 'святковий', 'святкові'],
];
const stopWords = new Set(
  'з із зі і й та на для у в with and for the a de del con para la el los las'.split(
    ' ',
  ),
);

export function cleanRecipeQuery(value: string | string[] | undefined): string {
  return typeof value === 'string'
    ? value.trim().slice(0, recipeSearchMaxLength)
    : '';
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/([a-z])[\u0300-\u036f]+/g, '$1')
    .normalize('NFC')
    .replace(/[’'ʼ]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function words(value: string): string[] {
  return normalize(value).split(' ').filter(Boolean);
}

/** One insertion, deletion, replacement or adjacent transposition; long words only. */
function isSmallTypo(a: string, b: string): boolean {
  if (a.length < 5 || b.length < 5 || Math.abs(a.length - b.length) > 1)
    return false;
  let index = 0;
  while (index < Math.min(a.length, b.length) && a[index] === b[index]) index++;
  if (a.length === b.length) {
    return (
      a.slice(index + 1) === b.slice(index + 1) ||
      (a[index] === b[index + 1] &&
        a[index + 1] === b[index] &&
        a.slice(index + 2) === b.slice(index + 2))
    );
  }
  return a.length > b.length
    ? a.slice(index + 1) === b.slice(index)
    : a.slice(index) === b.slice(index + 1);
}

function matchWord(query: string, value: string): number {
  if (query === value) return 1;
  if (query.length >= 3 && value.startsWith(query)) return 0.8;
  if (wordForms.some((group) => group.includes(query) && group.includes(value)))
    return 0.8;
  return isSmallTypo(query, value) ? 0.4 : 0;
}

// Built from canonical localized names only: no archive notes, method prose or generated claims.
const searchIndex = getRecipeCatalog('en', 'all').map((entry) => {
  const fields: Array<{ tokens: string[]; weight: number }> = [];
  const titles: string[] = [];
  for (const locale of supportedLocales) {
    const recipe = getRecipeCatalog(locale, 'all').find(
      (item) => item.id === entry.id,
    )!;
    const content = getRecipeContent(entry.id, locale);
    titles.push(normalize(recipe.title));
    fields.push(
      {
        tokens: words(
          `${recipe.title} ${recipeDetailTitles[entry.id]?.[locale] ?? ''}`,
        ),
        weight: 100,
      },
      { tokens: words(recipe.category), weight: 30 },
      {
        tokens: recipe.collections.flatMap((collection) =>
          words(collection.label),
        ),
        weight: 40,
      },
      {
        tokens:
          content?.ingredientSections.flatMap((section) =>
            section.ingredients.flatMap((ingredient) => words(ingredient.name)),
          ) ?? [],
        weight: 60,
      },
    );
  }
  fields.push({
    tokens: (dishAliases[entry.id] ?? []).flatMap(words),
    weight: 90,
  });
  return { id: entry.id, fields, titles };
});

export function searchRecipes(
  locale: AppLocale,
  rawQuery: string,
  collectionId: RecipeCollectionId | null = null,
  scope: CatalogScope = 'published',
) {
  const query = normalize(cleanRecipeQuery(rawQuery));
  const terms = words(query).filter((term) => !stopWords.has(term));
  const catalog = getRecipeCatalog(locale, scope).filter(
    (entry) =>
      !collectionId ||
      entry.collections.some((collection) => collection.id === collectionId),
  );
  if (!rawQuery.trim()) return catalog;
  if (!terms.length) return [];

  return catalog
    .map((recipe) => {
      const indexed = searchIndex.find((entry) => entry.id === recipe.id)!;
      const scores = terms.map((term) =>
        Math.max(
          0,
          ...indexed.fields.map(
            (field) =>
              Math.max(
                0,
                ...field.tokens.map((token) => matchWord(term, token)),
              ) * field.weight,
          ),
        ),
      );
      const score = scores.every((value) => value > 0)
        ? scores.reduce((sum, value) => sum + value, 0) +
          (indexed.titles.includes(query) ? 200 : 0)
        : 0;
      return { recipe, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.recipe);
}
