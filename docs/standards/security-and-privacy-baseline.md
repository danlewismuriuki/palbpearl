# Security and privacy baseline

Status: Draft — awaiting review  
Owner: TBD

## Sensitive farmer data

PalBpearl handles data that farmers may consider private, including **phone numbers**, **location**, and **crop images**. Treat this information as sensitive in design, documentation, and future implementation.

## Data minimisation and purpose

- Collect only what is **needed** for the stated feature
- State **why** each field or permission is requested before collection
- Do not **share** farmer data silently with third parties; any sharing must be explicit, documented, and consented where required

## Secrets and credentials

- **Secrets never belong in the repository** (keys, passwords, tokens, private certificates)
- Do not embed **credentials in documents**; describe configuration requirements without values
- **No production credentials, keys, or tokens** in this repository at any time

## Images and consent

Crop and farm images may contain **personal or identifying information** (people, landmarks, licence plates, and similar). User-facing **consent wording** for capture, storage, and use will be needed before production features ship. Wording: **TBD**.

## Production readiness

Before any **production** deployment serving real farmers, the project must review **Kenya data-protection requirements** applicable to the product and operations. This baseline does not restate legal text; legal and operational review is required when moving beyond the demo.

## Documentation and demos

Demo and mock data should avoid real phone numbers, real locations, and identifiable images unless explicitly approved for a controlled test environment.