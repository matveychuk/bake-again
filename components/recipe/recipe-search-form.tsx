import { Search } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { localeHomePath } from '@/lib/i18n/routes';
import type { RecipeCollectionId } from '@/content/recipes/collections';

export function RecipeSearchForm({ locale, query = '', collectionId, id = 'recipe-search', action }: {
  locale: AppLocale;
  query?: string;
  collectionId?: RecipeCollectionId | null;
  id?: string;
  action?: string;
}) {
  const messages = getUiMessages(locale).home;
  return (
    <search aria-label={messages.searchLabel}>
    <form className="search-form" action={action ?? `${localeHomePath(locale)}#recipes`} method="get">
      <Search aria-hidden="true" size={21} strokeWidth={1.7} />
      <label className="sr-only" htmlFor={id}>{messages.searchLabel}</label>
      <input key={query} id={id} name="q" type="search" maxLength={200} defaultValue={query} placeholder={messages.searchPlaceholder} />
      {collectionId && <input type="hidden" name="collection" value={collectionId} />}
      <button type="submit">{messages.searchAction}</button>
    </form>
    </search>
  );
}
