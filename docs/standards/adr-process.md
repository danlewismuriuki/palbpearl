# ADR process

Status: Draft — awaiting review  
Owner: TBD

## When an ADR is required

Create an Architecture Decision Record for any **significant** decision about technology, architecture, or cross-cutting conventions that affects more than one area of PalBpearl or is costly to reverse.

Examples include choice of framework, data-access boundaries, authentication approach, deployment model, and shared testing strategy. Minor local choices that do not set precedent do not require an ADR unless the owner requests one.

## Lifecycle

ADRs move through these states:

1. **Proposed** — under review; not yet binding.
2. **Accepted** — agreed and in effect until superseded.
3. **Superseded** — replaced by a newer ADR; the old record remains for history.

**Never delete an ADR.** When a decision changes, add a new ADR and mark the previous one **Superseded**, with a link to the replacement.

## Template and location

New ADRs should follow the template at [../adr/000-adr-template.md](../adr/000-adr-template.md) (planned). Store accepted ADRs under `docs/adr/` using the naming pattern `NNN-short-title.md`.

## Required sections

Each ADR must include:

- **Context** — what problem or constraint prompted the decision
- **Decision** — what was chosen
- **Alternatives considered** — credible options that were not selected
- **Consequences** — trade-offs, follow-on work, and risks
- **Status** — proposed, accepted, or superseded
- **Date** — ISO format (`YYYY-MM-DD`)
- **Owner** — accountable person or role

## Decisions index

Whenever an ADR’s status changes, update [../decisions-log.md](../decisions-log.md) (planned) so contributors can find the current decision set in one place.

## Provisional decisions

Some decisions may be recorded as **provisional** when evidence is incomplete. Provisional ADRs must:

- Label the decision clearly as **provisional** in the Decision or Status section
- Name a **revisit trigger** (for example, after the mobile offline spike)
- Be replaced or accepted fully before they are treated as long-term policy