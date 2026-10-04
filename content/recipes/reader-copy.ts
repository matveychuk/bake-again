import type { AppLocale } from '../../lib/i18n/config.ts';

/** Localized labels for recipe reading, navigation and the focused cooking entry. */
export const recipeReaderCopy = {
  uk: {
    quantity: 'Кількість',
    compareCreams: 'Порівняти креми',
    hideCreamDetails: 'Згорнути подробиці',
    base: 'Базовий рецепт',
    method: 'Приготування',
    cookMode: 'Режим приготування',
    onThisPage: 'Розділи рецепта',
    toIngredients: 'До інгредієнтів',
    toSteps: 'До кроків',
    cookStepByStep: 'Готувати покроково',
    cookModeDescription:
      'У режимі приготування — один крок на екрані, інгредієнти й таймери під рукою.',
    recipeParts: 'Складові рецепта',
    fractionalEggs:
      'Кількість яєць дробова — відміряйте потрібну частину збитого яйця.',
  },
  en: {
    quantity: 'Quantity',
    compareCreams: 'Compare creams',
    hideCreamDetails: 'Hide details',
    base: 'Base recipe',
    method: 'Method',
    cookMode: 'Cook Mode',
    onThisPage: 'Recipe sections',
    toIngredients: 'Jump to ingredients',
    toSteps: 'Jump to steps',
    cookStepByStep: 'Cook step by step',
    cookModeDescription:
      'Cook Mode shows one step at a time, with ingredients and timers close at hand.',
    recipeParts: 'Recipe components',
    fractionalEggs:
      'The egg quantity is fractional — measure the required portion of a beaten egg.',
  },
  es: {
    quantity: 'Cantidad',
    compareCreams: 'Comparar cremas',
    hideCreamDetails: 'Ocultar detalles',
    base: 'Receta base',
    method: 'Preparación',
    cookMode: 'Modo de cocina',
    onThisPage: 'Secciones de la receta',
    toIngredients: 'Ir a los ingredientes',
    toSteps: 'Ir a los pasos',
    cookStepByStep: 'Cocinar paso a paso',
    cookModeDescription:
      'El modo de cocina muestra un paso a la vez, con ingredientes y temporizadores a mano.',
    recipeParts: 'Componentes de la receta',
    fractionalEggs:
      'La cantidad de huevos es fraccionaria: mide la porción necesaria de un huevo batido.',
  },
} satisfies Record<AppLocale, Record<string, string>>;
