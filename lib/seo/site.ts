/** Primary domain recorded in docs/services-register.uk.md (2026-09-25). */
export const siteOrigin = 'https://bakeagain.com';
export const siteName = 'Bake Again';

export function absoluteUrl(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//'))
    throw new Error('Expected a site-relative URL');
  return new URL(path, siteOrigin).href;
}
