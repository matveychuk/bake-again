import { recipeLocales, type RecipeLocale } from '../../content/recipes/recipe.types.ts';

export const supportedLocales = recipeLocales;

export type AppLocale = RecipeLocale;

export const defaultLocale: AppLocale = 'uk';

export const localeMetadata: Record<
  AppLocale,
  { bcp47: string; label: string; shortLabel: string }
> = {
  en: { bcp47: 'en', label: 'English', shortLabel: 'EN' },
  es: { bcp47: 'es', label: 'Español', shortLabel: 'ES' },
  uk: { bcp47: 'uk', label: 'Українська', shortLabel: 'Укр' },
};

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return typeof value === 'string' && supportedLocales.includes(value as AppLocale);
}
