# Simulate functionality

**Title:** Use mocks, seed data, and canned AI for the demo  
**Status:** proposed  
**Date:** 2026-11-19  
**Owner:** TBD

## Context

Production backend, image storage, and AI services are not finalised ([005-defer-backend-db-ai.md](005-defer-backend-db-ai.md)). Stakeholders still need an end-to-end demo of registration, submission, guidance, and admin views.

## Decision

**Simulate functionality** for the demo using mock API responses, seed data, and canned AI output behind the single data-client adapter. Mocks must conform to the shared API contract ([007-shared-api-contract.md](007-shared-api-contract.md), [009-mock-boundary-isolation.md](009-mock-boundary-isolation.md)).

## Alternatives considered

- **Build real backend and AI first** — More realistic but delays UX validation and depends on unresolved provider choices.
- **Use a third-party AI service immediately in the demo** — Adds integration and cost before flows are stable; provider choice is still deferred.

## Consequences

### Positive

- Demo can ship without production infrastructure.
- Contract and UI mature before irreversible backend spend.

### Negative

- Risk that mocks oversimplify latency, failure modes, and AI variability.

### Follow-ups

- Plan mock removal milestone per [../architecture/demo-to-production-path.md](../architecture/demo-to-production-path.md).
- Replace canned AI when AI provider ADR is accepted.

## Related

- [005-defer-backend-db-ai.md](005-defer-backend-db-ai.md)
- [007-shared-api-contract.md](007-shared-api-contract.md)
- [009-mock-boundary-isolation.md](009-mock-boundary-isolation.md)
- [../architecture/mock-boundary.md](../architecture/mock-boundary.md)