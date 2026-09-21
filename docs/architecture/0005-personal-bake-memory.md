# ADR 0005: Personal bake memory

**Status:** Accepted and implemented
**Date:** 2026-09-20
**Owners:** Bake Again product and engineering

## Context

Cook Mode already persisted progress, its timer, completion and a private note per recipe
version. That session was not a discoverable recipe memory: recipe detail and Saved did
not read it, the note disappeared from view during a repeat cook, and adjusted
configurations shared one session key with the Tested base.

`Save` means Want to bake and must remain independent from a completed bake. A personal
completion must also remain distinct from editorial Tested evidence.

## Decision

Store the latest completed record for each exact recipe version and configuration in a
separate browser-local slice:

```text
bake-again:bake-memory:v1
```

Each record contains the canonical recipe ID, recipe version ID, base or adjusted
configuration, completion date, one private note and its update date. Notes are bounded to
2,000 characters. Parsing validates known recipes, dates, adjustment values and units;
malformed records are ignored.

Completing the final Cook Mode step records Baked automatically. It does not add the
recipe to Want to bake and does not change recipe provenance. The completion field writes
as it changes and exposes saving, saved and failed states. Recipe detail shows the latest
record. Starting Cook Mode again clears the new session note but shows the previous note
before step one.

Cook Mode session keys retain their existing base key for compatibility and append a
canonical configuration key for adjusted sessions. This prevents progress and notes for a
calculated configuration from overwriting the Tested base session.

## Consequences

Personal bake memory remains private to one browser without accounts, device sync,
sharing or server backup. The first version stores one latest note per exact
recipe/version/configuration, not a chronological history. A future account migration can
lift these validated canonical records without persisting localized recipe text.
