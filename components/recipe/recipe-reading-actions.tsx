/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import { Button } from '@/components/ui/button';
import { ArrowDown, Play } from 'lucide-react';
import { recipeReaderCopy } from '@/content/recipes/reader-copy';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import styles from './recipe-reading-actions.module.css';

/** The recipe's existing anchor navigation, shared with the Design Lab. */
export function RecipeSectionNavigation({
  locale,
  ingredientsHref = '#ingredients',
  methodHref = '#recipe-method',
}: {
  locale: AppLocale;
  ingredientsHref?: string;
  methodHref?: string;
}) {
  const copy = recipeReaderCopy[locale];
  return (
    <nav className={styles.navigation} aria-label={copy.onThisPage}>
      <a href={ingredientsHref}>
        <span>{copy.toIngredients}</span>
        <ArrowDown size={16} aria-hidden="true" />
      </a>
      <a href={methodHref}>
        <span>{copy.toSteps}</span>
        <ArrowDown size={16} aria-hidden="true" />
      </a>
    </nav>
  );
}

/** The existing Cook Mode entry, now placed beside the written method. */
export function RecipeCookEntry({
  locale,
  href,
  needsCream = false,
  hasMethod = true,
}: {
  locale: AppLocale;
  href: string;
  needsCream?: boolean;
  hasMethod?: boolean;
}) {
  const copy = recipeReaderCopy[locale];
  const messages = getUiMessages(locale).recipe;
  return (
    <div className={styles.cookEntry}>
      <Button variant="default" href={href}>
        {!needsCream && (
          <Play size={16} fill="currentColor" aria-hidden="true" />
        )}
        <span>
          {needsCream
            ? messages.chooseCreamBeforeCooking
            : hasMethod
              ? copy.cookStepByStep
              : messages.openCookMode}
        </span>
      </Button>
      <p>
        {hasMethod
          ? copy.cookModeDescription
          : messages.methodPendingDescription}
      </p>
    </div>
  );
}
