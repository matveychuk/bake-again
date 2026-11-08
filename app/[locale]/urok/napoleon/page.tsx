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
  LessonIngredients,
  LessonIngredientsNavigation,
  LessonPreviewDetails,
  LessonPurchase,
  LessonPurchaseBar,
  LessonSignIn,
} from '@/components/lessons/lesson-details';
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
  const login = (await searchParams).login === '1';
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
  const buyAction = price && (
    <LessonBuy key="purchase" href={napoleonCheckoutPath} price={price} />
  );
  const steps = lessonStepSummaries();
  const freeStep = steps.find((step) => step.free);
  const recipe = offer ? getRecipe(offer.recipeId) : null;
  const lessonRecipe =
    recipe?.versionId === offer?.recipeVersionId ? recipe : null;
  const timing = lessonRecipe?.timing;
  const state = access ? 'lesson' : login ? 'login' : 'description';
  return (
    <main>
      <SiteHeader locale="uk" pathname="/uk/urok/napoleon" />
      <article className={styles.page} lang="uk" data-meta-lesson-state={state}>
        <LessonArrival access={access} />
        <LessonEvents state={state} />
        <header className={access ? undefined : styles.previewHeader}>
          {!purchaseSession && (
            <div className={styles.session}>
              <LessonSession serverEmail={email} />
            </div>
          )}
          <h1 className={styles.title} id="lesson-title" tabIndex={-1}>
            Наполеон без глютену — відеоурок
          </h1>
          {access && lessonRecipe && <LessonIngredientsNavigation />}
          {!access && freeStep && (
            <p className={styles.previewIntro}>
              Подивись крок {freeStep.n} безкоштовно
              {price && ` · решта ${steps.length - 1} — ${price}`}
            </p>
          )}
        </header>
        {unavailable && (
          <output className={styles.notice}>
            Не вдалося перевірити доступ. Онови сторінку або напиши на{' '}
            <a href="mailto:hello@bakeagain.com">hello@bakeagain.com</a>.
          </output>
        )}
        {email && !access && !unavailable && (
          <p className={styles.notice}>
            За адресою {email} покупку не знайдено. Використовуєш іншу адресу
            для покупок? Вийди й увійди з неї. Або напиши на{' '}
            <a href="mailto:hello@bakeagain.com">hello@bakeagain.com</a> —
            допоможу.
          </p>
        )}
        <LessonPlayer
          steps={steps}
          access={access}
          purchaseAction={buyAction}
          purchaseBar={
            price && (
              <LessonPurchaseBar
                key="purchase-bar"
                price={price}
                action={
                  <LessonBuy
                    href={napoleonCheckoutPath}
                    price={price}
                    compact
                  />
                }
              />
            )
          }
          afterVideo={!access && <LessonPreviewDetails key="overview" />}
        />
        {!access && <LessonPurchase action={buyAction} />}
        {access && lessonRecipe && <LessonIngredients recipe={lessonRecipe} />}
        {!access && (
          <section className={styles.faq} aria-labelledby="lesson-faq">
            <h2 id="lesson-faq">Запитання про урок</h2>
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
        )}
        {!access && (
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
        )}
      </article>
      <SiteFooter locale="uk" />
    </main>
  );
}
