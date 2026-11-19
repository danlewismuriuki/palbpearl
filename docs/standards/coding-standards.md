# Coding standards

Status: Draft — awaiting review  
Owner: TBD

## Scope

These standards apply when application code begins in **Phase 1**. No application code exists in the repository yet; this document sets expectations before implementation starts.

## TypeScript

- Enable **strict mode**.
- Do not allow **implicit `any`**; type boundaries explicitly at module edges.

## Linting and formatting

- Use a **single configured** linter and formatter for the codebase.
- Follow tool output in continuous integration; avoid style debates resolved manually in review.

## Mobile-first

- Design and test at **phone viewport first**, then scale up to larger breakpoints.
- Layout and interaction patterns should match [../design/design-conventions.md](../design/design-conventions.md).

## UI and data access

- **UI components must not perform data access** (no direct fetches, SDK calls, or storage access inside presentational components).
- All data access goes through the **single data-client adapter** described in [../architecture/mock-boundary.md](../architecture/mock-boundary.md) (planned).
- UI code may **import types only** from the shared API contract package — never from mocks or ad hoc shapes that bypass the contract.

## Naming

- **File names:** kebab-case
- **React (or equivalent) components:** PascalCase
- **Functions and variables:** camelCase

## Accessibility

At minimum:

- Use **semantic HTML** for structure and controls
- Ensure **inputs are labelled** (visible label or accessible name)
- Provide **visible focus** indicators for keyboard users

Further visual targets (contrast, touch size) come from [../design/design-conventions.md](../design/design-conventions.md) and [../design/tokens.md](../design/tokens.md).

## Testing intent

- **Unit tests** for pure logic and small modules
- **Integration tests** for the data-client adapter and contract boundaries
- **End-to-end tests** for the demo happy path

Detailed tooling, coverage, and CI gates will be agreed in a dedicated testing ADR when code work begins.