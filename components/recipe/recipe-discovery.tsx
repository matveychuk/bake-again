import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { localeHomePath } from '@/lib/i18n/routes';
import { getUiMessages } from '@/lib/i18n/messages';
import type { AppLocale } from '@/lib/i18n/config';
import { isReusableComponentRecipeId } from '@/content/recipes/recipe-component-records';
import { getRecipeCatalog } from '@/content/recipes/catalog';
import { getLocalizedRecipeCollection } from '@/content/recipes/collections';
import { getRecipeRecommendations } from '@/content/recipes/recommendations';
import { RecentRecipes } from '@/components/personal-state/recent-recipes';
import { RecipeCard } from './recipe-card';
import styles from '@/components/personal-state/recent-recipes.module.css';

const headings = {
  uk: {
    related: 'Схожі рецепти',
    uses: 'У яких рецептах використати',
    collection: (name: string) => `Ще з добірки «${name}»`,
    more: 'Що ще приготувати',
  },
  en: {
    related: 'Related recipes',
    uses: 'Recipes that use it',
    collection: (name: string) => `More from “${name}”`,
    more: 'What to make next',
  },
  es: {
    related: 'Recetas relacionadas',
    uses: 'Recetas que lo usan',
    collection: (name: string) => `Más de «${name}»`,
    more: 'Qué más preparar',
  },
};

export function RecipeDiscovery({
  locale,
  currentRecipeId,
  preview = false,
  placement = 'recipe',
  catalogLinkVariant = 'default',
}: {
  locale: AppLocale;
  currentRecipeId: string;
  preview?: boolean;
  placement?: 'recipe' | 'cook-completion';
  catalogLinkVariant?: 'link' | 'default';
}) {
  const catalog = getRecipeCatalog(locale);
  const { related, commonCollection, more } = getRecipeRecommendations(
    currentRecipeId,
    catalog,
  );
  const copy = headings[locale];
  const completion = placement === 'cook-completion';
  const sections = completion
    ? [
        {
          id: 'next-recipes',
          title: copy.more,
          recipes: [...related, ...more].slice(0, 4),
        },
      ]
    : [
        {
          id: 'related-recipes',
          title: commonCollection
            ? copy.collection(
                getLocalizedRecipeCollection(commonCollection, locale),
              )
            : isReusableComponentRecipeId(currentRecipeId)
              ? copy.uses
              : copy.related,
          recipes: related,
        },
        { id: 'more-recipes', title: copy.more, recipes: more },
      ];
  return (
    <>
      {sections
        .filter(({ recipes }) => recipes.length > 0)
        .map(({ id, title, recipes }) => (
          <section
            key={id}
            id={`${id}-${locale}`}
            className={completion ? styles.embeddedSection : styles.section}
            aria-labelledby={`${id}-title-${locale}`}
          >
            <h2 className={styles.title} id={`${id}-title-${locale}`}>
              {title}
            </h2>
            <div className={styles.discoveryGrid}>
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={{ ...recipe, locale }}
                  variant="discovery"
                  headingLevel="h3"
                />
              ))}
            </div>
            {completion && (
              <Button
                href={`${localeHomePath(locale)}#recipes`}
                className={styles.catalogAction}
                variant={catalogLinkVariant}
              >
                {getUiMessages(locale).catalog.allRecipes}
                <ArrowRight aria-hidden="true" />
              </Button>
            )}
          </section>
        ))}
      {!completion && (
        <RecentRecipes
          locale={locale}
          currentRecipeId={currentRecipeId}
          recipes={catalog}
          preview={preview}
        />
      )}
    </>
  );
}
