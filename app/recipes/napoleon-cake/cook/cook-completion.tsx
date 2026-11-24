import { memo, useId, type ReactNode } from 'react';
import { RecipeDiscovery } from '@/components/recipe/recipe-discovery';
import { accountCopy } from '@/components/account/copy';
import { Button } from '@/components/ui/button';
/* oxlint-disable next/no-html-link-for-pages -- Keep recipe recovery independent of hydration. */
import { CheckCircle2, Save } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import styles from './cook-mode.module.css';

const CompletionDiscovery = memo(RecipeDiscovery);

export function CookCompletion({
  recipeId,
  review,
  completedCount,
  totalSteps,
  note,
  noteSaveStatus,
  isGuest = false,
  onSaveNote,
  onNoteChange,
  locale,
}: {
  recipeId: string;
  review: ReactNode;
  completedCount: number;
  totalSteps: number;
  note: string;
  noteSaveStatus: 'saving' | 'saved' | 'error';
  isGuest?: boolean;
  onSaveNote?: () => void;
  onNoteChange: (note: string) => void;
  locale: AppLocale;
}) {
  const messages = getUiMessages(locale).cook;
  const noteId = useId();
  return (
    <section
      className={styles.completion}
      aria-labelledby="cook-complete-title"
    >
      <div className={styles.completionHeading}>
        <CheckCircle2 aria-hidden="true" size={28} />
        <h1 id="cook-complete-title" tabIndex={-1}>
          {messages.completeTitle}
        </h1>
      </div>
      <p>{messages.completedSteps(completedCount, totalSteps)}</p>
      <details className={styles.noteDisclosure}>
        <summary>{messages.privateNote}</summary>
        <label htmlFor={noteId}>
          <strong className="sr-only">{messages.privateNote}</strong>
          <span>{messages.privateNoteDescription}</span>
        </label>
        <textarea
          id={noteId}
          maxLength={2000}
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder={messages.privateNotePlaceholder}
        />
        {isGuest ? (
          <Button variant="outline" type="button" onClick={onSaveNote}>
            {accountCopy[locale].saveNote}
          </Button>
        ) : null}
      </details>
      {!isGuest && (
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
      )}
      {review && <div className={styles.completionReview}>{review}</div>}
      <CompletionDiscovery
        locale={locale}
        currentRecipeId={recipeId}
        placement="cook-completion"
        catalogLinkVariant={review ? 'link' : 'default'}
      />
    </section>
  );
}
