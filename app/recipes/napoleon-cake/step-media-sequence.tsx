import Image from 'next/image';
import styles from './recipe.module.css';

export type StepMediaItem = {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
};

export function StepMediaSequence({ items, ariaLabel = 'Step visual sequence' }: { items: StepMediaItem[]; ariaLabel?: string }) {
  return (
    <div className={styles.mediaSequence} aria-label={ariaLabel}>
      <div className={styles.sequenceView}>
        {items.map((image, index) => (
          <figure key={image.id}>
            <div>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 901px) 340px, (min-width: 561px) 52vw, 82vw"
              />
              {items.length > 1 && <span>{String(index + 1).padStart(2, '0')}</span>}
            </div>
            <figcaption><strong>{image.title}</strong>{image.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
