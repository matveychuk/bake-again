import Image from 'next/image';
import { Bookmark, Check, Clock3 } from 'lucide-react';

export type RecipeCardData = {
  title: string;
  eyebrow: string;
  detail: string;
  status: string;
  statusDetail?: string | null;
  image: string;
  alt: string;
  href: string;
  featured?: boolean;
};

export function RecipeCard({ recipe }: { recipe: RecipeCardData }) {
  const className = recipe.featured
    ? 'recipe-card recipe-card--wide'
    : 'recipe-card';

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
        <button type="button" aria-label={`Save ${recipe.title}`}>
          <Bookmark aria-hidden="true" size={20} strokeWidth={1.6} />
        </button>
      </div>
      <div className="recipe-meta">
        <span>
          <Clock3 aria-hidden="true" size={15} strokeWidth={1.7} />
          {recipe.detail}
        </span>
        <span
          className="recipe-status recipe-status--tested"
          aria-label={`Testing status: ${recipe.status}${
            recipe.statusDetail ? `, ${recipe.statusDetail}` : ''
          }`}
        >
          <span className="recipe-status__badge">
            <span aria-hidden="true">
              <Check size={12} strokeWidth={2.4} />
            </span>
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
