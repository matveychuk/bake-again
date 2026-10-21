'use client';

/* oxlint-disable next/no-html-link-for-pages -- Native links follow the existing vinext compatibility contract. */

import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccount } from '@/components/account/account-provider';
import type { AppLocale } from '@/lib/i18n/config';
import type { NewsletterSignup } from '@/lib/newsletter/config';
import {
  brevoAccepted,
  brevoSignupEndpoint,
  brevoSiteKeys,
} from '@/lib/newsletter/inline-signup';
import { loadTurnstile, type Turnstile } from '@/lib/security/turnstile-client';
import { trackEvent } from '@/lib/analytics/umami';
import type { MagnetId } from '@/lib/newsletter/magnets';
import fieldStyles from '@/components/account/account.module.css';
import styles from './newsletter-form.module.css';

type Copy = {
  label: string;
  email: string;
  sendTo: string;
  otherEmail: string;
  consent: string;
  privacy: string;
  submit: string;
  sending: string;
  doneTitle: string;
  doneBody: (email: string) => string;
  doneHint: string;
  restart: string;
  error: string;
  verifyFailed: string;
  verifyRetry: string;
  openProvider: string;
  noscript: string;
  preview: string;
};

const messages: Record<AppLocale, Copy> = {
  uk: {
    label: 'Підписатися на нові рецепти',
    email: 'Електронна пошта',
    sendTo: 'Надішлемо лист на',
    otherEmail: 'Інша адреса',
    consent:
      'Підписуючись, ви погоджуєтеся отримувати рецепти й матеріали Bake Again українською. Відписатися можна будь-коли. Дані обробляє Brevo.',
    privacy: 'Приватність',
    submit: 'Підписатися',
    sending: 'Надсилаємо…',
    doneTitle: 'Перевірте пошту',
    doneBody: (email) =>
      `Ми надіслали лист на ${email}. Натисніть у ньому кнопку підтвердження — без цього розсилка не почнеться.`,
    doneHint:
      'Якщо листа немає за кілька хвилин, зазирніть у «Промоакції» або «Спам».',
    restart: 'Ввести іншу адресу',
    error: 'Не вдалося надіслати запит. Перевірте з’єднання й спробуйте ще раз.',
    verifyFailed: 'Не вдалося завершити перевірку.',
    verifyRetry: 'Повторити перевірку',
    openProvider: 'Відкрити форму Brevo',
    noscript: 'Для цієї форми потрібен JavaScript.',
    preview: 'Перегляд форми — без надсилання й перевірки Turnstile.',
  },
  es: {
    label: 'Suscribirme a nuevas recetas',
    email: 'Correo electrónico',
    sendTo: 'Enviaremos el correo a',
    otherEmail: 'Otra dirección',
    consent:
      'Al suscribirte, aceptas recibir recetas y recursos de Bake Again en español. Puedes darte de baja en cualquier momento. Brevo trata tus datos.',
    privacy: 'Privacidad',
    submit: 'Suscribirme',
    sending: 'Enviando…',
    doneTitle: 'Revisa tu correo',
    doneBody: (email) =>
      `Hemos enviado un correo a ${email}. Pulsa el botón de confirmación: sin ese paso la suscripción no se activa.`,
    doneHint:
      'Si no llega en unos minutos, mira en «Promociones» o «Spam».',
    restart: 'Usar otra dirección',
    error:
      'No se ha podido enviar la solicitud. Revisa la conexión e inténtalo de nuevo.',
    verifyFailed: 'No se ha podido completar la verificación.',
    verifyRetry: 'Repetir la verificación',
    openProvider: 'Abrir el formulario de Brevo',
    noscript: 'Este formulario necesita JavaScript.',
    preview: 'Vista previa: sin envío ni verificación Turnstile.',
  },
  en: {
    label: 'Subscribe to new recipes',
    email: 'Email address',
    sendTo: 'We’ll send the email to',
    otherEmail: 'Use another address',
    consent:
      'By subscribing, you agree to receive Bake Again recipes and resources in English. Unsubscribe at any time. Brevo processes your data.',
    privacy: 'Privacy',
    submit: 'Subscribe',
    sending: 'Sending…',
    doneTitle: 'Check your inbox',
    doneBody: (email) =>
      `We sent an email to ${email}. Click its confirmation button — your subscription only starts after that.`,
    doneHint:
      'If it hasn’t arrived in a few minutes, check Promotions or Spam.',
    restart: 'Use another address',
    error:
      'The request could not be sent. Check your connection and try again.',
    verifyFailed: 'The check could not be completed.',
    verifyRetry: 'Retry the check',
    openProvider: 'Open the Brevo form',
    noscript: 'This form needs JavaScript.',
    preview: 'Form preview: no submission or Turnstile check.',
  },
};

// The UK lead magnet keeps its informal voice and promises the PDF.
const magnetCopy: Partial<Copy> = {
  label: 'Отримати PDF-рецепт на пошту',
  sendTo: 'Надішлемо рецепт на',
  consent:
    'Підписуючись, ти погоджуєшся отримувати рецепти й матеріали Bake Again українською. Відписатися можна будь-коли. Дані обробляє Brevo.',
  submit: 'Отримати рецепт',
  doneTitle: 'Перевір пошту',
  doneBody: (email) =>
    `Перевір ${email}. Якщо ти вже маєш активну підписку, шукай лист із запитаними матеріалами. Якщо підписуєшся вперше — спочатку підтвердь email за кнопкою в листі.`,
  doneHint: 'Якщо листа немає, зазирни в «Промоакції» або «Спам».',
  error: 'Не вдалося надіслати запит. Перевір з’єднання й спробуй ще раз.',
};

/**
 * Inline variant of the hosted per-locale Brevo forms: provider-owned DOI and
 * audience lists. A signed-in reader subscribes their account address in one
 * click; the provider still confirms it by email.
 */
export function NewsletterForm({
  signup,
  locale = 'uk',
  magnetId,
  note,
  preview = false,
  previewEmail,
  recipeSiteKey,
  onSent,
}: {
  signup?: NewsletterSignup;
  locale?: AppLocale;
  magnetId?: MagnetId;
  recipeSiteKey?: string;
  note?: string;
  preview?: boolean;
  /** Design Lab only: render the signed-in variant without an account. */
  previewEmail?: string;
  onSent?: () => void;
}) {
  const copy = { ...messages[locale], ...(magnetId ? magnetCopy : {}) };
  const account = useAccount();
  const accountEmail = previewEmail ?? (account.identity ? account.email : null);
  const challenge = useRef<HTMLDivElement>(null);
  const doneHeading = useRef<HTMLHeadingElement>(null);
  const busy = useRef(false);
  const [useOther, setUseOther] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const endpoint = magnetId ? (recipeSiteKey ? '/api/newsletter/recipe' : null) : signup && brevoSignupEndpoint(signup.url);
  const knownEmail = useOther ? null : accountEmail;
  const succeeded = sentTo !== null;

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
          sitekey: magnetId ? recipeSiteKey : brevoSiteKeys[locale],
          ...(magnetId ? {action:'recipe_request'} : {}),
          language: locale,
          size: 'flexible',
          theme: 'auto',
          // Most readers pass silently; show the widget only when it needs a click.
          appearance: 'interaction-only',
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
  }, [endpoint, preview, attempt, succeeded, locale, magnetId, recipeSiteKey]);

  useEffect(() => {
    if (succeeded) doneHeading.current?.focus();
  }, [succeeded]);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (preview || !endpoint || !token || busy.current || succeeded) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const body = new FormData(form);
    const email = String(body.get('EMAIL') ?? '').trim();
    if (!email) return;
    body.set('EMAIL', email);
    body.set('g-recaptcha-response', token);
    body.set('cf-turnstile-response', token);
    // Matches the provider export: locale is Brevo's form locale, not the audience list.
    body.set('locale', 'es');
    busy.current = true;
    setStatus('sending');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        ...(magnetId ? { headers:{'content-type':'application/json'}, body:JSON.stringify({email,magnet:magnetId,token,consent:true,website:body.get('email_address_check')}) } : {body}),
        signal: AbortSignal.timeout(30_000),
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
      });
      const result = await response.json();
      if (!response.ok || !(magnetId ? !!result && typeof result==='object' && 'ok' in result && result.ok===true : brevoAccepted(result)))
        throw new Error('Signup unavailable');
      setStatus('idle');
      setSentTo(email);
      onSent?.();
      trackEvent(
        magnetId ? 'lead_magnet_submit' : 'newsletter_submit',
        magnetId ? { magnet: magnetId } : { locale },
      );
    } catch {
      setStatus('error');
      setAttempt((value) => value + 1);
    } finally {
      busy.current = false;
      setToken(null);
    }
  }

  if (succeeded)
    return (
      <div className={styles.done} lang={locale}>
        <MailCheck size={24} aria-hidden="true" className={styles.doneIcon} />
        <div>
          <h2 ref={doneHeading} tabIndex={-1} className={styles.doneTitle}>
            {copy.doneTitle}
          </h2>
          <p>{copy.doneBody(sentTo)}</p>
          <p className={styles.small}>{copy.doneHint}</p>
          <Button
            variant="link"
            type="button"
            onClick={() => {
              setSentTo(null);
              setUseOther(true);
            }}
          >
            {copy.restart}
          </Button>
        </div>
      </div>
    );

  const consentId = `newsletter-consent-${locale}${magnetId ? `-${magnetId}` : ''}`;
  return (
    <form
      className={styles.form}
      method="post"
      action={magnetId ? '/api/newsletter/recipe' : signup?.url}
      onSubmit={submit}
      lang={locale}
      aria-label={copy.label}
      aria-busy={status === 'sending'}
    >
      {knownEmail ? (
        <div className={styles.known}>
          <input type="hidden" name="EMAIL" value={knownEmail} />
          <p>
            {copy.sendTo} <strong>{knownEmail}</strong>
          </p>
          <Button
            variant="link"
            type="button"
            onClick={() => setUseOther(true)}
          >
            {copy.otherEmail}
          </Button>
        </div>
      ) : (
        <label className={fieldStyles.field}>
          {copy.email}
          <input
            name="EMAIL"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            disabled={status === 'sending'}
            autoFocus={useOther}
            aria-describedby={consentId}
          />
        </label>
      )}
      <input
        type="text"
        name="email_address_check"
        defaultValue=""
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
        autoComplete="off"
      />
      <p id={consentId} className={styles.small}>
        {copy.consent} <a href={`/${locale}/privacy`}>{copy.privacy}</a>.
      </p>
      {!preview && <div ref={challenge} />}
      {preview && <p className={styles.small}>{copy.preview}</p>}
      {verificationFailed && (
        <div>
          <p>{copy.verifyFailed}</p>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              setToken(null);
              setVerificationFailed(false);
              setAttempt((value) => value + 1);
            }}
          >
            {copy.verifyRetry}
          </Button>
          {signup && !magnetId && (
            <p>
              <a href={signup.url}>{copy.openProvider}</a>
            </p>
          )}
        </div>
      )}
      <Button
        type="submit"
        disabled={preview || !token || status === 'sending' || !endpoint}
      >
        {status === 'sending' ? copy.sending : copy.submit}
      </Button>
      <output aria-live="polite">
        {status === 'error' && <p>{copy.error}</p>}
      </output>
      {note && <p className={styles.small}>{note}</p>}
      {!preview && (
        <noscript>
          <p>
            {copy.noscript}{' '}
            {signup && !magnetId && <a href={signup.url}>{copy.openProvider}</a>}
          </p>
        </noscript>
      )}
    </form>
  );
}
