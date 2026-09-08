'use client';

import { useState } from 'react';
import { Check, Lightbulb, SlidersHorizontal } from 'lucide-react';
import { AssistantTrigger } from './recipe-assistant';
import styles from './recipe.module.css';

type TipLayout = 'block' | 'title';

type StepTipReviewProps = {
  meta: string;
  title: string;
  body: string;
  tips: string[];
  guidance?: string;
};

export function StepTipReview({ meta, title, body, tips, guidance }: StepTipReviewProps) {
  const [layout, setLayout] = useState<TipLayout>('title');
  const label = tips.length === 1 ? 'Tip' : `${tips.length} tips`;

  return (
    <>
      <div>
        <p className={styles.stepMeta}>{meta}</p>
        <div className={layout === 'title' ? styles.stepTitleRow : undefined}>
          <h3>{title}</h3>
          {layout === 'title' && (
            <div className={styles.stepTipTitleNote}>
              <span><Lightbulb size={14} /><strong>{label}</strong></span>
              <p>{tips.join(' ')}</p>
            </div>
          )}
        </div>
        <p>{body}</p>
        {layout === 'block' && (
          <aside className={`${styles.stepCallout} ${styles.stepTips}`}>
            <Lightbulb size={15} />
            <div>
              <strong>{label}</strong>
              {tips.length === 1 ? <p>{tips[0]}</p> : <ul>{tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>}
            </div>
          </aside>
        )}
        {guidance && <aside className={`${styles.stepCallout} ${styles.stepCheckpoint}`}><Check size={15} /><p><strong>Checkpoint</strong>{guidance}</p></aside>}
        <AssistantTrigger scope="step" stepTitle={title} label="Ask about this step" compact />
      </div>

      <div className={styles.tipLayoutReview} aria-label="Compare tip placement">
        <div><SlidersHorizontal size={15} /><span><strong>Tip layout</strong><small>Compare placement</small></span></div>
        <button type="button" aria-pressed={layout === 'block'} onClick={() => setLayout('block')}><strong>Block</strong><small>Current</small></button>
        <button type="button" aria-pressed={layout === 'title'} onClick={() => setLayout('title')}><strong>Title line</strong><small>Recommended</small></button>
      </div>
    </>
  );
}
