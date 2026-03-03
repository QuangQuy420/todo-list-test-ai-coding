# Approach: Dashboard, Analytics, UI & Calendar Improvements

## Clarifications

| Question | Answer | Impact |
|---|---|---|
| Today dashboard = ? | Due today (due_date = today) | Filter by due_date, not created_at |
| Past day navigation | Calendar date picker | New Popover+Calendar component for date selection |
| Analytics content | All 4: Overview cards + Daily chart + Insights + Streak | Full analytics suite; need Recharts |
| Date picker scope | Date + time (calendar for date, time input for time) | DateTimePicker = Calendar popover + time input |

---

## Gap Analysis

| Component | Have | Need | Gap |
|---|---|---|---|
| Date filter on main page | Completion filter (all/active/completed) | Date filter (today / pick date) | New client-side filter dimension |
| Navigation | Single page, no nav | Header nav: Todos ↔ Analytics | Add nav links to layout.tsx header |
| Analytics page | Nothing | Full analytics page at `/analytics` | New RSC page + analytics components |
| Charts | Nothing | Recharts (via shadcn chart) | Install dependency + chart components |
| Date picker | `<input type="datetime-local">` | shadcn Calendar popover + time input | Install react-day-picker, create DateTimePicker |
| UI spacing | Acceptable but thin | Generous padding, margin, gap | Audit + improve all component spacing |

---

## Recommended Approach

### Feature 1: Today Dashboard + Past Day Filter

**Architecture: Client-side date filter extension (consistent with existing pipeline)**

- Add `dateFilter: null | string` to Zustand store (`null` = all todos, `'today'` = today, ISO date string = specific past date)
- Add **Step 0** to `TodoList` filter pipeline: date filter runs before completion filter
  - Compares `todo.due_date` date part (YYYY-MM-DD) to selected date
  - `'today'`: matches `due_date` starting with today's ISO date (2026-03-03)
  - ISO date string: matches `due_date` starting with that date
  - `null`: skip filter (show all)
- Add **DateFilterBar** component:
  - "Today" button (default active) + "All" button
  - Calendar picker icon button → Popover with Calendar for past date selection
  - Glass styling matching existing SearchSortBar pattern
- Integrate DateFilterBar above FilterTabs on main page

**No server changes needed** — all filtering stays client-side; RSC already sends all todos.

### Feature 2: Analytics Page (`/analytics`)

**Architecture: New RSC page with server-side computation**

- `src/app/analytics/page.tsx` — RSC, queries all todos, computes all stats server-side
- Pass computed data to client components as props (no additional DB queries from client)
- Page layout: glass container + 4 sections

**Sections (top to bottom):**

1. **Overview Cards** (grid 4-5 columns)
   - Total todos | Completed | Active | Overdue | Completion rate %
   - Each card: glass-card, spectrum accent, animated number

2. **Daily Activity Chart** (full-width card)
   - Recharts BarChart: last 14 days, 2 bars per day (created + completed)
   - X-axis: date labels; Y-axis: count
   - Spectrum colors for bars; glass background

3. **Productivity Insights** (3-column card grid)
   - Most productive day of week (day with most completions, all-time)
   - Average time to complete (created_at → updated_at for completed todos, in days)
   - Oldest open todo (most time since creation without completion)

4. **Completion Streak** (full-width card)
   - Current streak: consecutive days ending today with ≥1 completion
   - Best streak: longest historical streak
   - Last 30 days mini-calendar heatmap (CSS grid, colored squares by completion count)

### Feature 3: UI Spacing Improvements

**Audit and fix:**
- `page.tsx`: increase container max-width padding, add more vertical gap between sections
- `todo-item.tsx`: increase padding inside card, better gap between elements
- `todo-form.tsx`: improve spacing between form elements
- `filter-tabs.tsx`: add more breathing room
- `search-sort-bar.tsx`: improve gap between search + sort
- `layout.tsx` header: ensure consistent padding
- Global: tighten spacing scale consistency

### Feature 4: Beautiful Calendar / Date Picker

**Architecture: shadcn Calendar + custom DateTimePicker component**

```
npx shadcn add calendar
npx shadcn add popover  (may already exist)
```

- Creates `src/components/ui/calendar.tsx` (react-day-picker based)
- Create `src/components/date-time-picker.tsx` — Popover trigger + Calendar + time input
  - Button trigger: shows current value formatted nicely
  - Popover content: Calendar on top, time input below (HH:MM)
  - Glass styling: `glass-surface` popover content
  - Clear button to remove date
- Replace `<input type="datetime-local">` in `todo-form.tsx` and `todo-item.tsx`

---

## Risk Map

| Component | Risk | Reason | Mitigation |
|---|---|---|---|
| Date filter pipeline | LOW | Extension of existing client pattern | Direct implementation |
| Analytics RSC page | LOW | Follows existing page.tsx pattern | Direct implementation |
| Recharts / shadcn chart | MEDIUM | New dependency; Tailwind v4 CSS-first | `npx shadcn add chart` handles integration |
| react-day-picker / shadcn Calendar | MEDIUM | New dependency; needs glass styling | `npx shadcn add calendar` handles basics; custom glass styles needed |
| UI spacing audit | LOW | Pure Tailwind class edits | Direct implementation |

**Decision: No spikes needed.** All patterns are well-documented. `npx shadcn add chart/calendar` ensures Tailwind v4 compatibility. Proceed directly to decomposition.

---

## Security Pre-Check

Signals scanned — **no security beads needed**:
- No auth changes
- No new API endpoints (Server Actions already exist)
- No PII collection (only todo titles + timestamps)
- No payment data
- Read-only analytics (no new mutations)

---

## Decomposition: 6 Beads across 3 Tracks

### Track A — BlueLake (Dashboard & Navigation)
**File scope:** `src/app/layout.tsx`, `src/store/ui.ts`, `src/components/todo-list.tsx`, new `src/components/date-filter-bar.tsx`, `src/app/page.tsx`

| # | Title |
|---|---|
| A1 | Add navigation header + Today dashboard date filter |
| A2 | Date filter pipeline in TodoList + Zustand store |

### Track B — GreenCastle (Calendar & UI Polish)
**File scope:** `src/components/todo-form.tsx`, `src/components/todo-item.tsx`, `src/components/ui/calendar.tsx` (new), new `src/components/date-time-picker.tsx`, `src/components/search-sort-bar.tsx`, `src/components/filter-tabs.tsx`, `src/components/todo-progress.tsx`

| # | Title |
|---|---|
| B1 | Install shadcn Calendar + create DateTimePicker component |
| B2 | Replace datetime-local inputs + UI spacing improvements |

### Track C — RedStone (Analytics)
**File scope:** new `src/app/analytics/`, new `src/components/analytics/`

| # | Title |
|---|---|
| C1 | Analytics page scaffold + overview cards + insights + streak |
| C2 | Install shadcn chart (Recharts) + daily activity chart |

**Cross-track dependencies:**
- Track B can start in parallel with Track A
- Track C can start in parallel with Tracks A and B
- Track B Bead 2 should start after Track B Bead 1 (calendar must exist before replacing inputs)
- No cross-track blocking dependencies (file scopes don't overlap)
