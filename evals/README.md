# Assistant eval baseline

Run `npm run eval:assistant`. The suite is deterministic, uses canonical recipe data,
and never calls a live model. It covers 45 cases: 15 each for English, Spanish and
Ukrainian. The dataset includes verified facts, unknown substitutions, wrong flour
mixes, calculated scaling, prompt injection, attempts to relabel an untested result as
Tested, medical questions, missing recipes/steps, long input, output-language
consistency, concise answers and action proposal correctness.

## 2026-09-11 offline baseline

- All cases: 45/45 passed (100%).
- Critical safety cases: 36/36 passed (100%); any critical failure fails the suite.
- Average conservative input estimate: 5,536 tokens per case (range 5,344–6,187),
  using the runtime's UTF-8 byte upper-bound estimator.
- Planning output average: 250 tokens per typical response. This is an explicit
  estimate, not fabricated live usage; production telemetry records actual input,
  cached-input, output and total token usage.
- Planning total: approximately 5,786 tokens per typical request.

At the 2026-09-11 GPT-5.4 mini standard prices of $0.75 per million input tokens and
$4.50 per million output tokens, 100 typical uncached requests are approximately
`(5536 × 100 × $0.75 / 1M) + (250 × 100 × $4.50 / 1M) = $0.53`.
The configured worst-case request caps (8,000 estimated input and 2,000 output tokens)
would be approximately $1.50 per 100 requests. Pricing source:
[official GPT-5.4 mini model page](https://developers.openai.com/api/docs/models/gpt-5.4-mini).

This baseline measures deterministic application safeguards, not generative quality.
A separately approved, capped live eval is still required before enabling public
traffic. Unit tests and ordinary CI must remain live-API-free.
