# Repository strategy demo to production

**Title:** One repository, demo-first and production-bound, with isolated demo-only code  
**Status:** proposed  
**Date:** 2026-11-19  
**Owner:** TBD

## Context

Teams sometimes use a throwaway demo repository and rewrite for production, duplicating history and contracts. PalBpearl intends to move from demo to production in one lineage while still allowing mocks to be deleted.

## Decision

Use **one repository**, **demo-first** and **production-bound**. Demo-only code is **isolated** (mocks package and demo helpers per [009-mock-boundary-isolation.md](009-mock-boundary-isolation.md)) so it can be **removed** without rewriting UI, routing, or contract types that survive production.

## Alternatives considered

- **Throwaway demo repo with fresh production repo later** — Clean separation but loses ADR history and encourages contract drift.
- **Build production directly with no demo phase** — Avoids mock removal but delays validated UX and depends on unfinished stack choices.

## Consequences

### Positive

- Single decisions log and ADR trail from demo through production.
- Milestone “mocks removed” is explicit ([../architecture/demo-to-production-path.md](../architecture/demo-to-production-path.md)).

### Negative

- Discipline required so demo shortcuts do not leak outside the mocks boundary.

### Follow-ups

- Enforce mock boundary in CI when code exists.
- Document module layout when packages are scaffolded in Phase 1.

## Related

- [001-web-first-demo.md](001-web-first-demo.md)
- [009-mock-boundary-isolation.md](009-mock-boundary-isolation.md)
- [../architecture/demo-to-production-path.md](../architecture/demo-to-production-path.md)