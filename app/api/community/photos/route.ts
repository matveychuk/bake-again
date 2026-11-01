import {
  communityHandlers,
  communityUnavailable,
} from '@/lib/community/server/handlers';

/** GET serves a published review photo; POST receives one admitted upload. */
export async function GET(request: Request) {
  const handlers = await communityHandlers();
  return handlers && !('problem' in handlers)
    ? handlers.photo(request)
    : communityUnavailable(handlers);
}

export async function POST(request: Request) {
  const handlers = await communityHandlers();
  return handlers && !('problem' in handlers)
    ? handlers.upload(request)
    : communityUnavailable(handlers);
}
