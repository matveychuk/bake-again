'use client';
import { useEffect, useId, useRef, useState } from 'react';
import type { AppLocale } from '@/lib/i18n/config';
import {
  getFreeLessonPreview,
  freeLessonCopy,
} from '@/content/commerce/free-lesson-preview';
import { trackEvent } from '@/lib/analytics/umami';
import styles from './recipe-lesson.module.css';

type Media = NonNullable<ReturnType<typeof getFreeLessonPreview>>;
/** Native player: swapping orientation preserves position and playback intent. */
export function FreeLessonPlayer({
  media,
  locale,
  recipeId,
}: {
  media: Media;
  locale: AppLocale;
  recipeId: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const completed = useRef(false);
  const [vertical, setVertical] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(
      '(orientation: portrait) and (width < 700px)',
    );
    const update = () => setVertical(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const time = video.currentTime;
    const resume = !video.paused && !video.ended;
    const restore = () => {
      video.currentTime = Math.min(
        time,
        Number.isFinite(video.duration) ? video.duration : time,
      );
      if (resume) void video.play().catch(() => undefined);
    };
    video.addEventListener('loadedmetadata', restore, { once: true });
    video.src = vertical ? media.vertical : media.wide;
    video.load();
    return () => video.removeEventListener('loadedmetadata', restore);
  }, [vertical, media.wide, media.vertical]);
  const data = {
    recipeId,
    lessonStepId: media.stepId,
    orientation: vertical ? ('vertical' as const) : ('wide' as const),
  };
  return (
    // Captions are attached only when the author supplies the optional VTT.
    // oxlint-disable-next-line jsx-a11y/media-has-caption
    <video
      ref={ref}
      src={media.wide}
      className={styles.player}
      data-orientation={data.orientation}
      controls
      playsInline
      preload="metadata"
      poster={media.poster}
      aria-label={freeLessonCopy[locale].title}
      onPlay={() => trackEvent('lesson_free_step_play', data)}
      onTimeUpdate={(event) => {
        const v = event.currentTarget;
        if (
          !completed.current &&
          v.duration > 0 &&
          v.currentTime / v.duration >= 0.9
        ) {
          completed.current = true;
          trackEvent('lesson_free_step_complete', data);
        }
      }}
    >
      {media.captionsVtt && (
        <track
          kind="captions"
          src={media.captionsVtt}
          srcLang={locale}
          label={
            locale === 'uk'
              ? 'Українська'
              : locale === 'en'
                ? 'English'
                : 'Español'
          }
          default
        />
      )}
    </video>
  );
}
export function RecipeFreeLessonStep({
  recipeId,
  locale,
  preview = false,
}: {
  recipeId: string;
  locale: AppLocale;
  preview?: boolean;
}) {
  const titleId = useId();
  const media = getFreeLessonPreview(recipeId, locale, preview);
  const c = freeLessonCopy[locale];
  if (!media && !(preview && locale === 'uk')) return null;
  return (
    <section
      className={styles.freeStep}
      aria-labelledby={titleId}
      lang={locale}
      data-free-lesson-step
    >
      <h3 id={titleId}>{c.title}</h3>
      {media ? (
        <>
          <FreeLessonPlayer media={media} locale={locale} recipeId={recipeId} />
          <p>{c.caption}</p>
          <a
            href={`/${locale}/urok/napoleon`}
            onClick={() =>
              trackEvent('lesson_open_from_free_step', {
                recipeId,
                lessonStepId: media.stepId,
                locale,
              })
            }
          >
            {c.link}
          </a>
        </>
      ) : (
        <output>{c.pending}</output>
      )}
    </section>
  );
}
