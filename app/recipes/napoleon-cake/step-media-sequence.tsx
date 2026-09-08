import Image from 'next/image';
import styles from './recipe.module.css';

export type StepMediaItem = {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
};

export function StepMediaSequence({ items }: { items: StepMediaItem[] }) {
  return (
    <div className={styles.mediaSequence}>
      <div className={styles.mediaSequenceHeader}>
        <strong>{items.length === 1 ? 'Visual checkpoint' : `${items.length}-part visual sequence`}</strong>
        <span>Prototype media · pending author approval</span>
      </div>
      <div className={styles.sequenceView} data-count={items.length}>
        {items.map((image, index) => (
          <figure key={image.id}>
            <div>
              <Image src={image.src} alt={image.alt} fill sizes={items.length === 1 ? '(min-width: 900px) 500px, 90vw' : '(min-width: 900px) 280px, 82vw'} />
              {items.length > 1 && <span>{String(index + 1).padStart(2, '0')}</span>}
            </div>
            <figcaption><strong>{image.title}</strong>{image.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
