import { LessonError } from '@/lib/lessons/payhip';
import {
  lessonBindings,
  lessonCookie,
  verifiedReader,
  lessonResponse,
  lessonFailure,
  sameOrigin,
} from '@/lib/lessons/server';
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const token = request.headers.get('authorization')?.replace(/^Bearer /, '');
    const reader = await verifiedReader(await lessonBindings(), token);
    if (!reader) throw new LessonError(401);
    return lessonResponse({ ok: true }, 200, {
      'set-cookie': `${lessonCookie}=${token}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=3600`,
    });
  } catch (error) {
    return lessonFailure(error);
  }
}
export async function DELETE(request: Request) {
  try {
    sameOrigin(request);
    // Account initialization must not erase independent paid-lesson access.
    const existing = request.headers
      .get('cookie')
      ?.split(';')
      .map((s) => s.trim())
      .find((s) => s.startsWith(`${lessonCookie}=`))
      ?.slice(lessonCookie.length + 1);
    if (!existing || existing.startsWith('purchase.'))
      return lessonResponse({ ok: true });
    return lessonResponse({ ok: true }, 200, {
      'set-cookie': `${lessonCookie}=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0`,
    });
  } catch (error) {
    return lessonFailure(error);
  }
}
