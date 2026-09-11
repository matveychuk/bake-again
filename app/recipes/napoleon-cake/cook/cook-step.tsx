import { CheckCircle2, Lightbulb } from 'lucide-react';
import { AssistantTrigger } from '@/components/assistant';
import { assistantMessages } from '@/components/assistant/assistant.messages';
import type { AssistantConfiguration } from '@/lib/assistant/contracts';
import type { AppLocale } from '@/lib/i18n/config';
import type { CookStep as CookStepData } from './cook-mode.data';
import { CookMediaSequence } from './cook-media-sequence';
import { CookTimer } from './cook-timer';
import styles from './cook-mode.module.css';

type CookStepProps = {
  step: CookStepData;
  stepIndex: number;
  totalSteps: number;
  progress: number;
  remaining: number;
  timerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  assistant?: {
    configuration: AssistantConfiguration;
    locale: AppLocale;
  };
};

export function CookStep({
  step,
  stepIndex,
  totalSteps,
  progress,
  remaining,
  timerRunning,
  onToggleTimer,
  onResetTimer,
  assistant,
}: CookStepProps) {
  return (
    <article className={styles.step} aria-live="polite">
      <div className={styles.mobileProgress}><span>Step {stepIndex + 1} of {totalSteps}</span><span>{progress}%</span></div>
      <p className={styles.meta}>{step.meta}</p>
      <h1>{step.title}</h1>

      {step.tip && (
        <aside className={styles.leadTip}>
          <Lightbulb size={19} />
          <strong>Tip</strong>
          <span>{step.tip}</span>
        </aside>
      )}

      <p className={styles.instruction}>{step.body}</p>

      {step.ingredients.length > 0 && (
        <section className={styles.ingredientStrip} aria-label="Ingredients used in this step">
          <p>For this step</p>
          <strong>{step.ingredients.join(', ')}</strong>
        </section>
      )}

      {step.checkpoint && (
        <aside className={styles.checkpoint}>
          <CheckCircle2 size={19} />
          <p><strong>Checkpoint</strong>{step.checkpoint}</p>
        </aside>
      )}

      {step.timerSeconds && (
        <CookTimer
          remaining={remaining}
          running={timerRunning}
          onToggle={onToggleTimer}
          onReset={onResetTimer}
        />
      )}

      {step.media && <CookMediaSequence items={step.media} />}

      {assistant && (
        <AssistantTrigger
          className={styles.ask}
          configuration={assistant.configuration}
          label={assistantMessages[assistant.locale].trigger.step}
          scope={{ kind: 'step', stepIds: step.stepIds }}
          stepTitle={step.title}
        />
      )}
    </article>
  );
}
