import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ShoppingListPage } from '@/components/personal-state/shopping-list-page';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { getUiMessages } from '@/lib/i18n/messages';
import { isAppLocale } from '@/lib/i18n/config';
import { localeShoppingListPath } from '@/lib/i18n/routes';

export default async function ShoppingListRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  const pathname = localeShoppingListPath(locale);
  return <main><SiteHeader locale={locale} pathname={pathname} /><ShoppingListPage locale={locale} /><SiteFooter locale={locale} /></main>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  return { ...getUiMessages(locale).metadata.shoppingList, robots: { index: false } };
}
