import {
  defaultLocale,
  isAppLocale,
  type AppLocale,
} from '../../../lib/i18n/config.ts';
import type {
  AssistantErrorCode,
  AssistantResponseV1,
} from '../../../lib/assistant/contracts.ts';
import { parseAssistantRequest } from '../../../lib/assistant/schemas.ts';
import { ASSISTANT_MAX_BODY_BYTES } from '../../../lib/assistant/limits.ts';
import {
  AssistantEnvironmentError,
  ASSISTANT_TIMEOUT_MS,
  getAssistantRuntimeBindings,
  parseAssistantRuntimeEnv,
} from '../../../lib/assistant/server/env.ts';
import { AssistantServiceError } from '../../../lib/assistant/server/errors.ts';
import { createOpenAIAssistantProvider } from '../../../lib/assistant/server/openai.ts';
import {
  createAssistantService,
  type AssistantService,
} from '../../../lib/assistant/server/service.ts';
import {
  resolveAnonymousAssistantIdentity,
  type AssistantAnonymousIdentity,
} from '../../../lib/assistant/server/security.ts';
import {
  assistantRequestThrottle,
  type AssistantRequestThrottle,
} from '../../../lib/assistant/server/throttle.ts';
import { consoleAssistantTelemetry } from '../../../lib/assistant/server/telemetry.ts';

export const dynamic = 'force-dynamic';
export const maxDuration = 20;

const errorMessages: Record<AppLocale, Record<AssistantErrorCode, string>> = {
  en: {
    INVALID_REQUEST: 'The assistant request is invalid.',
    PAYLOAD_TOO_LARGE: 'The assistant request is too large.',
    UNSUPPORTED_MEDIA_TYPE: 'Send the assistant request as JSON.',
    METHOD_NOT_ALLOWED: 'This method is not allowed.',
    ORIGIN_NOT_ALLOWED: 'This request origin is not allowed.',
    RECIPE_UNAVAILABLE: 'This recipe is not available to the assistant.',
    LOCALE_UNAVAILABLE: 'The assistant is not available in this language.',
    RECIPE_VERSION_MISMATCH:
      'The recipe changed. Refresh it before asking again.',
    CONFIGURATION_UNAVAILABLE: 'This recipe configuration is not available.',
    ASSISTANT_DISABLED: 'The assistant is currently unavailable.',
    RATE_LIMITED: 'Too many assistant requests. Try again later.',
    BUDGET_EXHAUSTED: 'The assistant is currently unavailable.',
    SERVICE_UNAVAILABLE: 'The assistant service is temporarily unavailable.',
    UPSTREAM_TIMEOUT: 'The assistant took too long to respond.',
    INVALID_UPSTREAM_RESPONSE: 'The assistant could not produce a safe answer.',
    INTERNAL_ERROR: 'The assistant encountered an unexpected error.',
  },
  es: {
    INVALID_REQUEST: 'La solicitud al asistente no es válida.',
    PAYLOAD_TOO_LARGE: 'La solicitud al asistente es demasiado grande.',
    UNSUPPORTED_MEDIA_TYPE: 'Envía la solicitud al asistente como JSON.',
    METHOD_NOT_ALLOWED: 'Este método no está permitido.',
    ORIGIN_NOT_ALLOWED: 'El origen de esta solicitud no está permitido.',
    RECIPE_UNAVAILABLE: 'Esta receta no está disponible para el asistente.',
    LOCALE_UNAVAILABLE: 'El asistente no está disponible en este idioma.',
    RECIPE_VERSION_MISMATCH:
      'La receta ha cambiado. Actualízala antes de volver a preguntar.',
    CONFIGURATION_UNAVAILABLE:
      'Esta configuración de receta no está disponible.',
    ASSISTANT_DISABLED: 'El asistente no está disponible en este momento.',
    RATE_LIMITED: 'Demasiadas solicitudes al asistente. Inténtalo más tarde.',
    BUDGET_EXHAUSTED: 'El asistente no está disponible en este momento.',
    SERVICE_UNAVAILABLE:
      'El servicio del asistente no está disponible temporalmente.',
    UPSTREAM_TIMEOUT: 'El asistente tardó demasiado en responder.',
    INVALID_UPSTREAM_RESPONSE:
      'El asistente no pudo producir una respuesta segura.',
    INTERNAL_ERROR: 'El asistente encontró un error inesperado.',
  },
  uk: {
    INVALID_REQUEST: 'Запит до помічника некоректний.',
    PAYLOAD_TOO_LARGE: 'Запит до помічника завеликий.',
    UNSUPPORTED_MEDIA_TYPE: 'Надішліть запит до помічника у форматі JSON.',
    METHOD_NOT_ALLOWED: 'Цей метод не дозволено.',
    ORIGIN_NOT_ALLOWED: 'Походження цього запиту не дозволено.',
    RECIPE_UNAVAILABLE: 'Цей рецепт недоступний для помічника.',
    LOCALE_UNAVAILABLE: 'Помічник недоступний цією мовою.',
    RECIPE_VERSION_MISMATCH:
      'Рецепт змінився. Оновіть сторінку перед новим запитом.',
    CONFIGURATION_UNAVAILABLE: 'Ця конфігурація рецепта недоступна.',
    ASSISTANT_DISABLED: 'Помічник зараз недоступний.',
    RATE_LIMITED: 'Забагато запитів до помічника. Спробуйте пізніше.',
    BUDGET_EXHAUSTED: 'Помічник зараз недоступний.',
    SERVICE_UNAVAILABLE: 'Сервіс помічника тимчасово недоступний.',
    UPSTREAM_TIMEOUT: 'Помічник не встиг відповісти вчасно.',
    INVALID_UPSTREAM_RESPONSE: 'Помічник не зміг надати безпечну відповідь.',
    INTERNAL_ERROR: 'У роботі помічника сталася неочікувана помилка.',
  },
};

interface AssistantRouteDependencies {
  getService(): Promise<AssistantService>;
  getSecurity?(): Promise<{
    sessionSecret: string;
    throttle: AssistantRequestThrottle;
  }>;
  createRequestId?: () => string;
}

function jsonResponse(
  body: AssistantResponseV1,
  status: number,
  retryAfterSeconds?: number | null,
) {
  const headers = new Headers({
    'cache-control': 'no-store',
    'content-type': 'application/json; charset=utf-8',
    'x-request-id': body.requestId,
  });
  if (retryAfterSeconds !== undefined && retryAfterSeconds !== null) {
    headers.set('retry-after', String(retryAfterSeconds));
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function errorResponse(
  requestId: string,
  locale: AppLocale,
  code: AssistantErrorCode,
  status: number,
  retryable = false,
  retryAfterSeconds: number | null = null,
) {
  return jsonResponse(
    {
      schemaVersion: 1,
      ok: false,
      requestId,
      error: {
        code,
        message: errorMessages[locale][code],
        retryable,
        retryAfterSeconds,
      },
    },
    status,
    retryAfterSeconds,
  );
}

async function readBoundedBody(request: Request): Promise<string | null> {
  const contentLength = request.headers.get('content-length');
  if (contentLength && Number(contentLength) > ASSISTANT_MAX_BODY_BYTES)
    return null;
  if (!request.body) return '';

  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytesRead = 0;
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > ASSISTANT_MAX_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return text;
  } catch {
    return '';
  } finally {
    reader.releaseLock();
  }
}

function requestLocale(value: unknown): AppLocale {
  if (
    typeof value === 'object' &&
    value !== null &&
    'locale' in value &&
    typeof value.locale === 'string' &&
    isAppLocale(value.locale)
  ) {
    return value.locale;
  }
  return defaultLocale;
}

export function createAssistantRouteHandler(
  dependencies: AssistantRouteDependencies,
) {
  return async function assistantRoute(request: Request) {
    const requestId = dependencies.createRequestId?.() ?? crypto.randomUUID();
    if (request.method !== 'POST') {
      const response = errorResponse(
        requestId,
        defaultLocale,
        'METHOD_NOT_ALLOWED',
        405,
      );
      response.headers.set('allow', 'POST');
      return response;
    }
    if (request.headers.get('origin') !== new URL(request.url).origin) {
      return errorResponse(requestId, defaultLocale, 'ORIGIN_NOT_ALLOWED', 403);
    }
    const mediaType = request.headers
      .get('content-type')
      ?.split(';', 1)[0]
      ?.trim()
      .toLowerCase();
    if (mediaType !== 'application/json') {
      return errorResponse(
        requestId,
        defaultLocale,
        'UNSUPPORTED_MEDIA_TYPE',
        415,
      );
    }
    const bodyText = await readBoundedBody(request);
    if (bodyText === null) {
      return errorResponse(requestId, defaultLocale, 'PAYLOAD_TOO_LARGE', 413);
    }

    let rawBody: unknown;
    try {
      rawBody = JSON.parse(bodyText);
    } catch {
      return errorResponse(requestId, defaultLocale, 'INVALID_REQUEST', 400);
    }
    const locale = requestLocale(rawBody);
    const parsed = parseAssistantRequest(rawBody);
    if (!parsed.success)
      return errorResponse(requestId, locale, 'INVALID_REQUEST', 400);

    let identity: AssistantAnonymousIdentity | null = null;
    let releaseThrottle: (() => void) | null = null;
    const withSession = (response: Response) => {
      if (identity?.setCookie)
        response.headers.append('set-cookie', identity.setCookie);
      return response;
    };
    try {
      if (dependencies.getSecurity) {
        const security = await dependencies.getSecurity();
        identity = await resolveAnonymousAssistantIdentity(
          request,
          security.sessionSecret,
        );
        const lease = security.throttle.acquire(
          identity.safetyIdentifier,
          identity.networkIdentifier,
        );
        if (!lease.allowed) {
          return withSession(
            errorResponse(
              requestId,
              locale,
              'RATE_LIMITED',
              429,
              true,
              lease.retryAfterSeconds,
            ),
          );
        }
        releaseThrottle = () => lease.release();
      }
      const service = await dependencies.getService();
      const deadlineSignal = AbortSignal.any([
        request.signal,
        AbortSignal.timeout(ASSISTANT_TIMEOUT_MS),
      ]);
      const response = await service.respond(parsed.data, {
        requestId,
        signal: deadlineSignal,
        safetyIdentifier: identity?.safetyIdentifier,
      });
      return withSession(jsonResponse(response, 200));
    } catch (error) {
      if (error instanceof AssistantServiceError) {
        return withSession(
          errorResponse(
            requestId,
            locale,
            error.code,
            error.httpStatus,
            error.retryable,
            error.retryAfterSeconds,
          ),
        );
      }
      if (error instanceof AssistantEnvironmentError) {
        return withSession(
          errorResponse(requestId, locale, 'ASSISTANT_DISABLED', 503),
        );
      }
      return withSession(
        errorResponse(requestId, locale, 'INTERNAL_ERROR', 500),
      );
    } finally {
      releaseThrottle?.();
    }
  };
}

async function getDefaultService() {
  const bindings = await getAssistantRuntimeBindings();
  const config = parseAssistantRuntimeEnv(bindings);
  if (!config.enabled)
    throw new AssistantServiceError('ASSISTANT_DISABLED', 503);
  const provider = createOpenAIAssistantProvider(config);
  return createAssistantService({
    config,
    provider,
    telemetry: consoleAssistantTelemetry,
  });
}

async function getDefaultSecurity() {
  const config = parseAssistantRuntimeEnv(await getAssistantRuntimeBindings());
  if (!config.enabled || !config.sessionSecret) {
    throw new AssistantServiceError('ASSISTANT_DISABLED', 503);
  }
  return {
    sessionSecret: config.sessionSecret,
    throttle: assistantRequestThrottle,
  };
}

const handleRequest = createAssistantRouteHandler({
  getService: getDefaultService,
  getSecurity: getDefaultSecurity,
});

export const POST = handleRequest;
export const GET = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
export const OPTIONS = handleRequest;
