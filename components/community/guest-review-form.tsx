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
import {
  parseGuestContribution,
  CommunityInputError,
  type GuestContribution,
} from '@/lib/community/contracts';
import {
  COMMUNITY_PHOTO_MAX_BYTES,
  validPhotoMime,
} from '@/lib/community/photo-constraints';
import fields from '@/components/account/account.module.css';
import { reviewFormMessages } from './review-form.messages';
import styles from './guest-review-form.module.css';

export interface GuestReviewDraft {
  contribution: GuestContribution;
  photos: { id: string; file: File }[];
}
export interface GuestReviewResult {
  status: 'published' | 'pending';
  photosAccepted: boolean;
}
interface PreviewPhoto {
  id: string;
  file: File;
  url: string;
  state: 'decoding' | 'ready';
  error?: string;
}

/** No account, provider SDK, persistence or network call inside this component.
 * A production adapter must preserve capabilities and perform admission/upload.
 * Design Lab injects an explicitly labelled local simulation of that adapter.
 */
export function GuestReviewForm({
  locale = 'uk',
  recipeId,
  recipeTitle,
  baseConfiguration = true,
  submitReview,
  demo = false,
}: {
  locale?: AppLocale;
  recipeId: string;
  recipeTitle?: string;
  baseConfiguration?: boolean;
  submitReview?: (draft: GuestReviewDraft) => Promise<GuestReviewResult>;
  demo?: boolean;
}) {
  const copy = reviewFormMessages[locale];
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const noticeRef = useRef<HTMLParagraphElement>(null);
  const urls = useRef(new Set<string>());
  const inFlight = useRef(false);
  const operation = useRef<{
    fingerprint: string;
    operationId: string;
    authorToken: string;
  } | null>(null);
  const [kind, setKind] = useState<'result' | 'question'>('result');
  const [experience, setExperience] = useState<'as-written' | 'changed'>(
    'as-written',
  );
  const [rating, setRating] = useState<number | null>(null);
  const [photos, setPhotos] = useState<PreviewPhoto[]>([]);
  const [photoError, setPhotoError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<
    'editing' | 'sending' | 'error' | 'published' | 'pending'
  >('editing');
  const [photosAccepted, setPhotosAccepted] = useState(false);
  useEffect(() => {
    const active = urls.current;
    return () => {
      for (const url of active) URL.revokeObjectURL(url);
      active.clear();
    };
  }, []);
  const busy = state === 'sending';
  const complete = state === 'published' || state === 'pending';
  useEffect(() => {
    if (complete) noticeRef.current?.focus();
  }, [complete]);
  const canRate =
    kind === 'result' && experience === 'as-written' && baseConfiguration;

  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = '';
    const added: PreviewPhoto[] = [];
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
      if (!file.size || file.size > COMMUNITY_PHOTO_MAX_BYTES) {
        problem = copy.photoSize;
        continue;
      }
      const url = URL.createObjectURL(file);
      urls.current.add(url);
      added.push({ id: crypto.randomUUID(), file, url, state: 'decoding' });
    }
    setPhotos((previous) => [...previous, ...added]);
    setPhotoError(problem);
  }
  function photoDecoded(photoId: string, problem?: string) {
    setPhotos((previous) =>
      previous.map((photo) =>
        photo.id === photoId
          ? { ...photo, state: 'ready', error: problem }
          : photo,
      ),
    );
  }
  function removePhoto(photo: PreviewPhoto) {
    URL.revokeObjectURL(photo.url);
    urls.current.delete(photo.url);
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
    if (inFlight.current || complete || !submitReview) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const read = (key: string) => {
      const value = values.get(key);
      return typeof value === 'string' ? value.trim() : '';
    };
    const name = read('name');
    const email = read('email');
    const text = read('text');
    const invalid: Record<string, string> = {};
    if (Array.from(name).length < 2 || Array.from(name).length > 60)
      invalid.name = copy.requiredName;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    if (
      !email ||
      !emailInput.validity.valid ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)
    )
      invalid.email = copy.requiredEmail;
    if (!text || Array.from(text).length > 2000)
      invalid.text = copy.requiredText;
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
    if (photos.some((photo) => photo.state === 'decoding')) return;
    const payload = {
      recipeId,
      name,
      email,
      text,
      kind,
      experience,
      rating: canRate ? rating : null,
      cooked: canRate && rating !== null,
    };
    const fingerprint = JSON.stringify([
      payload,
      photos.map((photo) => photo.id),
    ]);
    if (!operation.current || operation.current.fingerprint !== fingerprint) {
      const authorToken = Array.from(
        crypto.getRandomValues(new Uint8Array(32)),
        (byte) => byte.toString(16).padStart(2, '0'),
      ).join('');
      operation.current = {
        fingerprint,
        operationId: crypto.randomUUID(),
        authorToken,
      };
    }
    try {
      const contribution = parseGuestContribution({
        ...payload,
        operationId: operation.current.operationId,
        authorToken: operation.current.authorToken,
      });
      inFlight.current = true;
      setState('sending');
      const result = await submitReview({
        contribution,
        photos: photos.map(({ id, file }) => ({ id, file })),
      });
      if (
        !['published', 'pending'].includes(result.status) ||
        (photos.length > 0 && !result.photosAccepted)
      )
        throw new Error('INCOMPLETE_SUBMISSION');
      setState(result.status);
      setPhotosAccepted(result.photosAccepted);
    } catch (error) {
      if (
        error instanceof CommunityInputError &&
        ['name', 'email', 'text'].includes(error.field)
      ) {
        setErrors({
          [error.field]:
            error.field === 'name'
              ? copy.requiredName
              : error.field === 'email'
                ? copy.requiredEmail
                : copy.requiredText,
        });
        (form.elements.namedItem(error.field) as HTMLElement)?.focus();
      }
      setState('error');
    } finally {
      inFlight.current = false;
    }
  }
  const notice =
    state === 'published'
      ? copy.published
      : state === 'pending'
        ? copy.pending
        : state === 'error'
          ? copy.failed
          : '';
  return (
    <form
      ref={formRef}
      className={styles.form}
      lang={locale}
      onSubmit={submit}
      noValidate
      aria-labelledby={`${id}-title`}
      data-guest-review-form={locale}
    >
      <header className={styles.heading}>
        <h3 id={`${id}-title`}>{copy.title}</h3>
        {recipeTitle && <p className={styles.recipe}>{recipeTitle}</p>}
        <p>{copy.intro}</p>
      </header>
      {demo && <p className={styles.demo}>{copy.demo}</p>}
      <fieldset className={styles.controls} disabled={busy || complete}>
        <fieldset className={styles.choice}>
          <legend>{copy.kind}</legend>
          <div className={styles.options}>
            {(['result', 'question'] as const).map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name="kind"
                  value={value}
                  checked={kind === value}
                  onChange={() => {
                    setKind(value);
                    setRating(null);
                  }}
                />
                {copy[value]}
              </label>
            ))}
          </div>
        </fieldset>
        {kind === 'result' && (
          <fieldset className={styles.choice}>
            <legend>{copy.experience}</legend>
            <div className={styles.options}>
              {(['as-written', 'changed'] as const).map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="experience"
                    value={value}
                    checked={experience === value}
                    onChange={() => {
                      setExperience(value);
                      setRating(null);
                    }}
                  />
                  {value === 'as-written' ? copy.original : copy.changed}
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {canRate && (
          <fieldset className={styles.choice}>
            <legend>
              {copy.rating}{' '}
              <span className={styles.hint}>({copy.optional})</span>
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
        )}
        {kind === 'result' && !canRate && (
          <p className={styles.hint}>{copy.changedHint}</p>
        )}
        <div className={fields.field}>
          <label htmlFor={`${id}-text`}>{copy.text}</label>
          <textarea
            id={`${id}-text`}
            name="text"
            onChange={() => clearFieldError('text')}
            rows={5}
            maxLength={2000}
            required
            aria-invalid={!!errors.text}
            aria-describedby={`${id}-text-hint${errors.text ? ` ${id}-text-error` : ''}`}
          />
          <span id={`${id}-text-hint`} className={styles.hint}>
            {copy.textHint}
          </span>
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
              aria-describedby={errors.name ? `${id}-name-error` : undefined}
            />
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
        </div>
        <fieldset
          className={styles.choice}
          aria-describedby={`${id}-photo-hint`}
        >
          <legend>
            {copy.photos} <span className={styles.hint}>({copy.optional})</span>
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
                  <img
                    src={photo.url}
                    alt={`${copy.preview} ${index + 1}`}
                    onLoad={(event) => {
                      const image = event.currentTarget;
                      photoDecoded(
                        photo.id,
                        image.naturalWidth * image.naturalHeight > 4_000_000
                          ? copy.photoPixels
                          : undefined,
                      );
                    }}
                    onError={() => photoDecoded(photo.id, copy.photoDecode)}
                  />
                  <span className={styles.filename}>{photo.file.name}</span>
                  <span className={photo.error ? styles.error : styles.hint}>
                    {photo.error ||
                      (busy
                        ? copy.sending
                        : complete && photosAccepted
                          ? copy.photoPending
                          : photo.state === 'decoding'
                            ? copy.preparing
                            : copy.ready)}
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
      </fieldset>
      <p className={styles.hint}>{copy.privacy}</p>
      <p
        ref={noticeRef}
        tabIndex={-1}
        className={notice ? styles.notice : styles.emptyNotice}
        role={state === 'error' ? 'alert' : 'status'}
      >
        {complete && <Check aria-hidden="true" size={20} />}
        {notice}
      </p>
      {!complete && (
        <Button
          type="submit"
          disabled={
            !submitReview ||
            busy ||
            photos.some((photo) => photo.state === 'decoding')
          }
        >
          {busy
            ? copy.sending
            : state === 'error'
              ? copy.tryAgain
              : copy.submit}
        </Button>
      )}
      {!submitReview && <p className={styles.hint}>{copy.unavailable}</p>}
    </form>
  );
}
