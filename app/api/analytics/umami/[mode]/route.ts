import { umamiOptOutCookie } from '../../../../../lib/analytics/umami.ts';

const oneYearInSeconds = 365 * 24 * 60 * 60;
const serviceHeaders = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex',
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ mode: string }> },
) {
  const { mode } = await params;
  if (mode !== 'off' && mode !== 'on') {
    return new Response(null, { status: 404, headers: serviceHeaders });
  }
  const off = mode === 'off';
  const maxAge = off ? oneYearInSeconds : 0;
  const headers = new Headers({ ...serviceHeaders, Location: '/uk' });
  if (request.method === 'GET') {
    headers.set(
      'Set-Cookie',
      `${umamiOptOutCookie}=${off ? '1' : ''}; Max-Age=${maxAge}; Path=/; Secure; SameSite=Lax`,
    );
  }
  return new Response(null, { status: 303, headers });
}
