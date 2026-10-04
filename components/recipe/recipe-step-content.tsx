import type { ReactNode } from 'react';
import type { TechniqueReference } from '@/content/techniques/types';
import type { AppLocale } from '@/lib/i18n/config';
import { TechniqueHelp } from '@/components/techniques/technique-help';
import { cn } from '@/lib/utils';
import { RecipeStepGuidance } from './recipe-step-guidance';
import styles from './recipe-step-content.module.css';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

type RecipeStepContentProps = {
  technique?: TechniqueReference;
  locale?: AppLocale;
  title: string;
  children: ReactNode;
  tip?: ReactNode;
  tipLabel: string;
  checkpoint?: ReactNode;
  checkpointLabel: string;
  action?: ReactNode;
  actionPlacement?: 'header' | 'after-content' | 'metadata';
  stepNumber?: string;
  meta?: string;
  headingLevel?: HeadingLevel;
  headingId?: string;
  headingTabIndex?: number;
  className?: string;
};

/**
 * Shared reading order for a method step on recipe detail and in Cook Mode.
 * Guidance that helps perform the action comes before the instruction; the
 * observable completion cue follows it.
 */
export function RecipeStepContent({
  technique,
  locale = 'en',
  title,
  children,
  tip,
  tipLabel,
  checkpoint,
  checkpointLabel,
  action,
  actionPlacement = 'header',
  stepNumber,
  meta,
  headingLevel = 'h3',
  headingId,
  headingTabIndex,
  className,
}: RecipeStepContentProps) {
  const Heading = headingLevel;
  const hasMetadata = Boolean(
    meta || (action && actionPlacement === 'metadata'),
  );

  return (
    <div
      className={cn(
        styles.stepContent,
        stepNumber && styles.numbered,
        stepNumber && hasMetadata && styles.withMetadata,
        stepNumber && meta && styles.withTime,
        stepNumber &&
          action &&
          actionPlacement === 'metadata' &&
          styles.withMetadataAction,
        className,
      )}
    >
      {stepNumber && <span className={styles.number}>{stepNumber}</span>}
      {hasMetadata && (
        <div className={styles.metadata} data-recipe-step-metadata>
          {meta && <p className={styles.meta}>{meta}</p>}
          {action && actionPlacement === 'metadata' && (
            <div className={styles.metadataAction}>{action}</div>
          )}
        </div>
      )}
      <div className={styles.header} data-recipe-step-header>
        <Heading id={headingId} tabIndex={headingTabIndex}>
          {title}
        </Heading>
        {action && actionPlacement === 'header' && (
          <div className={styles.action}>{action}</div>
        )}
      </div>

      {(tip || technique) && (
        <RecipeStepGuidance kind="tip" label={tipLabel} variant="inline">
          {tip}
          {tip && technique && <br />}
          {technique && <TechniqueHelp locale={locale} reference={technique} />}
        </RecipeStepGuidance>
      )}

      <div className={styles.body} data-recipe-step-body>
        {children}
      </div>

      {checkpoint && (
        <RecipeStepGuidance kind="checkpoint" label={checkpointLabel}>
          {checkpoint}
        </RecipeStepGuidance>
      )}

      {action && actionPlacement === 'after-content' && (
        <div className={styles.footerAction}>{action}</div>
      )}
    </div>
  );
}
