# Design conventions and tokens

**Title:** PalBpearl final palette and design contract for Phase 1  
**Status:** accepted  
**Date:** 2026-11-19  
**Owner:** Dan

## Context

Visual conventions were derived from design reference v2 (CEMES V2 audit in [../design/reference-audit-cemes-v2.md](../design/reference-audit-cemes-v2.md)). Operational rules live in [../design/design-conventions.md](../design/design-conventions.md). PalBpearl is a **farmer-first mushroom extension** product; palette and semantics must separate **brand action green** from **success status green** so Plant Doctor and status UI are not confused with primary actions.

## Decision

**Accept** the following palette as the authoritative colour decision for Phase 1. Mirror values into [../design/tokens.md](../design/tokens.md) colour tokens when recording implementation (this ADR is the decision record; `tokens.md` remains the developer-facing value table).

| Role | Hex |
| --- | --- |
| Primary brand | `#BC6C25` |
| Primary foreground (on brand) | `#FFFFFF` |
| Secondary | `#2D6A4F` |
| Accent / eyebrow (green-tinted) | `#40916C` |
| Background (warm off-white, outdoor use) | `#F8F6F1` |
| Surface | `#FFFFFF` |
| Surface elevated | `#FBF9F4` |
| Text primary | `#1A2E24` |
| Text secondary | `#5C6F65` |
| Border | `#DDE5E1` |
| Divider | `#E8EDEA` |
| Success (status only; always icon + label) | `#15803D` |
| Warning | `#D9930A` |
| Error / destructive | `#C53030` |
| Info | `#3B82F6` |
| Focus ring | `#40916C` |

**Rationale:** Brand green is **not** reused as success green, so the Plant Doctor visual library and status states cannot be confused with primary actions. **Amber is retained for warnings** (`color-warning`). This **replaces the CEMES V2 amber primary brand** (audit Deliverable 2–3). Text on primary brand uses **primary foreground** (not white-on-green unless contrast verification passes).

Implement as a **Tailwind theme** plus **CSS variables** in Phase 1 per [../design/design-conventions.md](../design/design-conventions.md).

## Alternatives considered

- **Deciding visual design during implementation** — Risks drift and inconsistent farmer-facing UI.
- **Adopting a pre-built component library default theme** — Conflicts with agreed PalBpearl semantics.
- **Keeping CEMES amber as primary brand** — Wrong product signal; conflicts with mushroom brand and §4 semantics in design conventions.

## Consequences

Palette decided 2026-11-19: earth-brown brand (`#BC6C25`), green reserved for plant health / success (`#15803D`). This avoids semantic collision between primary actions and the Plant Doctor library. Contrast pairs listed below must be verified before stakeholder demo.

### Positive

- Single accepted palette decision; ADR-011 no longer provisional.
- Clear split between brand primary and success for reviewers and AI builders.

### Negative

- **Contrast pairs must be verified** on real devices before stakeholder demo (see follow-ups).
- **Third-party brand assets** from the reference must **not** be copied without confirmed ownership (ownership: TBD).

### Follow-ups

- Replace **TBD** hex in this table and sync `tokens.md` when owner supplies final swatches.
- Verify WCAG-style contrast for: primary brand + primary foreground, success + text on success surfaces, warning + text, error/destructive + foreground, text primary on background (outdoor glare), focus ring on surface.
- Confirm reference design asset ownership.

## Related

- [002-mobile-first-responsive.md](002-mobile-first-responsive.md)
- [010-web-demo-language-and-framework.md](010-web-demo-language-and-framework.md)
- [../design/design-conventions.md](../design/design-conventions.md)
- [../design/tokens.md](../design/tokens.md)
- [../design/reference-audit-cemes-v2.md](../design/reference-audit-cemes-v2.md)