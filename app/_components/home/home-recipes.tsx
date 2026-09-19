/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import { ArrowRight } from 'lucide-react';
import { Eyebrow } from '@/components/foundations/eyebrow';
import { RecipeCard } from '@/components/recipe/recipe-card';
import { getRecipeCatalog } from '@/content/recipes/catalog';
import { getLocalizedRecipeCollection } from '@/content/recipes/collections';
import type { RecipeCollectionId } from '@/content/recipes/collections';
import type { AppLocale } from '@/lib/i18n/config';
import { getLocalizedRecipePath, localeHomePath, localeRecipesPath } from '@/lib/i18n/routes';
import { getUiMessages } from '@/lib/i18n/messages';

export function HomeRecipes({
  locale,
  selectedCollectionId = null,
}: {
  locale: AppLocale;
  selectedCollectionId?: RecipeCollectionId | null;
}) {
  const recipesPath = localeRecipesPath(locale);
  const collectionHref = `${localeHomePath(locale)}#recipes`;
  const messages = getUiMessages(locale).home;
  const recipeCatalog = getRecipeCatalog(locale);
  const selectedCollection = selectedCollectionId
    ? getLocalizedRecipeCollection(selectedCollectionId, locale)
    : null;
  const visibleRecipes = selectedCollectionId
    ? recipeCatalog.filter((recipe) =>
        recipe.collections.some((collection) => collection.id === selectedCollectionId),
      )
    : recipeCatalog;

  return (
    <section className="recipes-section" id="recipes" aria-labelledby="recipes-title">
      <div className="section-heading">
        <div>
          <Eyebrow>{messages.recipesEyebrow}</Eyebrow>
          <h2 id="recipes-title">{selectedCollection ?? messages.recipesTitle}</h2>
          {selectedCollection && (
            <p className="recipes-collection-summary">
              {messages.collectionCount(visibleRecipes.length)}
            </p>
          )}
        </div>
        <a href={collectionHref}>{messages.viewAll} <ArrowRight aria-hidden="true" size={18} /></a>
      </div>
      <div className="recipe-grid recipe-grid--catalog-preview">
        {visibleRecipes.map((recipe, index) => (
          <RecipeCard
            recipe={{
              ...recipe,
              locale,
              featured: selectedCollectionId === null && index === 0,
              href: getLocalizedRecipePath(recipe.id, locale) ?? `${recipesPath}/${recipe.href.split('/').at(-1)}`,
            }}
            key={recipe.id}
          />
        ))}
      </div>
    </section>
  );
}
