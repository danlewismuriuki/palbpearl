# Data model draft

Status: Draft — awaiting review  
Owner: TBD

> **DRAFT:** This entire document is draft material. Entities and fields will change after the **mobile offline spike**. Do not treat this model as final schema or contract until reviewed and reflected in the shared API contract.

## Purpose

This draft names the main **entities** PalBpearl is likely to need so that contract design, mocks, and UI flows can be discussed before a database or ORM is chosen. Field types and storage details are intentionally omitted.

## Entities

### Farmer

A person who registers to use PalBpearl, submits crop information, and receives AI-assisted guidance.

**Key fields (conceptual):** identifier, display name, phone contact, registration status, locale or language preference, consent flags for image use.

### Farm

A farm or plot associated with a farmer, used to organise submissions and location context.

**Key fields:** identifier, farmer reference, label or name, location description or coordinates (as agreed for privacy), crop types or focus areas.

### Submission

A farmer’s request for assistance tied to a point in time, typically including one or more images and optional notes.

**Key fields:** identifier, farmer reference, farm reference (optional), status, submitted at, free-text notes, links to images.

### Image

A crop or field photograph attached to a submission.

**Key fields:** identifier, submission reference, capture timestamp, storage reference (URL or key, to be decided by ADR), optional thumbnail reference, content metadata (size, format).

### AIResult

The outcome of AI analysis linked to a submission (guidance text, classifications, or similar).

**Key fields:** identifier, submission reference, result payload (structure TBD in contract), generated at, optional confidence or source metadata.

### AdminUser

A staff member who uses the admin dashboard to review farmers, submissions, or system health.

**Key fields:** identifier, name, role or permission summary, authentication subject reference (provider TBD).

### Notification

An outbound or in-app notice to a farmer or admin (status updates, guidance ready, staff actions).

**Key fields:** identifier, recipient reference (farmer or admin), channel intent (in-app, SMS, push — deferred), body summary, read or delivery status, created at.

### DarkroomVerification

Staff or agronomist review of a farmer’s darkroom setup against brief criteria.

**Key fields:** identifier, farmer reference, darkroom reference or location summary, submitted at, status (pending, approved, rejected, needs follow-up), reviewer reference (admin or agronomist), notes, link to evidence photos.

### TicketPhoto

Photograph attached to a technical support ticket (Plant Doctor flow).

**Key fields:** identifier, ticket reference, capture timestamp, storage reference (deferred), optional thumbnail reference, description or farmer caption.

### Reminder

Scheduled or rule-based production reminder for a farmer (Additional tier in brief).

**Key fields:** identifier, farmer reference, reminder type, scheduled at, delivered at (optional), read status, body summary, related guide or production step reference.

### MarketPrice

Market information or staff-edited price guidance for farmers (Phase 2 / admin placeholder in demo).

**Key fields:** identifier, product or grade label, price amount and currency, effective from, effective to (optional), region or market channel label, last updated by (admin reference).

## Unresolved modelling questions

- **Farmer identity key:** Is the primary identity a phone number, a separate account identifier, or both?
- **Offline-created record identity:** How are records created offline assigned stable identifiers before sync?
- **Image retention:** How long are images kept, and what triggers deletion or archival?
- **AIResult versioning:** If guidance is regenerated, is the previous AIResult retained, superseded, or versioned explicitly?

## Related documents

- [api-contract-principles.md](api-contract-principles.md) — how entities surface in the shared contract
- [architecture-overview.md](architecture-overview.md) — layer model and Phase 1 modules