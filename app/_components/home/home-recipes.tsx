/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import { ArrowRight } from 'lucide-react';
import { Eyebrow } from '@/components/foundations/eyebrow';
import { RecipeCard } from '@/components/recipe/recipe-card';
import { searchRecipes } from '@/content/recipes/search';
import { getLocalizedRecipeCollection } from '@/content/recipes/collections';
import type { RecipeCollectionId } from '@/content/recipes/collections';
import type { AppLocale } from '@/lib/i18n/config';
import { getLocalizedRecipePath, localeDraftsPath, localeHomePath, localeRecipesPath } from '@/lib/i18n/routes';
import { getUiMessages } from '@/lib/i18n/messages';

export function HomeRecipes({
  locale,
  selectedCollectionId = null,
  query = '',
  drafts = false,
}: {
  locale: AppLocale;
  drafts?: boolean;
  query?: string;
  selectedCollectionId?: RecipeCollectionId | null;
}) {
  const recipesPath = localeRecipesPath(locale);
  const collectionHref = `${drafts ? localeDraftsPath(locale) : localeHomePath(locale)}#recipes`;
  const messages = getUiMessages(locale).home;
  const selectedCollection = selectedCollectionId
    ? getLocalizedRecipeCollection(selectedCollectionId, locale)
    : null;
  const visibleRecipes = searchRecipes(locale, query, selectedCollectionId, drafts ? 'unpublished' : 'published');

  return (
    <section className={`recipes-section recipes-section--search${drafts ? ' recipes-section--drafts' : ''}`} id="recipes" aria-labelledby="recipes-title">
      <div className="section-heading">
        <div>
          {!drafts && <Eyebrow>{messages.recipesEyebrow}</Eyebrow>}
          <h2 className={drafts && !query && !selectedCollection ? 'drafts-count' : undefined} id="recipes-title">{query ? messages.searchResultsTitle(query) : selectedCollection ?? (drafts ? messages.collectionCount(visibleRecipes.length) : messages.recipesTitle)}</h2>
          {(selectedCollection || query) && (
            <p className="recipes-collection-summary">
              {messages.collectionCount(visibleRecipes.length)}
              {query && selectedCollection && ` · ${selectedCollection}`}
            </p>
          )}
        </div>
        {(selectedCollectionId || query) && (
          <a href={collectionHref}>{messages.viewAll} <ArrowRight aria-hidden="true" size={18} /></a>
        )}
      </div>
      {visibleRecipes.length === 0 && <p className="recipes-search-empty">{query || selectedCollection ? messages.searchEmpty : drafts ? getUiMessages(locale).catalog.draftsEmpty : getUiMessages(locale).catalog.publishedEmpty}</p>}
      <div className="recipe-grid recipe-grid--catalog-preview">
        {visibleRecipes.map((recipe, index) => (
          <RecipeCard
            recipe={{
              ...recipe,
              locale,
              featured: !drafts && !query && selectedCollectionId === null && index === 0,
              href: getLocalizedRecipePath(recipe.id, locale) ?? `${recipesPath}/${recipe.href.split('/').at(-1)}`,
            }}
            key={recipe.id}
          />
        ))}
      </div>
    </section>
  );
}
