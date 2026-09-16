import { List, ListChecks } from 'lucide-react';
import { AssistantTrigger } from '@/components/assistant';
import { assistantMessages } from '@/components/assistant/assistant.messages';
import { RecipeIngredientList } from '@/components/recipe/recipe-ingredient-list';
import { RecipeStepGuidance } from '@/components/recipe/recipe-step-guidance';
import { StepMediaSequence } from '@/components/recipe/step-media-sequence';
import type { AssistantConfiguration } from '@/lib/assistant/contracts';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import type { CookStep as CookStepData } from './cook-mode.data';
import { CookTimer } from './cook-timer';
import styles from './cook-mode.module.css';

type CookStepProps = {
  step: CookStepData;
  stepIndex: number;
  totalSteps: number;
  remaining: number;
  timerRunning: boolean;
  selectedTimerSeconds: number;
  onSelectTimerDuration: (seconds: number) => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onShowAllSteps: () => void;
  onShowIngredients: () => void;
  locale: AppLocale;
  assistant?: {
    configuration: AssistantConfiguration;
    locale: AppLocale;
  };
};

export function CookStep({
  step,
  stepIndex,
  totalSteps,
  remaining,
  timerRunning,
  selectedTimerSeconds,
  onSelectTimerDuration,
  onToggleTimer,
  onResetTimer,
  onShowAllSteps,
  onShowIngredients,
  locale,
  assistant,
}: CookStepProps) {
  const messages = getUiMessages(locale);

  return (
    <article className={styles.step}>
      <div className={styles.mobileProgress}>
        <span>{messages.cook.progress(stepIndex + 1, totalSteps)}</span>
        <button type="button" onClick={onShowAllSteps}>
          <List aria-hidden="true" size={16} /> {messages.cook.allSteps}
        </button>
        <button type="button" onClick={onShowIngredients}>
          <ListChecks aria-hidden="true" size={16} />
          {messages.cook.ingredients}
        </button>
      </div>
      {step.meta && <p className={styles.meta}>{step.meta}</p>}
      <h1 id="cook-step-title" tabIndex={-1}>
        {step.title}
      </h1>

      {step.tip && (
        <RecipeStepGuidance
          kind="tip"
          label={messages.recipe.tip}
          variant="prominent"
        >
          {step.tip}
        </RecipeStepGuidance>
      )}

      {step.instructions.length === 1 ? (
        <p className={styles.instruction}>{step.instructions[0]}</p>
      ) : (
        <ol className={styles.instructions}>
          {step.instructions.map((instruction, index) => (
            <li key={`${step.stepIds[index] ?? index}-${instruction}`}>
              <span>{index + 1}</span>
              <p>{instruction}</p>
            </li>
          ))}
        </ol>
      )}

      {step.ingredients.length > 0 && (
        <section
          className={styles.ingredientStrip}
          aria-label={messages.cook.ingredientsUsed}
        >
          <p>{messages.cook.forThisStep}</p>
          <RecipeIngredientList items={step.ingredients} variant="compact" />
        </section>
      )}

      {step.checkpoint && (
        <RecipeStepGuidance
          kind="checkpoint"
          label={messages.recipe.checkpoint}
        >
          {step.checkpoint}
        </RecipeStepGuidance>
      )}

      {step.timerSeconds && (
        <CookTimer
          remaining={remaining}
          running={timerRunning}
          options={step.timerOptionsSeconds ?? [step.timerSeconds]}
          selectedSeconds={selectedTimerSeconds}
          onSelectDuration={onSelectTimerDuration}
          onToggle={onToggleTimer}
          onReset={onResetTimer}
          locale={locale}
        />
      )}

      {step.media && (
        <StepMediaSequence
          items={step.media}
          ariaLabel={messages.recipe.stepVisualSequence}
          variant="cook"
        />
      )}

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
