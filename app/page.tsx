import Image from 'next/image';
import {
  ArrowRight,
  Bookmark,
  Calculator,
  Check,
  ChevronDown,
  CircleDashed,
  Clock3,
  Search,
  ShoppingBag,
} from 'lucide-react';
import { DesignReviewSwitcher } from './design-review-switcher';

const discoveryLinks = [
  'For breakfast',
  'Something for every day',
  'For a celebration',
  'Prepare ahead',
  'I just want to bake',
];

const recipes = [
  {
    title: 'Napoleon cake',
    eyebrow: 'Celebration · prepare ahead',
    detail: '12 layers · 28 cm',
    status: 'Tested',
    statusDetail: 'Schär Mix B',
    image: '/images/napoleon.png',
    alt: 'Gluten-free Napoleon cake with many thin layers and a cut slice',
    className: 'recipe-card recipe-card--wide',
  },
  {
    title: 'Chocolate crinkle cookies',
    eyebrow: 'Everyday baking',
    detail: 'Chill for 3–4 hours',
    status: 'Made many times',
    statusDetail: null,
    image: '/images/crinkle-cookies.png',
    alt: 'Chocolate crinkle cookies dusted with powdered sugar',
    className: 'recipe-card',
  },
  {
    title: 'Thin breakfast crepes',
    eyebrow: 'Breakfast · everyday',
    detail: 'Rest batter 15–30 min',
    status: 'Tested',
    statusDetail: 'As written',
    image: '/images/crepes.png',
    alt: 'A stack of thin golden gluten-free crepes',
    className: 'recipe-card',
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Bake Again home">
          Bake Again<span aria-hidden="true">.</span>
        </a>

        <nav aria-label="Primary navigation">
          <a href="#recipes">Recipes</a>
          <a href="#saved">Saved</a>
          <a className="nav-bag" href="#shopping-list">
            <ShoppingBag aria-hidden="true" size={17} strokeWidth={1.7} />
            Shopping list
          </a>
        </nav>

        <button className="language-button" type="button" aria-label="Change language">
          EN <ChevronDown aria-hidden="true" size={15} />
        </button>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">A small collection of tested gluten-free recipes</p>
          <h1 id="hero-title">
            Bake what you love.
            <br />
            <em>Know what works.</em>
          </h1>
          <p className="hero-intro">
            Familiar cakes, cookies and breakfasts — carefully adjusted, baked again,
            and written so you can get the same result at home.
          </p>

          <form className="search-form" action="#recipes">
            <Search aria-hidden="true" size={21} strokeWidth={1.7} />
            <label className="sr-only" htmlFor="recipe-search">
              Search recipes
            </label>
            <input
              id="recipe-search"
              name="q"
              type="search"
              placeholder="What would you like to bake?"
            />
            <button type="submit">Search</button>
          </form>

          <p className="search-hint">Try “crepes”, “chocolate” or a flour mix you have.</p>
        </div>

        <div className="hero-visual">
          <div className="hero-image-frame">
            <Image
              src="/images/napoleon.png"
              alt="Gluten-free Napoleon cake with many thin layers and a cut slice"
              fill
              priority
              sizes="(min-width: 960px) 48vw, 100vw"
            />
          </div>
          <a className="hero-recipe-note" href="#recipes">
            <span>
              <small>Start with a classic</small>
              Napoleon cake
            </span>
            <ArrowRight aria-hidden="true" size={20} />
          </a>
        </div>
      </section>

      <section className="discovery" aria-labelledby="discovery-title">
        <div className="section-kicker">
          <span>01</span>
          <p id="discovery-title">Choose by the moment</p>
        </div>
        <div className="discovery-links">
          {discoveryLinks.map((link) => (
            <a key={link} href="#recipes">
              {link}
              <ArrowRight aria-hidden="true" size={17} />
            </a>
          ))}
        </div>
      </section>

      <section className="recipes-section" id="recipes" aria-labelledby="recipes-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A good place to begin</p>
            <h2 id="recipes-title">Three recipes we know well.</h2>
          </div>
          <a href="#all-recipes">
            View all recipes <ArrowRight aria-hidden="true" size={18} />
          </a>
        </div>

        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <article className={recipe.className} key={recipe.title}>
              <a className="recipe-image" href={`#${recipe.title.toLowerCase().replaceAll(' ', '-')}`}>
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
                  <span className="recipe-status__mark" aria-hidden="true">
                    <Check size={12} strokeWidth={2.4} />
                  </span>
                  <span className="recipe-status__copy">
                    <strong>{recipe.status}</strong>
                    {recipe.statusDetail && <small>{recipe.statusDetail}</small>}
                  </span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="trust-section" aria-labelledby="trust-title">
        <div className="trust-intro">
          <div className="trust-mark" aria-hidden="true">
            <Check size={22} strokeWidth={2} />
          </div>
          <div className="trust-copy">
            <p className="eyebrow">Clear recipe status</p>
            <h2 id="trust-title">Know what was baked — and what was only worked out.</h2>
          </div>
        </div>

        <div className="trust-statuses" aria-label="Recipe status guide">
          <div className="trust-status-row trust-status-row--tested">
            <span className="trust-status-icon" aria-hidden="true">
              <Check size={14} strokeWidth={2.3} />
            </span>
            <span><strong>Tested</strong><small>Baked exactly as written</small></span>
          </div>
          <div className="trust-status-row trust-status-row--calculated">
            <span className="trust-status-icon" aria-hidden="true">
              <Calculator size={14} strokeWidth={1.9} />
            </span>
            <span><strong>Calculated</strong><small>Adjusted, not baked in this form</small></span>
          </div>
          <div className="trust-status-row trust-status-row--suggested">
            <span className="trust-status-icon" aria-hidden="true">
              <CircleDashed size={14} strokeWidth={1.9} />
            </span>
            <span><strong>Suggested</strong><small>A helpful option, not tested</small></span>
          </div>
        </div>

        <div className="trust-note">
          <p>Every recipe names the flour mix, form and quantity actually used.</p>
          <a href="#how-we-test">
            How we test recipes <ArrowRight aria-hidden="true" size={18} />
          </a>
        </div>
      </section>

      <footer>
        <a className="wordmark" href="#top">
          Bake Again<span aria-hidden="true">.</span>
        </a>
        <p>An exploratory Warm Precision homepage.</p>
      </footer>

      <DesignReviewSwitcher />
    </main>
  );
}
