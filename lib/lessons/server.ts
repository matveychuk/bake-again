import { createClient } from '@supabase/supabase-js';
import { supabasePersonalConfig } from '../personal/server/supabase-config.ts';
import { readPurchaseToken } from './purchase-token.ts';
import { LessonError } from './payhip.ts';
export { getPersonalBindings as lessonBindings } from '../personal/server/runtime.ts';
export const lessonCookie = '__Host-ba-lesson';
export function lessonConfig(bindings: Record<string, unknown>) {
  const config = supabasePersonalConfig(bindings);
  if (!config || bindings.LESSONS_ENABLED !== 'true')
    throw new LessonError(503);
  return config;
}
export function lessonClient(
  bindings: Record<string, unknown>,
  token?: string,
) {
  const config = lessonConfig(bindings);
  const key = token
    ? config.publishableKey
    : (bindings.SUPABASE_SERVICE_ROLE_KEY ??
      bindings.COMMUNITY_SUPABASE_SECRET_KEY);
  if (typeof key !== 'string' || !key.trim()) throw new LessonError(503);
  return createClient(config.url, key.trim(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
      fetch: (url, init) =>
        fetch(url, {
          ...init,
          cache: 'no-store',
          signal: AbortSignal.timeout(8000),
        }),
    },
  });
}
export async function verifiedReader(
  bindings: Record<string, unknown>,
  token: string | undefined,
) {
  if (token?.startsWith('purchase.')) {
    const secret = bindings.ASSISTANT_SESSION_SECRET;
    if (typeof secret !== 'string') throw new LessonError(503);
    const id = await readPurchaseToken(token, secret);
    if (!id) return null;
    const client = lessonClient(bindings);
    const { data, error } = await client
      .from('lesson_entitlements')
      .select('id,email')
      .eq('id', id)
      .eq('lesson_id', 'napoleon-video')
      .eq('status', 'active')
      .eq('paid_seen', true)
      .single();
    if (error && error.code !== 'PGRST116') throw new LessonError(503);
    if (!data) return null;
    return { client, email: data.email as string, entitlementId: id };
  }
  if (!token || token.length > 8192 || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token))
    return null;
  const client = lessonClient(bindings, token);
  const { data, error } = await client.auth.getUser(token);
  if (error) {
    if ([400, 401, 403].includes(error.status ?? 0)) return null;
    throw new LessonError(503);
  }
  const user = data.user;
  if (
    !user?.email_confirmed_at ||
    !user.email ||
    user.is_anonymous ||
    user.role !== 'authenticated'
  )
    return null;
  return {
    client,
    email: user.email.trim().toLowerCase(),
  };
}
export async function hasLessonAccess(
  reader: NonNullable<Awaited<ReturnType<typeof verifiedReader>>>,
) {
  if ('entitlementId' in reader) return true;
  const { data, error } = await reader.client
    .from('lesson_entitlements')
    .select('id')
    .eq('lesson_id', 'napoleon-video')
    .eq('email', reader.email)
    .eq('status', 'active')
    .or('source.eq.manual,paid_seen.eq.true')
    .limit(1);
  if (error) throw new LessonError(503);
  return !!data?.length;
}
export function requestToken(request: Request) {
  const bearer = request.headers.get('authorization');
  if (bearer?.startsWith('Bearer ')) return bearer.slice(7);
  return request.headers
    .get('cookie')
    ?.split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${lessonCookie}=`))
    ?.slice(lessonCookie.length + 1);
}
export function lessonResponse(
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: {
      'cache-control': 'private, no-store',
      'x-robots-tag': 'noindex',
      ...headers,
    },
  });
}
export function sameOrigin(request: Request) {
  if (
    request.headers.get('origin') !== new URL(request.url).origin ||
    !request.headers.get('content-type')?.startsWith('application/json')
  )
    throw new LessonError(403);
}
export async function boundedBody(
  request: Request,
  limit = 32768,
): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new LessonError(400);
  let text = '';
  let bytes = 0;
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.length;
    if (bytes > limit) {
      await reader.cancel();
      throw new LessonError(413);
    }
    text += decoder.decode(value, { stream: true });
  }
  try {
    return JSON.parse(text + decoder.decode());
  } catch {
    throw new LessonError(400);
  }
}
export function lessonFailure(error: unknown) {
  return lessonResponse(
    { error: 'unavailable' },
    error instanceof LessonError ? error.status : 503,
  );
}
