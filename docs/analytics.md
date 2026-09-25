# Basic analytics (Umami Cloud)

Umami website **Bake Again**, EU dashboard. The public website ID and exact production
hostname live in `lib/analytics/umami.ts`; neither is a secret. No runtime key or paid
plan is needed. If the public hostname changes, update both this config and Umami.

The production hostname is `bakeagain.com`. Code and the Umami website settings were
aligned on 25 September 2026, keeping the existing website ID. The former
`chatgpt.site` hostname is excluded. Deployment and a real pageview/event check on
the custom domain are still pending; the previous Sites publication failed.

`SiteAnalytics` loads one asynchronous tracker on production product routes. Umami
owns pageviews, including client-side navigation. Query strings and fragments are
excluded, so recipe quantity changes do not create separate page URLs. Localhost,
preview hosts, Drafts, Design Lab and Do Not Track visitors are excluded.

## Events

| Event | Meaning |
| --- | --- |
| `search_submit` | Search submitted by Enter or button; never the query text |
| `recipe_save`, `recipe_unsave` | Confirmed change in persisted bookmarks |
| `shopping_add` | Ingredients confirmed in local shopping storage; count only |
| `recipe_scale` | Batch multiplier changed |
| `recipe_ingredient_scale` | Valid ingredient quantity edited, on leaving the input |
| `cream_select` | Selected cream changed |
| `cook_open` | Cook Mode link activated |
| `cook_step_complete` | Previously unfinished step marked complete |
| `cook_complete` | Final step completed; not a verified bake-test claim |
| `cook_restart` | User starts again |
| `timer_start` | Timer started or resumed |
| `assistant_open`, `assistant_submit` | Assistant opened or request attempted, not answer success |
| `language_change` | User chooses another locale |

Events carry only canonical recipe IDs, locales and relevant numeric counts/factors.
The page path also identifies the recipe. No search text, notes, questions, shopping
contents, form values, cookies, user IDs, replay or heatmaps are collected by this
integration. The before-send allowlist removes URL parameters, fragments, full
referring paths, arbitrary data and page titles (which can contain search text).
Referrer origin, browser language and screen size remain available to Umami.

Blocked/offline analytics must not interrupt product actions. Up to 20 early events
wait in memory for the script to load, preserving their original page path. There is
no persistent retry queue. Ad blockers, DNT and early navigation can reduce counts;
these are directional usage statistics, not an audit log.

## Viewing and verification

Open Bake Again in Umami to view **Pages**, **Referrers** and **Events**, and choose a
date range. Filter by URL or recipe ID to compare recipe usage. Local testing should
mock `window.umami`; never add localhost to the production hostname allowlist.

After publishing, visit one production recipe and save/unsave it. Confirm its page
path and the two events in Umami. Test activity is real usage data; avoid submitting
artificial bulk events. No data is backfilled for visits before installation.

Run `npm run test:analytics`, typecheck, lint and the production build. Existing
Design Lab examples use the same instrumented controls, but their actions are
excluded from production analytics. Privacy copy is maintained in uk/en/es.
