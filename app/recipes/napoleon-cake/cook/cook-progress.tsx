import { Check, ListChecks } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import type { CookStep } from './cook-mode.data';
import styles from './cook-mode.module.css';

type CookProgressProps = {
  steps: CookStep[];
  activeIndex: number;
  completed: number[];
  totalSteps: number;
  onSelect: (index: number) => void;
  locale: AppLocale;
  variant?: 'rail' | 'drawer';
  onShowIngredients?: () => void;
};

export function CookProgress({
  steps,
  activeIndex,
  completed,
  totalSteps,
  onSelect,
  locale,
  variant = 'rail',
  onShowIngredients,
}: CookProgressProps) {
  const messages = getUiMessages(locale).cook;

  return (
    <aside
      className={variant === 'drawer' ? styles.drawerProgress : styles.rail}
      aria-label={messages.progressLabel}
    >
      <p>{messages.method}</p>
      <strong>
        {activeIndex + 1} <span>/ {totalSteps}</span>
      </strong>
      <ol>
        {steps.map((step, index) => {
          const isDone = completed.includes(index);
          return (
            <li key={step.number}>
              <button
                className={`${index === activeIndex ? styles.activeStep : ''} ${isDone ? styles.completedStep : ''}`}
                type="button"
                onClick={() => onSelect(index)}
                aria-current={index === activeIndex ? 'step' : undefined}
              >
                <span>
                  {isDone ? (
                    <Check aria-hidden="true" size={13} />
                  ) : (
                    <span className={styles.progressStepNumber}>
                      {step.number}
                    </span>
                  )}
                </span>
                {step.title}
              </button>
            </li>
          );
        })}
      </ol>
      {onShowIngredients && (
        <button
          className={styles.ingredientsAction}
          type="button"
          onClick={onShowIngredients}
        >
          <ListChecks aria-hidden="true" size={17} />
          {messages.ingredients}
        </button>
      )}
    </aside>
  );
}
