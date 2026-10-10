# Newsletter connection

The owner selected Brevo Free for the newsletter on 2026-10-09. The site supports
a provider-hosted signup form; the production invitation remains disabled until
the real forms and delivery flows are verified. This layer does not collect email
addresses, write a subscriber database, send mail or load provider scripts.

`NewsletterSignup` reads runtime bindings (Cloudflare Workers, Node for tests).
`newsletterSignupConfig` returns no UI unless `NEWSLETTER_ENABLED=true`, a provider
name and a valid language-specific HTTPS form URL are all present. A missing
language has no fallback to another audience. Preview the inert layout in
`/design-system#recipe-utilities`.

## Connect Brevo after external verification

### Current setup, 2026-10-09

Six hosted forms exist in Brevo: UK/ES/EN signup and unsubscribe. Their real URLs,
form IDs, category values and DOI template IDs are recorded in
`brevo-forms.json`. Hosted content was reviewed in all three locales. The owner then authorized
a UK subscription test from the local site; the shared list gained one confirmed
owner contact only after the DOI click. The current email-only revision has no consent checkbox or language selector.
Its explicit subscribe button and visible notice capture the request; DOI confirms
it. Each form targets the master list and its own language-specific audience list. No final confirmation, unsubscribe
follow-up or team notification email is configured.

The ignored `.env.local` contains the actual locale URLs with
`NEWSLETTER_ENABLED=false`. This prepares the existing connection without making
the invitation available. `brevo-forms.json` is an operations/copy record, never a
runtime credential source. Do not turn the flag on merely because the URL works.

Domain authentication, CAPTCHA, ES/EN delivery and suppression tests remain incomplete.
The owner approved `Bake Again <bakeagain.recipes@gmail.com>` and one Brevo
verification email on 2026-10-09. Its sender now shows Verified. The sender and
Reply-To were saved and reviewed in UK/ES/EN templates #5/#6/#7.
Brevo's template UI says it replaces the unauthenticated sending domain with
`@brevosend.com`. This mailbox does not authenticate `bakeagain.com`.
The owner subsequently requested a test subscription and one test message to her
primary mailbox. She confirmed the exact address, and the UK DOI and one marketing test were
received in Gmail on 2026-10-09. The language attribute is Українська. Before the
DOI click list #3 had zero members; after it the list had one. Actual headers show
From `bakeagain.recipes@12416640.brevosend.com`, the business Gmail Reply-To,
`brevosend.com` signing and TLS. This verifies UK delivery only.
For this test, #5/#6/#7 were activated and assigned to their matching forms;
double opt-in remains enabled and the final confirmation email remains off.
Do not distribute these forms publicly before launch checks. Current forms are
**not yet verified end-to-end integrations**. Campaign #8 was sent once to the exact individual owner contact at 23:10 Madrid
time and received in Inbox. Its native `{{ unsubscribe }}` link resolved in the
received email. The owner remains subscribed; suppression is not yet tested.
The default post-DOI success page appeared in Spanish after a UK signup, and the
native campaign unsubscribe page still needs locale review. Hosted unsubscribe
forms do not automatically replace that campaign page.

### Current compact notice revision, 2026-10-10

At the owner’s request, UK/ES/EN forms replace the large native GDPR declaration
and blue illustration with one compact Text block immediately before Subscribe.
It states agreement to the described newsletter, withdrawal at any time, Brevo
processing and a localized privacy link. The purpose and language appear once,
in the unchanged introduction. EMAIL remains the only editable required field.
The note uses `font-size-body-small` (14px) with the existing form typography.

Version `2026-10-10-v3-compact-notice` is recorded in the manifest; v2 copy remains
in revision history. DOI templates #5/#6/#7 retain their full purpose-specific
consent statement. `confirmation.consent` now records that text separately from
`signup.consent`, so shortening the form does not silently shorten the email.
Regenerated DOI HTML is byte-for-byte unchanged. No provider email template,
audience assignment, URL, confirmation setting or site enablement changed.

All nine hosted layouts passed 390/900/1440px in UK/ES/EN without overflow, with
one blank required EMAIL, no checkbox/radio/illustration and correct privacy URLs.
Tab reaches the privacy link with visible native focus.
Evidence: `outputs/newsletter/compact-signup-review.json` and
`compact-signup-<locale>-<width>.jpg`. No form submission or email send occurred.
The delivery/consent-record and launch blockers listed below remain outstanding.

### Email-only revision, 2026-10-09 (historical)


At the owner's explicit request, UK/ES/EN hosted forms now have one editable field,
EMAIL, and one subscribe button. The language control and OPT_IN checkbox were
removed, with no hidden or prechecked consent checkbox. A purpose-specific consent
statement, unsubscribe information, privacy link and Brevo processor notice remain
visible immediately before the button. Form copy states the actual email language.

Three empty audience lists were created and assigned through the native form
Listas step: `Bake Again — Newsletter — UK`, `… — ES` and `… — EN`. Every form
also retains master list `Bake Again — Newsletter`. DOI remains enabled with the
matching active #5/#6/#7; the new consent text was saved in all three DOI templates
and verified after reopening. Final confirmation email remains off. No automation,
recipient import, contact move or send was performed.

Use the language-specific lists to select future newsletter audiences. The legacy
`NEWSLETTER_LANGUAGE` attribute is not populated by this revision. The previously
confirmed owner contact still belongs to the old master list and retains its UK
attribute; it was not moved. Do not treat the master list as one language audience.

Brevo documents `DOUBLE_OPT-IN` as proof of a DOI click, independently of `OPT_IN`:
[Brevo consent records](https://help.brevo.com/hc/en-us/articles/213405965-Build-a-legitimate-contacts-database-for-optimal-deliverability-and-compliance).
The new flow has **not** been submitted or delivery/consent-record tested; the
previous successful UK test applies to v1. Verify the confirmation record, exact
list placement and suppression with an authorized test before launch. Native
subscription/blocklist status remains authoritative; never reset it from OPT_IN.

All nine hosted layouts and nine updated local DOI layouts passed 390/900/1440px
in UK/ES/EN without overflow. EMAIL remains required and blank. Tab reaches the
privacy link with visible focus. `npm run newsletter:prepare` and build passed.
Evidence: `outputs/newsletter/email-only-review.json`, `email-only-<locale>-<width>.jpg`,
`email-only-doi-<locale>-<width>.jpg`, `email-only-keyboard-focus.jpg`,
`simple-signup-<locale>-saved.jpg` and `simple-signup-<locale>-doi.jpg`.
Invalid/empty-field messages were also saved and reopened in UK/ES/EN; they ask
only for the email address. Nine local privacy layouts passed the same widths.
Evidence: `outputs/newsletter/email-only-validation-review.json`.
The existing site URLs are unchanged; isolated local preview uses the same updated
forms. Default/public flag remains false; SMTP, paid services and deployment were
not changed. Unsubscribe testing remains deferred by the owner.

The appearance/default investigations below document the earlier v1 state.

### Signup appearance review, 2026-10-09

The enabled UK/ES/EN website invitation now contains only the title, short benefit
and existing outline CTA. Provider handoff and confirmation/unsubscribe helper
sentences were removed at the owner's request; the inert Design Lab retains its
preview note. Actual consent/privacy/withdrawal information remains in the forms.

All three hosted signup forms were saved in Brevo with the existing page/surface/
text palette, a Georgia display fallback, primary terracotta button, on-accent
button text and control radius. Native Brevo controls and the RGPD illustration
remain. This review did not change DOI, recipients or submission settings.

The website block and hosted forms passed UK/ES/EN × 390/900/1440px with no
horizontal overflow. The email field remained empty and consent/language remained
unchecked. `npm run build` passed. Evidence: `outputs/newsletter/signup-brand-review.json`,
`signup-brand-<locale>-<width>.jpg` and `invitation-clean-<locale>-<width>.jpg`.
No forms were submitted, no emails sent and no website published in this review.

### Language default investigation, 2026-10-09

The owner requested fewer clicks through a preselected language and consent.
The current hosted single-choice editor exposes option visibility, presentation,
ordering and required state, but no default-value control was found. Its checked
editor preview is not a selected value in the live form. A focused UK test with
`?NEWSLETTER_LANGUAGE=1` left the live radio unchecked. Do not add this ineffective
parameter to site URLs or claim automatic language selection is implemented.
A future embedded/custom form could set the visible language default; it needs its
own reviewed integration. Current hosted forms remain unchanged.

Consent remains required and unchecked. Pre-ticked boxes do not provide valid
consent: [EDPB guidance](https://www.edpb.europa.eu/sme/be-compliant/process-personal-data-lawfully_en).
No subscription or email was triggered in this investigation.

### Local subscription preview

An isolated, ignored `outputs/newsletter/local-preview.env` enables only the local
newsletter invitation; `.env.local` and public defaults remain disabled. Start
the already-built local site with:

```sh
WRANGLER_WRITE_LOGS=false WRANGLER_LOG_PATH=.wrangler/logs MINIFLARE_REGISTRY_PATH=.wrangler/registry npx wrangler dev --config dist/server/wrangler.json --env-file "$PWD/outputs/newsletter/local-preview.env" --port 3047
```

Open `http://localhost:3047/uk` and scroll to “Наступний рецепт — вам на пошту”. The button
opens the real hosted Brevo form. Submitting it sends a real DOI email; this is
not an offline mock. A contact joins the selected newsletter list only after
confirming the DOI link. The backend does not collect email addresses. UK/ES/EN
local buttons were checked against their actual hosted destinations without
submitting an address during routing review. The subsequent authorized UK test
followed this full path successfully. This preview does not enable Supabase Auth
or publish.

Run `npm run newsletter:prepare` to regenerate `templates/*-double-opt-in.html`
from the reviewed copy and semantic design tokens. These files contain Brevo's
`{{ doubleoptin }}` link and the matching consent, with no promotional content,
remote images, webfonts, script or recipient personalization. The fonts are the
email-safe fallbacks of the existing design tokens. This command never sends mail.
See `docs/architecture/newsletter-brevo-setup-2026-10-09.uk.md` for exact DNS,
provider state, launch checks, evidence and separate Supabase SMTP requirements.

1. Create reviewed UK/EN/ES forms only for the languages actually supported by the
   newsletter. Use Brevo's hosted forms, including privacy information,
   an explicit marketing subscription action and unambiguous language/audience routing.
2. Enable double opt-in in the provider: form submission must not claim a confirmed
   subscription before email confirmation. Verify duplicate and already-subscribed
   addresses produce a usable, non-enumerating response.
3. Verify with owned test addresses: submit, receive confirmation, confirm once,
   retry the confirmation link, receive a test newsletter, unsubscribe, and confirm
   suppression prevents subsequent marketing. Verify the provider handles spam and
   abuse, invalid addresses, delivery failures and repeated submissions.
4. Configure the verified sending domain and sender/reply-to identity in the provider.
   Update the site's privacy content with the selected provider and actual data flow.
   Purchasers must not be enrolled in marketing automatically.
5. Set `NEWSLETTER_PROVIDER_NAME` and the reviewed `NEWSLETTER_SIGNUP_URL_UK`,
   `_EN`, `_ES` URLs as non-secret runtime configuration. Only after the preceding
   flow works, set `NEWSLETTER_ENABLED=true` and request the separately authorized
   deployment. Do not put an API key or subscriber's email in these public links.

There is deliberately no public `/api/newsletter` endpoint before the provider
contract is known. A future inline form can reuse the invitation but needs its own
server adapter, abuse protection, consent records and end-to-end provider tests.

Brevo is approved for newsletters. Supabase Free was selected separately for
reader accounts and personal data on 2026-10-09. The owner enabled Brevo custom SMTP for
Supabase on 2026-10-10; the first signup confirmation was delivered (Brevo logs
and the owner’s Gmail screenshot). Confirmed login and sync remain separate checks.
Account creation must not subscribe a reader to marketing. Keep newsletter
consent and suppression separate from account identity and recovery. The same
Brevo Free account sends auth emails: budget for its shared 300 sends/day;
separate sender addresses do not create separate quotas. See the local handoff
at `docs/architecture/round-2-foundation.uk.md` for the migration proposal and
external checks still required.

## Verification

### Newsletter design draft, 2026-10-09

`npm run newsletter:prepare` now also generates `templates/*-newsletter.html`
from `newsletter-template-copy.json` and the existing design tokens. It extends
the email table composition with inline colours, a constrained reading column,
an editorial wordmark/heading, one terracotta CTA and a localized privacy/unsubscribe
footer. The introductory copy is a design draft, not a published newsletter issue.
The original DOI copy/templates were not changed in that palette review.
Their consent text was subsequently aligned with the email-only revision above.

Run the separate Email Design Lab locally:

```sh
python3 -m http.server 3057 --bind 127.0.0.1 --directory lib/newsletter/templates
```

Open `http://127.0.0.1:3057/` for the three languages or
`http://127.0.0.1:3057/uk-newsletter.html` for the UK draft. The unsubscribe
placeholder does not work in this standalone preview. No email is sent by the
generator or preview server.

UK custom HTML was saved in Brevo template **#9**, named
`Bake Again — UK — Newsletter — Warm Precision`, with business sender/reply-to,
status **Inactive**. ES/EN campaign designs are local only. It is not linked to
an automation or assigned recipients. Its desktop HTML preview preserved the
palette; local UK/ES/EN layouts passed 390/900/1440px without horizontal overflow.
Evidence: `outputs/newsletter/newsletter-design-review.json`,
`newsletter-<locale>-<width>.jpg` and `branded-uk-brevo-preview.jpg`.
This design has not been delivered to Gmail/Outlook; dark mode and provider-added
Free branding still require a separately authorized delivery check.
The owner explicitly deferred unsubscribe testing and remains subscribed.

- `npm run test:newsletter`: disabled/incomplete config, independent locale routing,
  insecure URL and URL credential rejection.
- UK/EN/ES Design Lab examples at 390, 900 and 1440 pixels; production pages must
  contain no newsletter invitation with the default empty configuration.

### Homepage invitation, 2026-10-10

The compact invitation now owns the UK social follow row on the homepage. With
signup disabled, the prior social-only section remains. Recipes use only the inline
invitation. The unfiltered homepage may show the shared invitation Dialog after
45 seconds of visible, focused viewing and reaching the recipe catalogue. Interaction
must be idle for three seconds; focused controls and other overlays defer the prompt.
Seeing the inline invitation suppresses it for that mounted visit.

`bake-again:newsletter:prompt:v1` stores only the local next-eligible timestamp:
30 days after show/dismiss, 180 after provider handoff. It is excluded from account
migration and is not evidence of subscription. If storage cannot be read, automatic
prompting is disabled. No emails or consent state are stored. Design Lab contains
manual, non-persisting previews for UK/EN/ES with disabled external actions.

### Shared page endings, 2026-10-10 follow-up

Home and recipe pages now share the same email-only invitation followed by
SiteFooter. Social links are not repeated in the invitation or a separate follow
section. With signup disabled, no fallback promotion renders; footer links remain.
Header profile links remain a top-level entry point. Automatic modal rules are unchanged.
This supersedes the earlier home-only social row described above.

### Auth email composition (2026-10-10)

`npm run newsletter:prepare` also prepares the auth variant in
`lib/personal/email-templates/`, reusing the campaign layout. It does not send email.
Its account-only copy and Supabase confirmation URL are separate from Brevo DOI.
The existing seven newsletter HTML outputs retain their previous SHA-256 values.
See `docs/architecture/round-2-accounts.uk.md` for hosted status.
