# Code Review: `main` (uncommitted changes) → `main` (HEAD)
**Reviewed:** 2026-03-03
**Task:** No task context
**Standards:** defaults only (all policies `required: no`)

> **Note:** No commits ahead of `origin/main`. This review covers all uncommitted working-tree changes.
> Diff scope: 13 modified tracked files + 11 new untracked files (analytics feature + date filter + DateTimePicker).
> `package-lock.json` and `.beads/issues.jsonl` excluded (auto-generated / tooling).

---

### Review Findings

✓ Aspect 1 (Requirements Coverage) — N/A (no task context)

**Aspect 2 — Correctness** 🔴 Blocker
- `React.ReactNode` used as a type in `CardDef` interface without importing `React` — `overview-cards.tsx:11`. With `"jsx": "react-jsx"` and TypeScript strict mode, `React` is not globally available; this will cause `TS2304: Cannot find name 'React'` and block the build. Fix: add `import type { ReactNode } from 'react'` and use `ReactNode` directly.
- Dead ternary at `streak-tracker.tsx:50` — `currentStreak === 1 ? 'day streak' : 'day streak'` produces the same string in both branches; no pluralization is applied. Likely intended as `'day streak'` vs `'days streak'` (or similar). Harmless at runtime but the conditional is misleading and should be removed or corrected.

✓ Aspect 3 (Possible Breakage) — no issues

**Aspect 4 — Better Approach** 🟡 Advisory
- `DateFilterBar` uses a raw `<input type="date">` (line 83) while the rest of the codebase uses the new `DateTimePicker` popover for all other date inputs (`TodoForm`, `TodoItem`). This creates two different date-selection UIs in the same feature area. Evaluate whether the filter bar intentionally stays as a compact native input (acceptable) or should use the same `DateTimePicker` for visual consistency.

**Aspect 5 — Redundancy** 🟡 Advisory
- `daily-activity-chart.tsx:3` imports `Tooltip`, `Legend`, `ResponsiveContainer` from `recharts` — none of these are used directly in the JSX (shadcn's `ChartTooltip`/`ChartLegend` wrappers are used instead). These are dead imports; ESLint `no-unused-vars` will flag them.
- `streak-tracker.tsx:77` — `const total = day.created + day.completed` is computed inside the `.map()` callback but `total` is never read; `getHeatmapColor` is called with `day.completed` only. Either `total` should be passed to `getHeatmapColor` (to color by combined activity, not just completions), or the variable should be removed. If the intent was to reflect total daily activity in the heatmap, this is a silent logic error.

✓ Aspect 6 (Tests) — N/A (no test infrastructure exists in the project)

✓ Aspect 7 (Security) — no issues
- Analytics page reads todos via Drizzle ORM (no raw SQL), consistent with the established pattern in `page.tsx`. No user input touches the analytics query. No secrets, no PII exposure beyond what already exists in the todo list itself.

✓ Aspect 8 (Breaking Changes) — see Breaking Changes block below

**Aspect 9 — Implication Assessment** 🟡 Advisory
- `DateFilterBar` at `date-filter-bar.tsx:85` sets `max={today}` on the native date input, restricting selection to today or earlier. However, todos can have **future** due dates (that's the core use case of the due-date feature). A user who creates a todo due next week cannot filter to "show todos due March 10" using the date picker chip. If date filtering for future due dates is intentional scope (filter only past/present), add a code comment explaining the decision; otherwise remove the `max` constraint.
- `AnalyticsPage` performs a full `db.select().from(todos)` independently of the home page query — two separate round-trips on page navigation. This is fine for a personal tool but worth noting if the DB grows.

**Aspect 10 — Code Quality** 🟡 Advisory
- `streak-tracker.tsx:77` — the unused `total` variable (see Aspect 5) also makes `getHeatmapColor`'s intent unclear to future readers: the function is named with no parameter hint, but the heatmap visually represents only completion counts, not combined activity. A comment or rename would clarify intent.
- `DateFilter` type is `null | 'today' | string` — `string` is a superset of `'today'`, making the union partially redundant as a discriminant. For a personal tool this is fine, but `null | 'today' | (string & {})` or a branded alias would give better IDE narrowing if needed later.

✓ Aspect 11 (Completeness) — N/A (no task context)

---

### ⚠️ Breaking Changes

No breaking changes detected.

- `useUIStore` gains `dateFilter` and `setDateFilter` — additive Zustand fields; existing consumers are unaffected.
- `TodoList` date-filter step is a no-op when `dateFilter === null` (the default); existing behavior is fully preserved.
- `TodoForm` and `TodoItem` replace the `datetime-local` input with `DateTimePicker` — UX change but the stored data format (`"YYYY-MM-DDThh:mm"`) is unchanged.

---

## Verdict: ❌ Changes Requested

Fix all 🔴 Blocker findings before merging:

1. **`overview-cards.tsx:11`** — Add `import type { ReactNode } from 'react'` and change `React.ReactNode` → `ReactNode`. The missing import is a TypeScript compile error that will fail the build.
2. **`streak-tracker.tsx:50`** — Remove or fix the identical-branch ternary.

---
> This is AI-assisted code review. It complements but does not replace human review,
> automated testing, and security scanning.
