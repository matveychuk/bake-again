import { ChevronDown, ShoppingBag } from 'lucide-react';
import { Wordmark } from './wordmark';

type SiteHeaderProps = {
  homeHref?: string;
  recipesHref?: string;
};

export function SiteHeader({
  homeHref = '#top',
  recipesHref = '/recipes',
}: SiteHeaderProps) {
  return (
    <header className="site-header">
      <Wordmark href={homeHref} />

      <nav aria-label="Primary navigation">
        <a href={recipesHref}>Recipes</a>
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
  );
}
