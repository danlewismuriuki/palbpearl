# ADR-014: UI Language for Farmer-Facing Screens

## Status
Accepted — 2026-11-19

## Context
Primary users are Kenyan smallholder mushroom farmers. The brief is
written in English but does not mandate an interface language.

## Decision
Farmer-facing screens use Swahili labels, with English in parentheses
only where a term is ambiguous to a first-time user. Admin-facing
screens remain English. Code identifiers, type names, comments, and
commit messages remain English.

## Consequences
- All future farmer screens follow this pattern.
- Translation or localisation beyond Swahili/English is out of scope
  for the demo.
- design-conventions.md §6 (copy rules) must be updated in a later
  pass to reference this ADR.