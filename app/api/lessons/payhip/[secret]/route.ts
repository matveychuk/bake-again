import { waitUntil } from 'cloudflare:workers';
import { napoleonLesson } from '@/content/commerce/lessons/napoleon';
import { constantEqual, LessonError, parsePayhip } from '@/lib/lessons/payhip';
import {
  lessonBindings,
  lessonClient,
  boundedBody,
  lessonResponse,
  lessonFailure,
} from '@/lib/lessons/server';
import { deliverLessonWelcome } from '@/lib/lessons/welcome';
export async function POST(
  request: Request,
  { params }: { params: Promise<{ secret: string }> },
) {
  try {
    const bindings = await lessonBindings();
    if (
      typeof bindings.PAYHIP_WEBHOOK_PATH_SECRET !== 'string' ||
      bindings.PAYHIP_WEBHOOK_PATH_SECRET.length < 32 ||
      typeof bindings.PAYHIP_API_KEY !== 'string' ||
      !bindings.PAYHIP_API_KEY
    )
      throw new LessonError(503);
    if (
      !constantEqual((await params).secret, bindings.PAYHIP_WEBHOOK_PATH_SECRET)
    )
      throw new LessonError(401);
    const products = [
      ...napoleonLesson.payhipProductIds,
      ...(typeof bindings.PAYHIP_LESSON_PRODUCT_IDS === 'string'
        ? bindings.PAYHIP_LESSON_PRODUCT_IDS
        : ''
      )
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    ];
    if (
      !products.length ||
      products.some((id) => ['vAZlB', 'upKrI'].includes(id))
    )
      throw new LessonError(503);
    const event = await parsePayhip(
      await boundedBody(request),
      bindings.PAYHIP_API_KEY,
      products,
    );
    if (!event) return lessonResponse({ ok: true });
    const { data, error } = await lessonClient(bindings).rpc(
      'lesson_payhip_apply',
      { input: event },
    );
    if (error || !data) throw new LessonError(503);
    if (event.type === 'paid' && event.checkoutId) {
      const bound = await lessonClient(bindings)
        .from('lesson_checkouts')
        .update({ entitlement_id: data })
        .eq('id', event.checkoutId)
        .is('entitlement_id', null)
        .gt('expires_at', new Date().toISOString());
      if (bound.error) throw new LessonError(503);
    }
    console.info('lesson_payhip', {
      transaction: event.transactionId,
      product: event.productId,
      result: event.type,
    });
    if (event.type === 'paid')
      waitUntil(
        deliverLessonWelcome(bindings, data as string).catch(() => {
          console.error('lesson_delivery_pending');
        }),
      );
    return lessonResponse({ ok: true });
  } catch (error) {
    return lessonFailure(error);
  }
}
