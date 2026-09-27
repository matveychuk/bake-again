import type { QuantityAdjustmentSelection } from '../../content/recipes/recipe.types.ts';
import type { AppLocale } from '../i18n/config.ts';
import type { ActionProposal } from './action-contract.ts';

export type AssistantScope =
  | { kind: 'recipe' }
  | { kind: 'flour' }
  | { kind: 'step'; stepIds: [string, ...string[]] };

export type AssistantConfiguration =
  | { kind: 'base' }
  | {
      kind: 'adjusted';
      geometryId: string;
      quantityAdjustment: QuantityAdjustmentSelection;
    };

export interface AssistantRequestV1 {
  schemaVersion: 1;
  recipeId: string;
  recipeVersionId: string;
  locale: AppLocale;
  surface: 'recipe-detail' | 'cook-mode';
  scope: AssistantScope;
  configuration: AssistantConfiguration;
  question: string;
  history: Array<{ role: 'user' | 'assistant'; text: string }>;
}

export type PublicEvidenceStatus = 'Tested' | 'Calculated' | 'Suggested';

export interface EvidenceRef {
  id: string;
  recipeId: string;
  recipeVersionId: string;
  field: string;
}

export type AssistantBlock =
  | {
      kind: 'evidence';
      text: string;
      status: PublicEvidenceStatus | null;
      qualification: string | null;
      references: EvidenceRef[];
    }
  | {
      kind: 'explanation';
      text: string;
      status: null;
      references: EvidenceRef[];
    }
  | {
      kind: 'suggestion';
      text: string;
      status: 'Suggested';
      qualification: string;
      references: EvidenceRef[];
    }
  | {
      kind: 'limitation';
      text: string;
      status: null;
      references: EvidenceRef[];
    };

export type AssistantErrorCode =
  | 'INVALID_REQUEST'
  | 'PAYLOAD_TOO_LARGE'
  | 'UNSUPPORTED_MEDIA_TYPE'
  | 'METHOD_NOT_ALLOWED'
  | 'ORIGIN_NOT_ALLOWED'
  | 'RECIPE_UNAVAILABLE'
  | 'LOCALE_UNAVAILABLE'
  | 'RECIPE_VERSION_MISMATCH'
  | 'CONFIGURATION_UNAVAILABLE'
  | 'ASSISTANT_DISABLED'
  | 'VERIFICATION_REQUIRED'
  | 'RATE_LIMITED'
  | 'BUDGET_EXHAUSTED'
  | 'SERVICE_UNAVAILABLE'
  | 'UPSTREAM_TIMEOUT'
  | 'INVALID_UPSTREAM_RESPONSE'
  | 'INTERNAL_ERROR';

export type AssistantResponseV1 =
  | {
      schemaVersion: 1;
      ok: true;
      requestId: string;
      recipeId: string;
      recipeVersionId: string;
      locale: AppLocale;
      configuration: AssistantConfiguration;
      outcome: 'answered' | 'insufficient-context' | 'out-of-scope' | 'refused';
      blocks: AssistantBlock[];
      proposedAction: ActionProposal | null;
    }
  | {
      schemaVersion: 1;
      ok: false;
      requestId: string;
      error: {
        code: AssistantErrorCode;
        message: string;
        retryable: boolean;
        retryAfterSeconds: number | null;
      };
    };
