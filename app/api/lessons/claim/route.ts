import {
  lessonBindings,
  lessonClient,
  lessonCookie,
  verifiedReader,
  sameOrigin,
  boundedBody,
  lessonResponse,
  lessonFailure,
} from '@/lib/lessons/server';
import { LessonError, sha256, constantEqual } from '@/lib/lessons/payhip';
import { purchaseToken } from '@/lib/lessons/purchase-token';
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const bindings = await lessonBindings();
    const body = (await boundedBody(request, 2048)) as { token?: unknown };
    let token: string;
    if (typeof body.token === 'string') {
      if (!body.token.startsWith('purchase.')) throw new LessonError(403);
      token = body.token;
    } else {
      const cookie = request.headers
        .get('cookie')
        ?.split(';')
        .map((s) => s.trim())
        .find((s) => s.startsWith('__Host-ba-checkout='))
        ?.split('=')[1];
      if (!cookie || !/^[a-f0-9-]{36}\.[a-f0-9]{64}$/.test(cookie))
        throw new LessonError(401);
      const [id, proof] = cookie.split('.');
      const result = await lessonClient(bindings)
        .from('lesson_checkouts')
        .select('proof_hash,entitlement_id')
        .eq('id', id)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();
      if (result.error) throw new LessonError(503);
      if (
        !result.data ||
        !constantEqual(result.data.proof_hash, await sha256(proof))
      )
        throw new LessonError(401);
      if (!result.data.entitlement_id)
        return lessonResponse({ pending: true }, 202);
      if (typeof bindings.ASSISTANT_SESSION_SECRET !== 'string')
        throw new LessonError(503);
      token = await purchaseToken(
        result.data.entitlement_id,
        bindings.ASSISTANT_SESSION_SECRET,
      );
    }
    if (!(await verifiedReader(bindings, token))) throw new LessonError(403);
    return lessonResponse({ ok: true }, 200, {
      'set-cookie': `${lessonCookie}=${token}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=7776000`,
    });
  } catch (error) {
    return lessonFailure(error);
  }
}
