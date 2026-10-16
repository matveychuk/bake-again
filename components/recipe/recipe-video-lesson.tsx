'use client';

import { useId } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import {
  canBuyVideoLesson,
  type VideoLesson,
} from '@/content/commerce/video-lessons';
import { EditorialInvitation } from '@/components/site/editorial-invitation';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics/umami';

const copy = {
  uk: {
    title: 'Розширений відеоурок',
    planned:
      'Готуємо детальний відеоурок до цього рецепта. Тут можна буде придбати його, коли він буде готовий.',
    available:
      'Подивіться приготування крок за кроком у відеоуроці до цього рецепта.',
    scope:
      'Відео показує базову версію рецепта. Перерахунок кількостей або заміни на цій сторінці його не змінюють.',
    language: 'Мова відео',
    languages: { uk: 'українська', en: 'англійська', es: 'іспанська' },
    soon: 'У підготовці',
    buy: 'Купити відеоурок',
    delivery:
      'Оплата й доступ до уроку — на Payhip. Обліковий запис Bake Again не потрібен.',
    preview: 'Приклад дизайну. Купівля недоступна.',
  },
  en: {
    title: 'Extended video lesson',
    planned:
      'We are preparing a detailed video lesson for this recipe. You will be able to buy it here when it is ready.',
    available:
      'Watch this recipe being made step by step in a detailed video lesson.',
    scope:
      'The video follows the base recipe. Scaling or substitutions on this page do not change the lesson.',
    language: 'Video language',
    languages: { uk: 'Ukrainian', en: 'English', es: 'Spanish' },
    soon: 'In preparation',
    buy: 'Buy video lesson',
    delivery:
      'Payment and lesson access are on Payhip. No Bake Again account is required.',
    preview: 'Design preview. Purchasing is unavailable.',
  },
  es: {
    title: 'Videoclase ampliada',
    planned:
      'Estamos preparando una videoclase detallada de esta receta. Podrás comprarla aquí cuando esté lista.',
    available:
      'Mira cómo se prepara esta receta paso a paso en una videoclase detallada.',
    scope:
      'El vídeo sigue la receta base. Los cambios de cantidades o ingredientes en esta página no modifican la clase.',
    language: 'Idioma del vídeo',
    languages: { uk: 'ucraniano', en: 'inglés', es: 'español' },
    soon: 'En preparación',
    buy: 'Comprar videoclase',
    delivery:
      'El pago y el acceso a la clase se gestionan en Payhip. No necesitas una cuenta de Bake Again.',
    preview: 'Vista previa del diseño. La compra no está disponible.',
  },
};

export function RecipeVideoLesson({
  lesson,
  locale,
  preview = false,
}: {
  lesson: VideoLesson;
  locale: AppLocale;
  preview?: boolean;
}) {
  const titleId = useId();
  const c = copy[locale];
  if (
    lesson.status === 'withdrawn' ||
    (lesson.status === 'available' && !canBuyVideoLesson(lesson))
  )
    return null;
  const available = canBuyVideoLesson(lesson);
  const price = available
    ? new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: lesson.currency,
      }).format(lesson.priceMinor / 100)
    : '';
  const action = (
    <>
      {c.buy} · {price}
      <ArrowUpRight aria-hidden="true" size={16} />
    </>
  );
  const track = () =>
    trackEvent('video_lesson_open', {
      recipe_id: lesson.recipeId,
      product_id: lesson.id,
      locale,
    });
  return (
    <EditorialInvitation
      id={preview ? undefined : 'video-lesson'}
      lang={locale}
      titleId={titleId}
      title={c.title}
      description={available ? c.available : c.planned}
      data-video-lesson={lesson.status}
      note={
        available ? (
          <>
            {c.language}: {c.languages[lesson.language]}. {c.scope}
          </>
        ) : undefined
      }
      action={
        available ? (
          <>
            {preview ? (
              <Button disabled>{action}</Button>
            ) : (
              <Button
                href={lesson.payhipUrl}
                rel="noreferrer"
                onClick={track}
                onAuxClick={(event) => {
                  if (event.button === 1) track();
                }}
              >
                {action}
              </Button>
            )}
            <small>{preview ? c.preview : c.delivery}</small>
          </>
        ) : (
          <Button disabled>{c.soon}</Button>
        )
      }
    />
  );
}
