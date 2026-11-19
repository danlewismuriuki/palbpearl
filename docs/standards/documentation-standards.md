# Documentation standards

Status: Draft — awaiting review  
Owner: TBD

## Purpose

These standards keep PalBpearl documentation consistent, reviewable, and easy to navigate across vision, design, standards, architecture, and ADRs.

## Structure and headings

- Use **one H1 per file** — the document title only.
- Use **ATX headings** (`#`, `##`, `###`); do not use setext underlines.
- Use **relative links only** when pointing to other repository documents. Do not embed external URLs in standards documents unless a specific document explicitly allows it elsewhere.

## Document metadata

Every document must include immediately under the H1:

- **Status:** one of `Draft`, `Accepted`, or `Superseded`
- **Owner:** the person or role accountable for the document

## Language and scope

- Use **British English** in prose (for example, “organisation”, “initialise”), except in code identifiers, file names, and the product name **PalBpearl**.
- Prefer **small, reviewable increments** — one topic per document where practical, so pull requests stay easy to review.

## ADRs and naming

- ADR files use the pattern **`NNN-short-title.md`** (for example, `001-mobile-first-web-demo.md`).
- Other documentation file names use **kebab-case**.
- Record dates in **ISO format** (`YYYY-MM-DD`) when a document or ADR requires a date.

## Decisions

Significant decisions belong in Architecture Decision Records. Follow the ADR process described in [adr-process.md](adr-process.md).

## Visual and token values

Do not duplicate raw design values (colours, typefaces, spacing numbers, and similar) in standards documents. Refer to [../design/design-conventions.md](../design/design-conventions.md) and [../design/tokens.md](../design/tokens.md) for visual conventions and token values.