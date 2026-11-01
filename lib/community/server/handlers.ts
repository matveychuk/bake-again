import {
  communityBindings,
  communityConfig,
  communityJson,
  createCommunityHandlers,
} from './runtime.ts';
import { resolveRecipeReviewScope } from './recipe-scope.ts';

/** Route adapter; returns null (→ 404/503) while reviews are not configured. */
export async function communityHandlers() {
  const config = communityConfig(await communityBindings());
  return config
    ? createCommunityHandlers({
        config,
        resolveScope: resolveRecipeReviewScope,
      })
    : null;
}
export const communityUnavailable = () =>
  communityJson({ ok: false, error: 'UNAVAILABLE' }, 503);
