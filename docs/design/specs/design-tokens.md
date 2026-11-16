# Design tokens — BSR Market Intelligence

## Color

| Token | Value | Role |
|---|---|---|
| `--ink-950` | `#0A1D24` | Page text, sidebar background |
| `--ink-800` | `#16343D` | Sidebar hover, strong headings |
| `--ink-600` | `#3F5960` | Secondary text |
| `--ink-400` | `#4B5F65` | Muted labels, metadata (≥4.5:1 on paper, surface, surface-2) |
| `--paper` | `#F4F1E9` | App background |
| `--surface` | `#FCFBF7` | Cards, panels |
| `--surface-2` | `#EDE9DF` | Recessed areas, table headers |
| `--line` | `#D9D3C6` | Hairline borders |
| `--line-strong` | `#BEB5A4` | Emphasized dividers |
| `--copper` | `#B45B2D` | Primary accent, selection, AI provenance |
| `--copper-soft` | `#EAD2C1` | Accent wash |
| `--teal` | `#1D6A63` | Secondary data series, positive-neutral |
| `--positive` | `#2C7656` | Price up / success |
| `--negative` | `#AC423C` | Price down / error |
| `--warning` | `#9A6A18` | Delayed, pending, caution |
| `--restricted` | `#75405F` | Restricted classification |
| `--focus` | `#2C6E9C` | Focus ring |
| `--white` | `#FFFFFF` | Elevated surfaces |

Semantic red/green are reserved for direction and validation, never decoration. Classification uses a muted label + icon, not color alone.

## Type

- Display: `"Be Vietnam Pro", "Noto Serif", Georgia, "Times New Roman", serif` — page titles, briefing headlines, report titles. The lead family must carry Vietnamese stacked diacritics (ấ ầ ể ữ ộ); Be Vietnam Pro is loaded from Google Fonts with a dedicated `vietnamese` subset, and display tracking stays at or above −0.01em so accents are not clipped.
- Body/UI: `"Be Vietnam Pro", "Segoe UI", Aptos, system-ui, -apple-system, sans-serif` — navigation, labels, prose.
- Figures: `"Cascadia Mono", "SFMono-Regular", Consolas, monospace` — prices, percentages, timestamps, IDs.
- Scale: 11 / 12 / 13 / 14 / 16 / 20 / 28 / 38 px. Page title 38px desktop, 30px narrow. Table text 13px. Metadata 11–12px.
- Weights: 400 body, 500 emphasis, 600 labels, 700 figures. Display uses 400/500 only.

## Space, shape, elevation

- 4px base; common steps 4, 8, 12, 16, 20, 24, 32, 48.
- Radius: 2px controls, 4px cards, 999px pills. Avoid pill-heavy layouts.
- Border: 1px `--line`; selected state uses 2px copper inset or left rule.
- Shadow: `0 1px 2px rgba(10,29,36,.05), 0 8px 24px rgba(10,29,36,.06)` only for drawers/popovers.
- Density: compact but readable; 44px table rows, 56px nav items.

## Motion

- 120–180ms ease-out for drawers, hover, disclosure. Respect `prefers-reduced-motion`.
- No auto-rotating carousels or animated tickers.

## Charts

- Series: copper `#B45B2D`, teal `#1D6A63`, slate `#547078`, gold `#9A6A18`, plum `#75405F`.
- Grid: `#E2DDD1`; axis text `#4B5F65`; event marker: copper diamond with ink outline.
- Always label units; provide a table alternative; show missing data as gaps, not zero.
