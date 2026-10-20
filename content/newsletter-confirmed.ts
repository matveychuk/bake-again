import type { AppLocale } from '../lib/i18n/config.ts';

/** Landing page after the Brevo double opt-in link (form redirect URL). */
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
    metaTitle: 'Підписку підтверджено — Bake Again',
    title: 'Підписку підтверджено',
    body: 'Дякуємо! Вітальний лист уже в дорозі — зазвичай він приходить протягом хвилини.',
    gift: 'У ньому — подарунок для нових підписників: PDF-рецепт шоколадного торта з вишнями й бананом.',
    recipesTitle: 'Що спекти наступного разу',
    allRecipes: 'Усі рецепти',
  },
  es: {
    metaTitle: 'Suscripción confirmada — Bake Again',
    title: 'Suscripción confirmada',
    body: '¡Gracias! El correo de bienvenida ya va de camino; suele llegar en un minuto.',
    recipesTitle: 'Qué hornear la próxima vez',
    allRecipes: 'Todas las recetas',
  },
  en: {
    metaTitle: 'Subscription confirmed — Bake Again',
    title: 'Subscription confirmed',
    body: 'Thank you! Your welcome email is on its way and usually arrives within a minute.',
    recipesTitle: 'What to bake next',
    allRecipes: 'All recipes',
  },
};
