/** Serve the generated sharing image with its media type on Sites. */
async function shareImage(request: Request, head = false): Promise<Response> {
  const { env } = await import('cloudflare:workers');
  const assets = (env as { ASSETS?: { fetch: (request: Request) => Promise<Response> } })
    .ASSETS;
  if (!assets) return new Response(null, { status: 404 });

  const asset = await assets.fetch(request);
  if (!asset.ok) return asset;
  const headers = new Headers(asset.headers);
  headers.set('Content-Type', 'image/webp');
  return new Response(head ? null : asset.body, {
    status: asset.status,
    headers,
  });
}

export function GET(request: Request): Promise<Response> {
  return shareImage(request);
}

export function HEAD(request: Request): Promise<Response> {
  return shareImage(request, true);
}
