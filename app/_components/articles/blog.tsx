import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { aboutFamilyImages, aboutPageContent } from '@/content/about';
import { psylliumArticle } from '@/content/articles/psyllium';
import { localeAboutPath } from '@/lib/i18n/routes';
import styles from './blog.module.css';

const about = aboutPageContent.uk;
const cards = [
  {
    path: localeAboutPath('uk'),
    title: 'Про мене',
    description: 'Я Саша. Розповідаю, як із нашої сімейної кухні виріс Bake Again.',
    images: aboutFamilyImages.map(({ src }, index) => ({
      src,
      alt: index === 0 ? about.photoThenAlt : about.photoNowAlt,
    })),
  },
  {
    path: psylliumArticle.path,
    title: psylliumArticle.title,
    description: psylliumArticle.description,
    images: [{ src: psylliumArticle.cardImage, alt: psylliumArticle.cardAlt }],
    imageCredit: 'Згенерована ілюстрація',
  },
];

export function BlogCards({ preview = false }: { preview?: boolean }) {
  const Heading = preview ? 'h3' : 'h2';

  return (
    <div className={styles.grid} lang="uk">
      {cards.map((card) => (
        <article className={`recipe-card ${styles.card}`} key={card.path}>
          <div className={styles.media}>
            {card.images.map(({ src, alt }) => (
              <div className={styles.frame} key={src}>
                <Image src={src} alt={alt} fill
                  sizes={card.images.length === 2
                    ? '(min-width: 621px) 25vw, 50vw'
                    : '(min-width: 621px) 50vw, 100vw'}
                />
              </div>
            ))}
          </div>
          <div className={styles.copy}>
            <Heading>
              <a href={card.path} className={styles.link}>
                {card.title} <ArrowRight aria-hidden="true" size={20} />
              </a>
            </Heading>
            <p>{card.description}</p>
            {card.imageCredit && <small>{card.imageCredit}</small>}
          </div>
        </article>
      ))}
    </div>
  );
}

export function Blog() {
  return (
    <section className={styles.blog} aria-labelledby="blog-title">
      <h1 id="blog-title" tabIndex={-1}>Блог</h1>
      <BlogCards />
    </section>
  );
}
