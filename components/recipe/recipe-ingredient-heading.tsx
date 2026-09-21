import type { ReactNode } from 'react';
import { SectionTitle } from '@/components/foundations/section-title';
import styles from './recipe-ingredient-heading.module.css';

export function RecipeIngredientHeading({
  action,
  eyebrow,
  id = 'ingredients-title',
  title,
}: {
  action?: ReactNode;
  eyebrow?: string;
  id?: string;
  title: string;
}) {
  return (
    <div className={styles.heading}>
      <SectionTitle eyebrow={eyebrow} eyebrowClassName={styles.eyebrow} id={id}>
        {title}
      </SectionTitle>
      {action}
    </div>
  );
}
