import { createConfiguredPersonalRecordHandler } from '../../../../../lib/personal/server/configured-handler.ts';
import { getPersonalBindings } from '../../../../../lib/personal/server/runtime.ts';

export const dynamic = 'force-dynamic';
// No default activation. Supabase validates a reader's bearer token; cookies and
// platform headers cannot select an account. Phase C supplies the reader UI.
export const GET = createConfiguredPersonalRecordHandler(getPersonalBindings);
export const POST = GET;
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
export const OPTIONS = GET;
