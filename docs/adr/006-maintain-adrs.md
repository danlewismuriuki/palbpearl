# Maintain ADRs

**Title:** Require an ADR for every significant technology, architecture, or cross-cutting convention decision  
**Status:** proposed  
**Date:** 2026-11-19  
**Owner:** TBD

## Context

PalBpearl spans web demo, future mobile client, mocks, and production services. Informal decisions are hard to find and reverse. Contributors need a single pattern for recording rationale.

## Decision

An **ADR is required** for every **significant** decision about technology, architecture, or cross-cutting conventions. Use [000-adr-template.md](000-adr-template.md), store ADRs under `docs/adr/`, and update [../decisions-log.md](../decisions-log.md) when an ADR is added or its status changes. Process detail lives in [../standards/adr-process.md](../standards/adr-process.md).

## Alternatives considered

- **Informal decision log** — Lightweight but loses structure, alternatives, and consequences.
- **No documentation** — Relies on memory and chat; unacceptable for multi-phase demo-to-production.

## Consequences

### Positive

- Decisions are searchable; supersession preserves history.
- Review checklist can require ADR linkage.

### Negative

- Overhead for small choices; judgement needed on what counts as significant.

### Follow-ups

- Promote ADRs from proposed to accepted through review.
- Never delete superseded ADRs; mark superseded and link forward.

## Related

- [000-adr-template.md](000-adr-template.md)
- [../decisions-log.md](../decisions-log.md)
- [../standards/adr-process.md](../standards/adr-process.md)
- [../standards/review-checklist.md](../standards/review-checklist.md)