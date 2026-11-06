'use client';
import { useEffect, useRef, useState } from 'react';
import { useAccount } from '@/components/account/account-provider';
import { authClient, signOut } from '@/lib/personal/browser';
import { Button } from '@/components/ui/button';
import { loadTurnstile } from '@/lib/security/turnstile-client';
import { trackEvent } from '@/lib/analytics/umami';
import { trackMetaBuy } from '@/lib/analytics/meta';
import styles from './lesson.module.css';
export function LessonEvents({
  state,
}: {
  state: 'description' | 'login' | 'lesson';
}) {
  useEffect(() => {
    trackEvent('lesson_page_view', { state });
    try {
      if (sessionStorage.getItem('ba:lesson-login-success')) {
        sessionStorage.removeItem('ba:lesson-login-success');
        trackEvent('lesson_login_success');
      }
    } catch {
      /* Optional analytics. */
    }
  }, [state]);
  return null;
}
export function LessonSession({ serverEmail }: { serverEmail: string | null }) {
  const account = useAccount();
  const refreshed = useRef(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (
      !account.ready ||
      !account.authReady ||
      refreshed.current ||
      account.email === serverEmail
    )
      return;
    refreshed.current = true;
    void authClient()
      .auth.getSession()
      .then(async ({ data }) => {
        const token = data.session?.access_token;
        const response = await fetch('/api/lessons/session', {
          method: token ? 'POST' : 'DELETE',
          headers: {
            'content-type': 'application/json',
            ...(token ? { authorization: `Bearer ${token}` } : {}),
          },
        });
        if (response.ok) location.reload();
      })
      .catch(() => setError('Не вдалося оновити вхід. Спробуй ще раз.'));
  }, [account.ready, account.authReady, account.email, serverEmail]);
  if (account.error === 'INVALID_AUTH_LINK')
    return (
      <output>
        Посилання для входу вже не діє.{' '}
        <Button variant="link" href="?login=1#lesson-login">
          Надішли нове посилання
        </Button>
        .
      </output>
    );
  if (!serverEmail) return error ? <output>{error}</output> : null;
  return (
    <>
      <Button
        variant="ghost"
        onClick={() =>
          void signOut()
            .then(() => location.reload())
            .catch(() => setError('Не вдалося вийти. Спробуй ще раз.'))
        }
      >
        Вийти
      </Button>
      {error && <output>{error}</output>}
    </>
  );
}
export function LessonBuy({ href, price }: { href: string; price: string }) {
  return (
    <Button
      href={href}
      rel="noreferrer"
      onClick={() => { trackEvent('lesson_buy_click'); trackMetaBuy(); }}
    >
      Купити урок · {price}
    </Button>
  );
}
export function LessonLogin({ siteKey }: { siteKey: string | null }) {
  const [token, setToken] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [generation, setGeneration] = useState(0);
  const challenge = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!siteKey || sent) return;
    let id: string | undefined;
    let disposed = false;
    void loadTurnstile()
      .then((t) => {
        if (!disposed && challenge.current)
          id = t.render(challenge.current, {
            sitekey: siteKey,
            action: 'lesson_login',
            callback: (value: string) => setToken(value),
            'expired-callback': () => setToken(''),
            'error-callback': () => {
              setToken('');
              setError('Онови сторінку й повтори перевірку.');
            },
          });
      })
      .catch(() =>
        setError('Не вдалося завантажити перевірку. Онови сторінку.'),
      );
    return () => {
      disposed = true;
      if (id) window.turnstile?.remove(id);
    };
  }, [generation, sent, siteKey]);
  if (sent)
    return (
      <output>
        Перевір пошту: посилання для входу прийде за хвилину. Немає листа —
        перевір «Промоакції» або спам.
      </output>
    );
  return (
    <form
      className={styles.form}
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError('');
        const email = new FormData(event.currentTarget).get('email');
        try {
          const response = await fetch('/api/lessons/login', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ email, captchaToken: token }),
          });
          if (!response.ok)
            throw new Error(
              response.status === 429
                ? 'Забагато запитів. Спробуй за 15 хвилин.'
                : 'Не вдалося надіслати посилання. Спробуй ще раз.',
            );
          trackEvent('lesson_login_request');
          setSent(true);
        } catch (e) {
          setError((e as Error).message);
          setToken('');
          setGeneration((g) => g + 1);
        } finally {
          setBusy(false);
        }
      }}
    >
      <label htmlFor="lesson-email">Email покупки</label>
      <input
        id="lesson-email"
        name="email"
        type="email"
        autoComplete="email"
        required
        maxLength={254}
      />
      <div ref={challenge} />
      {!siteKey && (
        <p>
          Вхід ще налаштовую. Якщо потрібна допомога —{' '}
          <a href="mailto:hello@bakeagain.com">напиши мені</a>.
        </p>
      )}
      <Button type="submit" disabled={!token || busy}>
        {busy ? 'Надсилаю…' : 'Надіслати посилання для входу'}
      </Button>
      {error && <p role="alert">{error}</p>}
      <noscript>Для входу увімкни JavaScript.</noscript>
    </form>
  );
}
