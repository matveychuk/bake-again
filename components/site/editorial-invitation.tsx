import type { ComponentPropsWithRef, ReactNode } from 'react';
import { SectionTitle } from '@/components/foundations/section-title';
import styles from './editorial-invitation.module.css';

type Props = Omit<ComponentPropsWithRef<'section'>, 'title' | 'children'> & {
  titleId: string;
  title: string;
  description: string;
  note?: ReactNode;
  action: ReactNode;
  variant?: 'default' | 'lead-magnet';
  headingLevel?: 1 | 2;
  image?: ReactNode;
};

/** Shared quiet invitation after the recipe: newsletter or an optional video lesson. */
export function EditorialInvitation({
  titleId,
  title,
  description,
  note,
  action,
  variant = 'default',
  headingLevel = 2,
  image,
  className,
  ...props
}: Props) {
  return (
    <section
      {...props}
      className={[
        styles.section,
        variant === 'lead-magnet' && styles.leadMagnet,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby={titleId}
    >
      <div className={styles.main}>
        {image && <div className={styles.image}>{image}</div>}
        <div className={styles.copy}>
          <SectionTitle
            id={titleId}
            level={headingLevel}
            tabIndex={headingLevel === 1 ? -1 : undefined}
          >
            {title}
          </SectionTitle>
          <p>{description}</p>
          {note && variant !== 'lead-magnet' && (
            <div className={styles.note}>{note}</div>
          )}
        </div>
        {note && variant === 'lead-magnet' && (
          <div className={styles.note}>{note}</div>
        )}
        <div className={styles.action}>{action}</div>
      </div>
    </section>
  );
}
