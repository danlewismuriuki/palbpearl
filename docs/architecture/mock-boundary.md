# Mock boundary

Status: Draft — awaiting review  
Owner: TBD

## Purpose

The PalBpearl demo uses **mocks** so farmers and staff can experience flows before production services exist. This document defines what belongs in mocks, what must not, and how the UI stays isolated from demo-only data.

## What lives in mocks

The mocks package may include:

- **Mock API responses** that implement contract operations
- **Canned AI output** for demonstrations (not a real model)
- **Seed data** for farmers, farms, submissions, and admin scenarios
- **Demo-only helpers** (for example, reset demo state, fast-forward statuses) that are not exposed to the UI except through the adapter

All mock payloads must conform to the **shared API contract** (see [api-contract-principles.md](api-contract-principles.md)).

## What must not live in mocks

Do **not** place the following in the mocks package:

- **UI components** or styling
- **Contract type definitions** (these live in the shared contract package)
- **Business rules** intended to survive production (validation rules, eligibility logic, permission checks) — those belong in shared domain logic or the future backend, not in throwaway demo fixtures

If a rule is only needed for the demo temporarily, document it as **provisional** and plan to relocate it before production.

## Single adapter rule

- The **UI never imports mocks directly** (no imports from the mocks package in app or component code).
- **One data-client adapter** implements contract operations and chooses the data source via **configuration** (mock versus real API).
- The UI depends only on the adapter interface and **contract types**.

This matches [../standards/coding-standards.md](../standards/coding-standards.md).

## Future enforcement

A **lint or import-boundary check in CI** will enforce “no mock imports in UI”. That check is **planned**; it is **not implemented** while the repository remains documentation-only.

## Deletion plan

Mocks are **temporary**. Before production:

- Remove or replace the mocks package as a data source behind the adapter
- Retain contract types, adapter interface, and domain rules that survive (see [demo-to-production-path.md](demo-to-production-path.md))

Record **“mocks removed”** as an explicit **milestone** in release or ADR tracking when the real API is wired.