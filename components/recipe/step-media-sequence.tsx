/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Multi-image rails must be keyboard-focusable so arrow-key scrolling is available. */
import Image from 'next/image';
import { cn } from '@/lib/utils';
import styles from './step-media-sequence.module.css';

export type StepMediaItem = {
  id: string;
  src: string;
  alt: string;
  title?: string;
  caption?: string;
};

export function StepMediaSequence({
  items,
  ariaLabel,
  className,
  variant = 'recipe',
}: {
  items: StepMediaItem[];
  ariaLabel: string;
  className?: string;
  variant?: 'recipe' | 'cook';
}) {
  return (
    <div
      className={cn(
        styles.sequence,
        variant === 'cook' && styles.cook,
        className,
      )}
    >
      <section
        className={styles.viewport}
        aria-label={ariaLabel}
        tabIndex={items.length > 1 ? 0 : undefined}
      >
        {items.map((item, index) => (
          <figure key={item.id}>
            <div className={styles.image}>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 901px) 340px, (min-width: 561px) 52vw, 82vw"
              />
              {items.length > 1 && (
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}
            </div>
            {(item.title || item.caption) && (
              <figcaption>
                {item.title && <strong>{item.title}</strong>}
                {item.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </section>
    </div>
  );
}
