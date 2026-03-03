# Discovery Report: Dashboard, Analytics, UI & Calendar Improvements

## Architecture Snapshot

- **Framework:** Next.js 16.x App Router (RSC + Server Actions)
- **Styling:** Tailwind v4 CSS-first (`@theme` in `globals.css`) — no config file
- **Database:** Drizzle ORM → SQLite dev / Turso prod; single `todos` table
- **Animation:** Framer Motion 12.x with `LazyMotion` + `domAnimation`
- **State:** Zustand 5.x — `filter`, `searchQuery`, `sortOrder`, `editingId`
- **Entry point:** `src/app/page.tsx` — RSC, queries all todos ordered by `created_at DESC`

## Relevant Files

| File | Role |
|---|---|
| `src/app/page.tsx` | Main RSC page — DB query + component layout |
| `src/app/layout.tsx` | Root layout — sticky header, ThemeProvider |
| `src/app/globals.css` | @theme tokens, glassmorphism utilities, spectrum palette |
| `src/components/todo-list.tsx` | Filter/search/sort pipeline + AnimatePresence |
| `src/components/todo-item.tsx` | Todo card with inline edit, checkbox, delete |
| `src/components/todo-form.tsx` | Create todo — datetime-local native picker |
| `src/components/filter-tabs.tsx` | All/Active/Completed tabs with badges |
| `src/components/search-sort-bar.tsx` | Search + sort cycle button |
| `src/components/todo-progress.tsx` | Rainbow gradient progress bar |
| `src/actions/todos.ts` | Server Actions — createTodo, toggleTodo, updateTodo, deleteTodo |
| `src/lib/schema.ts` | Drizzle schema — todos table |
| `src/store/ui.ts` | Zustand store |

## Data Model

```ts
todos {
  id:         integer  PRIMARY KEY AUTOINCREMENT
  title:      text     NOT NULL
  completed:  integer  DEFAULT 0   // 0=active, 1=completed
  due_date:   text     nullable    // ISO 8601 (e.g. "2026-02-27T19:00")
  created_at: text     nullable    // ISO string
  updated_at: text     nullable    // ISO string
}
```

**Key constraint:** No category, project, or tag fields. Only title, completion, due date, timestamps.

## Existing Patterns

- **Date display:** `getDueDateDisplay()` in `todo-item.tsx` — formats ISO → "Feb 27, 2026" or "Feb 27, 2026, 07:00 PM"
- **Date coloring:** Overdue=red-500, Today=yellow-500, Future=muted-foreground
- **Page routing:** Single route `/` — no other pages exist yet
- **DB queries:** RSC page does `db.select().from(todos).orderBy(desc(todos.created_at))`
- **Glass UI:** Consistent glassmorphism container on main page
- **No analytics, charts, or observability code exists**

## Feature 1: Today Dashboard + Past Day Filter

**What exists:**
- Filter is currently: All / Active / Completed (completion status only)
- No date-based filtering exists
- `due_date` is the relevant date field for "due today"
- All filtering is client-side in `todo-list.tsx`

**What's needed:**
- A "Today" view showing todos due today (or created today?)
- A date selector to browse todos for any past day
- Architecture decision: same page `/` extended vs. separate `/today` route

## Feature 2: Analytics Page

**What exists:** Nothing. No charts, metrics, or data aggregation.

**Available data for analytics (from schema):**
- `completed` (0/1)
- `due_date` (nullable ISO string)
- `created_at` (ISO string)
- `updated_at` (ISO string — tracks when last changed)
- `title` (text — word count possible)

**Brainstorm — potential analytics to display:**

### Overview Cards
- Total todos (all-time)
- Completed todos
- Active/incomplete todos
- Overdue todos (due_date < now, not completed)
- Completion rate (%)

### Time-based Stats
- Todos completed today / this week / this month
- Todos created today / this week / this month
- Average completion time (created_at → updated_at for completed todos)
- Streak: consecutive days with at least 1 completion

### Trends
- Daily completion chart (last 7 / 14 / 30 days)
- Creation vs. completion line chart over time
- Overdue rate trend

### Distribution
- Completion by day of week (bar chart — when are you most productive?)
- Due date spread (how far in advance do you set deadlines?)
- Todo age distribution (how long do active todos sit?)

### Insights Cards
- "Most productive day" (day with most completions)
- "Average time to complete" (days)
- "Oldest active todo" (longest unfinished)
- "Todos created but never started" (completed=0, old created_at)

## Feature 3: UI Improvements (Padding/Margin)

**What exists:** Glassmorphism container, spectrum colors, rainbow progress bar.

**Observation points:**
- `page.tsx` container padding: `p-6 md:p-8`
- `todo-item.tsx` uses `p-3 md:p-4`
- `todo-form.tsx` uses `p-4`
- `filter-tabs.tsx` uses `mb-4`
- `search-sort-bar.tsx` uses `mb-4 gap-2`
- Spacing tokens available via Tailwind v4 CSS variables

## Feature 4: Beautiful Calendar / Date Picker

**What exists:**
- `<input type="datetime-local" />` — native browser date picker (ugly, inconsistent across browsers)
- Used in: `todo-form.tsx` (create), `todo-item.tsx` (edit mode)
- No existing calendar library

**Options for replacement:**
1. **react-day-picker** (v9) — most popular, accessible, headless-friendly, shadcn recommends
2. **shadcn Calendar** component — built on react-day-picker, matches design system
3. **vaul + calendar** — drawer + calendar for mobile-friendly experience
4. **Custom Popover + Calendar** — shadcn Popover + shadcn Calendar (most control)

**shadcn Calendar** is the canonical choice — already has shadcn CLI support (`npx shadcn add calendar`), matches glass design system, uses react-day-picker internally.

## Technical Constraints

- Tailwind v4 CSS-first — no tailwind.config.js
- No auth, single user
- All chart options: no charting library currently installed
- Candidate chart libs: **Recharts** (most popular with React), or CSS-only progress bars
- shadcn/ui has chart components (shadcn charts = Recharts wrappers)
- `shadcn add chart` would add Recharts-based chart components

## UI Work Detected

- UI patterns identified: dashboard view, analytics page (charts + cards), calendar picker component, UI spacing improvements
- Existing `docs/ui-standards/` directory: no
- `## Worker Config` in project AGENTS.md: no
