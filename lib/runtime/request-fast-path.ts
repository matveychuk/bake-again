type AssetBinding = {
  fetch(request: Request): Promise<Response>;
};

const faviconPath = /^\/(?:(?:uk|en|es)\/)?favicon\.(?:ico|svg)\/?$/i;
const staticDirectory = /^\/(?:images|media|social|downloads|assets|fonts)\//i;
const staticExtension =
  /\.(?:avif|webp|png|jpe?g|gif|svg|ico|css|m?js|map|woff2?|ttf|otf|pdf|txt|xml|json|webmanifest|mp4|webm|mov|mp3|zip|html?)$/i;
const probePath =
  /(?:^|\/)(?:\.env(?:[.\d-][^/]*)?|\.git(?:ignore|modules|config|attributes)?|\.svn|\.hg|\.npmrc|\.ds_store)(?:\/|$)|\.(?:php\d*|phtml|asp|aspx|sql|sqlite3?|bak)(?:\/|$)/i;

function notFound(request: Request) {
  return new Response(request.method === 'HEAD' ? null : 'Not found', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

/** Return null only for requests that need application routing/rendering. */
export async function requestFastPath(
  request: Request,
  assets?: AssetBinding,
): Promise<Response | null> {
  const url = new URL(request.url);
  let path: string;
  try {
    path = decodeURIComponent(url.pathname);
  } catch {
    return new Response(null, { status: 400 });
  }

  // APIs (including purchase webhooks), RSC/actions and framework resources keep
  // their own authentication, method guards, status codes and cache policy.
  if (path.startsWith('/api/') || path.startsWith('/_next/')) return null;
  if (request.headers.has('next-action') || request.headers.has('rsc'))
    return null;

  if (faviconPath.test(path)) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response(null, {
        status: 405,
        headers: { Allow: 'GET, HEAD' },
      });
    }
    // Legacy browsers and localized URLs use the same existing SVG. Never
    // redirect a missing .ico into locale negotiation or render a 404 page.
    if (path !== '/favicon.svg') {
      return new Response(null, {
        status: 308,
        headers: {
          Location: '/favicon.svg',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }
    return assets ? assets.fetch(request) : null;
  }

  // Generated metadata and share-image aliases are route handlers, not assets.
  if (
    path === '/robots.txt' ||
    path === '/sitemap.xml' ||
    path === '/share-image.webp' ||
    path === '/share-image-v4.webp'
  )
    return null;
  if (probePath.test(path)) return notFound(request);

  if (staticDirectory.test(path) || staticExtension.test(path)) {
    if (request.method !== 'GET' && request.method !== 'HEAD')
      return notFound(request);
    // Existing assets usually bypass the Worker altogether. Navigation requests
    // and missing files can still reach it: ask ASSETS, never React's 404 renderer.
    return assets ? assets.fetch(request) : notFound(request);
  }
  return null;
}
