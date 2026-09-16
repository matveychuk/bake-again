'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { MonitorCheck, MonitorUp } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import styles from './cook-mode.module.css';

type WakeLockSentinelLike = {
  released: boolean;
  release: () => Promise<void>;
  addEventListener: (type: 'release', listener: () => void) => void;
};

type NavigatorWithWakeLock = Navigator & {
  wakeLock?: {
    request: (type: 'screen') => Promise<WakeLockSentinelLike>;
  };
};

export function CookWakeLock({ locale }: { locale: AppLocale }) {
  const messages = getUiMessages(locale).cook;
  const sentinel = useRef<WakeLockSentinelLike | null>(null);
  const requested = useRef(false);
  const [active, setActive] = useState(false);
  const supported = useSyncExternalStore(
    () => () => undefined,
    () => Boolean((navigator as NavigatorWithWakeLock).wakeLock),
    () => false,
  );

  const acquire = useCallback(async () => {
    const wakeLock = (navigator as NavigatorWithWakeLock).wakeLock;
    if (!wakeLock) return;
    try {
      const next = await wakeLock.request('screen');
      sentinel.current = next;
      setActive(true);
      next.addEventListener('release', () => setActive(false));
    } catch {
      requested.current = false;
      setActive(false);
    }
  }, []);

  useEffect(() => {
    const restore = () => {
      if (document.visibilityState === 'visible' && requested.current) {
        void acquire();
      }
    };
    document.addEventListener('visibilitychange', restore);
    return () => {
      document.removeEventListener('visibilitychange', restore);
      requested.current = false;
      void sentinel.current?.release();
    };
  }, [acquire]);

  async function toggle() {
    if (active) {
      requested.current = false;
      await sentinel.current?.release();
      sentinel.current = null;
      setActive(false);
      return;
    }
    requested.current = true;
    await acquire();
  }

  const label = active ? messages.screenAwake : messages.keepScreenAwake;
  if (!supported) return null;
  return (
    <button
      className={styles.wakeLock}
      type="button"
      aria-pressed={active}
      aria-label={label}
      title={label}
      onClick={() => void toggle()}
    >
      {active ? (
        <MonitorCheck aria-hidden="true" size={17} />
      ) : (
        <MonitorUp aria-hidden="true" size={17} />
      )}
      <span>{label}</span>
    </button>
  );
}
