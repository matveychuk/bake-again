import { Check, Lightbulb } from 'lucide-react';
import { AssistantTrigger } from './recipe-assistant';
import styles from './recipe.module.css';

type StepTipProps = {
  meta: string;
  title: string;
  body: string;
  tips: string[];
  guidance?: string;
};

export function StepTip({ meta, title, body, tips, guidance }: StepTipProps) {
  const label = tips.length === 1 ? 'Tip' : `${tips.length} tips`;

  return (
    <div>
      <p className={styles.stepMeta}>{meta}</p>
      <div className={styles.stepTitleRow}>
        <h3>{title}</h3>
        <div className={styles.stepTipTitleNote}>
          <span><Lightbulb size={16} strokeWidth={2.1} /><strong>{label}</strong></span>
          <p>{tips.join(' · ')}</p>
        </div>
      </div>
      <p>{body}</p>
      {guidance && <aside className={`${styles.stepCallout} ${styles.stepCheckpoint}`}><Check size={15} /><p><strong>Checkpoint</strong>{guidance}</p></aside>}
      <AssistantTrigger scope="step" stepTitle={title} label="Ask about this step" compact />
    </div>
  );
}
