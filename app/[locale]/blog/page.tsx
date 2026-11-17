import { notFound } from 'next/navigation';
import { Blog } from '@/app/_components/articles/blog';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { blogPath, psylliumArticle } from '@/content/articles/psyllium';
import { pageMetadata } from '@/lib/seo/metadata';

type ArticlesRouteProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: ArticlesRouteProps) {
  if ((await params).locale !== 'uk') return {};
  return pageMetadata({
    locale: 'uk',
    locales: ['uk'],
    path: blogPath,
    title: 'Блог — Bake Again',
    description: 'Історія Bake Again, інгредієнти й техніка безглютенової випічки.',
    image: psylliumArticle.cardImage,
    imageAlt: psylliumArticle.cardAlt,
  });
}

export default async function ArticlesRoute({ params }: ArticlesRouteProps) {
  if ((await params).locale !== 'uk') notFound();
  return (
    <main>
      <SiteHeader locale="uk" pathname={blogPath} />
      <Blog />
      <SiteFooter locale="uk" />
    </main>
  );
}
