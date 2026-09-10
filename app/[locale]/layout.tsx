import { notFound } from 'next/navigation';
import { isAppLocale, supportedLocales } from '@/lib/i18n/config';

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return children;
}
