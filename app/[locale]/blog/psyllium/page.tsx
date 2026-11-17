import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PsylliumArticle } from '@/app/_components/articles/articles';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { psylliumArticle } from '@/content/articles/psyllium';
import { pageMetadata } from '@/lib/seo/metadata';

type ArticleRouteProps = { params: Promise<{ locale: string }> };

// The temporary offer must disappear by date without rebuilding the site.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: ArticleRouteProps): Promise<Metadata> {
  if ((await params).locale !== 'uk') return {};
  const metadata = pageMetadata({
    locale: 'uk',
    locales: ['uk'],
    path: psylliumArticle.path,
    title: `${psylliumArticle.title} — Bake Again`,
    description: psylliumArticle.description,
    image: psylliumArticle.cover,
    imageAlt: psylliumArticle.coverAlt,
  });
  return { ...metadata, openGraph: { ...metadata.openGraph, type: 'article' } };
}

export default async function PsylliumRoute({ params }: ArticleRouteProps) {
  if ((await params).locale !== 'uk') notFound();
  return (
    <main>
      <SiteHeader locale="uk" pathname={psylliumArticle.path} />
      <PsylliumArticle />
      <SiteFooter locale="uk" />
    </main>
  );
}
