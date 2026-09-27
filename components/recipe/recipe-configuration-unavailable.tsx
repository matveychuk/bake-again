/* oxlint-disable next/no-html-link-for-pages -- Native navigation also works without hydration. */
import { CircleAlert } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import styles from '@/app/recipes/napoleon-cake/cook/cook-mode.module.css';

/** Shared blocked-configuration treatment for recipe detail and Cook Mode. */
export function RecipeConfigurationUnavailable({
  locale,
  reason,
  href,
  variant = 'cook',
  titleId: requestedTitleId,
}: {
  locale: AppLocale;
  reason: string;
  href: string;
  variant?: 'cook' | 'detail';
  titleId?: string;
}) {
  const messages = getUiMessages(locale);
  const titleId =
    requestedTitleId ??
    (variant === 'cook' ? 'cook-mode-unavailable-title' : 'recipe-content');
  return (
    <section className={styles.unavailable} aria-labelledby={titleId}>
      <CircleAlert size={24} aria-hidden="true" />
      {variant === 'cook' && (
        <p className={styles.unavailableKicker}>
          {messages.cook.unavailableKicker}
        </p>
      )}
      <h1 id={titleId} tabIndex={-1}>
        {variant === 'cook'
          ? messages.cook.unavailableTitle
          : messages.scaling.unsupportedTitle}
      </h1>
      <p>{reason}</p>
      <a href={href}>
        {variant === 'cook'
          ? messages.cook.unavailableLink
          : messages.scaling.openBaseRecipe}
      </a>
    </section>
  );
}
