import { isLocalDevelopment } from './lib/runtime/local-development';
import { canReadRecipe } from './content/recipes/publication';
import { getInventoryRecipe } from './content/recipes/inventory';

import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, isAppLocale } from '@/lib/i18n/config';
import { resolveLocaleFromAcceptLanguage } from '@/lib/i18n/resolve-locale';
import {
  getLocalizedRecipePath,
  getLocaleFromPathname,
  getRecipeIdFromLegacySlug,
  getRecipeIdFromLocalizedSlug,
} from '@/lib/i18n/routes';
import { localeCookieName } from '@/lib/persistence/preferences';

const requestLocaleHeader = 'x-bake-again-locale';
const unlocalizedRoutes = new Set([
  '/design-system',
  '/sitemap.xml',
  '/robots.txt',
]);

function isUnlocalizedRoute(pathname: string) {
  return (
    unlocalizedRoutes.has(pathname) || pathname.startsWith('/design-system/')
  );
}

function continueWithLocale(request: NextRequest, locale = defaultLocale) {
  const headers = new Headers(request.headers);
  headers.set(requestLocaleHeader, locale);
  return NextResponse.next({ request: { headers } });
}

function localizedNotFound(request: NextRequest, locale = defaultLocale) {
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}/__not-found`;
  const headers = new Headers(request.headers);
  headers.set(requestLocaleHeader, locale);
  return NextResponse.rewrite(url, { status: 404, request: { headers } });
}

export function proxy(request: NextRequest) {
  const local = isLocalDevelopment(
    request.headers.get('host'),
    process.env.NODE_ENV,
  );
  const parts = request.nextUrl.pathname.split('/').filter(Boolean);
  const prefix = parts[0];
  const pathLocale = isAppLocale(prefix) ? prefix : null;
  if (pathLocale) parts.shift();
  if ((parts[0] === 'drafts' || parts[0] === 'design-system') && !local) {
    return localizedNotFound(request, pathLocale ?? defaultLocale);
  }
  if (parts[0] === 'recipes' && parts[1]) {
    const id =
      (pathLocale && isAppLocale(pathLocale)
        ? getRecipeIdFromLocalizedSlug(pathLocale, parts[1])
        : null) ??
      getRecipeIdFromLegacySlug(parts[1]) ??
      getInventoryRecipe(parts[1])?.id;
    if (!id || !canReadRecipe(id, local))
      return localizedNotFound(request, pathLocale ?? defaultLocale);
  }

  const { pathname } = request.nextUrl;
  const explicitLocale = getLocaleFromPathname(pathname);

  if (explicitLocale && pathname === `/${explicitLocale}/recipes`) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${explicitLocale}`;
    return NextResponse.redirect(redirectUrl, 308);
  }
  if (explicitLocale) {
    const match = pathname.match(
      /^\/(uk|en|es)\/recipes\/([^/]+)(\/cook)?\/?$/,
    );
    const recipeId = match
      ? getRecipeIdFromLocalizedSlug(explicitLocale, match[2])
      : null;
    const canonical = recipeId
      ? getLocalizedRecipePath(recipeId, explicitLocale, match?.[3] ?? '')
      : null;
    if (canonical && pathname !== canonical) {
      const url = request.nextUrl.clone();
      url.pathname = canonical;
      return NextResponse.redirect(url, 308);
    }
    return continueWithLocale(request, explicitLocale);
  }
  if (isUnlocalizedRoute(pathname)) return continueWithLocale(request);

  const redirectUrl = request.nextUrl.clone();
  const legacyRecipeMatch = pathname.match(/^\/recipes\/([^/]+)(\/cook)?\/?$/);
  const recipeId = legacyRecipeMatch
    ? getRecipeIdFromLegacySlug(legacyRecipeMatch[1])
    : null;
  // The shared Instagram link negotiates language only at its neutral entry.
  // Explicit locale URLs above always win; keep other legacy entry behavior.
  const isCrepesEntry = recipeId === 'crepes';
  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  const locale = isAppLocale(cookieLocale)
    ? cookieLocale
    : isCrepesEntry
      ? resolveLocaleFromAcceptLanguage(request.headers.get('accept-language'))
      : defaultLocale;
  const localizedRecipePath = recipeId
    ? getLocalizedRecipePath(recipeId, locale, legacyRecipeMatch?.[2] ?? '')
    : null;
  redirectUrl.pathname =
    localizedRecipePath ??
    (pathname === '/recipes' || pathname === '/'
      ? `/${locale}`
      : `/${locale}${pathname}`);
  const response = NextResponse.redirect(
    redirectUrl,
    isCrepesEntry ? 307 : localizedRecipePath ? 308 : 307,
  );
  if (isCrepesEntry) {
    // A visitor-dependent destination must never be stored as a permanent URL.
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('Vary', 'Cookie, Accept-Language');
  }
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.svg|share-image.webp|share-image-v4.webp|sitemap.xml|robots.txt|images/|media/|social/|api/).*)',
  ],
};
