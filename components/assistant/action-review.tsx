'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  EvidenceBadge,
  type EvidenceStatus,
} from '@/components/recipe/evidence-badge';
import type {
  ActionChoices,
  ActionContext,
  ActionProposal,
  ActionReview,
} from '@/lib/assistant/action-contract';
import {
  createActionController,
  revalidateAction,
  withAssistantActionLock,
} from '@/lib/assistant/action-controller';
import { ActionValidationError } from '@/lib/assistant/actions';
import { getBrowserStorage } from '@/lib/persistence/storage';
import { formatQuantity } from '@/lib/i18n/format';
import { actionMessages } from './action.messages';
import styles from './action-review.module.css';

/** Shared review body: used by the product dialog and the Design Lab. */
export function ActionReviewContent({
  review,
  choices,
  onChoice,
  disabled = false,
}: {
  review: ActionReview;
  choices: ActionChoices;
  onChoice: (lineId: string, ingredientId: string) => void;
  disabled?: boolean;
}) {
  const locale = review.proposal.context.locale;
  const messages = actionMessages[locale];
  return (
    <div className={styles.content}>
      <EvidenceBadge status="suggested" locale={locale} />
      <p>
        <strong>{review.recipeTitle}</strong> · {review.geometryLabel}
      </p>
      {review.proposal.kind === 'open-scaling' ? (
        <p>{messages.scaling}</p>
      ) : (
        <>
          {review.proposal.configurationStatus === 'Calculated' && (
            <p>{messages.calculated}</p>
          )}
          <p>{messages.duplicate}</p>
          {review.lines.map((line) => (
            <fieldset
              className={styles.line}
              key={line.ingredientLineId}
              disabled={disabled}
            >
              <legend>
                {line.options.length === 1
                  ? line.options[0].name
                  : messages.choose}
              </legend>
              <p>
                {line.quantity === null
                  ? messages.unknown
                  : formatQuantity(locale, line.quantity)}
              </p>
              {line.status && (
                <EvidenceBadge
                  status={line.status.toLowerCase() as EvidenceStatus}
                  locale={locale}
                />
              )}
              {line.hasGaps && <p>{messages.gaps}</p>}
              {line.qualifier && <p>{line.qualifier}</p>}
              {line.options.length > 1 &&
                line.options.map((option) => (
                  <label className={styles.option} key={option.ingredientId}>
                    <input
                      type="radio"
                      name={`${review.proposal.id}-${line.ingredientLineId}`}
                      checked={
                        choices[line.ingredientLineId] === option.ingredientId
                      }
                      onChange={() =>
                        onChoice(line.ingredientLineId, option.ingredientId)
                      }
                    />
                    {option.name}
                  </label>
                ))}
            </fieldset>
          ))}
        </>
      )}
      {!review.proposal.cookModeEligible && <p>{messages.blocked}</p>}
    </div>
  );
}

export function AssistantActionReview({
  proposal,
  context,
  onOpenScaling,
  returnFocus,
}: {
  proposal: ActionProposal;
  context: ActionContext;
  onOpenScaling: () => void;
  returnFocus: () => HTMLElement | null;
}) {
  const current = useRef({ context, onOpenScaling });
  useEffect(() => {
    current.current = { context, onOpenScaling };
  }, [context, onOpenScaling]);
  const [controller, setController] = useState<ReturnType<
    typeof createActionController
  > | null>(null);
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState<ActionReview | null>(null);
  const [choices, setChoices] = useState<ActionChoices>({});
  const [phase, setPhase] = useState('proposed');
  const [error, setError] = useState('');
  const messages = actionMessages[context.locale];
  useEffect(() => {
    const next = createActionController(proposal, {
      currentContext: () => current.current.context,
      revalidate: revalidateAction,
      storage: getBrowserStorage(),
      withLock: withAssistantActionLock,
      openScaling: () => current.current.onOpenScaling(),
    });
    setController(next);
    return () => {
      if (next.phase !== 'proposed') next.cancel();
    };
  }, [proposal]);
  const cancel = () => {
    controller?.cancel();
    setOpen(false);
    setPhase('cancelled');
  };
  const showError = (failure: unknown) => {
    if (controller?.phase === 'cancelled') return;
    setError(
      failure instanceof ActionValidationError &&
        (failure.code === 'STALE_RECIPE' || failure.code === 'STALE_REVIEW')
        ? messages.stale
        : messages.error,
    );
    setPhase('error');
  };
  async function startReview() {
    if (!controller) return;
    setOpen(true);
    setPhase('reviewing');
    try {
      const result = await controller.review();
      setReview(result);
      setPhase('ready');
    } catch (failure) {
      showError(failure);
    }
  }
  async function confirm() {
    if (!controller) return;
    setPhase('confirming');
    try {
      await controller.confirm(choices);
      setPhase('done');
      setOpen(false);
    } catch (failure) {
      showError(failure);
    }
  }
  const complete = review?.lines.every(
    (line) => line.options.length === 1 || choices[line.ingredientLineId],
  );
  return (
    <section className={styles.proposal} aria-label={messages.review}>
      <button
        className={styles.button}
        type="button"
        disabled={!controller || phase !== 'proposed'}
        onClick={() => void startReview()}
      >
        {messages.review}:{' '}
        {proposal.kind === 'open-scaling' ? messages.open : messages.shopping}
      </button>
      {phase === 'done' && <output>{messages.done}</output>}
      {phase === 'cancelled' && <output>{messages.cancelled}</output>}
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) cancel();
        }}
      >
        <DialogContent className={styles.dialog} showCloseButton={false} finalFocus={returnFocus}>
          <DialogHeader>
            <DialogTitle>{messages.title}</DialogTitle>
            <DialogDescription>{messages.suggestion}</DialogDescription>
          </DialogHeader>
          {(phase === 'reviewing' || phase === 'confirming') && (
            <output>{messages.loading}</output>
          )}
          {review && (
            <ActionReviewContent
              review={review}
              choices={choices}
              disabled={phase !== 'ready'}
              onChoice={(id, ingredientId) =>
                setChoices((value) => ({ ...value, [id]: ingredientId }))
              }
            />
          )}
          {error && <p role="alert">{error}</p>}
          <div className={styles.footer}>
            <button className={styles.button} type="button" onClick={cancel}>
              {messages.cancel}
            </button>
            <button
              className={`${styles.button} ${styles.primary}`}
              type="button"
              disabled={phase !== 'ready' || !complete}
              onClick={() => void confirm()}
            >
              {messages.confirm}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
