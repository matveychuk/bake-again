/* oxlint-disable next/no-html-link-for-pages -- normal links preserve vinext navigation */
import Image from 'next/image';
import { ChefHat, Clock3, FilePenLine } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import type { RecipeCatalogEntry } from '@/content/recipes/catalog';
import { isSaveableRecipeId } from '@/content/recipes/registry';
import { SaveRecipeControl } from './save-recipe-control';
import { getUiMessages } from '@/lib/i18n/messages';
import { localeDraftsPath, localeHomePath } from '@/lib/i18n/routes';
import styles from './recipe-card.module.css';

export type RecipeCardData = RecipeCatalogEntry & {
  featured?: boolean;
  locale?: AppLocale;
};

function CardFactText({ text }: { text: string }) {
  // Catalogue facts use a localized “label: value” string. Keep unlabelled copy intact.
  const separator = text.indexOf(': ');
  if (separator < 0) return <strong>{text}</strong>;
  return (
    <span>
      <span className="recipe-card-fact-label">
        {text.slice(0, separator + 1)}
      </span>{' '}
      <strong>{text.slice(separator + 2)}</strong>
    </span>
  );
}

export function RecipeCard({
  recipe,
  variant = 'full',
  headingLevel,
}: {
  recipe: RecipeCardData;
  variant?: 'full' | 'compact';
  headingLevel?: 'h2' | 'h3';
}) {
  const locale = recipe.locale ?? 'en';
  const messages = getUiMessages(locale);
  const draft = recipe.publicationStatus === 'unpublished';
  const collectionPath = draft
    ? localeDraftsPath(locale)
    : localeHomePath(locale);
  const Heading = headingLevel ?? (variant === 'compact' ? 'h2' : 'h3');
  return (
    <article
      lang={locale}
      className={`recipe-card${recipe.featured ? ' recipe-card--wide' : ''} ${variant === 'compact' ? styles.compact : styles.full}`}
    >
      <a
        className="recipe-card-link"
        href={recipe.href}
        aria-label={recipe.title}
      />
      <div className="recipe-image">
        <Image
          src={recipe.image}
          alt={recipe.alt}
          fill
          sizes={
            variant === 'compact'
              ? '120px'
              : '(min-width: 901px) 33vw, (min-width: 621px) 50vw, 100vw'
          }
        />
      </div>
      <div className="recipe-card-header">
        <Heading>
          <a href={recipe.href} className="recipe-card-meta-link" tabIndex={-1}>
            {recipe.title}
          </a>
        </Heading>
        {isSaveableRecipeId(recipe.id) && (
          <SaveRecipeControl
            locale={locale}
            recipeId={recipe.id}
            title={recipe.title}
          />
        )}
      </div>
      {(recipe.detail || recipe.difficulty) && (
        <ul className="recipe-card-facts">
          {recipe.detail && (
            <li>
              <Clock3 aria-hidden="true" />
              <CardFactText text={recipe.detail} />
            </li>
          )}
          {recipe.difficulty && (
            <li>
              <ChefHat aria-hidden="true" />
              <CardFactText text={recipe.difficulty} />
            </li>
          )}
        </ul>
      )}
      {variant !== 'compact' && recipe.flour && (
        <p className="recipe-card-flour">
          {messages.recipe.flour}: <span>{recipe.flour}</span>
        </p>
      )}
      {variant === 'compact' && draft && (
        <p className="recipe-card-draft">
          <FilePenLine aria-hidden="true" size={15} />
          {messages.catalog.workingRecord}
        </p>
      )}
      {variant !== 'compact' && (
        <div className={styles.footer}>
          {draft && (
            <p className="recipe-card-draft">
              <FilePenLine aria-hidden="true" size={15} />
              {messages.catalog.workingRecord}
            </p>
          )}
          <ul
            className="recipe-collections"
            aria-label={messages.catalog.collectionsLabel}
          >
            {recipe.collections.map((collection) => (
              <li key={collection.id}>
                <a
                  href={`${collectionPath}?collection=${collection.id}#recipes`}
                >
                  <span>{collection.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
