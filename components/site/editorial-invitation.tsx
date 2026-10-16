import type { ComponentPropsWithRef, ReactNode } from 'react';
import { SectionTitle } from '@/components/foundations/section-title';
import styles from './editorial-invitation.module.css';

type Props = Omit<ComponentPropsWithRef<'section'>, 'title' | 'children'> & {
  titleId: string;
  title: string;
  description: string;
  note?: ReactNode;
  action: ReactNode;
};

/** Shared quiet invitation after the recipe: newsletter or an optional video lesson. */
export function EditorialInvitation({
  titleId,
  title,
  description,
  note,
  action,
  className,
  ...props
}: Props) {
  return (
    <section
      {...props}
      className={[styles.section, className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
    >
      <div className={styles.main}>
        <div className={styles.copy}>
          <SectionTitle id={titleId}>{title}</SectionTitle>
          <p>{description}</p>
          {note && <div className={styles.note}>{note}</div>}
        </div>
        <div className={styles.action}>{action}</div>
      </div>
    </section>
  );
}
