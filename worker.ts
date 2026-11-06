import app from 'vinext/server/fetch-handler';
import { deliverLessonWelcome } from './lib/lessons/welcome';
import { requestFastPath } from './lib/runtime/request-fast-path';

/** Keep normal vinext requests and retry committed lesson deliveries every five minutes. */
const worker = {
  async fetch(
    request: Request,
    env: Record<string, unknown>,
    ctx: ExecutionContext,
  ) {
    const fastResponse = await requestFastPath(
      request,
      env.ASSETS as { fetch(request: Request): Promise<Response> } | undefined,
    );
    return fastResponse ?? app.fetch(request, env, ctx);
  },
  scheduled(
    _controller: ScheduledController,
    env: Record<string, unknown>,
    ctx: ExecutionContext,
  ) {
    if (env.LESSONS_ENABLED !== 'true') return;
    ctx.waitUntil(
      deliverLessonWelcome(env).catch(() => {
        // Never log provider errors, request URLs, addresses or credentials.
        console.error('lesson_delivery_retry_failed');
      }),
    );
  },
};

export default worker;
