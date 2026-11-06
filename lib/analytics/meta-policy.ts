import { analyticsAllowed, analyticsConfig } from './umami.ts';
import { recipeSlugs } from '../i18n/recipe-slugs.ts';
import {
  canBuyVideoLesson,
  videoLessons,
  type VideoLesson,
} from '../../content/commerce/video-lessons.ts';
import { isLeadMagnetId } from '../../content/lead-magnets.ts';

export function metaConfig(bindings: Record<string, unknown>) {
  const id =
    typeof bindings.META_PIXEL_ID === 'string'
      ? bindings.META_PIXEL_ID.trim()
      : '';
  return {
    pixelId: /^\d{5,30}$/.test(id) ? id : '',
    domainVerification:
      typeof bindings.META_DOMAIN_VERIFICATION === 'string'
        ? bindings.META_DOMAIN_VERIFICATION.trim()
        : '',
  };
}

const safeQuery =
  /^(?:src|utm_source|utm_medium|utm_campaign|utm_content|mode|scale|cream|login|purchase|fbclid)$/;
/** Meta reads the entire URL itself: fail closed instead of merely filtering event props. */
export function isMetaSafeUrl(value: string): boolean {
  try {
    const url = new URL(value, `https://${analyticsConfig.hostname}`);
    if (
      url.username ||
      url.password ||
      !['http:', 'https:'].includes(url.protocol)
    )
      return false;
    let decoded = url.href;
    for (let i = 0; i < 3; i++) {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
    if (
      /@|\b(?:token|token_hash|access_token|refresh_token|lesson_access|ba_checkout|claim|code|email|payment_intent|client_secret)\b/i.test(
        decoded,
      )
    )
      return false;
    if (/\/(?:auth|callback|claim|kupyty)(?:\/|$)/i.test(url.pathname))
      return false;
    for (const [key, val] of url.searchParams) {
      if (
        !safeQuery.test(key) ||
        !(
          key === 'fbclid'
            ? /^[a-zA-Z0-9_-]{1,512}$/
            : /^[a-zA-Z0-9_. -]{0,100}$/
        ).test(val)
      )
        return false;
    }
    // Section/lesson-step anchors only; no auth fragments or arbitrary form text.
    return !url.hash || /^#[a-z][a-z0-9-]{0,80}$/.test(url.hash);
  } catch {
    return false;
  }
}

export function metaAllowed(
  pixelId: string,
  href: string,
  doNotTrack?: string | null,
  referrer = '',
) {
  try {
    const url = new URL(href);
    return (
      /^\d{5,30}$/.test(pixelId) &&
      analyticsAllowed(url.hostname, url.pathname, doNotTrack) &&
      isMetaSafeUrl(href) &&
      (!referrer || isMetaSafeUrl(referrer))
    );
  } catch {
    return false;
  }
}

export type MetaEvent = {
  method: 'track' | 'trackCustom';
  name: 'PageView' | 'ViewContent' | 'Lead' | 'LessonBuyClick';
  data?: Record<string, string | number | string[]>;
};
export function lessonPrice(catalog: readonly VideoLesson[] = videoLessons) {
  const lesson = catalog.find((item) => item.id === 'napoleon-video');
  return lesson &&
    lesson.status !== 'withdrawn' &&
    Number.isSafeInteger(lesson.priceMinor) &&
    lesson.priceMinor! > 0 &&
    lesson.currency &&
    ['EUR', 'USD', 'GBP', 'UAH'].includes(lesson.currency)
    ? { value: lesson.priceMinor! / 100, currency: lesson.currency }
    : null;
}
export function metaContentEvent(
  pathname: string,
  lessonState?: string | null,
  catalog: readonly VideoLesson[] = videoLessons,
): MetaEvent | null {
  const match = /^\/(uk|en|es)\/recipes\/([a-z0-9-]+)\/?$/.exec(pathname);
  if (match) {
    const locale = match[1] as 'uk' | 'en' | 'es';
    const recipe = Object.entries(recipeSlugs).find(
      ([, slugs]) => slugs[locale] === match[2],
    );
    if (recipe)
      return {
        method: 'track',
        name: 'ViewContent',
        data: {
          content_type: 'recipe',
          content_ids: [recipe[0]],
          content_name: match[2],
          content_category: 'recipe',
        },
      };
  }
  const price = lessonPrice(catalog);
  if (
    pathname === '/uk/urok/napoleon' &&
    lessonState === 'description' &&
    price
  )
    return {
      method: 'track',
      name: 'ViewContent',
      data: {
        content_type: 'product',
        content_ids: ['napoleon-video'],
        content_name: 'napoleon-video',
        ...price,
      },
    };
  return null;
}

export type MetaSignup = {
  magnetId?: string;
  scenario?: string;
  placement?: string;
};
export function metaLeadEvent({
  magnetId,
  scenario,
  placement,
}: MetaSignup): MetaEvent | null {
  if (magnetId && !isLeadMagnetId(magnetId)) return null;
  if (
    !magnetId &&
    !['landing', 'recipe', 'footer', 'after-review', 'product-banner'].includes(
      placement ?? '',
    )
  )
    return null;
  return {
    method: 'track',
    name: 'Lead',
    data: {
      content_category: magnetId
        ? 'bonus'
        : scenario === 'lesson'
          ? 'lesson'
          : 'newsletter',
      content_name: magnetId ?? placement!,
    },
  };
}

export function metaBuyEvent(
  catalog: readonly VideoLesson[] = videoLessons,
): MetaEvent | null {
  const lesson = catalog.find((item) => item.id === 'napoleon-video');
  if (!lesson || !canBuyVideoLesson(lesson)) return null;
  const price = lessonPrice(catalog);
  return price
    ? { method: 'trackCustom', name: 'LessonBuyClick', data: price }
    : null;
}

export function hideConsentBanner(pathname: string, search: string) {
  const params = new URLSearchParams(search);
  return (
    /\/(?:cook|print|thanks|thank-you|diakuiu|gracias|subscribed|recept-confirmed)(?:\/|$)/.test(
      pathname,
    ) || params.has('print') || params.get('view') === 'print'
  );
}
