'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { personalStateRecipes } from '@/content/recipes/registry';
import { getRecipeCatalog } from '@/content/recipes/catalog';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { getLocalizedRecipePath, localeHomePath, localeRecipesPath } from '@/lib/i18n/routes';
import { readRecipeMemory, subscribeToRecipeMemory } from '@/lib/persistence/recipe-memory';
import { SaveRecipeControl } from '@/components/recipe/save-recipe-control';
import styles from './personal-state.module.css';

export function SavedRecipesPage({ locale }: { locale: AppLocale }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const messages = getUiMessages(locale).personal;
  const recipeCatalog = getRecipeCatalog(locale);
  useEffect(() => {
    const update = () => setSavedIds(readRecipeMemory().savedRecipeIds);
    update();
    return subscribeToRecipeMemory(update);
  }, []);
  const recipes = savedIds.map((id) => recipeCatalog.find((recipe) => recipe.id === id)).filter((recipe): recipe is (typeof recipeCatalog)[number] => Boolean(recipe));

  return <section className={styles.page} aria-labelledby="saved-title">
    <div className={styles.heading}><p>Want to bake</p><h1 id="saved-title">{messages.savedTitle}</h1></div>
    {recipes.length === 0 ? <div className={styles.empty}><p>{messages.savedEmpty}</p><a href={`${localeHomePath(locale)}#recipes`}>{messages.browseRecipes}</a></div> : <div className={styles.cards}>
      {recipes.map((recipe) => {
        const localizedRecipe = personalStateRecipes.find((candidate) => candidate.id === recipe.id);
        const image = localizedRecipe?.media.find((media) => media.id === localizedRecipe.heroMediaId);
        const href = getLocalizedRecipePath(recipe.id, locale) ?? `${localeRecipesPath(locale)}/${recipe.href.split('/').at(-1)}`;
        return <article className={styles.card} key={recipe.id}>
          <a className={styles.image} href={href}><Image alt={image?.alt[locale] ?? recipe.alt} fill sizes="(max-width: 900px) 40vw, 12rem" src={image?.path ?? recipe.image} /></a>
          <div className={styles.cardCopy}><div className={styles.cardTop}><h2>{localizedRecipe?.title[locale] ?? recipe.title}</h2><SaveRecipeControl locale={locale} recipeId={recipe.id} title={localizedRecipe?.title[locale] ?? recipe.title} /></div><p>{localizedRecipe?.summary[locale] ?? recipe.detail}</p><a href={href}>{messages.browseRecipes}</a></div>
        </article>;
      })}
    </div>}
  </section>;
}
