import {
  NAPOLEON_METHOD_STEP_COUNT,
  napoleonPrototypeMedia,
  napoleonPrototypeSteps,
  type PrototypeStep,
} from '@/content/recipes/napoleon.prototype';
import { glutenFreeNapoleonRecipe } from '@/content/recipes/gluten-free-napoleon.recipe';
import { formatQuantity } from '@/content/recipes/napoleon-configuration';
import type {
  CalculatedRecipeConfiguration,
  Duration,
  IngredientLine,
  RecipeDraft,
  RecipeStep,
} from '@/content/recipes/recipe.types';
import type {
  CookIngredient,
  CookMediaItem,
  CookStep,
} from '@/components/cook-mode/cook-mode.types';

export type { CookMediaItem, CookStep } from '@/components/cook-mode/cook-mode.types';

const recipe: RecipeDraft = glutenFreeNapoleonRecipe;
export const TOTAL_RECIPE_STEPS = NAPOLEON_METHOD_STEP_COUNT;

const ingredientLines: IngredientLine[] = recipe.ingredientSections
  .flatMap((section) => section.lines);

const stepGroups = [
  ['mix-dry-dough'],
  ['cut-in-butter'],
  ['mix-wet-dough'],
  ['combine-dough'],
  ['fold-dough'],
  ['divide-and-chill'],
  ['temper-disc'],
  ['roll-layer'],
  ['bake-layer'],
  ['heat-milk'],
  ['mix-custard-base'],
  ['temper-custard'],
  ['cook-custard'],
  ['finish-custard'],
  ['toast-walnuts', 'toast-almonds'],
  ['assemble-cake'],
  ['rest-assembled-cake', 'refrigerate-cake'],
] as const;

const titles: Record<string, string> = {
  'mix-dry-dough': 'Mix the dry ingredients',
  'cut-in-butter': 'Cut in the cold butter',
  'mix-wet-dough': 'Mix the wet ingredients',
  'combine-dough': 'Combine the dough',
  'fold-dough': 'Bring the dough together',
  'divide-and-chill': 'Divide and chill',
  'temper-disc': 'Soften one disc',
  'roll-layer': 'Roll directly on parchment',
  'bake-layer': 'Bake the layer',
  'heat-milk': 'Heat the milk',
  'mix-custard-base': 'Mix the custard base',
  'temper-custard': 'Temper the custard',
  'cook-custard': 'Cook until thick',
  'finish-custard': 'Finish the custard',
  'toast-walnuts+toast-almonds': 'Toast the nuts',
  'assemble-cake': 'Assemble the cakes',
  'rest-assembled-cake+refrigerate-cake': 'Rest and refrigerate',
};

const prototypeByStepId: Partial<Record<string, PrototypeStep>> = {
  'mix-dry-dough': napoleonPrototypeSteps[0],
  'cut-in-butter': napoleonPrototypeSteps[1],
  'mix-wet-dough': napoleonPrototypeSteps[2],
  'combine-dough': napoleonPrototypeSteps[3],
  'roll-layer': napoleonPrototypeSteps[4],
};

function getRecipeStep(id: string): RecipeStep {
  const step = recipe.steps.find((item) => item.id === id);
  if (!step) throw new Error(`Missing canonical recipe step: ${id}`);
  return step;
}

function formatDuration(duration: Duration) {
  const unit = {
    second: 'sec',
    minute: 'min',
    hour: 'hour',
  }[duration.unit];
  if (duration.kind === 'range') {
    const plural = duration.unit === 'hour' ? 's' : '';
    return `${duration.min}–${duration.max} ${unit}${plural}`;
  }
  if (duration.kind === 'minimum') {
    const plural = duration.min === 1 || duration.unit !== 'hour' ? '' : 's';
    return `At least ${duration.min} ${unit}${plural}`;
  }
  const plural = duration.value === 1 || duration.unit !== 'hour' ? '' : 's';
  return `${duration.value} ${unit}${plural}`;
}

function buildMeta(steps: RecipeStep[], prototype?: PrototypeStep) {
  if (prototype) return prototype.meta;
  const parts = steps.flatMap((step) => [
    ...(step.temperature ? [`${step.temperature.value}°C`] : []),
    ...(step.duration ? [formatDuration(step.duration)] : []),
    ...(step.equipmentIds?.slice(0, 1).map((id) =>
      recipe.equipment.find((item) => item.id === id)?.name.en,
    ).filter(Boolean) ?? []),
  ]);
  return [...new Set(parts)].join(' · ') || 'Method';
}

function ingredientLabel(
  id: string,
  configuration: CalculatedRecipeConfiguration,
): CookIngredient {
  const line = ingredientLines.find((item) => item.id === id);
  const calculated = configuration.ingredientAmounts.find(
    (item) => item.ingredientLineId === id,
  );
  if (!line || !calculated) throw new Error(`Missing Cook Mode ingredient: ${id}`);
  const name = line.id === 'cultured-dairy-dough'
    ? 'sour cream or thick yogurt'
    : line.options.map((option) => option.name.en).join(' or ');
  const qualifier = line.qualifier?.en ? `, ${line.qualifier.en}` : '';
  const amount = formatQuantity(calculated.amount).replace('0.25 tsp', '¼ tsp');
  return { id, name: `${name}${qualifier}`, primary: amount };
}

function mediaFor(prototype?: PrototypeStep): CookMediaItem[] | undefined {
  return prototype?.mediaIds?.map((id) => {
    const item = napoleonPrototypeMedia.find((media) => media.id === id);
    if (!item) throw new Error(`Missing prototype media: ${id}`);
    return {
      id: item.id,
      src: item.src,
      alt: item.cookAlt ?? item.alt,
      title: item.id === 'butter-final-crumb' ? 'Ready texture' : item.title,
      caption: item.cookCaption ?? item.caption,
    };
  });
}

export function createCookSteps(
  configuration: CalculatedRecipeConfiguration,
): CookStep[] {
  return stepGroups.map((ids, index) => {
    const steps = ids.map(getRecipeStep);
    const key = ids.join('+');
    const prototype = ids.length === 1 ? prototypeByStepId[ids[0]] : undefined;
    const lineIds = [...new Set(steps.flatMap((step) => step.ingredientLineIds))];
    const ingredients: CookIngredient[] = prototype?.ingredientLineIds
      ? [
          ...(ids[0] === 'combine-dough'
            ? [{ id: 'wet-mixture', name: 'Wet mixture' }]
            : []),
          ...prototype.ingredientLineIds.map((id) => ingredientLabel(id, configuration)),
        ]
      : lineIds.map((id) => ingredientLabel(id, configuration));
    const checkpoints = steps.flatMap((step) =>
      step.guidance?.filter((item) => item.kind === 'checkpoint').map((item) => item.text.en) ?? [],
    );
    const tips = steps.flatMap((step) =>
      step.guidance?.filter((item) => item.kind === 'practicalTip').map((item) => item.text.en) ?? [],
    );

    return {
      stepIds: [...ids] as [string, ...string[]],
      number: String(index + 1).padStart(2, '0'),
      meta: buildMeta(steps, prototype),
      title: titles[key],
      instructions: [
        prototype?.cookBody ?? steps.map((step) => step.instruction.en).join(' '),
      ],
      ingredients: prototype && !prototype.ingredientLineIds
        ? prototype.ingredients.map((name, ingredientIndex) => ({
            id: `prototype-${index}-${ingredientIndex}`,
            name,
          }))
        : ingredients,
      checkpoint: prototype?.guidance ?? (checkpoints.join(' ') || undefined),
      tip: prototype?.tips?.join(' · ') ?? (tips.join(' · ') || undefined),
      timerSeconds: prototype?.timerSeconds,
      media: mediaFor(prototype),
    };
  });
}
