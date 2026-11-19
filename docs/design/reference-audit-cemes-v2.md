# CEMES V2 reference audit

Status: Accepted — reference  
Owner: Dan  
Source: CEMES Website V2 source code (admin/, web/, docs/ui-conventions.md)  
Method: read-only source audit; rendered UI not re-verified (dev servers unavailable at audit time).  
Purpose: source of truth for how PalBpearl design conventions were derived. Not the rules the AI follows — see design-conventions.md for those.

This file is reference material only.

---

## Deliverable 1 — Audit scope and sources

**Repository audited:** CEMES Website V2 (local path used at audit time).

**Paths read:**

| Path | Role |
| --- | --- |
| `docs/ui-conventions.md` | Written UI rules; references living styleguide at `admin` → `/styleguide` |
| `admin/src/index.css` | Admin global tokens (`--cemes-*`, shadcn semantic roles, radius, typography base) |
| `web/src/app/globals.css` | Web global tokens (intended byte-for-byte sync with admin per `ui-conventions.md`) |
| `admin/components.json` | shadcn `new-york` / `neutral`, `lucide` icons, CSS at `src/index.css` |
| `web/components.json` | shadcn `new-york` / `neutral`, `lucide` icons, CSS at `src/app/globals.css` |

**Not audited at audit time:** running `admin/` or `web/` dev servers; `/styleguide` render; component TSX inventory beyond conventions doc; screenshots.

**PalBpearl linkage:** ADR-011 (“design reference v2”) points at CEMES V2 as the approved reference for roles; PalBpearl `design-conventions.md` and `tokens.md` express product-specific names and owner-supplied values.

**Sync drift observed (source only):** `admin/src/index.css` and `web/src/app/globals.css` are **not** identical at audit time. Examples: `web` defines `--cemes-coral-text`, `--cemes-amber-text`, `--font-sans`, `--font-mono`, and sets `body { font-weight: 500 }`; `admin` omits text-safe accent variables, uses literal `Manrope` on `body`, and includes `--cemes-info`. `ui-conventions.md` still requires keeping both files in sync.

---

## Deliverable 2 — Brand palette (from `docs/ui-conventions.md` §1)

Sourced from the **logo** and live `cemesltd.com` — not from scraping page CSS.

| Token (doc name) | Hex | Use |
| --- | --- | --- |
| Amber / Gold | `#FFBD3C` | Primary actions, active nav, highlights |
| Coral Red | `#FF5A5A` | Decorative accents — section eyebrows, icon tints, stat labels |
| Gray (mute) | `#6B7280` | Captions, secondary body text (`--cemes-mute` / `text-muted-foreground`) |
| Gray | `#A8A8A8` | Logo gray, borders, dividers |
| Ink | `#202020` | Headings and body text (doc); see CSS `--cemes-ink` variants below |
| Muted bg | `#F5F5F5` | Section / muted surfaces |
| Surface | `#FFFFFF` | Page and raised surfaces (menus, modals) |

**Functional / system only (not brand):** Success `#15803D`, Warning `#D9930A`, Danger `#FF4D4E`, Neutral `#6B7280`.

**Explicit exclusion:** Navy `#182978` is **not** CEMES — removed; text is ink, not navy.

**CSS raw palette (`:root` in both globals, lowercase hex):**

| CSS variable | Value | Notes |
| --- | --- | --- |
| `--cemes-amber` | `#ffbd3c` | Primary action fill |
| `--cemes-amber-deep` | `#d9930a` | Warning / link emphasis in prose |
| `--cemes-amber-soft` | `#fff5dc` | Soft backgrounds |
| `--cemes-coral` | `#ff4d4e` | Destructive / accent fill |
| `--cemes-coral-soft` | `#ffe9e9` | Soft coral bg |
| `--cemes-coral-text` | `#d02829` | **web only** — text-safe coral |
| `--cemes-amber-text` | `#a35709` | **web only** — text-safe amber |
| `--cemes-ink` | `#0f1117` | Primary ink in CSS |
| `--cemes-text` | `#1f2330` | Body text |
| `--cemes-mute` | `#6b7280` | Mute |
| `--cemes-line` | `#e5e7eb` | Borders |
| `--cemes-line-soft` | `#f1f2f4` | Soft lines |
| `--cemes-surface` | `#ffffff` | Surface |
| `--cemes-surface-alt` | `#fafbfc` | Alt surface |
| `--cemes-success` | `#15803d` | Success |
| `--cemes-success-soft` | `#dcfce7` | Success soft bg |
| `--cemes-info` | `#3b82f6` | **admin only** at audit time |

---

## Deliverable 3 — Semantic design tokens (from `docs/ui-conventions.md` §2 + CSS)

Token files (intended identical): `admin/src/index.css`, `web/src/app/globals.css`.

- `--cemes-*` — raw brand palette.
- shadcn semantic roles map onto brand (consume via Tailwind e.g. `bg-primary`, never literal hex in components).

| Semantic role | Value (light `:root`) | Notes |
| --- | --- | --- |
| `--primary` | `#ffbd3c` (amber) | Dominant action |
| `--primary-foreground` | `#202020` (ink) | **Ink, not white** — white-on-amber fails WCAG |
| `--accent` | `#fff5dc` | Soft amber hover/active |
| `--destructive` | `#ff4d4e` (coral) | `--destructive-foreground: #ffffff` |
| `--ring` | `#ffbd3c` | Focus rings |
| `--muted` / `--border` | grays (`#f1f2f4`, `#e5e7eb`, etc.) | Surfaces and dividers |
| `--background` | `#ffffff` | Page bg |
| `--foreground` | `#0f1117` | Default text |
| `--radius` | `0.375rem` (6px) | Base; Tailwind `@theme inline` derives `radius-sm/md/lg/xl` |

**Rule of thumb (doc):** never hardcode hex in a component; add `--cemes-*` + semantic mapping in **both** globals if missing.

---

## Deliverable 4 — Typography (from `docs/ui-conventions.md` §3 + CSS)

| Rule | Source detail |
| --- | --- |
| Sans font | **Manrope** on `body` (`admin`: direct stack; `web`: `var(--font-sans)` → Manrope) |
| Mono | **JetBrains Mono** via `.font-mono-tabular` / `--font-mono` (web) |
| Eyebrow | `text-xs font-semibold uppercase tracking-widest` in **`--cemes-coral`**; `SectionEyebrow` in `web/` |
| Headings | ink, `font-bold tracking-tight` |
| Body | ink |
| Captions | `text-muted-foreground` |
| Prose (admin markdown) | `.cemes-prose` 15px / 1.7; h1 1.75rem/600; mobile `@media (max-width: 640px)` reduces sizes |
| Web body weight | `font-weight: 500` on `body` (comment: 400 reads thin) |

No single shared type-scale token table in CSS beyond prose and Tailwind defaults; spacing for sections referenced as `space-y-8` in layout rules.

---

## Deliverable 5 — Layout and composition (from `docs/ui-conventions.md` §4)

- Default to **no container**; separate regions with heading + `space-y-8` or `border-t`, not four-sided boxes.
- **Card** only for a discrete “thing”, not a region; **never nest cards**.
- **Tables full-bleed** — no card wrapper; hairline top/bottom, quiet header.
- **One elevation, rarely** — shadows for floating UI (dropdown, popover, toast, modal) only.
- **Group with alignment**, not chrome.
- **Editing on a route**, not in modal — forms at `/…/new`, `/…/:id/edit`; overlays for short interrupts only; heuristic: **>2 fields or deep-linkable → page**.

Admin described as **serious financial-ops console** — quiet, data-forward, document-like (not SaaS landing card grid).

---

## Deliverable 6 — Components, icons, mandatory states (from `docs/ui-conventions.md` §5–§6 + components.json)

**Library:** shadcn **new-york** / **neutral**; add via `npx shadcn@latest add <x>`; no hand-rolled duplicate Button/Input; shared components in **both** apps.

**Icons:** `lucide-react` only (components.json `iconLibrary: lucide`). No FontAwesome.

**Buttons:** one `default` (amber) primary per view; `secondary` / `outline` / `ghost` elsewhere; `destructive` for irreversible.

**Mandatory states on data screens:**

| State | Pattern |
| --- | --- |
| Loading | Skeletons (not spinners) for tables/lists |
| Empty | Short message + primary next action |
| Error | Inline + retry; `sonner` toast for transient failures |
| Success | Toast for writes |

---

## Deliverable 7 — Accessibility (from `docs/ui-conventions.md` §7 + PalBpearl tokens)

| Rule | CEMES source |
| --- | --- |
| Amber/coral vs white text | Fail contrast as text colours; text on amber = **ink**; destructive button = white on coral (short, bold labels) |
| Focus | Amber `ring`; do not remove outlines |
| Hit target | ≥ **40px** (`h-10` default button height) |

**PalBpearl tokens (`tokens.md`) record `contrast-minimum` 4.5:1 and `touch-target-minimum` **44px** — stricter than CEMES 40px; PalBpearl `design-conventions.md` follows tokens for product rules.

---

## Mapping table — CEMES V2 → PalBpearl `design-conventions.md` / `tokens.md`

| CEMES source | CEMES value / rule | PalBpearl convention (`design-conventions.md`) | PalBpearl token (`tokens.md`) | Notes |
| --- | --- | --- | --- | --- |
| `--primary` / amber | `#ffbd3c` | Colour role: Brand primary | `color-brand-primary` | PalBpearl hex TBD until owner |
| `--cemes-coral` decorative / eyebrows | `#ff5a5a` / `#ff4d4e` | Brand secondary or Accent | `color-brand-secondary`, `color-accent` | Coral split decorative vs destructive in CEMES |
| `--accent` soft amber | `#fff5dc` | Accent (subtle UI) | `color-accent` | |
| `--background` | `#ffffff` | Background | `color-background` | |
| `--cemes-surface` / `--card` | `#ffffff` | Surface | `color-surface` | |
| `--popover` / elevated menus | `#ffffff` | Surface elevated | `color-surface-elevated` | |
| `--foreground` / `--cemes-ink` | `#0f1117` | Text primary | `color-text-primary` | Doc ink `#202020` on primary-foreground |
| `--muted-foreground` / `--cemes-mute` | `#6b7280` | Text secondary | `color-text-secondary` | |
| `--primary-foreground` | `#202020` | Text on brand | `color-text-on-brand` | |
| `--border` / `--cemes-line` | `#e5e7eb` | Border | `color-border` | |
| `--cemes-line` / dividers | hairline rules | Divider | `color-divider` | Gray `#A8A8A8` in doc for logo gray/dividers |
| `--cemes-success` | `#15803d` | Success | `color-success` | |
| `--cemes-amber-deep` / Warning doc | `#d9930a` | Warning | `color-warning` | |
| `--destructive` | `#ff4d4e` | Error | `color-error` | |
| `--cemes-info` (admin) | `#3b82f6` | Info | `color-info` | Not in ui-conventions §1 brand table |
| `--ring` | `#ffbd3c` | Focus ring | `color-focus-ring` | |
| Manrope | body font | Typography roles | `font-sans` TBD | |
| JetBrains Mono | tabular/mono | Typography / code | `font-mono` TBD | |
| lucide-react | icons only | Iconography | `icon-family` = lucide-react | |
| `--radius` + `@theme` sm/md/lg | `0.375rem` base | Shape and elevation | `radius-sm` 4px, `radius-md` 8px, `radius-lg` 12px | PalBpearl scale partially filled |
| Shadow rule | rare, floating only | Shape and elevation | `shadow-sm`, `shadow-md` TBD | |
| `space-y-8`, Tailwind spacing | layout | Spacing and layout | `spacing-0`…`spacing-8` | PalBpearl documents 4px scale |
| WCAG AA / ring / 40px targets | §7 | Accessibility expectations | `contrast-minimum`, `touch-target-minimum` | PalBpearl 4.5:1 and 44px |
| Tone: plain, farmer-first | N/A (CEMES B2B console tone differs) | Tone and voice | — | PalBpearl farmer-first copy rules added in product doc |
| Card/table/layout rules | §4 | Spacing and layout (mobile-first single column) | — | PalBpearl admin may adapt “open page” rules |
| shadcn new-york | components.json | How this becomes code (Tailwind + CSS variables) | — | ADR-010 provisional Next.js + Tailwind |
| Mandatory UI states | §6 | — | — | Implement in Phase 1 screens |
| Never hardcode hex | §2 rule | design-conventions + tokens as SoT | tokens.md | |
| Styleguide `/styleguide` | §8 | — | — | PalBpearl has no styleguide route in Phase 0 |