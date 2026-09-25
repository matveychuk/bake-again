// Public installation identifiers, not credentials. Keep localhost/preview traffic out.
export const analyticsConfig = {
  websiteId: '1b499007-bdab-4322-9b5e-b5173f5649f6',
  hostname: 'bakeagain.com',
  scriptUrl: 'https://cloud.umami.is/script.js',
};

export const analyticsEvents = [
  'recipe_save', 'recipe_unsave', 'search_submit', 'shopping_add',
  'recipe_scale', 'recipe_ingredient_scale', 'cream_select', 'cook_open',
  'cook_step_complete', 'cook_complete', 'cook_restart', 'timer_start',
  'assistant_open', 'assistant_submit', 'language_change',
] as const;
export type AnalyticsEvent = (typeof analyticsEvents)[number];
type EventData = { recipe_id?: string; locale?: string; target_locale?: string; count?: number; factor?: number };
type Payload = Record<string, unknown>;
type PendingEvent = { name: AnalyticsEvent; data: EventData; url: string };
const pending: PendingEvent[] = [];

declare global {
  interface Window {
    umami?: { track: (event: (payload: Payload) => Payload) => Promise<unknown> | void };
    bakeAgainBeforeSend?: (type: string, payload: Payload) => Payload | false;
  }
}

export function isAnalyticsPath(path: string) {
  return /^\/(?:en|es|uk)(?:\/(?:about|privacy|saved|shopping-list)|\/recipes\/[a-z0-9-]+(?:\/cook)?|\/techniques\/[a-z0-9-]+)?\/?$/.test(path);
}

export function analyticsAllowed(hostname: string, pathname: string, doNotTrack?: string | null) {
  return hostname === analyticsConfig.hostname && isAnalyticsPath(pathname) && doNotTrack !== '1';
}

/** Build an allowlisted payload: no query, hash, page text, notes or identity. */
export function sanitizeAnalyticsPayload(type: string, payload: Payload): Payload | false {
  if (type !== 'event') return false;
  let url: URL;
  try { url = new URL(String(payload.url), `https://${analyticsConfig.hostname}`); } catch { return false; }
  if (!analyticsAllowed(url.hostname, url.pathname)) return false;
  if (payload.name !== undefined && !analyticsEvents.includes(payload.name as AnalyticsEvent)) return false;
  let referrer = '';
  try {
    const ref = new URL(String(payload.referrer));
    if (ref.protocol === 'https:' || ref.protocol === 'http:') referrer = ref.origin;
  } catch { /* No referrer is normal for a direct visit. */ }
  const data: EventData = {};
  const input = payload.data as EventData | undefined;
  if (input) {
    if (typeof input.recipe_id === 'string' && /^[a-z0-9-]{1,100}$/.test(input.recipe_id)) data.recipe_id = input.recipe_id;
    for (const key of ['locale', 'target_locale'] as const) {
      if (['en', 'es', 'uk'].includes(input[key] ?? '')) data[key] = input[key];
    }
    for (const key of ['count', 'factor'] as const) {
      const value = input[key];
      if (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 10000) data[key] = value;
    }
  }
  return {
    website: analyticsConfig.websiteId,
    hostname: analyticsConfig.hostname,
    url: url.pathname,
    title: url.pathname,
    referrer,
    ...(typeof payload.language === 'string' ? { language: payload.language } : {}),
    ...(typeof payload.screen === 'string' ? { screen: payload.screen } : {}),
    ...(payload.name ? { name: payload.name, data } : {}),
  };
}

function canTrack() {
  return typeof window !== 'undefined' && analyticsAllowed(window.location.hostname, window.location.pathname, navigator.doNotTrack);
}

function send(event: PendingEvent) {
  try {
    const result = window.umami?.track((payload) => ({ ...payload, ...event }));
    void Promise.resolve(result).catch(() => undefined);
  } catch { /* Analytics must never interrupt a recipe action. */ }
}

export function trackEvent(name: AnalyticsEvent, data: EventData = {}) {
  if (!canTrack()) return;
  const event = { name, data, url: window.location.pathname };
  if (window.umami) send(event);
  else if (pending.length < 20) pending.push(event);
}

export function flushAnalyticsEvents() {
  const events = pending.splice(0);
  if (canTrack() && window.umami) events.forEach(send);
}
