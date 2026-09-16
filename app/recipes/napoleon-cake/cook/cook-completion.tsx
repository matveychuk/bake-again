import Link from 'next/link';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import styles from './cook-mode.module.css';

export function CookCompletion({
  completedCount,
  totalSteps,
  detailHref,
  note,
  onNoteChange,
  onRestart,
  locale,
}: {
  completedCount: number;
  totalSteps: number;
  detailHref: string;
  note: string;
  onNoteChange: (note: string) => void;
  onRestart: () => void;
  locale: AppLocale;
}) {
  const messages = getUiMessages(locale).cook;
  return (
    <section className={styles.completion} aria-labelledby="cook-complete-title">
      <CheckCircle2 aria-hidden="true" size={28} />
      <p className={styles.meta}>{messages.cookingComplete}</p>
      <h1 id="cook-complete-title">{messages.completeTitle}</h1>
      <p>{messages.completedSteps(completedCount, totalSteps)}</p>
      <label htmlFor="cook-private-note">
        <strong>{messages.privateNote}</strong>
        <span>{messages.privateNoteDescription}</span>
      </label>
      <textarea
        id="cook-private-note"
        maxLength={2000}
        value={note}
        onChange={(event) => onNoteChange(event.target.value)}
        placeholder={messages.privateNotePlaceholder}
      />
      <div className={styles.completionActions}>
        <Link href={detailHref}>{messages.returnToRecipe}</Link>
        <button type="button" onClick={onRestart}>
          <RotateCcw aria-hidden="true" size={17} /> {messages.cookAgain}
        </button>
      </div>
    </section>
  );
}
