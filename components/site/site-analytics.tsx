'use client';

import { useEffect } from 'react';
import { analyticsAllowed, analyticsConfig, flushAnalyticsEvents, sanitizeAnalyticsPayload, trackEvent } from '@/lib/analytics/umami';

/** No visible UI; the tracker owns SPA pageviews, avoiding duplicate React effects. */
export function SiteAnalytics() {
  useEffect(() => {
    if (!analyticsAllowed(window.location.hostname, window.location.pathname, navigator.doNotTrack)) return;
    window.bakeAgainBeforeSend = (type, payload) =>
      navigator.doNotTrack === '1' ? false : sanitizeAnalyticsPayload(type, payload);
    if (!document.getElementById('bake-again-analytics')) {
      const script = document.createElement('script');
      script.id = 'bake-again-analytics';
      script.src = analyticsConfig.scriptUrl;
      script.defer = true;
      script.dataset.websiteId = analyticsConfig.websiteId;
      script.dataset.domains = analyticsConfig.hostname;
      script.dataset.excludeSearch = 'true';
      script.dataset.excludeHash = 'true';
      script.dataset.doNotTrack = 'true';
      script.dataset.beforeSend = 'bakeAgainBeforeSend';
      script.onload = flushAnalyticsEvents;
      document.head.appendChild(script);
    }
    const onSubmit = (event: SubmitEvent) => {
      if (event.target instanceof HTMLFormElement && event.target.dataset.analyticsSearch === 'true') trackEvent('search_submit');
    };
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[href]');
      if (!link) return;
      const url = new URL(link.href);
      if (url.origin === window.location.origin && /^\/(en|es|uk)\/recipes\/[a-z0-9-]+\/cook$/.test(url.pathname)) trackEvent('cook_open');
    };
    document.addEventListener('submit', onSubmit);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('submit', onSubmit);
      document.removeEventListener('click', onClick);
    };
  }, []);
  return null;
}
