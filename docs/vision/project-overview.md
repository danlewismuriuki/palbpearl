# Project overview

Status: Draft — awaiting review  
Owner: TBD

## Problem

Kenyan **smallholder mushroom farmers** need a simple, phone-friendly way to learn and follow good practice across **cultivation**, **darkroom construction**, **drying**, **packaging**, and **sales**, and to get trustworthy help when production issues arise. PalBpearl must support **digital extension first** — registration, learning content, technical support with photos, and field verification — while **market linkage** follows in **Phase 2** per the Mobile App Development Brief and Grant Proposal. Staff oversee cohort progress, verify darkrooms, and handle tickets without overwhelming farmers with jargon.

## Project context

Source of truth: **Mobile App Development Brief** and **Grant Proposal** (Raiden Healthcare Group – Third Grant Funding Call 2026).

| Item | Detail |
| --- | --- |
| Applicant | **PalBpearl Enterprises**, owned by **Briton Murithi Mbaya** |
| Funder | **Raiden Healthcare Group** — Third Grant Funding Call 2026 |
| Total grant | **KES 3,780,000** |
| App line item | **D1 — KES 350,000** (design, development, hosting) |
| Duration | **12 months** |
| Target community | **Target community (location to be confirmed; reference data cites Kisumu County)** |
| Direct beneficiaries | **100 farmers** (at least **60% women and youth**), in **4 cohorts of 25** |
| Indirect beneficiaries | **~500** |
| App users (target) | **80** (distinct from registered farmers — see [scope-and-non-goals.md](scope-and-non-goals.md)) |
| Primary platform | **Android** (farmer mobile app) |
| Supporting platform | **Web admin** |
| Product phasing | **Digital extension first**; **Module 7 — Market Linkage** in **Phase 2** (both source documents) |

## Target users

**Farmers** use PalBpearl on **Android** (when the native app is live) to register, follow offline manuals and guides, submit support tickets with photos, and receive reminders. During the pre-Month 2 period, an **interactive prototype** demonstrates flows on mobile browsers. The experience must work on typical phones and uncertain connectivity.

**Staff admins** use the **supporting web admin** to filter farmer lists, review tickets, verify darkrooms, manage content placeholders, and (in Phase 2) market data. In the demo, authentication is mocked.

**PalBpearl project team** (roles per grant documents):

| Person | Role |
| --- | --- |
| Briton Murithi Mbaya | Project lead; business training; finance and reporting |
| Joy Odiambo | Food safety, processing, packaging, product development |
| Rogerson Meme | Spawn and substrate quality; production protocols |
| Ronn Kenoly | Crop health, quality standards, biosafety (KEPHIS) |
| Evans Murithi | Solar and renewable-powered drying |
| Dan Lewis | Design and development of the extension and market-linkage app |
| Field Officer | Extension support (**name TBC**) |

Rogerson Meme and Ronn Kenoly also act as **agronomists** for technical escalation, aligned with [../adr/013-ai-safety-architecture.md](../adr/013-ai-safety-architecture.md).

## Development approach

Grant app work: **demo before Month 2** → **design Months 2–4** → **beta Months 4–8** (Cohort 1 of 25 farmers plus Field Officer) → **full release and Market Linkage activation Months 8–12**. Repository delivery stays **demo-first and production-bound** ([../adr/008-repo-strategy-demo-to-production.md](../adr/008-repo-strategy-demo-to-production.md)). The mobile-first **web prototype** precedes the Android app per [../adr/001-web-first-demo.md](../adr/001-web-first-demo.md) and [../adr/004-defer-mobile-framework.md](../adr/004-defer-mobile-framework.md).

## Two objectives

1. **Interactive stakeholder demo (pre-Month 2)** — Deliver a **pre-development prototype** with simulated functionality for stakeholder **approval before Month 2** of the grant period: mock APIs, seed data, and canned AI so the project team can walk through farmer and admin flows before M2–4 design and build.

2. **Eventual production application** — Evolve toward the **Android** farmer app and **web admin**, beta with **Cohort 1 (25 farmers)** and the **Field Officer**, then full release across all cohorts and **Phase 2 Market Linkage** in Months 8–12, with demo-only code removable per [../architecture/demo-to-production-path.md](../architecture/demo-to-production-path.md).

## Demo vs production

Demo capabilities validate UX and contracts; they are **not production commitments** unless explicitly moved to the production column via ADR and scope updates.

| Area | Demo (pre-M2) | Production (grant period) |
| --- | --- | --- |
| Data and APIs | Mock layer, seed data, adapter behind contract | Real API and persistence (deferred, to be decided by ADR) |
| AI | Canned responses | Real model and RAG design per [../adr/013-ai-safety-architecture.md](../adr/013-ai-safety-architecture.md) |
| Authentication | Mocked login | Production authentication provider |
| Images | Simulated upload and storage | Real image storage and retention policy |
| Offline | Simulated / limited offline manuals in prototype | Offline manuals and sync in MVP |
| Clients | Mobile-first web prototype | **Android** primary; **web admin** supporting |
| Market linkage | Stub screens (Module 7) | **Phase 2** (Months 8–12) |
| Operations | Stakeholder demo mode | Hosting within D1 scope (see [../open-questions.md](../open-questions.md)) |

## What this repository is

This repository hosts the **mobile-first web demo first** and may later expand to the **Android app** and **production backend** in one demo-first, production-bound lineage. **Technology selections are owned by the human owner and are not final** until recorded and accepted in ADRs; brief **candidates** only in [../adr/012-candidate-technologies-from-brief.md](../adr/012-candidate-technologies-from-brief.md). Provisional web stack and design conventions are in [../decisions-log.md](../decisions-log.md).