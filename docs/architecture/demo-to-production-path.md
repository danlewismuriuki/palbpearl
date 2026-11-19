# Demo to production path

Status: Draft — awaiting review  
Owner: TBD

## Purpose

PalBpearl begins as a **mobile-first web demo** with mocks. This document separates what should **survive into production** from what is **replaced later**, and lists milestones and risks so demo shortcuts do not become accidental commitments.

## Survives vs replaced

| Item | Survives into production | Replaced later |
| --- | --- | --- |
| UI components and layout | Yes — refined, not rewritten from scratch, aligned with [../design/design-conventions.md](../design/design-conventions.md) | — |
| Routing | Yes — structure may grow with new routes | — |
| Contract types and data models | Yes — evolved via reviewed contract changes | — |
| Form validation and UX flows | Yes — rules may tighten with real backend validation | — |
| Admin views | Yes — permissions and data sources become real | — |
| Auth flow structure | Yes — screens and steps; provider integration deferred | — |
| Mock API layer | — | Yes — replaced by real API behind the same adapter |
| Fake AI responses | — | Yes — replaced by real AI (deferred, to be decided by ADR) |
| Seed data | — | Yes — replaced by production data stores |
| Simulated offline indicator | — | Yes — replaced by real offline sync behaviour or removed |
| Mock authentication | — | Yes — replaced by real authentication provider |
| Demo-only helpers | — | Yes — removed before production |

## Milestones

Progress toward production should be explicit. Intended milestones include:

1. **Mocks removed** — adapter targets real API; mocks package deleted or archived
2. **Real authentication** — mock auth replaced; identities align with chosen provider (deferred, to be decided by ADR)
3. **Real AI** — canned output replaced by agreed AI and RAG design (deferred, to be decided by ADR)
4. **Real image storage** — upload and delivery use production storage (deferred, to be decided by ADR)
5. **Offline sync implemented** — offline spike findings reflected in contract and client behaviour (deferred, to be decided by ADR)

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Demo-speed choices become permanent | Label provisional decisions; require ADR before production; use [demo-to-production-path.md](demo-to-production-path.md) in review |
| Mocks treated as “good enough” | Contract-first rule; mocks conform to contract; milestone to remove mocks |
| Data model broken by the offline spike | Keep [data-model-draft.md](data-model-draft.md) explicitly draft; revisit contract after spike |
| Demo features mistaken for product commitments | Vision and scope docs govern promises; demo-only helpers and fake AI clearly bounded in [mock-boundary.md](mock-boundary.md) |

## Related documents

- [architecture-overview.md](architecture-overview.md) — layers and Phase 1 modules
- [mock-boundary.md](mock-boundary.md) — adapter and mock scope