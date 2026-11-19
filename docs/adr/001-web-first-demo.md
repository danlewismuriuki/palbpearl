# Web-first demo

**Title:** Build a mobile-first web demo before any mobile app  
**Status:** proposed  
**Date:** 2026-11-19  
**Owner:** TBD

## Context

PalBpearl must show farmer registration, crop image submission, AI-assisted guidance, and staff administration to stakeholders before committing to a native or cross-platform mobile stack. A web demo can reach phones quickly via the browser while architecture and offline behaviour remain under exploration.

## Decision

Build a **mobile-first web demo** as the first implementation phase. Do not start a dedicated mobile app until the web demo validates core flows and the mobile offline spike informs framework choice (see [004-defer-mobile-framework.md](004-defer-mobile-framework.md)).

## Alternatives considered

- **Native or cross-platform mobile first** — Faster on-device feel but locks stack early and slows iteration for staff and farmers without app distribution.
- **Building web and mobile in parallel** — Higher cost and duplicated contract work before flows are proven.

## Consequences

### Positive

- Faster feedback on UX and contract shape on real phone viewports.
- Single client surface for Phase 1; mobile app reuses the shared API contract later.

### Negative

- Some device capabilities (background sync, push) are harder to demonstrate authentically on web until later phases.

### Follow-ups

- Accept or refine ADR after demo scope review.
- Complete mobile offline spike before reversing web-first ordering.

## Related

- [002-mobile-first-responsive.md](002-mobile-first-responsive.md)
- [008-repo-strategy-demo-to-production.md](008-repo-strategy-demo-to-production.md)
- [../architecture/architecture-overview.md](../architecture/architecture-overview.md)

## Addendum — development brief (2026-11-19)

The approved **Mushroom Extension & Market-Linkage** development brief calls for an **interactive mobile application prototype**. The **mobile-first web demo** satisfies that requirement for **Demo** and **Validation** without committing to a mobile framework. Stakeholders can evaluate the nine farmer screens and admin dashboard on Android browsers. The **actual Android app** follows in **Phase 2** of the delivery sequence (after validation), consistent with [004-defer-mobile-framework.md](004-defer-mobile-framework.md) and the brief’s **Mobile App → Pilot → Full deployment** stages.