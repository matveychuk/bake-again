'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { randomSecret } from '@/lib/community/client';
import type { GuestReviewDraft, GuestReviewResult } from './guest-review-form';

type Receipt = {
  operationId: string;
  authorToken: string;
  id?: string;
  rating?: number;
  pendingRating?: number;
};
type Save = (draft: GuestReviewDraft) => Promise<GuestReviewResult>;

/** Keep the write capability in this tab so a lost reply or reload can reuse the same vote. */
export function useReviewRating(
  recipeId: string,
  submitReview: Save | undefined,
  challengeSiteKey: string | undefined,
  token: string | null,
  renewChallenge: () => void,
  onPublished: (() => void) | undefined,
  demo: boolean,
) {
  const key = 'bake-again:review-receipt:v1:' + recipeId;
  const receipt = useRef<Receipt | null>(null);
  const saving = useRef(false);
  const [rating, setRating] = useState<number | null>(null);
  const [status, setStatus] = useState<
    'idle' | 'queued' | 'saving' | 'saved' | 'error'
  >('idle');
  const remember = useCallback(
    (next: Receipt | null) => {
      receipt.current = next;
      if (demo) return;
      try {
        if (next) sessionStorage.setItem(key, JSON.stringify(next));
        else sessionStorage.removeItem(key);
      } catch {
        /* In-memory retries still use the same capability. */
      }
    },
    [demo, key],
  );
  useEffect(() => {
    if (demo) return;
    try {
      const entry = JSON.parse(
        sessionStorage.getItem(key) ?? 'null',
      ) as Receipt | null;
      if (!entry?.operationId || !entry.authorToken) return;
      receipt.current = entry;
      if (entry.pendingRating || (entry.id && entry.rating)) {
        // oxlint-disable-next-line react-compiler/react-compiler -- Restore this tab’s confirmed vote after hydration.
        setRating(entry.pendingRating ?? entry.rating ?? null);
        setStatus(entry.pendingRating ? 'queued' : 'saved');
      }
    } catch {
      /* No receipt to restore. */
    }
  }, [key, demo]);

  function choose(value: number) {
    if (saving.current) return;
    setRating(value);
    if (!submitReview) return;
    const owner = receipt.current ?? {
      operationId: crypto.randomUUID(),
      authorToken: randomSecret(),
    };
    remember({ ...owner, pendingRating: value });
    setStatus('queued');
  }
  useEffect(() => {
    const owner = receipt.current;
    if (
      !owner ||
      !rating ||
      !submitReview ||
      status !== 'queued' ||
      saving.current ||
      (challengeSiteKey && !token)
    )
      return;
    saving.current = true;
    // oxlint-disable-next-line react-compiler/react-compiler -- Reflect dispatch once the external verification token is ready.
    setStatus('saving');
    void submitReview({
      contribution: {
        recipeId,
        operationId: owner.operationId,
        authorToken: owner.authorToken,
        rating,
      },
      contributionId: owner.id,
      photos: [],
      token: token ?? '',
    })
      .then((result) => {
        if (!result.id) throw new Error('MISSING_RECEIPT');
        remember({ ...owner, id: result.id, rating, pendingRating: undefined });
        setStatus('saved');
        onPublished?.();
      })
      .catch(() => setStatus('error'))
      .finally(() => {
        saving.current = false;
        renewChallenge();
      });
  }, [
    rating,
    recipeId,
    status,
    challengeSiteKey,
    token,
    submitReview,
    onPublished,
    renewChallenge,
    remember,
  ]);

  function reset() {
    remember(null);
    setRating(null);
    setStatus('idle');
  }
  return { rating, choose, status, receipt, reset };
}
