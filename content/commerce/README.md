# Video lessons · site access (04.11.2026)

`video-lessons.ts` controls the sales offer and exact recipe version. The Napoleon
lesson stays **planned**: no invented price, checkout, video UID or completed purchase.
`available` requires a paid Payhip URL, integer price, currency, language and
`deliveryUrl: '/uk/urok/napoleon'`. Recipe links and the banner navigate to the lesson
page; only that page links to checkout. `withdrawn` hides the offer and preserves
access already purchased. Sales banner copy needs Sasha's review before activation.

## Access and video contract

Payhip handles payment, tax and receipt; Bake Again grants local access **only** after
a verified server webhook. Return URLs, cookies, browser progress, clicks and
`?success` never grant entitlement. `/uk/urok/napoleon` is the Ukrainian product page,
with server-rendered description/login/lesson states, canonical URL and no hreflang.
There are no English or Spanish lesson routes. Private UIDs and signed playback URLs
are absent from the public HTML. Personalized rendering is dynamic; API replies use
`private, no-store`. A private playback request without a session returns 401; without
an active purchase it returns 403. Provider errors fail closed.

`lessons/napoleon.ts` extends the recipe's original manifest; stable step IDs and its
separate disabled recipe-preview contract are preserved. Video replacements change
only `lessons/napoleon.media.json`. Each key is a stable step ID:

```json
{
  "s05-rolling": {
    "status": "draft",
    "uk": {
      "wide": { "provider": "cloudflare-stream", "uid": "<32 hexadecimal characters>", "durationSec": 26 },
      "vertical": { "provider": "cloudflare-stream", "uid": "<32 hexadecimal characters>", "durationSec": 26 },
      "captionsVtt": "/media/lessons/napoleon/s05-rolling.uk.vtt"
    }
  }
}
```

Empty UIDs explicitly mean media is pending, not working draft playback. The page
shows a food poster and a clear unavailable message. Both Ukrainian orientations
must exist and durations must match within 0.5 seconds before replacement. The
13 draft durations are estimates from the specification. Narrated finals supply
actual durations, captions and `status: final`. PDF production/delivery is a separate
task; `pdf: null` is reserved, with no broken download button.

Cloudflare Stream is the single video provider. All paid videos require signed URLs,
free step 8 is public. HLS uses native Safari playback or pinned, lazy-loaded hls.js.
The same player serves the free step on browsers needing HLS support, so hls.js also
loads when that public preview needs it. Orientation swaps preserve time and paused
state; playlist, next/previous, continuous playback, captions, keyboard controls and
local resume use the same player. Progress is optional browser storage, never proof
of access. Screen capture and reconstruction of an authorized HLS stream remain
possible; signed tokens are not DRM.

Cloudflare's `accessRules` supports IP/country restrictions, **not domains**. Domain
restrictions are configured with each video's `allowedOrigins`, including explicitly
approved preview hostnames. Tokens sign one UID for four hours, disable downloads,
and never expose the signing key. A refund prevents issuing new tokens; an already
issued token can remain usable until its four-hour expiry.

## Server setup (Sasha)

1. Apply `supabase/migrations/20261104120000_lesson_access.sql` to the same project as
   existing Auth. RLS lets a verified user read only their normalized email rows;
   only service role may write or call webhook/rate-limit RPCs. Do not change the
   personal-sync publishable-key/RLS configuration.
2. Create an **unlisted new digital product** in Payhip: «Відеоурок «Наполеон без
   глютену»». Upload the separately prepared, optimized one-page “Як відкрити урок”
   PDF linking to `https://bakeagain.com/uk/urok/napoleon`, purchase-email sign-in and
   hello@bakeagain.com. Its PDF production is separate from this code change.
   Never reuse trial products `vAZlB` or `upKrI`. Put the product ID/key in
   `PAYHIP_LESSON_PRODUCT_IDS` (comma-separated) or manifest `payhipProductIds`.
3. Generate two distinct secrets locally (for example `openssl rand -hex 32`):
   `PAYHIP_WEBHOOK_PATH_SECRET` and `LESSON_DELIVERY_JOB_SECRET`. Store values only
   in ignored local environment files / Worker secrets; neither URL nor key belongs
   in this README. In Payhip Settings → Developer, register **paid** and **refunded**
   at `https://bakeagain.com/api/lessons/payhip/<path-secret>`; add `PAYHIP_API_KEY`.
   The webhook checks the secret path and constant-time SHA-256 API-key signature.
   It accepts only configured products and bounded JSON. Transaction processing and
   event recording are atomic, including duplicate/reordered refunds. Full refunds
   remove access; partial refunds retain paid access. A refund alone never counts
   as a paid purchase. Logs contain transaction/product/result, never buyer email.
   Restrict/redact request-URL logging for this endpoint: its path contains a secret.
4. Reuse the existing server-only `COMMUNITY_SUPABASE_SECRET_KEY` when the same Supabase project already supplies it; an explicit `SUPABASE_SERVICE_ROLE_KEY` takes precedence. Add `BREVO_API_KEY`, existing Turnstile
   keys and `ASSISTANT_SESSION_SECRET`. Enable `LESSONS_ENABLED=true` only in the
   configured runtime. The normal existing Auth must also be enabled.
5. Existing Supabase Auth handles OTP verification through shared `auth-link.ts` and
   the same browser client. Allowlist `/uk/urok/napoleon` on production and approved
   preview origins in Auth redirect settings. This route validates Turnstile once,
   enforces durable IP/email limits (5/15 min), generates a Supabase magic link with
   the service role, and sends the Ukrainian transactional login email through Brevo.
   It never checks purchase membership before sending. This avoids double-consuming
   the challenge at Supabase. Set `LESSON_OTP_EXPIRY_MINUTES` to the project's actual
   Auth email OTP expiry, not a made-up duration. OTP hashes travel in the fragment,
   are removed before requests, and use the existing verifyOtp implementation.
   A verified HttpOnly Secure SameSite=Lax host cookie bridges the existing browser
   session to SSR. Token refresh and sign-out update it; no service key reaches clients.
6. In Brevo create «Наполеон — купили», set `BREVO_LESSON_BUYERS_LIST_ID`, and prepare
   the `SOURCE` text attribute. This list is **only for suppression of repeat purchase
   offers**; keep it out of newsletter automations and never infer marketing consent.
   Sender/reply-to: hello@bakeagain.com. Welcome and login subjects/copy are in the
   server handlers, so no new template ID is needed.
7. The Worker entry retries the outbox with a Cloudflare cron every five minutes.
   The protected POST `/api/lessons/delivery` remains available for manual retries
   with `Authorization: Bearer <LESSON_DELIVERY_JOB_SECRET>`. Webhook responds after
   the database commit; `waitUntil` attempts delivery immediately. The persisted
   outbox independently retries pending buyer-list/welcome work. `welcome_sent_at`
   prevents normal duplicate sends; an atomic lease and Brevo UUID idempotency key
   cover concurrent/recent retries. **Ambiguous sends older than 15 minutes are held**,
   because Brevo deduplication is time-limited: reconcile them in Brevo before marking
   delivered or clearing `welcome_attempted_at` and `welcome_needs_review`. Database and email-provider writes
   cannot form one atomic transaction. Surface these held rows in operational review;
   a webhook ACK is never evidence of inbox/phone delivery.
8. Enable Stream in Cloudflare, create a signing key, and set `CF_STREAM_ACCOUNT_ID`,
   `CF_STREAM_SIGNING_KEY_ID`, `CF_STREAM_SIGNING_KEY_JWK` (JSON or Cloudflare base64
   JWK). The upload API token stays local as `CLOUDFLARE_STREAM_API_TOKEN`. Configure
   extra exact preview hostnames using `CF_STREAM_ALLOWED_ORIGINS` for upload.

Provider setup, encrypted Worker secrets and the database migration were applied
with Sasha's explicit authorization on 2026-11-04. See
[the verified setup record](lessons/setup.uk.md) for deployment and remaining
purchase/phone checks. Never record secret values here.

## Upload / replace media

Use Node 22.13+ and a local ignored `.env`. Keep camera originals and working exports
in recipe storage, outside public assets. Input names are strict:
`napoleon-uk-s05-rolling-wide.mp4` and `napoleon-uk-s05-rolling-vertical.mp4`.
Partial batches are supported, but each supplied step needs both orientations.

```sh
npm run lessons:upload -- /absolute/path/to/reviewed-videos
# Narrated finals:
npm run lessons:upload -- /absolute/path/to/final-videos --final
# Only AFTER testing replacement playback; separate explicit deletion action:
npm run lessons:upload -- --prune --reviewed
```

The uploader uses TUS with 50 MiB chunks for all sizes, sets privacy/origin rules,
waits for encoding, validates paired durations, then atomically writes the media JSON.
`napoleon.stream-history.json` records replaced UIDs for an explicit later prune;
only recorded obsolete UIDs can be deleted, never arbitrary account videos. A failed
upload/validation preserves the current manifest, but may leave new unreferenced UIDs
in Stream: inspect the printed UIDs before cleanup. Prune never deletes local sources.
For supplied posters, copy the JPEG masters into `media/web-source/` and set each
orientation's `posterPath` in `napoleon.media.json` to the matching generated WebP URL.
Run `npm run media:prepare` to generate and validate the posters. The player uses a
Stream thumbnail when the manifest has no custom poster. No source files enter deployment.

Manual access (no email is sent, email omitted from command output):

```sh
npm run lessons:grant -- --email someone@example.com --lesson napoleon-video
npm run lessons:grant -- --email someone@example.com --lesson napoleon-video --revoke
```

Revoke affects all active rows for that email and lesson. A late paid retry does not
reactivate refunded/revoked rows. Multiple legitimate purchases can grant access.

## Verification and launch

Run `npm run test:lessons`, `test:commerce`, analytics and auth-link tests, typecheck,
lint and build (including `media:prepare`). The lesson tests execute the migration
in real Postgres via PGlite: webhook fixture, replay, refund ordering, partial/full
refunds, revocation, RLS and rate limits, plus real RSA signatures and manifest checks.
Design Lab `#video-lessons` uses the production player with an inert poster preview;
it does not request private video, persist progress, send events or create access.

Before sale: upload drafts/finals, configure secrets, verify free/private Stream rules,
make the authorized hidden-product test purchase (100% coupon), verify webhook →
welcome → OTP → phone playback at both orientations, rotate at the same timestamp,
verify continuous/resume/expired-token behavior, wrong email and signed-out 401/403,
full refund and resulting access denial. Test 390/900/1440, both themes, keyboard,
JavaScript disabled, real iPhone Safari, Android Chrome and macOS Safari/Chrome.
A zero-price refund may require a separately authorized minimal paid test. No payment,
refund, remote deployment or phone check is claimed by local tests.

Only after the above and Sasha's price/banner-copy confirmation: set `available`, real
`payhipUrl`, `priceMinor`, EUR, uk and deliveryUrl; make Payhip visible and publish the
reviewed changes. Privacy retention wording in uk/en/es is prepared for Sasha's review.

References checked 04.11.2026: [Payhip webhooks](https://help.payhip.com/article/115-webhooks),
[Stream security](https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/),
[Stream TUS](https://developers.cloudflare.com/stream/uploading-videos/resumable-uploads/),
[Brevo idempotency](https://developers.brevo.com/docs/heterogenous-versions-batch-emails).

### Napoleon recipe v6 integration (2026-11-04)

The recipe pins `gluten-free-napoleon-v6`; the catalogue remains `planned`. Five
method-step references use stable IDs from `lessons/napoleon.ts`, appearing only for
an available lesson in its own language. `freePreview.enabled` remains false and
`freePreview.videos` remains empty until real public wide/vertical media, poster and
upload date arrive. Add the optional `captionsVtt` after author narration. Preview
builds may set `NAPOLEON_FREE_STEP_PREVIEW=true`; production must not set it.
The site-access implementation extends this manifest and owns checkout/access routes,
preserving the stable IDs and the recipe-preview media contract.


### Confirmed local QA · 04.11.2026

- Lesson suite: 8 tests passed, including real Postgres migration/RLS and mocked
  Brevo/reader-access checks. Related commerce, recipe v6, Auth/personal and analytics:
  73 tests passed. Typecheck and full repository lint passed.
- Production build passed with media preparation: 198 referenced media files,
  37.32 MiB. Vite reported chunk-size and repeated CSS filename warnings.
- Isolated desktop Chrome: description and login at 390/900/1440, light/dark,
  long Ukrainian/Spanish/English step labels, no horizontal overflow or page errors.
  No-JavaScript HTML keeps the list/message/native disclosure; private playback without
  session returns 401; missing free media returns 503; EN/ES lesson routes return 404.
- The actual player component, using a local MP4 fixture and mocked playback endpoint:
  2-second seek survived portrait/landscape source replacement; pause/playing state,
  N-key navigation, continuous start/stop, 90% completion and resume prompt passed.
  This fixture exercises native source switching, not real Stream HLS or device Safari.
- Review screenshots and JSON results: `outputs/lesson-qa/` (ignored local artifacts).
  Real provider setup, video UIDs, phone playback, purchase/refund, inbox delivery and
  deployment remain unverified. The sales catalogue stays `planned`.
