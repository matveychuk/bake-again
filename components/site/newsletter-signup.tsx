import { newsletterSignupConfig } from '@/lib/newsletter/config';
import type { AppLocale } from '@/lib/i18n/config';
import { NewsletterInvitation } from './newsletter-invitation';
import { NewsletterForm } from './newsletter-form';
import type { MagnetId } from '@/lib/newsletter/magnets';
import { deliveryConfigured } from '@/lib/newsletter/delivery-runtime';

export async function NewsletterSignup({
  locale,
  autoPrompt = false,
  magnetId,
  note,
  placement = 'landing',
}: {
  locale: AppLocale;
  autoPrompt?: boolean;
  magnetId?: MagnetId;
  note?: string;
  placement?: import('@/lib/newsletter/single-opt-in').SubscriptionPlacement;
}) {
  let bindings: Record<string, unknown>;
  try {
    const workers = await import('cloudflare:workers');
    bindings = workers.env as Record<string, unknown>;
  } catch {
    bindings = typeof process !== 'undefined' ? process.env : {};
  }
  const signup = newsletterSignupConfig(bindings, locale);
  // An inert development preview never contacts Brevo or claims delivery.
  const localPreview =
    process.env.NODE_ENV === 'development' && !deliveryConfigured(bindings);
  if (magnetId)
    return signup &&
      locale === 'uk' &&
      (deliveryConfigured(bindings) || localPreview) ? (
      <NewsletterForm
        preview={localPreview}
        placement={placement}
        signup={signup}
        magnetId={magnetId}
        note={note}
        recipeSiteKey={bindings.TURNSTILE_SITE_KEY as string}
      />
    ) : (
      <output>Підписка зараз недоступна. Спробуй, будь ласка, пізніше.</output>
    );
  return signup ? (
    <NewsletterInvitation
      locale={locale}
      signup={signup}
      autoPrompt={autoPrompt}
    />
  ) : null;
}
