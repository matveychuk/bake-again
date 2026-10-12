'use client';
import {
  useEffect,
  useRef,
  useState,
  type SubmitEvent as ReactSubmitEvent,
} from 'react';
import {
  ArrowRight,
  Bookmark,
  ChevronDown,
  LogOut,
  ShoppingBag,
  UserRound,
} from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import type {
  PersonalDataV1,
  PersonalPayloadsV1,
} from '@/lib/personal/contracts';
import { Button } from '@/components/ui/button';
import { useAccount } from './account-provider';
import { authClient, signOut } from '@/lib/personal/browser';
import { accountCopy } from './copy';
import styles from './account.module.css';
type RecipeOption = { id: string; title: string };
type EmailRequest = { kind: 'signup' | 'reset'; email: string };
export function AccountFields({
  locale,
  onSubmit,
  busy = false,
  headingLevel = 2,
  contextual = false,
  onModeChange,
  emailRequest = null,
  onEmailRequestClear,
}: {
  locale: AppLocale;
  busy?: boolean;
  headingLevel?: 1 | 2;
  contextual?: boolean;
  onModeChange?: () => void;
  emailRequest?: EmailRequest | null;
  onEmailRequestClear?: () => void;
  onSubmit: (event: ReactSubmitEvent<HTMLFormElement>) => void;
}) {
  const c = accountCopy[locale];
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const Heading = `h${headingLevel}` as const;
  const heading = useRef<HTMLHeadingElement>(null);
  const hasEmailRequest = Boolean(emailRequest);
  const hadEmailRequest = useRef(hasEmailRequest);
  const focusRequested = useRef(false);
  useEffect(() => {
    if ((!hadEmailRequest.current && hasEmailRequest) || focusRequested.current)
      heading.current?.focus();
    hadEmailRequest.current = hasEmailRequest;
    focusRequested.current = false;
  }, [hasEmailRequest, mode]);
  function changeMode(next: typeof mode) {
    focusRequested.current = true;
    setMode(next);
    onModeChange?.();
  }
  if (emailRequest) {
    const returnTo = (next: typeof mode) => {
      setEmail(emailRequest.email);
      setShowPassword(false);
      onEmailRequestClear?.();
      changeMode(next);
    };
    return (
      <div className={styles.form}>
        <div className={styles.intro}>
          <Heading
            ref={heading}
            id={headingLevel === 1 ? 'account-title' : undefined}
            tabIndex={-1}
          >
            {c.checkEmail}
          </Heading>
        </div>
        <div className={styles.notice} role="status">
          <p>{c.requestAccepted}</p>
          <p className={styles.email}>
            <strong>{emailRequest.email}</strong>
          </p>
          <p>{emailRequest.kind === 'signup' ? c.signupSent : c.resetSent}</p>
        </div>
        <p className={styles.finePrint}>{c.emailHelp}</p>
        <div className={styles.actions}>
          <Button onClick={() => returnTo('login')}>{c.backToLogin}</Button>
          <Button variant="link" onClick={() => returnTo(emailRequest.kind)}>
            {c.changeEmail}
          </Button>
        </div>
        <p className={styles.finePrint}>
          {c.authNote} <a href={`/${locale}/privacy`}>{c.privacy}</a>
        </p>
      </div>
    );
  }
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.intro}>
        <Heading
          ref={heading}
          id={headingLevel === 1 ? 'account-title' : undefined}
          tabIndex={-1}
        >
          {mode === 'login' ? c.login : mode === 'signup' ? c.signup : c.reset}
        </Heading>
        <p>
          {contextual && mode !== 'reset'
            ? c.gateBody
            : mode === 'login'
              ? c.loginIntro
              : mode === 'signup'
                ? c.signupIntro
                : c.resetIntro}
        </p>
      </div>
      <label className={styles.field}>
        {c.email}
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      {mode !== 'reset' && (
        <label className={styles.field}>
          {c.password}
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete={
              mode === 'signup' ? 'new-password' : 'current-password'
            }
            required
            minLength={8}
            maxLength={128}
          />
        </label>
      )}
      {mode !== 'reset' && (
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          {c.showPassword}
        </label>
      )}
      <div className={styles.actions}>
        <Button type="submit" name="action" value={mode} disabled={busy}>
          {mode === 'login' ? c.login : mode === 'signup' ? c.signup : c.reset}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => changeMode(mode === 'login' ? 'signup' : 'login')}
        >
          {mode === 'login' ? c.signup : c.login}
        </Button>
        {mode === 'login' && (
          <Button
            type="button"
            variant="link"
            disabled={busy}
            onClick={() => changeMode('reset')}
          >
            {c.reset}
          </Button>
        )}
      </div>
      <p className={styles.finePrint}>
        {c.authNote} <a href={`/${locale}/privacy`}>{c.privacy}</a>
      </p>
    </form>
  );
}
export function CollectionEditor({
  locale,
  value,
  recipes,
  onChange,
  onRemove,
}: {
  locale: AppLocale;
  value: PersonalPayloadsV1['collection'];
  recipes: RecipeOption[];
  onChange: (v: PersonalPayloadsV1['collection']) => void;
  onRemove: () => void;
}) {
  const c = accountCopy[locale];
  const [name, setName] = useState(value.name);
  return (
    <article className={styles.section}>
      <h3>{value.name}</h3>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim()) onChange({ ...value, name: name.trim() });
        }}
      >
        <label className={styles.field}>
          {c.name}
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={120}
          />
        </label>
        <div className={styles.actions}>
          <Button type="submit" variant="outline">
            {c.rename}
          </Button>
          <Button type="button" variant="ghost" onClick={onRemove}>
            {c.remove}
          </Button>
        </div>
      </form>
      <fieldset className={styles.choices}>
        <legend>{c.recipes}</legend>
        {recipes.map((recipe) => (
          <label key={recipe.id} className={styles.check}>
            <input
              type="checkbox"
              checked={value.recipeIds.includes(recipe.id)}
              onChange={(event) =>
                onChange({
                  ...value,
                  recipeIds: event.target.checked
                    ? [...value.recipeIds, recipe.id]
                    : value.recipeIds.filter((id) => id !== recipe.id),
                })
              }
            />
            {recipe.title}
          </label>
        ))}
      </fieldset>
    </article>
  );
}
function description(
  record: PersonalDataV1 | null,
  recipes: RecipeOption[],
  deleted: string,
) {
  if (!record) return deleted;
  switch (record.kind) {
    case 'recipe-note':
      return record.payload.text;
    case 'bake-record':
      return `${record.payload.completedAt.slice(0, 10)}\n${record.payload.note}`;
    case 'collection':
      return `${record.payload.name}\n${record.payload.recipeIds.map((id) => recipes.find((r) => r.id === id)?.title ?? id).join(', ')}`;
    case 'saved-recipe':
      return (
        recipes.find((r) => r.id === record.payload.recipeId)?.title ??
        record.payload.recipeId
      );
    case 'shopping-item':
      return `${record.payload.ingredientId}: ${JSON.stringify(record.payload.quantity)} ${record.payload.checked ? '✓' : ''}`;
  }
}
export function AccountIdentity({
  locale,
  email,
}: {
  locale: AppLocale;
  email: string | null;
}) {
  const c = accountCopy[locale];
  return (
    <div className={styles.identity}>
      <span className={styles.avatar} aria-hidden="true">
        <UserRound size={24} />
      </span>
      <div>
        <p className={styles.label}>{c.email}</p>
        <p className={styles.email}>{email}</p>
      </div>
    </div>
  );
}

export function AccountDestinations({ locale }: { locale: AppLocale }) {
  const c = accountCopy[locale];
  return (
    <div className={styles.destinations}>
      <a href={`/${locale}/saved`}>
        <Bookmark aria-hidden="true" size={20} />
        <span>
          <strong>{c.savedRecipes}</strong>
          <small>{c.savedHint}</small>
        </span>
        <ArrowRight aria-hidden="true" size={18} />
      </a>
      <a href={`/${locale}/shopping-list`}>
        <ShoppingBag aria-hidden="true" size={20} />
        <span>
          <strong>{c.shoppingList}</strong>
          <small>{c.shoppingHint}</small>
        </span>
        <ArrowRight aria-hidden="true" size={18} />
      </a>
    </div>
  );
}

export function AccountHeading({
  locale,
  headingLevel = 1,
  busy = false,
  onSignOut,
}: {
  locale: AppLocale;
  headingLevel?: 1 | 2;
  busy?: boolean;
  onSignOut?: () => void;
}) {
  const c = accountCopy[locale];
  const Heading = `h${headingLevel}` as const;
  return (
    <div className={styles.titleRow}>
      <Heading
        id={headingLevel === 1 ? 'account-title' : undefined}
        tabIndex={-1}
      >
        {c.title}
      </Heading>
      {onSignOut && (
        <Button
          variant="ghost"
          size="icon"
          aria-label={c.out}
          title={c.out}
          disabled={busy}
          onClick={onSignOut}
        >
          <LogOut aria-hidden="true" size={20} />
        </Button>
      )}
    </div>
  );
}

export function AccountSettings({
  locale,
  busy = false,
  recovery = false,
  onPassword,
}: {
  locale: AppLocale;
  busy?: boolean;
  recovery?: boolean;
  onPassword: (event: ReactSubmitEvent<HTMLFormElement>) => void;
}) {
  const c = accountCopy[locale];
  return (
    <section className={styles.settingsSection}>
      <h2>{c.security}</h2>
      <details open={recovery || undefined} className={styles.disclosure}>
        <summary>
          {c.changePassword}
          <ChevronDown aria-hidden="true" size={20} />
        </summary>
        <form className={styles.form} onSubmit={onPassword}>
          <label className={styles.field}>
            {c.password}
            <input
              name="new-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
            />
          </label>
          <Button type="submit" disabled={busy}>
            {c.newPassword}
          </Button>
        </form>
      </details>
    </section>
  );
}

export function AccountPage({
  locale,
  recipes,
  embedded = false,
}: {
  locale: AppLocale;
  recipes: RecipeOption[];
  embedded?: boolean;
}) {
  const state = useAccount();
  const c = accountCopy[locale];
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState('');
  const [emailRequest, setEmailRequest] = useState<EmailRequest | null>(null);
  const running = useRef(false);
  const engine = state.engine;
  async function run(fn: () => Promise<unknown> | void) {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setMessage('');
    try {
      await fn();
    } catch {
      setMessage(c.error);
    } finally {
      running.current = false;
      setBusy(false);
    }
  }
  return (
    <section
      className={`${styles.page} ${styles.accountPage} ${!engine && !state.identity ? styles.authPage : ''}`}
      aria-labelledby={embedded ? undefined : 'account-title'}
    >
      {!embedded &&
        (engine ||
          !state.ready ||
          state.identity ||
          !state.enabled ||
          !state.authReady) && (
          <div className={styles.intro}>
            <AccountHeading
              locale={locale}
              busy={busy || !state.ready}
              onSignOut={state.identity ? () => void run(signOut) : undefined}
            />
            {engine && <AccountIdentity locale={locale} email={state.email} />}
          </div>
        )}
      {engine && !embedded && <AccountDestinations locale={locale} />}
      <output aria-live="polite">
        {message || (!state.ready ? c.loading : state.error ? c.error : '')}
      </output>
      {!engine && state.ready && !state.identity && (
        <>
          {!state.enabled || !state.authReady ? (
            <p className={styles.notice}>{c.unavailable}</p>
          ) : (
            <AccountFields
              locale={locale}
              busy={busy}
              headingLevel={embedded ? 2 : 1}
              contextual={embedded}
              onModeChange={() => setMessage('')}
              emailRequest={emailRequest}
              onEmailRequestClear={() => setEmailRequest(null)}
              onSubmit={(event) => {
                event.preventDefault();
                if (emailRequest) return;
                const data = new FormData(event.currentTarget);
                const action = (
                  event.nativeEvent as SubmitEvent
                ).submitter?.getAttribute('value');
                const email = data.get('email') as string;
                const password = data.get('password') as string;
                void run(async () => {
                  const auth = authClient().auth;
                  const redirect = `${location.origin}/${locale}/account`;
                  if (action !== 'reset' && password.length < 8)
                    throw new Error('PASSWORD_REQUIRED');
                  const result =
                    action === 'signup'
                      ? await auth.signUp({
                          email,
                          password,
                          options: {
                            emailRedirectTo: redirect,
                            data: { locale },
                          },
                        })
                      : action === 'reset'
                        ? await auth.resetPasswordForEmail(email, {
                            redirectTo: redirect + '?recovery=1',
                          })
                        : await auth.signInWithPassword({ email, password });
                  if (result.error) {
                    if (result.error.status === 429) {
                      setMessage(c.rateLimited);
                      return;
                    }
                    throw result.error;
                  }
                  if (action === 'signup' || action === 'reset') {
                    setEmailRequest({ kind: action, email });
                  }
                });
              }}
            />
          )}
        </>
      )}
      {engine && (
        <>
          {engine.conflicts.map((conflict) => (
            <section className={styles.section} key={conflict.id}>
              <h2>{c.conflict}</h2>
              <div className={styles.versions}>
                <div>
                  <h3>{c.local}</h3>
                  <p>{description(conflict.local, recipes, c.deleted)}</p>
                </div>
                <div>
                  <h3>{c.cloud}</h3>
                  <p>
                    {description(
                      conflict.cloud?.payload
                        ? ({
                            kind: conflict.cloud.kind,
                            payload: conflict.cloud.payload,
                          } as PersonalDataV1)
                        : null,
                      recipes,
                      c.deleted,
                    )}
                  </p>
                </div>
              </div>
              <div className={styles.actions}>
                <Button
                  disabled={busy}
                  onClick={() =>
                    void run(() => engine.resolve(conflict.id, 'local'))
                  }
                >
                  {c.keepLocal}
                </Button>
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() =>
                    void run(() => engine.resolve(conflict.id, 'cloud'))
                  }
                >
                  {c.keepCloud}
                </Button>
              </div>
            </section>
          ))}
        </>
      )}
      {(engine || state.recovery) && (
        <AccountSettings
          locale={locale}
          busy={busy}
          recovery={state.recovery}
          onPassword={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            void run(async () => {
              const { error } = await authClient().auth.updateUser({
                password: data.get('new-password') as string,
              });
              if (error) throw error;
              setMessage(c.passwordChanged);
            });
          }}
        />
      )}
      {embedded && state.identity && state.ready && (
        <Button variant="outline" onClick={() => void run(signOut)}>
          {c.out}
        </Button>
      )}
    </section>
  );
}

export function AccountCollections({
  locale,
  recipes,
}: {
  locale: AppLocale;
  recipes: RecipeOption[];
}) {
  const state = useAccount();
  const engine = state.engine;
  const c = accountCopy[locale];
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  async function run(fn: () => unknown) {
    setBusy(true);
    setError(false);
    try {
      await fn();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  const collections =
    engine?.records.filter((r) => r.kind === 'collection') ?? [];
  const updateCollection = (value: PersonalPayloadsV1['collection']) =>
    run(() =>
      engine?.replace(
        ['collection'],
        [
          ...collections.filter((r) => r.payload.id !== value.id),
          { kind: 'collection', payload: value },
        ],
      ),
    );
  if (!engine) return null;
  return (
    <div className={styles.page}>
      {error && <p role="alert">{c.error}</p>}{' '}
      <section className={styles.section}>
        <h2>{c.collections}</h2>
        {!collections.length && <p>{c.noCollections}</p>}
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            if (name.trim())
              void updateCollection({
                id: crypto.randomUUID(),
                name: name.trim(),
                recipeIds: [],
              }).then(() => setName(''));
          }}
        >
          <label className={styles.field}>
            {c.name}
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={120}
              required
            />
          </label>
          <Button type="submit" disabled={busy}>
            {c.create}
          </Button>
        </form>
        {collections.map((r) => (
          <CollectionEditor
            key={r.payload.id + ':' + r.payload.name}
            locale={locale}
            value={r.payload}
            recipes={recipes}
            onChange={(v) => void updateCollection(v)}
            onRemove={() =>
              void run(() =>
                engine.replace(
                  ['collection'],
                  collections.filter((c) => c.payload.id !== r.payload.id),
                ),
              )
            }
          />
        ))}
      </section>
    </div>
  );
}
