import { getRecipeContent, personalStateRecipes } from './registry.ts';
import {
  getComponentCopy,
  isReusableComponentRecipeId,
} from './recipe-component-records.ts';
import type { RecipeCatalogEntry } from './catalog.ts';
import type { AppLocale } from '../../lib/i18n/config.ts';
import { getLocalizedRecipePath } from '../../lib/i18n/routes.ts';
import type { ShoppingItemV1 } from '../../lib/persistence/shopping.ts';

/** Resolve existing stored namespaced IDs without changing persistence identities. */
export function findShoppingIngredient(
  recipeId: string,
  ingredientId: string,
  locale: AppLocale,
) {
  const content = getRecipeContent(recipeId, locale);
  const base = content?.ingredientSections
    .flatMap((section) => section.ingredients)
    .find((ingredient) => ingredient.id === ingredientId);
  if (base) return base;
  for (const creamId of content?.creamOptions?.recipeIds ?? []) {
    const prefix = `cream-${creamId}-`;
    if (!ingredientId.startsWith(prefix)) continue;
    return getRecipeContent(creamId, locale)
      ?.ingredientSections.flatMap((section) => section.ingredients)
      .find(
        (ingredient) => ingredient.id === ingredientId.slice(prefix.length),
      );
  }
  return undefined;
}

export function ingredientName(item: ShoppingItemV1, locale: AppLocale) {
  for (const recipe of personalStateRecipes)
    for (const section of recipe.ingredientSections)
      for (const line of section.lines)
        for (const option of line.options)
          if (option.ingredientId === item.ingredientId)
            return option.name[locale];
  for (const source of item.sources) {
    const ingredient = findShoppingIngredient(
      source.recipeId,
      item.ingredientId,
      locale,
    );
    if (ingredient) return ingredient.name;
  }
  return item.ingredientId;
}

export function sourceRecipes(
  item: ShoppingItemV1,
  locale: AppLocale,
  catalog: RecipeCatalogEntry[],
) {
  return [...new Set(item.sources.map((source) => source.recipeId))].map(
    (recipeId) => ({
      id: recipeId,
      title:
        personalStateRecipes.find((recipe) => recipe.id === recipeId)?.title[
          locale
        ] ??
        catalog.find((recipe) => recipe.id === recipeId)?.title ??
        (isReusableComponentRecipeId(recipeId)
          ? getComponentCopy(recipeId, locale).title
          : recipeId),
      href: getLocalizedRecipePath(recipeId, locale),
    }),
  );
}

export function itemNotes(item: ShoppingItemV1, locale: AppLocale) {
  const notes = item.sources.flatMap((source) => {
    const recipe = personalStateRecipes.find(
      (candidate) => candidate.id === source.recipeId,
    );
    const line = recipe?.ingredientSections
      .flatMap((section) => section.lines)
      .find((candidate) => candidate.id === source.ingredientLineId);
    if (line)
      return [line.condition?.[locale], line.qualifier?.[locale]].filter(
        (note): note is string => Boolean(note),
      );
    const ingredient = findShoppingIngredient(
      source.recipeId,
      source.ingredientLineId,
      locale,
    );
    return ingredient?.note ? [ingredient.note] : [];
  });
  return [...new Set(notes)];
}
