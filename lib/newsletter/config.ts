import type { AppLocale } from '../i18n/config.ts';

export type NewsletterSignup = { provider: string; url: string };

/** The provider owns consent, confirmation and unsubscribe. No email is collected here. */
export function newsletterSignupConfig(
  bindings: Record<string, unknown>,
  locale: AppLocale,
): NewsletterSignup | null {
  if (bindings.NEWSLETTER_ENABLED !== 'true') return null;
  const provider = bindings.NEWSLETTER_PROVIDER_NAME;
  const address = bindings[`NEWSLETTER_SIGNUP_URL_${locale.toUpperCase()}`];
  if (
    typeof provider !== 'string' ||
    !provider.trim() ||
    provider.length > 80 ||
    typeof address !== 'string'
  )
    return null;
  try {
    const url = new URL(address);
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      url.hostname === 'localhost' ||
      !url.hostname.includes('.')
    )
      return null;
    return { provider: provider.trim(), url: url.href };
  } catch {
    return null;
  }
}
