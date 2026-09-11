import {
  resolveActionReview,
  ActionValidationError,
} from '../../../../../lib/assistant/actions.ts';
import {
  exactKeys,
  isRecord,
  type ActionProposal,
} from '../../../../../lib/assistant/action-contract.ts';
import { getRecipeDocument } from '../../../../../content/recipes/registry.ts';
import {
  isRecipeLocalePublishable,
  isUiLocalePublishable,
} from '../../../../../lib/i18n/publication.ts';
import {
  getAssistantRuntimeBindings,
  parseAssistantRuntimeEnv,
} from '../../../../../lib/assistant/server/env.ts';

export const dynamic = 'force-dynamic';
const respond = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'cache-control': 'no-store' } });

async function productionAccess(proposal: ActionProposal) {
  const config = parseAssistantRuntimeEnv(await getAssistantRuntimeBindings());
  if (!config.enabled) return false;
  const document = getRecipeDocument(proposal.context.recipeId);
  return (
    document?.kind === 'detailed' &&
    isUiLocalePublishable(proposal.context.locale) &&
    isRecipeLocalePublishable(document.recipe, proposal.context.locale)
  );
}

/** Validation only. This endpoint never calls OpenAI or mutates shopping/recipes. */
export function createActionReviewHandler(
  allowed: (proposal: ActionProposal) => Promise<boolean> = productionAccess,
) {
  return async (request: Request) => {
    if (request.method !== 'POST')
      return respond({ ok: false, code: 'METHOD_NOT_ALLOWED' }, 405);
    if (request.headers.get('origin') !== new URL(request.url).origin)
      return respond({ ok: false, code: 'ORIGIN_NOT_ALLOWED' }, 403);
    if (
      request.headers
        .get('content-type')
        ?.split(';')[0]
        ?.trim()
        .toLowerCase() !== 'application/json'
    )
      return respond({ ok: false, code: 'INVALID_ACTION' }, 415);
    const reader = request.body?.getReader();
    if (!reader) return respond({ ok: false, code: 'INVALID_ACTION' }, 400);
    let text = '';
    let bytes = 0;
    const decoder = new TextDecoder('utf-8', { fatal: true });
    try {
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        bytes += part.value.byteLength;
        if (bytes > 16 * 1024) {
          await reader.cancel();
          return respond({ ok: false, code: 'INVALID_ACTION' }, 413);
        }
        text += decoder.decode(part.value, { stream: true });
      }
      text += decoder.decode();
      const body: unknown = JSON.parse(text);
      if (
        !isRecord(body) ||
        !exactKeys(body, ['proposal', 'choices', 'phase']) ||
        (body.phase !== 'review' && body.phase !== 'confirm')
      )
        return respond({ ok: false, code: 'INVALID_ACTION' }, 400);
      const review = resolveActionReview(
        body.proposal,
        body.choices,
        body.phase === 'confirm',
      );
      if (!(await allowed(review.proposal)))
        return respond({ ok: false, code: 'ACTION_UNAVAILABLE' }, 403);
      return respond({ ok: true, review });
    } catch (error) {
      if (error instanceof SyntaxError)
        return respond({ ok: false, code: 'INVALID_ACTION' }, 400);
      if (error instanceof ActionValidationError)
        return respond(
          { ok: false, code: error.code },
          error.code === 'INVALID_ACTION' ? 400 : 409,
        );
      return respond({ ok: false, code: 'ACTION_UNAVAILABLE' }, 503);
    } finally {
      reader.releaseLock();
    }
  };
}

export const POST = createActionReviewHandler();
