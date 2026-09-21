import { canViewDrafts } from '@/lib/runtime/local-development.server';
import { ShoppingBag } from 'lucide-react';
import { defaultLocale, type AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { localeAboutPath, localeDraftsPath, localeHomePath, localeSavedPath, localeShoppingListPath } from '@/lib/i18n/routes';
import { LanguageSwitcher } from './language-switcher';
import { Wordmark } from './wordmark';

type SiteHeaderProps = {
  homeHref?: string;
  locale?: AppLocale;
  pathname?: string;
};

export async function SiteHeader({
  homeHref,
  locale = defaultLocale,
  pathname,
}: SiteHeaderProps) {
  const messages = getUiMessages(locale);
  const showDrafts = await canViewDrafts();
  const resolvedHomeHref = homeHref ?? localeHomePath(locale);

  return (
    <header className="site-header">
      <Wordmark href={resolvedHomeHref} locale={locale} />

      <nav aria-label={messages.a11y.primaryNavigation}>
        <a href={resolvedHomeHref}>{messages.navigation.recipes}</a>
        <a href={localeAboutPath(locale)} aria-current={pathname === localeAboutPath(locale) ? 'page' : undefined}>{messages.navigation.about}</a>
        {showDrafts && <a href={localeDraftsPath(locale)} aria-current={pathname === localeDraftsPath(locale) ? 'page' : undefined}>{messages.navigation.drafts}</a>}
        <a href={localeSavedPath(locale)}>{messages.navigation.saved}</a>
        <a className="nav-bag" href={localeShoppingListPath(locale)}>
          <ShoppingBag aria-hidden="true" size={17} strokeWidth={1.7} />
          {messages.navigation.shoppingList}
        </a>
      </nav>

      <LanguageSwitcher locale={locale} pathname={pathname ?? resolvedHomeHref} />
    </header>
  );
}
