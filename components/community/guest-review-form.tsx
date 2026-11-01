'use client';
/* oxlint-disable next/no-img-element -- local blob previews must appear immediately without an image optimizer */
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from 'react';
import { Check, ImagePlus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AppLocale } from '@/lib/i18n/config';
import type { NewsletterSignup } from '@/lib/newsletter/config';
import { NewsletterInvitation } from '@/components/site/newsletter-invitation';
import { validPhotoMime } from '@/lib/community/photo-constraints';
import {
  preparePhoto,
  randomSecret,
  type PreparedPhoto,
} from '@/lib/community/client';
import { loadTurnstile, type Turnstile } from '@/lib/security/turnstile-client';
import fields from '@/components/account/account.module.css';
import { reviewFormMessages } from './review-form.messages';
import styles from './guest-review-form.module.css';

export interface GuestReviewDraft {
  contribution: {
    recipeId: string;
    name: string;
    email: string;
    text: string;
    rating: number | null;
    operationId: string;
    authorToken: string;
  };
  photos: { id: string; uploadToken: string; photo: PreparedPhoto }[];
  /** Turnstile token; empty in the Design Lab simulation. */
  token: string;
}
export interface GuestReviewResult {
  status: 'published' | 'pending';
  photosAccepted: boolean;
}
interface PreviewPhoto {
  id: string;
  uploadToken: string;
  name: string;
  url?: string;
  prepared?: PreparedPhoto;
  error?: string;
}

/** The adapter performs the network work; Design Lab injects a simulation.
 * With challengeSiteKey the form renders Turnstile and passes its token on.
 */
export function GuestReviewForm({
  locale = 'uk',
  recipeId,
  recipeTitle,
  submitReview,
  challengeSiteKey,
  signup,
  onPublished,
  demo = false,
  layout = 'stacked',
}: {
  locale?: AppLocale;
  recipeId: string;
  recipeTitle?: string;
  submitReview?: (draft: GuestReviewDraft) => Promise<GuestReviewResult>;
  challengeSiteKey?: string;
  /** Real newsletter destination for the after-review invitation. */
  signup?: NewsletterSignup;
  onPublished?: () => void;
  demo?: boolean;
  /** `wide`: full section width, compact three-row grid on large containers. */
  layout?: 'stacked' | 'wide';
}) {
  const copy = reviewFormMessages[locale];
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const noticeRef = useRef<HTMLParagraphElement>(null);
  const challenge = useRef<HTMLDivElement>(null);
  const urls = useRef(new Set<string>());
  const inFlight = useRef(false);
  const operation = useRef<{
    fingerprint: string;
    operationId: string;
    authorToken: string;
  } | null>(null);
  const [invitationOpen, setInvitationOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [photos, setPhotos] = useState<PreviewPhoto[]>([]);
  const [photoError, setPhotoError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<
    'editing' | 'sending' | 'error' | 'published' | 'pending'
  >('editing');
  const [errorMessage, setErrorMessage] = useState('');
  const [photosAccepted, setPhotosAccepted] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [challengeFailed, setChallengeFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [publishedEmail, setPublishedEmail] = useState('');
  useEffect(() => {
    const active = urls.current;
    return () => {
      for (const url of active) URL.revokeObjectURL(url);
      active.clear();
    };
  }, []);
  const busy = state === 'sending';
  // The last result stays visible while the cleared form takes the next review.
  const done = state === 'published' || state === 'pending';
  const preparing = photos.some((photo) => !photo.prepared && !photo.error);
  useEffect(() => {
    if (done && !invitationOpen) noticeRef.current?.focus();
  }, [done, invitationOpen]);

  // A Turnstile token is single-use: every attempt renders a fresh widget.
  useEffect(() => {
    if (!challengeSiteKey || !submitReview) return;
    let disposed = false;
    let widget: string | undefined;
    let api: Turnstile | undefined;
    const invalidate = () => {
      if (!disposed) {
        setToken(null);
        setChallengeFailed(true);
      }
    };
    void (async () => {
      try {
        api = await loadTurnstile();
        if (disposed || !challenge.current) return;
        widget = api.render(challenge.current, {
          sitekey: challengeSiteKey,
          action: 'community_review',
          language: locale,
          size: 'flexible',
          theme: 'auto',
          appearance: 'interaction-only',
          callback: (value: string) => {
            if (!disposed) {
              setToken(value);
              setChallengeFailed(false);
            }
          },
          'expired-callback': () => !disposed && setToken(null),
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
  }, [challengeSiteKey, submitReview, attempt, locale]);

  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = '';
    const added: { photo: PreviewPhoto; file: File }[] = [];
    let problem = '';
    for (const file of files) {
      if (photos.length + added.length >= 3) {
        problem = copy.photoLimit;
        break;
      }
      if (!validPhotoMime(file.type)) {
        problem = copy.photoFormat;
        continue;
      }
      added.push({
        file,
        photo: {
          id: crypto.randomUUID(),
          uploadToken: randomSecret(),
          name: file.name,
        },
      });
    }
    setPhotos((previous) => [...previous, ...added.map(({ photo }) => photo)]);
    setPhotoError(problem);
    for (const { file, photo } of added)
      void preparePhoto(file).then(
        (prepared) => {
          const url = URL.createObjectURL(prepared.blob);
          urls.current.add(url);
          updatePhoto(photo.id, { prepared, url });
        },
        (error: unknown) =>
          updatePhoto(photo.id, {
            error:
              error instanceof Error && error.message === 'PHOTO_SIZE'
                ? copy.photoSize
                : copy.photoDecode,
          }),
      );
  }
  function updatePhoto(photoId: string, patch: Partial<PreviewPhoto>) {
    setPhotos((previous) =>
      previous.map((photo) =>
        photo.id === photoId ? { ...photo, ...patch } : photo,
      ),
    );
  }
  function removePhoto(photo: PreviewPhoto) {
    if (photo.url) {
      URL.revokeObjectURL(photo.url);
      urls.current.delete(photo.url);
    }
    setPhotos((previous) => previous.filter((item) => item.id !== photo.id));
    setPhotoError('');
    addRef.current?.focus();
  }
  function clearFieldError(field: string) {
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  }
  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || !submitReview) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const read = (key: string) => {
      const value = values.get(key);
      return typeof value === 'string' ? value.trim() : '';
    };
    const name = read('name');
    const email = read('email');
    const text = read('text');
    // Same order as the fields, so focus lands on the first invalid one.
    const invalid: Record<string, string> = {};
    if (!text || Array.from(text).length > 2000)
      invalid.text = copy.requiredText;
    if (Array.from(name).length < 2 || Array.from(name).length > 60)
      invalid.name = copy.requiredName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email))
      invalid.email = copy.requiredEmail;
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      (
        form.elements.namedItem(Object.keys(invalid)[0]) as HTMLElement
      )?.focus();
      return;
    }
    if (photos.some((photo) => photo.error)) {
      setPhotoError(copy.photoInvalid);
      addRef.current?.focus();
      return;
    }
    if (preparing || (challengeSiteKey && !token)) return;
    const payload = { recipeId, name, email, text, rating };
    const fingerprint = JSON.stringify([
      payload,
      photos.map((photo) => photo.id),
    ]);
    // Same content keeps the same operation, so a lost response is replayed.
    if (!operation.current || operation.current.fingerprint !== fingerprint)
      operation.current = {
        fingerprint,
        operationId: crypto.randomUUID(),
        authorToken: randomSecret(),
      };
    try {
      inFlight.current = true;
      setState('sending');
      const result = await submitReview({
        contribution: {
          ...payload,
          operationId: operation.current.operationId,
          authorToken: operation.current.authorToken,
        },
        photos: photos.map(({ id: photoId, uploadToken, prepared }) => ({
          id: photoId,
          uploadToken,
          photo: prepared!,
        })),
        token: token ?? '',
      });
      if (!['published', 'pending'].includes(result.status))
        throw new Error('INCOMPLETE_SUBMISSION');
      setState(result.status);
      setPhotosAccepted(photos.length === 0 || result.photosAccepted);
      form.reset();
      setRating(null);
      for (const photo of photos) if (photo.url) URL.revokeObjectURL(photo.url);
      urls.current.clear();
      setPhotos([]);
      setPhotoError('');
      operation.current = null;
      setToken(null);
      setAttempt((value) => value + 1);
      if (result.status === 'published') {
        setPublishedEmail(email);
        onPublished?.();
        setInvitationOpen(true);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message === 'RATE_LIMITED'
          ? copy.rateLimited
          : copy.failed,
      );
      setState('error');
      setToken(null);
      setAttempt((value) => value + 1);
    } finally {
      inFlight.current = false;
    }
  }
  const notice =
    state === 'published'
      ? photosAccepted
        ? copy.published
        : copy.publishedWithoutPhotos
      : state === 'pending'
        ? copy.pending
        : state === 'error'
          ? errorMessage
          : '';
  return (
    <>
      <form
        className={`${styles.form}${layout === 'wide' ? ` ${styles.wide}` : ''}`}
        lang={locale}
        onSubmit={submit}
        noValidate
        aria-labelledby={`${id}-title`}
        data-guest-review-form={locale}
      >
        <header className={styles.heading}>
          <div className={styles.titleRow}>
            <h3 id={`${id}-title`}>{copy.title}</h3>
            <fieldset className={styles.ratingField} disabled={busy}>
              <legend className={styles.visuallyHidden}>
                {copy.rating} ({copy.optional})
              </legend>
              <div className={styles.ratingRow}>
                <div className={styles.stars}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label key={value} className={styles.star}>
                      <input
                        type="radio"
                        name="rating"
                        value={value}
                        checked={rating === value}
                        onChange={() => setRating(value)}
                        aria-label={`${value} ${copy.ofFive}`}
                      />
                      <span>{value}</span>
                      <Star aria-hidden="true" size={16} />
                    </label>
                  ))}
                </div>
                {rating !== null && (
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setRating(null)}
                  >
                    {copy.clear}
                  </Button>
                )}
              </div>
            </fieldset>
          </div>
          {recipeTitle && <p className={styles.recipe}>{recipeTitle}</p>}
          <p>{copy.intro}</p>
        </header>
        {demo && <p className={styles.demo}>{copy.demo}</p>}
        <fieldset className={styles.controls} disabled={busy}>
          <fieldset
            className={`${styles.choice} ${styles.photoField}`}
            aria-describedby={`${id}-photo-hint`}
          >
            <legend>
              {copy.photos}{' '}
              <span className={styles.hint}>({copy.photoCount})</span>
            </legend>
            <p id={`${id}-photo-hint`} className={styles.hint}>
              {copy.photoHint}
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              hidden
              onChange={addPhotos}
              aria-label={copy.addPhotos}
            />
            <Button
              ref={addRef}
              type="button"
              variant="outline"
              disabled={photos.length >= 3}
              onClick={() => fileRef.current?.click()}
              aria-describedby={`${id}-photo-hint`}
            >
              <ImagePlus aria-hidden="true" />
              {copy.addPhotos}
            </Button>
            {photos.length > 0 && (
              <ul className={styles.photos}>
                {photos.map((photo, index) => (
                  <li key={photo.id} className={styles.photo}>
                    {photo.url ? (
                      <img
                        src={photo.url}
                        alt={`${copy.preview} ${index + 1}`}
                      />
                    ) : (
                      <span className={styles.photoPlaceholder} />
                    )}
                    <span className={styles.filename}>{photo.name}</span>
                    <span className={photo.error ? styles.error : styles.hint}>
                      {photo.error ||
                        (busy
                          ? copy.sending
                          : photo.prepared
                            ? copy.ready
                            : copy.preparing)}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      aria-label={`${copy.removePhoto} ${index + 1}`}
                      onClick={() => removePhoto(photo)}
                    >
                      {copy.removePhoto}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            <output className={styles.error} aria-live="polite">
              {photoError}
            </output>
          </fieldset>
          <div className={`${fields.field} ${styles.textField}`}>
            {/* The intro already asks this; keep the name for screen readers. */}
            <label htmlFor={`${id}-text`} className={styles.visuallyHidden}>
              {copy.text}
            </label>
            <textarea
              id={`${id}-text`}
              name="text"
              onChange={() => clearFieldError('text')}
              rows={5}
              maxLength={2000}
              required
              aria-invalid={!!errors.text}
              aria-describedby={errors.text ? `${id}-text-error` : undefined}
            />
            {errors.text && (
              <span id={`${id}-text-error`} className={styles.error}>
                {errors.text}
              </span>
            )}
          </div>
          <div className={styles.identity}>
            <div className={fields.field}>
              <label htmlFor={`${id}-name`}>{copy.name}</label>
              <input
                id={`${id}-name`}
                name="name"
                onChange={() => clearFieldError('name')}
                autoComplete="name"
                maxLength={60}
                required
                aria-invalid={!!errors.name}
                aria-describedby={`${id}-name-hint${errors.name ? ` ${id}-name-error` : ''}`}
              />
              <span id={`${id}-name-hint`} className={styles.hint}>
                {copy.nameHint}
              </span>
              {errors.name && (
                <span id={`${id}-name-error`} className={styles.error}>
                  {errors.name}
                </span>
              )}
            </div>
            <div className={fields.field}>
              <label htmlFor={`${id}-email`}>{copy.email}</label>
              <input
                id={`${id}-email`}
                type="email"
                name="email"
                onChange={() => clearFieldError('email')}
                autoComplete="email"
                inputMode="email"
                maxLength={254}
                required
                aria-invalid={!!errors.email}
                aria-describedby={`${id}-email-hint${errors.email ? ` ${id}-email-error` : ''}`}
              />
              <span id={`${id}-email-hint`} className={styles.hint}>
                {copy.emailHint}
              </span>
              {errors.email && (
                <span id={`${id}-email-error`} className={styles.error}>
                  {errors.email}
                </span>
              )}
            </div>
            <div className={styles.submitCell}>
              <Button
                type="submit"
                className={styles.submit}
                disabled={
                  !submitReview ||
                  busy ||
                  preparing ||
                  (!!challengeSiteKey && !token)
                }
              >
                {busy
                  ? copy.sending
                  : state === 'error'
                    ? copy.tryAgain
                    : copy.submit}
              </Button>
            </div>
          </div>
        </fieldset>
        {challengeSiteKey && submitReview && (
          <div ref={challenge} className={styles.challenge} />
        )}
        {challengeFailed && (
          <p className={styles.error} role="alert">
            {copy.challengeFailed}
          </p>
        )}
        <p
          ref={noticeRef}
          tabIndex={-1}
          className={notice ? styles.notice : styles.emptyNotice}
          role={state === 'error' ? 'alert' : 'status'}
        >
          {done && <Check aria-hidden="true" size={20} />}
          {notice}
        </p>
        {!submitReview && <p className={styles.hint}>{copy.unavailable}</p>}
      </form>
      <NewsletterInvitation
        locale={locale}
        signup={signup}
        afterReview={{
          open: invitationOpen,
          onOpenChange: setInvitationOpen,
          returnFocus: noticeRef,
          email: publishedEmail,
        }}
      />
    </>
  );
}
