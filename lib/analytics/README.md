# Analytics

Umami remains cookieless and independent of advertising consent. `umami.ts` retains
its existing configuration and allowlist. Meta never uses the Umami pending queue.

Umami records `cookie_consent_accept` and `cookie_consent_decline` on explicit
banner choices, including through Cookie Settings. On the Napoleon lesson these
events and `lesson_page_view` include `src` when it matches a reviewed campaign
label. The payload drops arbitrary `src` values, `fbclid` and all URL queries and
fragments. Accept divided by accept plus decline measures the share of recorded
choices; it does not include people who leave without choosing.
Repeated mounts in the same lesson state and campaign do not count as a second
view; leaving the lesson resets this guard for the next visit.

The service link `/api/analytics/umami/off` sets a host-only browser preference
for one year before redirecting to `/uk`. On this browser profile, the preference
skips the Umami script and blocks custom events. It also stops sends from already
open tabs via the tracker's before-send hook. `/api/analytics/umami/on` clears the
preference. Repeat in each browser profile that should be excluded. The preference
is independent of Meta consent and does not change historical analytics.

## Configuration

Public Cloudflare Worker vars: `META_PIXEL_ID=477724239421268` (Sasha, 2026-11-06),
`META_DOMAIN_VERIFICATION` empty. `.env.example` documents both without values.
The root layout passes only the validated public ID into the client; it renders the
domain verification tag only for a nonempty value. Empty/invalid Pixel ID disables
both the cookie banner and SDK. No NEXT_PUBLIC fallback can accidentally reactivate it.

## Consent and URL boundary

`ba_consent` in first-party localStorage stores `{ads, v:2, ts}` for 12 calendar
months; storage access is guarded and unavailable storage retains a session choice.
A changed version or expiry requires another decision. Cross-tab changes take effect.
DNT=1 disables the banner and Meta; localhost, preview and QA never initialize it.

Only acceptance can create `fbevents.js`. There is no preconnect, noscript tracking
image or SDK before acceptance. The SDK loads once; initialization waits for its
load and rechecks the live URL/consent. Automatic configuration and automatic SPA
tracking are disabled. No advanced-matching fields are passed to init. Automatic
advanced matching and server-configured automatic events must also remain disabled
in the owner's Events Manager settings, as required by the specification.

`meta-policy.ts` checks the full current URL and referrer before loading or sending:
no account/auth/claim/checkout route, auth or purchase credentials, email, arbitrary
query or fragment. It explicitly allows only reviewed public query keys and section
anchors; `src` and public Meta click attribution (`fbclid`) remain supported.
Sensitive referrers conservatively suppress Meta for that document lifetime.
History push/replace, popstate and hash changes recheck consent and URL safety.
History calls revoke synchronously on unsafe addresses. Auth cleanup can re-enable
tracking only once the address is safe. The site never replaces or consumes login
credentials for analytics purposes.

Withdrawal calls `fbq('consent','revoke')`, discards pending conversions, blocks new
events and expires host/parent-domain `_fbp`/`_fbc` cookies at root/current path scopes.
The loaded SDK can remain in memory. No denied/pre-consent conversions are replayed.
A conversion while an accepted SDK is loading is retained only for the same safe
route; unsafe navigation or withdrawal discards it.

## Events

- PageView: one per pathname visit (not React effect replay, query-only updates or
  section anchors), including SPA push/replace/back/forward and safe auth cleanup.
- ViewContent: reviewed localized recipe slug and stable recipe ID, or Napoleon
  description state with catalog price/currency. No lesson ViewContent for login/player.
- Lead: the verified-success branch of NewsletterForm, alongside existing Umami
  submits. Category bonus for a known magnet, lesson for the lesson scenario,
  otherwise newsletter; name is magnet ID or a fixed block position.
- LessonBuyClick: alongside lesson_buy_click; catalog price/currency and trackCustom.
- Never InitiateCheckout or Purchase; Payhip owns both with the same Pixel ID.

No email, form values, search text, notes or checkout URLs enter event parameters.
The live Napoleon offer is €9. The catalog controls sale availability, currency
and price, and a listed price alone never enables a buy event.

## Verification

`npm run test:analytics` covers storage/version/expiry, route gates, all localized
recipe mappings, catalog pricing, event allowlists, callback/claim/checkout protection,
SDK deduplication, withdrawal, safe cleanup and form success-branch placement.
`npm run typecheck`, `npm run lint`, `npm run build` are required release checks.

Use the local-only Design Lab fixed fixture for visual screenshots: it intentionally
has no production-host bypass. Check 375×812 plus 390, 900 and 1440px, all locales,
keyboard focus and long copy. Production Meta Pixel Helper / Events Manager delivery,
actual network behavior of the remotely hosted SDK, Payhip configuration and mobile
Lighthouse are separate release checks: mocked SDK tests are not proof of delivery.

## Banner wording update · 2026-11-07

Sasha requested neutral wording in this chat, superseding only the initial banner
copy in the Claude specification. The new uk/en/es text names Meta, advertising
measurement, personalised ads and the visited-page basis without the original
Bake Again retargeting phrasing. The privacy section remains verbatim from the spec.
Consent version is 2 so version-1 decisions are requested again. This is a wording
change, not a change to SDK gating or events. Reference: AEPD Guía de cookies,
first-layer information: https://www.aepd.es/guias/guia-cookies.pdf.

### Action-led wording · 2026-11-08

At Sasha's request, the banner now follows the supplied “By clicking Accept”
pattern and explicitly describes storage on the device. The actual purposes
(advertising measurement and personalised ads based on visited pages) remain
visible in uk/en/es. Navigation and cookieless Umami analytics do not depend on
this choice, so the banner does not attribute them to Meta cookies. Consent
version remains 2 because this changes the wording, not the consent scope.
