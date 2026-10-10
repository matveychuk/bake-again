import { getPersonalBindings } from '@/lib/personal/server/runtime';
import { supabasePersonalConfig } from '@/lib/personal/server/supabase-config';
export const dynamic = 'force-dynamic';
export async function GET() {
  const headers = {
    'cache-control': 'private, no-store',
    'x-content-type-options': 'nosniff',
  };
  try {
    const bindings = await getPersonalBindings();
    const config =
      bindings.PERSONAL_SYNC_ENABLED === 'true'
        ? supabasePersonalConfig(bindings)
        : null;
    return Response.json(
      config
        ? {
            enabled: true,
            authReady: bindings.PERSONAL_AUTH_READY === 'true',
            url: config.url,
            publishableKey: config.publishableKey,
          }
        : { enabled: false },
      { headers },
    );
  } catch {
    return Response.json({ enabled: false }, { status: 503, headers });
  }
}
