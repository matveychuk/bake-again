import { newsletterSignupConfig } from '@/lib/newsletter/config';
import type { AppLocale } from '@/lib/i18n/config';
import { NewsletterInvitation } from './newsletter-invitation';

export async function NewsletterSignup({
  locale,
  autoPrompt = false,
}: {
  locale: AppLocale;
  autoPrompt?: boolean;
}) {
  let bindings: Record<string, unknown>;
  try {
    const workers = await import('cloudflare:workers');
    bindings = workers.env as Record<string, unknown>;
  } catch {
    bindings = typeof process !== 'undefined' ? process.env : {};
  }
  const signup = newsletterSignupConfig(bindings, locale);
  return signup ? (
    <NewsletterInvitation
      locale={locale}
      signup={signup}
      autoPrompt={autoPrompt}
    />
  ) : null;
}
