import { ShoppingBag } from 'lucide-react';
import { defaultLocale, type AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { localeHomePath, localeRecipesPath, localeSavedPath, localeShoppingListPath } from '@/lib/i18n/routes';
import { LanguageSwitcher } from './language-switcher';
import { Wordmark } from './wordmark';

type SiteHeaderProps = {
  homeHref?: string;
  recipesHref?: string;
  locale?: AppLocale;
  pathname?: string;
};

export function SiteHeader({
  homeHref,
  recipesHref,
  locale = defaultLocale,
  pathname,
}: SiteHeaderProps) {
  const messages = getUiMessages(locale);
  const resolvedHomeHref = homeHref ?? localeHomePath(locale);
  const resolvedRecipesHref = recipesHref ?? localeRecipesPath(locale);

  return (
    <header className="site-header">
      <Wordmark href={resolvedHomeHref} locale={locale} />

      <nav aria-label={messages.a11y.primaryNavigation}>
        <a href={resolvedRecipesHref}>{messages.navigation.recipes}</a>
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
