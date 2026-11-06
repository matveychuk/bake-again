'use client';
import Image from 'next/image';
import type { AppLocale } from '@/lib/i18n/config';
import type { RecipeLessonLink as LinkData } from '@/content/commerce/recipe-lesson-links';
import { trackEvent } from '@/lib/analytics/umami';
import styles from './recipe-lesson.module.css';

export function RecipeLessonLink({
  link,
  locale,
  cook = false,
}: {
  link: LinkData;
  locale: AppLocale;
  cook?: boolean;
}) {
  const track = () =>
    trackEvent('lesson_step_link_click', {
      recipeId: link.recipeId,
      lessonStepId: link.lessonStepId,
      locale,
    });
  return (
    <a
      className={styles.stepLink}
      href={link.href}
      target={cook ? '_blank' : undefined}
      rel={cook ? 'noopener' : undefined}
      onClick={track}
      onAuxClick={(event) => {
        if (event.button === 1) track();
      }}
    >
      {link.thumbnail && (
        <Image
          src={link.thumbnail}
          alt=""
          loading="lazy"
          width={64}
          height={48}
        />
      )}
      <span>{link.text}</span>
    </a>
  );
}
