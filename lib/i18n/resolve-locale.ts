import { defaultLocale, isAppLocale, type AppLocale } from './config.ts';

type WeightedLanguage = {
  range: string;
  quality: number;
  position: number;
};

function localeFromLanguageRange(languageRange: string): AppLocale | null {
  const normalized = languageRange.trim().toLowerCase().replaceAll('_', '-');
  if (!normalized || normalized === '*') return null;

  const baseLanguage = normalized.split('-')[0];
  return isAppLocale(baseLanguage) ? baseLanguage : null;
}

function parseWeightedLanguage(value: string, position: number): WeightedLanguage | null {
  const [range, ...parameters] = value.trim().split(';');
  if (!range) return null;

  const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith('q='));
  const quality = qualityParameter ? Number(qualityParameter.trim().slice(2)) : 1;

  if (!Number.isFinite(quality) || quality <= 0) return null;

  return { range, quality, position };
}

/** Resolves a supported locale from an HTTP Accept-Language header. */
export function resolveLocaleFromAcceptLanguage(
  header: string | null | undefined,
  fallback: AppLocale = defaultLocale,
): AppLocale {
  if (!header) return fallback;

  const languages = header
    .split(',')
    .map(parseWeightedLanguage)
    .filter((language): language is WeightedLanguage => language !== null)
    .sort((left, right) => right.quality - left.quality || left.position - right.position);

  for (const language of languages) {
    const locale = localeFromLanguageRange(language.range);
    if (locale) return locale;
  }

  return fallback;
}

/** Resolves a supported locale from browser language preferences. */
export function resolveLocaleFromBrowserLanguages(
  languages: readonly string[] | null | undefined,
  fallback: AppLocale = defaultLocale,
): AppLocale {
  if (!languages) return fallback;

  for (const language of languages) {
    const locale = localeFromLanguageRange(language);
    if (locale) return locale;
  }

  return fallback;
}
