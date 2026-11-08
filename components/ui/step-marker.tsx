import { Check } from 'lucide-react';
import styles from './step-marker.module.css';

export function StepMarker({
  number,
  current,
  completed,
  completedLabel,
}: {
  number: number | string;
  current: boolean;
  completed: boolean;
  completedLabel?: string;
}) {
  return (
    <span
      className={styles.marker}
      data-current={current || undefined}
      data-completed={completed || undefined}
    >
      {completed ? (
        <>
          <Check aria-hidden="true" size={13} />
          {completedLabel && (
            <span className="sr-only">
              {number}. {completedLabel}
            </span>
          )}
        </>
      ) : (
        <span className={styles.number}>{number}</span>
      )}
    </span>
  );
}
