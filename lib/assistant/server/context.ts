import { calculateRecipeConfiguration } from '../../../content/recipes/calculate-configuration.ts';
import { getRecipeDocument } from '../../../content/recipes/registry.ts';
import type {
  CalculatedRecipeConfiguration,
  ContentGap,
  IngredientLine,
  IngredientSection,
  RecipeDraft,
  RecipeLocale,
} from '../../../content/recipes/recipe.types.ts';
import { isAppLocale } from '../../i18n/config.ts';
import { formatQuantity } from '../../i18n/format.ts';
import {
  isRecipeLocalePublishable,
  isUiLocalePublishable,
} from '../../i18n/publication.ts';
import type {
  AssistantRequestV1,
  EvidenceRef,
  PublicEvidenceStatus,
} from '../contracts.ts';
import type {
  ContextFact,
  ContextInput,
  ContextIngredient,
  ContextResult,
  ContextStep,
  ContextUnavailableCode,
  TrustedRecipeContext,
} from './context.types.ts';
import { resolveContextEvidence, type ContextEvidence } from './provenance.ts';
import { createActionCatalog } from '../actions.ts';

export const ASSISTANT_CONTEXT_POLICY_VERSION = 'context-v1';
const inputId = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
const contextByteLimit = 48 * 1024;
const inputTokenLimit = 8000;

const localized = {
  en: {
    invalid: 'The requested recipe context is invalid.',
    draft: 'A source draft cannot be used as assistant context.',
    missing: 'This detail is not yet confirmed.',
    author: 'Author guidance; not tested in this exact version.',
    calculated: 'Calculated mathematically; this version was not bake-tested.',
  },
  es: {
    invalid: 'El contexto de receta solicitado no es válido.',
    draft: 'Un borrador de origen no puede usarse como contexto del asistente.',
    missing: 'Este detalle aún no está confirmado.',
    author: 'Orientación de la autora; no probada en esta versión exacta.',
    calculated:
      'Calculado matemáticamente; esta versión no se ha probado al hornear.',
  },
  uk: {
    invalid: 'Запитаний контекст рецепта некоректний.',
    draft:
      'Цю чернетку джерела не можна використовувати як контекст помічника.',
    missing: 'Цю деталь ще не підтверджено.',
    author: 'Порада авторки; саме цю версію не випробувано.',
    calculated: 'Розраховано математично; цю версію не випробувано випіканням.',
  },
} as const;

function unavailable(
  code: ContextUnavailableCode,
  locale: RecipeLocale = 'en',
): ContextResult {
  return {
    available: false,
    code,
    message:
      code === 'SOURCE_DRAFT_UNAVAILABLE'
        ? localized[locale].draft
        : localized[locale].invalid,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function exactKeys(value: Record<string, unknown>, allowed: readonly string[]) {
  const actual = Object.keys(value).sort();
  const expected = [...allowed].sort();
  return (
    actual.length === expected.length &&
    actual.every((key, index) => key === expected[index])
  );
}

function isStableId(value: unknown): value is string {
  return (
    typeof value === 'string' && value !== '__proto__' && inputId.test(value)
  );
}

function parseConfiguration(
  value: unknown,
): ContextInput['configuration'] | null {
  if (!isRecord(value) || typeof value.kind !== 'string') return null;
  if (value.kind === 'base')
    return exactKeys(value, ['kind']) ? { kind: 'base' } : null;
  if (
    value.kind !== 'adjusted' ||
    !exactKeys(value, ['kind', 'geometryId', 'quantityAdjustment']) ||
    !isStableId(value.geometryId) ||
    !isRecord(value.quantityAdjustment)
  ) {
    return null;
  }
  const selection = value.quantityAdjustment;
  if (
    selection.mode === 'batchScale' &&
    exactKeys(selection, ['mode', 'factor']) &&
    typeof selection.factor === 'number' &&
    [0.5, 1, 1.5, 2].includes(selection.factor)
  ) {
    return {
      kind: 'adjusted',
      geometryId: value.geometryId,
      quantityAdjustment: {
        mode: 'batchScale',
        factor: selection.factor as 0.5 | 1 | 1.5 | 2,
      },
    };
  }
  const amount = selection.availableAmount;
  if (
    selection.mode === 'useWhatIHave' &&
    exactKeys(selection, [
      'mode',
      'anchorIngredientLineId',
      'availableAmount',
    ]) &&
    isStableId(selection.anchorIngredientLineId) &&
    isRecord(amount) &&
    exactKeys(amount, ['value', 'unit']) &&
    typeof amount.value === 'number' &&
    Number.isFinite(amount.value) &&
    amount.value > 0 &&
    amount.value <= 1_000_000 &&
    typeof amount.unit === 'string' &&
    ['g', 'ml', 'piece', 'tsp', 'tbsp', 'packet', 'pinch'].includes(amount.unit)
  ) {
    return {
      kind: 'adjusted',
      geometryId: value.geometryId,
      quantityAdjustment: {
        mode: 'useWhatIHave',
        anchorIngredientLineId: selection.anchorIngredientLineId,
        availableAmount: {
          value: amount.value,
          unit: amount.unit as
            | 'g'
            | 'ml'
            | 'piece'
            | 'tsp'
            | 'tbsp'
            | 'packet'
            | 'pinch',
        },
      },
    };
  }
  return null;
}

function parseInput(value: unknown): ContextInput | ContextUnavailableCode {
  if (!isRecord(value)) return 'INVALID_REQUEST';
  const allowed = [
    'recipeId',
    'locale',
    'scope',
    'stepId',
    'stepIds',
    'configuration',
  ];
  if (Object.keys(value).some((key) => !allowed.includes(key)))
    return 'INVALID_REQUEST';
  if (!isStableId(value.recipeId)) return 'INVALID_RECIPE_ID';
  if (typeof value.locale !== 'string' || !isAppLocale(value.locale))
    return 'INVALID_LOCALE';
  if (
    value.scope !== 'recipe' &&
    value.scope !== 'flour' &&
    value.scope !== 'step'
  ) {
    return 'INVALID_SCOPE';
  }
  if (value.scope !== 'step' && ('stepId' in value || 'stepIds' in value))
    return 'INVALID_STEP_ID';
  let stepId: string | undefined;
  let stepIds: string[] | undefined;
  if (value.scope === 'step') {
    const hasOne = 'stepId' in value;
    const hasMany = 'stepIds' in value;
    if (hasOne === hasMany) return 'INVALID_STEP_ID';
    if (hasOne) {
      if (!isStableId(value.stepId)) return 'INVALID_STEP_ID';
      stepId = value.stepId;
    } else {
      if (
        !Array.isArray(value.stepIds) ||
        value.stepIds.length < 1 ||
        value.stepIds.length > 2 ||
        !value.stepIds.every(isStableId) ||
        new Set(value.stepIds).size !== value.stepIds.length
      ) {
        return 'INVALID_STEP_ID';
      }
      stepIds = [...value.stepIds];
    }
  }
  let configuration: ContextInput['configuration'];
  if ('configuration' in value) {
    configuration = parseConfiguration(value.configuration) ?? undefined;
    if (!configuration) return 'INVALID_CONFIGURATION';
  }
  return {
    recipeId: value.recipeId,
    locale: value.locale,
    scope: value.scope,
    ...(stepId ? { stepId } : {}),
    ...(stepIds ? { stepIds } : {}),
    ...(configuration ? { configuration } : {}),
  };
}

function gapsForLine(gaps: ContentGap[], sectionId: string, lineId: string) {
  return gaps
    .filter(
      ({ field }) =>
        field === `ingredientSections.${sectionId}` ||
        field.startsWith(`ingredientSections.${sectionId}.${lineId}`),
    )
    .map(({ id }) => id);
}

function safeGaps(recipe: RecipeDraft, locale: RecipeLocale) {
  return recipe.contentGaps
    .filter(({ area }) => area !== 'image' && area !== 'translation')
    .map(({ id, field, area, publicationBlocking }) => ({
      id,
      field,
      area,
      publicationBlocking,
      message: localized[locale].missing,
    }));
}

function fact<T>(
  field: string,
  value: T,
  evidence: ContextEvidence,
): ContextFact<T> {
  return {
    field,
    value: structuredClone(value),
    evidence: structuredClone(evidence),
  };
}

function lineEvidence(
  recipe: RecipeDraft,
  section: IngredientSection,
  line: IngredientLine,
  sourceIds: Set<string>,
  gaps: ContentGap[],
  calculated: boolean,
) {
  return resolveContextEvidence({
    provenance: line.provenance ?? section.provenance,
    fallback:
      line.provenance || section.provenance ? undefined : recipe.baseProvenance,
    sourceIds,
    gapIds: gapsForLine(gaps, section.id, line.id),
    calculated,
    missing: line.quantity.base === null,
  });
}

function projectIngredient(
  recipe: RecipeDraft,
  section: IngredientSection,
  line: IngredientLine,
  locale: RecipeLocale,
  sourceIds: Set<string>,
  gaps: ContentGap[],
  calculated: CalculatedRecipeConfiguration | null,
): ContextIngredient {
  const calculatedLine = calculated?.ingredientAmounts.find(
    ({ ingredientLineId }) => ingredientLineId === line.id,
  );
  const amount = calculatedLine ? calculatedLine.amount : line.quantity.base;
  const evidence = lineEvidence(
    recipe,
    section,
    line,
    sourceIds,
    gaps,
    Boolean(calculated),
  );
  return {
    id: line.id,
    sectionId: section.id,
    sectionTitle: section.title[locale],
    options: line.options.map(({ ingredientId, name }) => ({
      ingredientId,
      name: name[locale],
    })),
    choose: line.choose ?? null,
    optional: line.optional ?? false,
    amount: fact(`ingredient.${line.id}.amount`, amount, evidence),
    amountBasis: calculated ? 'calculated' : 'base',
    preparation: line.preparation?.[locale] ?? null,
    qualifier: line.qualifier?.[locale] ?? null,
    condition: line.condition?.[locale] ?? null,
    requiresResolution: calculatedLine?.requiresResolution ?? false,
  };
}

function geometryFact(
  recipe: RecipeDraft,
  geometry: RecipeDraft['geometry']['default'],
  locale: RecipeLocale,
  sourceIds: Set<string>,
) {
  const gapIds = recipe.contentGaps
    .filter(({ field }) => field === `geometry.alternatives.${geometry.id}`)
    .map(({ id }) => id);
  return fact(
    `geometry.${geometry.id}`,
    {
      id: geometry.id,
      label: geometry.label[locale],
      kind: geometry.kind,
      application: geometry.application,
      shape: geometry.shape,
      diameterCm: geometry.diameterCm,
      widthCm: geometry.widthCm ?? null,
      lengthCm: geometry.lengthCm ?? null,
      layerCount: geometry.layerCount,
      material: geometry.material,
      availability: geometry.availability,
    },
    resolveContextEvidence({
      provenance: geometry.provenance,
      sourceIds,
      gapIds,
      availability: geometry.availability,
    }),
  );
}

function yieldFact(
  item: RecipeDraft['yield']['default'],
  locale: RecipeLocale,
  sourceIds: Set<string>,
) {
  return fact(
    `yield.${item.id}`,
    {
      id: item.id,
      label: item.label[locale],
      amount: item.amount,
      unit: item.unit,
      details: item.details?.[locale] ?? null,
      availability: item.availability,
    },
    resolveContextEvidence({
      provenance: item.provenance,
      sourceIds,
      availability: item.availability,
    }),
  );
}

function projectStep(
  recipe: RecipeDraft,
  step: RecipeDraft['steps'][number],
  locale: RecipeLocale,
  sourceIds: Set<string>,
  gaps: ContentGap[],
  calculated: boolean,
): ContextStep {
  const dependencies = recipe.ingredientSections.flatMap((section) =>
    section.lines
      .filter(({ id }) => step.ingredientLineIds.includes(id))
      .flatMap((line) => gapsForLine(gaps, section.id, line.id)),
  );
  const calculatedConstraint = calculated
    ? [
        {
          state: 'needsRetest' as const,
          sourceIds: recipe.baseProvenance.sourceIds,
        },
      ]
    : [];
  const instructionEvidence = resolveContextEvidence({
    fallback: recipe.baseProvenance,
    sourceIds,
    gapIds: dependencies,
    constraints: calculatedConstraint,
  });
  return {
    id: step.id,
    instruction: fact(
      `step.${step.id}.instruction`,
      step.instruction[locale],
      instructionEvidence,
    ),
    ingredientLineIds: [...step.ingredientLineIds],
    duration: step.duration ? structuredClone(step.duration) : null,
    temperature: step.temperature ? structuredClone(step.temperature) : null,
    equipment: (step.equipmentIds ?? []).map((id) => ({
      id,
      name: recipe.equipment.find((item) => item.id === id)?.name[locale] ?? id,
    })),
    guidance: (step.guidance ?? []).map((item) =>
      fact(
        `step.${step.id}.guidance.${item.id}`,
        { id: item.id, kind: item.kind, text: item.text[locale] },
        resolveContextEvidence({
          provenance: item.provenance,
          fallback: item.provenance ? undefined : recipe.baseProvenance,
          sourceIds,
          gapIds: dependencies,
          constraints: calculatedConstraint,
        }),
      ),
    ),
  };
}

export function buildTrustedRecipeContext(value: unknown): ContextResult {
  const parsed = parseInput(value);
  if (typeof parsed === 'string') return unavailable(parsed);
  const document = getRecipeDocument(parsed.recipeId);
  if (!document) return unavailable('RECIPE_NOT_FOUND', parsed.locale);
  if (document.kind === 'sourceDraft')
    return unavailable('SOURCE_DRAFT_UNAVAILABLE', parsed.locale);
  const recipe = document.recipe;
  if (recipe.publicationStatus === 'archived')
    return unavailable('RECIPE_ARCHIVED', parsed.locale);

  const requestedStepIds =
    parsed.scope === 'step'
      ? (parsed.stepIds ?? (parsed.stepId ? [parsed.stepId] : []))
      : [];
  if (
    requestedStepIds.some((id) => !recipe.steps.some((step) => step.id === id))
  ) {
    return unavailable('STEP_NOT_FOUND', parsed.locale);
  }
  const configuration = parsed.configuration ?? { kind: 'base' as const };
  let calculated: CalculatedRecipeConfiguration | null = null;
  if (configuration.kind === 'adjusted') {
    try {
      calculated = calculateRecipeConfiguration(
        recipe,
        configuration.geometryId,
        configuration.quantityAdjustment,
      );
    } catch {
      return unavailable('INVALID_CONFIGURATION', parsed.locale);
    }
  }

  const sourceIds = new Set(recipe.sources.map(({ id }) => id));
  const allGaps = recipe.contentGaps.filter(
    ({ area }) => area !== 'image' && area !== 'translation',
  );
  const selectedSteps = recipe.steps.filter(({ id }) =>
    requestedStepIds.includes(id),
  );
  const stepIngredientIds = new Set(
    selectedSteps.flatMap(({ ingredientLineIds }) => ingredientLineIds),
  );
  const flourIds = new Set([
    recipe.flourConfiguration.commercialMixLineId,
    ...recipe.flourConfiguration.additionalStarchLineIds,
    ...(recipe.flourConfiguration.xanthanLineId
      ? [recipe.flourConfiguration.xanthanLineId]
      : []),
  ]);
  const includedIngredientIds =
    parsed.scope === 'recipe'
      ? null
      : parsed.scope === 'flour'
        ? flourIds
        : stepIngredientIds;
  const ingredients = recipe.ingredientSections.flatMap((section) =>
    section.lines
      .filter(
        ({ id }) =>
          includedIngredientIds === null || includedIngredientIds.has(id),
      )
      .map((line) =>
        projectIngredient(
          recipe,
          section,
          line,
          parsed.locale,
          sourceIds,
          allGaps,
          calculated,
        ),
      ),
  );
  const includeFlour =
    parsed.scope === 'recipe' ||
    parsed.scope === 'flour' ||
    [...stepIngredientIds].some((id) => flourIds.has(id));
  const filteredGaps =
    parsed.scope === 'recipe'
      ? safeGaps(recipe, parsed.locale)
      : parsed.scope === 'flour'
        ? []
        : safeGaps(recipe, parsed.locale).filter(({ field }) =>
            ingredients.some(
              ({ sectionId, id }) =>
                field === `ingredientSections.${sectionId}` ||
                field.startsWith(`ingredientSections.${sectionId}.${id}`),
            ),
          );

  const context: TrustedRecipeContext = {
    schemaVersion: 1,
    policyVersion: 'context-v1',
    recipeId: recipe.id,
    recipeVersionId: recipe.versionId,
    locale: parsed.locale,
    scope: parsed.scope,
    publication: {
      status: recipe.publicationStatus,
      translation: recipe.translationState[parsed.locale],
      recipeLocalePublishable: isRecipeLocalePublishable(recipe, parsed.locale),
      uiLocalePublishable: isUiLocalePublishable(parsed.locale),
    },
    recipe: {
      basis: 'canonical-base',
      title: recipe.title[parsed.locale],
      summary: recipe.summary[parsed.locale],
      evidence: resolveContextEvidence({
        fallback: recipe.baseProvenance,
        sourceIds,
      }),
    },
    configuration: {
      selection: structuredClone(configuration),
      status: calculated ? 'Calculated' : 'Tested',
      totalScaleFactor: calculated?.totalScaleFactor ?? 1,
      warnings:
        calculated?.warnings.map(({ code, severity, ingredientLineId }) => ({
          code,
          severity,
          ...(ingredientLineId ? { ingredientLineId } : {}),
        })) ?? [],
      cookModeEligible: calculated?.cookMode.eligible ?? true,
    },
    ingredients,
    flour: includeFlour
      ? {
          basis: 'canonical-base',
          commercialMixLineId: recipe.flourConfiguration.commercialMixLineId,
          additionalStarchLineIds: [
            ...recipe.flourConfiguration.additionalStarchLineIds,
          ],
          xanthanLineId: recipe.flourConfiguration.xanthanLineId ?? null,
          evidence: resolveContextEvidence({
            provenance: recipe.flourConfiguration.provenance,
            sourceIds,
          }),
          testedAlternatives:
            recipe.flourConfiguration.testedAlternativeMixes.map((item) =>
              fact(
                `flour.alternative.${item.commercialMixId}`,
                {
                  mixId: item.commercialMixId,
                  name: item.name[parsed.locale],
                  notes: item.notes?.[parsed.locale] ?? null,
                  availability: item.availability,
                },
                resolveContextEvidence({
                  provenance: item.provenance,
                  sourceIds,
                  availability: item.availability,
                }),
              ),
            ),
          knownUnsupportedMixes:
            recipe.flourConfiguration.knownUnsupportedMixes.map((item) =>
              fact(
                `flour.unsupported.${item.commercialMixId}`,
                {
                  mixId: item.commercialMixId,
                  name: item.name[parsed.locale],
                  notes: item.notes?.[parsed.locale] ?? null,
                  availability: item.availability,
                },
                resolveContextEvidence({
                  provenance: item.provenance,
                  sourceIds,
                  availability: item.availability,
                }),
              ),
            ),
        }
      : null,
    timing:
      parsed.scope === 'recipe'
        ? {
            basis: 'canonical-base',
            activeMinutes: fact(
              'timing.activeMinutes',
              recipe.timing.activeMinutes,
              resolveContextEvidence({
                fallback: recipe.baseProvenance,
                sourceIds,
                missing: recipe.timing.activeMinutes === null,
              }),
            ),
            totalElapsedMinutes: fact(
              'timing.totalElapsedMinutes',
              recipe.timing.totalElapsedMinutes,
              resolveContextEvidence({
                fallback: recipe.baseProvenance,
                sourceIds,
                missing: recipe.timing.totalElapsedMinutes === null,
                gapIds: allGaps
                  .filter(({ field }) => field === 'timing.totalElapsedMinutes')
                  .map(({ id }) => id),
              }),
            ),
            phases: recipe.timing.phases.map(({ id, label, duration }) => ({
              id,
              label: label[parsed.locale],
              duration: structuredClone(duration),
            })),
          }
        : null,
    yield: {
      basis: 'canonical-base',
      base: yieldFact(recipe.yield.default, parsed.locale, sourceIds),
      alternatives: recipe.yield.alternatives.map((item) =>
        yieldFact(item, parsed.locale, sourceIds),
      ),
    },
    geometry: {
      base: geometryFact(
        recipe,
        recipe.geometry.default,
        parsed.locale,
        sourceIds,
      ),
      alternatives: recipe.geometry.alternatives.map((item) =>
        geometryFact(recipe, item, parsed.locale, sourceIds),
      ),
      selectedId:
        configuration.kind === 'adjusted'
          ? configuration.geometryId
          : recipe.geometry.default.id,
    },
    steps:
      parsed.scope === 'step'
        ? selectedSteps.map((step) =>
            projectStep(
              recipe,
              step,
              parsed.locale,
              sourceIds,
              allGaps,
              Boolean(calculated),
            ),
          )
        : [],
    beforeStart:
      parsed.scope === 'recipe'
        ? recipe.beforeStart.map(({ id, text, relatedStepId }) => ({
            id,
            text: text[parsed.locale],
            relatedStepId: relatedStepId ?? null,
          }))
        : parsed.scope === 'step'
          ? recipe.beforeStart
              .filter(
                ({ relatedStepId }) =>
                  relatedStepId && requestedStepIds.includes(relatedStepId),
              )
              .map(({ id, text, relatedStepId }) => ({
                id,
                text: text[parsed.locale],
                relatedStepId: relatedStepId ?? null,
              }))
          : [],
    storage:
      parsed.scope === 'recipe'
        ? fact(
            'storage',
            recipe.storage?.[parsed.locale] ?? null,
            resolveContextEvidence({
              fallback: recipe.baseProvenance,
              sourceIds,
              missing: recipe.storage === null,
              gapIds: allGaps
                .filter(({ field }) => field === 'storage')
                .map(({ id }) => id),
            }),
          )
        : null,
    makeAhead:
      parsed.scope === 'recipe'
        ? fact(
            'makeAhead',
            recipe.makeAhead?.[parsed.locale] ?? null,
            resolveContextEvidence({
              fallback: recipe.baseProvenance,
              sourceIds,
              missing: recipe.makeAhead === null,
            }),
          )
        : null,
    variations:
      parsed.scope === 'recipe'
        ? recipe.variations.map((item) =>
            fact(
              `variation.${item.id}`,
              {
                id: item.id,
                dimension: item.dimension,
                label: item.label[parsed.locale],
                description: item.description[parsed.locale],
                availability: item.availability,
              },
              resolveContextEvidence({
                provenance: item.provenance,
                sourceIds,
                availability: item.availability,
                gapIds: item.blockingGapIds ?? [],
              }),
            ),
          )
        : [],
    gaps: filteredGaps,
    unknowns: [
      ...(parsed.scope === 'recipe' &&
      recipe.timing.totalElapsedMinutes === null
        ? [
            {
              field: 'timing.totalElapsedMinutes',
              reason: 'not-recorded' as const,
            },
          ]
        : []),
      ...(parsed.scope === 'recipe' && recipe.storage === null
        ? [{ field: 'storage', reason: 'not-recorded' as const }]
        : []),
      ...(includeFlour &&
      recipe.flourConfiguration.testedAlternativeMixes.length === 0
        ? [
            {
              field: 'flour.testedAlternatives',
              reason: 'no-tested-alternative-recorded' as const,
            },
          ]
        : []),
      ...ingredients
        .filter(({ requiresResolution }) => requiresResolution)
        .map(({ id }) => ({
          field: `ingredient.${id}.amount`,
          reason: 'calculation-needs-resolution' as const,
        })),
    ],
  };
  if (
    new TextEncoder().encode(JSON.stringify(context)).length > contextByteLimit
  ) {
    return unavailable('CONTEXT_TOO_LARGE', parsed.locale);
  }
  return { available: true, context: structuredClone(context) };
}

export interface ContextEvidenceBlock {
  id: string;
  text: string;
  status: PublicEvidenceStatus | null;
  qualification: string | null;
  reference: EvidenceRef;
}

export interface AssistantContextProjection {
  context: TrustedRecipeContext;
  evidence: Map<string, ContextEvidenceBlock>;
  estimatedInputTokens: number;
}

function evidenceQualification(
  evidence: ContextEvidence,
  locale: RecipeLocale,
) {
  if (evidence.status === 'Calculated') return localized[locale].calculated;
  if (evidence.sourceState === 'authorGuidance')
    return localized[locale].author;
  if (evidence.limitations.length || evidence.gapIds.length)
    return localized[locale].missing;
  return null;
}

export function buildAssistantContext(
  recipe: RecipeDraft,
  request: AssistantRequestV1,
  _calculated: CalculatedRecipeConfiguration | null,
  instructionText: string,
): AssistantContextProjection | null {
  const result = buildTrustedRecipeContext({
    recipeId: recipe.id,
    locale: request.locale,
    scope: request.scope.kind,
    ...(request.scope.kind === 'step'
      ? { stepIds: request.scope.stepIds }
      : {}),
    configuration: request.configuration,
  });
  if (!result.available) return null;
  const evidence = new Map<string, ContextEvidenceBlock>();
  let sequence = 0;
  const add = (field: string, text: string, source: ContextEvidence) => {
    const id = `e${++sequence}`;
    const item: ContextEvidenceBlock = {
      id,
      text,
      status: source.status,
      qualification: evidenceQualification(source, request.locale),
      reference: {
        id,
        recipeId: recipe.id,
        recipeVersionId: recipe.versionId,
        field,
      },
    };
    evidence.set(id, item);
  };
  add('summary', result.context.recipe.summary, result.context.recipe.evidence);
  for (const ingredient of result.context.ingredients) {
    add(
      ingredient.amount.field,
      `${ingredient.options.map(({ name }) => name).join(' / ')}: ${
        ingredient.amount.value
          ? formatQuantity(request.locale, ingredient.amount.value)
          : localized[request.locale].missing
      }`,
      ingredient.amount.evidence,
    );
  }
  add(
    result.context.yield.base.field,
    result.context.yield.base.value.label,
    result.context.yield.base.evidence,
  );
  const selectedGeometry = [
    result.context.geometry.base,
    ...result.context.geometry.alternatives,
  ].find(({ value }) => value.id === result.context.geometry.selectedId);
  if (selectedGeometry)
    add(
      selectedGeometry.field,
      selectedGeometry.value.label,
      selectedGeometry.evidence,
    );
  for (const step of result.context.steps) {
    add(
      step.instruction.field,
      step.instruction.value,
      step.instruction.evidence,
    );
    for (const guidance of step.guidance)
      add(guidance.field, guidance.value.text, guidance.evidence);
  }
  if (result.context.storage) {
    add(
      result.context.storage.field,
      result.context.storage.value ?? localized[request.locale].missing,
      result.context.storage.evidence,
    );
  }
  const estimatedInputTokens = Math.ceil(
    new TextEncoder().encode(
      JSON.stringify({
        instructions: instructionText,
        context: result.context,
        evidenceCatalog: [...evidence.values()],
        actionCatalog: [
          ...createActionCatalog(request, 'catalog').entries(),
        ].map(([id, action]) => ({ id, kind: action.kind })),
        locale: request.locale,
        question: request.question,
        history: request.history,
      }),
    ).length / 2,
  );
  if (estimatedInputTokens > inputTokenLimit) return null;
  return { context: result.context, evidence, estimatedInputTokens };
}
