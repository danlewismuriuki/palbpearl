# Shared API contract

**Title:** Define and share API contract types from Phase 1, including under mocks  
**Status:** proposed  
**Date:** 2026-11-19  
**Owner:** TBD

## Context

UI and mocks must not drift into incompatible shapes. A future mobile client and production API need the same stable boundary. Principles are described in [../architecture/api-contract-principles.md](../architecture/api-contract-principles.md).

## Decision

Define and publish **API contract types** from **Phase 1**, consumed by the web app and implemented by mocks through the adapter, even before a real API exists. UI code uses contract types only; mocks conform to the contract.

## Alternatives considered

- **Ad-hoc mock data shapes** — Fast to write but breaks when mocks are replaced and prevents shared mobile client.
- **Define contracts later** — Delays alignment and encourages UI coupled to demo fixtures.

## Consequences

### Positive

- Clear migration path from mocks to production API.
- Review can enforce contract-first changes.

### Negative

- Up-front design effort before all entities are final post offline spike.

### Follow-ups

- Evolve contract with reviewed, documented breaking changes.
- Reconcile with [../architecture/data-model-draft.md](../architecture/data-model-draft.md) after spike.

## Related

- [003-simulate-functionality.md](003-simulate-functionality.md)
- [009-mock-boundary-isolation.md](009-mock-boundary-isolation.md)
- [../architecture/api-contract-principles.md](../architecture/api-contract-principles.md)