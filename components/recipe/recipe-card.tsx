import Image from 'next/image';
import { Check, Clock3 } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import { isSaveableRecipeId } from '@/content/recipes/registry';
import { SaveRecipeControl } from './save-recipe-control';
import { getUiMessages } from '@/lib/i18n/messages';

export type RecipeCardData = {
  id: string;
  title: string;
  eyebrow: string;
  detail: string;
  status: string;
  statusKind?: 'tested' | 'draft';
  statusDetail?: string | null;
  image: string;
  alt: string;
  href: string;
  featured?: boolean;
  locale?: AppLocale;
  collections: Array<{ id: string; label: string }>;
};

export function RecipeCard({ recipe }: { recipe: RecipeCardData }) {
  const className = recipe.featured
    ? 'recipe-card recipe-card--wide'
    : 'recipe-card';
  const messages = getUiMessages(recipe.locale ?? 'en');
  const isTested = recipe.statusKind === 'tested';

  return (
    <article className={className}>
      <a className="recipe-image" href={recipe.href}>
        <Image
          src={recipe.image}
          alt={recipe.alt}
          fill
          sizes="(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw"
        />
      </a>
      <div className="recipe-card-header">
        <a aria-labelledby={`recipe-card-title-${recipe.id}`} className="recipe-card-link" href={recipe.href}>
          <div>
            <p className="recipe-eyebrow">{recipe.eyebrow}</p>
            <h3 id={`recipe-card-title-${recipe.id}`}>{recipe.title}</h3>
            <ul className="recipe-collections" aria-label={messages.catalog.collectionsLabel}>
              {recipe.collections.map((collection) => (
                <li key={collection.id}>{collection.label}</li>
              ))}
            </ul>
          </div>
        </a>
        {isSaveableRecipeId(recipe.id) && <SaveRecipeControl locale={recipe.locale ?? 'en'} recipeId={recipe.id} title={recipe.title} />}
      </div>
      <a className="recipe-card-meta-link" href={recipe.href}>
        <div className="recipe-meta">
          <span>
            <Clock3 aria-hidden="true" size={15} strokeWidth={1.7} />
            {recipe.detail}
          </span>
          <span
            className={`recipe-status${isTested ? ' recipe-status--tested' : ''}`}
            aria-label={(isTested ? messages.a11y.recipeStatus : messages.a11y.recipeRecordStatus)(recipe.status, recipe.statusDetail)}
          >
            <span className="recipe-status__badge">
              {isTested && <span aria-hidden="true">
                <Check size={12} strokeWidth={2.4} />
              </span>}
              <strong>{recipe.status}</strong>
            </span>
            {recipe.statusDetail && (
              <small className="recipe-status__detail">
                <span aria-hidden="true">·</span> {recipe.statusDetail}
              </small>
            )}
          </span>
        </div>
      </a>
    </article>
  );
}
