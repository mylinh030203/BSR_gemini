# Design review — BSR Market Intelligence prototype

Verdict: **PASS with findings** (no blocker). Independent review of the design prototype against `docs/PRD.md`, `docs/SCREENS.md` and `docs/design/specs/*`.

- Artifact: `docs/design/prototype/index.html` (hash-route SPA) with `assets/{app.js,data.js,styles.css}`, synthetic data labelled in the shell.
- Platform: web, desktop-first responsive. Reviewed at 1440×900 and 390×844, with role switching and interactive flows.
- Method: rendered inspection, interaction flows, axe-core 4.12.1 (WCAG 2.0/2.1/2.2 A+AA tags). Automated axe results are partial evidence, not a conformance verdict.

## Evidence ledger

Screenshots live under `.rai/screenshots/browser/`.

| ID | Check | Action | Observed | Status |
|---|---|---|---|---|
| L1-01 | Login `#login` | open at 390/1440 | 3 role cards, synthetic-data note | PASS |
| L1-02 | Overview `#overview` | open, inspect | tape, cards, chart, drivers, briefing; Leadership shows BSR margin, Internal swaps to RON95 | PASS |
| L1-03 | Market Data `#market-data` | open, select crack, compare | CS-GAS-2.1 card; same-unit compare note; table alternative works | PASS |
| L1-04 | News `#news` | open, filter, drawer | drawer separates original/summary/insight; duplicate linked; restricted item hidden for Internal | PASS |
| L1-05 | Forecast `#forecast` | open, recompute | immutable versions; missing actual shown as "missing", not zero; metrics recomputed correctly | PASS |
| L1-06 | Analysis `#analysis` | open | facts, calculations, assumptions, evidence ledger; correlation labelled not causal | PASS |
| L1-07 | Assistant `#assistant` | ask crack, ask physical | citation chips + tool trace; Internal refusal excludes restricted | PASS |
| L1-08 | Reports `#reports` | generate, preview, export gate | new version + preview + sources; export disabled for Leadership, enabled for MI | PASS |
| L1-09 | Admin `#admin` | open as MI | role matrix, sources, AI executions, audit; new run + audit entry appear | PASS |
| L1-10 | Permission boundary | switch to Internal | restricted hidden note; `#admin` denied; AI refusal | PASS |
| L1-11 | Responsive | 390×844, open nav | off-canvas nav, single column; minor footer clip (F7) | PASS w/ finding |
| L1-12 | Chart table | toggle | table alternative with unit headers | PASS |
| L1-13 | Quick input | MI, confirm | preview → confirm → toast + audit | PASS |
| L1-14 | Search | open | permission-scoped results | PASS |
| L1-15 | Notifications | open | 4 items with route actions | PASS |
| A11y-01 | Contrast | axe | 57 nodes below AA, e.g. nav label 3.09:1, policy note 3.53:1, breadcrumb/tape 3.43–3.73:1 | FAIL (sev 2) |
| A11y-02 | aria-hidden focus | axe + CSS | closed drawer/modal keep focusable children | FAIL (sev 2) |
| A11y-03 | Nested interactive | axe | chart `role="img"` contains focusable event markers | FAIL (sev 2) |
| A11y-04 | Manual keyboard/AT | — | not run | UNTESTED |
| L2-01 | Session-change consistency | compare surfaces | card/analysis session change vs table derived day-over-day differ under similar labels | FAIL (sev 2) |
| L2-02 | Upload error state | source | only empty-file guard; no size/type error | FAIL (sev 2) |
| L2-03 | Login invalid/loading | source + render | only default role cards | FAIL (sev 1) |
| L3-01 | Mobile footer | 390px | footer text clips at card edge | FAIL (sev 1) |

## Findings

**F1 — Severity 2 — Two different "change" values for one instrument, under-labelled.**
Card/tape/analysis use the seeded session change (`assets/data.js:25`, `app.js:418`) while the Observations table derives change from consecutive series points (`app.js:581-584`). On Gasoline crack the header reads +0.62 / +3.50% while the latest table row reads -0.26; Brent +1.07 vs +4.08. Correction: label the table column "Δ vs prior observation" and state the distinction, or derive both from one source.

**F2 — Severity 2 — Muted text fails WCAG AA contrast.**
`--ink-400` (#71858a) on paper is 3.43:1; nav label 3.09:1; policy note 3.53:1 (`styles.css:7,122,138`). Correction: darken muted ink to ≈#5c6f74 and lift sidebar muted text to ≥4.5:1, then re-audit.

**F3 — Severity 2 — Closed drawer/modal keep focusable children.**
`app.js:258-267` marks overlays `aria-hidden="true"`; `styles.css:563-580` hides them off-screen/opacity 0 without `visibility`/`inert`. Correction: use `inert`/`visibility:hidden` when closed, or remove tabbable nodes.

**F4 — Severity 2 — Chart exposes interactive markers inside `role="img"`.**
`app.js:345` (`svg role="img"`) contains `g tabindex=0 role=button` event markers. Correction: use a role that permits interactive children (e.g. `group`), or move markers to an adjacent focusable list; keep the table alternative.

**F5 — Severity 2 — Upload validation error state not demonstrated.**
`app.js:1563-1570` only guards an empty file; `accept` is set but no size/type error. US-04 requires a controlled error with nothing stored. Correction: add size/type error state with retained input and retry.

**F6 — Severity 1 — S0 invalid/loading states absent.**
Login renders only role cards. Correction: add a loading/validation demonstration, or document in `SCREENS.md` that demo login has no credential states.

**F7 — Severity 1 — Mobile footer clip.**
Footer text clips at 390px. Correction: allow wrapping or shorten.

## Lens verdicts

- L1 usability & access — PASS with findings (F2, F3, F4 are real access defects).
- L2 product requirements — PASS with findings (F1, F5, F6 are promise/label gaps).
- L3 presentation — PASS with one minor finding (F7).

**Aesthetic assessment.** The "research desk, not trading terminal" direction lands: warm paper, deep-petrol rail, copper accent reserved for attention, editorial serif headings against monospaced figures, thin rules and generous section rhythm. Hierarchy is clear (metric cards → chart → briefing → drivers), density is deliberate, AI surfaces are visibly distinct from source facts, and the login screen carries the identity well. Highest-value correction: muted-text contrast, then the two change figures.

## Remaining gaps

- Manual keyboard journey and screen-reader behavior were not run; axe is automated-only.
- `window.print` / Save-PDF output was not exercised (only the permission gate and audit path).
- File-upload confirm and the restricted-scope denial for Internal were source-verified, not clicked.
- Backend enforcement claims (RBAC, AI retrieval, export) are implementation obligations, untestable in a static prototype.
