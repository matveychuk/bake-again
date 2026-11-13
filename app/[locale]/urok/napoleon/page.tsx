/* oxlint-disable next/no-html-link-for-pages -- native navigation matches the shared site shell */
import { LessonArrival } from '@/components/lessons/lesson-arrival';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { LessonPlayer } from '@/components/lessons/lesson-player';
import {
  LessonBuy,
  LessonEvents,
  LessonLogin,
  LessonSession,
} from '@/components/lessons/lesson-access';
import {
  LessonAuthor,
  LessonIngredients,
  LessonIngredientsNavigation,
  LessonPreviewDetails,
  LessonPurchase,
  LessonSignIn,
} from '@/components/lessons/lesson-details';
import { LessonPreview } from '@/components/lessons/lesson-preview';
import { isKrok8Source } from '@/lib/lessons/variant';
import {
  napoleonLesson,
  lessonStepSummaries,
} from '@/content/commerce/lessons/napoleon';
import {
  videoLessons,
  canBuyVideoLesson,
  formatVideoLessonPrice,
  napoleonCheckoutPath,
} from '@/content/commerce/video-lessons';
import { getRecipe } from '@/content/recipes/registry';
import { formatElapsedMinutes } from '@/lib/i18n/format';
import {
  lessonBindings,
  lessonCookie,
  verifiedReader,
  hasLessonAccess,
} from '@/lib/lessons/server';
import styles from '@/components/lessons/lesson.module.css';
export const dynamic = 'force-dynamic';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if ((await params).locale !== 'uk') return {};
  return {
    title: 'Відеоурок «Наполеон без глютену» — 13 кроків | Bake Again',
    description:
      '13 коротких кроків: від масляної крихти й тіста до тонких шаруватих коржів і заварного крему. Крок 8 можна подивитися безкоштовно.',
    alternates: { canonical: 'https://bakeagain.com/uk/urok/napoleon' },
    referrer: 'strict-origin-when-cross-origin',
    robots: { index: true, follow: true },
  };
}
export default async function LessonRoute({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if ((await params).locale !== 'uk') notFound();
  const query = await searchParams;
  const login = query.login === '1';
  const src = typeof query.src === 'string' ? query.src : null;
  // Keep campaign attribution on the way to checkout; nothing else from the URL.
  const checkoutQuery = new URLSearchParams();
  for (const key of ['src', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
    const value = query[key];
    if (typeof value === 'string' && /^[a-zA-Z0-9_.-]{1,100}$/.test(value))
      checkoutQuery.set(key, value);
  }
  const checkoutHref = checkoutQuery.size
    ? `${napoleonCheckoutPath}?${checkoutQuery}`
    : napoleonCheckoutPath;
  const bindings = await lessonBindings();
  let email: string | null = null;
  let access = false;
  let purchaseSession = false;
  let unavailable = false;
  try {
    const reader = await verifiedReader(
      bindings,
      (await cookies()).get(lessonCookie)?.value,
    );
    if (reader) {
      purchaseSession = 'entitlementId' in reader;
      email = purchaseSession ? null : reader.email;
      access = await hasLessonAccess(reader);
    }
  } catch {
    unavailable = true;
  }
  const offer = videoLessons.find((l) => l.id === napoleonLesson.lessonId);
  const price =
    !access && offer && canBuyVideoLesson(offer)
      ? formatVideoLessonPrice(offer, 'uk')
      : null;
  const steps = lessonStepSummaries();
  const recipe = offer ? getRecipe(offer.recipeId) : null;
  const lessonRecipe =
    recipe?.versionId === offer?.recipeVersionId ? recipe : null;
  const timing = lessonRecipe?.timing;
  const state = access ? 'lesson' : login ? 'login' : 'description';
  const unavailableNotice = (
    <output className={styles.notice}>
      Не вдалося перевірити доступ. Онови сторінку або напиши на{' '}
      <a href="mailto:hello@bakeagain.com">hello@bakeagain.com</a>.
    </output>
  );
  return (
    <main>
      <SiteHeader locale="uk" pathname="/uk/urok/napoleon" />
      <article className={styles.page} lang="uk" data-meta-lesson-state={state}>
        <LessonArrival access={access} />
        {access ? (
          <>
            <LessonEvents state="lesson" />
            <header>
              {!purchaseSession && (
                <div className={styles.session}>
                  <LessonSession serverEmail={email} />
                </div>
              )}
              <h1 className={styles.title} id="lesson-title" tabIndex={-1}>
                Наполеон без глютену — відеоурок
              </h1>
              {lessonRecipe && <LessonIngredientsNavigation />}
            </header>
            {unavailable && unavailableNotice}
            <LessonPlayer steps={steps} access />
            {lessonRecipe && <LessonIngredients recipe={lessonRecipe} />}
          </>
        ) : (
          <LessonPreview
            state={state === 'login' ? 'login' : 'description'}
            serverVariant={isKrok8Source(src) ? 'krok8' : 'default'}
            source={isKrok8Source(src) ? 'krok8' : src ? 'other' : 'none'}
            steps={steps}
            price={price}
            checkoutHref={checkoutHref}
            session={!purchaseSession && <LessonSession serverEmail={email} />}
            notices={
              <>
                {unavailable && unavailableNotice}
                {email && !unavailable && (
                  <p className={styles.notice}>
                    За адресою {email} покупку не знайдено. Використовуєш іншу
                    адресу для покупок? Вийди й увійди з неї. Або напиши на{' '}
                    <a href="mailto:hello@bakeagain.com">hello@bakeagain.com</a>{' '}
                    — допоможу.
                  </p>
                )}
              </>
            }
            author={<LessonAuthor />}
            overview={<LessonPreviewDetails author={false} />}
            purchase={
              <LessonPurchase
                action={
                  price && (
                    <LessonBuy href={checkoutHref} price={price} place="bottom" />
                  )
                }
              />
            }
            faq={
          <section className={styles.faq} aria-labelledby="lesson-faq">
            <h2 id="lesson-faq">Запитання про урок</h2>
            <details>
              <summary>А якщо урок не підійде?</summary>
              <p>
                Напиши на{' '}
                <a href="mailto:hello@bakeagain.com">hello@bakeagain.com</a>{' '}
                протягом 14 днів після покупки — поверну гроші. Доступ до уроку
                після повернення закриється.
              </p>
            </details>
            <details>
              <summary>А якщо в мене інша суміш?</summary>
              <p>
                В уроці печу на Schär Mix B. Інші суміші можуть інакше вбирати
                вологу, тож для першої спроби раджу взяти саме цю.
              </p>
            </details>
            <details>
              <summary>Можна без лактози?</summary>
              <p>
                Так. Усі молочні продукти, які я використала у відеоуроці,
                безлактозні. Рецепт виходить і з безлактозними, і зі звичайними
                молочними продуктами.
              </p>
            </details>
            {timing?.activeMinutes != null && (
              <details>
                <summary>Скільки часу на весь торт?</summary>
                <p>
                  Близько {formatElapsedMinutes('uk', timing.activeMinutes)}{' '}
                  активної роботи. Додай час на охолодження тіста й зібраного
                  торта. {timing.planningNote?.text.uk}
                </p>
              </details>
            )}
            {price && (
              <details>
                <summary>Як оплатити?</summary>
                <p>
                  Натисни «Купити урок», щоб оплатити карткою на сторінці
                  Payhip. Щойно оплата підтвердиться, урок автоматично відкриється
                  на цій сторінці. На email, який вкажеш під час оплати, прийде
                  персональне посилання для входу з будь-якого пристрою. Якщо
                  воно вже не діє, натисни «Увійти за email покупки», щоб отримати
                  нове посилання.
                </p>
              </details>
            )}
            <details>
              <summary>Скільки часу буде доступ?</summary>
              <p>Без обмеження в часі, поки працює сайт.</p>
            </details>
            <details>
              <summary>Можна дивитися з телефона?</summary>
              <p>
                Так. Тримаєш телефон вертикально — відео під вертикальний екран,
                повертаєш — на весь екран.
              </p>
            </details>
            <details>
              <summary>Не прийшов лист?</summary>
              <p>
                Перевір «Промоакції» і спам. Не вдається знайти — напиши на{' '}
                <a href="mailto:hello@bakeagain.com">hello@bakeagain.com</a>.
              </p>
            </details>
          </section>
            }
            signIn={
          <LessonSignIn>
            {login && (
              <LessonLogin
                siteKey={
                  bindings.LESSONS_ENABLED === 'true' &&
                  typeof bindings.TURNSTILE_SITE_KEY === 'string'
                    ? bindings.TURNSTILE_SITE_KEY
                    : null
                }
              />
            )}
          </LessonSignIn>
            }
          />
        )}
      </article>
      <SiteFooter locale="uk" />
    </main>
  );
}
