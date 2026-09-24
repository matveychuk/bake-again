const fail = (message) => {
  throw new Error(message);
};

if (process.env.OPENAI_MODEL !== 'gpt-5.4-mini') {
  fail('The production OPENAI_MODEL variable must be gpt-5.4-mini.');
}

if (!['true', 'false'].includes(process.env.ASSISTANT_ENABLED ?? '')) {
  fail('The production ASSISTANT_ENABLED variable must be true or false.');
}

const tokenLimit = Number(process.env.ASSISTANT_MAX_OUTPUT_TOKENS);
if (!Number.isInteger(tokenLimit) || tokenLimit < 256 || tokenLimit > 4000) {
  fail('The production token limit must be an integer from 256 to 4000.');
}

let productionUrl;
try {
  productionUrl = new URL(process.env.PRODUCTION_URL ?? '');
} catch {
  fail('The production URL is missing or invalid.');
}
if (
  productionUrl.protocol !== 'https:' ||
  productionUrl.username ||
  productionUrl.password
) {
  fail('The production URL must be an HTTPS URL without credentials.');
}

// Match the runtime contract: a disabled assistant needs no credentials.
// Enabling it still requires both protected secrets.
const assistantEnabled = process.env.ASSISTANT_ENABLED === 'true';
if (assistantEnabled && process.env.OPENAI_API_KEY_CONFIGURED !== 'true') {
  fail(
    'The protected production OPENAI_API_KEY GitHub secret is not configured.',
  );
}
if (assistantEnabled && process.env.ASSISTANT_SESSION_SECRET_CONFIGURED !== 'true') {
  fail(
    'The protected production ASSISTANT_SESSION_SECRET GitHub secret is not configured.',
  );
}

console.log(
  `Production configuration is complete for ${productionUrl.hostname}; model, feature flag, token limit and required secret presence were validated without reading secret values.`,
);
