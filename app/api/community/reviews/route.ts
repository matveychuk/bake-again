import {
  communityHandlers,
  communityUnavailable,
} from '@/lib/community/server/handlers';

export async function GET(request: Request) {
  const handlers = await communityHandlers();
  return handlers ? handlers.list(request) : communityUnavailable();
}

export async function POST(request: Request) {
  const handlers = await communityHandlers();
  return handlers ? handlers.submit(request) : communityUnavailable();
}
