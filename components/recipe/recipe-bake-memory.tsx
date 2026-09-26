'use client';

import { Button } from '@/components/ui/button';

import { NotebookPen } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import type { AppLocale } from '@/lib/i18n/config';
import { localeMetadata } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import {
  readLatestBakeRecord,
  subscribeToBakeMemory,
  type BakeRecordV1,
} from '@/lib/persistence/bake-memory';
import styles from './recipe-bake-memory.module.css';

export function RecipeBakeMemory({
  cookModeHref,
  locale,
  recipeId,
}: {
  cookModeHref: string;
  locale: AppLocale;
  recipeId: string;
}) {
  const [record, setRecord] = useState<BakeRecordV1 | null>(null);
  const titleId = useId();
  const messages = getUiMessages(locale);

  useEffect(() => {
    const update = () => setRecord(readLatestBakeRecord(recipeId));
    update();
    return subscribeToBakeMemory(update);
  }, [recipeId]);

  if (!record) return null;

  const date = new Intl.DateTimeFormat(localeMetadata[locale].bcp47, {
    dateStyle: 'medium',
  }).format(new Date(record.completedAt));

  return (
    <aside className={styles.memory} aria-labelledby={titleId}>
      <NotebookPen aria-hidden="true" size={22} />
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{messages.personal.bakedEyebrow}</p>
        <h2 id={titleId}>{messages.personal.bakedTitle}</h2>
        <p className={styles.meta}>
          <time dateTime={record.completedAt}>
            {messages.personal.bakedOn(date)}
          </time>
          {record.configuration.kind === 'adjusted' && (
            <span>{messages.personal.bakedAdjusted}</span>
          )}
        </p>
        {record.note && (
          <div className={styles.note}>
            <strong>{messages.personal.privateNote}</strong>
            <p>{record.note}</p>
          </div>
        )}
        <small>{messages.personal.bakedStoredInBrowser}</small>
      </div>
      <Button variant="outline" href={cookModeHref}>
        {messages.cook.cookAgain}
      </Button>
    </aside>
  );
}
