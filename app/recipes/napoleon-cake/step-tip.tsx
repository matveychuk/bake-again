import { Check, Lightbulb } from 'lucide-react';
import { AssistantTrigger } from './recipe-assistant';
import type { AppLocale } from '@/lib/i18n/config';
import styles from './recipe.module.css';

type StepTipProps = {
  meta: string;
  title: string;
  body: string;
  tips: string[];
  guidance?: string;
  stepIds: [string, ...string[]];
  locale: AppLocale;
};

export function StepTip({ meta, title, body, tips, guidance, stepIds, locale }: StepTipProps) {
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
      <AssistantTrigger scope="step" stepIds={stepIds} stepTitle={title} locale={locale} compact />
    </div>
  );
}
