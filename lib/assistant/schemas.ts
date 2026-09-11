import { isAppLocale } from '../i18n/config.ts';
import { isActionProposalShape } from './action-contract.ts';
import type {
  AssistantConfiguration,
  AssistantRequestV1,
  AssistantResponseV1,
  AssistantScope,
} from './contracts.ts';

const idPattern = '^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$';
const idRegex = new RegExp(idPattern);
const units = ['g', 'ml', 'piece', 'tsp', 'tbsp', 'packet', 'pinch'] as const;
const batchFactors = [0.5, 1, 1.5, 2] as const;
const errorCodes = [
  'INVALID_REQUEST',
  'PAYLOAD_TOO_LARGE',
  'UNSUPPORTED_MEDIA_TYPE',
  'METHOD_NOT_ALLOWED',
  'ORIGIN_NOT_ALLOWED',
  'RECIPE_UNAVAILABLE',
  'LOCALE_UNAVAILABLE',
  'RECIPE_VERSION_MISMATCH',
  'CONFIGURATION_UNAVAILABLE',
  'ASSISTANT_DISABLED',
  'RATE_LIMITED',
  'BUDGET_EXHAUSTED',
  'SERVICE_UNAVAILABLE',
  'UPSTREAM_TIMEOUT',
  'INVALID_UPSTREAM_RESPONSE',
  'INTERNAL_ERROR',
] as const;

const idSchema = {
  type: 'string',
  minLength: 1,
  maxLength: 128,
  pattern: idPattern,
} as const;

export const assistantRequestJsonSchema = {
  $id: 'https://bakeagain.app/schemas/assistant-request-v1.json',
  type: 'object',
  additionalProperties: false,
  required: [
    'schemaVersion',
    'recipeId',
    'recipeVersionId',
    'locale',
    'surface',
    'scope',
    'configuration',
    'question',
    'history',
  ],
  properties: {
    schemaVersion: { const: 1 },
    recipeId: idSchema,
    recipeVersionId: idSchema,
    locale: { enum: ['en', 'es', 'uk'] },
    surface: { enum: ['recipe-detail', 'cook-mode'] },
    scope: {
      anyOf: [
        {
          type: 'object',
          additionalProperties: false,
          required: ['kind'],
          properties: { kind: { const: 'recipe' } },
        },
        {
          type: 'object',
          additionalProperties: false,
          required: ['kind'],
          properties: { kind: { const: 'flour' } },
        },
        {
          type: 'object',
          additionalProperties: false,
          required: ['kind', 'stepIds'],
          properties: {
            kind: { const: 'step' },
            stepIds: {
              type: 'array',
              minItems: 1,
              maxItems: 2,
              uniqueItems: true,
              items: idSchema,
            },
          },
        },
      ],
    },
    configuration: {
      anyOf: [
        {
          type: 'object',
          additionalProperties: false,
          required: ['kind'],
          properties: { kind: { const: 'base' } },
        },
        {
          type: 'object',
          additionalProperties: false,
          required: ['kind', 'geometryId', 'quantityAdjustment'],
          properties: {
            kind: { const: 'adjusted' },
            geometryId: idSchema,
            quantityAdjustment: {
              anyOf: [
                {
                  type: 'object',
                  additionalProperties: false,
                  required: ['mode', 'factor'],
                  properties: {
                    mode: { const: 'batchScale' },
                    factor: { enum: batchFactors },
                  },
                },
                {
                  type: 'object',
                  additionalProperties: false,
                  required: [
                    'mode',
                    'anchorIngredientLineId',
                    'availableAmount',
                  ],
                  properties: {
                    mode: { const: 'useWhatIHave' },
                    anchorIngredientLineId: idSchema,
                    availableAmount: {
                      type: 'object',
                      additionalProperties: false,
                      required: ['value', 'unit'],
                      properties: {
                        value: {
                          type: 'number',
                          exclusiveMinimum: 0,
                          maximum: 1_000_000,
                        },
                        unit: { enum: units },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
    question: { type: 'string', minLength: 1, maxLength: 2000 },
    history: {
      type: 'array',
      maxItems: 4,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['role', 'text'],
        properties: {
          role: { enum: ['user', 'assistant'] },
          text: { type: 'string', minLength: 1, maxLength: 1500 },
        },
      },
    },
  },
} as const;

const evidenceRefSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'recipeId', 'recipeVersionId', 'field'],
  properties: {
    id: { type: 'string', minLength: 1, maxLength: 32 },
    recipeId: idSchema,
    recipeVersionId: idSchema,
    field: { type: 'string', minLength: 1, maxLength: 256 },
  },
} as const;

const referencesSchema = {
  type: 'array',
  maxItems: 4,
  items: evidenceRefSchema,
} as const;

const assistantBlockSchema = {
  anyOf: [
    {
      type: 'object',
      additionalProperties: false,
      required: ['kind', 'text', 'status', 'qualification', 'references'],
      properties: {
        kind: { const: 'evidence' },
        text: { type: 'string', minLength: 1 },
        status: { enum: ['Tested', 'Calculated', 'Suggested', null] },
        qualification: { type: ['string', 'null'] },
        references: referencesSchema,
      },
    },
    ...(['explanation', 'limitation'] as const).map((kind) => ({
      type: 'object' as const,
      additionalProperties: false,
      required: ['kind', 'text', 'status', 'references'],
      properties: {
        kind: { const: kind },
        text: { type: 'string' as const, minLength: 1, maxLength: 800 },
        status: { const: null },
        references: referencesSchema,
      },
    })),
    {
      type: 'object',
      additionalProperties: false,
      required: ['kind', 'text', 'status', 'qualification', 'references'],
      properties: {
        kind: { const: 'suggestion' },
        text: { type: 'string', minLength: 1, maxLength: 800 },
        status: { const: 'Suggested' },
        qualification: { type: 'string', minLength: 1 },
        references: referencesSchema,
      },
    },
  ],
} as const;

export const assistantActionJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'schemaVersion',
    'id',
    'kind',
    'context',
    'ingredientLineIds',
    'status',
    'configurationStatus',
    'cookModeEligible',
  ],
  properties: {
    schemaVersion: { const: 1 },
    id: { type: 'string', pattern: '^[A-Za-z0-9][A-Za-z0-9._:-]{0,159}$' },
    kind: { enum: ['open-scaling', 'add-shopping-items'] },
    context: {
      type: 'object',
      additionalProperties: false,
      required: [
        'schemaVersion',
        'recipeId',
        'recipeVersionId',
        'locale',
        'surface',
        'scope',
        'configuration',
      ],
      properties: {
        schemaVersion: { const: 1 },
        recipeId: idSchema,
        recipeVersionId: idSchema,
        locale: assistantRequestJsonSchema.properties.locale,
        surface: assistantRequestJsonSchema.properties.surface,
        scope: assistantRequestJsonSchema.properties.scope,
        configuration: assistantRequestJsonSchema.properties.configuration,
      },
    },
    ingredientLineIds: {
      type: 'array',
      maxItems: 80,
      uniqueItems: true,
      items: idSchema,
    },
    status: { const: 'Suggested' },
    configurationStatus: { enum: [null, 'Tested', 'Calculated', 'Suggested'] },
    cookModeEligible: { type: 'boolean' },
  },
} as const;

export const assistantResponseJsonSchema = {
  $id: 'https://bakeagain.app/schemas/assistant-response-v1.json',
  type: 'object',
  oneOf: [
    {
      type: 'object',
      additionalProperties: false,
      required: [
        'schemaVersion',
        'ok',
        'requestId',
        'recipeId',
        'recipeVersionId',
        'locale',
        'configuration',
        'outcome',
        'blocks',
        'proposedAction',
      ],
      properties: {
        schemaVersion: { const: 1 },
        ok: { const: true },
        requestId: { type: 'string', minLength: 1 },
        recipeId: idSchema,
        recipeVersionId: idSchema,
        locale: { enum: ['en', 'es', 'uk'] },
        configuration: assistantRequestJsonSchema.properties.configuration,
        outcome: {
          enum: ['answered', 'insufficient-context', 'out-of-scope', 'refused'],
        },
        blocks: {
          type: 'array',
          minItems: 1,
          maxItems: 6,
          items: assistantBlockSchema,
        },
        proposedAction: {
          anyOf: [{ type: 'null' }, assistantActionJsonSchema],
        },
      },
    },
    {
      type: 'object',
      additionalProperties: false,
      required: ['schemaVersion', 'ok', 'requestId', 'error'],
      properties: {
        schemaVersion: { const: 1 },
        ok: { const: false },
        requestId: { type: 'string', minLength: 1 },
        error: {
          type: 'object',
          additionalProperties: false,
          required: ['code', 'message', 'retryable', 'retryAfterSeconds'],
          properties: {
            code: { enum: errorCodes },
            message: { type: 'string', minLength: 1 },
            retryable: { type: 'boolean' },
            retryAfterSeconds: { type: ['integer', 'null'], minimum: 0 },
          },
        },
      },
    },
  ],
} as const;

export type AssistantRequestParseResult =
  | { success: true; data: AssistantRequestV1 }
  | { success: false; issue: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]) {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return (
    actual.length === expected.length &&
    actual.every((key, index) => key === expected[index])
  );
}

function isId(value: unknown): value is string {
  return (
    typeof value === 'string' && value !== '__proto__' && idRegex.test(value)
  );
}

function parseScope(value: unknown): AssistantScope | null {
  if (!isRecord(value) || typeof value.kind !== 'string') return null;
  if (value.kind === 'recipe' || value.kind === 'flour') {
    return hasExactKeys(value, ['kind']) ? { kind: value.kind } : null;
  }
  if (
    value.kind !== 'step' ||
    !hasExactKeys(value, ['kind', 'stepIds']) ||
    !Array.isArray(value.stepIds) ||
    value.stepIds.length < 1 ||
    value.stepIds.length > 2 ||
    !value.stepIds.every(isId) ||
    new Set(value.stepIds).size !== value.stepIds.length
  ) {
    return null;
  }
  return { kind: 'step', stepIds: value.stepIds as [string, ...string[]] };
}

function parseConfiguration(value: unknown): AssistantConfiguration | null {
  if (!isRecord(value) || typeof value.kind !== 'string') return null;
  if (value.kind === 'base')
    return hasExactKeys(value, ['kind']) ? { kind: 'base' } : null;
  if (
    value.kind !== 'adjusted' ||
    !hasExactKeys(value, ['kind', 'geometryId', 'quantityAdjustment']) ||
    !isId(value.geometryId) ||
    !isRecord(value.quantityAdjustment)
  ) {
    return null;
  }

  const selection = value.quantityAdjustment;
  if (
    selection.mode === 'batchScale' &&
    hasExactKeys(selection, ['mode', 'factor']) &&
    typeof selection.factor === 'number' &&
    batchFactors.includes(selection.factor as (typeof batchFactors)[number])
  ) {
    return {
      kind: 'adjusted',
      geometryId: value.geometryId,
      quantityAdjustment: {
        mode: 'batchScale',
        factor: selection.factor as (typeof batchFactors)[number],
      },
    };
  }

  if (
    selection.mode === 'useWhatIHave' &&
    hasExactKeys(selection, [
      'mode',
      'anchorIngredientLineId',
      'availableAmount',
    ]) &&
    isId(selection.anchorIngredientLineId) &&
    isRecord(selection.availableAmount) &&
    hasExactKeys(selection.availableAmount, ['value', 'unit']) &&
    typeof selection.availableAmount.value === 'number' &&
    Number.isFinite(selection.availableAmount.value) &&
    selection.availableAmount.value > 0 &&
    selection.availableAmount.value <= 1_000_000 &&
    typeof selection.availableAmount.unit === 'string' &&
    units.includes(selection.availableAmount.unit as (typeof units)[number])
  ) {
    return {
      kind: 'adjusted',
      geometryId: value.geometryId,
      quantityAdjustment: {
        mode: 'useWhatIHave',
        anchorIngredientLineId: selection.anchorIngredientLineId,
        availableAmount: {
          value: selection.availableAmount.value,
          unit: selection.availableAmount.unit as (typeof units)[number],
        },
      },
    };
  }
  return null;
}

export function parseAssistantRequest(
  value: unknown,
): AssistantRequestParseResult {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, [
      'schemaVersion',
      'recipeId',
      'recipeVersionId',
      'locale',
      'surface',
      'scope',
      'configuration',
      'question',
      'history',
    ])
  ) {
    return {
      success: false,
      issue: 'Expected the exact AssistantRequestV1 fields.',
    };
  }
  const scope = parseScope(value.scope);
  const configuration = parseConfiguration(value.configuration);
  const question =
    typeof value.question === 'string' ? value.question.trim() : '';
  if (
    value.schemaVersion !== 1 ||
    !isId(value.recipeId) ||
    !isId(value.recipeVersionId) ||
    typeof value.locale !== 'string' ||
    !isAppLocale(value.locale) ||
    (value.surface !== 'recipe-detail' && value.surface !== 'cook-mode') ||
    !scope ||
    !configuration ||
    question.length < 1 ||
    question.length > 2000 ||
    !Array.isArray(value.history) ||
    value.history.length > 4
  ) {
    return { success: false, issue: 'One or more request fields are invalid.' };
  }

  const history: AssistantRequestV1['history'] = [];
  for (const item of value.history) {
    if (
      !isRecord(item) ||
      !hasExactKeys(item, ['role', 'text']) ||
      (item.role !== 'user' && item.role !== 'assistant') ||
      typeof item.text !== 'string'
    ) {
      return { success: false, issue: 'History contains an invalid message.' };
    }
    const text = item.text.trim();
    if (text.length < 1 || text.length > 1500) {
      return { success: false, issue: 'History message length is invalid.' };
    }
    history.push({ role: item.role, text });
  }

  return {
    success: true,
    data: {
      schemaVersion: 1,
      recipeId: value.recipeId,
      recipeVersionId: value.recipeVersionId,
      locale: value.locale,
      surface: value.surface,
      scope,
      configuration,
      question,
      history,
    },
  };
}

export function isAssistantResponseV1(
  value: unknown,
): value is AssistantResponseV1 {
  if (
    !isRecord(value) ||
    value.schemaVersion !== 1 ||
    typeof value.requestId !== 'string'
  )
    return false;
  if (value.ok === false) {
    return (
      hasExactKeys(value, ['schemaVersion', 'ok', 'requestId', 'error']) &&
      isRecord(value.error) &&
      hasExactKeys(value.error, [
        'code',
        'message',
        'retryable',
        'retryAfterSeconds',
      ]) &&
      typeof value.error.code === 'string' &&
      (errorCodes as readonly string[]).includes(value.error.code) &&
      typeof value.error.message === 'string' &&
      typeof value.error.retryable === 'boolean' &&
      (value.error.retryAfterSeconds === null ||
        (typeof value.error.retryAfterSeconds === 'number' &&
          Number.isInteger(value.error.retryAfterSeconds) &&
          value.error.retryAfterSeconds >= 0))
    );
  }
  return (
    value.ok === true &&
    hasExactKeys(value, [
      'schemaVersion',
      'ok',
      'requestId',
      'recipeId',
      'recipeVersionId',
      'locale',
      'configuration',
      'outcome',
      'blocks',
      'proposedAction',
    ]) &&
    isId(value.recipeId) &&
    isId(value.recipeVersionId) &&
    typeof value.locale === 'string' &&
    isAppLocale(value.locale) &&
    parseConfiguration(value.configuration) !== null &&
    ['answered', 'insufficient-context', 'out-of-scope', 'refused'].includes(
      String(value.outcome),
    ) &&
    Array.isArray(value.blocks) &&
    value.blocks.length >= 1 &&
    value.blocks.length <= 6 &&
    value.blocks.every((block) =>
      isResponseBlock(block, value.recipeId, value.recipeVersionId),
    ) &&
    (value.outcome === 'answered' ||
      value.blocks.every((block) => block.kind === 'limitation')) &&
    (value.proposedAction === null ||
      (value.outcome === 'answered' &&
        isActionProposalShape(value.proposedAction) &&
        value.proposedAction.context.recipeId === value.recipeId &&
        value.proposedAction.context.recipeVersionId ===
          value.recipeVersionId &&
        value.proposedAction.context.locale === value.locale &&
        parseAssistantRequest({
          ...value.proposedAction.context,
          question: 'Action validation',
          history: [],
        }).success))
  );
}

function isResponseBlock(
  value: unknown,
  recipeId: unknown,
  recipeVersionId: unknown,
): boolean {
  if (
    !isRecord(value) ||
    typeof value.text !== 'string' ||
    !value.text.trim() ||
    !Array.isArray(value.references) ||
    value.references.length > 4
  )
    return false;
  if (
    !value.references.every(
      (ref) =>
        isRecord(ref) &&
        hasExactKeys(ref, ['id', 'recipeId', 'recipeVersionId', 'field']) &&
        typeof ref.id === 'string' &&
        /^e[1-9][0-9]{0,8}$/.test(ref.id) &&
        ref.recipeId === recipeId &&
        ref.recipeVersionId === recipeVersionId &&
        typeof ref.field === 'string' &&
        ref.field.length > 0,
    )
  )
    return false;
  const keys = ['kind', 'text', 'status', 'references'];
  if (value.kind === 'evidence') {
    return (
      hasExactKeys(value, [...keys, 'qualification']) &&
      value.references.length === 1 &&
      (value.status === null ||
        (typeof value.status === 'string' &&
          ['Tested', 'Calculated', 'Suggested'].includes(value.status))) &&
      (value.qualification === null ||
        typeof value.qualification === 'string') &&
      ((value.status !== 'Calculated' && value.status !== 'Suggested') ||
        (typeof value.qualification === 'string' &&
          value.qualification.trim().length > 0))
    );
  }
  if (value.text.length > 800) return false;
  if (value.kind === 'suggestion')
    return (
      hasExactKeys(value, [...keys, 'qualification']) &&
      value.status === 'Suggested' &&
      typeof value.qualification === 'string' &&
      value.qualification.trim().length > 0
    );
  return (
    hasExactKeys(value, keys) &&
    value.status === null &&
    (value.kind === 'limitation' ||
      (value.kind === 'explanation' && value.references.length > 0))
  );
}
