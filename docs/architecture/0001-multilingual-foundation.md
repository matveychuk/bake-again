# ADR 0001: Multilingual foundation

**Status:** Proposed — awaiting architecture sign-off
**Date:** 2026-09-09
**Owners:** Bake Again product and engineering

## Context

Bake Again launches with English (`en`), Spanish (`es`) and Ukrainian (`uk`). The
recipe schema already keeps one stable recipe identity and reader-facing text in all
three locales. The current site, however, has unprefixed English-only routes, an
English `html` language, and a static `EN` language-control placeholder.

The product brief requires browser-language detection, an immediate manual override,
remembering that override, and language-specific URLs. The UX specification further
requires one stable recipe identity across language versions and stable recipe IDs for
personal state. The implementation must not turn static recipe pages into a
client-rendered language toggle or make an untested translation appear publishable.

## Decision

### Supported locales

The application locale type is `"en" | "es" | "uk"`. It is shared with the existing
recipe locale type; there is no second, divergent locale list. Each locale also has a
BCP 47 formatting tag:

| Application locale | Formatting tag | Display name |
| --- | --- | --- |
| `en` | `en` | English |
| `es` | `es` | Español |
| `uk` | `uk` | Українська |

`uk` is the locale code for Ukrainian. It must not be represented as the country code
`UA` in routes, storage, or APIs.

### URL contract

Every public product page has an explicit locale prefix:

```text
/{locale}
/{locale}/recipes
/{locale}/recipes/{localizedSlug}
/{locale}/recipes/{localizedSlug}/cook
/{locale}/shopping-list             # reserved; not part of this slice
/{locale}/about                     # reserved
/{locale}/privacy                   # reserved
```

The `recipes` segment stays stable in every language. Recipe slugs are localized and
resolved through the stable `recipeId`; a switcher never transforms a slug by string
replacement. For example, it finds the same recipe by ID and then uses
`recipe.slug[targetLocale]`.

An explicit locale in a URL is authoritative for that response. A link to `/uk/...`
stays Ukrainian even if the browser or a saved preference is English. Visiting a
localized link must not overwrite a saved manual preference.

Unprefixed existing routes are temporary compatibility routes. They redirect to a
locale-prefixed canonical URL, preserving query parameters and hashes where possible.
Recipe redirects first resolve the legacy slug to its stable recipe ID, then construct
the current locale's slug. The temporary routes are not canonical or indexable.

While the legacy inventory remains in place, `/{locale}/recipes/{legacyEnglishSlug}`
is accepted only as a draft compatibility route so existing inventory links do not
break during development. It is `noindex`, is not emitted as a canonical or alternate
URL, and the switcher sends an unknown legacy detail to the localized catalogue rather
than carrying that English slug into another locale.

Invalid locale prefixes return `notFound`; they do not silently redirect to another
language.

### Initial locale resolution

Locale is resolved only when an incoming URL has no locale prefix, such as `/` or a
legacy route:

1. Use a valid explicit preference from the `ba_locale` functional cookie.
2. Otherwise parse the request `Accept-Language` header in quality order and choose
   the first supported base language. For example, `es-MX` maps to `es` and `uk-UA`
   maps to `uk`.
3. If no supported browser language is present, use `en`.

`navigator.languages` implements the same matching rule only as a client fallback
when no request-header signal is available. It must not replace the language of an
explicit localized URL.

Browser detection is not an explicit preference and is not saved. A user choice made
in the language switcher is explicit and persists until the user changes it or clears
site data.

### Preference persistence and cookie mirror

The browser-local source of truth is the versioned preferences slice:

```ts
// localStorage key: bake-again:preferences:v1
type PreferencesV1 = {
  schemaVersion: 1;
  locale: "en" | "es" | "uk";
  localeSource: "user";
  updatedAt: string;
};
```

The language switcher writes this value and mirrors only the locale into the
`ba_locale` cookie so the server can choose a locale before React hydrates. The cookie
is deliberately not a general user-data store.

Cookie attributes are `Path=/`, `SameSite=Lax`, `Secure` in production, and a
one-year maximum age. It is readable by the client because the switcher updates it;
it contains only one allow-listed, non-sensitive locale code. If storage or cookies
are unavailable, the site falls back to browser detection and remains usable.

The local preferences slice wins conceptually. The cookie is its server-readable
projection and is refreshed whenever a user makes a manual selection. Clearing site
data clears both values.

### Client storage boundary

No product component accesses `window.localStorage` or `document.cookie` directly.
The implementation introduces a small, typed persistence boundary with:

- SSR-safe default snapshots;
- validation of parsed data before use;
- per-slice `schemaVersion` and migrations;
- safe fallback after malformed JSON, quota errors, or private-browsing failures;
- a subscription that listens to the browser `storage` event for cross-tab updates.

The first slice implements preferences only. The planned keys below are reserved so
future personal features do not need an incompatible rewrite:

```text
bake-again:preferences:v1
bake-again:recipe-memory:v1
bake-again:cook-sessions:v1
bake-again:shopping:v1
```

Later recipe-memory records store stable `recipeId`, `recipeVersionId`, configuration
references, dates, and an optional private note. Shopping items store canonical
ingredient IDs and source lines, not localized names as their canonical value; the
display name is derived from the active locale. Save remains the existing
`Want to bake` concept. A separate Favourite state is out of scope.

### Rendering and content boundaries

Routes read the locale on the server and pass it to locale-aware content selectors and
UI dictionaries. The language switcher is a small client island; there is no global
client-only locale provider that would cause server-rendered recipe content to flash
or change language at the same URL.

Canonical recipe data remains in `content/recipes/*.recipe.ts`. A selector reads a
`LocalizedText` value for the route locale. Shared recipe facts, quantities and
provenance remain language-independent.

`inventory.ts` is temporary English-only card presentation data. Recipe ingredients,
steps and source notes live in individual `*.recipe.ts` files and are read through
`registry.ts`. A page may be exposed in a locale only after its reader-facing content
has an approved localization; it must not silently mix English recipe body copy into
Ukrainian or Spanish pages. The existing recipe `translationState` is part of that
publication gate.

UI copy lives separately from recipe data in typed dictionaries. Locale-aware
formatting uses the platform `Intl` APIs for numbers, dates, decimals and plural
forms. The typography loading strategy must be checked for Ukrainian glyph coverage
before the Ukrainian route is published.

### Language switcher

The header control becomes a documented site component using the existing low-level
menu primitive. It:

- labels each language in its own language;
- exposes the current language in text and with a non-colour selection indicator;
- supports keyboard navigation, Escape, visible focus and a labelled menu;
- preserves the current page when a target localized equivalent exists;
- stores an explicit preference only after a manual selection;
- does not use flags as language identifiers.

The product page, Design Lab example, component documentation and design-system
changelog are updated together when this UI is implemented.

### Metadata and SEO

Each localized route owns its metadata:

- `html lang` matches the route locale;
- canonical URL points to that localized route;
- `alternates.languages`/`hreflang` contains only real localized equivalents;
- title, description, OpenGraph content and Recipe JSON-LD use the active locale;
- the locale-less resolver is not canonical content and is represented as `x-default`
  where appropriate.

Language content is never dynamically replaced at one URL. A translation that is
still a draft is not advertised as a public alternate merely because the schema has a
placeholder string.

## Planned module boundaries

```text
lib/i18n/config.ts              supported locales and BCP 47 metadata
lib/i18n/resolve-locale.ts      pure header/browser matching
lib/i18n/routes.ts              locale-aware route construction and legacy aliases
lib/i18n/messages.ts            typed product UI dictionaries
lib/persistence/preferences.ts  storage validation, migration and cookie mirror
components/site/language-switcher.tsx
app/[locale]/...                localized product routes and metadata
proxy.ts                         locale-less request redirects
```

Exact placement may be adjusted to the Vinext route conventions during implementation,
but the responsibilities above must remain separate. Canonical recipe files must not
import React, browser APIs, routing, or persistence code.

## Tests required for the implementation phase

Focused tests must cover:

1. `Accept-Language` and `navigator.languages` matching, including quality order,
   regional variants, unsupported languages and the English fallback.
2. Route construction from stable recipe ID to localized slug, including legacy URL
   redirects and preservation of search/hash data.
3. Explicit URL precedence over a stored preference.
4. Preference parsing, invalid JSON, schema migration, unavailable storage and
   cross-tab storage updates.
5. Switcher keyboard operation and a manual selection updating both persistence
   representations.
6. `html lang`, canonical URLs, `hreflang` and localized metadata.
7. Layout review at 390 px, 900 px and 1440 px for long English, Spanish and
   Ukrainian labels.

The test runner choice is deferred until implementation. If no project-native runner
is available, add the smallest compatible test dependency rather than introducing a
general state-management or i18n framework solely for this slice.

## Consequences

This decision preserves SEO-correct, shareable localized pages while keeping personal
state local until there is a demonstrated need for accounts or cloud sync. It adds
route and content-adapter work before the full multilingual launch, but avoids an
unmaintainable client-side translation layer and protects recipe provenance from
language-related shortcuts.

## Implementation gate

This ADR is the architecture deliverable for the first phase. The next phase may add
the modules, routes, redirect behavior, language switcher, metadata and focused tests
described above only after explicit confirmation. It does not include a wholesale
recipe migration, Saved, Baked, Cook Mode persistence, or shopping-list functionality.
