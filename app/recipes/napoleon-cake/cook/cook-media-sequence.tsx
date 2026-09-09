import Image from 'next/image';
import type { CookMediaItem } from './cook-mode.data';
import styles from './cook-mode.module.css';

export function CookMediaSequence({ items }: { items: CookMediaItem[] }) {
  return (
    <div className={styles.mediaSequence} aria-label="Step visual sequence">
      {items.map((item, index) => (
        <figure key={item.src}>
          <div>
            <Image src={item.src} alt={item.alt} fill sizes="(min-width: 1000px) 28vw, 82vw" />
            <span>{String(index + 1).padStart(2, '0')}</span>
          </div>
          <figcaption><strong>{item.title}</strong>{item.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
