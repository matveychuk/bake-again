/* oxlint-disable next/no-html-link-for-pages -- native navigation matches the shared site shell */
import { LessonArrival } from '@/components/lessons/lesson-arrival';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { Button } from '@/components/ui/button';
import { LessonPlayer } from '@/components/lessons/lesson-player';
import {
  LessonBuy,
  LessonEvents,
  LessonLogin,
  LessonSession,
} from '@/components/lessons/lesson-access';
import {
  napoleonLesson,
  lessonStepSummaries,
} from '@/content/commerce/lessons/napoleon';
import {
  videoLessons,
  canBuyVideoLesson,
} from '@/content/commerce/video-lessons';
import {
  lessonBindings,
  lessonCookie,
  verifiedReader,
  hasLessonAccess,
} from '@/lib/lessons/server';
import styles from '@/components/lessons/lesson.module.css';
export const dynamic = 'force-dynamic';
const lead =
  '13 коротких кроків — від тіста до першого шматка. Покажу, яким має бути тісто, як складати конвертом і розкачувати, як корж здувається в духовці й як густішає крем. Те, що в рецепті не опишеш словами.';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if ((await params).locale !== 'uk') return {};
  return {
    title: 'Відеоурок «Наполеон без глютену» — 13 кроків | Bake Again',
    description: lead,
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
  const available = offer && canBuyVideoLesson(offer) ? offer : null;
  const steps = lessonStepSummaries();
  const durationMinutes = Math.round(
    steps.reduce((seconds, step) => seconds + step.durationSec, 0) / 60,
  );
  const state = access ? 'lesson' : login ? 'login' : 'description';
  return (
    <main>
      <SiteHeader locale="uk" pathname="/uk/urok/napoleon" />
      <article className={styles.page} lang="uk" data-meta-lesson-state={state}>
        <LessonArrival access={access} />
        <LessonEvents state={state} />
        <header className={styles.header}>
          <a href="/uk/recipes/bezghliutenovyi-napoleon">‹ До рецепта</a>
          {!purchaseSession && <LessonSession serverEmail={email} />}
        </header>
        <h1 className={styles.title} id="lesson-title">
          Наполеон без глютену — відеоурок
        </h1>
        {!access && (
          <>
            <p className={styles.lead}>{lead}</p>
            <ul className={styles.facts}>
              <li>{steps.length} кроків · ~{durationMinutes} хв відео</li>
              <li>Телефон, планшет, ноутбук</li>
              <li>Рецепт на Schär Mix B</li>
              <li>Доступ без обмеження в часі</li>
            </ul>
          </>
        )}
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
        <LessonPlayer steps={steps} access={access} />
        {!access && (
          <>
            <section
              className={styles.purchase}
              aria-labelledby="lesson-buy-title"
            >
              <h2 id="lesson-buy-title">Від тіста до першого шматка</h2>
              {available ? (
                <>
                  <LessonBuy
                    href="/uk/urok/napoleon/kupyty"
                    price={new Intl.NumberFormat('uk', {
                      style: 'currency',
                      currency: available.currency,
                    }).format(available.priceMinor / 100)}
                  />
                  <p>
                    Ціна включає ПДВ. Після оплати урок відкриється тут.
                    Посилання для повернення надійде на email покупки.
                  </p>
                </>
              ) : (
                <>
                  <Button disabled>Урок у підготовці</Button>
                  <p>Ціну й купівлю відкрию після перевірки уроку.</p>
                </>
              )}
            </section>
            <section className={styles.login} id="lesson-login">
              <h2>Уже маєш покупку?</h2>
              <p>Увійди за email покупки — надішлю посилання для входу.</p>
              {login ? (
                <LessonLogin
                  siteKey={
                    bindings.LESSONS_ENABLED === 'true' &&
                    typeof bindings.TURNSTILE_SITE_KEY === 'string'
                      ? bindings.TURNSTILE_SITE_KEY
                      : null
                  }
                />
              ) : (
                <Button href="?login=1#lesson-login" variant="outline">
                  Увійти за email покупки
                </Button>
              )}
            </section>
            <section className={styles.faq} aria-labelledby="lesson-faq">
              <h2 id="lesson-faq">Запитання про урок</h2>
              <details>
                <summary>Скільки часу буде доступ?</summary>
                <p>Без обмеження в часі, поки працює сайт.</p>
              </details>
              <details>
                <summary>Можна дивитися з телефона?</summary>
                <p>
                  Так. Тримаєш телефон вертикально — відео під вертикальний
                  екран, повертаєш — на весь екран.
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
          </>
        )}
      </article>
      <SiteFooter locale="uk" />
    </main>
  );
}
