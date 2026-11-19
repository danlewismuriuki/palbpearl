# Review checklist

Status: Draft — awaiting review  
Owner: TBD

## A. Documentation review

Use this checklist when reviewing documentation pull requests:

- [ ] **Purpose** of the document is clear in the opening sections
- [ ] **Status** and **Owner** are present under the H1
- [ ] Where a **decision** is made, **alternatives** are listed
- [ ] **Consequences** (trade-offs, follow-on work, risks) are stated for decisions
- [ ] Links are **relative** only; no unapproved external URLs
- [ ] No **invented design values** (refer to `docs/design/` instead)
- [ ] An **ADR** is linked or added if the change records a significant decision

## B. Future code review

Use this checklist when reviewing code pull requests (Phase 1 onward):

- [ ] **Mock boundary** respected — UI uses the data-client adapter, not direct data access ([../architecture/mock-boundary.md](../architecture/mock-boundary.md), planned)
- [ ] **Contract types** used from the shared API contract; UI does not import from mocks
- [ ] **Mobile-first** layout and behaviour verified at phone viewport
- [ ] **No secrets** or credential material in the diff
- [ ] **Accessibility** basics: semantic HTML, labelled inputs, visible focus
- [ ] **Tests** updated or added where behaviour changed (per agreed testing ADR)

If a decision changed, the ADR and decisions-log must be updated.