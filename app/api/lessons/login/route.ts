import { LessonError, normalizeEmail, sha256 } from '@/lib/lessons/payhip';
import {
  lessonBindings,
  lessonConfig,
  lessonClient,
  sameOrigin,
  boundedBody,
  lessonResponse,
  lessonFailure,
} from '@/lib/lessons/server';
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const bindings = await lessonBindings();
    lessonConfig(bindings);
    const body = (await boundedBody(request, 8192)) as {
      email?: unknown;
      captchaToken?: unknown;
    };
    if (
      typeof body.email !== 'string' ||
      body.email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(body.email)) ||
      typeof body.captchaToken !== 'string' ||
      body.captchaToken.length > 4096
    )
      throw new LessonError(400);
    const ip = request.headers.get('cf-connecting-ip');
    if (
      !ip ||
      typeof bindings.TURNSTILE_SECRET_KEY !== 'string' ||
      typeof bindings.ASSISTANT_SESSION_SECRET !== 'string'
    )
      throw new LessonError(503);
    const challenge = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: AbortSignal.timeout(5000),
        body: JSON.stringify({
          secret: bindings.TURNSTILE_SECRET_KEY,
          response: body.captchaToken,
          remoteip: ip,
        }),
      },
    );
    if (!challenge.ok) throw new LessonError(503);
    const proof = (await challenge.json()) as {
      success?: boolean;
      action?: string;
      hostname?: string;
    };
    if (
      !proof.success ||
      proof.action !== 'lesson_login' ||
      proof.hostname !== new URL(request.url).hostname
    )
      throw new LessonError(403);
    const email = normalizeEmail(body.email);
    const keys = await Promise.all(
      [`ip:${ip}`, `email:${email}`].map((v) =>
        sha256(
          `lesson-login:${String(bindings.ASSISTANT_SESSION_SECRET)}:${v}`,
        ),
      ),
    );
    const limit = await lessonClient(bindings).rpc('lesson_login_consume', {
      keys,
    });
    if (limit.error) throw new LessonError(503);
    if (limit.data !== true) throw new LessonError(429);
    if (typeof bindings.BREVO_API_KEY !== 'string' || !bindings.BREVO_API_KEY)
      throw new LessonError(503);
    // The same Supabase email OTP and shared callback as the account. Generating
    // server-side avoids consuming a Turnstile token a second time at Auth.
    const { data, error } = await lessonClient(
      bindings,
    ).auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${new URL(request.url).origin}/uk/urok/napoleon`,
      },
    });
    if (error || !data.properties?.hashed_token) {
      if (!error?.status || error.status >= 500) throw new LessonError(503);
      return lessonResponse({ ok: true });
    }
    const link = `${new URL(request.url).origin}/uk/urok/napoleon#token_hash=${encodeURIComponent(data.properties.hashed_token)}&type=email`;
    const minutes = Number(bindings.LESSON_OTP_EXPIRY_MINUTES);
    if (!Number.isSafeInteger(minutes) || minutes <= 0)
      throw new LessonError(503);
    const sent = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': bindings.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        sender: { email: 'hello@bakeagain.com', name: 'Саша · Bake Again' },
        to: [{ email }],
        subject: 'Вхід у відеоурок Bake Again',
        textContent: `Ось твоє посилання для входу в урок «Наполеон без глютену»:\n${link}\n\nВоно діє ${minutes} хвилин. Якщо це не ти — просто проігноруй лист.`,
      }),
    });
    if (!sent.ok) throw new LessonError(503);
    return lessonResponse({ ok: true });
  } catch (error) {
    return lessonFailure(error);
  }
}
