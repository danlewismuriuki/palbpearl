# PalBpearl design tokens

Status: Draft — awaiting review  
Owner: TBD

Raw values for the conventions in [design-conventions.md](design-conventions.md). Colour hex values match [../adr/011-design-conventions-and-tokens.md](../adr/011-design-conventions-and-tokens.md).

## Colour tokens

| Token | Value | Notes |
| --- | --- | --- |
| `color-brand-primary` | `#BC6C25` | Primary brand — earth brown (ADR-011) |
| `color-brand-secondary` | `#2D6A4F` | Secondary (ADR-011) |
| `color-accent` | `#40916C` | Accent / eyebrow (ADR-011) |
| `color-background` | `#F8F6F1` | Warm off-white, outdoor use (ADR-011) |
| `color-surface` | `#FFFFFF` | |
| `color-surface-elevated` | `#FBF9F4` | |
| `color-text-primary` | `#1A2E24` | |
| `color-text-secondary` | `#5C6F65` | |
| `color-text-on-brand` | `#FFFFFF` | Primary foreground on brand (ADR-011) |
| `color-border` | `#DDE5E1` | |
| `color-divider` | `#E8EDEA` | |
| `color-success` | `#15803D` | Status only; icon + label |
| `color-warning` | `#D9930A` | Amber family |
| `color-error` | `#C53030` | Error / destructive |
| `color-focus-ring` | `#40916C` | |
| `color-info` | `#3B82F6` | |

## Font family tokens

| Token | Value | Notes |
| --- | --- | --- |
| `font-sans` | `"Inter", system-ui, sans-serif` | Primary UI typeface stack |
| `font-mono` | `"JetBrains Mono", ui-monospace, monospace` | Monospace stack |

## Typography tokens

Uses `font-sans` unless a role specifies otherwise.

| Token | Font family | Size | Weight | Line height |
| --- | --- | --- | --- | --- |
| `type-display` | `font-sans` | 28px | 700 | 1.2 |
| `type-heading-1` | `font-sans` | 24px | 700 | 1.25 |
| `type-heading-2` | `font-sans` | 20px | 600 | 1.3 |
| `type-heading-3` | `font-sans` | 18px | 600 | 1.35 |
| `type-body` | `font-sans` | 16px | 400 | 1.5 |
| `type-body-small` | `font-sans` | 14px | 400 | 1.5 |
| `type-label` | `font-sans` | 14px | 500 | 1.4 |
| `type-caption` | `font-sans` | 12px | 400 | 1.4 |
| `type-button` | `font-sans` | 16px | 600 | 1 |

## Type size (product surfaces)

| Surface | Rule |
| --- | --- |
| Farmer flows | 16sp minimum body; 18–20sp on instructional steps (`type-heading-2` / `type-heading-3`) |
| Admin web | 14px minimum body (`type-body-small` or larger) |

## Spacing scale

Base step **4px**.

| Token | Value |
| --- | --- |
| `spacing-0` | 0 |
| `spacing-1` | 4px |
| `spacing-2` | 8px |
| `spacing-3` | 12px |
| `spacing-4` | 16px |
| `spacing-5` | 20px |
| `spacing-6` | 24px |
| `spacing-8` | 32px |
| `spacing-10` | 40px |
| `spacing-12` | 48px |

## Radius

| Token | Value |
| --- | --- |
| `radius-sm` | 4px |
| `radius-md` | 8px |
| `radius-lg` | 12px |
| `radius-full` | 9999px |

## Shadow

| Token | Value |
| --- | --- |
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.08)` |
| `shadow-lg` | `0 12px 32px rgba(0,0,0,0.12)` |

## Breakpoints

| Token | Value |
| --- | --- |
| `breakpoint-sm` | 640px |
| `breakpoint-md` | 768px |
| `breakpoint-lg` | 1024px |
| `breakpoint-xl` | 1280px |
| `layout-max-content` | 1152px (max-w-6xl) |

## Iconography

| Token | Value | Notes |
| --- | --- | --- |
| `icon-family-web-admin` | lucide-react | Web admin and Phase 1 web demo |
| `icon-family-flutter` | Material Symbols | Farmer app; text labels required on farmer flows |

## Touch targets

| Token | Value | Notes |
| --- | --- | --- |
| `touch-target-farmer` | 48dp | Farmer flows minimum |
| `touch-target-admin` | 44px | Admin web minimum |

## Accessibility tokens

| Token | Value | Notes |
| --- | --- | --- |
| `contrast-minimum` | 4.5:1 | Text and interactive elements |
