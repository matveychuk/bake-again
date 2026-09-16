import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import styles from './cook-mode.module.css';

type CookNavigationProps = {
  isFirst: boolean;
  isLast: boolean;
  isComplete: boolean;
  onPrevious: () => void;
  onCompleteAndNext: () => void;
  locale: AppLocale;
};

export function CookNavigation({
  isFirst,
  isLast,
  isComplete,
  onPrevious,
  onCompleteAndNext,
  locale,
}: CookNavigationProps) {
  const messages = getUiMessages(locale).cook;
  const primaryLabel = isLast
    ? messages.finishCooking
    : isComplete
      ? messages.next
      : messages.completeAndNext;

  return (
    <nav className={styles.stepActions} aria-label={messages.navigationLabel}>
      <button
        className={styles.previousAction}
        type="button"
        onClick={onPrevious}
        disabled={isFirst}
      >
        <ChevronLeft aria-hidden="true" size={18} /> {messages.previous}
      </button>
      <button
        className={styles.primaryAction}
        type="button"
        onClick={onCompleteAndNext}
      >
        {isLast || !isComplete ? (
          <Check aria-hidden="true" size={18} />
        ) : null}
        {primaryLabel}
        {!isLast && <ChevronRight aria-hidden="true" size={18} />}
      </button>
    </nav>
  );
}
