import type { Duration, Quantity, Unit } from '../../content/recipes/recipe.types.ts';
import type { AppLocale } from './config.ts';

const localeTags: Record<AppLocale, string> = { en: 'en', es: 'es', uk: 'uk' };

const unitLabels: Record<AppLocale, Record<Unit, { one: string; other: string }>> = {
  en: {
    g: { one: 'g', other: 'g' }, ml: { one: 'ml', other: 'ml' },
    piece: { one: 'pc', other: 'pcs' }, tsp: { one: 'tsp', other: 'tsp' },
    tbsp: { one: 'tbsp', other: 'tbsp' }, packet: { one: 'packet', other: 'packets' },
    pinch: { one: 'pinch', other: 'pinches' },
  },
  es: {
    g: { one: 'g', other: 'g' }, ml: { one: 'ml', other: 'ml' },
    piece: { one: 'ud.', other: 'uds.' }, tsp: { one: 'cdta.', other: 'cdtas.' },
    tbsp: { one: 'cda.', other: 'cdas.' }, packet: { one: 'sobre', other: 'sobres' },
    pinch: { one: 'pizca', other: 'pizcas' },
  },
  uk: {
    g: { one: 'г', other: 'г' }, ml: { one: 'мл', other: 'мл' },
    piece: { one: 'шт.', other: 'шт.' }, tsp: { one: 'ч. л.', other: 'ч. л.' },
    tbsp: { one: 'ст. л.', other: 'ст. л.' }, packet: { one: 'пакет', other: 'пакетів' },
    pinch: { one: 'дрібка', other: 'дрібок' },
  },
};

const durationLabels: Record<AppLocale, Record<Duration['unit'], { one: string; other: string }>> = {
  en: { second: { one: 'sec', other: 'sec' }, minute: { one: 'min', other: 'min' }, hour: { one: 'hour', other: 'hours' } },
  es: { second: { one: 's', other: 's' }, minute: { one: 'min', other: 'min' }, hour: { one: 'h', other: 'h' } },
  uk: { second: { one: 'с', other: 'с' }, minute: { one: 'хв', other: 'хв' }, hour: { one: 'год', other: 'год' } },
};

const asNeeded: Record<AppLocale, string> = {
  en: 'As needed', es: 'Según sea necesario', uk: 'За потреби',
};

const minimumPrefix: Record<AppLocale, string> = {
  en: 'At least', es: 'Como mínimo', uk: 'Щонайменше',
};

function pluralForm(locale: AppLocale, value: number) {
  return new Intl.PluralRules(localeTags[locale]).select(value) === 'one' ? 'one' : 'other';
}

export function formatNumber(locale: AppLocale, value: number, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat(localeTags[locale], {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatUnit(locale: AppLocale, unit: Unit, value: number): string {
  return unitLabels[locale][unit][pluralForm(locale, value)];
}

export function formatQuantity(locale: AppLocale, quantity: Quantity | null): string {
  if (!quantity) return asNeeded[locale];
  if (quantity.kind === 'range') {
    return `${formatNumber(locale, quantity.min)}–${formatNumber(locale, quantity.max)} ${formatUnit(locale, quantity.unit, quantity.max)}`;
  }
  return `${formatNumber(locale, quantity.value)} ${formatUnit(locale, quantity.unit, quantity.value)}`;
}

export function formatDuration(locale: AppLocale, duration: Duration): string {
  const label = (value: number) => durationLabels[locale][duration.unit][pluralForm(locale, value)];
  if (duration.kind === 'range') {
    return `${formatNumber(locale, duration.min)}–${formatNumber(locale, duration.max)} ${label(duration.max)}`;
  }
  if (duration.kind === 'minimum') {
    return `${minimumPrefix[locale]} ${formatNumber(locale, duration.min)} ${label(duration.min)}`;
  }
  return `${formatNumber(locale, duration.value)} ${label(duration.value)}`;
}

export function formatRecipeCount(locale: AppLocale, count: number): string {
  const label = {
    en: pluralForm(locale, count) === 'one' ? 'recipe' : 'recipes',
    es: pluralForm(locale, count) === 'one' ? 'receta' : 'recetas',
    uk: pluralForm(locale, count) === 'one' ? 'рецепт' : 'рецептів',
  }[locale];
  return `${formatNumber(locale, count, 0)} ${label}`;
}
