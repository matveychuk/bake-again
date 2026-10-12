import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { PersonalSyncEngine, SyncFailure } from './sync-engine.ts';
import { accountStorage, guestRecords } from './legacy-bridge.ts';
import { readAuthLink, verifyAuthLink, recoveryMatches } from './auth-link.ts';
import { setAccountStorage } from '../persistence/storage.ts';
import type { PersonalSnapshot, SyncAction } from './sync-contracts.ts';
export type AccountState = {
  ready: boolean;
  enabled: boolean;
  authReady: boolean;
  identity: string | null;
  email: string | null;
  viewEpoch: number;
  engine: PersonalSyncEngine | null;
  error: string | null;
  recovery: boolean;
};
let state: AccountState = {
  ready: false,
  enabled: false,
  authReady: false,
  identity: null,
  email: null,
  viewEpoch: 0,
  engine: null,
  error: null,
  recovery: false,
};
let client: SupabaseClient | null = null;
let projectNamespace = '';
let starting: Promise<void> | null = null;
let epoch = 0;
let timer: ReturnType<typeof setTimeout> | undefined;
let attempts = 0;
const listeners = new Set<() => void>();
const recoveryKey = 'bake-again:password-recovery';
export function completePasswordRecovery() {
  sessionStorage.removeItem(recoveryKey);
  state = { ...state, recovery: false };
  emit();
}
export function clearAuthLinkError() {
  if (state.error === 'INVALID_AUTH_LINK') {
    state = { ...state, error: null };
    emit();
  }
}
const cachePrefix = 'bake-again:account-cache:';
const shield = {
  getItem: () => null,
  setItem: () => {
    throw new Error('ACCOUNT_LOADING');
  },
};
if (typeof window !== 'undefined') setAccountStorage(shield);
function emit() {
  state = { ...state };
  listeners.forEach((fn) => fn());
  if (typeof window !== 'undefined')
    window.dispatchEvent(new StorageEvent('storage', { key: null }));
}
export const accountState = () => state;
export function subscribeAccount(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
export function authClient() {
  if (!client || !state.authReady) throw new Error('AUTH_NOT_READY');
  return client;
}
function clearCache() {
  for (let i = sessionStorage.length - 1; i >= 0; i--) {
    const key = sessionStorage.key(i)!;
    if (key.startsWith(cachePrefix)) sessionStorage.removeItem(key);
  }
}
async function transport(
  action: SyncAction,
  input: Record<string, unknown>,
  subject = state.identity,
) {
  if (!client) throw new SyncFailure('AUTH_REQUIRED');
  const { data, error } = await client.auth.getSession();
  if (error || !data.session || !subject || data.session.user.id !== subject)
    throw new SyncFailure('AUTH_REQUIRED');
  const response = await fetch('/api/personal/v1/sync', {
    method: 'POST',
    credentials: 'omit',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${data.session.access_token}`,
    },
    body: JSON.stringify({ action, input }),
    cache: 'no-store',
    signal: AbortSignal.timeout(12000),
  });
  const body = (await response.json()) as {
    ok?: boolean;
    data?: unknown;
    error?: { code?: string; retryable?: boolean };
  };
  if (!response.ok || !body.ok)
    throw new SyncFailure(
      body.error?.code ?? 'SERVICE_UNAVAILABLE',
      body.error?.retryable === true,
    );
  return body.data;
}
function schedule() {
  if (timer || attempts >= 5 || !state.engine?.pendingCount) return;
  timer = setTimeout(
    () => {
      timer = undefined;
      void synchronize();
    },
    Math.min(30000, 800 * 2 ** attempts),
  );
}
export async function synchronize() {
  const engine = state.engine;
  if (!engine) return;
  attempts++;
  try {
    await engine.flush();
    attempts = 0;
    state = { ...state, error: null };
  } catch (error) {
    state = {
      ...state,
      error: error instanceof SyncFailure ? error.code : 'SERVICE_UNAVAILABLE',
    };
    if (error instanceof SyncFailure && !error.retryable) attempts = 5;
  }
  emit();
  if (engine.pendingCount && !engine.conflicts.length) schedule();
}
export function retrySync() {
  attempts = 0;
  void synchronize();
}
async function establish(identity: string | null, email: string | null = null) {
  if (identity && state.identity === identity && state.engine) return;
  const ticket = ++epoch;
  clearTimeout(timer);
  timer = undefined;
  state.engine?.stop();
  setAccountStorage(shield);
  const previous = state.identity;
  if (previous && previous !== identity)
    state = { ...state, viewEpoch: state.viewEpoch + 1 };
  if (previous && previous !== identity) clearCache();
  state = {
    ...state,
    ready: false,
    identity,
    email,
    engine: null,
    error: null,
  };
  emit();
  if (!identity) {
    setAccountStorage(null);
    state = { ...state, ready: true };
    emit();
    return;
  }
  try {
    const snapshot = (await transport(
      'provision',
      {},
      identity,
    )) as PersonalSnapshot;
    if (ticket !== epoch) return;
    const cacheKey =
      cachePrefix +
      encodeURIComponent(projectNamespace) +
      ':' +
      identity +
      ':' +
      snapshot.accountId;
    const engine = new PersonalSyncEngine(
      snapshot,
      (action, input) => transport(action, input, identity),
      (value) => sessionStorage.setItem(cacheKey, value),
      () => {
        emit();
        schedule();
      },
    );
    engine.restore(sessionStorage.getItem(cacheKey));
    state = { ...state, engine, ready: true };
    const scoped = accountStorage(engine, {
      getItem: (key) => sessionStorage.getItem(cacheKey + ':local:' + key),
      setItem: (key, value) => {
        if (value.length > 1048576) throw new Error('PAYLOAD_TOO_LARGE');
        sessionStorage.setItem(cacheKey + ':local:' + key, value);
      },
    });
    setAccountStorage({
      getItem: (key) =>
        key.startsWith('bake-again:')
          ? scoped.getItem(key)
          : localStorage.getItem(key),
      setItem: (key, value) => {
        if (key.startsWith('bake-again:')) scoped.setItem(key, value);
        else localStorage.setItem(key, value);
      },
    });
    attempts = 0;
    emit();
    schedule();
  } catch (error) {
    if (ticket === epoch) {
      state = {
        ...state,
        ready: true,
        error:
          error instanceof SyncFailure ? error.code : 'SERVICE_UNAVAILABLE',
      };
      emit();
    }
  }
}
export async function startAccount() {
  if (starting) return starting;
  starting = (async () => {
    const callbackUrl = new URL(location.href);
    const link = readAuthLink(callbackUrl);
    // Capture once in memory, then remove email credentials before any request.
    if (link.kind !== 'none')
      history.replaceState(null, '', callbackUrl.pathname);
    let initializing = true;
    try {
      const response = await fetch('/api/personal/v1/config', {
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error('CONFIG_UNAVAILABLE');
      const config = (await response.json()) as {
        enabled?: boolean;
        authReady?: boolean;
        url: string;
        publishableKey: string;
      };
      state = {
        ...state,
        enabled: config.enabled === true,
        authReady: config.authReady === true,
      };
      if (!state.enabled) {
        setAccountStorage(null);
        state = { ...state, ready: true };
        emit();
        return;
      }
      projectNamespace = config.url;
      client = createClient(config.url, config.publishableKey, {
        auth: {
          flowType: 'pkce',
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          storage: localStorage,
        },
      });
      client.auth.onAuthStateChange((event, session) => {
        // A delayed initial stored session must not override a failed email link.
        if (
          initializing ||
          event === 'INITIAL_SESSION' ||
          state.error === 'INVALID_AUTH_LINK'
        )
          return;
        state = {
          ...state,
          recovery: recoveryMatches(
            sessionStorage.getItem(recoveryKey),
            session?.user.id,
          ),
        };
        if (event === 'SIGNED_OUT') {
          sessionStorage.removeItem(recoveryKey);
          state = { ...state, recovery: false };
        }
        // Never await another Auth operation inside the SDK callback's lock.
        setTimeout(() => {
          void establish(session?.user.id ?? null, session?.user.email ?? null);
        }, 0);
      });
      const verified = await verifyAuthLink(client.auth, link);
      const { data, error } = verified
        ? { data: { session: verified.session }, error: null }
        : await client.auth.getSession();
      if (error) throw error;
      if (verified) {
        sessionStorage.removeItem(recoveryKey);
        if (verified.recovery)
          sessionStorage.setItem(
            recoveryKey,
            JSON.stringify({
              identity: verified.session.user.id,
              expiresAt: Date.now() + 3600000,
            }),
          );
      }
      state = {
        ...state,
        recovery: recoveryMatches(
          sessionStorage.getItem(recoveryKey),
          data.session?.user.id,
        ),
      };
      await establish(
        data.session?.user.id ?? null,
        data.session?.user.email ?? null,
      );
      initializing = false;
      window.addEventListener('focus', () => {
        if (state.engine && !state.engine.pendingCount)
          void state.engine.refresh().catch(() => {
            state = { ...state, error: 'SERVICE_UNAVAILABLE' };
            emit();
          });
      });
      window.addEventListener('online', retrySync);
      setInterval(() => {
        if (
          document.visibilityState === 'visible' &&
          state.engine &&
          !state.engine.pendingCount
        )
          void state.engine.refresh().catch(() => {
            state = { ...state, error: 'SERVICE_UNAVAILABLE' };
            emit();
          });
      }, 30000);
      window.addEventListener('storage', (event) => {
        if (event.key === 'bake-again:account-logout') {
          clearCache();
          void establish(null);
        }
      });
    } catch (error) {
      initializing = false;
      state = {
        ...state,
        ready: true,
        recovery: false,
        error:
          error instanceof Error && error.message === 'INVALID_AUTH_LINK'
            ? 'INVALID_AUTH_LINK'
            : 'SERVICE_UNAVAILABLE',
      };
      emit();
    }
  })();
  return starting;
}
export async function signOut() {
  sessionStorage.removeItem(recoveryKey);
  // Do not discard a pending save silently when the reader signs out.
  if (state.engine?.pendingCount) {
    await state.engine.flush();
    if (state.engine.pendingCount) throw new Error('SAVE_PENDING');
  }
  ++epoch;
  state.engine?.stop();
  clearTimeout(timer);
  timer = undefined;
  clearCache();
  setAccountStorage(shield);
  localStorage.setItem('bake-again:account-logout', crypto.randomUUID());
  const { error } = client
    ? await client.auth.signOut({ scope: 'local' })
    : { error: null };
  if (error) {
    state = {
      ...state,
      viewEpoch: state.viewEpoch + 1,
      engine: null,
      identity: null,
      email: null,
      recovery: false,
      error: 'SIGNOUT_FAILED',
    };
    emit();
    throw error;
  }
  state = {
    ...state,
    viewEpoch: state.viewEpoch + 1,
    identity: null,
    email: null,
    engine: null,
    recovery: false,
    error: null,
  };
  setAccountStorage(null);
  emit();
}
export function importAvailable() {
  return (
    !state.engine?.imported &&
    !localStorage.getItem('bake-again:guest-import-owner')
  );
}
export async function importGuest(accept: boolean) {
  const engine = state.engine;
  if (!engine) throw new Error('AUTH_REQUIRED');
  const records = accept ? guestRecords(localStorage) : [];
  if (accept && localStorage.getItem('bake-again:guest-import-owner'))
    throw new Error('GUEST_ALREADY_CLAIMED');
  const mutations = records.map((data) => ({
    schemaVersion: 1,
    operationId: crypto.randomUUID(),
    expectedRevision: 0,
    action: 'put',
    ...data,
  }));
  await transport('import', { mutations });
  if (accept) {
    localStorage.setItem('bake-again:guest-import-owner', engine.accountId);
  }
  await engine.refresh();
  emit();
}
export async function exportPersonal() {
  const data = await transport('export', {});
  const url = URL.createObjectURL(
    new Blob(
      [
        JSON.stringify(
          {
            schemaVersion: 1,
            exportedAt: new Date().toISOString(),
            ...(data as object),
          },
          null,
          2,
        ),
      ],
      { type: 'application/json' },
    ),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bake-again-personal.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function erasePersonal() {
  await transport('erase', { confirm: 'DELETE_PERSONAL_DATA' });
  await signOut();
}
