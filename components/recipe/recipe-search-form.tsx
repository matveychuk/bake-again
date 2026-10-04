import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { localeHomePath } from '@/lib/i18n/routes';
import type { RecipeCollectionId } from '@/content/recipes/collections';

export function RecipeSearchForm({
  locale,
  query = '',
  collectionId,
  id = 'recipe-search',
  action,
  compactMobile = false,
}: {
  locale: AppLocale;
  query?: string;
  collectionId?: RecipeCollectionId | null;
  id?: string;
  action?: string;
  compactMobile?: boolean;
}) {
  const messages = getUiMessages(locale).home;
  return (
    <search aria-label={messages.searchLabel}>
      <form
        data-analytics-search="true"
        className={`search-form${compactMobile ? ' search-form--compact-mobile' : ''}`}
        action={action ?? `${localeHomePath(locale)}#recipes`}
        method="get"
      >
        <Search
          className="search-form__leading-icon"
          aria-hidden="true"
          size={21}
          strokeWidth={1.7}
        />
        <label className="sr-only" htmlFor={id}>
          {messages.searchLabel}
        </label>
        <input
          key={query}
          id={id}
          name="q"
          type="search"
          maxLength={200}
          defaultValue={query}
          placeholder={messages.searchPlaceholder}
        />
        {collectionId && (
          <input type="hidden" name="collection" value={collectionId} />
        )}
        <Button
          type="submit"
          aria-label={compactMobile ? messages.searchAction : undefined}
        >
          <Search
            className="search-form__submit-icon"
            aria-hidden="true"
            size={20}
            strokeWidth={1.8}
          />
          <span className="search-form__submit-label">{messages.searchAction}</span>
        </Button>
      </form>
    </search>
  );
}
