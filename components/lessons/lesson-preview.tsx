'use client';
/* oxlint-disable next/no-img-element -- source image is prepared WebP through media:prepare */
import { type ReactNode, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LessonBuy, LessonEvents, lessonGuarantee } from './lesson-access';
import {
  LessonPlayer,
  LessonStepOverview,
  type StepSummary,
} from './lesson-player';
import {
  type LessonVariant,
  LessonVariantProvider,
  useLessonVariant,
} from './lesson-variant';
import { lessonVariantKey } from '@/lib/lessons/variant';
import styles from './lesson.module.css';

const cutPhoto = {
  small:
    '/media/recipes/gluten-free-napoleon/lesson-page-krok8/napoleon-rozriz-720x900.webp',
  large:
    '/media/recipes/gluten-free-napoleon/lesson-page-krok8/napoleon-rozriz-1080x1350.webp',
};

/** Cut Napoleon: the finished result, shown before the lesson offer. */
export function LessonCutPhoto({ hero = false }: { hero?: boolean }) {
  return (
    <div className={hero ? styles.cutHero : styles.cut}>
      <img
        src={cutPhoto.large}
        srcSet={`${cutPhoto.small} 720w, ${cutPhoto.large} 1080w`}
        sizes={
          hero
            ? '(min-width: 900px) 40rem, calc(100vw - 2.5rem)'
            : '(min-width: 900px) 30rem, calc(100vw - 2.5rem)'
        }
        width={1080}
        height={1350}
        alt="Наполеон без глютену на розрізі: тонкі коржі й заварний крем"
        loading={hero ? 'eager' : 'lazy'}
        fetchPriority={hero ? 'high' : undefined}
        decoding="async"
      />
    </div>
  );
}

/**
 * Mobile purchase bar. Appears once the first buy button has scrolled away,
 * hides near the bottom offer and the footer; CSS hides it while the cookie
 * banner is open and from 768 px.
 */
export function LessonStickyBuy({
  href,
  price,
  preview = false,
}: {
  href: string;
  price: string;
  preview?: boolean;
}) {
  const variant = useLessonVariant();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (preview) return;
    const hero = document.querySelector('[data-lesson-buy="hero"]');
    if (!hero) return;
    let passed = false;
    const blocking = new Set<Element>();
    const update = () => setShow(passed && blocking.size === 0);
    const heroObserver = new IntersectionObserver(([entry]) => {
      passed = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
      update();
    });
    heroObserver.observe(hero);
    const stopObserver = new IntersectionObserver((entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) blocking.add(entry.target);
        else blocking.delete(entry.target);
      update();
    });
    document
      .querySelectorAll('[data-lesson-buy="bottom"], footer')
      .forEach((element) => stopObserver.observe(element));
    return () => {
      heroObserver.disconnect();
      stopObserver.disconnect();
      setShow(false);
    };
  }, [preview, variant]);
  return (
    <aside
      aria-label="Купівля уроку"
      className={preview ? styles.stickyPreview : styles.sticky}
      data-lesson-sticky={preview ? undefined : ''}
      hidden={!preview && !show}
    >
      <span>Урок «Наполеон» · {price}</span>
      {preview ? (
        <Button disabled>Купити</Button>
      ) : (
        <LessonBuy href={href} price={price} place="sticky" compact />
      )}
    </aside>
  );
}

export function LessonPreview({
  state,
  serverVariant,
  source,
  steps,
  price,
  checkoutHref,
  session,
  notices,
  author,
  overview,
  purchase,
  faq,
  signIn,
}: {
  state: 'description' | 'login';
  serverVariant: LessonVariant;
  /** What the current URL says: a krok8 link, another campaign, or no `src`. */
  source: 'krok8' | 'other' | 'none';
  steps: StepSummary[];
  price: string | null;
  checkoutHref: string;
  session: ReactNode;
  notices: ReactNode;
  author: ReactNode;
  overview: ReactNode;
  purchase: ReactNode;
  faq: ReactNode;
  signIn: ReactNode;
}) {
  const [variant, setVariant] = useState(serverVariant);
  const [resolved, setResolved] = useState(false);
  useEffect(() => {
    let next = serverVariant;
    try {
      if (source === 'krok8') sessionStorage.setItem(lessonVariantKey, 'krok8');
      else if (source === 'other') sessionStorage.removeItem(lessonVariantKey);
      else if (sessionStorage.getItem(lessonVariantKey) === 'krok8')
        next = 'krok8';
    } catch {
      /* Without storage the URL decides. */
    }
    queueMicrotask(() => {
      setVariant(next);
      setResolved(true);
    });
  }, [serverVariant, source]);
  const freeStep = steps.find((step) => step.free);
  const krok8 = variant === 'krok8';
  const buy = (place: 'hero' | 'end') =>
    price && <LessonBuy href={checkoutHref} price={price} place={place} />;
  return (
    <LessonVariantProvider value={variant}>
      {resolved && <LessonEvents state={state} variant={variant} />}
      <header className={styles.previewHeader} data-lesson-variant={variant}>
        <div className={styles.session}>{session}</div>
        <h1 className={styles.title} id="lesson-title" tabIndex={-1}>
          Наполеон без глютену — відеоурок
        </h1>
        {freeStep && (
          <p className={styles.previewIntro}>
            {krok8 ? (
              <>
                Крок {freeStep.n} — уже позаду.
                {price &&
                  ` Решта ${steps.length - 1} — у відеоуроці за ${price}`}
              </>
            ) : (
              <>
                Подивись крок {freeStep.n} безкоштовно
                {price && ` · решта ${steps.length - 1} — ${price}`}
              </>
            )}
          </p>
        )}
      </header>
      {notices}
      {krok8 ? (
        <>
          <div className={styles.hero}>
            <LessonCutPhoto hero />
            <div className={styles.heroAside}>
              {buy('hero')}
              {author}
              <LessonStepOverview steps={steps} />
            </div>
          </div>
          <LessonPlayer
            steps={steps}
            access={false}
            purchaseAction={buy('end')}
            hideSteps
            replayHeading={freeStep && `Крок ${freeStep.n} — ще раз`}
            afterVideo={overview}
          />
        </>
      ) : (
        <>
          <LessonPlayer
            steps={steps}
            access={false}
            purchaseAction={buy('end')}
            inlinePurchase={buy('hero')}
            afterVideo={
              <>
                {author}
                {overview}
              </>
            }
          />
          <LessonCutPhoto />
        </>
      )}
      {purchase}
      {faq}
      {signIn}
      {price && <LessonStickyBuy href={checkoutHref} price={price} />}
    </LessonVariantProvider>
  );
}

/** Design Lab: an inert buy button with the guarantee line. */
export function LessonBuyPreview({ price }: { price: string }) {
  return (
    <div className={styles.buy}>
      <Button disabled>Купити урок — {price}</Button>
      <p className={styles.guarantee}>{lessonGuarantee}</p>
    </div>
  );
}
