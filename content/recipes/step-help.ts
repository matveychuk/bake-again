import type { AppLocale } from '../../lib/i18n/config.ts';
import type { StructuredRecipeStep } from './source-recipe.types.ts';
import { stepHelpCatalog, type HelpField } from './step-help.catalog.ts';

export type StepHelpDefinition = {
  id: string;
  question: string;
  answer: { field: HelpField } | { text: string };
};
export type PreparedStepAnswer = { id: string; question: string; answer: string };

/** Definitions travel with the step through cream composition and scaling. */
export function getStepHelpDefinitions(recipeId: string, stepId: string, locale: AppLocale): StepHelpDefinition[] {
  return (stepHelpCatalog[recipeId]?.[stepId]?.questions ?? []).map((item, index) => ({
    id: `${recipeId}:${stepId}:${index + 1}`,
    question: item.question[locale],
    answer: typeof item.answer === 'string' ? { field: item.answer } : { text: item.answer[locale] },
  }));
}

/** Resolve source-backed answers only AFTER applying the displayed configuration. */
export function resolveStepHelp(step: StructuredRecipeStep): PreparedStepAnswer[] {
  return (step.help ?? []).flatMap((item) => {
    const answer = 'field' in item.answer ? step[item.answer.field] : item.answer.text;
    return answer ? [{ id: `${step.id}:${item.id}`, question: item.question, answer }] : [];
  });
}
