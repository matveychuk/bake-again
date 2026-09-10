/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import { Wordmark } from './wordmark';
import { defaultLocale, type AppLocale } from '@/lib/i18n/config';
import { localeHomePath } from '@/lib/i18n/routes';

export function SiteFooter({ locale = defaultLocale }: { locale?: AppLocale }) {
  return (
    <footer>
      <Wordmark href={localeHomePath(locale)} locale={locale} />
      <p>
        <a href="/design-system">Design System v1</a> · Warm Precision
      </p>
    </footer>
  );
}
