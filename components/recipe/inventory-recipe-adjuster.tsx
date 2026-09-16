'use client';

import { useMemo, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { SectionTitle } from '@/components/foundations/section-title';
import {
  findScalingAnchor,
  scaleStructuredQuantity,
} from '@/content/recipes/inventory-calculation';
import { formatNumber, formatQuantity, formatUnit } from '@/lib/i18n/format';
import type { InventoryArchiveSection } from '@/content/recipes/inventory';
import type { RecipeDraft } from '@/content/recipes/recipe.types';
import type { StructuredRecipeContent } from '@/content/recipes/source-recipe.types';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import {
  AddRecipeIngredientsControl,
  type SourceShoppingRecipe,
} from './add-recipe-ingredients-control';
import { RecipeIngredientChecklist } from './recipe-ingredient-checklist';
import { RecipeIngredientHeading } from './recipe-ingredient-heading';
import styles from './inventory-recipe-adjuster.module.css';

export function InventoryRecipeAdjuster({
  recipe,
  archiveSections,
  locale,
  personalRecipe,
  scalingAnchorIngredientId,
  sourceShoppingRecipe,
}: {
  recipe: StructuredRecipeContent | undefined;
  archiveSections: InventoryArchiveSection[];
  locale: AppLocale;
  personalRecipe?: RecipeDraft | null;
  scalingAnchorIngredientId?: string;
  sourceShoppingRecipe?: SourceShoppingRecipe | null;
}) {
  const [mode, setMode] = useState<'scale' | 'ingredient'>('scale');
  const [scale, setScale] = useState(1);
  const ingredients = useMemo(
    () =>
      recipe?.ingredientSections.flatMap((section) => section.ingredients) ??
      [],
    [recipe],
  );
  const anchor = useMemo(
    () => findScalingAnchor(ingredients, scalingAnchorIngredientId),
    [ingredients, scalingAnchorIngredientId],
  );
  const [available, setAvailable] = useState(() => anchor?.amount.minimum ?? 0);
  const scaleFactor =
    mode === 'ingredient' && anchor && available > 0
      ? available / anchor.amount.minimum
      : scale;
  const isAdjustable = Boolean(recipe && anchor);
  const messages = getUiMessages(locale);
  const scaling = messages.scaling;
  const formattedScaleFactor = formatNumber(
    locale,
    Math.round(scaleFactor * 100) / 100,
  );

  return (
    <section className={styles.planning} id="adjust-recipe">
      <aside className={styles.controls}>
        <SectionTitle
          eyebrow={scaling.eyebrow}
          eyebrowClassName={styles.eyebrow}
        >
          {scaling.title}
        </SectionTitle>
        <p className={styles.intro}>{scaling.intro}</p>
        {isAdjustable && anchor ? (
          <>
            <div className={styles.modeTabs}>
              <button
                type="button"
                aria-pressed={mode === 'scale'}
                onClick={() => setMode('scale')}
              >
                {scaling.scaleRecipe}
              </button>
              <button
                type="button"
                aria-pressed={mode === 'ingredient'}
                onClick={() => setMode('ingredient')}
              >
                {scaling.useWhatIHave}
              </button>
            </div>
            {mode === 'scale' ? (
              <div>
                <span className={styles.label}>{scaling.batchScale}</span>
                <div className={styles.scales}>
                  {[0.5, 1, 1.5, 2].map((factor) => (
                    <button
                      type="button"
                      aria-pressed={scale === factor}
                      key={factor}
                      onClick={() => setScale(factor)}
                    >
                      {formatNumber(locale, factor)}×
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className={styles.label} htmlFor="available-anchor">
                  {scaling.availableIngredient(anchor.ingredient.name)}
                </label>
                <div className={styles.amountInput}>
                  <input
                    id="available-anchor"
                    min="1"
                    step={anchor.amount.unit === 'piece' ? 1 : undefined}
                    type="number"
                    value={available || ''}
                    onChange={(event) =>
                      setAvailable(Number(event.target.value))
                    }
                  />
                  <span>
                    {formatUnit(
                      locale,
                      anchor.amount.unit,
                      available || anchor.amount.minimum,
                    )}
                  </span>
                </div>
              </div>
            )}
            <p className={styles.result}>
              <strong>{scaling.calculated}</strong>{' '}
              {scaling.calculatedResult(formattedScaleFactor)}
            </p>
          </>
        ) : (
          <div className={styles.locked}>
            <strong>{scaling.quantitiesMissing}</strong>
            {scaling.quantitiesMissingDescription}
          </div>
        )}
      </aside>
      <div className={styles.content}>
        <RecipeIngredientHeading
          action={
            personalRecipe || sourceShoppingRecipe ? (
              <AddRecipeIngredientsControl
                locale={locale}
                recipe={personalRecipe ?? sourceShoppingRecipe!}
              />
            ) : (
              <button
                className={styles.unavailableAddAll}
                disabled
                title={messages.personal.testedBaseOnly}
                type="button"
              >
                <ShoppingBag aria-hidden="true" size={17} />{' '}
                {messages.personal.addAll}
              </button>
            )
          }
          eyebrow={messages.recipe.workingRecord}
          title={messages.recipe.ingredients}
        />
        {recipe ? (
          <>
            <RecipeIngredientChecklist
              sections={recipe.ingredientSections}
              amountFor={(ingredient) => ({
                primary: formatQuantity(
                  locale,
                  scaleStructuredQuantity(
                    ingredient.quantity.base ??
                      ingredient.quantity.equivalent ??
                      null,
                    scaleFactor,
                  ),
                ),
                secondary:
                  ingredient.quantity.equivalent && ingredient.quantity.base
                    ? formatQuantity(
                        locale,
                        scaleStructuredQuantity(
                          ingredient.quantity.equivalent,
                          scaleFactor,
                        ),
                      )
                    : undefined,
              })}
            />
            {recipe.gapNote && (
              <aside className={styles.gapNote}>
                <strong>{scaling.sourceGap}</strong>
                <p>{recipe.gapNote}</p>
              </aside>
            )}
          </>
        ) : archiveSections.length > 0 ? (
          <div className={styles.sections}>
            {archiveSections.map((section) => (
              <section className={styles.section} key={section.title}>
                <h3>{section.title}</h3>
                <pre>{section.content}</pre>
              </section>
            ))}
          </div>
        ) : (
          <div className={styles.pending}>
            <h3>Recipe details pending</h3>
            <p>
              This working recipe is verified by the author, but its exact
              ingredients and method have not yet been transferred into the
              inventory.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
