import { lessonBindings, lessonClient } from '@/lib/lessons/server';
import { sha256 } from '@/lib/lessons/payhip';
export const dynamic = 'force-dynamic';
export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  if ((await params).locale !== 'uk')
    return new Response('Not found', { status: 404 });
  try {
    const bindings = await lessonBindings();
    const db = lessonClient(bindings);
    const ip = request.headers.get('cf-connecting-ip');
    if (!ip || typeof bindings.ASSISTANT_SESSION_SECRET !== 'string')
      throw new Error('Unavailable');
    const limit = await db.rpc('lesson_login_consume', {
      keys: [
        await sha256(`purchase:${bindings.ASSISTANT_SESSION_SECRET}:${ip}`),
      ],
    });
    if (limit.error) throw new Error('Unavailable');
    if (limit.data !== true)
      return new Response('Забагато спроб. Спробуй пізніше.', {
        status: 429,
        headers: { 'cache-control': 'no-store' },
      });
    const id = crypto.randomUUID();
    const proof = Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) =>
      b.toString(16).padStart(2, '0'),
    ).join('');
    const result = await db
      .from('lesson_checkouts')
      .insert({ id, proof_hash: await sha256(proof) });
    if (result.error) throw new Error('Unavailable');
    const url = new URL('https://payhip.com/buy');
    url.searchParams.set('link', 'VhLl8');
    url.searchParams.set('metadata[ba_checkout]', id);
    return new Response(null, {
      status: 303,
      headers: {
        location: url.href,
        'cache-control': 'private, no-store',
        'referrer-policy': 'no-referrer',
        'set-cookie': `__Host-ba-checkout=${id}.${proof}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=7200`,
      },
    });
  } catch {
    return new Response(
      'Не вдалося відкрити оплату. Онови сторінку або напиши hello@bakeagain.com.',
      {
        status: 503,
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'cache-control': 'no-store',
        },
      },
    );
  }
}
