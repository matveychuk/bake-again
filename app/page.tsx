import LocalizedHomePage from './[locale]/page';
import { defaultLocale } from '@/lib/i18n/config';

export default async function Home({ searchParams }: {
  searchParams: Promise<{ collection?: string | string[]; q?: string | string[] }>;
}) {
  return LocalizedHomePage({ params: Promise.resolve({ locale: defaultLocale }), searchParams });
}
