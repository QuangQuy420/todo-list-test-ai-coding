# Execution Plan: Rainbow/Spectrum Colorful UI

Generated: 2026-02-27

## Summary

5 beads total. Bead 1 (token foundation) must go first, then 4 parallel beads across 2 tracks.

## Tracks

| Track | Agent | Beads (in order) | File Scope |
|---|---|---|---|
| 1 | BlueLake | hdkit-project-1-1e5 | `src/app/globals.css` |
| 2 | GreenCastle | hdkit-project-1-3hg → hdkit-project-1-1ds | `src/app/page.tsx`, `src/components/filter-tabs.tsx` |
| 3 | RedStone | hdkit-project-1-1y2 → hdkit-project-1-38k | `src/components/todo-item.tsx`, `src/components/todo-progress.tsx` |

## Track Details

### Track 1: BlueLake — Spectrum Design Tokens (Foundation)

**File scope**: `src/app/globals.css`
**Must complete before Tracks 2 and 3 start.**

**Bead**: `hdkit-project-1-1e5` — Spectrum color tokens in globals.css

**Implementation**:
1. Add to `@theme inline` block — register 7 spectrum color mappings:
   ```
   --color-spectrum-1: var(--spectrum-1);
   --color-spectrum-2: var(--spectrum-2);
   ... (1-7)
   ```
2. Add to `:root` — light mode OKLCH values:
   ```
   --spectrum-1: oklch(0.65 0.23 25);    /* coral/red */
   --spectrum-2: oklch(0.72 0.19 60);    /* orange */
   --spectrum-3: oklch(0.80 0.18 90);    /* amber */
   --spectrum-4: oklch(0.68 0.20 145);   /* green */
   --spectrum-5: oklch(0.70 0.18 195);   /* teal */
   --spectrum-6: oklch(0.62 0.20 240);   /* blue */
   --spectrum-7: oklch(0.60 0.22 290);   /* violet */
   ```
3. Add to `.dark` — dark mode (slightly lighter chroma-adjusted):
   ```
   --spectrum-1: oklch(0.70 0.23 25);
   --spectrum-2: oklch(0.76 0.19 60);
   --spectrum-3: oklch(0.83 0.18 90);
   --spectrum-4: oklch(0.72 0.20 145);
   --spectrum-5: oklch(0.74 0.18 195);
   --spectrum-6: oklch(0.67 0.20 240);
   --spectrum-7: oklch(0.65 0.22 290);
   ```

---

### Track 2: GreenCastle — Background + Filter Tabs

**File scope**: `src/app/page.tsx`, `src/components/filter-tabs.tsx`
**Starts after Track 1 completes.**

**Bead 1**: `hdkit-project-1-3hg` — Colorful background gradient in page.tsx

In `src/app/page.tsx`, replace the `<main>` background gradient classes:
- Light mode: `from-rose-100 via-violet-100 to-cyan-100` (soft pastel rainbow)
- Dark mode: Use dark oklch values aligned with spectrum palette
- Final class: `bg-gradient-to-br from-rose-100 via-violet-100 to-cyan-100 dark:from-[oklch(0.16_0.06_25)] dark:via-[oklch(0.13_0.06_270)] dark:to-[oklch(0.14_0.05_195)]`

**Bead 2**: `hdkit-project-1-1ds` — Filter tabs multi-color active states

In `src/components/filter-tabs.tsx`, give each tab its own active color:
- "All" tab: blue → `data-[state=active]:bg-[var(--color-spectrum-6)] data-[state=active]:text-white`
- "Active" tab: orange → `data-[state=active]:bg-[var(--color-spectrum-2)] data-[state=active]:text-white`
- "Completed" tab: green → `data-[state=active]:bg-[var(--color-spectrum-4)] data-[state=active]:text-white`

Also update badge backgrounds to match the tab's spectrum color at 20% opacity.

---

### Track 3: RedStone — Todo Items + Progress Bar

**File scope**: `src/components/todo-item.tsx`, `src/components/todo-progress.tsx`
**Starts after Track 1 completes (parallel with Track 2).**

**Bead 1**: `hdkit-project-1-1y2` — Todo item spectrum left-border color assignment

In `src/components/todo-item.tsx`:
1. Add helper above component:
   ```ts
   const SPECTRUM_COLORS = [
     'var(--color-spectrum-1)', 'var(--color-spectrum-2)', 'var(--color-spectrum-3)',
     'var(--color-spectrum-4)', 'var(--color-spectrum-5)', 'var(--color-spectrum-6)',
     'var(--color-spectrum-7)',
   ] as const

   function getSpectrumColor(id: number): string {
     return SPECTRUM_COLORS[id % SPECTRUM_COLORS.length]
   }
   ```
2. In the `<m.li>` element, add:
   - `border-l-4` class
   - `style={{ borderLeftColor: getSpectrumColor(todo.id) }}` inline style
   - Subtle bg tint: `style={{ borderLeftColor: ..., backgroundColor: `${getSpectrumColor(todo.id).replace(')', ' / 5%)')}` }` — or use a simpler inline approach

**Bead 2**: `hdkit-project-1-38k` — Rainbow gradient progress bar

In `src/components/todo-progress.tsx`:
- Replace `className="h-full rounded-full bg-accent-violet"` with an inline gradient:
  ```tsx
  <div
    style={{
      width: `${pct}%`,
      transition: 'width 0.5s ease-out',
      background: 'linear-gradient(to right, var(--color-spectrum-1), var(--color-spectrum-2), var(--color-spectrum-3), var(--color-spectrum-4), var(--color-spectrum-5), var(--color-spectrum-6), var(--color-spectrum-7))',
    }}
    className="h-full rounded-full"
  />
  ```

---

## Cross-Track Dependencies

- Tracks 2 and 3 must wait for Track 1 (bead hdkit-project-1-1e5) to complete
- Tracks 2 and 3 can run in parallel after Track 1

## No Security Signals

No auth, no PII, no new API endpoints — UI-only changes. No security review needed.
