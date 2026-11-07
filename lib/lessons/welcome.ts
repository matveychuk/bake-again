import { purchaseToken } from './purchase-token.ts';
import { lessonClient } from './server.ts';
import { LessonError } from './payhip.ts';
/** Durable outbox: claim atomically; provider idempotency covers concurrent/retried sends.
 * Pending rows remain retryable through the protected delivery job after webhook ACK. */
export async function deliverLessonWelcome(
  bindings: Record<string, unknown>,
  onlyId?: string,
) {
  if (typeof bindings.BREVO_API_KEY !== 'string' || !bindings.BREVO_API_KEY)
    throw new LessonError(503);
  const listId = Number(bindings.BREVO_LESSON_BUYERS_LIST_ID);
  if (!Number.isSafeInteger(listId) || listId <= 0) throw new LessonError(503);
  const db = lessonClient(bindings);
  let query = db
    .from('lesson_entitlements')
    .select('id,email,welcome_sent_at,buyers_synced_at,welcome_attempted_at')
    .eq('source', 'payhip')
    .eq('status', 'active')
    .eq('paid_seen', true)
    .eq('welcome_needs_review', false)
    .or('welcome_sent_at.is.null,buyers_synced_at.is.null')
    .limit(20);
  if (onlyId) query = query.eq('id', onlyId);
  const rows = await query;
  if (rows.error) throw new LessonError(503);
  for (const row of rows.data ?? []) {
    // Never automatically replay an ambiguous send outside the provider deduplication window.
    if (
      !row.welcome_sent_at &&
      row.welcome_attempted_at &&
      Date.now() - Date.parse(row.welcome_attempted_at) > 15 * 60000
    ) {
      const held = await db
        .from('lesson_entitlements')
        .update({ welcome_needs_review: true })
        .eq('id', row.id);
      if (held.error) throw new LessonError(503);
      console.error('lesson_welcome_needs_review', { entitlement: row.id });
      continue;
    }
    const claim = await db
      .from('lesson_entitlements')
      .update({ delivery_claimed_at: new Date().toISOString() })
      .eq('id', row.id)
      .eq('status', 'active')
      .or(
        `delivery_claimed_at.is.null,delivery_claimed_at.lt.${new Date(Date.now() - 300000).toISOString()}`,
      )
      .select('id');
    if (claim.error) throw new LessonError(503);
    if (!claim.data?.length) continue;
    async function brevo(path: string, body: unknown) {
      const response = await fetch(`https://api.brevo.com/v3${path}`, {
        method: 'POST',
        headers: {
          'api-key': bindings.BREVO_API_KEY as string,
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new LessonError(503);
    }
    try {
      if (!row.buyers_synced_at) {
        // Technical exclusion list only: never add newsletter lists or change suppression.
        await brevo('/contacts', {
          email: row.email,
          listIds: [listId],
          attributes: { SOURCE: 'payhip' },
          updateEnabled: true,
        });
        const result = await db
          .from('lesson_entitlements')
          .update({ buyers_synced_at: new Date().toISOString() })
          .eq('id', row.id);
        if (result.error) throw new LessonError(503);
      }
      if (!row.welcome_sent_at) {
        if (!row.welcome_attempted_at) {
          const attempt = await db
            .from('lesson_entitlements')
            .update({ welcome_attempted_at: new Date().toISOString() })
            .eq('id', row.id);
          if (attempt.error) throw new LessonError(503);
        }
        if (typeof bindings.ASSISTANT_SESSION_SECRET !== 'string')
          throw new LessonError(503);
        const accessLink = `https://bakeagain.com/uk/urok/napoleon#lesson_access=${await purchaseToken(row.id, bindings.ASSISTANT_SESSION_SECRET)}`;
        await brevo(
          '/smtp/email',
          welcomeMessage(row.email, accessLink, row.id),
        );
        const result = await db
          .from('lesson_entitlements')
          .update({ welcome_sent_at: new Date().toISOString() })
          .eq('id', row.id);
        if (result.error) throw new LessonError(503);
      }
    } finally {
      await db
        .from('lesson_entitlements')
        .update({ delivery_claimed_at: null })
        .eq('id', row.id);
    }
  }
}

function welcomeMessage(
  email: string,
  accessLink: string,
  idempotencyKey: string,
) {
  return {
    sender: { email: 'hello@bakeagain.com', name: 'Саша · Bake Again' },
    replyTo: { email: 'hello@bakeagain.com', name: 'Саша' },
    to: [{ email: email }],
    subject: 'Урок «Наполеон без глютену» відкрито',
    // Brevo rewrites HTML anchors through click tracking. A bare address in a
    // text-only send reached the inbox as a direct link to Bake Again.
    textContent: `Дякую за покупку! Відкрити мій урок «Наполеон без глютену»:
${accessLink}

Посилання відкриває урок одразу, без введення email. Якщо натискання не спрацьовує, скопіюй адресу повністю й відкрий її у своєму браузері.

Збережи цей лист, щоб повернутися до уроку. Персональне посилання діє 90 днів — не пересилай його іншим. Після цього можна отримати нове через «Уже маєш покупку?» на сторінці уроку. Сама покупка залишається доступною. Якщо потрібна допомога, відповідай на цей лист.

— Саша`,
    headers: { idempotencyKey: idempotencyKey },
    tags: ['lesson-access'],
  };
}

/** Explicit operator resend; never reset or replay the automatic delivery outbox. */
export async function resendLessonWelcome(
  bindings: Record<string, unknown>,
  entitlementId: string,
  resendId: string,
) {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  if (!uuid.test(entitlementId) || !uuid.test(resendId))
    throw new LessonError(400);
  if (
    typeof bindings.BREVO_API_KEY !== 'string' ||
    typeof bindings.ASSISTANT_SESSION_SECRET !== 'string'
  )
    throw new LessonError(503);
  const { data, error } = await lessonClient(bindings)
    .from('lesson_entitlements')
    .select('id,email')
    .eq('id', entitlementId)
    .eq('lesson_id', 'napoleon-video')
    .eq('source', 'payhip')
    .eq('status', 'active')
    .eq('paid_seen', true)
    .maybeSingle();
  if (error) throw new LessonError(503);
  if (!data) throw new LessonError(404);
  const accessLink = `https://bakeagain.com/uk/urok/napoleon#lesson_access=${await purchaseToken(data.id, bindings.ASSISTANT_SESSION_SECRET)}`;
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': bindings.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify(welcomeMessage(data.email, accessLink, resendId)),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new LessonError(503);
  const result = (await response.json()) as { messageId?: string };
  return { messageId: result.messageId };
}
