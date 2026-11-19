# Open questions

Status: Draft — awaiting review  
Owner: TBD

Questions not yet decided by ADR. Each row names what phase or ADR acceptance is blocked until the question is resolved.

| Question | Area | Blocks | Owner | Next step |
| --- | --- | --- | --- | --- |
| Farmer mobile framework (Flutter, React Native, native Android, or other) | Mobile client | Phase after offline spike; acceptance of ADR 004 follow-on | TBD | Complete mobile offline spike; draft new ADR |
| Backend framework and service layout | Backend | Production milestones; acceptance of deferred stack ADR after ADR 005 | TBD | Validate demo flows; draft backend ADR |
| Database and persistence technology | Data | Production milestones; acceptance of deferred stack ADR after ADR 005 | TBD | Validate demo flows; draft database ADR |
| Mobile local storage and on-device persistence | Mobile / offline | Offline sync milestone; data model finalisation after spike | TBD | Run offline spike; update data model draft |
| API style detail (wire format, pagination, error shape) | Contract / API | Real API implementation; contract versioning detail in Phase 1 | TBD | Extend contract principles; draft API ADR |
| Authentication and authorisation provider and flows | Security | Real authentication milestone; admin permission model | TBD | Draft auth ADR after demo auth flow stable |
| Image storage and delivery | Media | Real image storage milestone; submission flow in production | TBD | Draft image storage ADR after ADR 005 review |
| AI provider and RAG architecture | AI | Real AI milestone; replacement of canned responses | TBD | Draft AI ADR after demo flows validated |
| Notifications (local, push, SMS) | Notifications | Production farmer engagement features | TBD | Draft notifications ADR |
| Hosting and deployment targets | Operations | Production deployment | TBD | Draft hosting ADR |
| Testing strategy (tools, coverage, CI gates) | Quality | Phase 1 CI enforcement; testing ADR referenced in coding standards | TBD | Draft testing ADR when code scaffold starts |
| Design token values (colour, type, spacing, radius, shadow) | Design | Phase 1 Tailwind theme completion; ADR 011 acceptance | TBD | Owner supplies values in `tokens.md` |
| Ownership of reference brand assets | Design / legal | Copying brand assets into repo; ADR 011 acceptance | TBD | Confirm ownership with human owner |
| Farmer identity key (e.g. phone number vs account id) | Data model | Contract entity design; registration flow finalisation | TBD | Decide after offline spike; update data model draft |
| Image retention period | Privacy / data | Production image lifecycle; consent wording | TBD | Draft retention ADR with privacy review |
| Offline conflict resolution | Sync | Offline sync milestone; mobile framework ADR | TBD | Exercise conflicts in offline spike; document outcomes |
| Offline sync strategy (push, pull, hybrid) | Sync | Real offline milestone; mobile app pilot | TBD | Spike outcomes; draft sync ADR |
| Image compression target for field uploads | Media | Production image pipeline; bandwidth on low connectivity | TBD | Agree with Field Officer; document in contract |
| AI confidence threshold for automated replies | AI | ADR 013 implementation; Plant Doctor production | TBD | Align with agronomists and ADR 013 |
| Kenya data-protection review before production | Privacy / legal | Phase 5 go-live; farmer PII and photos | TBD | Legal review before pilot with real data |
| Content ownership (manual, photos, FAQs) | Content / legal | Content upload; third-party materials in learning centre | TBD | Confirm with human owner and staff |
| Backup and recovery strategy | Operations | Production hosting ADR; database selection | TBD | Draft with hosting and database ADRs |
| SMS cost and frequency caps | Notifications | Pilot; budget KES 350,000 | TBD | Model costs; ADR for notification provider |
| Per-user AI query limits | AI / cost | Additional tier AI assistant; API spend | TBD | Budget review against brief |
| Image retention policy (tickets and verifications) | Privacy / data | Production lifecycle; consent wording | TBD | Align with Field Officer and ADR 013 escalation paths |
| Confirmed location (county, sub-county, ward, village lists for dropdowns) | Registration / M&E | Phase 1 registration go-live; grant reporting | TBD | Project team supplies lists; reference data cites Kisumu County only |
| App-users target definition (80 — how measured?) | M&E / product | Grant reporting; success metrics | TBD | Agree with Briton Murithi Mbaya and Field Officer |
| Whether D1 hosting (KES 350,000) covers full 12 months or build only | Finance / ops | Hosting ADR; Months 8–12 operations | TBD | Clarify with funder and project lead |
| Content handover date for Ground Truth Manual, reference photos, 30 FAQs (brief: before Month 2) | Content | Demo accuracy; M2–4 build | TBD | Joy Odiambo, Rogerson Meme, Ronn Kenoly |
| Whether demo is presented to full project team or a subset | Governance | Pre-M2 approval | TBD | Briton Murithi Mbaya decides attendance and sign-off |