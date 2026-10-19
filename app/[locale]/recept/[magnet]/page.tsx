import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLeadMagnet } from '@/content/lead-magnets';
import { EditorialInvitation } from '@/components/site/editorial-invitation';
import { NewsletterSignup } from '@/components/site/newsletter-signup';
import { Wordmark } from '@/components/site/wordmark';

type Props = { params: Promise<{ locale: string; magnet: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, magnet } = await params;
  const content = getLeadMagnet(locale, magnet);
  if (!content) return { robots: { index: false, follow: false } };
  return {
    title: `${content.title} — Bake Again`,
    description: content.subtitle,
    robots: { index: false, follow: false },
    alternates: null,
    openGraph: {
      title: content.title,
      description: content.subtitle,
      images: [{ url: content.image, alt: content.imageAlt }],
    },
    twitter: { card: 'summary_large_image', images: [content.image] },
  };
}

export default async function LeadMagnetPage({ params }: Props) {
  const { locale, magnet } = await params;
  const content = getLeadMagnet(locale, magnet);
  if (!content) notFound();
  return (
    <div className="site-app-shell" lang="uk">
      <header className="site-header">
        <a className="skip-link" href="#lead-magnet-title">
          До рецепта й форми
        </a>
        <Wordmark href="/uk" locale="uk" />
      </header>
      <main>
        <EditorialInvitation
          variant="lead-magnet"
          headingLevel={1}
          titleId="lead-magnet-title"
          title={content.title}
          description={content.subtitle}
          image={
            // oxlint-disable-next-line next/no-img-element -- Prepared author photograph.
            <img
              src={content.image}
              alt={content.imageAlt}
              width={1800}
              height={2400}
              fetchPriority="high"
            />
          }
          note={
            <ul>
              {content.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          }
          action={
            <NewsletterSignup
              locale="uk"
              magnetId={content.magnetId}
              note={content.note}
            />
          }
        />
      </main>
    </div>
  );
}
