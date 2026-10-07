/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import { Wordmark } from './wordmark';
import { defaultLocale, type AppLocale } from '@/lib/i18n/config';
import { localeHomePath } from '@/lib/i18n/routes';
import { getUiMessages } from '@/lib/i18n/messages';
import { privacyContent } from '@/content/privacy';
import { canViewDrafts } from '@/lib/runtime/local-development.server';
import styles from './site-footer.module.css';
import { SocialLinks } from './social-links';

export async function SiteFooter({
  locale = defaultLocale,
}: {
  locale?: AppLocale;
}) {
  const messages = getUiMessages(locale);
  const local = await canViewDrafts();
  return (
    <footer>
      <Wordmark href={localeHomePath(locale)} locale={locale} />
      <SocialLinks locale={locale} />
      <nav
        className={styles.links}
        aria-label={
          locale === 'uk'
            ? 'Інформація про сайт'
            : locale === 'es'
              ? 'Información del sitio'
              : 'Site information'
        }
      >
        <a href={`/${locale}/about`}>{messages.navigation.about}</a>
        <a href={`/${locale}/privacy`}>{privacyContent[locale].title}</a>
        {local && <a href="/design-system">Design Lab</a>}
      </nav>
    </footer>
  );
}
