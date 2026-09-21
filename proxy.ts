import { isLocalDevelopment } from './lib/runtime/local-development';
import { canReadRecipe } from './content/recipes/publication';
import { getInventoryRecipe } from './content/recipes/inventory';

import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, isAppLocale } from '@/lib/i18n/config';
import {
  getLocalizedRecipePath,
  getLocaleFromPathname,
  getRecipeIdFromLegacySlug,
  getRecipeIdFromLocalizedSlug,
} from '@/lib/i18n/routes';
import { localeCookieName } from '@/lib/persistence/preferences';

const requestLocaleHeader = 'x-bake-again-locale';
const unlocalizedRoutes = new Set(['/design-system']);

function isUnlocalizedRoute(pathname: string) {
  return unlocalizedRoutes.has(pathname) || pathname.startsWith('/design-system/');
}

function continueWithLocale(request: NextRequest, locale = defaultLocale) {
  const headers = new Headers(request.headers);
  headers.set(requestLocaleHeader, locale);
  return NextResponse.next({ request: { headers } });
}

export function proxy(request: NextRequest) {
  const local = isLocalDevelopment(request.headers.get('host'), process.env.NODE_ENV);
  const parts = request.nextUrl.pathname.split('/').filter(Boolean);
  const pathLocale = isAppLocale(parts[0]) ? parts.shift()! : null;
  if ((parts[0] === 'drafts' || parts[0] === 'design-system') && !local) {
    return new NextResponse('Not found', { status: 404 });
  }
  if (parts[0] === 'recipes' && parts[1]) {
    const id = (pathLocale && isAppLocale(pathLocale) ? getRecipeIdFromLocalizedSlug(pathLocale, parts[1]) : null)
      ?? getInventoryRecipe(parts[1])?.id;
    if (!id || !canReadRecipe(id, local)) return new NextResponse('Not found', { status: 404 });
  }

  const { pathname } = request.nextUrl;
  const explicitLocale = getLocaleFromPathname(pathname);

  if (explicitLocale && pathname === `/${explicitLocale}/recipes`) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${explicitLocale}`;
    return NextResponse.redirect(redirectUrl);
  }
  if (explicitLocale) return continueWithLocale(request, explicitLocale);
  if (isUnlocalizedRoute(pathname)) return continueWithLocale(request);

  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  const locale = isAppLocale(cookieLocale) ? cookieLocale : defaultLocale;

  const redirectUrl = request.nextUrl.clone();
  const legacyRecipeMatch = pathname.match(/^\/recipes\/([^/]+)(\/cook)?$/);
  const recipeId = legacyRecipeMatch ? getRecipeIdFromLegacySlug(legacyRecipeMatch[1]) : null;
  const localizedRecipePath = recipeId
    ? getLocalizedRecipePath(recipeId, locale, legacyRecipeMatch?.[2] ?? '')
    : null;
  redirectUrl.pathname = localizedRecipePath ?? (pathname === '/recipes' || pathname === '/' ? `/${locale}` : `/${locale}${pathname}`);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.svg|images/|media/|social/|api/).*)',
  ],
};
