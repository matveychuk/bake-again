'use client';

import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import styles from './recipe.module.css';

const images = [
  {
    src: '/media/recipes/gluten-free-napoleon/selected/cold-butter-ready-example-v1.png',
    alt: 'Cold butter cubes beside the dry flour mixture in a food processor',
    title: 'Start cold',
    caption: 'Cube the butter and chill it for 10–15 minutes.',
  },
  {
    src: '/media/recipes/gluten-free-napoleon/selected/cold-butter-early-pulse-example-v1.png',
    alt: 'Large pieces of butter partly coated in gluten-free flour after a few pulses',
    title: 'Pulse briefly',
    caption: 'Stop before every piece of butter disappears into the flour.',
  },
  {
    src: '/media/recipes/gluten-free-napoleon/selected/cold-butter-crumb-example-v1.png',
    alt: 'Gluten-free flour mixture with a sandy crumb and visible pea-sized pieces of cold butter',
    title: 'Look for this texture',
    caption: 'Some should look sandy while pea-sized pieces remain visible.',
  },
];

type View = 'carousel' | 'strip' | 'sequence';

export function StepMediaReview() {
  const [view, setView] = useState<View>('sequence');
  const [active, setActive] = useState(2);

  return (
    <div className={styles.mediaReview}>
      <div className={styles.mediaReviewHeader}>
        <div>
          <strong>Multiple-media pattern</strong>
          <span>Visual prototype · pending author approval</span>
        </div>
        <div className={styles.mediaTabs} aria-label="Compare multiple photo layouts">
          {(['carousel', 'strip', 'sequence'] as const).map((option) => (
            <button key={option} type="button" aria-pressed={view === option} onClick={() => setView(option)}>
              {option === 'strip' ? 'Scroll strip' : option[0].toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {view === 'carousel' && (
        <div className={styles.carouselView}>
          <div className={styles.carouselImage}>
            <Image src={images[active].src} alt={images[active].alt} fill sizes="(min-width: 900px) 540px, 100vw" />
            <button type="button" aria-label="Previous image" onClick={() => setActive((active + images.length - 1) % images.length)}><ArrowLeft size={17} /></button>
            <button type="button" aria-label="Next image" onClick={() => setActive((active + 1) % images.length)}><ArrowRight size={17} /></button>
          </div>
          <div className={styles.carouselFooter}>
            <div><strong>{images[active].title}</strong><span>{images[active].caption}</span></div>
            <div className={styles.dots} aria-label={`Image ${active + 1} of ${images.length}`}>
              {images.map((image, index) => <button key={image.src} type="button" aria-label={`Show image ${index + 1}`} aria-pressed={active === index} onClick={() => setActive(index)} />)}
            </div>
          </div>
        </div>
      )}

      {view === 'strip' && (
        <div className={styles.stripView}>
          {images.map((image) => (
            <figure key={image.src}>
              <div><Image src={image.src} alt={image.alt} fill sizes="300px" /></div>
              <figcaption><strong>{image.title}</strong>{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}

      {view === 'sequence' && (
        <div className={styles.sequenceView}>
          {images.map((image, index) => (
            <figure key={image.src}>
              <div><Image src={image.src} alt={image.alt} fill sizes="(min-width: 900px) 280px, 80vw" /><span>{String(index + 1).padStart(2, '0')}</span></div>
              <figcaption><strong>{image.title}</strong>{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
