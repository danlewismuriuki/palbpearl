# Mock boundary isolation

**Title:** Demo-only code in a mocks package; UI uses contract types via one adapter  
**Status:** proposed  
**Date:** 2026-11-19  
**Owner:** TBD

## Context

Inline mocks in components tempt quick demos but couple UI to throwaway data and block clean production cutover. Architecture and coding standards already state the adapter rule; this ADR records the decision.

## Decision

All **demo-only code** lives in a **mocks package**. The **UI consumes only contract types** and calls a **single data-client adapter**; it **never imports mocks directly**. The adapter selects mock or real data source via configuration.

## Alternatives considered

- **Mocks inline in components** — Lowest initial friction; highest cost when replacing data source and highest risk of mock-only fields in UI.

## Consequences

### Positive

- Matches [../architecture/mock-boundary.md](../architecture/mock-boundary.md) and enables planned import-boundary checks.

### Negative

- Extra package and adapter work before first screen ships.

### Follow-ups

- Implement lint or CI import boundary in Phase 1 code.
- Delete mocks package at production milestone.

## Related

- [003-simulate-functionality.md](003-simulate-functionality.md)
- [007-shared-api-contract.md](007-shared-api-contract.md)
- [008-repo-strategy-demo-to-production.md](008-repo-strategy-demo-to-production.md)
- [../architecture/mock-boundary.md](../architecture/mock-boundary.md)
- [../standards/coding-standards.md](../standards/coding-standards.md)