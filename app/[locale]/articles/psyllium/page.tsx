import { notFound, permanentRedirect } from 'next/navigation';
import { psylliumArticle } from '@/content/articles/psyllium';

export default async function LegacyArticleRoute({ params }: { params: Promise<{ locale: string }> }) {
  if ((await params).locale !== 'uk') notFound();
  permanentRedirect(psylliumArticle.path);
}
