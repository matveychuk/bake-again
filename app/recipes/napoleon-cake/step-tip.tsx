import { RecipeStepGuidance } from '@/components/recipe/recipe-step-guidance';
import { AssistantTrigger } from './recipe-assistant';
import type { AppLocale } from '@/lib/i18n/config';
import styles from './recipe.module.css';

type StepTipProps = {
  title: string;
  body: string;
  tips: string[];
  guidance?: string;
  stepIds: [string, ...string[]];
  locale: AppLocale;
};

export function StepTip({
  title,
  body,
  tips,
  guidance,
  stepIds,
  locale,
}: StepTipProps) {
  const label = tips.length === 1 ? 'Tip' : `${tips.length} tips`;

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepTitleRow}>
        <h3>{title}</h3>
        <RecipeStepGuidance
          className={styles.stepTipTitleNote}
          kind="tip"
          label={label}
          variant="prominent"
        >
          {tips.join(' · ')}
        </RecipeStepGuidance>
      </div>
      <p>{body}</p>
      {guidance && (
        <RecipeStepGuidance kind="checkpoint" label="Checkpoint">
          {guidance}
        </RecipeStepGuidance>
      )}
      <AssistantTrigger
        scope="step"
        stepIds={stepIds}
        stepTitle={title}
        locale={locale}
        compact
      />
    </div>
  );
}
