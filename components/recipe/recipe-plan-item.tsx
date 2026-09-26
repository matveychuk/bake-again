import type { ReactNode } from 'react';
import { Clock3 } from 'lucide-react';
import styles from './recipe-plan-item.module.css';

export function RecipePlanItem({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <article className={styles.item}>
      <div className={styles.heading}>
        <Clock3 aria-hidden="true" size={19} />
        <strong>{label}</strong>
      </div>
      <p>{children}</p>
    </article>
  );
}
