import { notFound, permanentRedirect } from 'next/navigation';
import { blogPath } from '@/content/articles/psyllium';

export default async function LegacyArticleRoute({ params }: { params: Promise<{ locale: string }> }) {
  if ((await params).locale !== 'uk') notFound();
  permanentRedirect(blogPath);
}
