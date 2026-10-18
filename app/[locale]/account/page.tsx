import { accountCopy } from '@/components/account/copy';
import { notFound } from 'next/navigation';
import { isAppLocale } from '@/lib/i18n/config';
import { getRecipeCatalog } from '@/content/recipes/catalog';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { AccountPage } from '@/components/account/account-page';
export const dynamic = 'force-dynamic';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  return {
    title: `${accountCopy[locale].title} — Bake Again`,
    robots: { index: false, follow: true },
    referrer: 'no-referrer' as const,
  };
}
export default async function AccountRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return (
    <main>
      <SiteHeader locale={locale} pathname={`/${locale}/account`} />
      <AccountPage
        locale={locale}
        recipes={getRecipeCatalog(locale, 'published').map((r) => ({
          id: r.id,
          title: r.title,
        }))}
      />
      <SiteFooter locale={locale} />
    </main>
  );
}
