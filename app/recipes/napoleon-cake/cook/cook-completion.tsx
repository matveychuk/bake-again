import { Button } from '@/components/ui/button';
/* oxlint-disable next/no-html-link-for-pages -- Keep recipe recovery independent of hydration. */
import { CheckCircle2, RotateCcw, Save } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import styles from './cook-mode.module.css';

export function CookCompletion({
  completedCount,
  totalSteps,
  detailHref,
  note,
  noteSaveStatus,
  onNoteChange,
  onRestart,
  locale,
}: {
  completedCount: number;
  totalSteps: number;
  detailHref: string;
  note: string;
  noteSaveStatus: 'saving' | 'saved' | 'error';
  onNoteChange: (note: string) => void;
  onRestart: () => void;
  locale: AppLocale;
}) {
  const messages = getUiMessages(locale).cook;
  return (
    <section
      className={styles.completion}
      aria-labelledby="cook-complete-title"
    >
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
      <p
        aria-live="polite"
        className={styles.noteSaveStatus}
        role={noteSaveStatus === 'error' ? 'alert' : undefined}
      >
        <Save aria-hidden="true" size={15} />
        {noteSaveStatus === 'saving'
          ? messages.noteSaving
          : noteSaveStatus === 'error'
            ? messages.noteSaveFailed
            : messages.noteSaved}
      </p>
      <p className={styles.completionNextSteps}>
        {messages.completionNextSteps}
      </p>
      <div className={styles.completionActions}>
        <a href={detailHref}>{messages.returnToRecipe}</a>
        <Button variant="default" type="button" onClick={onRestart}>
          <RotateCcw aria-hidden="true" size={17} /> {messages.cookAgain}
        </Button>
      </div>
    </section>
  );
}
