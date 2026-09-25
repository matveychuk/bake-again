/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import Image from 'next/image';
import { getRecipeCatalog } from '@/content/recipes/catalog';
import { RecipeSearchForm } from '@/components/recipe/recipe-search-form';
import type { RecipeCollectionId } from '@/content/recipes/collections';
import { ArrowRight } from 'lucide-react';
import { Eyebrow } from '@/components/foundations/eyebrow';
import type { AppLocale } from '@/lib/i18n/config';
import { getLocalizedRecipePath, localeRecipesPath } from '@/lib/i18n/routes';
import { getUiMessages } from '@/lib/i18n/messages';

export function HomeHero({ locale, query = '', selectedCollectionId }: { locale: AppLocale; query?: string; selectedCollectionId?: RecipeCollectionId | null }) {
  const recipesPath = localeRecipesPath(locale);
  const catalog = getRecipeCatalog(locale);
  const featured = catalog.find((recipe) => recipe.id === 'gluten-free-napoleon') ?? catalog[0];
  const featuredPath = featured ? getLocalizedRecipePath(featured.id, locale) ?? recipesPath : null;
  const messages = getUiMessages(locale).home;

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <Eyebrow>{messages.eyebrow}</Eyebrow>
        <h1 id="hero-title" tabIndex={-1}>
          {messages.title[0]}
          <br />
          {messages.title[1]}
          <br />
          <em>{messages.title[2]}</em>
        </h1>
        <p className="hero-intro">
          {messages.intro}
        </p>

        <RecipeSearchForm locale={locale} query={query} collectionId={selectedCollectionId} />

        <p className="search-hint">{messages.collectionCount(catalog.length)}</p>
      </div>

      <div className="hero-visual">
        <div className="hero-image-frame">
          <Image
            src={featured?.image ?? "/images/recipes/gluten-free-napoleon-card-v1.webp"}
            alt={featured?.alt ?? (locale === 'uk' ? 'Безглютеновий Наполеон із багатьма тонкими коржами та відрізаним шматком' : locale === 'es' ? 'Tarta Napoleón sin gluten con muchas capas finas y una porción cortada' : 'Gluten-free Napoleon cake with many thin layers and a cut slice')}
            fill
            priority
            sizes="(min-width: 960px) 48vw, 100vw"
          />
        </div>
        {featuredPath && featured && <a className="hero-recipe-note" href={featuredPath}>
          <span><small>{messages.featuredKicker}</small>{featured.title}</span>
          <ArrowRight aria-hidden="true" size={20} />
        </a>}
      </div>
    </section>
  );
}
