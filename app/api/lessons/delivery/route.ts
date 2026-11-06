import { constantEqual, LessonError } from '@/lib/lessons/payhip';
import {
  lessonBindings,
  lessonResponse,
  lessonFailure,
  boundedBody,
} from '@/lib/lessons/server';
import {
  deliverLessonWelcome,
  resendLessonWelcome,
} from '@/lib/lessons/welcome';
/** Invoke every few minutes from a trusted scheduler; never a public browser action. */
export async function POST(request: Request) {
  try {
    const bindings = await lessonBindings();
    if (
      typeof bindings.LESSON_DELIVERY_JOB_SECRET !== 'string' ||
      bindings.LESSON_DELIVERY_JOB_SECRET.length < 32
    )
      throw new LessonError(503);
    if (
      !constantEqual(
        request.headers.get('authorization') ?? '',
        `Bearer ${bindings.LESSON_DELIVERY_JOB_SECRET}`,
      )
    )
      throw new LessonError(401);
    if (request.headers.get('content-type')?.startsWith('application/json')) {
      const body = (await boundedBody(request, 1024)) as {
        entitlementId?: unknown;
        resendId?: unknown;
      };
      if (
        typeof body.entitlementId !== 'string' ||
        typeof body.resendId !== 'string'
      )
        throw new LessonError(400);
      return lessonResponse({
        ok: true,
        ...(await resendLessonWelcome(
          bindings,
          body.entitlementId,
          body.resendId,
        )),
      });
    }
    await deliverLessonWelcome(bindings);
    return lessonResponse({ ok: true });
  } catch (error) {
    return lessonFailure(error);
  }
}
