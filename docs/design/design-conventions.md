# PalBpearl design conventions

Status: Accepted  
Owner: Dan  
Derivation: see [reference-audit-cemes-v2.md](reference-audit-cemes-v2.md)  
Values: see [tokens.md](tokens.md)

Operational rules for anyone (including AI) building PalBpearl UI. Read `tokens.md` for values; read the audit for provenance only.

## 1. Hard rules (the AI must not break these)

- Use only colour tokens from `tokens.md` (via theme or CSS variables). Never hardcode a hex in a component.
- Use semantic tokens (`color-brand-primary`, `color-success`, and so on) by **role**, not by appearance.
- Show **one** primary action per screen (`color-brand-primary`); put every other action in secondary, outline, or ghost styles.
- On farmer-facing screens, make every interactive control at least **48dp** on its shorter side (outdoor use, gloves; see §3).
- On farmer-facing screens, never go below **16sp** body (`type-body`); use **18–20sp** for step titles and critical instructions (`type-heading-2` / `type-heading-3` when set).
- Give every icon in a farmer flow a visible text label; do not rely on icon-only actions for primary tasks.
- Put every form field label above the field; never use placeholder-only labelling.
- Write every error in plain language, state what happened, and say what to do next; do not blame the farmer.
- For every offline-capable or queueable action, show an explicit **offline**, **queued**, or **syncing** state (not a silent failure).
- Require confirmation before every destructive action (`color-error` / destructive control).
- Never rely on colour alone for status: pair `color-success`, `color-warning`, and `color-error` with icon **and** text.
- Keep visible focus indicators on all keyboard-focusable controls (`color-focus-ring`, `contrast-minimum` in `tokens.md`).

## 2. Where PalBpearl copies CEMES

| Practice | Source in CEMES audit | PalBpearl applies to |
| --- | --- | --- |
| Token layer, no inline hex | Deliverable 3 | Web demo + admin via Tailwind/CSS variables |
| shadcn primitives, no duplicate Button/Input | Deliverable 6 | Web admin and Phase 1 web demo |
| `icon-family` = lucide-react | Deliverable 6; mapping table | Web admin; web farmer prototype |
| One primary button per view | Deliverable 6 | All screens |
| Loading / empty / error / success states | Deliverable 6 | Every data screen (lists, queues, dashboards) |
| Skeletons for list/table loading | Deliverable 6 | Farmer lists, admin queues, manuals index |
| Inline error + retry; toast for transient success/failure | Deliverable 6 | Forms, uploads, saves |
| Open page layout, tables full-bleed, no nested cards | Deliverable 5 | Admin dashboard |
| Multi-field edit on a route, not in a dialog | Deliverable 5 | Admin create/edit flows |
| Focus ring preserved | Deliverable 7 | All interactive UI |
| `spacing-*` and `radius-*` from tokens | Mapping table | Layout and components |
| Farmer-first tone (extended) | Mapping table (tone row) | All farmer copy |

## 3. Where PalBpearl diverges from CEMES

| Area | CEMES | PalBpearl | Reason |
| --- | --- | --- | --- |
| Brand action colour | Amber primary (Deliverable 2–3) | `color-brand-primary` (green) | Mushroom / PalBpearl brand (ADR-011) |
| Buttons | 40px hit target (Deliverable 7) | **48dp** on farmer screens | Outdoors, gloves, low precision |
| Typography | 15px prose / Tailwind defaults (Deliverable 4) | **16sp** body min; **18–20sp** on steps | Low literacy, bright sun |
| Farmer navigation | Top nav / public header patterns | **Bottom nav, 5 items** | Mobile-first farmer Android |
| Section eyebrow | Coral accent (Deliverable 4) | **Green-tinted eyebrow** (`color-brand-secondary` or `color-accent`) | Brand; not financial coral |
| Login layout | Centred card (typical pattern) | **Open layout** on `color-background` | Align with Deliverable 5; avoid “boxed SaaS login” |
| Cards | Cards on marketing / regions | **Full-width lists** on farmer flows; cards only for single “things” | Field use, less chrome |
| Icons | lucide only | **lucide** (web admin + web demo) + **Material Symbols or agri icons** (Flutter) | Platform and field semantics |
| Touch token | 40px source | Farmer **48dp**; `touch-target-minimum` 44px elsewhere | Farmer vs staff (see `tokens.md`) |
| Success vs brand | Success green in palette (Deliverable 2) | **`color-success` only for status**, never for primary CTAs | Avoid “healthy = brand” confusion |

## 4. Colour semantics

Per ADR-011. Values live in `tokens.md`; this table is **how** to use roles.

- **Brand primary (earth brown)** is the **only** colour used for **primary CTAs** (`color-brand-primary` with `color-text-on-brand`).
- **Success** (`color-success`, green `#15803D`) is reserved for **plant health** and **completed status**. Never use brand colours for success.
- **Warning** stays amber (`color-warning`). **Error** stays red (`color-error`).
- **Plant Doctor:** “healthy” uses **`color-success` + check icon + label** — never brand colours.
- **Colour is never the sole carrier of meaning** — always pair status colours with icon and text.

| Role | Token | Use | Never use for |
| --- | --- | --- | --- |
| Brand / action (earth brown) | `color-brand-primary` | **Only** primary CTAs, one per screen; active nav emphasis on primary action | Success, plant health, warning, error, or Plant Doctor “healthy” |
| Brand support | `color-brand-secondary` | Supporting brand UI, secondary emphasis, green-tinted eyebrows | Primary CTAs or status semantics |
| Accent | `color-accent` | Eyebrows, subtle highlights, hover backgrounds, focus emphasis | Body text, status without icon+label, primary buttons |
| Background | `color-background` | Page canvas (warm off-white) | Text without a text token |
| Surface | `color-surface` | Rows, panels, list backgrounds | Floating overlays (use elevated) |
| Surface elevated | `color-surface-elevated` | Modals, menus, sheets | Default list rows |
| Text primary | `color-text-primary` | Headings, body on background and surface | On primary buttons (use `color-text-on-brand`) |
| Text secondary | `color-text-secondary` | Captions, hints | Sole means of conveying errors or status |
| Text on brand | `color-text-on-brand` | Label on `color-brand-primary` only | On success, warning, or error fills |
| Border | `color-border` | Inputs, field outlines | Status meaning alone |
| Divider | `color-divider` | Section separators | Alerts or status |
| Success (plant health) | `color-success` | Plant health, verified OK, completed steps, synced | Primary CTAs, brand decoration, eyebrows |
| Warning | `color-warning` | Caution, review needed (amber) | Success, primary actions, plant “healthy” |
| Error | `color-error` | Failures, destructive confirm | Success, Plant Doctor healthy, primary CTAs |
| Info | `color-info` | Neutral information | Errors, success, or CTAs |
| Focus ring | `color-focus-ring` | Keyboard focus | Replacing semantic status colour |

## 5. Screen-level rules

### Farmer mobile screens

- Every list screen defines **loading**, **empty**, **error**, and **offline/queued** states (audit Deliverable 6, extended for sync).
- Every image upload shows **compression** (if applied), **upload progress**, and **failure + retry**.
- Registration uses County / Sub-county / Ward / Village controls with **placeholder lists** until content is supplied; show “list not loaded” not a silent empty dropdown.
- Learning centre and guides render offline content with a clear **last updated** or **available offline** badge when cached.
- Plant Doctor: camera permission rationale before capture; show thumbnail, upload state, and result with **success/warning/error** pattern from §4.
- Bottom nav: **exactly five** primary destinations; no duplicate primary action in the page header and nav.
- Stub screens (Additional / Phase 2) must still show **“Coming in Phase 2”** plus non-interactive preview, not broken links.

### Admin dashboard screens

- Every queue (tickets, darkroom verification, farmers) defines **loading**, **empty**, **error**, and **retry**; use skeletons for tables (Deliverable 6).
- Tables are **full-bleed** with hairline headers; do not wrap an entire queue in a card (Deliverable 5).
- Filters sit above the table with labels; applying filters must be obvious and resettable.
- Content upload and market price editors show **save success toast** and **inline validation** errors.
- Multi-field edits use **dedicated routes**; use dialogs only for delete confirm or single-field prompts (Deliverable 5).
- Permission-sensitive actions hide or disable with explanation, not silent omission.

## 6. What NOT to copy from CEMES

- Amber/coral **financial** brand as PalBpearl primary (amber remains **`color-warning` only** where needed).
- Card-heavy **marketing contact** layouts on farmer flows.
- Desktop-first **public header** as farmer mobile information architecture.
- **40px-only** buttons on farmer-facing controls (use 48dp).
- Centred **login card** as the default farmer entry pattern.
- Coral **section eyebrows** as brand signature (use green-tinted eyebrow per §3).
- Navy or legacy “template” heading colours from the audit’s excluded palette.

## 7. Enforcement

These rules are checked at code review using [../standards/review-checklist.md](../standards/review-checklist.md). A violation must be **fixed** or covered by an **ADR** and entry in [../decisions-log.md](../decisions-log.md) before merge. AI-generated UI that breaks §1 is not acceptable even for demo speed.