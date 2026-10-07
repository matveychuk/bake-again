import { canViewDrafts } from '@/lib/runtime/local-development.server';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { defaultLocale, type AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import {
  localeAboutPath,
  localeDraftsPath,
  localeHomePath,
  localeSavedPath,
  localeShoppingListPath,
} from '@/lib/i18n/routes';
import { LanguageSwitcher } from './language-switcher';
import { Wordmark } from './wordmark';
import { SocialLinks } from './social-links';

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
  const skipTarget =
    pathname === localeSavedPath(locale)
      ? 'saved-title'
      : pathname === localeShoppingListPath(locale)
        ? 'shopping-title'
        : pathname === localeAboutPath(locale)
          ? 'about-title'
          : pathname === localeDraftsPath(locale)
            ? 'drafts-title'
            : pathname === `/${locale}/privacy`
              ? 'privacy-title'
              : pathname?.includes('/techniques/')
                ? 'technique-title'
                : pathname?.includes('/recipes/')
                  ? 'recipe-content'
                  : 'hero-title';

  const navigationLinks = (
    <>
      <a
        href={resolvedHomeHref}
        aria-current={
          pathname === resolvedHomeHref
            ? 'page'
            : pathname?.includes('/recipes/')
              ? 'location'
              : undefined
        }
      >
        {messages.navigation.recipes}
      </a>
      {showDrafts && (
        <a
          href={localeDraftsPath(locale)}
          aria-current={
            pathname === localeDraftsPath(locale) ? 'page' : undefined
          }
        >
          {messages.navigation.drafts}
        </a>
      )}
      <a
        href={localeSavedPath(locale)}
        aria-current={pathname === localeSavedPath(locale) ? 'page' : undefined}
      >
        {messages.navigation.saved}
      </a>
      <a
        href={localeAboutPath(locale)}
        aria-current={pathname === localeAboutPath(locale) ? 'page' : undefined}
      >
        {messages.navigation.about}
      </a>
      <a
        className="nav-bag"
        href={localeShoppingListPath(locale)}
        aria-label={messages.navigation.shoppingList}
        title={messages.navigation.shoppingList}
        aria-current={
          pathname === localeShoppingListPath(locale) ? 'page' : undefined
        }
      >
        <span>{messages.navigation.shoppingList}</span>
        <ShoppingBag aria-hidden="true" size={17} strokeWidth={1.7} />
      </a>
    </>
  );

  return (
    <>
      <header className="site-header">
        <a className="skip-link" href={`#${skipTarget}`}>
          {messages.a11y.skipNavigation}
        </a>
        <Wordmark href={resolvedHomeHref} locale={locale} />

        <nav
          aria-label={messages.a11y.primaryNavigation}
          className={`site-nav-desktop${showDrafts ? '' : ' site-nav--public'}`}
        >
          {navigationLinks}
        </nav>

        <div className="site-header-tools">
          <SocialLinks locale={locale} variant="header" />
          <LanguageSwitcher
            locale={locale}
            pathname={pathname ?? resolvedHomeHref}
          />
        </div>
        <details className="site-mobile-menu">
          <summary>
            <Menu
              className="site-mobile-menu__open-icon"
              aria-hidden="true"
              size={20}
            />
            <X
              className="site-mobile-menu__close-icon"
              aria-hidden="true"
              size={20}
            />
            <span>{messages.navigation.menu}</span>
          </summary>
          <nav aria-label={messages.a11y.primaryNavigation}>
            {navigationLinks}
          </nav>
        </details>
      </header>
      {locale === 'uk' && (
        <div className="site-mobile-social">
          <SocialLinks locale={locale} variant="header" />
        </div>
      )}
    </>
  );
}
