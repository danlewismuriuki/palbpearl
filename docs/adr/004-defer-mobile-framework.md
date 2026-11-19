# Defer mobile framework

**Title:** Defer Flutter, React Native, and native Android until after the mobile offline spike  
**Status:** proposed  
**Date:** 2026-11-19  
**Owner:** TBD

## Context

A future native or cross-platform app must support offline-aware farmer workflows, but requirements are uncertain until an offline spike is run. Choosing Flutter, React Native, or native Android now would pre-empt spike findings.

## Decision

**Do not choose** Flutter, React Native, or native Android yet. Decide the farmer mobile framework **after a mobile offline spike** that exercises sync, storage, and conflict scenarios. Until then, deliver the mobile-first web demo ([001-web-first-demo.md](001-web-first-demo.md)).

## Alternatives considered

- **Choose now from the project brief** — Reduces ambiguity but may mismatch offline and storage needs.
- **Choose on team familiarity alone** — Fast start but weak fit for Kenya connectivity and device constraints.

## Consequences

### Positive

- Framework choice can follow evidence from the spike and updated data model.

### Negative

- No app-store mobile client until post-spike decision and implementation.

### Follow-ups

- Run offline spike; add a new ADR for mobile framework when accepted (not part of the initial eleven).
- Update [../open-questions.md](../open-questions.md) when the spike completes.

## Related

- [001-web-first-demo.md](001-web-first-demo.md)
- [005-defer-backend-db-ai.md](005-defer-backend-db-ai.md)
- [../architecture/data-model-draft.md](../architecture/data-model-draft.md)