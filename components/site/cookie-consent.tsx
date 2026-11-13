'use client';
/* oxlint-disable jsx-a11y/no-redundant-roles -- specification requires an explicit region role on the consent panel */
/* oxlint-disable next/no-html-link-for-pages -- native privacy anchor */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cookieCopy } from '@/content/cookies';
import { isAppLocale, type AppLocale } from '@/lib/i18n/config';
import { hideConsentBanner } from '@/lib/analytics/meta-policy';
import {
  startMeta,
  syncMetaRoute,
  subscribeConsent,
  consentSnapshot,
  serverConsentSnapshot,
  setAdsConsent,
  consentEnabledSnapshot,
  serverEnabledSnapshot,
  subscribeMetaRoute,
  routeSnapshot,
  serverRouteSnapshot,
} from '@/lib/analytics/meta';
import { trackEvent } from '@/lib/analytics/umami';
import styles from './cookie-consent.module.css';

/** Shared nonmodal panel; the Design Lab variant never stores consent or loads Meta. */
export function CookieConsentPanel({
  locale,
  onAccept,
  onDecline,
  preview = false,
}: {
  locale: AppLocale;
  onAccept?: () => void;
  onDecline?: () => void;
  preview?: boolean;
}) {
  const copy = cookieCopy[locale];
  return (
    <section
      role="region"
      aria-label={copy.label}
      lang={locale}
      data-cookie-banner
      className={`${styles.panel} ${preview ? styles.preview : ''}`}
    >
      <p>
        {copy.text}{' '}
        <a href={`/${locale}/privacy#meta-cookies`}>{copy.details}</a>
      </p>
      <div className={styles.actions}>
        {/* Equal weight; decline first so refusing is as easy as accepting. */}
        <Button onClick={onDecline}>{copy.decline}</Button>
        <Button onClick={onAccept}>{copy.accept}</Button>
      </div>
    </section>
  );
}

export function CookieSettings({ locale }: { locale: AppLocale }) {
  const enabled = useSyncExternalStore(
    subscribeConsent,
    consentEnabledSnapshot,
    serverEnabledSnapshot,
  );
  if (!enabled) return null;
  return (
    <button
      className={styles.settings}
      onClick={() => window.dispatchEvent(new Event('ba:cookie-settings'))}
    >
      {cookieCopy[locale].settings}
    </button>
  );
}

export function CookieConsent({ pixelId }: { pixelId: string }) {
  const pathname = usePathname() ?? '/uk';
  const segment = pathname.split('/')[1];
  const locale = isAppLocale(segment) ? segment : 'uk';
  const consent = useSyncExternalStore(
    subscribeConsent,
    consentSnapshot,
    serverConsentSnapshot,
  );
  const enabled = useSyncExternalStore(
    subscribeConsent,
    consentEnabledSnapshot,
    serverEnabledSnapshot,
  );
  const href = useSyncExternalStore(
    subscribeMetaRoute,
    routeSnapshot,
    serverRouteSnapshot,
  );
  const [reopen, setReopen] = useState(false);
  const url = new URL(href);
  const hidden = hideConsentBanner(pathname, url.search);
  const wrapper = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    startMeta(pixelId);
    const open = () => {
      returnFocus.current = document.activeElement as HTMLElement;
      setReopen(true);
    };
    const route = () => {
      syncMetaRoute();
    };
    route();
    window.addEventListener('ba:cookie-settings', open);
    for (const event of ['ba:route', 'popstate', 'hashchange'])
      window.addEventListener(event, route);
    // Streamed lesson state can arrive after the URL. Recheck without a second PageView.
    const observer = new MutationObserver(() => syncMetaRoute());
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-meta-lesson-state', 'data-meta-recipe-id'],
    });
    return () => {
      window.removeEventListener('ba:cookie-settings', open);
      for (const event of ['ba:route', 'popstate', 'hashchange'])
        window.removeEventListener(event, route);
      observer.disconnect();
    };
  }, [pixelId]);
  useEffect(() => {
    syncMetaRoute();
  }, [pathname]);
  const visible = enabled && !hidden && (reopen || !consent);
  useEffect(() => {
    document.documentElement.dataset.cookieBannerOpen = String(visible);
    if (reopen && visible) wrapper.current?.querySelector('button')?.focus();
    return () => {
      delete document.documentElement.dataset.cookieBannerOpen;
    };
  }, [visible, reopen]);
  if (!visible) return null;
  const choose = (ads: 'granted' | 'denied') => {
    trackEvent(ads === 'granted' ? 'cookie_consent_accept' : 'cookie_consent_decline');
    setAdsConsent(ads);
    setReopen(false);
    returnFocus.current?.focus();
  };
  return (
    <div ref={wrapper}>
      <CookieConsentPanel
        locale={locale}
        onAccept={() => choose('granted')}
        onDecline={() => choose('denied')}
      />
    </div>
  );
}
