import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './cook-mode.module.css';

type CookNavigationProps = {
  isFirst: boolean;
  isLast: boolean;
  isComplete: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToggleComplete: () => void;
};

export function CookNavigation({
  isFirst,
  isLast,
  isComplete,
  onPrevious,
  onNext,
  onToggleComplete,
}: CookNavigationProps) {
  return (
    <>
      <div className={styles.stepActions}>
        <button type="button" onClick={onPrevious} disabled={isFirst}><ChevronLeft size={18} /> Previous</button>
        <button className={isComplete ? styles.completed : undefined} type="button" onClick={onToggleComplete}><Check size={18} />{isComplete ? 'Completed' : 'Mark step complete'}</button>
        <button type="button" onClick={onNext} disabled={isLast}>Next <ChevronRight size={18} /></button>
      </div>

      <nav className={styles.mobileBar} aria-label="Step navigation">
        <button type="button" onClick={onPrevious} disabled={isFirst} aria-label="Previous step"><ChevronLeft /></button>
        <button type="button" onClick={onToggleComplete}><Check size={18} />{isComplete ? 'Completed' : 'Complete step'}</button>
        <button type="button" onClick={onNext} disabled={isLast} aria-label="Next step"><ChevronRight /></button>
      </nav>
    </>
  );
}
