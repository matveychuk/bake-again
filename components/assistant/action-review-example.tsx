'use client';

import { Button } from '@/components/ui/button';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { glutenFreeNapoleonRecipe as recipe } from '@/content/recipes/gluten-free-napoleon.recipe';
import {
  createActionProposal,
  resolveActionReview,
} from '@/lib/assistant/actions';
import type { ActionChoices } from '@/lib/assistant/action-contract';
import type { AppLocale } from '@/lib/i18n/config';
import { ActionReviewContent } from './action-review';
import { actionMessages } from './action.messages';
import styles from './action-review.module.css';

/** Design Lab only. Exercises the real review body/dialog without server, model,
 * navigation, publication overrides or persistence effects.
 */
export function ActionReviewExample() {
  const [locale, setLocale] = useState<AppLocale>('uk');
  const [open, setOpen] = useState(false);
  const [choices, setChoices] = useState<ActionChoices>({});
  const [result, setResult] = useState('');
  const proposal = createActionProposal(
    {
      schemaVersion: 1,
      recipeId: recipe.id,
      recipeVersionId: recipe.versionId,
      locale,
      surface: 'recipe-detail',
      scope: { kind: 'recipe' },
      configuration: {
        kind: 'adjusted',
        geometryId: recipe.geometry.default.id,
        quantityAdjustment: { mode: 'batchScale', factor: 1 },
      },
      question: 'Preview',
      history: [],
    },
    'add-shopping-items',
    'design-lab',
  );
  proposal.ingredientLineIds = recipe.ingredientSections[0].lines
    .filter(
      (line) =>
        line.id === recipe.flourConfiguration.commercialMixLineId ||
        line.options.length > 1,
    )
    .map((line) => line.id);
  const review = resolveActionReview(proposal);
  const messages = actionMessages[locale];
  const complete = review.lines.every(
    (line) => line.options.length === 1 || choices[line.ingredientLineId],
  );
  return (
    <div>
      <p>Design Lab preview only. No shopping data is changed.</p>
      <fieldset className={styles.footer} aria-label="Preview language">
        {(['en', 'es', 'uk'] as const).map((value) => (
          <Button
            variant="outline"
            className={styles.button}
            type="button"
            aria-pressed={locale === value}
            key={value}
            onClick={() => setLocale(value)}
          >
            {value === 'en'
              ? 'English'
              : value === 'es'
                ? 'Español'
                : 'Українська'}
          </Button>
        ))}
      </fieldset>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) {
            setChoices({});
            setResult('');
          }
        }}
      >
        <DialogTrigger
          render={<Button variant="outline" />}
          className={styles.button}
        >
          {messages.review}
        </DialogTrigger>
        <DialogContent className={styles.dialog} showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{messages.title}</DialogTitle>
            <DialogDescription>
              Design Lab · {messages.suggestion}
            </DialogDescription>
          </DialogHeader>
          <ActionReviewContent
            review={review}
            choices={choices}
            onChoice={(id, ingredientId) =>
              setChoices((current) => ({ ...current, [id]: ingredientId }))
            }
          />
          <div className={styles.footer}>
            <Button
              type="button"
              variant="outline"
              className={styles.button}
              onClick={() => {
                setOpen(false);
                setResult(messages.cancelled);
              }}
            >
              {messages.cancel}
            </Button>
            <Button
              type="button"
              className={styles.button}
              disabled={!complete}
              onClick={() => {
                setOpen(false);
                setResult('Preview confirmed. No data changed.');
              }}
            >
              {messages.confirm}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <output>{result}</output>
    </div>
  );
}
