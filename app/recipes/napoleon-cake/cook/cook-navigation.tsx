import { Button } from '@/components/ui/button';
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
      <Button
        variant="outline"
        size="lg"
        type="button"
        onClick={onPrevious}
        disabled={isFirst}
      >
        <ChevronLeft aria-hidden="true" size={18} /> {messages.previous}
      </Button>
      <Button
        variant="default"
        size="lg"
        type="button"
        onClick={onCompleteAndNext}
      >
        {isLast || !isComplete ? <Check aria-hidden="true" size={18} /> : null}
        {primaryLabel}
        {!isLast && <ChevronRight aria-hidden="true" size={18} />}
      </Button>
    </nav>
  );
}
