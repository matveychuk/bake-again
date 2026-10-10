'use client';
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { AccountActionGate } from './account-action-gate';
import {
  accountState,
  startAccount,
  subscribeAccount,
  type AccountState,
} from '@/lib/personal/browser';
const serverState: AccountState = {
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
const serverSnapshot = () => serverState;
export function useAccount() {
  const state = useSyncExternalStore(
    subscribeAccount,
    accountState,
    serverSnapshot,
  );
  useEffect(() => {
    void startAccount();
  }, []);
  return state;
}
export function AccountProvider({ children }: { children: ReactNode }) {
  const state = useAccount();
  const [booted, setBooted] = useState(false);
  if (state.ready && !booted) setBooted(true);
  return (
    <>
      <div
        key={`${state.viewEpoch}:${booted}`}
        aria-busy={!state.ready}
        inert={!state.ready || undefined}
      >
        {children}
      </div>
      <AccountActionGate />
    </>
  );
}
