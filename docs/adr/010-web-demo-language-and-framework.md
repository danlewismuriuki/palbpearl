# Web demo language and framework

**Title:** TypeScript, React (Next.js), and Tailwind CSS for the mobile-first web demo  
**Status:** provisional  
**Date:** 2026-11-19  
**Owner:** TBD

## Context

Phase 1 needs a web stack for the mobile-first demo ([001-web-first-demo.md](001-web-first-demo.md), [002-mobile-first-responsive.md](002-mobile-first-responsive.md)). Visual implementation will follow design conventions ([011-design-conventions-and-tokens.md](011-design-conventions-and-tokens.md)). This decision is **provisional** because it is revisited **only if the mobile offline spike changes web requirements**.

## Decision

Use **TypeScript**, **React** with **Next.js**, and **Tailwind CSS** for the web demo, built **mobile-first**. **Provisional** until spike outcomes confirm or challenge web stack assumptions.

## Alternatives considered

- **Plain JavaScript** — Less typing overhead but weaker contract boundary enforcement at scale.
- **Vue or Svelte** — Viable SPA stacks but diverge from documented provisional direction without ADR supersession.
- **No framework** — Minimal bundle but slower feature velocity for routing, forms, and admin views.

## Consequences

### Positive

- Aligns with strict TypeScript expectation in [../standards/coding-standards.md](../standards/coding-standards.md).
- Tailwind pairs with Phase 1 theme from design tokens when values are supplied.

### Negative

- Next.js and React choices may need revisiting if spike demands a different web delivery model.

### Follow-ups

- Revisit after **mobile offline spike**; accept fully or supersede with a new ADR.
- Do not treat provisional status as permission to add undisclosed stack ADRs.

## Related

- [001-web-first-demo.md](001-web-first-demo.md)
- [002-mobile-first-responsive.md](002-mobile-first-responsive.md)
- [004-defer-mobile-framework.md](004-defer-mobile-framework.md)
- [011-design-conventions-and-tokens.md](011-design-conventions-and-tokens.md)