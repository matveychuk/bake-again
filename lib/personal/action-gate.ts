import type { AppLocale } from '../i18n/config';
import { accountState } from './browser';
export const personalActionEvent = 'bake-again:personal-action';
export type PersonalAction = {
  locale: AppLocale;
  run: () => void;
  trigger: HTMLElement | null;
};
/** Retain only the current action in memory; never passwords or a guest data library. */
export function requestPersonalAction(locale: AppLocale, run: () => void) {
  if (accountState().engine) {
    run();
    return;
  }
  window.dispatchEvent(
    new CustomEvent<PersonalAction>(personalActionEvent, {
      detail: {
        locale,
        run,
        trigger:
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null,
      },
    }),
  );
}
