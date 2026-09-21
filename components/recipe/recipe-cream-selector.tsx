'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Check, ChevronRight } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import styles from './recipe-cream-selector.module.css';

export type RecipeCreamSelectorOption = {
  id: string;
  title: string;
  description: string;
  href: string;
};

export function RecipeCreamSelector({
  locale,
  options,
  recommendedRecipeId,
  selectedRecipeId,
}: {
  locale: AppLocale;
  options: RecipeCreamSelectorOption[];
  recommendedRecipeId: string;
  selectedRecipeId: string | null;
}) {
  const [expanded, setExpanded] = useState(!selectedRecipeId);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const messages = getUiMessages(locale).recipe;
  const recommended =
    options.find((option) => option.id === recommendedRecipeId) ?? options[0];

  if (!recommended) return null;

  const selected = options.find((option) => option.id === selectedRecipeId);

  function selectCream(recipeId: string) {
    const next = new URLSearchParams(searchParams.toString());
    next.set('cream', recipeId);
    setExpanded(false);
    router.replace(`${pathname}?${next.toString()}#cream-options`, {
      scroll: false,
    });
  }

  if (selected && !expanded) {
    return (
      <section className={styles.summary} id="cream-options">
        <div className={styles.summaryCopy}>
          <p className={styles.eyebrow}>{messages.creamSelectedEyebrow}</p>
          <h2>{selected.title}</h2>
          <span className={styles.tested}>
            <Check aria-hidden="true" size={15} strokeWidth={2.2} />
            {messages.creamTested}
          </span>
        </div>
        <div className={styles.summaryActions}>
          <a href={selected.href}>
            {messages.viewCreamRecipe}
            <ChevronRight aria-hidden="true" size={16} />
          </a>
          <button onClick={() => setExpanded(true)} type="button">
            {messages.changeCream}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} id="cream-options">
      <div className={styles.heading}>
        <p className={styles.eyebrow}>{messages.creamOptionsEyebrow}</p>
        <h2>{messages.creamOptionsTitle}</h2>
        <p className={styles.intro}>
          {messages.creamOptionsIntro(recommended.title)}
        </p>
      </div>

      <fieldset className={styles.fieldset}>
        <legend className={styles.visuallyHidden}>
          {messages.creamOptionsTitle}
        </legend>
        <div className={styles.options}>
          {options.map((option) => {
            const selectedOption = option.id === selectedRecipeId;
            const recommendedOption = option.id === recommendedRecipeId;

            return (
              <article
                className={styles.option}
                data-selected={selectedOption || undefined}
                key={option.id}
              >
                <label className={styles.selection}>
                  <span className={styles.optionTopline}>
                    <input
                      aria-label={messages.chooseCream(option.title)}
                      checked={selectedOption}
                      name="recipe-cream"
                      onChange={() => selectCream(option.id)}
                      type="radio"
                      value={option.id}
                    />
                    <strong>{option.title}</strong>
                  </span>
                  <span className={styles.description}>
                    {option.description}
                  </span>
                </label>
                <span className={styles.meta}>
                  <span className={styles.tested}>
                    <Check aria-hidden="true" size={15} strokeWidth={2.2} />
                    {messages.creamTested}
                  </span>
                  {recommendedOption ? (
                    <span className={styles.recommended}>
                      {messages.creamRecommended}
                    </span>
                  ) : null}
                </span>
                <a className={styles.viewRecipe} href={option.href}>
                  {messages.viewCreamRecipe}
                  <ChevronRight aria-hidden="true" size={16} />
                </a>
              </article>
            );
          })}
        </div>
      </fieldset>
    </section>
  );
}
