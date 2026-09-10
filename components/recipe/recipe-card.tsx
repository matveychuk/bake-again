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
        <div>
          <p className="recipe-eyebrow">{recipe.eyebrow}</p>
          <h3>{recipe.title}</h3>
        </div>
        {isSaveableRecipeId(recipe.id) && <SaveRecipeControl locale={recipe.locale ?? 'en'} recipeId={recipe.id} title={recipe.title} />}
      </div>
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
    </article>
  );
}
