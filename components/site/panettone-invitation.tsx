import Image from 'next/image';
import { pancakeCampaign } from '@/content/articles/pancake-invitation';
import { panettoneCampaign } from '@/content/articles/psyllium';
import { EditorialInvitation } from './editorial-invitation';
import { NewsletterForm } from './newsletter-form';

type WaitlistInvitationProps = {
  preview?: boolean;
  previewSuccess?: boolean;
  id?: string;
  siteKey?: string;
};

export function PanettoneInvitation(props: WaitlistInvitationProps) {
  return <RecipeWaitlistInvitation {...props} campaign="panettone" />;
}

export function RecipeWaitlistInvitation({
  campaign,
  preview = false,
  previewSuccess = false,
  id = campaign,
  siteKey,
}: WaitlistInvitationProps & { campaign: 'panettone' | 'pancakes' }) {
  const copy = campaign === 'pancakes' ? pancakeCampaign : panettoneCampaign;
  return (
    <div id={id}>
      <EditorialInvitation
        variant="campaign"
        data-image-format={campaign === 'pancakes' ? 'landscape' : undefined}
        data-preview={preview || undefined}
        lang="uk"
        titleId={`${id}-title`}
        title={copy.title}
        subtitle={copy.subtitle}
        description={copy.description}
        image={
          <Image
            src={copy.image}
            alt={copy.imageAlt}
            width={campaign === 'pancakes' ? 1536 : 1080}
            height={campaign === 'pancakes' ? 1024 : 1350}
            priority
            sizes="(max-width: 620px) calc(100vw - 72px), 288px"
          />
        }
        action={
          <NewsletterForm
            locale="uk"
            campaign={campaign}
            preview={preview}
            previewSuccess={previewSuccess}
            recipeSiteKey={siteKey}
          />
        }
      />
    </div>
  );
}
