import type { AppLocale } from '../i18n/config.ts';

// Public widgets from the existing per-locale Brevo forms. Brevo verifies their
// tokens. Keep the secrets exclusively in Brevo; never reuse the assistant widget.
export const brevoSiteKeys: Record<AppLocale, string> = {
  uk: '0x4AAAAAAFUdWW5vxv31mG01',
  es: '0x4AAAAAAFUdjMI0MAl0H3Rt',
  en: '0x4AAAAAAFUdlqXI2S2piUzT',
};

export function brevoSignupEndpoint(address: string): string | null {
  try {
    const url = new URL(address);
    if (
      url.origin !== 'https://67fba9aa.sibforms.com' ||
      !/^\/serve\/[A-Za-z0-9_=-]+$/.test(url.pathname)
    )
      return null;
    url.search = '?isAjax=1';
    url.hash = '';
    return url.href;
  } catch {
    return null;
  }
}

/** An HTTP 200 or a submit click alone never proves Brevo accepted the request. */
export function brevoAccepted(response: unknown): boolean {
  return (
    !!response &&
    typeof response === 'object' &&
    'success' in response &&
    response.success === true
  );
}
