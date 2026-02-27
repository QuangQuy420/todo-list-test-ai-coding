# Execution Plan: UI Improvement — Full Project

Epic: hdkit-project-1-2j3
Generated: 2026-02-27

---

## Bead Summary

| Bead ID | Title | Priority | Blocked By |
|---------|-------|----------|------------|
| hdkit-project-1-2lj | Add violet/indigo accent color tokens to globals.css | P1 | — (start here) |
| hdkit-project-1-18b | Retheme page background gradient to violet/indigo and remove stray h1 | P2 | 2lj |
| hdkit-project-1-1wz | Add app branding to layout.tsx header with glass-header styling | P2 | 2lj |
| hdkit-project-1-2yu | Collapse datetime picker behind CalendarDays toggle in todo-form.tsx | P2 | 2lj |
| hdkit-project-1-y1e | Harmonize TodoItem with glass-surface and replace inline SVG with Trash2 | P2 | 2lj |
| hdkit-project-1-3cb | Stretch FilterTabs to full width with violet accent on active tab | P2 | 2lj |
| hdkit-project-1-buy | Replace empty state in todo-list.tsx with ClipboardList icon and styled copy | P3 | — (independent) |
| hdkit-project-1-1mx | Create TodoProgress component and wire into page.tsx | P2 | 2lj + 18b |
| hdkit-project-1-1jb | Visual QA: verify all UI improvements compose correctly in light/dark modes | P3 | all 8 above |

---

## Tracks

| Track | Agent | Beads (in order) | File Scope |
|-------|-------|-----------------|------------|
| 1 | BlueLake | 2lj → 18b → 1mx | `src/app/globals.css`, `src/app/page.tsx`, `src/components/todo-progress.tsx` |
| 2 | GreenCastle | 2lj (wait) → 1wz | `src/app/layout.tsx` |
| 3 | RedStone | 2lj (wait) → 2yu | `src/components/todo-form.tsx` |
| 4 | PurpleBear | 2lj (wait) → y1e, 3cb | `src/components/todo-item.tsx`, `src/components/filter-tabs.tsx` |
| 5 | SilverMountain | buy | `src/components/todo-list.tsx` |

Note: Beads 2-6 all unblock after Bead 1 (accent tokens) completes. A single worker can do all 9 serially; the track split is for parallel execution.

---

## Track Details

### Track 1: BlueLake — Core theme + page

**File scope**: `src/app/globals.css`, `src/app/page.tsx`, `src/components/todo-progress.tsx`

**Beads**:
1. `hdkit-project-1-2lj` — Add accent color tokens (FOUNDATIONAL — do first)
2. `hdkit-project-1-18b` — Retheme gradient + remove h1 from page.tsx
3. `hdkit-project-1-1mx` — Create TodoProgress + wire into page.tsx

### Track 2: GreenCastle — Header

**File scope**: `src/app/layout.tsx`
**Wait for**: hdkit-project-1-2lj (accent tokens needed for text-accent-violet)

**Beads**:
1. `hdkit-project-1-1wz` — Header branding (glass-header + CheckSquare + wordmark)

### Track 3: RedStone — Form

**File scope**: `src/components/todo-form.tsx`
**Wait for**: hdkit-project-1-2lj

**Beads**:
1. `hdkit-project-1-2yu` — Collapse datetime picker behind CalendarDays toggle

### Track 4: PurpleBear — Components

**File scope**: `src/components/todo-item.tsx`, `src/components/filter-tabs.tsx`
**Wait for**: hdkit-project-1-2lj

**Beads**:
1. `hdkit-project-1-y1e` — TodoItem glass-surface harmonization + Trash2 icon
2. `hdkit-project-1-3cb` — FilterTabs full-width + violet accent active tab

### Track 5: SilverMountain — Empty state (independent)

**File scope**: `src/components/todo-list.tsx`
**No blockers** — can start immediately in parallel with Track 1

**Beads**:
1. `hdkit-project-1-buy` — Empty state icon + styled copy

---

## Cross-Track Dependencies

- Tracks 2, 3, 4 all wait for Track 1 Bead 1 (2lj) to complete
- Track 1 Bead 3 (1mx / TodoProgress) also waits for Track 1 Bead 2 (18b)
- Track 5 (SilverMountain) has no cross-track dependencies
- QA bead (hdkit-project-1-1jb) runs after ALL tracks complete

---

## Key Design Decisions (from spikes/approach)

- **No spikes needed** — all changes are LOW/MEDIUM risk (familiar patterns, no external deps)
- **Accent color**: violet/indigo `oklch(0.6 0.22 270)` — registered as `--accent-violet` in globals.css
- **Checkbox + Button default** auto-adopt violet via `--primary` cascade (no component changes needed)
- **Progress bar**: CSS transition (not Framer Motion) to avoid LazyMotion scope boundary issues
- **Form collapse**: local `useState` — NOT Zustand (ephemeral UI state)
- **TodoItem**: `glass-surface border-transparent` — if light mode looks washed out, fall back to `bg-white/5 border-white/10`

---

## Starting Point

**Start with**: `hdkit-project-1-2lj` (P1, no blockers) — accent tokens are the critical path foundation.

After 2lj closes: **5 beads unblock simultaneously** (18b, 1wz, 2yu, y1e, 3cb).

`hdkit-project-1-buy` can be done at any time (no deps).
