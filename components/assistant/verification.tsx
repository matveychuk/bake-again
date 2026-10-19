'use client';

import { useEffect, useRef, useState } from 'react';
import type { AppLocale } from '@/lib/i18n/config';
import { loadTurnstile, type Turnstile } from '@/lib/security/turnstile-client';
import styles from './assistant.module.css';

export const verificationMessages = {
  uk: {
    limits:
      'До 5 власних запитань за 2 години та 10 за добу в цьому браузері. Готові відповіді — без обмежень.',
    loading: 'Перевірка перед запитанням…',
    ready: 'Можна надіслати запитання.',
    error: 'Власні запитання зараз недоступні. Готові відповіді працюють.',
    retry: 'Повторити перевірку',
  },
  en: {
    limits:
      'Up to 5 custom questions per 2 hours and 10 per day in this browser. Prepared answers are unlimited.',
    loading: 'Verifying before your question…',
    ready: 'You can send your question.',
    error:
      'Custom questions are unavailable right now. Prepared answers still work.',
    retry: 'Retry verification',
  },
  es: {
    limits:
      'Hasta 5 preguntas propias cada 2 horas y 10 al día en este navegador. Las respuestas preparadas no tienen límite.',
    loading: 'Verificando antes de tu pregunta…',
    ready: 'Puedes enviar tu pregunta.',
    error:
      'Las preguntas propias no están disponibles ahora. Las respuestas preparadas siguen funcionando.',
    retry: 'Reintentar verificación',
  },
};

/** Mount only after the visitor focuses the custom-question field, never for prepared answers. */
export function AssistantVerification({
  locale,
  onToken,
}: {
  locale: AppLocale;
  onToken: (token: string | null) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );
  const copy = verificationMessages[locale];
  useEffect(() => {
    let disposed = false;
    let widget: string | undefined;
    let api: Turnstile | undefined;
    const controller = new AbortController();
    onToken(null);
    const invalidate = () => {
      if (!disposed) {
        onToken(null);
        setStatus('error');
      }
    };
    void (async () => {
      try {
        const response = await fetch('/api/assistant/security', {
          signal: AbortSignal.any([
            controller.signal,
            AbortSignal.timeout(10_000),
          ]),
        });
        if (!response.ok) throw new Error('Unavailable');
        const data: unknown = await response.json();
        if (
          !data ||
          typeof data !== 'object' ||
          !('siteKey' in data) ||
          typeof data.siteKey !== 'string'
        )
          throw new Error('Unavailable');
        if (disposed) return;
        api = await loadTurnstile();
        if (disposed || !container.current) return;
        widget = api.render(container.current, {
          sitekey: data.siteKey,
          action: 'bake_assistant',
          language: locale,
          size: 'flexible',
          theme: 'light',
          callback: (token: string) => {
            if (!disposed) {
              onToken(token);
              setStatus('ready');
            }
          },
          'expired-callback': invalidate,
          'error-callback': invalidate,
          'timeout-callback': invalidate,
        });
      } catch {
        invalidate();
      }
    })();
    return () => {
      disposed = true;
      controller.abort();
      if (widget !== undefined) api?.remove(widget);
      onToken(null);
    };
  }, [locale, onToken, attempt]);
  return (
    <div className={styles.verification}>
      <div ref={container} />
      <output>{copy[status]}</output>
      {status === 'error' && (
        <button
          className={styles.retry}
          type="button"
          onClick={() => {
            setStatus('loading');
            setAttempt((value) => value + 1);
          }}
        >
          {copy.retry}
        </button>
      )}
    </div>
  );
}
