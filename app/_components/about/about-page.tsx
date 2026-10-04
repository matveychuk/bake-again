import { ArrowRight } from 'lucide-react';
import { EvidenceBadge, type EvidenceStatus } from '@/components/recipe/evidence-badge';
import { Eyebrow } from '@/components/foundations/eyebrow';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { aboutPageContent } from '@/content/about';
import type { AppLocale } from '@/lib/i18n/config';
import { getLocalizedRecipePath, localeAboutPath, localeHomePath } from '@/lib/i18n/routes';
import styles from './about-page.module.css';

const statuses: EvidenceStatus[] = ['tested', 'calculated', 'suggested'];

export function AboutFamilyPhotos({ locale }: { locale: AppLocale }) {
  const content = aboutPageContent[locale];
  return (
    <div className={styles.family} role="group" aria-label={content.photosLabel}>
      <div className={styles.photoPair}>
        <figure className={styles.familyPhoto}>
          {/* oxlint-disable-next-line next/no-img-element -- Prepared WebP with original proportions. */}
          <img src="/images/about/family-ivan-4.webp" alt={content.photoThenAlt} width={1800} height={1350} fetchPriority="high" />
          <figcaption>{content.photoThenCaption}</figcaption>
        </figure>
        <figure className={styles.familyPhoto}>
          {/* oxlint-disable-next-line next/no-img-element -- Prepared WebP with original proportions. */}
          <img src="/images/about/family-ivan-14.webp" alt={content.photoNowAlt} width={1280} height={853} />
          <figcaption>{content.photoNowCaption}</figcaption>
        </figure>
      </div>
      <p className={styles.photoNote}>{content.photosIntro}</p>
    </div>
  );
}

export function AboutPage({ locale }: { locale: AppLocale }) {
  const content = aboutPageContent[locale];
  const pathname = localeAboutPath(locale);

  return (
    <main>
      <SiteHeader locale={locale} pathname={pathname} />
      <article className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <h1 id="about-title" tabIndex={-1}>{content.title}</h1>
          </div>
          <p className={styles.standfirst}>{content.standfirst}</p>
        </header>

        <AboutFamilyPhotos locale={locale} />

        <section className={styles.story} aria-labelledby="our-story-title">
          <h2 className={styles.sectionHeading} id="our-story-title">{content.storyTitle}</h2>
          <div className={styles.prose}>
            {content.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <blockquote className={styles.pullQuote}>{content.pullQuote}</blockquote>
          </div>
        </section>

        <section className={styles.collection} aria-labelledby="our-recipes-title">
          <figure className={styles.foodPhoto}>
            {/* oxlint-disable-next-line next/no-img-element -- Existing prepared recipe photograph. */}
            <img src="/images/recipes/plum-cake-author-hero-v1.webp" alt={content.foodAlt} width={1536} height={1024} loading="lazy" />
            <figcaption><a href={getLocalizedRecipePath('plum-cake', locale)!}>{content.foodCaption}</a></figcaption>
          </figure>
          <div className={styles.collectionCopy}>
            <h2 className={styles.sectionHeading} id="our-recipes-title">{content.collectionTitle}</h2>
            <p>{content.collectionBody}</p>
            <a className={styles.recipeLink} href={localeHomePath(locale)}>{content.recipesLink}<ArrowRight aria-hidden="true" size={18} /></a>
            <a className={styles.testingLink} href="#how-we-test">{content.testingTitle}</a>
          </div>
        </section>

        <section className={styles.testing} id="how-we-test" aria-labelledby="how-we-test-title">
          <div className={styles.testingHeading}>
            <Eyebrow>{content.testingEyebrow}</Eyebrow>
            <h2 className={styles.sectionHeading} id="how-we-test-title">{content.testingTitle}</h2>
          </div>
          <div className={styles.testingBody}>
            <div className={styles.prose}>
              {content.testingIntro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>

            <aside className={styles.principle}>
              <h3>{content.exactVersionTitle}</h3>
              <p>{content.exactVersionBody}</p>
            </aside>

            <ul className={styles.statuses} aria-label={content.statusGuideLabel}>
              {statuses.map((status) => (
                <li className={styles.status} key={status}>
                  <EvidenceBadge className={styles.badge} locale={locale} status={status} />
                  <p>{content.statusDescriptions[status]}</p>
                </li>
              ))}
            </ul>

            <div className={`${styles.prose} ${styles.closing}`}>
              {content.closing.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <a className={styles.recipeLink} href={localeHomePath(locale)}>
                {content.recipesLink}
                <ArrowRight aria-hidden="true" size={18} />
              </a>
            </div>
          </div>
        </section>
      </article>
      <SiteFooter locale={locale} />
    </main>
  );
}
