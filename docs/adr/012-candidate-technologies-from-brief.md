# Candidate technologies from brief

**Title:** Record development brief technology proposals as candidates, not selections  
**Status:** accepted  
**Date:** 2026-11-19  
**Owner:** TBD

## Context

The **Mushroom Extension & Market-Linkage** development brief proposes a full technology stack for mobile, admin, backend, data, AI, notifications, and hosting. PalBpearl already defers several choices via [004-defer-mobile-framework.md](004-defer-mobile-framework.md), [005-defer-backend-db-ai.md](005-defer-backend-db-ai.md), and the provisional web demo stack in [010-web-demo-language-and-framework.md](010-web-demo-language-and-framework.md). The brief must remain visible without overriding those ADRs or adopting unreviewed stack decisions.

## Decision

**Record the brief’s technology proposals as candidates only — not as accepted selections.** No brief item becomes binding until a dedicated ADR accepts it after demo validation and, where applicable, the mobile offline spike.

**Candidates from the brief (not decided):**

| Area | Brief candidate |
| --- | --- |
| Farmer mobile client | Flutter |
| Admin client | React with TypeScript |
| Backend | ASP.NET Core |
| Database | PostgreSQL |
| Local storage on device | SQLite |
| API style | REST |
| AI / RAG | RAG with Gemini Flash or GPT-4o-mini |
| Notifications | FCM plus local notifications |
| Hosting | Affordable cloud hosting (provider TBD) |

Phase 1 demo implementation remains governed by ADR 010 (TypeScript, React, Next.js, Tailwind) until superseded.

## Alternatives considered

- **Adopt the brief stack immediately** — Faster alignment with the document but conflicts with ADR 004, ADR 005, and evidence-based choice after validation and spike.
- **Reject the brief proposals and evaluate from scratch** — Loses traceability; stakeholders cannot see brief intent in the repository.

## Consequences

Accepted 2026-11-19 ahead of Phase 1 scaffolding; governs candidate evaluation and AI safety design respectively.

### Positive

- Brief proposals stay **visible and traceable** in one ADR.
- [004-defer-mobile-framework.md](004-defer-mobile-framework.md) and [005-defer-backend-db-ai.md](005-defer-backend-db-ai.md) remain **authoritative** for deferral.
- Evaluation order is preserved: demo and validation before production stack ADRs.

### Negative

- Contributors must distinguish **candidates** from **accepted** tools until follow-on ADRs exist.
- Brief admin stack (React) may overlap conceptually with demo web stack without being a duplicate decision.

### Follow-ups

- When accepting any candidate, add a new ADR (do not silently extend this record).
- Update [../open-questions.md](../open-questions.md) and [../decisions-log.md](../decisions-log.md) when candidates graduate to decisions.

## Related

- [001-web-first-demo.md](001-web-first-demo.md)
- [004-defer-mobile-framework.md](004-defer-mobile-framework.md)
- [005-defer-backend-db-ai.md](005-defer-backend-db-ai.md)
- [010-web-demo-language-and-framework.md](010-web-demo-language-and-framework.md)
- [../vision/project-overview.md](../vision/project-overview.md)