# Glossary

Status: Draft — awaiting review  
Owner: TBD

Terms are listed alphabetically.

**ADR** — Architecture Decision Record; a short document capturing context, a significant decision, alternatives, and consequences. See [../standards/adr-process.md](../standards/adr-process.md).

**Adapter** — The single data-client layer that implements the shared API contract and routes calls to mocks or a real API. See [../architecture/mock-boundary.md](../architecture/mock-boundary.md).

**Admin** — Staff user on the **supporting web admin** to review farmers, tickets, verifications, and operational data.

**Aggregation** — Collecting mushroom produce from multiple farmers for joint sale or logistics; **Module 7**, **Phase 2**.

**Agronomist** — Technical adviser (Rogerson Meme, Ronn Kenoly) supporting farmers and escalation beyond automated guidance.

**App users** — Grant **target of 80** people actively using the app, distinct from **100 registered farmers** in four cohorts.

**Cohort** — One of **four cohorts of 25 farmers** (100 direct beneficiaries total, at least 60% women and youth).

**Contract** — The shared API type and operation boundary that UI code depends on. See [../architecture/api-contract-principles.md](../architecture/api-contract-principles.md).

**Darkroom** — Controlled environment for mushroom fruiting; construction and verification are core flows.

**Demo mode** — Behaviour and helpers for reliable stakeholder walkthroughs before Month 2 approval.

**Demo-first, production-bound** — One repository where demo code is isolated so mocks can be deleted. See [../adr/008-repo-strategy-demo-to-production.md](../adr/008-repo-strategy-demo-to-production.md).

**Farmer** — Primary end user who registers, follows guides, and submits support tickets with photos.

**Field Officer** — Extension support role on the project team (**name TBC**); key user in beta (Cohort 1, Months 4–8).

**Fruiting** — Stage when mycelium produces mushrooms in the darkroom.

**Grant line D1** — Grant budget line for the app: **KES 350,000** (design, development, hosting) within total grant **KES 3,780,000**.

**KEPHIS** — Kenya Plant Health Inspectorate Service; biosafety and quality context for Ronn Kenoly’s role.

**Mock boundary** — Demo-only code in the mocks package; UI uses the adapter only. See [../adr/009-mock-boundary-isolation.md](../adr/009-mock-boundary-isolation.md).

**Mock layer** — Simulated APIs, seed data, and canned AI during the demo phase.

**Monitoring and evaluation (M&E)** — Tracking outcomes across the 12-month grant.

**Mycelium** — Fungal network in substrate before fruiting.

**PalBpearl** — Extension and market-linkage product for PalBpearl Enterprises mushroom smallholders and staff.

**Phase 1 MVP** — Digital extension modules (M1–M6): registration, learning, darkroom, production, support and AI, admin — **excluding live Market Linkage**.

**Phase 2** — **Module 7 — Market Linkage** (buyer and pricing board, aggregation alerts, collection notifications), activated Months 8–12 per grant schedule.

**Pinning** — Transition to fruiting; covered in production guidance.

**Plant Doctor** — Technical support with photo upload (simulated AI in demo).

**Solar-drying** — Post-harvest drying; Evans Murithi’s renewable-powered drying focus.

**Spike** — Time-boxed investigation (for example mobile offline) before an ADR.

**Submission** — Assistance request with images and notes; related to **tickets**.

**Substrate** — Material mycelium colonises before fruiting.

**Survives vs replaced** — What carries to production versus demo-only removal. See [../architecture/demo-to-production-path.md](../architecture/demo-to-production-path.md).

**Ticket** — Farmer support request queued for admin or agronomist review.