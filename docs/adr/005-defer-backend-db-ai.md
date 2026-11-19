# Defer backend, database, and AI

**Title:** Defer backend, database, image storage, and AI provider until demo flows are validated  
**Status:** proposed  
**Date:** 2026-11-19  
**Owner:** TBD

## Context

PalBpearl needs farmer and admin flows proven before investing in production services. Backend framework, database, image storage, and AI provider each imply long-lived cost and operational commitment.

## Decision

**Do not finalise** backend framework, database, image storage, or AI provider until **demo flows are validated** on the mobile-first web demo with mocks ([003-simulate-functionality.md](003-simulate-functionality.md)). Each choice will be recorded in a future ADR when accepted.

## Alternatives considered

- **Select the full stack now** — Enables parallel backend build but commits spend before UX and contract stabilise.

## Consequences

### Positive

- Demo-phase work stays focused on contract, adapter, and UI.
- Provider choices can align with validated data model post offline spike.

### Negative

- Production delivery timelines depend on later ADR cycle and implementation.

### Follow-ups

- Track open items in [../open-questions.md](../open-questions.md).
- Wire real services per milestones in [../architecture/demo-to-production-path.md](../architecture/demo-to-production-path.md).

## Related

- [003-simulate-functionality.md](003-simulate-functionality.md)
- [007-shared-api-contract.md](007-shared-api-contract.md)
- [../architecture/architecture-overview.md](../architecture/architecture-overview.md)