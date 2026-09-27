import { getAssistantRuntimeBindings, parseAssistantRuntimeEnv } from '../../../../lib/assistant/server/env.ts';
import { getAssistantProtection } from '../../../../lib/assistant/server/protection.ts';

export const dynamic = 'force-dynamic';

/** Public widget configuration only. No credentials or database details leave the server. */
export async function GET() {
  const headers = { 'cache-control': 'no-store', 'content-type': 'application/json; charset=utf-8' };
  try {
    const bindings = await getAssistantRuntimeBindings();
    if (!parseAssistantRuntimeEnv(bindings).enabled) throw new Error('Disabled');
    const { siteKey } = getAssistantProtection(bindings);
    return new Response(JSON.stringify({ siteKey }), { headers });
  } catch {
    return new Response(JSON.stringify({ available: false }), { status: 503, headers });
  }
}
