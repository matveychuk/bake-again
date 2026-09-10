import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';

type WordmarkProps = {
  href?: string;
  className?: string;
  locale?: AppLocale;
};

export function Wordmark({ href = '/', className = 'wordmark', locale = 'en' }: WordmarkProps) {
  return (
    <a className={className} href={href} aria-label={getUiMessages(locale).a11y.wordmarkHome}>
      Bake Again<span aria-hidden="true">.</span>
    </a>
  );
}
