import { notFound } from 'next/navigation';
import { HomePage } from '@/app/_components/home/home-page';
import { CookieConsentPanel } from '@/components/site/cookie-consent';
import { isAppLocale } from '@/lib/i18n/config';
import { canViewDrafts } from '@/lib/runtime/local-development.server';

export const metadata = {
  title: 'Cookie banner — Design Lab',
  robots: { index: false, follow: false },
};

/** Local visual fixture: real fixed panel on the home layout, no consent or tracking override. */
export default async function CookieBannerReview({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale) || !(await canViewDrafts())) notFound();
  return (
    <>
      <HomePage locale={locale} selectedCollectionId={null} query="" />
      <CookieConsentPanel locale={locale} />
    </>
  );
}
