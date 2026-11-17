import type { ReactNode } from 'react';
import { SectionTitle } from '@/components/foundations/section-title';
import styles from './recipe-ingredient-heading.module.css';

export function RecipeIngredientHeading({
  action,
  compactAction = false,
  eyebrow,
  id = 'ingredients-title',
  title,
}: {
  action?: ReactNode;
  compactAction?: boolean;
  eyebrow?: string;
  id?: string;
  title: string;
}) {
  return (
    <div
      className={`${styles.heading} ${compactAction ? styles.compactAction : ''}`}
    >
      <SectionTitle eyebrow={eyebrow} eyebrowClassName={styles.eyebrow} id={id}>
        {title}
      </SectionTitle>
      {action}
    </div>
  );
}
