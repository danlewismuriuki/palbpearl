# Architecture overview

Status: Draft — awaiting review  
Owner: TBD

## Purpose

No application code exists in this repository yet. This document describes the **intended shape** of PalBpearl for Phase 1 and beyond so that implementation, mocks, and future production services align before code is written.

## Layered model

PalBpearl is organised in layers. Data flows downward through explicit boundaries; UI never reaches around the adapter into mock or production backends directly.

```text
UI (mobile-first web)
        ↓
Single data-client adapter
        ↓
Shared API contract (types and operation boundaries)
        ↓
Data source (mocks in the demo phase; real API later)
```

### UI (mobile-first web)

The first deliverable is a **mobile-first web** experience for farmers and staff admin views. Visual and interaction conventions live in [../design/design-conventions.md](../design/design-conventions.md).

### Single data-client adapter

All reads and writes from the UI go through **one adapter** that implements contract operations and selects the active data source via configuration. See [mock-boundary.md](mock-boundary.md).

### Shared API contract

The **shared API contract** defines types and the surface area of operations (not wire format details chosen here). The web app and, later, a mobile app consume the same contract package. See [api-contract-principles.md](api-contract-principles.md).

### Data source

In the demo phase, the adapter targets **mocks** (canned responses, seed data). In production, the same adapter boundary targets a **real API** once decided by ADR. The contract remains the stable face the UI depends on.

## Planned Phase 1 modules (not created yet)

Phase 1 documentation and implementation anticipate these repository modules. **They do not exist yet:**

| Module | Role |
| --- | --- |
| Web app | Mobile-first farmer and admin UI |
| Shared contract package | Types and operation boundaries shared by clients |
| Mocks package | Demo data source behind the adapter |

Packaging layout and tooling will be fixed when code begins and supporting ADRs are accepted.

## What is deliberately undecided

The following are **deferred, to be decided by ADR**:

- Mobile framework (native or cross-platform app after the web demo)
- Backend framework and service layout
- Database and persistence technology
- Local storage and on-device persistence strategy
- AI provider and RAG design
- Image storage and delivery
- Authentication provider
- Notifications (channels and infrastructure)
- Hosting and deployment targets
- Testing tooling and CI gates (beyond principles in [../standards/coding-standards.md](../standards/coding-standards.md))

## Design rule sources

- Rules the AI and developers follow: [../design/design-conventions.md](../design/design-conventions.md)
- Token values: [../design/tokens.md](../design/tokens.md)
- Evidence for how the rules were derived: [../design/reference-audit-cemes-v2.md](../design/reference-audit-cemes-v2.md)

These three files are the design contract for Phase 1. Any deviation requires an ADR or a documented exception in design-conventions.md §3.

## Related documents

- [data-model-draft.md](data-model-draft.md) — draft entities (subject to offline spike)
- [demo-to-production-path.md](demo-to-production-path.md) — what survives from demo to production