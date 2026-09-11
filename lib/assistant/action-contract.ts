import type { AssistantRequestV1, PublicEvidenceStatus } from './contracts.ts';
import type { Quantity } from '../../content/recipes/recipe.types.ts';

export type ActionKind = 'open-scaling' | 'add-shopping-items';
export type ActionContext = Omit<AssistantRequestV1, 'question' | 'history'>;
export type ActionProposal = {
  schemaVersion: 1;
  id: string;
  kind: ActionKind;
  context: ActionContext;
  ingredientLineIds: string[];
  status: 'Suggested';
  configurationStatus: PublicEvidenceStatus | null;
  cookModeEligible: boolean;
};
export type ActionChoices = Record<string, string>;
export type ActionReview = {
  proposal: ActionProposal;
  recipeTitle: string;
  geometryLabel: string;
  lines: Array<{
    ingredientLineId: string;
    sectionId: string;
    options: Array<{ ingredientId: string; name: string }>;
    quantity: Quantity | null;
    status: PublicEvidenceStatus | null;
    sourceState: string;
    hasGaps: boolean;
    qualifier: string | null;
    selectedIngredientId: string | null;
  }>;
};

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
export const exactKeys = (value: Record<string, unknown>, keys: string[]) =>
  Object.keys(value).length === keys.length &&
  keys.every((key) => Object.hasOwn(value, key));
export const actionIdPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,159}$/;
export function isActionProposalShape(value: unknown): value is ActionProposal {
  if (
    !isRecord(value) ||
    !isRecord(value.context) ||
    !exactKeys(value.context, [
      'schemaVersion',
      'recipeId',
      'recipeVersionId',
      'locale',
      'surface',
      'scope',
      'configuration',
    ])
  )
    return false;
  return (
    isRecord(value) &&
    exactKeys(value, [
      'schemaVersion',
      'id',
      'kind',
      'context',
      'ingredientLineIds',
      'status',
      'configurationStatus',
      'cookModeEligible',
    ]) &&
    value.schemaVersion === 1 &&
    typeof value.id === 'string' &&
    actionIdPattern.test(value.id) &&
    (value.kind === 'open-scaling' || value.kind === 'add-shopping-items') &&
    isRecord(value.context) &&
    Array.isArray(value.ingredientLineIds) &&
    value.ingredientLineIds.length <= 80 &&
    value.ingredientLineIds.every(
      (id) => typeof id === 'string' && /^[a-z0-9][a-z0-9-]{0,127}$/.test(id),
    ) &&
    new Set(value.ingredientLineIds).size === value.ingredientLineIds.length &&
    value.status === 'Suggested' &&
    (value.configurationStatus === null ||
      value.configurationStatus === 'Tested' ||
      value.configurationStatus === 'Calculated' ||
      value.configurationStatus === 'Suggested') &&
    typeof value.cookModeEligible === 'boolean'
  );
}
