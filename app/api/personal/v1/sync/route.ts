import { createPersonalSyncHandler } from '@/lib/personal/server/sync-http';
import { getPersonalBindings } from '@/lib/personal/server/runtime';
export const dynamic = 'force-dynamic';
export const POST = createPersonalSyncHandler(getPersonalBindings);
export const GET = POST;
export const PUT = POST;
export const DELETE = POST;
export const OPTIONS = POST;
export const PATCH = POST;
