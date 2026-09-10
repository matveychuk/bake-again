/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import Image from 'next/image';
import { ArrowRight, Search } from 'lucide-react';
import { Eyebrow } from '@/components/foundations/eyebrow';
import type { AppLocale } from '@/lib/i18n/config';
import { getLocalizedRecipePath, localeRecipesPath } from '@/lib/i18n/routes';
import { getUiMessages } from '@/lib/i18n/messages';

export function HomeHero({ locale }: { locale: AppLocale }) {
  const recipesPath = localeRecipesPath(locale);
  const napoleonPath = getLocalizedRecipePath('gluten-free-napoleon', locale) ?? recipesPath;
  const messages = getUiMessages(locale).home;

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <Eyebrow>{messages.eyebrow}</Eyebrow>
        <h1 id="hero-title">
          {messages.title[0]}
          <br />
          {messages.title[1]}
          <br />
          <em>{messages.title[2]}</em>
        </h1>
        <p className="hero-intro">
          {messages.intro}
        </p>

        <form className="search-form" action={recipesPath}>
          <Search aria-hidden="true" size={21} strokeWidth={1.7} />
          <label className="sr-only" htmlFor="recipe-search">{messages.searchLabel}</label>
          <input id="recipe-search" name="q" type="search" placeholder={messages.searchPlaceholder} />
          <button type="submit">{messages.searchAction}</button>
        </form>

        <p className="search-hint">{messages.inventoryHint(17)}</p>
      </div>

      <div className="hero-visual">
        <div className="hero-image-frame">
          <Image
            src="/images/recipes/gluten-free-napoleon-card-v1.png"
            alt={locale === 'uk' ? 'Безглютеновий Наполеон із багатьма тонкими коржами та відрізаним шматком' : locale === 'es' ? 'Tarta Napoleón sin gluten con muchas capas finas y una porción cortada' : 'Gluten-free Napoleon cake with many thin layers and a cut slice'}
            fill
            priority
            sizes="(min-width: 960px) 48vw, 100vw"
          />
        </div>
        <a className="hero-recipe-note" href={napoleonPath}>
          <span><small>{messages.featuredKicker}</small>{messages.featuredTitle}</span>
          <ArrowRight aria-hidden="true" size={20} />
        </a>
      </div>
    </section>
  );
}
