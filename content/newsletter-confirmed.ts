import type { AppLocale } from '../lib/i18n/config.ts';

/** Service page for hosted Brevo redirects and legacy confirmation links. */
export const newsletterConfirmedContent: Record<
  AppLocale,
  {
    metaTitle: string;
    title: string;
    body: string;
    gift?: string;
    recipesTitle: string;
    allRecipes: string;
  }
> = {
  uk: {
    metaTitle: 'Дякуємо за підписку — Bake Again',
    title: 'Дякуємо за підписку',
    body: 'Підтверджувати email окремим листом не потрібно. Якщо ти щойно залишила чи залишив запит на матеріал, шукай його в пошті за кілька хвилин.',
    recipesTitle: 'Що спекти наступного разу',
    allRecipes: 'Усі рецепти',
  },
  es: {
    metaTitle: 'Gracias por suscribirte — Bake Again',
    title: 'Gracias por suscribirte',
    body: 'No necesitas confirmar el correo. Si acabas de solicitar un material, búscalo en tu bandeja de entrada en unos minutos.',
    recipesTitle: 'Qué hornear la próxima vez',
    allRecipes: 'Todas las recetas',
  },
  en: {
    metaTitle: 'Thank you for subscribing — Bake Again',
    title: 'Thank you for subscribing',
    body: 'No confirmation email is needed. If you just requested a resource, look for it in your inbox in a few minutes.',
    recipesTitle: 'What to bake next',
    allRecipes: 'All recipes',
  },
};
