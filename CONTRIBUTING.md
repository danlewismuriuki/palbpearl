# Contributing to PalBpearl

Thank you for helping improve PalBpearl. During the current phase, contributions are focused on documentation and standards rather than application code.

## Docs-first workflow

PalBpearl follows a documentation-first approach: standards, vision, and architecture decisions are reviewed and accepted before any application code is added to the repository. When you open a pull request in this phase, expect review to focus on clarity, completeness, and alignment with agreed standards—not on runtime behaviour.

## Writing documentation

Use these Markdown conventions for all documentation in this repository:

- **One H1 per file** — the file title only; use `##` and below for sections.
- **ATX headings** — use `#`, `##`, and `###` (not setext underlines).
- **Relative links** — link to other repo documents with paths relative to the current file (no external URLs in core docs unless explicitly allowed elsewhere).
- **Status and Owner** — immediately under the H1, include:
  - **Status:** `Draft`, `Accepted`, or `Superseded`
  - **Owner:** the person or role accountable for the document

Example:

```markdown
# Example document

**Status:** Draft  
**Owner:** Documentation working group

## Section
```

## Writing ADRs

Every significant technical or product decision should be captured in an Architecture Decision Record (ADR). Follow the process described in [docs/standards/adr-process.md](docs/standards/adr-process.md). ADRs should state context, the decision, alternatives considered, and consequences.

## Naming conventions

- **File names** — use `kebab-case` (e.g. `project-overview.md`, `api-guidelines.md`).
- **ADR files** — use the pattern `NNN-short-title.md` (e.g. `001-mobile-first-web-demo.md`).
- **Product spelling** — always **PalBpearl** in prose and headings (not variations).

## Commits and branches

- Prefer Conventional Commits style messages where practical, for example:
  - `docs: add project overview`
  - `chore: initialise skeleton`
- Work on short-lived feature branches and open pull requests for review rather than committing directly to the default branch.

## Review expectations

Submit small, reviewable increments. Reviewers should check that documentation is clear, that alternatives and trade-offs are acknowledged where decisions matter, and that consequences (including maintenance and future work) are spelled out.

## Status

Draft — awaiting review.