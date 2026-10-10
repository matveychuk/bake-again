'use client';
import { useState } from 'react';
import {
  Bookmark,
  LogOut,
  Settings,
  ShoppingBag,
  UserRound,
} from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/lib/personal/browser';
import { useAccount } from './account-provider';
import { accountCopy } from './copy';
import styles from './account.module.css';
export function AccountLink({
  locale,
  pathname,
}: {
  locale: AppLocale;
  pathname?: string;
}) {
  const state = useAccount();
  const c = accountCopy[locale];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  if (state.ready && !state.enabled) return null;
  const href = `/${locale}/account`;
  if (!state.identity)
    return (
      <Button
        href={href}
        variant="ghost"
        className={styles.loginLink}
        aria-label={c.login}
        aria-current={pathname === href ? 'page' : undefined}
      >
        <UserRound size={20} aria-hidden="true" />
        <span>{c.login}</span>
      </Button>
    );
  return (
    <div className={styles.accountControl}>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={styles.avatarTrigger}
          aria-label={c.title}
          title={c.title}
          data-current={pathname === href || undefined}
          disabled={busy}
        >
          <UserRound size={20} aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={styles.accountMenu}
          aria-label={c.title}
        >
          <div className={styles.menuIdentity}>
            <strong>{c.title}</strong>
            <span>{state.email}</span>
          </div>
          {[
            { path: 'saved', label: c.savedRecipes, Icon: Bookmark },
            { path: 'shopping-list', label: c.shoppingList, Icon: ShoppingBag },
            { path: 'account', label: c.settings, Icon: Settings },
          ].map(({ path, label, Icon }) => (
            <DropdownMenuItem
              key={path}
              className={styles.menuItem}
              render={
                <a
                  href={`/${locale}/${path}`}
                  aria-label={label}
                  aria-current={
                    pathname === `/${locale}/${path}` ? 'page' : undefined
                  }
                />
              }
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem
            className={`${styles.menuItem} ${styles.menuSignOut}`}
            disabled={busy}
            onClick={() => {
              setBusy(true);
              setError(false);
              void signOut()
                .catch(() => setError(true))
                .finally(() => setBusy(false));
            }}
          >
            <LogOut size={18} aria-hidden="true" />
            {c.out}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {error && (
        <p role="alert" className={styles.menuError}>
          {c.error} <a href={href}>{c.title}</a>
        </p>
      )}
    </div>
  );
}
