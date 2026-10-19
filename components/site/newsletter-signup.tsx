import { newsletterSignupConfig } from '@/lib/newsletter/config';
import type { AppLocale } from '@/lib/i18n/config';
import { NewsletterInvitation } from './newsletter-invitation';
import { NewsletterForm } from './newsletter-form';

export async function NewsletterSignup({
  locale,
  autoPrompt = false,
  magnetId,
  note,
}: {
  locale: AppLocale;
  autoPrompt?: boolean;
  magnetId?: 'shokolad';
  note?: string;
}) {
  let bindings: Record<string, unknown>;
  try {
    const workers = await import('cloudflare:workers');
    bindings = workers.env as Record<string, unknown>;
  } catch {
    bindings = typeof process !== 'undefined' ? process.env : {};
  }
  const signup = newsletterSignupConfig(bindings, locale);
  if (magnetId)
    return signup && locale === 'uk' ? (
      <NewsletterForm signup={signup} magnetId={magnetId} note={note} />
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
