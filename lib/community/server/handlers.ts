import {
  communityBindings,
  communityConfig,
  communityConfigProblem,
  communityJson,
  createCommunityHandlers,
} from './runtime.ts';
import { resolveRecipeReviewScope } from './recipe-scope.ts';

/** Route adapter; returns null (→ 503) while reviews are not configured. */
export async function communityHandlers() {
  const config = communityConfig(await communityBindings());
  if (!config) return null;
  const problem = communityConfigProblem(config);
  if (problem) {
    console.warn('community_config_invalid', { setting: problem });
    return { problem };
  }
  return createCommunityHandlers({
    config,
    resolveScope: resolveRecipeReviewScope,
  });
}
export const communityUnavailable = (
  handlers: Awaited<ReturnType<typeof communityHandlers>>,
) =>
  communityJson(
    {
      ok: false,
      error: 'UNAVAILABLE',
      ...(handlers && 'problem' in handlers
        ? { setting: handlers.problem }
        : {}),
    },
    503,
  );
