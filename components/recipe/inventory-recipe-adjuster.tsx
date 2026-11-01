'use client';

import { Button } from '@/components/ui/button';

import { trackEvent } from '@/lib/analytics/umami';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Calculator, ChevronDown, Lightbulb, ShoppingBag } from 'lucide-react';
import { SectionTitle } from '@/components/foundations/section-title';
import { findScalingAnchor } from '@/content/recipes/inventory-calculation';
import { calculateProjectedIngredient } from '@/content/recipes/projected-quantity';
import { formatNumber, formatQuantity, formatUnit } from '@/lib/i18n/format';
import type { InventoryArchiveSection } from '@/content/recipes/inventory';
import type { Recipe } from '@/content/recipes/recipe.types';
import type { StructuredRecipeContent } from '@/content/recipes/localized-recipe.types';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { recipeReaderCopy } from '@/content/recipes/reader-copy';
import {
  parseRecipeContentConfiguration,
  recipeBatchScaleFactors,
  recipeContentConfigurationKey,
  recipeScalingBounds,
  updateRecipeContentConfigurationParams,
  type RecipeContentConfiguration,
} from '@/content/recipes/recipe-content-configuration';
import { EvidenceBadge } from './evidence-badge';
import {
  AddRecipeIngredientsControl,
  type ShoppingRecipeProjection,
} from './add-recipe-ingredients-control';
import { RecipeIngredientChecklist } from './recipe-ingredient-checklist';
import { RecipeIngredientHeading } from './recipe-ingredient-heading';
import styles from './inventory-recipe-adjuster.module.css';

const baseConfiguration: RecipeContentConfiguration = {
  kind: 'base',
  mode: 'scale',
  scaleFactor: 1,
};

let focusAfterConfigurationUpdate: {
  pathname: string;
  target: HTMLElement;
  hrefPath?: string;
  label: string;
  createdAt: number;
} | null = null;

function rememberFocusAfterConfigurationUpdate(
  target: HTMLElement,
  pathname: string,
) {
  focusAfterConfigurationUpdate = {
    pathname,
    target,
    hrefPath:
      target instanceof HTMLAnchorElement
        ? new URL(target.href).pathname
        : undefined,
    label: target.textContent?.trim() ?? '',
    createdAt: Date.now(),
  };
}

export function InventoryRecipeAdjuster({
  recipe,
  archiveSections,
  locale,
  personalRecipe,
  scalingAnchorIngredientId,
  showWorkingRecord = true,
  shoppingRecipe,
  configuration = baseConfiguration,
  syncConfigurationToUrl = true,
}: {
  recipe: StructuredRecipeContent | undefined;
  archiveSections: InventoryArchiveSection[];
  locale: AppLocale;
  personalRecipe?: Recipe | null;
  scalingAnchorIngredientId?: string;
  showWorkingRecord?: boolean;
  shoppingRecipe?: ShoppingRecipeProjection | null;
  configuration?: RecipeContentConfiguration;
  syncConfigurationToUrl?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const availableInputId = useId();
  const availableErrorId = `${availableInputId}-error`;
  const controlsId = `${availableInputId}-controls`;
  const [mobileControlsOpen, setMobileControlsOpen] = useState(
    configuration.kind === 'invalid',
  );
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
  const [appliedAvailable, setAppliedAvailable] = useState(available);
  const scalingBounds = recipeScalingBounds(
    personalRecipe,
    scalingAnchorIngredientId,
  );
  const draftConfiguration = useMemo(() => {
    const params =
      mode === 'scale'
        ? updateRecipeContentConfigurationParams(searchParams, {
            mode: 'scale',
            scaleFactor: scale,
          })
        : updateRecipeContentConfigurationParams(searchParams, {
            mode: 'ingredient',
            ingredientId: anchor?.ingredient.id ?? '',
            availableAmount: appliedAvailable,
            unit: anchor?.amount.unit ?? 'g',
          });
    return parseRecipeContentConfiguration(
      params,
      recipe,
      scalingAnchorIngredientId,
      scalingBounds,
    );
  }, [
    anchor,
    appliedAvailable,
    mode,
    recipe,
    scale,
    scalingAnchorIngredientId,
    scalingBounds,
    searchParams,
  ]);
  const enteredConfiguration = useMemo(
    () =>
      mode === 'ingredient'
        ? parseRecipeContentConfiguration(
            updateRecipeContentConfigurationParams(searchParams, {
              mode: 'ingredient',
              ingredientId: anchor?.ingredient.id ?? '',
              availableAmount: available,
              unit: anchor?.amount.unit ?? 'g',
            }),
            recipe,
            scalingAnchorIngredientId,
            scalingBounds,
          )
        : draftConfiguration,
    [
      anchor,
      available,
      draftConfiguration,
      mode,
      recipe,
      scalingAnchorIngredientId,
      scalingBounds,
      searchParams,
    ],
  );
  const pendingAmount = mode === 'ingredient' && available !== appliedAvailable;
  const invalidAmount = enteredConfiguration.kind === 'invalid';
  const unresolvedIngredients = ingredients.some(
    (ingredient) =>
      calculateProjectedIngredient(
        ingredient,
        draftConfiguration.kind === 'invalid'
          ? 1
          : draftConfiguration.scaleFactor,
      ).requiresResolution,
  );
  const calculationUnavailable =
    pendingAmount || invalidAmount || unresolvedIngredients;
  const scaleFactor =
    calculationUnavailable || draftConfiguration.kind === 'invalid'
      ? null
      : draftConfiguration.scaleFactor;
  const isAdjustable = Boolean(recipe && anchor);
  const messages = getUiMessages(locale);
  const concise = recipe?.presentation === 'concise';
  const readerCopy = recipeReaderCopy[locale];
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

  useEffect(() => {
    const pending = focusAfterConfigurationUpdate;
    if (!pending || pending.pathname !== pathname) return;
    focusAfterConfigurationUpdate = null;
    const frame = window.requestAnimationFrame(() => {
      if (Date.now() - pending.createdAt > 5000) return;
      if (document.activeElement !== document.body) return;
      const matchingLink = pending.hrefPath
        ? Array.from(
            document.querySelectorAll<HTMLAnchorElement>('a[href]'),
          ).find(
            (link) =>
              new URL(link.href).pathname === pending.hrefPath &&
              link.textContent?.trim() === pending.label,
          )
        : null;
      const matchingButton =
        pending.target instanceof HTMLButtonElement
          ? Array.from(
              document.querySelectorAll<HTMLButtonElement>('button'),
            ).find(
              (button) =>
                button.textContent?.trim() === pending.label &&
                button.getClientRects().length > 0,
            )
          : null;
      (pending.target.isConnected
        ? pending.target
        : (matchingLink ?? matchingButton)
      )?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [configuration, pathname]);

  function replaceConfiguration(params: URLSearchParams) {
    if (!syncConfigurationToUrl) return;
    const query = params.toString();
    if (query === searchParams.toString()) return;
    const hash = window.location.hash;
    router.replace(`${query ? `${pathname}?${query}` : pathname}${hash}`, {
      scroll: false,
    });
  }

  const replaceAvailableUrl = useCallback(
    (amount: string) => {
      if (!syncConfigurationToUrl || !anchor) return;
      const params = updateRecipeContentConfigurationParams(
        window.location.search,
        {
          mode: 'ingredient',
          ingredientId: anchor.ingredient.id,
          availableAmount: amount,
          unit: anchor.amount.unit,
        },
      );
      const query = params.toString();
      if (query === window.location.search.slice(1)) return;
      window.history.replaceState(
        window.history.state,
        '',
        `${pathname}?${query}${window.location.hash}`,
      );
    },
    [anchor, pathname, syncConfigurationToUrl],
  );

  useEffect(() => {
    if (!pendingAmount) return;
    const timeout = window.setTimeout(() => {
      setAppliedAvailable(available);
      replaceAvailableUrl(available);
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [available, pendingAmount, replaceAvailableUrl]);

  useEffect(() => {
    if (!syncConfigurationToUrl) return;
    function restoreConfiguration() {
      const restored = parseRecipeContentConfiguration(
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
        setAppliedAvailable(String(restored.availableAmount));
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

  function selectScale(factor: (typeof recipeBatchScaleFactors)[number]) {
    if (mode !== 'scale' || scale !== factor)
      trackEvent('recipe_scale', {
        recipe_id: personalRecipe?.id ?? shoppingRecipe?.id,
        locale,
        factor,
      });
    setMode('scale');
    setScale(factor);
    replaceConfiguration(
      updateRecipeContentConfigurationParams(searchParams, {
        mode: 'scale',
        scaleFactor: factor,
      }),
    );
  }

  function selectAvailableIngredient() {
    if (!anchor) return;
    const nextAvailable =
      mode === 'ingredient' ? available : String(anchor.amount.minimum);
    setMode('ingredient');
    setAvailable(nextAvailable);
    setAppliedAvailable(nextAvailable);
    replaceConfiguration(
      updateRecipeContentConfigurationParams(searchParams, {
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
      <div className={styles.ingredientHeading}>
        <RecipeIngredientHeading
          action={
            shoppingRecipe ? (
              <AddRecipeIngredientsControl
                configurationKey={recipeContentConfigurationKey(
                  draftConfiguration,
                )}
                context={`${shoppingRecipe?.title ?? personalRecipe?.title[locale] ?? ''} · ${formattedScaleFactor}×`}
                disabled={calculationUnavailable}
                disabledReason={
                  pendingAmount
                    ? scaling.updatingAmount
                    : unresolvedIngredients
                      ? messages.cook.unsupportedConfiguration
                      : scaling.positiveAmount
                }
                locale={locale}
                recipe={shoppingRecipe!}
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
      </div>
      <button
        type="button"
        className={styles.mobileAdjustToggle}
        aria-controls={controlsId}
        aria-expanded={mobileControlsOpen}
        onClick={() => setMobileControlsOpen((open) => !open)}
      >
        <span className={styles.mobileAdjustText}>
          <strong>{concise ? readerCopy.quantity : scaling.title}</strong>
          {invalidAmount ? (
            <small>{scaling.positiveAmount}</small>
          ) : adjusted ? (
            <small className={styles.mobileAdjustStatus}>
              <span>{formattedScaleFactor}× ·</span>
              {recipe?.evidence?.status === 'suggested' ? (
                <Lightbulb aria-hidden="true" size={14} />
              ) : (
                <Calculator aria-hidden="true" size={14} />
              )}
              <span>
                {recipe?.evidence?.status === 'suggested'
                  ? messages.status.suggested.label
                  : messages.status.calculated.label}
              </span>
            </small>
          ) : null}
        </span>
        <ChevronDown aria-hidden="true" size={20} />
      </button>
      <aside
        className={`${styles.controls} ${mobileControlsOpen ? styles.controlsOpen : ''}`}
        id={controlsId}
      >
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
                onClick={(event) => {
                  rememberFocusAfterConfigurationUpdate(
                    event.currentTarget,
                    pathname,
                  );
                  selectScale(scale);
                }}
              >
                {scaling.scaleRecipe}
              </button>
              <button
                type="button"
                aria-pressed={mode === 'ingredient'}
                onClick={(event) => {
                  rememberFocusAfterConfigurationUpdate(
                    event.currentTarget,
                    pathname,
                  );
                  selectAvailableIngredient();
                }}
              >
                {scaling.useWhatIHave}
              </button>
            </div>
            {mode === 'scale' ? (
              <div>
                <span className={styles.label}>{scaling.batchScale}</span>
                <div className={styles.scales}>
                  {recipeBatchScaleFactors.map((factor) => (
                    <button
                      type="button"
                      aria-pressed={scale === factor}
                      key={factor}
                      onClick={(event) => {
                        rememberFocusAfterConfigurationUpdate(
                          event.currentTarget,
                          pathname,
                        );
                        selectScale(factor);
                      }}
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
                    onBlur={(event) => {
                      if (pendingAmount) {
                        setAppliedAvailable(available);
                        replaceAvailableUrl(available);
                      }
                      if (syncConfigurationToUrl && availableChanged.current) {
                        const target = event.relatedTarget;
                        if (target instanceof HTMLElement) {
                          rememberFocusAfterConfigurationUpdate(
                            target,
                            pathname,
                          );
                        }
                        const switchingMode =
                          target instanceof HTMLButtonElement &&
                          target.parentElement?.classList.contains(
                            styles.modeTabs,
                          );
                        if (!switchingMode)
                          router.replace(
                            `${pathname}${window.location.search}${window.location.hash}`,
                            { scroll: false },
                          );
                      }
                      if (availableChanged.current && !invalidAmount)
                        trackEvent('recipe_ingredient_scale', {
                          recipe_id: personalRecipe?.id ?? shoppingRecipe?.id,
                          locale,
                        });
                      availableChanged.current = false;
                    }}
                    onChange={(event) => {
                      availableChanged.current = true;
                      const nextAvailable = event.target.value;
                      setAvailable(nextAvailable);
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
                    {enteredConfiguration.kind === 'invalid' &&
                    enteredConfiguration.reason === 'unsupported'
                      ? scaling.supportedAmount
                      : unresolvedIngredients
                        ? messages.cook.unsupportedConfiguration
                        : scaling.positiveAmount}
                  </p>
                )}
              </div>
            )}
            {concise ? (
              adjusted && (
                <div className={styles.result} aria-live="polite">
                  <EvidenceBadge
                    locale={locale}
                    status={
                      recipe?.evidence?.status === 'suggested'
                        ? 'suggested'
                        : 'calculated'
                    }
                  />
                  <p>
                    {formattedScaleFactor}×.{' '}
                    {recipe?.evidence?.status === 'suggested' &&
                      `${recipe.evidence.explanation} `}
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
      <div className={styles.content} aria-busy={pendingAmount}>
        {recipe ? (
          <>
            <RecipeIngredientChecklist
              locale={locale}
              hideSingleSectionTitle={concise}
              sections={recipe.ingredientSections}
              amountFor={(ingredient) => ({
                primary: calculationUnavailable
                  ? '—'
                  : ingredient.quantity.base ||
                      ingredient.quantity.equivalent ||
                      !ingredient.note
                    ? formatQuantity(
                        locale,
                        ingredient.quantity.base
                          ? calculateProjectedIngredient(
                              ingredient,
                              scaleFactor ?? 1,
                            ).base
                          : calculateProjectedIngredient(
                              ingredient,
                              scaleFactor ?? 1,
                            ).equivalent,
                      )
                    : undefined,
                secondary:
                  !calculationUnavailable &&
                  ingredient.quantity.equivalent &&
                  ingredient.quantity.base
                    ? formatQuantity(
                        locale,
                        calculateProjectedIngredient(
                          ingredient,
                          scaleFactor ?? 1,
                        ).equivalent,
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
            <h3>{getUiMessages(locale).recipe.methodPending}</h3>
            <p>{getUiMessages(locale).recipe.methodPendingDescription}</p>
          </div>
        )}
      </div>
    </section>
  );
}
