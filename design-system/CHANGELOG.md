# Design system changelog

## 2026-10-12 · Hosted newsletter Turnstile

- Extended the existing compact Brevo signup variant with native Cloudflare
  Turnstile before submit, using separate Managed widgets for UK/ES/EN.
- Retained the existing form palette, copy, privacy links, language lists and DOI.
  Updated the newsletter manifest and external-example contract.
- Reviewed 390/900/1440px in each locale without overflow and with visible privacy
  keyboard focus; automatic client success observed. Submission and delivery remain
  pending. Evidence: `output/activation/brevo-turnstile-review.json`.

## 2026-10-11 · Reusable mobile recipe PDF package

- Saved the approved crepes v5 PDF treatment in `pdf-recipes.uk.md` and linked it
  from project instructions. Recipe-specific quantities, timings and evidence stay
  in each recipe's data rather than becoming template defaults.
- Added `templates/recipe-pdf/` with a data schema, blank input, reference PDF,
  licensed fonts and layout configuration, plus `scripts/recipe-pdf/build.py`.
  Reuses existing semantic colours and typefaces; no website UI changed.
- Verified 7-step and 3-step layouts, a paginated 18-row ingredient table, visible
  guidance labels and preserved cooking tools. Rendered every page at 390px and
  inspected detailed layouts at 900/1440px. Text and links survive optimization;
  actual phone delivery remains pending. Evidence: template `verification.json`.

## 2026-10-10 · Payhip hosted commerce adaptation

- Applied existing semantic tokens to Payhip storefront and digital checkout, including native buttons, fields, text wordmark and focus outlines. No new tokens or website components.
- Added generated CSS source and a local provider Design Lab with UK/ES/EN long-copy fixtures in `media/commerce/payhip-test-2026-10-10/styling/`.
- Verified two product pages and checkouts at 390/900/1440px; primary button contrast 5.45:1. Legacy download page unchanged.

## 2026-10-10 · Short-page footer placement

- The shared account-aware page shell now fills the viewport and places SiteFooter
  at the bottom on short pages, including an empty shopping list. Long pages keep
  the footer after their content in normal document flow.
- Updated the Design Lab navigation preview and page-shell guidance.

## 2026-10-10 · Account email rate-limit feedback

- Observed a successful signup followed by a repeated request within 60 seconds.
  Auth 429 now explains waiting and checking inbox/spam in UK/EN/ES, without
  exposing provider errors or suggesting that the earlier request failed.
- Added the notice to the existing account Design Lab example.
- UK/EN/ES wrapping passes at 390/900/1440px; typecheck and lint pass.

## 2026-10-10 · Consistent home and recipe page endings

- Removed the social row from the newsletter and the separate social follow section
  from recipe endings. Both now use the same email-only invitation and SiteFooter,
  with a single social row in the closing area.
- Disabled newsletter configuration renders no replacement promotion. Header links
  and the editorial About follow section retain their existing roles.
- Updated Design Lab with the shared newsletter/footer composition in UK/EN/ES.
- Verified Home and a published recipe in all three languages at 390/900/1440px:
  no overflow, no social links inside email invitations, no extra follow sections,
  one footer pair in UK and none in EN/ES. Typecheck, targeted lint and build pass.
  Evidence: `outputs/newsletter/page-endings/review.json`.

## 2026-10-10 · Homepage newsletter invitation and delayed dialog

- Combined the enabled home email invitation and social follow promotion into one
  compact editorial strip. Reduced title scale, retained concise copy and made the
  email link the sole primary action; social links use the existing quiet variant.
- Extended the existing Dialog with a food photograph and UK/EN/ES invitation,
  visible dismissal, focus management and reduced motion. Added manual Design Lab
  previews; actual subscription remains on the configured hosted form.
- Added a 45-second active-home-view gate, recipe visibility, interaction/overlay
  deferral and local repeat suppression. Seeing the inline block cancels that visit's
  prompt. Preference is independent of account data and subscription status.
- Verified UK/EN/ES inline and dialog layouts at 390/900/1440px, automatic
  display, focus containment and Escape. Typecheck, targeted lint, five newsletter
  tests and build passed. Evidence: `outputs/newsletter/home-invitation/`.
- Production enablement and provider setup are unchanged; no website publication.

## 2026-10-10 · Compact newsletter notice

- Replaced the large native GDPR block and illustration with a short 14px Text
  notice in all three hosted forms, at the owner’s request. Consent, withdrawal,
  Brevo processing and privacy link remain; purpose and language appear above.
- Recorded full DOI consent separately so email templates and Design Lab previews
  remain unchanged. Nine responsive layouts passed; no subscription or email sent.

## 2026-10-09 · Email-only newsletter forms

- Removed language and consent controls from all three hosted signup forms at the
  owner's explicit request. Retained visible consent/privacy/withdrawal copy and
  DOI; language is routed through form-specific lists, without prechecked consent.
- Aligned versioned UK/ES/EN DOI text and local Email Design Lab with the forms.
  Updated localized privacy copy; existing tokens, site CTA and form URLs remain.
- 18 hosted/DOI layouts passed at 390/900/1440px, keyboard focus and build passed.
  No form submit, email send, contact move, paid service or website publication.
  This revision still needs an authorized delivery/consent-record test.

## 2026-10-09 · Simplified newsletter invitation

- Removed provider handoff and confirmation/unsubscribe helper lines from the
  enabled UK/ES/EN invitation at the owner's request. Title, short benefit and
  existing outline CTA remain; the inert Design Lab note stays visible.
- Hosted signup retains the actual consent and unsubscribe information. Saved
  UK/ES/EN hosted forms with the existing Georgia fallback, primary action colour,
  on-accent text and control radius; native Brevo controls remain.
- Website invitation and hosted forms passed all three locales at 390/900/1440px
  without overflow. Build passed; no submit, email send or site publication.

## 2026-10-09 · Newsletter email palette draft

- Extended the existing email composition with a campaign variant: cream page,
  warm white surface, brown editorial typography, terracotta CTA and subtle footer.
  All colours and spacing resolve from existing semantic tokens; no new palette.
- Added generated UK/ES/EN campaign HTML and a separate local Email Design Lab.
  Checked 390/900/1440px and keyboard focus; this is browser layout verification.
- Saved the UK custom HTML as inactive Brevo template #9 with business sender/reply-to.
  No additional email, activation or site publication; unsubscribe testing deferred
  at the owner's request. Introductory copy is a palette review draft.

## 2026-10-09 · Brevo newsletter preparation

- Prepared localized hosted signup/unsubscribe copy and DOI email templates.
  Email colours, spacing and font fallbacks derive from existing semantic tokens.
- Improved provider link/help contrast and applied page/surface/text tokens through
  Brevo's editor. Native provider controls and its RGPD illustration remain.
- Kept the existing invitation and inert UK/ES/EN Design Lab examples unchanged;
  the local connection stays disabled pending domain, sender, CAPTCHA and delivery.
- Added three-language privacy copy locally; no website publication or email send.

## 2026-10-09 · Recipe utilities and newsletter connection point

- Added quiet Share and Print/PDF actions using the existing Button. Sharing uses
  native device sharing with a labelled, copyable link fallback; cancelled sharing
  stays silent. Links contain only the resolved recipe, language, cream and quantities.
- Added a clean printable recipe view using the same resolved content, ingredient
  list, method and evidence components. It retains calculated/suggested provenance,
  chosen cream, geometry, source version and recipe URL; private notes stay private.
- Added browser-local recently viewed recipes with compact RecipeCards and a clear
  action. The compact card supports h3 when nested below a section h2. History stores
  at most 12 published IDs; shows three other recipes with translated catalogue copy.
- Added a provider-hosted newsletter invitation, absent until explicitly configured
  for the current language. The Design Lab example is disabled and collects no data.
- Added three-language Design Lab examples and documented the new component contracts.

## 2026-10-07 · Social follow invitation after independent review

- Applied the owner's review decision: social promotion is Ukrainian-only. English
  and Spanish render no social profile links, follow invitation or empty mobile row.
- Header links now use the shared outline Button; footer links use its quiet link
  variant. Icons and full platform names remain visible with 44px minimum targets.
- Removed the extra header invitation line; named links align with the navigation,
  while the editorial section carries the explicit reason to follow.
- Moved the mobile social row outside the sticky header. Only compact navigation
  stays visible while reading; anchor offsets and menu height reflect that layout.
- Extended SocialLinks with an editorial “Печімо разом” follow variant before the
  Home/About footer and after recipe content, with equal primary platform links.
- Added allowlisted social_profile_open analytics by platform, placement and locale,
  preserving DNT, production-only collection and private-data filtering.
- Updated Design Lab to show the Ukrainian flow and the social-free es/en variants.

## 2026-10-07 · Social profile navigation

- Added shared Instagram/Facebook profile links using the existing primary Button,
  with written names at every width and a localized Follow along invitation above.
  The stronger call to action follows the owner's review of the initial icon treatment.
- Simplified desktop Shopping list navigation to a 44px bag icon with a localized
  accessible name and tooltip; retained the written name in the mobile menu.
- Omitted the invitation line in the mobile header after review, preserving both
  named social buttons and the footer invitation.
- Kept social links outside the mobile menu and made the shared header sticky at all
  widths. Extended the Design Lab navigation example with the production footer.
- Preserved semantic tokens, accessible platform names and 44px keyboard/touch targets.

## 2026-10-04 · About status explanation

- Replaced the repeated testing link, eyebrow and heading with one Recipe statuses
  heading and a short scope introduction in UK/EN/ES. Definitions precede the
  adaptation note; status words, icons and evidence requirements remain explicit.
- Kept incoming `how-we-test` links working. Replaced the heavy divider with the
  subtle border token and reduced compact spacing to 32px on either side.
- Added the shared production section to the About Design Lab example.

## 2026-10-04 · Tablet step photo alignment

- Aligned recipe step photos with the text gutter at 561–900px using `space-12`.
  Kept the existing desktop gutter and flush mobile alignment. Updated the Design
  Lab photography guidance and verified the shared Napoleon recipe reference.

## 2026-10-04 · Family story for the About page

- Extended the editorial About page with original family photographs, localized age
  captions and a concise first-person story in Ukrainian, Spanish and English.
- Added a 40–64px story-title token and the shared photo composition to Design Lab.
- Reused the existing plum-cake photograph and recipe links; preserved the testing
  anchor and adaptation-specific status explanations.

## 2026-10-04 · Landscape Napoleon photography

- Reframed eight author photos to horizontal 4:3 and retained the already-horizontal
  dough-ball photograph. All nine now fill their frames with cover fitting.
- Reviewed each composition for visible food and preparation details; updated the
  shared Recipe detail / Cook Mode example and media preparation outputs.

## 2026-10-04 · Mobile reading and cooking rhythm

- Added semantic 32px mobile section and 40px recipe title roles. Tightened mobile
  catalogue spacing to 32px before the heading and 24px before the cards.
- Gave Ingredients a separate mobile heading row, including existing shopping-list
  actions. Added the crowded state to Design Lab.
- Made long Tested evidence expandable while preserving the full explanation and
  keeping Calculated/Suggested scope visible. Shortened profiterole yield copy while
  retaining walnut-size guidance in geometry and instructions.
- Made mobile cream choices compact, with an explicit comparison disclosure.
- Moved Cook contextual tools after the instructions and emphasized timing. Retained
  ingredient sections in the drawer and exposed every timing phase, including both
  profiterole oven stages. Added localized timer examples and adapter regressions.

## 2026-10-04 · Author process photos and divided ingredients

- Added an optional contain fit for process images to preserve portrait details in
  the existing photo frame. Added the Napoleon author photo to Design Lab.
- Cook ingredient rows now support a canonical fraction of the current batch amount,
  keeping flour split between stages consistent with scaled instructions.
- Updated the Napoleon reference to the approved seven dough steps, author photos,
  250 g butter, 24 cm template and 200°C. The new version has its own Tested evidence.

## 2026-10-03 · Desktop method rhythm

- Placed Questions beside the title on wider screens, eliminating the standalone
  action row for steps without time. Restored terracotta timing labels on desktop;
  retained the compact mobile metadata row and its secondary timing colour.
- Reduced method-item vertical padding from 24px to 16px. Updated the shared
  Design Lab examples and responsive component contract.

## 2026-10-03 · Method metadata hierarchy

- Kept step numbers terracotta while changing time and temperature to secondary
  text at weight 600, separating navigation from practical metadata. Questions
  retain primary text, an icon and underline. Updated the Design Lab reference.

## 2026-10-03 · Compact mobile method steps

- Extended `RecipeStepContent` with a numbered variant and optional metadata action.
  Phones group number, time and Questions above a full-width title. Wider screens keep
  the number gutter; missing time or questions leave no empty placeholder.
- Shortened the visible question action while preserving a full accessible name and
  44px target. Added all four optional-content combinations to Design Lab in UK/EN/ES.

## 2026-10-03 · Distinct method heading and Cook action

- Renamed the full recipe method heading to the localized “Method” label with a
  concise step count. The guided “Cook step by step” button now has its own distinct
  purpose. Updated the Design Lab example in all three languages.

## 2026-10-03 · Compact recipe hero

- Moved the recipe return link into the hero beside Save, removing the separate
  breadcrumb row. Omitted the category label on phones so the title and practical
  recipe facts start higher. Updated the Design Lab navigation example.

## 2026-10-03 · Clear Cook Mode controls

- Reduced the Cook Mode header to navigation, recipe identity and evidence on mobile.
- Moved the AI entry to each current step, including steps without prepared questions.
- Kept the screen-awake control visibly labelled beside the working step and added
  active and failure feedback. Updated its production example in Design Lab.

## 2026-10-03 · Cook step number alignment

- Centred the numerals in Cook Mode's active and inactive progress circles.
- Added the production all-steps list to Design Lab's Cook tools example for
  responsive review.

## 2026-10-03 · Clear recipe and step questions

- Grouped the method's Cook entry with a quieter, explicitly recipe-wide question
  action. The method heading and actions now form one row on wide screens and a compact
  stack on phones.
- Moved recipe-detail step questions beneath the instruction and checkpoint while
  retaining the contextual heading action in Cook Mode. Clarified the step trigger
  labels and the AI composer scope in Ukrainian, English and Spanish.
- Updated the interactive Design Lab examples and recipe reading guidance.

## 2026-10-03 · Mobile recipe ingredients

- Moved the shared Ingredients heading ahead of quantity controls in the mobile recipe
  reading order and kept its shopping action in the same row at standard phone width.
- Added a compact, accessible quantity disclosure above the ingredient rows. It opens
  for invalid configurations and summarizes the selected scale and evidence when
  collapsed; desktop retains its side-by-side layout.
- Updated the shared Design Lab recipe example and recipe planning guidance.

## 2026-10-03 · Compact mobile discovery

- Replaced the two-row mobile header with a sticky single-row header and a labelled
  navigation disclosure. The language switcher remains visible beside it.
- Added a one-row mobile hero variant of the shared recipe search form. Results and
  drafts keep the full search form; search URLs and query behaviour are unchanged.
- Added the shared header and compact search variant to Design Lab.

## 2026-09-29 · Custom questions across the recipe collection

- Removed the Napoleon-only custom-question restriction from Recipe Detail, Cook Mode
  and the server service. Published recipes use their canonical locale, version,
  selected portion, step IDs and validated cream selection.
- Added a server-only adapter for source-backed recipe records, preserving missing
  information and explicit Tested / Calculated / Suggested evidence. Draft publication
  states are not promoted. Existing quotas and verification remain in force.
- Whole-recipe questions include the method. Repeated facts are referenced in a compact
  model envelope; the bounded input estimate is reserved by the existing budget guard.
- Updated the shared Design Lab step-help examples to show the typed composer.

## 2026-09-27 · Shared link preview

- Added a food-led 1200 × 630 sharing card based on the existing Napoleon photograph
  and semantic brand colours.
- Added localized Open Graph image descriptions and a large sharing image to public
  page metadata while retaining recipe-specific photographs.
- Declared the sharing image's `image/webp` type in metadata. A dedicated
  `/share-image.webp` Worker route serves the prepared asset with that type
  because Sites static delivery used a generic type.
- Versioned the image URL so messaging apps request the newly published asset.
- Added the production preview to the Design Lab colour section.

## 2026-09-27 · Repository cleanup

- Removed unused starter UI components, the detached palette-review switcher and
  an unused Cook Mode wrapper after checking imports from routes, tests and Design Lab.
- Removed the switcher's inactive global CSS; production tokens and active component
  variants remain unchanged. Design Lab and automated tests remain maintained sources.
- Removed a nested paragraph from the Design Lab plan-ahead example that caused
  a React hydration error; the example now uses the shared component correctly.
- Historical audits, creative working files and unused media are no longer repository
  inputs. Analytics event contracts remain in `lib/analytics/umami.ts` and its tests.

## 2026-09-27 · Bake Again browser icon

- Replaced the blue template favicon with a compact `B.` mark based on the wordmark
  and existing semantic colours; linked it explicitly in site metadata.
- Added the production icon to the Design Lab and documented its small-size use.

## 2026-09-27 · Pre-publication configuration recovery

- Shared the existing unavailable Cook treatment with a recipe-detail variant and explicit base-recipe recovery for unsupported parameters and geometry.
- Kept return navigation usable before and after hydration with native anchors.
- Updated multilingual Design Lab examples for scaled custard eggs, per-cake assembly and quantified sugar alternatives in shopping.
- Preserved semantic tokens, status icons and session identities.

## 2026-09-26 · Impersonal multilingual recipe copy and metadata

- Standardized reader-facing UK/EN/ES copy and food descriptions; removed public
  image-origin overlays while retaining internal source and media provenance.
- Added five missing Spanish recipe versions and synchronized carrot-cake steps
  with the Ukrainian source. Recipe quantities and evidence status are unchanged.
- Kept unavailable Cook Mode guidance accurate for missing cream selections and
  used localized editorial gaps instead of legacy source-record notes.
- Documented the image-caption rule and updated the Design Lab video example.
- Added localized SEO fields, canonical/hreflang, Recipe JSON-LD and sitemap/robots.
  Adjusted configurations and personal workflow pages do not become search recipes.
- Checked layouts at 390, 900 and 1440 px across the three languages.

## 2026-09-26 · Localized recipe discovery order

- Applied the approved 15-recipe editorial order separately for Ukrainian, Spanish
  and English, with a varied opening selection and stable responsive reading order.
- Collections preserve localized order; search relevance remains primary. Local
  drafts and editorial inventories retain source order and publication stays explicit.
- Added live first-six catalogue examples for all three languages to Design Lab.

## 2026-09-26 · Universal chocolate glaze

- Reframed the shared chocolate glaze as a universal component with 10 minutes of
  active work and a canonical finished yield of 120 g.
- Split the method into combining and low-heat warming steps, removed the standalone
  tip and added one generated instructional photograph to each step.
- Extended source-backed yields to support a finished mass in grams while preserving
  localized reader-facing labels and calculated scaling.

## 2026-09-26 · Concise butter-softening technique

- Removed the Suggested badge and external-source footer from the practical technique
  guide without replacing them with a recipe-evidence claim.
- Clarified that butter softens faster when cut into small cubes on a plate and specified
  a heatproof glass or ceramic bowl in Ukrainian, English and Spanish.

## 2026-09-26 · Apple-fritter editorial review

- Published the reviewed apple-fritter recipe with its recorded active time, yield and
  difficulty; returned the Easter bread and apple charlotte to local drafts.
- Reduced the method to three practical actions, removed advance-planning and editorial
  notes, and kept the one-large-apple-per-person rule beside the recipe facts.
- Replaced the author-specific evidence sentence with concise tested copy and added a
  practical generated photograph to each of the three method steps.

## 2026-09-26 · Plan-ahead technique guidance

- Moved pre-start technique help into the standard plan-ahead item: clock icon, written
  `Keep in mind` label and inline guide link, without a nested tip background.
- Added the shared `RecipePlanItem` to the production recipe and Design Lab examples.

## 2026-09-26 · History-aware recipe return

- Related recipe and reusable component links remain canonical instead of encoding one
  parent recipe in a shareable URL.
- A consumed, short-lived same-tab marker makes the visible back link return through
  native history when another recipe opened the page. Same-site referrer is a secondary
  signal; direct, shared and external visits fall back to the localized catalogue.

## 2026-09-26 · Consistent primary action colour

- Returned Cook entry and restart to the shared terracotta default, matching next,
  finish, search and shopping actions. Removed the unused chocolate Button variant.
- Retained chocolate for text and the editorial Napoleon feature. Updated the
  production Design Lab example and documented a single primary-button colour.

## 2026-09-26 · Lighter Cook navigation

- Returned the wide Done, next / Finish action to the shared terracotta button variant.
  Retained its size, radius, keyboard focus and behaviour; the compact Cook entry stays
  chocolate. Updated the production Button example and colour-role documentation.

## 2026-09-26 · Concise recipe geometry

- Prevented concise recipe quantity controls from repeating a geometry label already
  included in the yield.

## 2026-09-26 · Ingredient list dividers

- Draw separators only between ingredient rows in the shared full and compact lists.
  Removing the final separator avoids a double rule inside bordered Cook panels.
- Extended the Cook tools Design Lab example with the production per-step ingredient
  panel alongside its existing full-list drawer.
- Verified uk/en/es at 390/900/1440px, single-row and full lists, the Cook drawer and
  Design Lab. Typecheck and lint passed.

## 2026-09-26 · Shared actions and recipe spacing

- Consolidated standard action styling in the existing Button component: shared 4px
  radius, 44px minimum target, wrapping 14px labels, focus and disabled states.
- Added semantic chocolate emphasis tokens for focused cooking; search and shopping
  retain terracotta. The homepage feature keeps its editorial-card shape.
- Migrated search, shopping controls, Cook entry/progress/timer/restart, cream change,
  bake-memory repeat, empty-collection and assistant review actions; Design Lab uses
  production buttons.
- Aligned quantity controls and fields with the control-radius token. Kept recipe
  panels and photography square and Save circular.
- Reduced the method's desktop top padding from 80px to 48px, heading-to-rule gap
  from 45px to 32px and step padding from 30px to 24px; compact screens start at 32px.
- Verified shared geometry in uk/en/es at 390/900/1440px, 200% text, no-JavaScript
  styling/navigation, shopping confirmation/focus return, search, Cook progress and
  timer controls. Typecheck, lint, production build and 136 assistant tests passed.

## 2026-09-26 · Recipe navigation and cooking entry

- Replaced tab-like hero links with left-aligned “Jump to ingredients” / “Jump to
  steps” anchors and down arrows. Both recipe sections remain visible in reading order.
- Moved the main Cook entry to the written method and renamed it “Cook step by step”,
  with a short explanation. Preserved cream selection and configured Cook URLs.
- Extracted the existing navigation and entry into shared production components and
  added Ukrainian, English and Spanish examples to the Design Lab.
- Verified all three locales at 390/900/1440px, 200% mobile text, native anchor focus,
  visible keyboard focus, cream selection and navigation without JavaScript.

## 2026-09-25 · Butter-softening guide

- Added localized technique pages and contextual help using the existing tip and Drawer
  primitives; native links retain standalone navigation and keyboard focus return.
- Added explicit technique references to the relevant steps of seven recipes, including
  conditional butter choices. References survive cream composition and Cook Mode.
- Added a multilingual Design Lab example and shared Suggested provenance for the
  externally sourced technique; recipe evidence remains adaptation-specific.
- Verified page/drawer layout in uk/en/es at 390/900/1440px, keyboard containment and
  focus return, Cook Mode, JavaScript-free link navigation and 200% mobile text.

## 2026-09-25 · Complete method before cream selection

- Keep all host-recipe assembly steps and photos visible before a cream is selected.
  Selection adds cream preparation and ingredients without revealing previously hidden steps.
- Added the author's two-hour refrigerator tip to the final sponge-roll step and
  updated the Design Lab example to exercise unselected cream composition.

## 2026-09-25 · Concise card headings

- Shortened the Napoleon, Easter bread, fruit roll and marbled-cookie catalogue names;
  recipe-page headings retain their explicit gluten-free adaptation names.
- Centre titles beside Save and place facts 8px below the complete header, avoiding
  excess title spacing while retaining the bookmark's independent 44px target.
- Added the shortened headings to the shared Design Lab card examples.

## 2026-09-25 · Sponge-roll assembly guidance

- Split cooling, jam, cream and final decoration into focused recipe actions with
  matching photos. Reused existing tip and single-photo components; no new tokens.
- Added a multilingual Design Lab assembly example: essential action stays in the
  body while the tip explains the curved sponge and cream-free closing edge.
- Recipe overview now includes baking and cooling in its planning note; cream
  composition keeps all dependent assembly steps after preparation of the chosen cream.

## 2026-09-25 · Aligned catalogue cards

- Share photo, title, facts, flour and footer tracks within each tablet/desktop row;
  mobile cards retain natural height, and translated titles remain fully visible.
- Place time and difficulty in stable label/value columns for easier comparison.
- Keep every collection visible as a compact sand chip with 4px padding and gaps,
  preserving 14px text and independent 44px-high touch targets.
- Extend Design Lab with the reported Ukrainian card rows and multilingual/draft cases.

## 2026-09-24 · Consistent step photography

- Removed the full-width single-photo treatment: one photo now matches an individual
  sequence frame on desktop, tablet and mobile in recipe detail and Cook Mode.
- Restored simple ordinal photo labels (`1`, `2`, `3`), without numbering single photos.
  Mobile retains the next-photo peek and keyboard-scrollable sequence; accessible labels
  keep the total count.
- Added single/two-photo comparisons in both variants to Design Lab.

## 2026-09-23 · Responsive UX review applied

- Unified selected quantities across recipe overview, ingredients, shopping and Cook Mode; preserve configuration and cream when switching language. Adapted quantities use Calculated, while an unchanged base retains its own evidence. Invalid amounts require correction.
- Tightened mobile recipe heroes, cream choices and quantity controls; added ingredient/method jump links and a quieter secondary Cook link. Catalogue cards use equal 3/2/1-column desktop/tablet/mobile grids.
- Standardized Saved on the compact RecipeCard variant and gave EvidenceBadge a shared default visual treatment. Removed duplicated ingredient dividers and expanded single step photographs.
- Added visible search focus, 44px controls, skip navigation, wrapping at 200% text and localized Saved copy.
- Cook tools now use a bounded side panel with a visible Close action. An active timer remains reachable from other steps.
- Added compact cards and a working Cook drawer to Design Lab; added localized information about browser storage and assistant context.

## 2026-09-22 · Published banana pancakes

- Published the Tested banana-pancake recipe with a concise hero: the summary now
  describes texture and key ingredients without repeating the title or Tested status.
- Replaced the generated final-step cue with two horizontal crops of the author's real
  cooking photographs and retained the previous hero alongside a more accurate v3.

## 2026-09-21 · Shared cream pages and published profiteroles

- Moved all four reusable cream routes onto the same `InventoryRecipeDetail` composition
  as the main recipes, including hero photography, Tested status, quantity adjustment,
  ingredients, Cook Mode and step photography. Removed the redundant cream-only page.
- Kept creams as linked supporting recipes rather than discovery cards; they omit only
  the irrelevant flour row and catalogue Save control.
- Published the reviewed profiterole record to Recipes and kept éclair spellings as
  search aliases. Updated the fruit-roll hero and method so a quarter of the selected
  cream is reserved for the top, followed by fruit, berries or chopped nuts.

## 2026-09-21 · Reviewed apple charlotte and plum upside-down cake

- Published both author-confirmed recipes as Tested with a five-egg base batch, 20 minutes
  of active work, 50 minutes total time and an explicit double-batch note for a full oven
  tray. Eggs are the scaling anchor in both recipes.
- Kept the apple charlotte butter-enriched and folded the floured apple pieces through the
  batter. Kept the plum sponge butter-free, placed the plums cut side down and added the
  immediate hot inversion that reveals the fruit layer on top.
- Replaced both working covers with recipe-accurate natural-home heroes and added only the
  decision-useful ribbon-stage, apple-distribution and plum-arrangement process images.

## 2026-09-21 · Reviewed fruit sponge roll

- Published the Tested fruit sponge roll with 30 minutes of active work, a yield of one
  roll and easy difficulty. Total elapsed time remains open because cooling varies; the
  dependency is stated once in planning instead of being invented.
- Reduced the host recipe to four practical steps, preserved the ribbon-stage, doneness
  and warm-rolling cues, and removed repeated photo captions and the duplicated cream
  formula.
- Linked whipped mascarpone cream as the recommended filling and vanilla buttercream as
  the alternative. Thick blueberry or raspberry jam remains flexible, with optional fresh
  fruit in the filling and on top.
- Replaced the unreviewed author cover with a generated natural-home hero checked against
  the actual baked roll and real examples; retained only three decision-useful process
  images in the published flow.

## 2026-09-21 · Profiteroles and reusable creams editorial pass

- Renamed the working choux recipe to Profiteroles across reader-facing titles and
  metadata while retaining éclair spellings as curated search aliases and the stable
  internal recipe identity.
- Added a visible Working recipe label to unpublished recipe heroes while keeping the
  exact baked profiterole base separately marked Tested.
- Replaced the mismatched éclair cover with a generated natural-home photograph of
  round filled profiteroles and retained four step images only for useful dough states.
- Added active and elapsed times, yield and difficulty to all four Tested cream recipes;
  cooling is counted in elapsed time, not active work.
- Added the flour-free Recipe overview variant for standalone creams and removed
  preparation-only steps such as chilling an empty bowl or separately softening butter.

## 2026-09-20 · Reusable cream recipe model

- Added four Tested cream records with localized ingredients, steps, checkpoints and
  practical tips: mascarpone whipped cream, vanilla egg custard, eggless vanilla custard
  and vanilla buttercream.
- Added host-owned cream options so a finished recipe lists compatible cream recipe IDs
  and exactly one recommended cream without duplicating compatibility state on the cream.
- Set vanilla egg custard as the recommended cream for éclairs and retained the other
  three creams as confirmed alternatives.

## 2026-09-20 · Reviewed gluten-free Napoleon

- Published the repeatedly baked Napoleon recipe with Schär Mix B as the quantity-adjustment
  anchor and removed draft-only publication notes from its detailed recipe layout.
- Confirmed the custard formula at four whole eggs, 400 g sugar, 170 g corn starch,
  100 g butter and 24 g vanilla sugar; fixed the nut finish at 150 g walnuts and 50 g
  flaked almonds.
- Consolidated planning into two practical notes: enough parchment for 12 layers and the
  full chill/rest schedule. Total elapsed time stays intentionally open because the cake
  matures for 12–24 hours and is best served the next day.
- Restored six existing process photographs to the canonical recipe and added generated
  images for the divided dough, rolled and baked layers, finished custard, assembly and
  accurate six-layer hero.
- Reworked the generated Napoleon set after reviewing real homemade examples: pastry and
  crumbs are less uniform, the cream layers are thinner, the kitchen light is natural and
  the assembly image now uses only round 28 cm layers.

## 2026-09-20 · Personal bake memory

- Separated personal `Baked` memory from Save / Want to bake. Completing Cook Mode now
  records the date, exact recipe version and base or adjusted configuration locally.
- Made the private completion note explicitly auto-saving with saving, saved and failure
  states. Return to recipe and Cook again no longer imply that the note may be discarded.
- Added the latest bake and note to recipe detail and surfaced the previous note before
  step one of a repeat cook. Added the matching Personal state example to Design Lab.

## 2026-09-20 · Author waffle photography

- Replaced the cottage-cheese waffle generated hero and process imagery with seven
  selected author photographs shared by recipe detail and Cook Mode.
- Grouped the photos into three concise before/after sequences: blending the base,
  mixing the batter and filling/baking/serving the waffles. Near-duplicate frames were
  intentionally omitted.
- Updated localized image descriptions to identify the visible berry variation without
  changing the Tested base recipe or inventing an unrecorded berry quantity.

## 2026-09-20 · Prune-cake editorial pass and step imagery

- Published the completed prune-cake record in Recipes and removed its remaining
  pre-publication note; bake-test evidence remains a separate status.
- Published recipes without recorded bake-test evidence now omit the draft-only
  working-record explanation instead of implying that they are still unpublished.
- Simplified the prune-cake hero, ingredient notes and ten-step method, moving the two
  bake durations into concise step metadata and recording the confirmed hot-glaze method.
- Replaced generic cream and glaze images with a coherent five-image generated series:
  sliced layers, prune cream, coated cake cubes, mound assembly and the finished cake.
- Kept concise working-recipe publication guidance once beside ingredients instead of
  repeating the same editorial note again at the end of the page.
- Suppressed the generic “as needed” quantity when an unquantified ingredient already
  provides a more specific note such as “to taste”.

## 2026-09-20 · Prune-cake method clarified

- Completed the working prune-cake method in the existing concise recipe layout:
  60 active minutes, one 26 cm cake and medium difficulty.
- Recorded the two-stage 200°C bake, three-layer assembly, 150 g prunes, sugar-based
  cream and walnut-or-pecan finish. Total elapsed time remains open until the cooling
  duration is confirmed; publication and evidence status remain unchanged.

## 2026-09-20 · Cocoa spoon conversion

- Added the shared unsweetened-cocoa reference of 5 g per tablespoon, rounded for
  practical use from the cited 42 g per half cup reference. The new prune-cake
  transcription therefore keeps 5 tbsp cocoa as a 25 g canonical quantity.

## 2026-09-20 · Reviewed paska

- Published the author-confirmed Tested paska in the existing concise layout with
  30 active minutes and a yield of three medium paskas. Quantities are unchanged.
- Set a conservative, explicitly approximate total of 290 minutes, including
  proofing, baking and cooling. Overlapping fruit soaking and active mixing are not
  added twice; mould dimensions remain unspecified.
- Reduced twelve steps to nine, removed editorial notes and repeated photo captions,
  and retained useful yeast, dough, proofing and doneness cues and linked timers.

## 2026-09-20 · Reviewed sponge cake

- Published the Tested sponge cake in the existing concise layout: 15 active minutes,
  60 total minutes, one sponge cake and easy difficulty.
- Replaced the planning banner with preparation in the first step; preserved greasing
  only the tin bottom, gradual sugar addition and gentle folding in four concise steps.
- Removed source-measure commentary and repeated captions/checkpoints. Kept separate
  sugar quantities for whites/yolks and labelled the small-egg equivalent.
- Added all three language versions and the existing 40–50 minute baking timer.

## 2026-09-20 · Reviewed banana bread

- Published banana bread using the existing concise layout and recorded Tested evidence.
  Set 30 active minutes and 90 total minutes; the author confirmed 40 minutes at 200°C
  in a rectangular tin. Dimensions remain unspecified rather than invented.
- Reduced the method to five steps. Oven/tin preparation starts the first step;
  dry ingredients, add-ins and filling share one step. Removed repeated checkpoints,
  image captions and editorial gaps while preserving fill level and skewer cues.
- Localized the complete method in all three languages and retained canonical quantities,
  per-step ingredients and separate baking/in-tin cooling timers.

## 2026-09-20 · Whole-card recipe navigation

- Made every non-control area of a recipe card open the recipe. Save and collection
  controls remain separate, keyboard-reachable targets above the card link.

## 2026-09-20 · Reviewed crinkle cookies

- Published the author-confirmed Tested version with 30 minutes of active work and no
  citrus ingredient. Preserved the 3–4 hour chill and 8–10 minute per-tray baking range;
  full elapsed time remains unknown because cooling and tray count are not recorded.
- Reduced the method to seven concise steps without repeated checkpoints or photo
  captions. Preserved fast shaping, full sugar coating and moist-crack doneness cues.
- Extended the existing concise layout to detailed recipes. Their adapter now preserves
  per-step ingredients and explicit phase-to-step timer links; Design Lab includes the
  edited cookies alongside waffles and crepes.

## 2026-09-20 · Recipe card visual hierarchy

- Emphasized time and difficulty values, retaining localized labels and adding
  terracotta clock/chef-hat icons. Increased flour-value contrast without adding weight.
- Gave collection links subtle sand surfaces, more separation, and underlined
  terracotta hover treatment; retained 44px targets and visible keyboard focus.
- Updated the shared multilingual Design Lab example and card language attributes.
  All colours, spacing and metadata sizes use existing semantic tokens.

## 2026-09-20 · Reviewed carrot cake

- Reused concise recipe reading for the author-confirmed Tested carrot cake and
  published it in Recipes. Recorded 30 active minutes, one cake and medium difficulty.
- Set carrots (200 g) as the quantity anchor without changing the ingredient formula.
- Kept advance raisin soaking as one planning note; moved oven/pan preparation to the
  first step. Removed editorial suggestions and duplicate cues/captions, preserving
  seven canonical steps, per-step quantities and the 35–40 minute baking timer.

## 2026-09-20 · Reviewed dumplings and recipe publication

- Applied the existing concise layout to Tested lazy dumplings: six short steps,
  caption-free photos and preserved rest/boiling timers. Recorded 45 active minutes,
  100 dumplings and medium difficulty, with 450 g cottage cheese as the scaling anchor.
- Removed packet counts and cooking water from the ingredient list. Recorded the
  author's recipe-specific tapioca measure (7 g = 1 tbsp); the global table is unchanged.
- Explicitly published waffles, crepes and lazy dumplings into Recipes, removing them
  from local Drafts while keeping publication separate from adaptation evidence.

## 2026-09-20 · Reviewed crepe copy

- Applied the concise recipe layout to author-confirmed Tested crepes in all three
  languages. Four canonical steps now match Cook Mode; the rest timer stays attached
  to the combined milk-and-rest step.
- Replaced the planning banner with a phase-linked note under total time and displayed
  the recorded 28 cm pan beside the base quantity. Removed editorial notes and repeated
  photo captions; retained the thick-base technique and visible flipping cues.
- Removed the contradictory oil spoon equivalent; canonical oil remains 25 g.

## 2026-09-20 · Concise waffle recipe

- Recorded the author's confirmation of the exact waffle base as Tested, independently
  of publication. Added an opt-in concise reading layout without editorial draft notes.
- Combined the dry-mixing steps, removed repeated checkpoints and made image captions
  optional while retaining descriptive alt text in recipe detail and Cook Mode.
- Reduced quantity-control copy, added the canonical Calculated badge only for changed
  quantities, and kept explicitly fixed pinch measures unchanged. Added multilingual
  production-component examples to the Design Lab.
- Added Ukrainian discovery aliases including «гофре» without duplicating the dish title.

## 2026-09-20 · Gram-first spoon conversions

- Added one gram-first spoon-weight table for recurring dry ingredients. Author-measured
  Schär Mix B Bread, tapioca starch, baking powder and granulated sugar values now drive
  recipe equivalents; referenced values remain labelled separately.
- Migrated managed recipe quantities so grams are canonical and teaspoons or tablespoons
  are secondary cooking aids. Ambiguous ingredient alternatives and unconfirmed cup
  measures remain explicitly unresolved instead of receiving a false gram value.

## 2026-09-20 · About and recipe testing

- Added a localized editorial About page for the Bake Again family story and testing
  method, with canonical Tested, Calculated and Suggested status treatments.
- Linked the homepage trust card directly to the testing section and documented the
  editorial story-page pattern.
- Added the localized About destination to the primary site navigation.

## 2026-09-20 · Publication and local drafts

- Split public published recipes from local-only unpublished working records.
- Guard draft, recipe and Cook Mode routes with development plus loopback-host checks.
- Cards now show title, explicit time basis, difficulty, flour and collection links.
- Remove duplicate category eyebrows and repeated Tested labels from public cards.
- Reuse the production card for multilingual Design Lab examples.

## Unreleased

- Simplified reusable-cream choice cards: Tested is now stated once in the introduction,
  a chocolate Recommended label crosses the preferred card's top edge without reserving
  an empty row on its peers, radios sit at the top right, and left-aligned recipe links
  align across the card row. Added the production selector to Design Lab.
- Reduced the shared Recipe and Cook Assistant drawer title to the dedicated 24px
  contextual-title token, keeping long localized headings subordinate to recipe content.
- Moved About to the end of primary navigation and kept the four public destinations on
  one mobile row at 390px in English, Spanish and Ukrainian when local Drafts is absent.
- Added a subtle semantic boundary to recipe cards so collection links remain visibly
  attached to the recipe above in one-column catalogues.
- Aligned each pre-start clock with its “Keep in mind” heading and indented the supporting
  copy consistently across responsive layouts.

- Kept the shared Save control circular beside long recipe titles by preventing flex
  shrink, and aligned its saved state with the Design Lab's filled bookmark silhouette.

- Added localized recipe collections to the inventory and homepage: Breakfast, Every day,
  Celebration, With cottage cheese and Batter on hand. Collection links now filter the
  catalogue and every recipe card names its applicable collections.

- Refined the shared recipe overview: active time first, total time and optional planning
  guidance below, a compact status badge with aligned evidence text, and horizontal
  rules only. Product and Design Lab now render the same component in three languages.
- Added phase-linked planning notes to the recipe timing model and shortened Napoleon's
  yield to two cakes; layer counts remain in its description and yield details.

- Added one normalized recipe-overview model for all 17 recipes: time, yield, difficulty
  and flour, with explicit nulls for unknown facts.
- Replaced the large evidence panel with a compact evidence row and removed equipment and
  geometry from the recipe hero overview.
- Grouped total and active time into one fact, kept flour in a full-width row and added
  the responsive Recipe overview reference to the Design Lab.

- Replaced the Easter-bread placeholder with the complete Paska 2.0 working recipe:
  four ingredient groups, twelve Ukrainian and English method steps, practical tips and
  observable checkpoints. Marked the exact softer adaptation as Suggested until it is
  bake-tested, preserving adaptation-specific provenance.
- Added seven localized Paska 2.0 process photographs to recipe detail and Cook Mode,
  covering the decision-critical yeast, dough, proofing, baking and cooled-crumb states.

- Replaced the banana-fritter placeholder with a tested banana-pancake adaptation using
  Schär Mix B Bread. Added six concise Ukrainian steps, practical tips, observable
  checkpoints, localized facts, a new cover and five step photographs while retaining
  explicit publication gaps for the flour weight and any liquid adjustment.
- Added five localized process photographs to the sponge-cake recipe and Cook Mode,
  covering the two whipped mixtures, both folding stages and transfer to the long form.

- Prepared the sponge cake for the shared Ukrainian recipe flow with all six original
  steps, separate sugar quantities for whites and yolks, source-backed tips and
  checkpoints, localized practical facts and photo-verified corrected quantities. Kept
  explicit gaps for the long form dimensions, doneness cue and total timing.

- Added localized step photography to the fruit sponge roll and the incomplete prune-cake
  working record. The prune recipe now uses the shared Ukrainian recipe composition,
  separates the partially transcribed cake, cream and glaze ingredients, and keeps Cook
  Mode unavailable until the unreadable core method is confirmed.

- Prepared the fruit sponge roll for the shared Ukrainian recipe flow with six
  source-backed steps, localized ingredients, one observable checkpoint, three practical
  tips and explicit gaps for the oven temperature, rolling method, fruit quantities and
  total time.

- Moved the Napoleon product route onto the shared recipe-detail composition. Detailed
  recipes now carry their Tested evidence into that shared surface, while the canonical
  source retains all 19 Ukrainian method steps. Added concise Ukrainian action titles,
  locale-aware duration labels and localized review notes to the shared presentation.
  Removed the former Napoleon-only recipe renderer, adjustment/assistant wrappers and
  styles; the Design Lab reference now exercises the shared recipe page as well.

- Reworked the Crinkle Cookies method into concise titled actions with quantities,
  practical tips and observable checkpoints. Added six localized instructional photos,
  exposed detailed-recipe `mediaIds` through the shared Recipe Detail and Cook Mode
  adapter, and resolved the powdered-sugar quantity as 100 g.

- Added the shared `RecipeStepContent` structure for recipe detail and Cook Mode: the
  contextual assistant action now sits with the heading, practical tips always precede
  instructions, and checkpoints remain after the action they verify. Added the compact
  warm-background tip treatment, aligned checkpoint labels and messages in one row and
  updated the Design Lab example.

- Rebuilt Cook Mode as a four-screen working flow for crepes while preserving all five
  canonical recipe steps. Added one-action `Done, next` navigation, completion and private
  notes, versioned session restoration, 15/20-minute timers that survive navigation, an
  all-steps drawer, an ingredients drawer and an optional Screen Wake Lock control.
- Consolidated recipe and Cook rendering on shared `StepMediaSequence`,
  `RecipeIngredientList` and `RecipeStepGuidance` components with documented variants.
  Removed route-specific photo renderers, made multi-image rails keyboard-focusable and
  retained the approved 3-up / 52% tablet / 82% mobile responsive sequence.
- Reduced Cook step headings and tightened its work-column rhythm at laptop and mobile
  widths. Crepes now expose concise localized action lists, step-specific ingredients and
  observable checkpoints without adding decorative photos to simple actions.
- Added semantic Cook title and content-width tokens plus the shared keyboard focus-ring
  colour to the machine-readable and CSS token sources.

- Fixed the shared Cook Mode adapter so source-backed recipes retain localized step copy
  and ordered step photography. Also localized the shared Cook Mode navigation, progress,
  callout, timer and media accessibility labels in English, Spanish and Ukrainian.

- Made the source-backed `Use what I have` anchor recipe-specific; crepes now calculate
  from the available egg count rather than flour, with a localized whole-item unit.

- Added shared structured recipe facts for source-backed yield, geometry and timing, and
  aligned the pre-start guidance row so its clock and label sit together across locales.

- Localized the source-backed recipe scaling control in English, Spanish and Ukrainian,
  made it available on every inventory recipe page and formatted scale factors for the
  active locale. Recipes without a supported numeric anchor retain an explicit localized
  locked state.

- Reworked shopping into one unambiguous path: read-only recipe ingredients open a shared
  modal drawer for selection, with compact headings, select/clear actions, explicit
  alternative choices, water deselected by default and a sticky counted confirmation.
  Added explicit duplicate-batch handling, View list/Undo confirmation, persistent browser
  guidance, localized recipe links and conditions, bought-item cleanup, single-item Undo,
  confirmed Clear all and a denser responsive shopping page.
  Added the `layout.shoppingContent` token for the focused shopping work column.

- Consolidated recipe discovery into the home page: the Recipes navigation item now
  matches the Bake Again wordmark destination, and former catalogue URLs redirect home.

- Simplified Shopping-row removal to a standalone terracotta trash icon with a 44px
  accessible hit area, no white circular surface and clearer separation from quantity.

- Replaced the ambiguous ingredient amount pair with canonical `base` and optional
  `equivalent` quantities. Shopping uses only `base`; name-only items remain explicit.

- Reduced step-photo cards at tablet widths to a compact, nearly two-up horizontal
  sequence, while preserving the three-up desktop grid and the larger mobile scroll card.
- Replaced the ambiguous ingredient `Add all` interaction with an explicit, two-step
  shopping-list review. This earlier dialog treatment was superseded by the shared drawer
  and read-only ingredient-list pattern above.
- Standardized recipe-detail headings on the Napoleon two-line treatment: a dark,
  explicit gluten-free descriptor followed by the terracotta italic dish name in all
  three locales. Added the shared heading to the Design Lab.
- Made the gluten-free adaptation explicit in every localized recipe-detail heading while
  keeping catalogue-card titles concise, and removed the duplicate source title beneath
  working-record headings.
- Aligned recipe step numbers with their titles while keeping optional timing metadata
  in a separate row above the heading across source-backed and detailed recipe layouts.
- Split ingredient quantity display into a required primary measure and an optional,
  visually quieter secondary equivalent. Migrated source-backed recipes and added the
  paired-measure state to the Design Lab.
- Added a localized ingredients-only variant for translated source-backed recipes, so
  reviewed quantities remain visible without exposing untranslated adjustment controls.
- Extended the step media sequence to source-backed recipe pages with localized labels,
  alternative text and captions. Verified the three-image layout at 390/900/1440px.
- Assistant release audit: preserve Close focus on open, during loading and after
  nested action review; announce loading once; localize offline/network/JSON errors
  and avoid duplicate error announcements. Updated the shared Design Lab example and
  component contract.
- Prevent the assistant header from clipping the composer at 200% text size: use a
  compact header and complete-drawer scrolling when text-relative width is limited.

- Hardened the contextual assistant with shared question/history limits, a localized
  missing-runtime disabled state, signed anonymous safety sessions, server throttling,
  total deadlines, stable error mapping and content-free operational telemetry. Added
  a 45-case en/es/uk offline eval gate with 100% required critical-safety pass rate.

- Added the `displayCyrillic` typography token and locale-aware Literata display font for
  Ukrainian, avoiding browser fallback in headings. Updated the home promise, supporting
  copy and search text in Spanish and Ukrainian; added Spanish headline spacing for the
  italic accent line. Checked the responsive hero copy at 390px, 900px and 1440px.

- Added controlled assistant action review for `open-scaling` and `add-shopping-items`,
  with explicit confirmation, canonical quantities/evidence, ingredient-choice radios,
  cancellation and a no-write multilingual Design Lab example. Checked at 390/900/1440px.

- Added the shared contextual assistant drawer for Recipe Detail and Cook Mode, including
  real API submission, bounded history, request cancellation, localized lifecycle states,
  structured evidence rendering and modal keyboard behavior.
- Added the `layout.assistantDrawer` token and a live Design Lab assistant example.
- Localised the evidence badge contract: icon, written status and explanation are now
  locale-aware while the evidence-state semantics remain unchanged.
- Clarified the earlier distinction between preparation and shopping selection. The
  preparation-checkbox pattern was later removed from recipe pages in favour of one
  shopping-selection surface.
- Unified the Ingredients heading and ingredient-row primitives across detailed recipes
  and source-backed working records.
- Standardised product and Design Lab checkbox states on `BakeCheckbox`.

## 1.0.4 — 2026-09-09

- Added documented anonymous personal-state patterns for Save, Shopping rows,
  ingredient-choice review and practical empty states.

## 1.0.3 — 2026-09-09

- Documented the Cook Mode entry and unavailable-source state. Recipe pages now use the
  same explicit action whether the archived source supports step-by-step cooking or only
  preserves an incomplete record.

## 1.0.2 — 2026-09-09

- Added the documented language-switcher pattern: native language names, explicit
  selection state, keyboard menu behaviour and locale-specific navigation.

## 1.0.1 — 2026-09-08

- Recipe adjustment now treats baking size as an independent constraint and combines it
  with either batch scaling or scaling from an available ingredient.
- Compacted the adjustment title and reset action so they fit on one line.

## 1.0.0 — 2026-09-07

- Approved Warm Precision / Review applied as the visual foundation.
- Established cream, warm-white, linen, chocolate, cocoa and terracotta semantic roles.
- Defined Newsreader and Manrope typography roles.
- Established Tested, Calculated and Suggested evidence states.
- Added baseline layout, spacing, photography, accessibility and localisation rules.
- Added an explicit, opt-in dark semantic mode for future product validation.
- Tightened the 390px homepage hero so food and search enter the first viewport.

## 2026-09-20 — Working catalogue search

- Connected GET search queries to ranked catalogue results, combining collection filters.
- Added canonical ingredient, multilingual title/category/collection matching, curated
  dish aliases and word forms, prefix matching and limited typo tolerance.
- Reused the shared search form in the homepage and Design Lab, with retained input,
  result counts, empty-result guidance and wrapping for long search headings.

### 2026-09-25 — Recipe components and author cake media

- Added fixed recipe-part composition and linked standalone glaze/cream pages using
  the shared recipe detail; full method remains inline in the host cake.
- Extended the existing step media sequence with optional author video (native
  controls, muted initially, inline, no autoplay), documented in Design Lab.
- Added a distinct label for author photographs with AI-edited backgrounds/plates.

## 2026-09-25 — Basic analytics

- Shared recipe, search, language, shopping, Cook Mode and assistant controls now emit
  named Umami events. Visual treatment, keyboard behavior and provenance are unchanged.
- Existing Design Lab examples exercise the same controls; Design Lab and local visits
  are excluded from collection. No new tokens or visual variants.
- Privacy content explains basic analytics in Ukrainian, English and Spanish.
- Event semantics and the data allowlist are documented in `docs/analytics.md`.

## 2026-09-25 — Production media pipeline

- Source-quality recipe imagery now lives outside `public` and remains versioned in
  GitHub. Production builds generate referenced WebP delivery assets automatically.
- The generated set caps width at 1800 px, removes metadata, omits unused source files
  and enforces a 64 MiB media budget. Image content, crop and alt text are unchanged.

# 2026-09-26 · Final plum recipe editorial treatment

- Added optional suppression of the hero image-origin overlay while retaining source
  metadata. Empty evidence explanations render only the existing status badge.
- Optional ingredients use parentheses. The Ukrainian concise Design Lab example now
  uses the final plum recipe, with its badge-only overview and optional xanthan.
- Removed redundant preparation notes and checkpoints from the plum recipe; clarified
  sugar allocation and kept only useful technique/readiness guidance.

## 2026-09-26 · Prune cake author bake and photographs

- Replaced the old transcription with the author's actual 65 g cocoa / 70 g condensed
  milk bake, the 700 g combined cream base and the confirmed 200°C, 30 + 20 minute bake.
- Reused the existing Before you start, tip and checkpoint components with concise
  instructions in Ukrainian, English and Spanish. No new visual variant or token.
- Replaced synthetic illustrations with six edited author process photos and a
  linen-table hero; the preparation kitchen is used only for process imagery.
- Kept author spoon weights local to the recipe and shared chocolate glaze unchanged.
- Added an optional source revision ID, shared by reading/shopping and Cook Mode,
  so previous bake sessions do not silently attach to changed quantities and timers.

- Prune cake clarification: corrected tested tin to 24 cm and method to two layers with edge trimmings; shortened evidence and hid photo notes using the existing content setting. Added two process photos; no new UI variants.

## 2026-09-26 · Recipe note wording

- Renamed the bake-memory eyebrow to “Your recipe note” and updated its Ukrainian
  and Spanish translations. The Design Lab example now uses the same wording.

## 2026-09-27 — release audit fixes

- Keep evidence specific to optional recipe + cream combinations, including scaled
  versions, and expose the localized badge in Cook Mode.
- Share canonical localized method content and explicit quantity scaling with Cook Mode.
- Add localized 404 recovery using existing page and button patterns.
- Let mobile Cook navigation allocate natural widths and wrap actions at enlarged text;
  reserve proportional bottom space and keep header evidence readable.
- Add all-language release state examples to Design Lab; preserve existing tokens.


## 2026-09-27 — re-audit follow-up (D01, R01, R02)

- Render configured method steps on recipe detail, matching the ingredients and Cook Mode.
- Block unresolved Napoleon quantities/geometry with a localized explanation, preserving
  the requested URL instead of silently starting a Tested base configuration.
- Render the requested Cook configuration from the initial HTML, before hydration.
- Make prune-cream and apple-fritter notes valid at every scale without changing base
  quantities, ratios, IDs or stored data. Clarify the cream-selector documentation.
- Add the multilingual scaling-consistency Design Lab example and production-render
  regression checks to both the pull-request workflow and manual release gate.

## 2026-09-27 — Recipe-backed step questions

- Audited every canonical step: 27 recipes, 165 steps, 128 question/answer pairs in
  UK/EN/ES; 45 simple steps intentionally omit local help.
- Extended the shared assistant drawer with instant prepared answers, written source
  labels, answer focus, and a distinct typed-AI composer where supported.
- Removed generic suggested prompts; prepared help follows scaling, selected creams
  and grouped Cook steps without inheriting Tested status.
- Added multilingual Design Lab examples and source-change regression checks.

## 2026-09-27 · Assistant abuse protection

- Added localized custom-question allowance and deferred verification to the shared drawer.
- Kept prepared answers unlimited and available during AI/verification outages.
- Reused existing retry, composer and status styles; documented the Design Lab example.

## 2026-10-04 · Quieter site navigation

- Kept only the text underline for the active navigation destination.
- Moved Shopping list to a quiet trailing utility link with a trailing bag icon; the mobile menu uses a subtle divider and aligned labels.
- Updated the shared Design Lab header example and navigation contract.


## 2026-10-05 — Tea setting in cake photography and sharing preview

- Promoted the reviewed author Napoleon photo with ivory linen, glass teapot and porcelain cup; matched the backgrounds of the prune and celebration cakes without changing recipe facts.
- Updated the sharing image and Design Lab example to v4. A versioned `/share-image-v4.webp` crawler route serves prepared WebP with its explicit media type; the earlier route remains an alias. Recipe links use their respective new catalogue photos.
- Original photographs and previous source assets remain available; only referenced delivery files enter the media bundle.

## 2026-10-09 — Phase C local account components

- Added token-based account fields, collection editor, conflict/import/deletion states
  and quiet sync notice using the shared Button; localized uk/es/en examples in Design Lab.
- Distinguished on-device save from confirmed cloud sync. Guest recipe/Cook layouts and
  adaptation provenance remain unchanged. External login remains gated until verified.

## 2026-10-10 — Account confirmation email

- Extended the existing email composition with a branded UK/ES/EN auth variant.
- Added inert Auth Email Design Lab examples and signup locale metadata.
- Newsletter and DOI generated output remains byte-for-byte unchanged.

## 2026-10-10 — Simple account-only saves

- Added an in-place sign-in gate for personal saves, preserving selections/drafts.
- Removed guest import, retry controls and routine sync indicators from the UI.
- Moved collections to Saved; simplified My account and kept data controls folded.
- Added show-password/autofill and minimum 8 without composition rules.
- Verified UK/ES/EN at 390/900/1440; raised the provider minimum from 6 to 8.

## 2026-10-10 — Account and personal navigation review

- Move Shopping and Account to the header utility group; add a shared-dropdown avatar
  menu with native destination links and sign-out. Compact navigation begins at 1120px;
  mobile language selection moves into Menu, keeping shopping/account directly available.
- Compose Account from visible email, practical destination links, security, data/privacy
  and sign-out. Chevron disclosures identify password/deletion controls. Keep recovery
  independent of personal-data availability and reset hidden deletion confirmation.
- Give guest auth modes explicit headings, contextual explanations and focus handling.
  Use neutral Close in the gate and consistent guest personal-page headings/loading.
- Reuse these production sections in UK/EN/ES Design Lab fixtures. Existing semantic
  tokens cover all new composition; account avatars extend the documented round marks.
- Verification: typecheck, lint, production build (including media preparation) and all
  47 personal-data tests passed. Browser QA covered signed-in and isolated guest views
  in UK/EN/ES at 390/900/1440px without horizontal overflow, avatar-menu navigation,
  keyboard dismissal/focus return, mobile language selection, auth-mode heading focus,
  guest Saved/Shopping, and clearing deletion confirmation on collapse. Design Lab's
  long fictional email wraps at 390px. Existing sign-in was preserved; no password
  change, email delivery, data deletion or new authentication was submitted.

## 2026-10-10 — Simplify account settings

- Remove the account data/privacy section, including export and bulk-deletion controls.
  Remove the corresponding availability claim from privacy copy in UK/EN/ES.
- Move sign-out to a shared, accessible ghost icon Button at the right of the account
  heading; reuse AccountHeading in the Design Lab. Keep the existing sign-out handler
  and pending-save protection.
- Persistent browser authentication remains enabled (localStorage, persistSession and
  automatic token refresh); no application-level session deadline is introduced.
- Verified typecheck, lint and production build (144 prepared media files, 30.12 MiB).
  Signed-in UK/EN/ES layouts pass at 390/900/1440px; the UK guest layout passes the
  same widths and has no sign-out control. The sign-out icon has a visible keyboard
  focus ring. Existing login survives fresh page loads; no credentials were submitted.
- Read-only hosted Supabase verification: session lifetime and inactivity timeout are
  both 0 (never), single-session enforcement is off, and access-token expiry is 3600s.

## 2026-10-10 — Payhip receipt and customer library

- Add token-derived `account.css` and a library example to the external-provider Design Lab. Publish the library skin and receipt wordmark/UK subject and body.
- Configure both trial download pages through Beta Content Editor with UK guidance and optimized delivery files. The final download frame does not inherit library CSS; retain its native controls.
- Verify both actual downloads by SHA-256 and 390/900/1440 widths. New receipt email-client rendering and new-copy phone opening/saving remain unverified.

## 2026-10-12 — Reel / Story food-first approved

Approved by Sasha: expanded food area, compact copy, soft feathered header-to-photo edge on every scene, larger gluten-free badge and horizontal stamp-to-badge opening. Reusable Swift component, JSON parameters and transparent PNG sequence saved in templates/instagram-reels. Separate 9:16 Story export is now the default. Media Design Lab example: media/instagram/templates/reels-food-first-v1/review.html. Web components and carousel patterns unchanged.

## 2026-10-12 · Recently viewed section width

- Give RecentRecipes an explicit available width within the shared flex page shell,
  capped by the existing page-width token. Inline-size containment no longer
  collapses the heading, Clear button and compact recipe cards into a narrow column.
- Keep viewing history browser-local and independent of account saves. The existing
  UK/EN/ES Design Lab examples reuse the corrected section; no tokens changed.
- Verified the real home section in UK/EN/ES at 390/900/1440 CSS px without
  page, section or card overflow; existing compact-card fixtures also wrap.

## 2026-10-12 · Account email request completion

- Extend AccountFields with a focused Check your email completion screen after
  successful signup/recovery requests. Show the requested address, localized
  next steps and inbox/spam guidance; remove the sending form and submit button.
- Offer explicit Back to sign in and Use another email actions. The password input
  unmounts after submission. Recovery copy does not disclose account existence.
- Guard running account actions synchronously against double submits; errors and
  rate limits keep their feedback without claiming delivery.
- Add inert signup/recovery completion examples in UK/EN/ES to the Account Design Lab.
- Verified 18 completion layouts (2 requests x 3 locales x 3 widths), real recovery
  request/delivery, removed submit form, focused heading and both return actions.

## 2026-10-12 · Optional Reel badge letter spacing

- Extend the existing GlutenFreeBadge component with optional configuration `letterSpacing`; omit it to preserve the approved default. Keep motion, glyph-bound centering and overflow checks.
- Document an IG-011 review variant using the existing Manrope Bold 700 font, 44 px, 1.2 px tracking and 24 px extra separation before the food image. No new global visual approval or changes to the default JSON/PNG overlay.
- Add the variant to the Media Design Lab. Verified 180 decoded frames, full playback, controls and both review/lab layouts at 390/900/1440 px.


## 2026-10-12 · Password recovery and service emails

- Extended the account form with a dedicated verified recovery state, known email,
  matching new-password fields and a completion view. Reuses existing tokens,
  Buttons and identity treatment; Design Lab includes all three languages.
- Added the localized recovery email variant to the existing token-derived email
  generator. Confirmation and recovery links verify a one-use token on the
  account page, including when opened in another browser. Invalid links offer a
  new request instead of silently presenting normal login.

## 2026-10-12 · Password update feedback

- Reused the recovery and account settings forms with localized, actionable password
  errors. An unchanged password now asks for a different password in both fields;
  provider error text and credentials never enter consumer copy.
- Added the different-password reminder and unchanged-password alert to the shared
  UK/ES/EN Design Lab recovery examples. Existing tokens and controls are retained.
- Supabase Auth logs confirmed the owner’s failed update at 18:05:12 UTC returned
  422 because the new password matched the previous one. A successful owner retry
  and subsequent sign-in remain required before activating production accounts.
- Verified UK/ES/EN at 390/900/1440px without overflow; 55 personal-data and
  auth regression tests passed, including password error classification/privacy.
