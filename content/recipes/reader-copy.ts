import type { AppLocale } from '../../lib/i18n/config.ts';

/** Short labels for the opt-in, edited recipe reading layout. */
export const recipeReaderCopy = {
  uk: {
    quantity: 'Кількість',
    base: 'Базовий рецепт',
    method: 'Приготування',
    cookMode: 'Режим приготування',
    generatedImage: 'Згенероване зображення',
    authorImage: 'Фото авторки',
    editedAuthorImage: 'Фото авторки · фон і тарілка змінені ШІ',
    recipeParts: 'Складові рецепта',
    fractionalEggs:
      'Кількість яєць дробова — відміряйте потрібну частину збитого яйця.',
  },
  en: {
    quantity: 'Quantity',
    base: 'Base recipe',
    method: 'Method',
    cookMode: 'Cook Mode',
    generatedImage: 'Generated image',
    authorImage: 'Author photo',
    editedAuthorImage: 'Author photo · AI-edited background and plate',
    recipeParts: 'Recipe components',
    fractionalEggs:
      'The egg quantity is fractional — measure the required portion of a beaten egg.',
  },
  es: {
    quantity: 'Cantidad',
    base: 'Receta base',
    method: 'Preparación',
    cookMode: 'Modo de cocina',
    generatedImage: 'Imagen generada',
    authorImage: 'Foto de la autora',
    editedAuthorImage: 'Foto de la autora · fondo y plato editados con IA',
    recipeParts: 'Componentes de la receta',
    fractionalEggs:
      'La cantidad de huevos es fraccionaria: mide la porción necesaria de un huevo batido.',
  },
} satisfies Record<AppLocale, Record<string, string>>;
