'use client';

/* oxlint-disable next/no-html-link-for-pages -- Native links follow the existing vinext compatibility contract. */

import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { Button } from '@/components/ui/button';
import type { NewsletterSignup } from '@/lib/newsletter/config';
import {
  brevoAccepted,
  brevoSignupEndpoint,
  brevoUkSiteKey,
} from '@/lib/newsletter/inline-signup';
import { loadTurnstile, type Turnstile } from '@/lib/security/turnstile-client';
import { trackEvent } from '@/lib/analytics/umami';
import fieldStyles from '@/components/account/account.module.css';
import styles from './newsletter-form.module.css';

/** Inline variant of the same hosted UK form: provider-owned DOI and audience lists. */
export function NewsletterForm({
  signup,
  magnetId,
  note,
  preview = false,
}: {
  signup?: NewsletterSignup;
  magnetId: 'shokolad';
  note?: string;
  preview?: boolean;
}) {
  const challenge = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const submitted = useRef(false);
  const [token, setToken] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');
  const endpoint = signup && brevoSignupEndpoint(signup.url);

  const succeeded = status === 'success';
  useEffect(() => {
    if (preview || !endpoint || succeeded) return;
    let disposed = false;
    let widget: string | undefined;
    let api: Turnstile | undefined;
    const invalidate = () => {
      if (!disposed) {
        setToken(null);
        setVerificationFailed(true);
      }
    };
    void (async () => {
      try {
        api = await loadTurnstile();
        if (disposed || !challenge.current) return;
        widget = api.render(challenge.current, {
          sitekey: brevoUkSiteKey,
          language: 'uk',
          size: 'flexible',
          theme: 'auto',
          callback: (value: string) => {
            if (!disposed) {
              setToken(value);
              setVerificationFailed(false);
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
      if (widget !== undefined) api?.remove(widget);
    };
  }, [endpoint, preview, attempt, succeeded]);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (preview || !endpoint || !token || busy.current || submitted.current)
      return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const body = new FormData(form);
    body.set('g-recaptcha-response', token);
    body.set('cf-turnstile-response', token);
    // Matches the provider export: locale is Brevo's form locale, not the audience list.
    body.set('locale', 'es');
    busy.current = true;
    setStatus('sending');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body,
        signal: AbortSignal.timeout(30_000),
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
      });
      if (!response.ok || !brevoAccepted(await response.json()))
        throw new Error('Signup unavailable');
      submitted.current = true;
      form.reset();
      setStatus('success');
      trackEvent('lead_magnet_submit', { magnet: magnetId });
    } catch {
      setStatus('error');
      setAttempt((value) => value + 1);
    } finally {
      busy.current = false;
      setToken(null);
    }
  }

  return (
    <form
      className={styles.form}
      method="post"
      action={signup?.url}
      onSubmit={submit}
      aria-label="Отримати PDF-рецепт на пошту"
      aria-busy={status === 'sending'}
    >
      {status !== 'success' && (
        <>
          <label className={fieldStyles.field}>
            Електронна пошта
            <input
              name="EMAIL"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              disabled={status === 'sending'}
              aria-describedby="newsletter-consent newsletter-delivery"
            />
          </label>
          <input
            type="text"
            name="email_address_check"
            defaultValue=""
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
            autoComplete="off"
          />
          <p id="newsletter-consent" className={styles.small}>
            Підписуючись, ти погоджуєшся отримувати рецепти й матеріали Bake
            Again українською. Відписатися можна будь-коли. Дані обробляє Brevo.{' '}
            <a href="/uk/privacy">Приватність</a>.
          </p>
          {!preview && <div ref={challenge} />}
          {preview && (
            <p className={styles.small}>
              Перегляд форми — без надсилання й перевірки Turnstile.
            </p>
          )}
          {verificationFailed && (
            <div>
              <p>Не вдалося завершити перевірку.</p>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setToken(null);
                  setVerificationFailed(false);
                  setAttempt((value) => value + 1);
                }}
              >
                Повторити перевірку
              </Button>
              {signup && (
                <p>
                  <a href={signup.url}>Відкрити форму Brevo</a>
                </p>
              )}
            </div>
          )}
          <Button
            type="submit"
            disabled={preview || !token || status === 'sending' || !endpoint}
          >
            {status === 'sending' ? 'Надсилаємо…' : 'Отримати рецепт'}
          </Button>
        </>
      )}
      <output aria-live="polite">
        {status === 'success' && (
          <p>Запит прийнято. Перевір пошту й підтвердь підписку в листі.</p>
        )}
        {status === 'error' && (
          <p>Не вдалося надіслати запит. Перевір з’єднання й спробуй ще раз.</p>
        )}
      </output>
      <p id="newsletter-delivery" className={styles.small}>
        {note}
      </p>
      {!preview && (
        <noscript>
          <p>
            Для цієї форми потрібен JavaScript.{' '}
            {signup && <a href={signup.url}>Відкрити форму Brevo</a>}
          </p>
        </noscript>
      )}
    </form>
  );
}
