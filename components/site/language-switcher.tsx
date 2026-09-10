'use client';

import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { localeMetadata, supportedLocales, type AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { getLocaleSwitchPath } from '@/lib/i18n/routes';
import { persistLocalePreference } from '@/lib/persistence/preferences';

type LanguageSwitcherProps = {
  locale: AppLocale;
  pathname: string;
};

export function LanguageSwitcher({ locale, pathname }: LanguageSwitcherProps) {
  const messages = getUiMessages(locale);

  function selectLocale(nextLocale: AppLocale) {
    if (nextLocale === locale) return;
    persistLocalePreference(nextLocale);
    window.location.assign(getLocaleSwitchPath(pathname, nextLocale));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="language-button"
        aria-label={messages.language.change}
      >
        {localeMetadata[locale].shortLabel}
        <ChevronDown aria-hidden="true" size={15} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="language-menu"
        aria-label={messages.language.select}
      >
        <DropdownMenuRadioGroup value={locale} onValueChange={(value) => {
          if (isLocaleValue(value)) selectLocale(value);
        }}>
          {supportedLocales.map((option) => (
            <DropdownMenuRadioItem
              className="language-menu__item"
              key={option}
              value={option}
            >
              {localeMetadata[option].label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function isLocaleValue(value: string): value is AppLocale {
  return supportedLocales.includes(value as AppLocale);
}
