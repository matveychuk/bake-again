'use client';

import { Button } from '@/components/ui/button';

import { trackEvent } from '@/lib/analytics/umami';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
import { recipeReaderCopy } from '@/content/recipes/reader-copy';
import {
  parseSourceRecipeConfiguration,
  sourceBatchScaleFactors,
  sourceRecipeConfigurationKey,
  sourceRecipeScalingBounds,
  updateSourceRecipeConfigurationParams,
  type SourceRecipeConfiguration,
} from '@/content/recipes/source-recipe-configuration';
import { EvidenceBadge } from './evidence-badge';
import {
  AddRecipeIngredientsControl,
  type SourceShoppingRecipe,
} from './add-recipe-ingredients-control';
import { RecipeIngredientChecklist } from './recipe-ingredient-checklist';
import { RecipeIngredientHeading } from './recipe-ingredient-heading';
import styles from './inventory-recipe-adjuster.module.css';

const baseConfiguration: SourceRecipeConfiguration = {
  kind: 'base',
  mode: 'scale',
  scaleFactor: 1,
};

export function InventoryRecipeAdjuster({
  recipe,
  archiveSections,
  locale,
  personalRecipe,
  scalingAnchorIngredientId,
  showWorkingRecord = true,
  sourceShoppingRecipe,
  configuration = baseConfiguration,
  syncConfigurationToUrl = true,
}: {
  recipe: StructuredRecipeContent | undefined;
  archiveSections: InventoryArchiveSection[];
  locale: AppLocale;
  personalRecipe?: RecipeDraft | null;
  scalingAnchorIngredientId?: string;
  showWorkingRecord?: boolean;
  sourceShoppingRecipe?: SourceShoppingRecipe | null;
  configuration?: SourceRecipeConfiguration;
  syncConfigurationToUrl?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const availableInputId = useId();
  const availableErrorId = `${availableInputId}-error`;
  const [mode, setMode] = useState<'scale' | 'ingredient'>(configuration.mode);
  const [scale, setScale] = useState(
    configuration.mode === 'scale' ? configuration.scaleFactor : 1,
  );
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
  const availableChanged = useRef(false);
  const [available, setAvailable] = useState(() =>
    configuration.mode === 'ingredient'
      ? String(configuration.availableAmount)
      : String(anchor?.amount.minimum ?? ''),
  );
  const scalingBounds = sourceRecipeScalingBounds(
    personalRecipe,
    scalingAnchorIngredientId,
  );
  const draftConfiguration = useMemo(() => {
    const params =
      mode === 'scale'
        ? updateSourceRecipeConfigurationParams(searchParams, {
            mode: 'scale',
            scaleFactor: scale,
          })
        : updateSourceRecipeConfigurationParams(searchParams, {
            mode: 'ingredient',
            ingredientId: anchor?.ingredient.id ?? '',
            availableAmount: available,
            unit: anchor?.amount.unit ?? 'g',
          });
    return parseSourceRecipeConfiguration(
      params,
      recipe,
      scalingAnchorIngredientId,
      scalingBounds,
    );
  }, [
    anchor,
    available,
    mode,
    recipe,
    scale,
    scalingAnchorIngredientId,
    scalingBounds,
    searchParams,
  ]);
  const scaleFactor =
    draftConfiguration.kind === 'invalid'
      ? null
      : draftConfiguration.scaleFactor;
  const isAdjustable = Boolean(recipe && anchor);
  const messages = getUiMessages(locale);
  const concise = recipe?.presentation === 'concise';
  const readerCopy = recipeReaderCopy[locale];
  const invalidAmount = draftConfiguration.kind === 'invalid';
  const adjusted = scaleFactor !== null && Math.abs(scaleFactor - 1) > 0.000001;
  const fractionalEggs = ingredients.some((ingredient) => {
    const amount = ingredient.quantity.base;
    return (
      ingredient.id === 'eggs' &&
      amount?.kind === 'exact' &&
      Math.abs(
        amount.value * (scaleFactor ?? 1) -
          Math.round(amount.value * (scaleFactor ?? 1)),
      ) > 0.000001
    );
  });
  const scaling = messages.scaling;
  const formattedScaleFactor = formatNumber(
    locale,
    Math.round((scaleFactor ?? 1) * 100) / 100,
  );

  function replaceConfiguration(params: URLSearchParams) {
    if (!syncConfigurationToUrl) return;
    const query = params.toString();
    if (query === searchParams.toString()) return;
    const hash = window.location.hash;
    router.replace(`${query ? `${pathname}?${query}` : pathname}${hash}`, {
      scroll: false,
    });
  }

  useEffect(() => {
    if (!syncConfigurationToUrl) return;
    function restoreConfiguration() {
      const restored = parseSourceRecipeConfiguration(
        window.location.search,
        recipe,
        scalingAnchorIngredientId,
        scalingBounds,
      );
      setMode(restored.mode);
      if (restored.mode === 'scale') {
        setScale(restored.scaleFactor);
      } else {
        setAvailable(String(restored.availableAmount));
      }
    }
    window.addEventListener('popstate', restoreConfiguration);
    return () => window.removeEventListener('popstate', restoreConfiguration);
  }, [
    recipe,
    scalingAnchorIngredientId,
    scalingBounds,
    syncConfigurationToUrl,
  ]);

  function selectScale(factor: (typeof sourceBatchScaleFactors)[number]) {
    if (mode !== 'scale' || scale !== factor)
      trackEvent('recipe_scale', {
        recipe_id: personalRecipe?.id ?? sourceShoppingRecipe?.id,
        locale,
        factor,
      });
    setMode('scale');
    setScale(factor);
    replaceConfiguration(
      updateSourceRecipeConfigurationParams(searchParams, {
        mode: 'scale',
        scaleFactor: factor,
      }),
    );
  }

  function useAvailableIngredient() {
    if (!anchor) return;
    const nextAvailable =
      mode === 'ingredient' ? available : String(anchor.amount.minimum);
    setMode('ingredient');
    setAvailable(nextAvailable);
    replaceConfiguration(
      updateSourceRecipeConfigurationParams(searchParams, {
        mode: 'ingredient',
        ingredientId: anchor.ingredient.id,
        availableAmount: nextAvailable,
        unit: anchor.amount.unit,
      }),
    );
  }

  return (
    <section
      className={`${styles.planning} ${concise ? styles.concise : ''}`}
      id="adjust-recipe"
    >
      <aside className={styles.controls}>
        <SectionTitle
          eyebrow={concise ? undefined : scaling.eyebrow}
          eyebrowClassName={styles.eyebrow}
        >
          {concise ? readerCopy.quantity : scaling.title}
        </SectionTitle>
        <p className={styles.intro}>
          {concise && anchor
            ? `${readerCopy.base}: ${anchor.ingredient.name} — ${formatQuantity(locale, anchor.ingredient.quantity.base)}${recipe?.yield ? ` · ${recipe.yield.label}` : ''}`
            : scaling.intro}
        </p>
        {concise &&
          recipe?.geometry &&
          !recipe.yield?.label.includes(recipe.geometry.label) && (
            <p className={styles.intro}>{recipe.geometry.label}</p>
          )}
        {isAdjustable && anchor ? (
          <>
            <div className={styles.modeTabs}>
              <button
                type="button"
                aria-pressed={mode === 'scale'}
                onClick={() => selectScale(scale)}
              >
                {scaling.scaleRecipe}
              </button>
              <button
                type="button"
                aria-pressed={mode === 'ingredient'}
                onClick={useAvailableIngredient}
              >
                {scaling.useWhatIHave}
              </button>
            </div>
            {mode === 'scale' ? (
              <div>
                <span className={styles.label}>{scaling.batchScale}</span>
                <div className={styles.scales}>
                  {sourceBatchScaleFactors.map((factor) => (
                    <button
                      type="button"
                      aria-pressed={scale === factor}
                      key={factor}
                      onClick={() => selectScale(factor)}
                    >
                      {formatNumber(locale, factor)}×
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className={styles.label} htmlFor={availableInputId}>
                  {scaling.availableIngredient(anchor.ingredient.name)}
                </label>
                <div className={styles.amountInput}>
                  <input
                    id={availableInputId}
                    min={
                      scalingBounds?.minimum ??
                      (anchor.amount.unit === 'piece' ? 1 : 0.01)
                    }
                    max={scalingBounds?.maximum}
                    step={anchor.amount.unit === 'piece' ? 1 : undefined}
                    type="number"
                    aria-describedby={
                      invalidAmount ? availableErrorId : undefined
                    }
                    aria-invalid={invalidAmount || undefined}
                    value={available}
                    onBlur={() => {
                      if (availableChanged.current && !invalidAmount)
                        trackEvent('recipe_ingredient_scale', {
                          recipe_id:
                            personalRecipe?.id ?? sourceShoppingRecipe?.id,
                          locale,
                        });
                      availableChanged.current = false;
                    }}
                    onChange={(event) => {
                      availableChanged.current = true;
                      const nextAvailable = event.target.value;
                      setAvailable(nextAvailable);
                      replaceConfiguration(
                        updateSourceRecipeConfigurationParams(searchParams, {
                          mode: 'ingredient',
                          ingredientId: anchor.ingredient.id,
                          availableAmount: nextAvailable,
                          unit: anchor.amount.unit,
                        }),
                      );
                    }}
                  />
                  <span>
                    {formatUnit(
                      locale,
                      anchor.amount.unit,
                      Number(available) || anchor.amount.minimum,
                    )}
                  </span>
                </div>
                {invalidAmount && (
                  <p
                    className={styles.result}
                    id={availableErrorId}
                    role="alert"
                  >
                    {draftConfiguration.kind === 'invalid' &&
                    draftConfiguration.reason === 'unsupported'
                      ? scaling.supportedAmount
                      : scaling.positiveAmount}
                  </p>
                )}
              </div>
            )}
            {concise ? (
              adjusted && (
                <div className={styles.result} aria-live="polite">
                  <EvidenceBadge locale={locale} status="calculated" />
                  <p>
                    {formattedScaleFactor}×.{' '}
                    {messages.status.calculated.explanation}
                  </p>
                  {fractionalEggs && <p>{readerCopy.fractionalEggs}</p>}
                </div>
              )
            ) : adjusted ? (
              <p className={styles.result}>
                <strong>{scaling.calculated}</strong>{' '}
                {scaling.calculatedResult(formattedScaleFactor)}
              </p>
            ) : null}
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
                configurationKey={sourceRecipeConfigurationKey(
                  draftConfiguration,
                )}
                context={`${sourceShoppingRecipe?.title ?? personalRecipe?.title[locale] ?? ''} · ${formattedScaleFactor}×`}
                disabled={invalidAmount}
                disabledReason={scaling.positiveAmount}
                locale={locale}
                recipe={personalRecipe ?? sourceShoppingRecipe!}
                scaleFactor={scaleFactor ?? 1}
              />
            ) : (
              <Button
                disabled
                title={messages.personal.testedBaseOnly}
                type="button"
              >
                <ShoppingBag aria-hidden="true" size={17} />{' '}
                {messages.personal.addAll}
              </Button>
            )
          }
          eyebrow={
            concise || !showWorkingRecord
              ? undefined
              : messages.recipe.workingRecord
          }
          title={messages.recipe.ingredients}
        />
        {recipe ? (
          <>
            <RecipeIngredientChecklist
              locale={locale}
              hideSingleSectionTitle={concise}
              sections={recipe.ingredientSections}
              amountFor={(ingredient) => ({
                primary: invalidAmount
                  ? '—'
                  : ingredient.quantity.base ||
                      ingredient.quantity.equivalent ||
                      !ingredient.note
                    ? formatQuantity(
                        locale,
                        scaleStructuredQuantity(
                          ingredient.quantity.base ??
                            ingredient.quantity.equivalent ??
                            null,
                          ingredient.scaling === 'fixed'
                            ? 1
                            : (scaleFactor ?? 1),
                        ),
                      )
                    : undefined,
                secondary:
                  !invalidAmount &&
                  ingredient.quantity.equivalent &&
                  ingredient.quantity.base
                    ? formatQuantity(
                        locale,
                        scaleStructuredQuantity(
                          ingredient.quantity.equivalent,
                          ingredient.scaling === 'fixed'
                            ? 1
                            : (scaleFactor ?? 1),
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
