import Image from 'next/image';
import { panettoneCampaign as copy } from '@/content/articles/psyllium';
import { EditorialInvitation } from './editorial-invitation';
import { NewsletterForm } from './newsletter-form';

export function PanettoneInvitation({
  preview = false,
  siteKey,
}: {
  preview?: boolean;
  siteKey?: string;
}) {
  return (
    <div id="panettone">
      <EditorialInvitation
        variant="campaign"
        data-preview={preview || undefined}
        lang="uk"
        titleId="panettone-title"
        title={copy.title}
        subtitle={copy.subtitle}
        description={copy.description}
        image={
          <Image
            src={copy.image}
            alt={copy.imageAlt}
            width={1080}
            height={1350}
            priority
            sizes="(max-width: 620px) calc(100vw - 72px), 288px"
          />
        }
        action={
          <NewsletterForm
            locale="uk"
            campaign="panettone"
            preview={preview}
            recipeSiteKey={siteKey}
          />
        }
      />
    </div>
  );
}
