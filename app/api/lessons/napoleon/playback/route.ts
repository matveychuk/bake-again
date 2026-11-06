import { napoleonLesson } from '@/content/commerce/lessons/napoleon';
import { LessonError } from '@/lib/lessons/payhip';
import {
  lessonBindings,
  verifiedReader,
  hasLessonAccess,
  requestToken,
  lessonResponse,
  lessonFailure,
} from '@/lib/lessons/server';
import { videoPlayback } from '@/lib/lessons/stream';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    const step = napoleonLesson.steps.find(
      (s) => s.stepId === new URL(request.url).searchParams.get('step'),
    );
    if (!step) throw new LessonError(404);
    const bindings = await lessonBindings();
    if (!step.free) {
      const reader = await verifiedReader(bindings, requestToken(request));
      if (!reader) throw new LessonError(401);
      if (!(await hasLessonAccess(reader))) throw new LessonError(403);
    }
    if (!step.videos.uk) throw new LessonError(503);
    const [wide, vertical] = await Promise.all([
      videoPlayback(step.videos.uk.wide, !!step.free, bindings),
      videoPlayback(step.videos.uk.vertical, !!step.free, bindings),
    ]);
    return lessonResponse({
      wide,
      vertical,
      captionsVtt: step.videos.uk.captionsVtt,
      expiresAt: Date.now() + 14400000,
    });
  } catch (error) {
    return lessonFailure(error);
  }
}
