import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RecipeDownloads } from '@/components/recipe/recipe-downloads';
import { Wordmark } from '@/components/site/wordmark';
import { SiteFooter } from '@/components/site/site-footer';

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: 'Рецепт млинців і картка юного кухаря — Bake Again',
  description: 'Два PDF про безглютенові млинці: повний рецепт і коротка картка з фото.',
  robots: { index: false, follow: true },
  alternates: null,
};

export default async function CrepesDownloadsPage({ params }: Props) {
  if ((await params).locale !== 'uk') notFound();
  return (
    <div className="site-app-shell" lang="uk">
      <header className="site-header">
        <a className="skip-link" href="#crepes-downloads-title">До завантажень</a>
        <Wordmark href="/uk" locale="uk" />
      </header>
      <main><RecipeDownloads /></main>
      <SiteFooter locale="uk" />
    </div>
  );
}
