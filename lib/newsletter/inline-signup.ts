// Public UK widget from the existing Brevo form. Brevo verifies its token.
// Keep its secret exclusively in Brevo; never reuse the assistant widget.
export const brevoUkSiteKey = '0x4AAAAAAFUdWW5vxv31mG01';

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
