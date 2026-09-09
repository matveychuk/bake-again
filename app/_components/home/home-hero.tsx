/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import Image from 'next/image';
import { ArrowRight, Search } from 'lucide-react';
import { Eyebrow } from '@/components/foundations/eyebrow';

export function HomeHero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <Eyebrow>A small collection of tested gluten-free recipes</Eyebrow>
        <h1 id="hero-title">
          Bake what
          <br />
          you love.
          <br />
          <em>Know what works.</em>
        </h1>
        <p className="hero-intro">
          Familiar cakes, cookies and breakfasts — carefully adjusted, baked again,
          and written so you can get the same result at home.
        </p>

        <form className="search-form" action="/recipes">
          <Search aria-hidden="true" size={21} strokeWidth={1.7} />
          <label className="sr-only" htmlFor="recipe-search">Search recipes</label>
          <input id="recipe-search" name="q" type="search" placeholder="What would you like to bake?" />
          <button type="submit">Search</button>
        </form>

        <p className="search-hint">Browse all 17 working recipes in the current inventory.</p>
      </div>

      <div className="hero-visual">
        <div className="hero-image-frame">
          <Image
            src="/images/recipes/gluten-free-napoleon-card-v1.png"
            alt="Gluten-free Napoleon cake with many thin layers and a cut slice"
            fill
            priority
            sizes="(min-width: 960px) 48vw, 100vw"
          />
        </div>
        <a className="hero-recipe-note" href="/recipes/napoleon-cake">
          <span><small>Start with a classic</small>Napoleon cake</span>
          <ArrowRight aria-hidden="true" size={20} />
        </a>
      </div>
    </section>
  );
}
