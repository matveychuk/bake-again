import type { AssistantRequestV1 } from '../contracts.ts';
import type { AssistantContextProjection } from './context.ts';
import { createActionCatalog } from '../actions.ts';

/** Facts already present in the evidence catalog are referenced once, not duplicated. */
export function assistantEnvelope(request: AssistantRequestV1, projection: AssistantContextProjection) {
  const fields = new Map([...projection.evidence.values()].map(item => [item.reference.field, item.id]));
  function compact(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(compact);
    if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>;
      if (typeof record.field === 'string' && fields.has(record.field) && 'value' in record && 'evidence' in record) {
        return { field: record.field, evidenceId: fields.get(record.field) };
      }
      return Object.fromEntries(Object.entries(record).map(([key, item]) => [key, compact(item)]));
    }
    return value;
  }
  return {
    locale: request.locale,
    trustedContext: compact(projection.context),
    evidenceCatalog: [...projection.evidence.values()],
    actionCatalog: [...createActionCatalog(request, 'catalog').entries()].map(([id, action]) => ({ id, kind: action.kind })),
    question: request.question,
    history: request.history,
  };
}
