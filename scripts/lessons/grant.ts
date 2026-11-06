import { createClient } from '@supabase/supabase-js';
import { parseArgs } from 'node:util';
import { normalizeEmail } from '../../lib/lessons/payhip.ts';
const { values } = parseArgs({
  options: {
    email: { type: 'string' },
    lesson: { type: 'string' },
    revoke: { type: 'boolean' },
  },
});
if (
  !values.email ||
  values.lesson !== 'napoleon-video' ||
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
)
  throw new Error('Use --email … --lesson napoleon-video [--revoke]');
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)
  throw new Error('Missing server credentials');
const db = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
const email = normalizeEmail(values.email);
const result = values.revoke
  ? await db
      .from('lesson_entitlements')
      .update({ status: 'revoked', revoked_at: new Date().toISOString() })
      .eq('lesson_id', values.lesson)
      .eq('email', email)
      .eq('status', 'active')
      .select('id')
  : await db
      .from('lesson_entitlements')
      .insert({
        lesson_id: values.lesson,
        email,
        source: 'manual',
        status: 'active',
      })
      .select('id');
if (result.error) throw new Error('Grant update failed');
console.log({
  action: values.revoke ? 'revoked' : 'granted',
  count: result.data?.length ?? 0,
});
