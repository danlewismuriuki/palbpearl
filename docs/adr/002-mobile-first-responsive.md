# Mobile-first responsive

**Title:** Design and build phone-first, scale up to desktop  
**Status:** proposed  
**Date:** 2026-11-19  
**Owner:** TBD

## Context

Primary users are Kenyan farmers on phones. Staff may use larger screens, but farmer flows must remain usable on small viewports first. Layout conventions are recorded in [../design/design-conventions.md](../design/design-conventions.md).

## Decision

**Design and implement phone-first**, then scale up to tablet and desktop using responsive layout. Default layouts assume a single column on phones; enhancements for wider viewports must not break the phone experience.

## Alternatives considered

- **Desktop-first** — Optimises admin comfort but risks cramped or broken farmer flows on phones.
- **Separate mobile and desktop layouts** — Maximum tailoring at the cost of duplicated routes, components, and testing surface.

## Consequences

### Positive

- Aligns implementation with stated product priority and design conventions.
- Review and QA default to phone viewport.

### Negative

- Admin dashboards on large screens may need deliberate second-pass layout work.

### Follow-ups

- Reflect mobile-first expectation in coding standards and review checklist (already documented under [../standards/](../standards/)).
- Revisit if admin-only desktop workflows diverge significantly from farmer mobile flows.

## Related

- [001-web-first-demo.md](001-web-first-demo.md)
- [011-design-conventions-and-tokens.md](011-design-conventions-and-tokens.md)
- [../design/design-conventions.md](../design/design-conventions.md)