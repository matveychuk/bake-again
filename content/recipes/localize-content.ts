import type { RecipeSourceDraftContent } from './source-recipe.types.ts';

/** Editorial copy keyed by stable section/ingredient/step IDs; numeric facts stay shared. */
export type RecipeText = Record<string, string>;
const textFields = new Set([
  'title',
  'body',
  'meta',
  'checkpoint',
  'tip',
  'cookTitle',
  'alt',
  'caption',
  'name',
  'note',
  'label',
  'explanation',
  'gapNote',
  'text',
  'beforeStart',
  'cookInstructions',
]);

export function localizeRecipeContent(
  source: RecipeSourceDraftContent,
  text: RecipeText,
): RecipeSourceDraftContent {
  function visit(value: unknown, path: string, field: string): unknown {
    if (Array.isArray(value)) {
      return value.map((item, index) =>
        visit(
          item,
          `${path}.${item && typeof item === 'object' && 'id' in item ? item.id : index}`,
          field,
        ),
      );
    }
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([key, child]) => [
          key,
          visit(child, path ? `${path}.${key}` : key, key),
        ]),
      );
    }
    if (typeof value === 'string' && textFields.has(field)) {
      if (!(path in text))
        throw new Error(`Missing recipe translation: ${path}`);
      return text[path];
    }
    return value;
  }
  return visit(source, '', '') as RecipeSourceDraftContent;
}
