import { handler } from './index.mjs';
const equal = (actual, expected) => {
  if (actual !== expected)
    throw new Error(`Expected ${expected}, got ${actual}`);
};
Deno.test('hosted probe rejects absent, public, forged-user and wrong project credentials before storage', async () => {
  Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'synthetic-service-credential');
  Deno.env.set(
    'SUPABASE_SECRET_KEYS',
    JSON.stringify({ default: 'sb_secret_synthetic-default-credential' }),
  );
  for (const headers of [
    {},
    { apikey: 'sb_publishable_public' },
    { authorization: 'Bearer forged-user-jwt' },
    { apikey: 'sb_secret_other-project' },
  ])
    equal(
      (
        await handler(
          new Request('https://example.com', {
            method: 'POST',
            headers,
            body: '{"action":"run"}',
          }),
        )
      ).status,
      403,
    );
  equal(
    (
      await handler(
        new Request('https://example.com', {
          headers: { apikey: 'sb_secret_synthetic-default-credential' },
        }),
      )
    ).status,
    405,
  );
  equal(
    (
      await handler(
        new Request('https://example.com', {
          headers: { authorization: 'Bearer synthetic-service-credential' },
        }),
      )
    ).status,
    405,
  );
});
