'use client';
import { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  personalActionEvent,
  type PersonalAction,
} from '@/lib/personal/action-gate';
import { useAccount } from './account-provider';
import { AccountPage } from './account-page';
import { accountCopy } from './copy';
import styles from './account.module.css';
export function AccountActionGate() {
  const [action, setAction] = useState<PersonalAction | null>(null);
  const state = useAccount();
  const consumed = useRef<PersonalAction | null>(null);
  useEffect(() => {
    const open = (event: Event) =>
      setAction((event as CustomEvent<PersonalAction>).detail);
    window.addEventListener(personalActionEvent, open);
    return () => window.removeEventListener(personalActionEvent, open);
  }, []);
  useEffect(() => {
    if (!action || !state.engine || !state.ready || consumed.current === action)
      return;
    consumed.current = action;
    // Clear before executing so repeated Auth notifications cannot duplicate a save.
    setAction(null);
    action.run();
    action.trigger?.focus();
  }, [action, state.engine, state.ready]);
  if (!action) return null;
  const c = accountCopy[action.locale];
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          setAction(null);
          action.trigger?.focus();
        }
      }}
    >
      <DialogContent className={styles.gate} showCloseButton={false}>
        <DialogTitle className="sr-only">{c.gateTitle}</DialogTitle>
        <DialogDescription className="sr-only">{c.gateBody}</DialogDescription>
        <AccountPage locale={action.locale} recipes={[]} embedded />
        <Button
          variant="link"
          onClick={() => {
            setAction(null);
            action.trigger?.focus();
          }}
        >
          {c.close}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
