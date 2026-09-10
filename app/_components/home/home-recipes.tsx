/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import { ArrowRight } from 'lucide-react';
import { Eyebrow } from '@/components/foundations/eyebrow';
import { RecipeCard } from '@/components/recipe/recipe-card';
import { getRecipeCatalog } from '@/content/recipes/catalog';
import type { AppLocale } from '@/lib/i18n/config';
import { getLocalizedRecipePath, localeRecipesPath } from '@/lib/i18n/routes';
import { getUiMessages } from '@/lib/i18n/messages';

export function HomeRecipes({ locale }: { locale: AppLocale }) {
  const recipesPath = localeRecipesPath(locale);
  const messages = getUiMessages(locale).home;
  const recipeCatalog = getRecipeCatalog(locale);

  return (
    <section className="recipes-section" id="recipes" aria-labelledby="recipes-title">
      <div className="section-heading">
        <div>
          <Eyebrow>{messages.recipesEyebrow}</Eyebrow>
          <h2 id="recipes-title">{messages.recipesTitle}</h2>
        </div>
        <a href={recipesPath}>{messages.viewAll} <ArrowRight aria-hidden="true" size={18} /></a>
      </div>
      <div className="recipe-grid recipe-grid--catalog-preview">
        {recipeCatalog.map((recipe, index) => (
          <RecipeCard
            recipe={{
              ...recipe,
              locale,
              featured: index === 0,
              href: getLocalizedRecipePath(recipe.id, locale) ?? `${recipesPath}/${recipe.href.split('/').at(-1)}`,
            }}
            key={recipe.id}
          />
        ))}
      </div>
    </section>
  );
}
