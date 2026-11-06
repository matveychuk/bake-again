'use client';
/* oxlint-disable next/no-html-link-for-pages -- native lesson recovery links match the shared site shell */
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
export function LessonArrival({ access = false }: { access?: boolean }) {
  const [state, setState] = useState<'idle' | 'waiting' | 'help' | 'opened'>(
    'idle',
  );
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const url = new URL(location.href);
    if (url.searchParams.get('purchase') === 'opened' && access) {
      queueMicrotask(() => setState('opened'));
      history.replaceState(null, '', '/uk/urok/napoleon');
      return;
    }
    const token = new URLSearchParams(url.hash.slice(1)).get('lesson_access');
    if (!token && url.searchParams.get('purchase') !== 'return') return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    queueMicrotask(() => { if (!stopped) setState('waiting'); });
    async function attempt(n: number) {
      try {
        const response = await fetch('/api/lessons/claim', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(token ? { token } : {}),
          signal: AbortSignal.timeout(12000),
        });
        if (stopped) return;
        if (response.status === 200) {
          history.replaceState(null, '', '/uk/urok/napoleon?purchase=opened');
          location.reload();
          return;
        }
        if ((response.status === 202 || response.status >= 500) && n < 20) {
          timer = setTimeout(() => void attempt(n + 1), 1500);
          return;
        }
      } catch {
        if (stopped) return;
      }
      setState('help');
    }
    void attempt(0);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [retry, access]);
  if (state === 'idle') return null;
  return (
    <section aria-label="Доступ після покупки" aria-live="polite">
      {state === 'opened' ? (
        <p>Урок відкрито — можна дивитися</p>
      ) : state === 'waiting' ? (
        <p>Відкриваємо твій урок. Це може зайняти кілька секунд</p>
      ) : (
        <>
          <p>
            Доступ ще не відкрився. Якщо оплату завершено, відкрий персональне
            посилання з листа Bake Again. Повторно платити не потрібно.
          </p>
          <Button onClick={() => setRetry((n) => n + 1)}>
            Перевірити ще раз
          </Button>
          <p>
            <a href="?login=1#lesson-login">
              Отримати нове посилання за email покупки
            </a>
          </p>
        </>
      )}
    </section>
  );
}
