import Image from 'next/image';
import type { ReactNode } from 'react';
import {
  getRecipeInvitation,
  pdfInvitationEyebrow,
} from '@/content/lead-magnets';
import { EditorialInvitation } from '@/components/site/editorial-invitation';
import styles from './recipe-pdf-invitation.module.css';

/** One registry-owned promise, reused by the recipe and inert Design Lab. */
export function RecipePdfInvitation({
  invitation,
  action,
  id = 'recipe-junior-card',
}: {
  invitation: NonNullable<ReturnType<typeof getRecipeInvitation>>;
  action: ReactNode;
  id?: string;
}) {
  return (
    <EditorialInvitation
      id={id}
      lang={invitation.locale}
      data-recipe-subscription={invitation.magnetId}
      data-pdf-previews={Boolean(invitation.previews?.length)}
      variant="recipe-step"
      headingLevel={3}
      eyebrow={pdfInvitationEyebrow[invitation.locale]}
      titleId={`${id}-title`}
      title={invitation.title}
      description={invitation.description}
      note={invitation.note}
      image={
        invitation.previews?.length ? (
          <div className={styles.previews}>
            {invitation.previews.map((preview) => (
              <figure key={preview.src}>
                <a
                  href={preview.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.previewLink}
                >
                  <span className={styles.page}>
                    <Image
                      src={preview.src}
                      alt={preview.alt}
                      fill
                      style={{ objectFit: 'contain' }}
                      sizes="(max-width: 700px) 42vw, 220px"
                    />
                  </span>
                  <span className={styles.linkLabel}>
                    {preview.linkLabel}
                    <span className="sr-only"> {{ uk: '(нова вкладка)', es: '(se abre en otra pestaña)', en: '(opens in a new tab)' }[invitation.locale]}</span>
                  </span>
                </a>
                <figcaption>
                  <strong>{preview.title}</strong>
                  <span>{preview.description}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : undefined
      }
      action={action}
    />
  );
}
