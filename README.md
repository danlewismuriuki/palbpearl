# PalBpearl

PalBpearl is a mobile-first application for Kenyan farmers to register, submit crop images, and receive AI assistance, with a staff admin dashboard.

## Current phase

Documentation and standards only — no application code yet.

## What this repository will contain

This repository will first host a **mobile-first web demo** that demonstrates the farmer registration flow, crop image submission, AI-assisted guidance, and staff-facing administration. Over time, the same product vision may expand into a dedicated mobile app and a production backend. Technology and architectural choices are made by the project owner and recorded as **Architecture Decision Records (ADRs)** so that rationale, alternatives, and consequences remain visible to contributors and reviewers.

## Docs-first rule

No application code will be merged until `docs/standards/` and the initial ADRs are accepted. Documentation sets expectations for structure, quality, and decision-making before implementation begins.

## Where to look

- [docs/decisions-log.md](docs/decisions-log.md) — decisions index
- [docs/standards/adr-process.md](docs/standards/adr-process.md) — how we write ADRs
- [docs/open-questions.md](docs/open-questions.md) — open questions
- [docs/vision/project-overview.md](docs/vision/project-overview.md) — project overview
- [docs/design/design-conventions.md](docs/design/design-conventions.md) — design conventions
- [docs/standards/documentation-standards.md](docs/standards/documentation-standards.md) — documentation standards
- [docs/architecture/architecture-overview.md](docs/architecture/architecture-overview.md) — architecture overview

## Getting started

```bash
pnpm install
pnpm --filter web dev
```

## Status

Draft — awaiting review.