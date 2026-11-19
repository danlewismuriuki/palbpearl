# API contract principles

Status: Draft — awaiting review  
Owner: TBD

## Contract-first

PalBpearl is **contract-first**: the UI is written against **contract types** and operation boundaries defined in a shared package, not against ad hoc shapes returned by mocks.

Mocks must conform to the contract. The UI must not branch on “mock-only” fields or loosen types to match seed data.

## Shared package

The contract lives in a **shared package** consumed by:

- The Phase 1 mobile-first **web app**
- A future **mobile app**, when one is chosen (deferred, to be decided by ADR)

Server implementations (when they exist) should honour the same contract at the boundary the adapter calls. Wire format (REST, RPC, GraphQL, and similar) is deferred, to be decided by ADR.

## Versioning

Versioning will follow these principles:

- The contract is the **compatibility surface** for all clients.
- Changes are **reviewed** before implementation merges.
- **Breaking changes** are explicit and recorded (ADR or contract changelog) before clients and mocks are updated.

The concrete versioning scheme (semantic version numbers, date stamps, or URL paths) is **TBD**.

## Errors and status

At the principle level:

- Operations report **success or failure** in a consistent way across the adapter, whether backed by mocks or a real API.
- **Errors** are distinguishable from empty or missing data so the UI can show farmer-appropriate messages (see [../design/design-conventions.md](../design/design-conventions.md) tone guidance).
- **Resource status** fields (for example submission lifecycle) use a small, named set of states agreed in the contract.

The concrete error object shape, status code mapping, and pagination conventions are **TBD**.

## Change control

- **Contract changes require review** — at minimum, a second reviewer and alignment with [../standards/review-checklist.md](../standards/review-checklist.md).
- **Breaking changes** must be recorded before implementation: update the decisions index when an ADR or decisions log exists, and update mocks and the adapter in the same change set.
- Non-breaking additions may proceed with lighter review but still must not leak mock-only fields into published types.

## Related documents

- [mock-boundary.md](mock-boundary.md) — adapter and mocks stay behind the contract
- [data-model-draft.md](data-model-draft.md) — draft entities that inform contract types