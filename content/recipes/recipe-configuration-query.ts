const configurationKeys = [
  'geometry',
  'mode',
  'scale',
  'ingredient',
  'amount',
  'unit',
] as const;
const scales = [0.5, 1, 1.5, 2];

/** Validate before defaulting: an explicit unsupported request is never the base. */
export function recipeConfigurationQueryIssue(
  search: string | URLSearchParams,
  baseGeometryId?: string,
): 'geometry' | 'unsupported' | null {
  const params = new URLSearchParams(search);
  if (configurationKeys.some((key) => params.getAll(key).length > 1))
    return 'unsupported';
  if (params.has('geometry') && params.get('geometry') !== baseGeometryId)
    return 'geometry';
  const mode = params.get('mode');
  if (mode === null) {
    return configurationKeys.slice(2).some((key) => params.has(key))
      ? 'unsupported'
      : null;
  }
  if (mode === 'scale') {
    return !scales.includes(Number(params.get('scale'))) ||
      ['ingredient', 'amount', 'unit'].some((key) => params.has(key))
      ? 'unsupported'
      : null;
  }
  if (mode === 'ingredient') return params.has('scale') ? 'unsupported' : null;
  return 'unsupported';
}

/** An explicit recovery action; retain unrelated options such as a selected cream. */
export function baseRecipeConfigurationSearch(search: string) {
  const params = new URLSearchParams(search);
  for (const key of configurationKeys) params.delete(key);
  return params.toString();
}
