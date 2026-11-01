import assert from 'node:assert/strict';
import { recipeLocales, type Recipe, type Quantity } from './recipe.types.ts';

/** The same validation applies to published recipes, drafts, creams and glazes. */
export function validateRecipe(
  recipe: Recipe,
  registeredIds?: ReadonlySet<string>,
): void {
  const check = (condition: unknown, message: string): void =>
    assert(condition, `${recipe.id}: ${message}`);
  check(recipe.schemaVersion === 3, 'unsupported schema');
  check(recipe.id && recipe.versionId, 'missing identity');
  const unique = (values: string[], role: string) =>
    check(new Set(values).size === values.length, `duplicate ${role} ID`);
  const lines = recipe.ingredientSections.flatMap((section) => section.lines);
  const lineIds = new Set(lines.map((line) => line.id));
  const stepIds = new Set(recipe.steps.map((step) => step.id));
  const mediaIds = new Set(recipe.media.map((item) => item.id));
  const equipmentIds = new Set(recipe.equipment.map((item) => item.id));
  const sourceIds = new Set(recipe.sources.map((item) => item.id));
  unique(
    lines.map((line) => line.id),
    'ingredient',
  );
  unique(
    recipe.ingredientSections.map((section) => section.id),
    'section',
  );
  unique(
    recipe.steps.map((step) => step.id),
    'step',
  );
  unique(
    recipe.media.map((item) => item.id),
    'media',
  );
  unique(
    recipe.timing.phases.map((item) => item.id),
    'phase',
  );
  unique(
    recipe.equipment.map((item) => item.id),
    'equipment',
  );
  const quantity = (q: Quantity | null) => {
    if (!q) return;
    const values = q.kind === 'exact' ? [q.value] : [q.min, q.max];
    check(
      values.every((value) => Number.isFinite(value) && value >= 0),
      'invalid quantity',
    );
    if (q.kind === 'range') check(q.min <= q.max, 'reversed quantity range');
  };
  for (const value of [
    recipe.timing.activeMinutes,
    recipe.timing.totalElapsedMinutes,
  ])
    check(
      value === null || (Number.isFinite(value) && value >= 0),
      'invalid overview time',
    );
  for (const item of [recipe.yield.default, ...recipe.yield.alternatives]) {
    const count = item.count;
    check(
      count.kind === 'unknown' ? item.unit === null : item.unit !== null,
      'yield unit/state mismatch',
    );
    if (count.kind !== 'unknown') {
      const values =
        count.kind === 'exact' ? [count.value] : [count.min, count.max];
      check(
        values.every((value) => Number.isFinite(value) && value > 0),
        'invalid yield',
      );
      if (count.kind === 'range')
        check(count.min <= count.max, 'reversed yield range');
    }
  }
  for (const geometry of [
    recipe.geometry.default,
    ...recipe.geometry.alternatives,
  ])
    if (geometry) {
      for (const value of [
        geometry.diameterCm,
        geometry.widthCm,
        geometry.lengthCm,
        geometry.layerCount,
      ])
        check(
          value == null || (Number.isFinite(value) && value > 0),
          'invalid geometry dimension',
        );
    }
  for (const line of lines) {
    check(line.options.length > 0, `${line.id}: no ingredient option`);
    quantity(line.quantity.base);
    quantity(line.quantity.equivalent ?? null);
    check(
      (line.quantity.shopping.mode === 'base') ===
        (line.quantity.base !== null),
      `${line.id}: invalid shopping basis`,
    );
  }
  for (const step of recipe.steps) {
    if (step.durationPhaseId)
      check(
        recipe.timing.phases.some((phase) => phase.id === step.durationPhaseId),
        `${step.id}: unknown duration phase`,
      );
    for (const stage of step.temperatureStages ?? [])
      check(
        recipe.timing.phases.some((phase) => phase.id === stage.phaseId),
        `${step.id}: unknown temperature phase`,
      );
    for (const id of step.ingredientLineIds)
      check(lineIds.has(id), `${step.id}: unknown ingredient ${id}`);
    for (const usage of step.cook?.ingredients ?? [])
      check(
        lineIds.has(usage.ingredientId),
        `${step.id}: unknown Cook ingredient`,
      );
    for (const [id, fraction] of Object.entries(step.ingredientFractions ?? {}))
      check(
        lineIds.has(id) && fraction > 0 && fraction <= 1,
        `${step.id}: invalid fraction`,
      );
    for (const id of step.mediaIds ?? [])
      check(mediaIds.has(id), `${step.id}: missing media ${id}`);
    for (const id of step.equipmentIds ?? [])
      check(equipmentIds.has(id), `${step.id}: missing equipment ${id}`);
  }
  for (const phase of recipe.timing.phases) {
    check(
      !phase.relatedStepId || stepIds.has(phase.relatedStepId),
      `${phase.id}: unknown step`,
    );
    const d = phase.duration;
    check(
      d.kind === 'exact'
        ? Number.isFinite(d.value) && d.value > 0
        : Number.isFinite(d.min) && d.min > 0,
      `${phase.id}: invalid duration`,
    );
    if (d.kind === 'range')
      check(
        Number.isFinite(d.max) && d.max >= d.min,
        `${phase.id}: reversed duration`,
      );
  }
  check(
    recipe.geometry.state === 'known'
      ? recipe.geometry.default !== null
      : recipe.geometry.default === null,
    'geometry state mismatch',
  );
  const geometryIds = new Set(
    [recipe.geometry.default, ...recipe.geometry.alternatives].flatMap(
      (item) => (item ? [item.id] : []),
    ),
  );
  if (recipe.geometry.default)
    check(
      recipe.configuration.base.geometryId === recipe.geometry.default.id,
      'base geometry mismatch',
    );
  for (const id of recipe.configuration.geometryAdjustment?.optionIds ?? [])
    check(geometryIds.has(id), 'unknown adjustable geometry');
  check(
    recipe.configuration.base.yieldId === recipe.yield.default.id,
    'base yield mismatch',
  );
  check(
    !('status' in recipe.configuration.base),
    'configuration must not duplicate evidence',
  );
  for (const anchor of recipe.configuration.quantityAdjustment.useWhatIHave
    ?.scalingAnchors ?? []) {
    const line = lines.find((line) => line.id === anchor.ingredientLineId);
    check(
      line?.quantity.base?.kind === 'exact' &&
        line.quantity.base.unit === anchor.allowedUnit,
      'invalid scaling anchor',
    );
  }
  const flour = recipe.flourConfiguration;
  if (flour)
    for (const id of [
      ...(flour.commercialMixLineId ? [flour.commercialMixLineId] : []),
      ...(flour.flourLineIds ?? []),
      ...flour.additionalStarchLineIds,
      ...(flour.xanthanLineId ? [flour.xanthanLineId] : []),
    ])
      check(lineIds.has(id), 'unknown flour ingredient');
  if (recipe.heroMediaId)
    check(mediaIds.has(recipe.heroMediaId), 'unknown hero');
  if (recipe.cardMediaId)
    check(mediaIds.has(recipe.cardMediaId), 'unknown card image');
  for (const id of recipe.baseProvenance.sourceIds)
    check(sourceIds.has(id), 'unknown evidence source');
  if (recipe.creamOptions) {
    check(
      recipe.creamOptions.recipeIds.includes(
        recipe.creamOptions.recommendedRecipeId,
      ),
      'recommended cream is unavailable',
    );
    for (const id of recipe.creamOptions.recipeIds)
      if (registeredIds) check(registeredIds.has(id), 'unknown cream');
  }
  // Localized text is keyed by stable IDs in Recipe, never parallel numeric records.
  function visit(value: unknown, path: string): void {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${path}.${index}`));
      return;
    }
    const object = value as Record<string, unknown>;
    if (Array.isArray(object.sourceIds))
      for (const id of object.sourceIds)
        check(
          typeof id === 'string' && sourceIds.has(id),
          `unknown source reference at ${path}`,
        );
    if (recipeLocales.some((locale) => typeof object[locale] === 'string')) {
      const intentionallyUnknown =
        path === 'yield.default.label' &&
        recipe.yield.default.count.kind === 'unknown';
      for (const locale of recipeLocales)
        check(
          typeof object[locale] === 'string' &&
            (intentionallyUnknown ||
              (object[locale] as string).trim().length > 0),
          `missing ${locale} text at ${path}`,
        );
    }
    for (const [key, child] of Object.entries(object))
      visit(child, path ? `${path}.${key}` : key);
  }
  visit(recipe, '');
}
