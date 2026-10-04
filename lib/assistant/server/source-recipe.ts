import { getRecipeContent, getRecipeDocument, type RecipeDocument } from '../../../content/recipes/registry.ts';
import { composeRecipeWithCream } from '../../../content/recipes/cream-composition.ts';
import { recipeInventory } from '../../../content/recipes/inventory.ts';
import { recipeDetailTitles, catalogLocaleCopy } from '../../../content/recipes/catalog-locales.ts';
import { findScalingAnchor } from '../../../content/recipes/inventory-calculation.ts';
import { resolveStepHelp } from '../../../content/recipes/step-help.ts';
import type { LocalizedText, Provenance, RecipeDraft, RecipeLocale } from '../../../content/recipes/recipe.types.ts';
import type { StructuredRecipeContent } from '../../../content/recipes/source-recipe.types.ts';

const locales = ['en', 'es', 'uk'] as const;
const text = (read: (locale: RecipeLocale) => string): LocalizedText => ({ en: read('en'), es: read('es'), uk: read('uk') });

/** Server-only projection of recorded source facts. Does not promote publication or bake evidence. */
export function getAssistantRecipeDocument(recipeId: string, requestedVersion?: string): RecipeDocument | null {
  const document = getRecipeDocument(recipeId);
  if (!document || document.kind === 'detailed') return document;
  const source = document.recipe;
  const versionId = source.versionId ?? `${recipeId}-source-v1`;
  const creamId = source.creamOptions?.recipeIds.find(id => requestedVersion === `${versionId}-cream-${id}`) ?? null;
  const creamDocument = creamId ? getRecipeDocument(creamId) : null;
  if (creamId && (!creamDocument || creamDocument.recipe.publicationStatus !== 'published')) return null;
  const content = Object.fromEntries(locales.map(locale => {
    const host = getRecipeContent(recipeId, locale)!;
    return [locale, composeRecipeWithCream(host, creamId ? getRecipeContent(creamId, locale) : null, creamId, locale)];
  })) as Record<RecipeLocale, StructuredRecipeContent>;
  const base = content.en;
  const inventory = recipeInventory.find(recipe => recipe.id === recipeId);
  const localizedSection = (locale: RecipeLocale, id: string) => content[locale].ingredientSections.find(section => section.id === id);
  const localizedStep = (locale: RecipeLocale, id: string) => content[locale].steps.find(step => step.id === id);
  const sourceId = `${recipeId}-recorded-source`;
  const provenance: Provenance = { state: base.evidence?.status ?? 'missing', sourceIds: [sourceId] };
  const authorGuidance: Provenance = { state: 'authorGuidance', sourceIds: [sourceId] };
  const geometryId = base.geometry?.id ?? `${recipeId}-base`;
  const yieldId = base.yield?.id ?? `${recipeId}-yield`;
  const ingredients = base.ingredientSections.flatMap(section => section.ingredients);
  const anchor = findScalingAnchor(ingredients, inventory?.scalingAnchorIngredientId);
  const gaps: RecipeDraft['contentGaps'] = [];
  if (base.gapNote) gaps.push({ id: `${recipeId}-source-gap`, area: 'method', field: 'steps', question: base.gapNote, publicationBlocking: base.completeness === 'incompleteSource', sourceIds: [sourceId] });
  if (!base.yield) gaps.push({ id: `${recipeId}-yield-gap`, area: 'yield', field: 'yield.default', question: 'Yield is not recorded.', publicationBlocking: false, sourceIds: [sourceId] });
  if (!base.geometry) gaps.push({ id: `${recipeId}-geometry-gap`, area: 'form', field: 'geometry.default', question: 'Geometry is not recorded.', publicationBlocking: false, sourceIds: [sourceId] });
  const recipe: RecipeDraft = {
    schemaVersion: 2,
    id: recipeId,
    versionId: creamId ? `${versionId}-cream-${creamId}` : versionId,
    publicationStatus: source.publicationStatus,
    translationState: text(locale => source.translationState?.[locale] === 'reviewed' && (!creamDocument || creamDocument.recipe.translationState?.[locale] === 'reviewed') ? 'reviewed' : 'sourceDraft') as RecipeDraft['translationState'],
    slug: text(() => inventory?.slug ?? recipeId),
    title: recipeDetailTitles[recipeId] ?? text(() => inventory?.title ?? recipeId),
    summary: catalogLocaleCopy[recipeId]?.summary ?? text(() => ''),
    categoryIds: [], situationIds: [], difficulty: base.difficulty ?? null,
    baseProvenance: provenance,
    timing: {
      activeMinutes: base.timing?.activeMinutes ?? null,
      totalElapsedMinutes: base.timing?.totalElapsedMinutes ?? null,
      phases: (base.timing?.phases ?? []).map(phase => ({ ...phase, label: text(locale => content[locale].timing?.phases.find(item => item.id === phase.id)?.label ?? '' ) })),
    },
    yield: { default: {
      id: yieldId,
      label: text(locale => content[locale].yield?.label ?? ''),
      // Preserve the recorded label; ranges are not converted to an exact yield.
      amount: base.yield?.count.kind === 'exact' ? base.yield.count.value : null,
      unit: ['cookie', 'cake', 'serving', 'batch'].includes(base.yield?.unit ?? '') ? base.yield!.unit as 'cookie' | 'cake' | 'serving' | 'batch' : 'batch',
      provenance: base.yield ? provenance : { state: 'missing', sourceIds: [sourceId] }, availability: 'default',
    }, alternatives: [] },
    geometry: { default: {
      id: geometryId, label: text(locale => content[locale].geometry?.label ?? ''),
      kind: base.geometry?.kind ?? 'other', application: base.geometry?.application ?? 'other', shape: base.geometry?.shape ?? 'other',
      diameterCm: base.geometry?.diameterCm ?? null, widthCm: base.geometry?.widthCm ?? null, lengthCm: base.geometry?.lengthCm ?? null,
      layerCount: null, material: null, provenance: base.geometry ? provenance : { state: 'missing', sourceIds: [sourceId] }, availability: 'default',
    }, alternatives: [] },
    configuration: {
      base: { status: 'Tested', geometryId, yieldId, batchScale: 1 },
      geometryAdjustment: null,
      quantityAdjustment: {
        batchScale: { allowed: [0.5, 1, 1.5, 2] },
        useWhatIHave: anchor ? { scalingAnchors: [{ ingredientLineId: anchor.ingredient.id, allowedUnit: anchor.amount.unit }] } : null,
      },
      ingredientScaling: { default: { kind: 'linear' } },
    },
    equipment: [],
    flourConfiguration: {
      commercialMixLineId: ingredients.find(ingredient => ingredient.name.includes('Schär'))?.id ?? '',
      additionalStarchLineIds: [], provenance, testedAlternativeMixes: [], knownUnsupportedMixes: [],
    },
    beforeStart: (base.beforeStart ?? []).map((_, index) => ({ id: `before-${index}`, text: text(locale => content[locale].beforeStart?.[index] ?? '') })),
    ingredientSections: base.ingredientSections.map(section => ({
      id: section.id, title: text(locale => localizedSection(locale, section.id)?.title ?? ''), provenance,
      lines: section.ingredients.map(ingredient => ({
        id: ingredient.id,
        options: [{ ingredientId: `${recipeId}-${ingredient.id}`, name: text(locale => localizedSection(locale, section.id)?.ingredients.find(item => item.id === ingredient.id)?.name ?? '') }],
        quantity: ingredient.quantity, optional: ingredient.optional,
        qualifier: ingredient.note ? text(locale => localizedSection(locale, section.id)?.ingredients.find(item => item.id === ingredient.id)?.note ?? '') : undefined,
        provenance, scaling: ingredient.scaling === 'fixed' ? { kind: 'fixed' } : undefined,
      })),
    })),
    steps: base.steps.map(step => ({
      id: step.id, title: text(locale => localizedStep(locale, step.id)?.title ?? ''),
      instruction: text(locale => localizedStep(locale, step.id)?.body ?? ''),
      ingredientLineIds: step.cookIngredients?.map(usage => usage.ingredientId) ?? [],
      guidance: [
        ...(step.checkpoint ? [{ id: `${step.id}-checkpoint`, kind: 'checkpoint' as const, text: text(locale => localizedStep(locale, step.id)?.checkpoint ?? ''), provenance: authorGuidance }] : []),
        ...(step.tip ? [{ id: `${step.id}-tip`, kind: 'practicalTip' as const, text: text(locale => localizedStep(locale, step.id)?.tip ?? ''), provenance: authorGuidance }] : []),
        ...resolveStepHelp(step).map(help => ({ id: `prepared-help-${help.id}`, kind: 'practicalTip' as const, text: text(locale => {
          const localized = localizedStep(locale, step.id);
          const answer = localized ? resolveStepHelp(localized).find(item => item.id === help.id) : undefined;
          return answer ? `${answer.question} ${answer.answer}` : '';
        }), provenance: authorGuidance })),
      ],
    })),
    storage: null, makeAhead: null, variations: [], heroMediaId: null, media: [], relatedRecipeIds: [],
    sources: [{ id: sourceId, file: source.source?.file ?? `content/recipes/${recipeId}.recipe.ts`, locator: source.source?.locator ?? 'Recorded recipe content' }],
    contentGaps: gaps,
  };
  return { kind: 'detailed', recipe };
}
