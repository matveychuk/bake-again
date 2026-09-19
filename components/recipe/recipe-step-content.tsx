import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { RecipeStepGuidance } from './recipe-step-guidance';
import styles from './recipe-step-content.module.css';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

type RecipeStepContentProps = {
  title: string;
  children: ReactNode;
  tip?: ReactNode;
  tipLabel: string;
  checkpoint?: ReactNode;
  checkpointLabel: string;
  action?: ReactNode;
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
  title,
  children,
  tip,
  tipLabel,
  checkpoint,
  checkpointLabel,
  action,
  headingLevel = 'h3',
  headingId,
  headingTabIndex,
  className,
}: RecipeStepContentProps) {
  const Heading = headingLevel;

  return (
    <div className={cn(styles.stepContent, className)}>
      <div className={styles.header}>
        <Heading id={headingId} tabIndex={headingTabIndex}>
          {title}
        </Heading>
        {action && <div className={styles.action}>{action}</div>}
      </div>

      {tip && (
        <RecipeStepGuidance kind="tip" label={tipLabel} variant="inline">
          {tip}
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
    </div>
  );
}
