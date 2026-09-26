import type { AppLocale } from '../../lib/i18n/config.ts';

/** Localized labels for recipe reading, navigation and the focused cooking entry. */
export const recipeReaderCopy = {
  uk: {
    quantity: 'Кількість',
    base: 'Базовий рецепт',
    method: 'Приготування',
    cookMode: 'Режим приготування',
    onThisPage: 'Розділи рецепта',
    toIngredients: 'До інгредієнтів',
    toSteps: 'До кроків',
    cookStepByStep: 'Готувати покроково',
    cookModeDescription:
      'Один крок на екрані, інгредієнти й таймери під рукою.',
    generatedImage: 'Згенероване зображення',
    authorImage: 'Фото авторки',
    editedAuthorImage: 'Фото авторки · змінене ШІ',
    recipeParts: 'Складові рецепта',
    fractionalEggs:
      'Кількість яєць дробова — відміряйте потрібну частину збитого яйця.',
  },
  en: {
    quantity: 'Quantity',
    base: 'Base recipe',
    method: 'Method',
    cookMode: 'Cook Mode',
    onThisPage: 'Recipe sections',
    toIngredients: 'Jump to ingredients',
    toSteps: 'Jump to steps',
    cookStepByStep: 'Cook step by step',
    cookModeDescription:
      'One step at a time, with ingredients and timers close at hand.',
    generatedImage: 'Generated image',
    authorImage: 'Author photo',
    editedAuthorImage: 'Author photo · AI-edited',
    recipeParts: 'Recipe components',
    fractionalEggs:
      'The egg quantity is fractional — measure the required portion of a beaten egg.',
  },
  es: {
    quantity: 'Cantidad',
    base: 'Receta base',
    method: 'Preparación',
    cookMode: 'Modo de cocina',
    onThisPage: 'Secciones de la receta',
    toIngredients: 'Ir a los ingredientes',
    toSteps: 'Ir a los pasos',
    cookStepByStep: 'Cocinar paso a paso',
    cookModeDescription:
      'Un paso en pantalla, con ingredientes y temporizadores a mano.',
    generatedImage: 'Imagen generada',
    authorImage: 'Foto de la autora',
    editedAuthorImage: 'Foto de la autora · editada con IA',
    recipeParts: 'Componentes de la receta',
    fractionalEggs:
      'La cantidad de huevos es fraccionaria: mide la porción necesaria de un huevo batido.',
  },
} satisfies Record<AppLocale, Record<string, string>>;
