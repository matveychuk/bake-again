import {
  communityHandlers,
  communityUnavailable,
} from '@/lib/community/server/handlers';

export async function GET(request: Request) {
  const handlers = await communityHandlers();
  return handlers && !('problem' in handlers)
    ? handlers.list(request)
    : communityUnavailable(handlers);
}

export async function POST(request: Request) {
  const handlers = await communityHandlers();
  return handlers && !('problem' in handlers)
    ? handlers.submit(request)
    : communityUnavailable(handlers);
}
