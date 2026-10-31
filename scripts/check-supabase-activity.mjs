#!/usr/bin/env node

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!/^https:\/\/[a-z0-9]{20}\.supabase\.co\/?$/.test(url ?? '') ||
    !/^sb_publishable_[A-Za-z0-9_-]{20,}$/.test(key ?? '')) {
  console.error('Supabase activity check: missing or invalid local configuration.');
  process.exitCode = 1;
} else {
  const endpoint = new URL('/rest/v1/rpc/project_keepalive', url);
  try {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const response = await fetch(endpoint, {
        headers: { apikey: key, accept: 'application/json' },
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok || (await response.json()) !== true) {
        console.error(`Supabase activity check failed on request ${attempt}: HTTP ${response.status}.`);
        process.exitCode = 1;
        break;
      }
    }
    if (!process.exitCode) console.log('Supabase database activity check: 3 successful queries.');
  } catch (error) {
    console.error(`Supabase activity check failed: ${error instanceof Error ? error.message : 'unknown error'}.`);
    process.exitCode = 1;
  }
}
