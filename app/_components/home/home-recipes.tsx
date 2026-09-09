/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import { ArrowRight } from 'lucide-react';
import { Eyebrow } from '@/components/foundations/eyebrow';
import { RecipeCard } from '@/components/recipe/recipe-card';
import { recipeCatalog } from '@/content/recipes/catalog';

export function HomeRecipes() {
  return (
    <section className="recipes-section" id="recipes" aria-labelledby="recipes-title">
      <div className="section-heading">
        <div>
          <Eyebrow>Current inventory</Eyebrow>
          <h2 id="recipes-title">Every recipe so far.</h2>
        </div>
        <a href="/recipes">View all recipes <ArrowRight aria-hidden="true" size={18} /></a>
      </div>
      <div className="recipe-grid recipe-grid--catalog-preview">
        {recipeCatalog.map((recipe, index) => (
          <RecipeCard recipe={{ ...recipe, featured: index === 0 }} key={recipe.id} />
        ))}
      </div>
    </section>
  );
}
