# Execution Plan: Dashboard, Analytics & UI Overhaul

Epic: hdkit-project-1-1hi
Generated: 2026-03-03

## Tracks

| Track | Agent | Beads (in order) | File Scope |
|---|---|---|---|
| A | BlueLake | hdkit-project-1-1qf → hdkit-project-1-143 | `src/app/layout.tsx`, `src/app/page.tsx`, `src/store/ui.ts`, `src/components/todo-list.tsx`, new `src/components/nav-links.tsx`, new `src/components/date-filter-bar.tsx` |
| B | GreenCastle | hdkit-project-1-2jg → hdkit-project-1-1yw | `src/components/todo-form.tsx`, `src/components/todo-item.tsx`, `src/components/ui/calendar.tsx` (new), new `src/components/date-time-picker.tsx`, `src/components/search-sort-bar.tsx`, `src/components/filter-tabs.tsx`, `src/components/todo-progress.tsx` |
| C | RedStone | hdkit-project-1-2xk → hdkit-project-1-fko | new `src/app/analytics/`, new `src/lib/analytics.ts`, new `src/components/analytics/` |

## Track Details

### Track A: BlueLake — Dashboard & Navigation

**File scope:** `src/app/layout.tsx`, `src/app/page.tsx`, `src/store/ui.ts`, `src/components/todo-list.tsx`, `src/components/nav-links.tsx`, `src/components/date-filter-bar.tsx`

**Beads:**
1. `hdkit-project-1-1qf`: Add navigation header + Today dashboard view
   - Extract NavLinks client component from layout.tsx
   - Add "Todos" / "Analytics" nav links with active-route highlight
   - Wire DateFilterBar placeholder into page.tsx layout
2. `hdkit-project-1-143`: Date filter pipeline — Today view + date picker
   - Add `dateFilter` to Zustand store
   - Extend TodoList pipeline with Step 0 date filter
   - Create DateFilterBar: All / Today toggle + date input + clear button

### Track B: GreenCastle — Calendar & UI Polish

**File scope:** `src/components/todo-form.tsx`, `src/components/todo-item.tsx`, `src/components/ui/calendar.tsx`, `src/components/date-time-picker.tsx`, `src/components/search-sort-bar.tsx`, `src/components/filter-tabs.tsx`, `src/components/todo-progress.tsx`

**Beads:**
1. `hdkit-project-1-2jg`: Install shadcn Calendar + create DateTimePicker component
   - Run `npx shadcn add calendar popover`
   - Create DateTimePicker: Popover trigger + Calendar + time input + clear button
   - Glass styling applied to popover content
2. `hdkit-project-1-1yw`: Replace datetime-local inputs + UI spacing improvements
   - Replace `<input type="datetime-local">` in todo-form.tsx and todo-item.tsx
   - Improve padding/margin/gap across all components

### Track C: RedStone — Analytics

**File scope:** `src/app/analytics/page.tsx`, `src/lib/analytics.ts`, `src/components/analytics/overview-cards.tsx`, `src/components/analytics/insights-cards.tsx`, `src/components/analytics/streak-tracker.tsx`, `src/components/analytics/daily-activity-chart.tsx`, `src/components/ui/chart.tsx`

**Beads:**
1. `hdkit-project-1-2xk`: Analytics page — scaffold, overview cards, insights, streak
   - Create `src/lib/analytics.ts` with computeAnalytics()
   - Create analytics RSC page at /analytics
   - OverviewCards: 5 glass cards with spectrum accent colors
   - InsightsCards: 3 cards with most productive day, avg time, oldest todo
   - StreakTracker: flame counter + 30-day heatmap
2. `hdkit-project-1-fko`: Install shadcn chart (Recharts) + daily activity chart
   - Run `npx shadcn add chart`
   - Create DailyActivityChart (14-day bar chart)
   - Replace placeholder in analytics page

## Intra-Track Dependencies (enforce sequential execution within each track)

```
A: 1qf → 143   (A2 depends on A1: NavLinks must exist before DateFilterBar is wired)
B: 2jg → 1yw   (B2 depends on B1: DateTimePicker must exist before replacing inputs)
C: 2xk → fko   (C2 depends on C1: analytics page must exist before adding chart)
```

## Cross-Track Dependencies

- All 3 tracks are fully independent (no shared files across tracks)
- Tracks A, B, C can start in parallel immediately
- Track C can start without waiting for A or B

## Key Technical Decisions

1. **Date filter uses `<input type="date">`** in DateFilterBar (not shadcn Calendar) — keeps Track A independent of Track B
2. **All filtering is client-side** — RSC sends all todos, client filters by date/completion/search
3. **Analytics is pure RSC** — all stat computation server-side, no client DB access
4. **DateTimePicker wraps Calendar + time input** — replaces datetime-local in both create and edit flows
5. **Recharts via shadcn chart** — ensures Tailwind v4 CSS variable compatibility
