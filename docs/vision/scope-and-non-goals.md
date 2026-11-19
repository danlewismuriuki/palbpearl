# Scope and non-goals

Status: Draft — awaiting review  
Owner: TBD

Scope reflects the **Mobile App Development Brief** and **Grant Proposal**. **Module 7 — Market Linkage** is **Phase 2** in both documents. The demo surfaces a walkable subset plus **stub screens** for Additional and Phase 2 features (see [roadmap.md](roadmap.md)).

**App users target:** **80** active app users (grant target), distinct from **100 registered farmers** across four cohorts.

**Location dropdowns:** County, Sub-county, Ward, and Village content on registration is **placeholder** until the project team supplies official lists (see [../open-questions.md](../open-questions.md)).

## In scope for the demo — farmer screens

Nine farmer-facing screens (mobile-first prototype):

- Registration
- Home dashboard
- Learning centre
- Darkroom construction guide
- Production guide
- Smart FAQ
- Technical support with photo upload
- Production reminders
- Market information

## In scope for the demo — admin dashboard

Admin representation (mocked authentication):

- Farmer list with filters
- Ticket review queue
- Darkroom verification queue
- Content upload placeholder
- Market price editor placeholder

## Feature inventory

| Feature | Module | Phase |
| --- | --- | --- |
| Farmer registration (incl. location dropdown placeholders) | M1 — Onboarding | Demo; Phase 1 MVP |
| Home dashboard | M1 — Onboarding | Demo; Phase 1 MVP |
| Learning centre; offline manuals (Ground Truth Manual) | M2 — Learning | Demo; Phase 1 MVP |
| Darkroom construction guide | M3 — Darkroom | Demo; Phase 1 MVP |
| Production guide | M4 — Production | Demo; Phase 1 MVP |
| Smart FAQ (30 FAQs when content supplied) | M5 — Support & AI | Demo; Phase 1 MVP |
| Technical support / Plant Doctor with photo upload | M5 — Support & AI | Demo; Phase 1 MVP |
| Production reminders | M5 — Support & AI | Demo (stub or simulated); Phase 1 MVP |
| In-app notifications (farmer) | M5 — Support & AI | Demo (stub); Phase 1 MVP |
| AI assistant | M5 — Support & AI | Demo (stub); Phase 1 MVP |
| Admin: farmer list with filters | M6 — Admin | Demo; Phase 1 MVP |
| Admin: ticket review queue | M6 — Admin | Demo; Phase 1 MVP |
| Admin: darkroom verification queue | M6 — Admin | Demo; Phase 1 MVP |
| Admin: content upload | M6 — Admin | Demo (placeholder); Phase 1 MVP |
| Farmer market information screen (non-linkage) | M6 — Admin / content | Demo (placeholder); Phase 1 MVP |
| Admin: market price editor placeholder | M7 — Market Linkage | Demo (stub only); **Phase 2** |
| **Market Linkage — buyer and pricing board** | **M7 — Market Linkage** | Demo (stub only); **Phase 2** |
| **Market Linkage — aggregation alerts** | **M7 — Market Linkage** | Demo (stub only); **Phase 2** |
| **Market Linkage — collection notifications** | **M7 — Market Linkage** | Demo (stub only); **Phase 2** |

All features **except Module 7** are **Phase 1 MVP**. The **Demo** column in the Phase field marks what is walkable or stubbed in the pre-Month 2 prototype.

## Priority tiers in the demo

| Tier | Demo treatment |
| --- | --- |
| Essential MVP | Fully walkable (registration, offline manuals, darkroom guide, production guide) |
| Core operations | Walkable helpdesk, photo verification, admin dashboard queues |
| Additional | Stub screens — AI assistant, reminders, notifications |
| Phase 2 (Module 7) | **Stub screens only** — market linkage, buyers, aggregation, pricing |

## Simulated in the demo

The following are **simulated**, not production systems:

- Backend services
- Database persistence
- Real AI (canned responses per [../adr/003-simulate-functionality.md](../adr/003-simulate-functionality.md))
- Real offline sync (offline indicator or sample cached manuals only where shown)
- SMS or push delivery
- Real photo storage

Implementation uses the mock API layer, seed data, and single adapter per [../architecture/mock-boundary.md](../architecture/mock-boundary.md).

## Out of scope for the demo (deferred)

The demo deliberately does **not** include:

- Real offline sync (full MVP behaviour is Phase 1 build, post-demo)
- Real AI model or production RAG pipeline ([../adr/013-ai-safety-architecture.md](../adr/013-ai-safety-architecture.md) when implemented)
- Real SMS or push delivery
- Production authentication
- Real image storage and CDN
- Native **Android** app (follows prototype approval and M2–4 design)
- Production backend services
- Production database
- **Live Market Linkage** (Phase 2, Months 8–12)

## Non-goals now

The following are **not chosen** in the demo phase. Brief **candidates** are in [../adr/012-candidate-technologies-from-brief.md](../adr/012-candidate-technologies-from-brief.md) only. Each production choice is via **ADR** ([../open-questions.md](../open-questions.md)):

- Mobile framework (brief names Flutter as candidate only)
- Backend framework
- Database
- AI provider
- Hosting
- Notification provider (SMS, push, or other channels)

## Change control

Additions to **demo scope** require updating this document. Significant decisions need a **new ADR**, [../decisions-log.md](../decisions-log.md) update, and links when accepted.