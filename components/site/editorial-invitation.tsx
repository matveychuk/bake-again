import type { ComponentPropsWithRef, ReactNode } from 'react';
import { SectionTitle } from '@/components/foundations/section-title';
import styles from './editorial-invitation.module.css';

type Props = Omit<ComponentPropsWithRef<'section'>, 'title' | 'children'> & {
  titleId: string;
  title: ReactNode;
  description: string;
  note?: ReactNode;
  action: ReactNode;
  variant?:
    | 'default'
    | 'lead-magnet'
    | 'recipe-step'
    | 'product-banner'
    | 'product-banner-compact'
    | 'campaign'
    | 'recipe-video';
  subtitle?: string;
  /** Short product label above the title, e.g. format and launch month. */
  eyebrow?: string;
  headingLevel?: 1 | 2 | 3;
  image?: ReactNode;
};

/** Shared quiet invitation: newsletter, video lesson, lead magnet or the current product banner. */
export function EditorialInvitation({
  titleId,
  title,
  description,
  note,
  action,
  variant = 'default',
  headingLevel = 2,
  image,
  eyebrow,
  subtitle,
  className,
  ...props
}: Props) {
  return (
    <section
      {...props}
      className={[
        styles.section,
        variant === 'lead-magnet' && styles.leadMagnet,
        variant === 'recipe-step' && styles.recipeStep,
        (variant === 'product-banner' || variant === 'product-banner-compact') &&
          styles.productBanner,
        variant === 'product-banner-compact' && styles.productBannerCompact,
        variant === 'campaign' && styles.campaign,
        variant === 'recipe-video' && styles.recipeVideo,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby={titleId}
    >
      <div className={styles.main}>
        {image && <div className={styles.image}>{image}</div>}
        <div className={styles.copy}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <SectionTitle
            id={titleId}
            level={headingLevel}
            tabIndex={headingLevel === 1 ? -1 : undefined}
          >
            {title}
          </SectionTitle>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
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
