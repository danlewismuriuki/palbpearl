# Roadmap

Status: Draft — awaiting review  
Owner: TBD

Phases may overlap in planning, but **no phase starts implementation before the previous phase’s exit criterion is met**.

## Grant-aligned app schedule (12 months)

This schedule is from the Mobile App Development Brief and Grant Proposal. The **interactive demo is before Month 2** (stakeholder approval).

| Period | Goal | Exit criterion |
| --- | --- | --- |
| **Pre-Month 2 — Demo** | Interactive prototype; stakeholder approval | Project team signs off on flows in [scope-and-non-goals.md](scope-and-non-goals.md) |
| **Months 2–4** | UI/UX, registration, offline manuals, admin backend foundations | Design complete; registration and manual content path ready for beta build |
| **Months 4–8 — Beta** | Beta to **Cohort 1 (25 farmers)** + **Field Officer**; fixes | Cohort 1 using Android MVP (digital extension); critical defects addressed |
| **Months 8–12** | Full release to all cohorts; **Market Linkage (Module 7) activation** | 100 farmers onboarded across cohorts; Phase 2 linkage live per scope |

**Primary platform:** Android (farmers). **Supporting:** web admin.

## Budget priorities (D1 — KES 350,000)

The demo shows all tiers; **Additional** and **Module 7** use **stub screens** in the prototype ([scope-and-non-goals.md](scope-and-non-goals.md)).

| Tier | Scope | Demo expectation |
| --- | --- | --- |
| Essential MVP | Registration, offline manuals, darkroom guide, production guide | Fully walkable |
| Core operations | Helpdesk, photo verification, admin dashboard | Fully walkable |
| Additional | AI assistant, reminders, notifications | Stub; simulated |
| Phase 2 (Module 7) | Market linkage, buyers, aggregation, pricing | Stub only |

## Repository phases (aligned to grant)

Phases 0–5 map to documentation and implementation work; the **grant demo sits before Month 2** (during or completing Phase 0–1 below).

### Phase 0 — Documentation and standards

**Goal:** Vision, design, standards, architecture, ADRs including brief incorporation.

**Exit criterion:** Initial ADRs reviewed; [../decisions-log.md](../decisions-log.md) and [../open-questions.md](../open-questions.md) current; ready to build pre-M2 demo.

### Phase 1 — Mobile-first web demo with mocks

**Goal:** Pre-Month 2 interactive prototype (provisional web stack per ADR 010) for approval.

**Exit criterion:** Farmer and admin flows walk through on phone viewport; stakeholder approval recorded before M2.

### Phase 2 — Mobile offline spike

**Goal:** Inform Android/offline design for Months 2–8 build (runs in parallel where grant calendar allows).

**Exit criterion:** Spike report; [../architecture/data-model-draft.md](../architecture/data-model-draft.md) updated.

### Phase 3 — Framework, backend, database, and AI selections

**Goal:** ADRs for production stack (**candidates** in ADR 012 remain candidates until accepted here).

**Exit criterion:** Decisions needed for M2–4 build and beta.

### Phase 4 — Production build-out (Android and web admin)

**Goal:** M2–8 beta and M8–12 full release features against shared contract.

**Exit criterion:** Beta with Cohort 1; then all cohorts on digital extension.

### Phase 5 — Remove mocks; go live

**Goal:** Production configuration; mocks removed; Module 7 live in Months 8–12 window.

**Exit criterion:** Mocks removed; Market Linkage activated; M&E and grant reporting supported.