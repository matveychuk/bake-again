import { useEffect, useRef } from 'react';
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
  const navigationRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const navigation = navigationRef.current;
    const page = navigation?.closest('main');
    if (!navigation || !page) return;
    const update = () =>
      page.style.setProperty(
        '--cook-actions-height',
        `${navigation.getBoundingClientRect().height}px`,
      );
    update();
    const observer = new ResizeObserver(update);
    observer.observe(navigation);
    return () => {
      observer.disconnect();
      page.style.removeProperty('--cook-actions-height');
    };
  }, []);
  const messages = getUiMessages(locale).cook;
  const primaryLabel = isLast
    ? messages.finishCooking
    : isComplete
      ? messages.next
      : messages.completeAndNext;

  return (
    <nav
      ref={navigationRef}
      className={styles.stepActions}
      aria-label={messages.navigationLabel}
    >
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
