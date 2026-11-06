export const CONSENT_KEY = 'ba_consent';
export const CONSENT_VERSION = 2;
export type AdsConsent = 'granted' | 'denied';
export type Consent = { ads: AdsConsent; v: number; ts: number };
export type ConsentStorage = Pick<Storage, 'getItem' | 'setItem'>;

export function readConsent(
  storage: ConsentStorage,
  now = Date.now(),
): Consent | null {
  try {
    const value = JSON.parse(storage.getItem(CONSENT_KEY) ?? 'null');
    if (
      !value ||
      value.v !== CONSENT_VERSION ||
      !['granted', 'denied'].includes(value.ads) ||
      !Number.isFinite(value.ts) ||
      value.ts > now
    )
      return null;
    const expires = new Date(value.ts);
    expires.setUTCFullYear(expires.getUTCFullYear() + 1);
    return now < expires.getTime() ? value : null;
  } catch {
    return null;
  }
}

export function saveConsent(
  storage: ConsentStorage,
  ads: AdsConsent,
  now = Date.now(),
): Consent {
  const value = { ads, v: CONSENT_VERSION, ts: now };
  try {
    storage.setItem(CONSENT_KEY, JSON.stringify(value));
  } catch {
    /* Session-only choice still works. */
  }
  return value;
}

/** Delete host-only and parent-domain cookies, including older path-scoped copies. */
export function metaCookieDeletions(
  hostname: string,
  pathname: string,
): string[] {
  const paths = new Set(['/']);
  const parts = pathname.split('/').filter(Boolean);
  while (parts.length) {
    paths.add(`/${parts.join('/')}`);
    paths.add(`/${parts.join('/')}/`);
    parts.pop();
  }
  return ['_fbp', '_fbc'].flatMap((name) =>
    [...paths].flatMap((path) =>
      [
        '',
        `; Domain=${hostname}`,
        '; Domain=bakeagain.com',
        '; Domain=.bakeagain.com',
      ].map(
        (domain) =>
          `${name}=; Max-Age=0; Path=${path}${domain}; SameSite=Lax; Secure`,
      ),
    ),
  );
}
