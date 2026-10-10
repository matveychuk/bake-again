'use client';
import type { AppLocale } from '@/lib/i18n/config';
import { useAccount } from './account-provider';
import { accountCopy } from './copy';
import styles from './account.module.css';
export function AccountSyncNotice({ locale }: { locale: AppLocale }) {
  const state = useAccount();
  const c = accountCopy[locale];
  if (
    !state.identity ||
    (!state.error && !state.engine?.error && !state.engine?.conflicts.length)
  )
    return null;
  const text = state.engine?.conflicts.length
    ? c.conflict
    : state.error || state.engine?.error
      ? c.saveError
      : c.saving;
  return (
    <div className={styles.status}>
      <output aria-live="polite">{text} </output>
      <a href={`/${locale}/account`}>{c.title}</a>
    </div>
  );
}
