import { ArrowRight } from 'lucide-react';
import { EvidenceBadge, type EvidenceStatus } from '@/components/recipe/evidence-badge';
import { Eyebrow } from '@/components/foundations/eyebrow';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { aboutPageContent } from '@/content/about';
import type { AppLocale } from '@/lib/i18n/config';
import { localeAboutPath, localeHomePath } from '@/lib/i18n/routes';
import styles from './about-page.module.css';

const statuses: EvidenceStatus[] = ['tested', 'calculated', 'suggested'];

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
            <p className={styles.standfirst}>{content.standfirst}</p>
            <a className={styles.recipeLink} href="#how-we-test">{content.testingTitle}<ArrowRight aria-hidden="true" size={18} /></a>
          </div>
          <blockquote className={styles.pullQuote}>{content.pullQuote}</blockquote>
        </header>

        <section className={styles.story} aria-labelledby="our-story-title">
          <h2 className={styles.sectionHeading} id="our-story-title">{content.storyTitle}</h2>
          <div className={styles.prose}>
            {content.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
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
