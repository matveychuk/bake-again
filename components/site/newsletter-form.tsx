'use client';
import { trackMetaLead } from '@/lib/analytics/meta';

/* oxlint-disable next/no-html-link-for-pages -- Native links follow the existing vinext compatibility contract. */

import { useEffect, useId, useRef, useState, type SubmitEvent } from 'react';
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
import { getRecipeInvitation } from '@/content/lead-magnets';
import type { MagnetId } from '@/lib/newsletter/magnets';
import fieldStyles from '@/components/account/account.module.css';
import styles from './newsletter-form.module.css';

/** Which promise the form makes; a magnet always means the PDF scenario. */
export type NewsletterScenario = 'recipes' | 'lesson' | 'pdf';

type Copy = {
  label: Record<NewsletterScenario, string>;
  email: string;
  placeholder: string;
  sendTo: string;
  otherEmail: string;
  footnote: string;
  privacy: string;
  submit: Record<NewsletterScenario, string>;
  sending: string;
  doneTitle: string;
  doneBody: string;
  donePdf: (email: string) => string;
  doneHint: string;
  close: string;
  error: string;
  verifyFailed: string;
  verifyRetry: string;
  openProvider: string;
  noscript: string;
  preview: string;
};

const messages: Record<AppLocale, Copy> = {
  uk: {
    label: {
      recipes: 'Підписка на нові рецепти',
      lesson: 'Список очікування відеоуроку',
      pdf: 'PDF на пошту',
    },
    email: 'Email',
    placeholder: 'Твій email',
    sendTo: 'Надішлю на',
    otherEmail: 'Інша адреса',
    footnote: 'Без спаму. Відписатися — одним кліком.',
    privacy: 'Приватність',
    submit: {
      recipes: 'Хочу рецепти',
      lesson: 'Хочу урок',
      pdf: 'Надіслати PDF',
    },
    sending: 'Надсилаю…',
    doneTitle: 'Дякую!',
    doneBody: 'Перший лист уже в дорозі.',
    donePdf: (email) => `PDF уже летить на ${email}.`,
    doneHint: 'Немає за кілька хвилин — глянь у «Спам» або «Промоакції».',
    close: 'Закрити',
    error: 'Не вийшло надіслати. Спробуй ще раз.',
    verifyFailed: 'Не вийшло перевірити, що ти не робот.',
    verifyRetry: 'Спробувати ще раз',
    openProvider: 'Відкрити форму Brevo',
    noscript: 'Для цієї форми потрібен JavaScript.',
    preview: 'Перегляд форми — без надсилання й перевірки Turnstile.',
  },
  es: {
    label: {
      recipes: 'Suscripción a nuevas recetas',
      lesson: 'Lista de espera de la videoclase',
      pdf: 'PDF por correo',
    },
    email: 'Correo electrónico',
    placeholder: 'Tu correo',
    sendTo: 'Te lo envío a',
    otherEmail: 'Otra dirección',
    footnote: 'Sin spam. Te das de baja con un clic.',
    privacy: 'Privacidad',
    submit: {
      recipes: 'Quiero recetas',
      lesson: 'Avísame',
      pdf: 'Enviarme el PDF',
    },
    sending: 'Enviando…',
    doneTitle: '¡Gracias!',
    doneBody: 'El primer correo ya va de camino.',
    donePdf: (email) => `El PDF va de camino a ${email}.`,
    doneHint: '¿No llega en unos minutos? Mira en «Spam» o «Promociones».',
    close: 'Cerrar',
    error: 'No se ha podido enviar. Inténtalo de nuevo.',
    verifyFailed: 'No se ha podido comprobar que no eres un robot.',
    verifyRetry: 'Reintentar',
    openProvider: 'Abrir el formulario de Brevo',
    noscript: 'Este formulario necesita JavaScript.',
    preview: 'Vista previa: sin envío ni verificación Turnstile.',
  },
  en: {
    label: {
      recipes: 'Subscribe to new recipes',
      lesson: 'Video lesson waiting list',
      pdf: 'PDF by email',
    },
    email: 'Email address',
    placeholder: 'Your email',
    sendTo: 'I’ll send it to',
    otherEmail: 'Use another address',
    footnote: 'No spam. Unsubscribe in one click.',
    privacy: 'Privacy',
    submit: {
      recipes: 'Send me recipes',
      lesson: 'Notify me',
      pdf: 'Send me the PDF',
    },
    sending: 'Sending…',
    doneTitle: 'Thanks!',
    doneBody: 'Your first email is on its way.',
    donePdf: (email) => `The PDF is on its way to ${email}.`,
    doneHint: 'Not there in a few minutes? Check Spam or Promotions.',
    close: 'Close',
    error: 'Couldn’t send. Please try again.',
    verifyFailed: 'We couldn’t check you’re not a robot.',
    verifyRetry: 'Try again',
    openProvider: 'Open the Brevo form',
    noscript: 'This form needs JavaScript.',
    preview: 'Form preview: no submission or Turnstile check.',
  },
};

/**
 * Inline variant of the hosted per-locale Brevo forms: provider-owned automation and
 * audience lists. A signed-in reader subscribes their account address in one
 * click; the provider owns automation delivery, without DOI.
 */
export function NewsletterForm({
  signup,
  locale = 'uk',
  magnetId,
  scenario = 'recipes',
  preview = false,
  previewEmail,
  recipeSiteKey,
  placement = 'landing',
  onSent,
  onClose,
  defaultEmail,
}: {
  signup?: NewsletterSignup;
  locale?: AppLocale;
  magnetId?: MagnetId;
  /** Ignored with a magnet, which always promises its PDF. */
  scenario?: Exclude<NewsletterScenario, 'pdf'>;
  recipeSiteKey?: string;
  placement?: import('@/lib/newsletter/single-opt-in').SubscriptionPlacement;
  preview?: boolean;
  /** Design Lab only: render the signed-in variant without an account. */
  previewEmail?: string;
  onSent?: () => void;
  /** Dialogs only: shows a Close button after a successful signup. */
  onClose?: () => void;
  /** Editable prefill, e.g. the address just entered in a review. */
  defaultEmail?: string;
}) {
  const formId = useId();
  const kind: NewsletterScenario = magnetId ? 'pdf' : scenario;
  const copy = messages[locale];
  const invitation = getRecipeInvitation('crepes', locale);
  const submitLabel =
    invitation && magnetId === invitation.magnetId
      ? invitation.submit
      : copy.submit[kind];
  const account = useAccount();
  const accountEmail =
    previewEmail ?? (account.identity ? account.email : null);
  const challenge = useRef<HTMLDivElement>(null);
  const doneHeading = useRef<HTMLHeadingElement>(null);
  const busy = useRef(false);
  const [useOther, setUseOther] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const endpoint = magnetId
    ? recipeSiteKey
      ? '/api/newsletter/recipe'
      : null
    : signup && brevoSignupEndpoint(signup.url);
  const knownEmail = useOther ? null : accountEmail;
  const succeeded = sentTo !== null;

  useEffect(() => {
    if (preview || !endpoint || succeeded) return;
    let disposed = false;
    let widget: string | undefined;
    let api: Turnstile | undefined;
    const expire = () => {
      if (!disposed) setToken(null);
    };
    // Shown only when the check really failed, not when a token expired.
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
          ...(magnetId ? { action: 'recipe_request' } : {}),
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
          'expired-callback': expire,
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

  const emailField = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (useOther) emailField.current?.focus();
  }, [useOther]);

  useEffect(() => {
    if (succeeded) doneHeading.current?.focus();
  }, [succeeded]);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (preview || !endpoint || !token || busy.current || succeeded) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const body = new FormData(form);
    const submittedEmail = body.get('EMAIL');
    const email =
      typeof submittedEmail === 'string' ? submittedEmail.trim() : '';
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
        ...(magnetId
          ? {
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({
                email,
                magnet: magnetId,
                placement,
                token,
                consent: true,
                website: body.get('email_address_check'),
              }),
            }
          : { body }),
        signal: AbortSignal.timeout(30_000),
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
      });
      const result = await response.json();
      if (
        !response.ok ||
        !(magnetId
          ? !!result &&
            typeof result === 'object' &&
            'ok' in result &&
            result.ok === true
          : brevoAccepted(result))
      )
        throw new Error('Signup unavailable');
      setStatus('idle');
      setSentTo(email);
      onSent?.();
      trackEvent(
        magnetId ? 'lead_magnet_submit' : 'newsletter_submit',
        magnetId ? { magnet: magnetId } : { locale },
      );
      trackMetaLead({ magnetId, scenario, placement });
    } catch {
      setStatus('error');
      setAttempt((value) => value + 1);
    } finally {
      busy.current = false;
      setToken(null);
    }
  }

  const DoneHeading = placement === 'recipe' ? 'h4' : 'h2';
  if (succeeded)
    return (
      <div className={styles.done} lang={locale}>
        <MailCheck size={24} aria-hidden="true" className={styles.doneIcon} />
        <div>
          <DoneHeading
            ref={doneHeading}
            tabIndex={-1}
            className={styles.doneTitle}
          >
            {copy.doneTitle}
          </DoneHeading>
          <p>{kind === 'pdf' ? copy.donePdf(sentTo) : copy.doneBody}</p>
          <p className={styles.small}>{copy.doneHint}</p>
          {onClose && (
            <Button variant="outline" type="button" onClick={onClose}>
              {copy.close}
            </Button>
          )}
        </div>
      </div>
    );

  const footnoteId = `newsletter-footnote-${formId}`;
  return (
    <form
      className={styles.form}
      method="post"
      action={magnetId ? '/api/newsletter/recipe' : signup?.url}
      onSubmit={submit}
      lang={locale}
      aria-label={
        invitation && magnetId === invitation.magnetId
          ? invitation.title
          : copy.label[kind]
      }
      aria-busy={status === 'sending'}
    >
      {knownEmail ? (
        <div className={styles.known}>
          <input type="hidden" name="EMAIL" value={knownEmail} />
          <p>
            {copy.sendTo} <strong>{knownEmail}</strong>
          </p>
          <span aria-hidden="true">·</span>
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
          <span className="sr-only">{copy.email}</span>
          <input
            name="EMAIL"
            type="email"
            autoComplete="email"
            placeholder={copy.placeholder}
            defaultValue={defaultEmail}
            required
            maxLength={254}
            disabled={status === 'sending'}
            ref={emailField}
            aria-describedby={footnoteId}
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
      {!preview && <div ref={challenge} className={styles.challenge} />}
      {preview && <p className={styles.small}>{copy.preview}</p>}
      {verificationFailed && (
        <div className={styles.verify} role="alert">
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
        </div>
      )}
      <Button
        type="submit"
        disabled={preview || !token || status === 'sending' || !endpoint}
      >
        {status === 'sending' ? copy.sending : submitLabel}
      </Button>
      <output aria-live="polite">
        {status === 'error' && <p>{copy.error}</p>}
      </output>
      <p id={footnoteId} className={`${styles.small} ${styles.footnote}`}>
        {copy.footnote} <a href={`/${locale}/privacy`}>{copy.privacy}</a>
      </p>
      {!preview && (
        <noscript>
          <p>
            {copy.noscript}{' '}
            {signup && !magnetId && (
              <a href={signup.url}>{copy.openProvider}</a>
            )}
          </p>
        </noscript>
      )}
    </form>
  );
}
