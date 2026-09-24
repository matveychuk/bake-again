import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { privacyContent } from '@/content/privacy';
import { isAppLocale } from '@/lib/i18n/config';
import styles from './privacy.module.css';

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return isAppLocale(locale)
    ? {
        title: `${privacyContent[locale].title} — Bake Again`,
        description: privacyContent[locale].intro,
      }
    : {};
}
export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  const content = privacyContent[locale];
  return (
    <main>
      <SiteHeader locale={locale} pathname={`/${locale}/privacy`} />
      <article className={styles.page}>
        <h1 id="privacy-title" tabIndex={-1}>
          {content.title}
        </h1>
        <p>{content.intro}</p>
        {content.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </article>
      <SiteFooter locale={locale} />
    </main>
  );
}
