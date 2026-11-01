'use client';
/* oxlint-disable next/no-img-element -- reader photos are served by the review API, not the build-time optimizer */
import { useCallback, useEffect, useId, useState } from 'react';
import { Star } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import type { NewsletterSignup } from '@/lib/newsletter/config';
import type { PublicContribution } from '@/lib/community/contracts';
import { sendGuestReview } from '@/lib/community/client';
import { GuestReviewForm } from './guest-review-form';
import styles from './recipe-reviews.module.css';

const messages = {
  uk: {
    title: 'Відгуки',
    empty: 'Поки що немає відгуків. Твій може бути першим.',
    loading: 'Завантажуємо відгуки…',
    failed: 'Не вдалося завантажити відгуки.',
    average: (value: string, count: number) =>
      `${value} із 5 · ${count} ${count === 1 ? 'оцінка' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'оцінки' : 'оцінок'}`,
    rating: (value: number) => `Оцінка ${value} із 5`,
    photo: (name: string, index: number) => `Фото від ${name}, ${index}`,
  },
  es: {
    title: 'Reseñas',
    empty: 'Todavía no hay reseñas. ¡La tuya puede ser la primera!',
    loading: 'Cargando reseñas…',
    failed: 'No se pudieron cargar las reseñas.',
    average: (value: string, count: number) =>
      `${value} de 5 · ${count} ${count === 1 ? 'valoración' : 'valoraciones'}`,
    rating: (value: number) => `Valoración: ${value} de 5`,
    photo: (name: string, index: number) => `Foto de ${name}, ${index}`,
  },
  en: {
    title: 'Reviews',
    empty: 'No reviews yet. Be the first to share yours!',
    loading: 'Loading reviews…',
    failed: 'Could not load reviews.',
    average: (value: string, count: number) =>
      `${value} out of 5 · ${count} ${count === 1 ? 'rating' : 'ratings'}`,
    rating: (value: number) => `Rated ${value} out of 5`,
    photo: (name: string, index: number) => `Photo from ${name}, ${index}`,
  },
};
const photoUrl = (id: string) =>
  `/api/community/photos?id=${encodeURIComponent(id)}`;

async function fetchReviews(recipeId: string, fresh = false) {
  const response = await fetch(
    `/api/community/reviews?recipe=${encodeURIComponent(recipeId)}`,
    { cache: fresh ? 'no-store' : 'default', credentials: 'omit' },
  );
  const body = (await response.json()) as {
    ok?: boolean;
    reviews?: PublicContribution[];
  };
  if (!response.ok || !body.ok || !Array.isArray(body.reviews))
    throw new Error('UNAVAILABLE');
  return body.reviews;
}

function Stars({ value }: { value: number }) {
  return (
    <span className={styles.stars} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={16} className={n <= value ? styles.filled : ''} />
      ))}
    </span>
  );
}

/** Published reviews for one recipe (newest first, no pagination yet) + form. */
export function RecipeReviewsSection({
  recipeId,
  locale,
  challengeSiteKey,
  signup,
  preview,
}: {
  recipeId: string;
  locale: AppLocale;
  challengeSiteKey?: string;
  signup?: NewsletterSignup;
  /** Design Lab: fixture reviews (photo ids are direct image URLs); nothing is sent. */
  preview?: PublicContribution[];
}) {
  const copy = messages[locale];
  const titleId = useId();
  const [reviews, setReviews] = useState<PublicContribution[] | null>(
    preview ?? null,
  );
  const [failed, setFailed] = useState(false);
  const show = useCallback(
    (
      request: Promise<PublicContribution[]>,
      active: () => boolean = () => true,
    ) =>
      request.then(
        (list) => {
          if (!active()) return;
          setReviews(list);
          setFailed(false);
        },
        () => {
          if (active()) setFailed(true);
        },
      ),
    [],
  );
  useEffect(() => {
    if (preview) return;
    let active = true;
    void show(fetchReviews(recipeId), () => active);
    return () => {
      active = false;
    };
  }, [recipeId, show, preview]);
  const rated = (reviews ?? []).filter((review) => review.rating !== null);
  const average = rated.length
    ? new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(
        rated.reduce((sum, review) => sum + review.rating!, 0) / rated.length,
      )
    : null;
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'long' });
  return (
    <section
      className={styles.section}
      id="reviews"
      aria-labelledby={titleId}
      lang={locale}
    >
      <header className={styles.header}>
        <h2 id={titleId}>
          {copy.title}
          {reviews && reviews.length > 0 && (
            <span className={styles.count}> · {reviews.length}</span>
          )}
        </h2>
        {average && (
          <p className={styles.average}>
            <Star size={18} aria-hidden="true" className={styles.filled} />
            {copy.average(average, rated.length)}
          </p>
        )}
      </header>
      <div className={styles.layout}>
        <div className={styles.list} aria-live="polite">
          {failed && !reviews && <p className={styles.muted}>{copy.failed}</p>}
          {!failed && !reviews && (
            <p className={styles.muted}>{copy.loading}</p>
          )}
          {reviews?.length === 0 && (
            <p className={styles.muted}>{copy.empty}</p>
          )}
          {reviews && reviews.length > 0 && (
            <ol className={styles.reviews}>
              {reviews.map((review) => (
                <li key={review.id}>
                  <article className={styles.review}>
                    <header className={styles.meta}>
                      <h3>{review.name}</h3>
                      <time dateTime={review.createdAt}>
                        {date.format(new Date(review.createdAt))}
                      </time>
                    </header>
                    {review.rating !== null && (
                      <p className={styles.rating}>
                        <Stars value={review.rating} />
                        <span className={styles.visuallyHidden}>
                          {copy.rating(review.rating)}
                        </span>
                      </p>
                    )}
                    <p className={styles.text}>{review.text}</p>
                    {review.photos.length > 0 && (
                      <ul className={styles.photos}>
                        {review.photos.map((photo, index) => (
                          <li key={photo}>
                            <a
                              href={preview ? photo : photoUrl(photo)}
                              target="_blank"
                              rel="noopener"
                            >
                              <img
                                src={preview ? photo : photoUrl(photo)}
                                alt={copy.photo(review.name, index + 1)}
                                loading="lazy"
                                decoding="async"
                              />
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className={styles.formArea}>
          <GuestReviewForm
            locale={locale}
            recipeId={recipeId}
            challengeSiteKey={challengeSiteKey}
            signup={signup}
            layout="wide"
            demo={!!preview}
            submitReview={
              preview
                ? async () => {
                    await new Promise((resolve) => setTimeout(resolve, 600));
                    return { status: 'published', photosAccepted: true };
                  }
                : (draft) =>
                    sendGuestReview({
                      review: draft.contribution,
                      photos: draft.photos,
                      token: draft.token,
                    })
            }
            onPublished={() => {
              if (!preview) void show(fetchReviews(recipeId, true));
            }}
          />
        </div>
      </div>
    </section>
  );
}
