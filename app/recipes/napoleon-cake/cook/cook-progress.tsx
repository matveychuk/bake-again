import { Check } from 'lucide-react';
import type { CookStep } from './cook-mode.data';
import styles from './cook-mode.module.css';

type CookProgressProps = {
  steps: CookStep[];
  activeIndex: number;
  completed: number[];
  totalSteps: number;
  onSelect: (index: number) => void;
};

export function CookProgress({ steps, activeIndex, completed, totalSteps, onSelect }: CookProgressProps) {
  return (
    <aside className={styles.rail} aria-label="Cook Mode progress">
      <p>Method</p>
      <strong>{activeIndex + 1} <span>/ {totalSteps}</span></strong>
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
                <span>{isDone ? <Check size={13} /> : step.number}</span>{step.title}
              </button>
            </li>
          );
        })}
      </ol>
      <p className={styles.prototypeNote}>Previewing the first {steps.length} of {totalSteps} steps</p>
    </aside>
  );
}
