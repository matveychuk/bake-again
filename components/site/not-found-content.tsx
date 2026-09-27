import { Button } from '@/components/ui/button';
import type { AppLocale } from '@/lib/i18n/config';
import { localeHomePath } from '@/lib/i18n/routes';
import styles from '@/components/personal-state/personal-state.module.css';

export function NotFoundContent({
  locale,
  headingId = 'hero-title',
}: {
  locale: AppLocale;
  headingId?: string;
}) {
  const copy = {
    uk: [
      'Сторінку не знайдено',
      'Можливо, адреса змінилася або сторінка більше недоступна.',
      'До рецептів',
    ],
    en: [
      'Page not found',
      'The address may have changed, or this page is no longer available.',
      'Browse recipes',
    ],
    es: [
      'Página no encontrada',
      'Puede que la dirección haya cambiado o que la página ya no esté disponible.',
      'Ver recetas',
    ],
  }[locale];
  return (
    <section className={styles.page} aria-labelledby={headingId}>
      <div className={styles.heading}>
        <p>404</p>
        <h1 id={headingId} tabIndex={-1}>
          {copy[0]}
        </h1>
        <span>{copy[1]}</span>
      </div>
      <Button href={localeHomePath(locale)}>{copy[2]}</Button>
    </section>
  );
}
