import { headers } from 'next/headers';
import { defaultLocale, isAppLocale } from '@/lib/i18n/config';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { NotFoundContent } from '@/components/site/not-found-content';

export default async function NotFound() {
  const requested = (await headers()).get('x-bake-again-locale');
  const locale = isAppLocale(requested) ? requested : defaultLocale;
  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <NotFoundContent locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
