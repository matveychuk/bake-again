import {
  readConsent,
  saveConsent,
  metaCookieDeletions,
  CONSENT_KEY,
  type AdsConsent,
  type Consent,
} from './consent.ts';
import {
  metaAllowed,
  metaContentEvent,
  metaLeadEvent,
  metaBuyEvent,
  type MetaEvent,
  type MetaSignup,
} from './meta-policy.ts';

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push?: Fbq;
  loaded: boolean;
  version: string;
  disablePushState: boolean;
};
declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}
let pixelId = '';
let consent: Consent | null = null;
let initialized = false;
let ready = false;
let active = false;
let lastRoute = '';
let lastContent = '';
let installed = false;
let enabled = false;
const listeners = new Set<() => void>();
const pending: Array<{ route: string; event: MetaEvent }> = [];
export const subscribeConsent = (change: () => void) => {
  listeners.add(change);
  return () => {
    listeners.delete(change);
  };
};
export const consentSnapshot = () => consent;
export const serverConsentSnapshot = () => null;
export const consentEnabledSnapshot = () => enabled;
export const serverEnabledSnapshot = () => false;
export const routeSnapshot = () => location.href;
export const serverRouteSnapshot = () => 'https://bakeagain.com/uk';
export const subscribeMetaRoute = (change: () => void) => {
  for (const event of ['ba:route', 'popstate', 'hashchange'])
    window.addEventListener(event, change);
  return () => {
    for (const event of ['ba:route', 'popstate', 'hashchange'])
      window.removeEventListener(event, change);
  };
};
const notify = () => listeners.forEach((change) => change());
function command(...args: unknown[]) {
  try {
    window.fbq?.(...args);
  } catch {
    /* Advertising must never break an action. */
  }
}

function allowed() {
  return (
    consent?.ads === 'granted' &&
    !!consent &&
    // Expiry applies during long-lived SPA sessions too.
    Date.now() <
      new Date(
        new Date(consent.ts).setUTCFullYear(
          new Date(consent.ts).getUTCFullYear() + 1,
        ),
      ).getTime() &&
    metaAllowed(pixelId, location.href, navigator.doNotTrack, document.referrer)
  );
}
function clearCookies() {
  for (const value of metaCookieDeletions(location.hostname, location.pathname))
    document.cookie = value;
}
function revoke() {
  pending.length = 0;
  if (window.fbq) {
    // Never let queued conversions be replayed after withdrawal or a sensitive route.
    window.fbq.queue = window.fbq.queue.filter(
      (args) => args[0] !== 'track' && args[0] !== 'trackCustom',
    );
    command('consent', 'revoke');
  }
  active = false;
  clearCookies();
}
function send(event: MetaEvent | null) {
  if (!event || !ready || !initialized || !allowed()) return;
  command(event.method, event.name, ...(event.data ? [event.data] : []));
}
function conversion(event: MetaEvent | null) {
  if (!event || !allowed()) return;
  if (ready && initialized) send(event);
  else if (pending.length < 20)
    pending.push({ route: location.pathname, event });
}
function pageEvents() {
  if (!allowed() || !initialized) return;
  const route = location.pathname;
  if (route !== lastRoute) {
    send({ method: 'track', name: 'PageView' });
    lastRoute = route;
    lastContent = '';
  }
  const event = metaContentEvent(
    route,
    document
      .querySelector('[data-meta-lesson-state]')
      ?.getAttribute('data-meta-lesson-state'),
  );
  const recipeId = document
    .querySelector('[data-meta-recipe-id]')
    ?.getAttribute('data-meta-recipe-id');
  const contentReady =
    event?.data?.content_type !== 'recipe' ||
    (Array.isArray(event.data.content_ids) &&
      event.data.content_ids[0] === recipeId);
  if (event && contentReady && lastContent !== route) {
    send(event);
    lastContent = route;
  }
}
function activate() {
  if (!ready || !allowed()) return;
  if (!active) {
    command('consent', 'grant');
    active = true;
  }
  if (!initialized) {
    command('set', 'autoConfig', false, pixelId);
    command('init', pixelId); // No third argument: no advanced matching or identity.
    initialized = true;
  }
  pageEvents();
  for (const item of pending.splice(0))
    if (item.route === location.pathname) send(item.event);
}
export function syncMetaRoute() {
  if (!pixelId) return;
  if (!allowed()) {
    if (active || window.fbq) revoke();
    lastRoute = '';
    lastContent = '';
    return;
  }
  if (document.getElementById('bake-again-meta-pixel')) {
    activate();
    return;
  }
  const fbq: Fbq = Object.assign(
    function (...args: unknown[]) {
      // Guard SDK calls as well as our event bridge, including on history changes.
      if ((args[0] === 'track' || args[0] === 'trackCustom') && !allowed())
        return;
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    },
    {
      queue: [] as unknown[][],
      loaded: true,
      version: '2.0',
      disablePushState: true,
    },
  );
  fbq.push = fbq;
  window.fbq = window._fbq = fbq;
  const script = document.createElement('script');
  script.id = 'bake-again-meta-pixel';
  script.async = true;
  script.referrerPolicy = 'no-referrer';
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  script.onload = () => {
    ready = true;
    activate();
  };
  document.head.appendChild(script);
}
export function setAdsConsent(ads: AdsConsent) {
  try {
    consent = saveConsent(localStorage, ads);
  } catch {
    consent = saveConsent({ getItem: () => null, setItem: () => {} }, ads);
  }
  if (ads === 'denied') revoke();
  syncMetaRoute();
  notify();
}
export function startMeta(id: string) {
  pixelId = id;
  enabled =
    !!id &&
    location.hostname === 'bakeagain.com' &&
    navigator.doNotTrack !== '1';
  try {
    consent = readConsent(localStorage);
  } catch {
    consent = null;
  }
  if (!installed) {
    installed = true;
    // Observe replaceState too: auth/claim cleanup need not cause a React navigation.
    for (const method of ['pushState', 'replaceState'] as const) {
      const original = history[method];
      history[method] = function (...args: Parameters<History[typeof method]>) {
        const result = original.apply(this, args);
        // Revoke synchronously before another caller can send an event.
        if (!allowed() && window.fbq) revoke();
        window.dispatchEvent(new Event('ba:route'));
        return result;
      };
    }
    window.addEventListener('storage', (event) => {
      if (event.key !== CONSENT_KEY && event.key !== null) return;
      try {
        consent = readConsent(localStorage);
      } catch {
        consent = null;
      }
      if (consent?.ads !== 'granted') revoke();
      syncMetaRoute();
      notify();
    });
  }
  syncMetaRoute();
  notify();
}
/** Called exclusively in the form's verified success branch; never queue before consent. */
export function trackMetaLead(signup: MetaSignup) {
  conversion(metaLeadEvent(signup));
}
export function trackMetaBuy() {
  conversion(metaBuyEvent());
}
