# Execution Plan: Modern Todo App — Next.js 16

Epic: hdkit-project-1-282
Generated: 2026-02-27

---

## Tracks

| Track | Agent | Beads (in order) | File Scope |
|---|---|---|---|
| 1 | BlueLake | bd-1yn → bd-1yv → bd-3hf → bd-16j → bd-1xj | `src/lib/**`, `src/actions/**`, `drizzle.config.ts`, `.env.local` |
| 2 | GreenCastle | bd-2xr → bd-2vh → bd-3ql → bd-3cp | `src/app/globals.css`, `src/app/layout.tsx`, `src/components/theme-toggle.tsx` |
| 3 | RedStone | bd-263 → bd-1ak → bd-8pt → bd-2rb → bd-f6o | `src/store/**`, `src/components/filter-tabs.tsx`, `src/components/todo-form.tsx`, `src/components/todo-item.tsx` |
| 4 | PurpleBear | bd-36t → bd-39x → bd-28a | `src/app/page.tsx`, `src/components/todo-list.tsx` + Vercel deploy |

> **Cross-track start gates:**
> - Track 1 starts immediately (unblocks everyone else)
> - Track 2 and Track 3 can start after bd-1yn (Scaffold) completes
> - Track 4 starts after bd-1xj (Track 1), bd-2vh (Track 2), bd-263 (Track 3) all complete

---

## Track Details

### Track 1: BlueLake — Infrastructure & Data Layer

**File scope:** `src/lib/**`, `src/actions/**`, `drizzle.config.ts`, `.env.local`, `next.config.ts`
**Starts:** Immediately (first track — unblocks all others)

**Beads:**
1. `bd-1yn` — Scaffold Next.js 16 project — `create-next-app@16`, TypeScript, App Router
2. `bd-1yv` — Configure next.config.ts — `serverExternalPackages: ['@libsql/client']`
3. `bd-3hf` — Implement Drizzle schema + DB client — `src/lib/schema.ts`, `src/lib/db.ts`
4. `bd-16j` — Set up drizzle.config.ts + migration — `drizzle-kit push` creates `local.db`
5. `bd-1xj` — Implement Server Actions (CRUD) — `src/actions/todos.ts` with input validation

### Track 2: GreenCastle — Styling & Layout

**File scope:** `src/app/globals.css`, `src/app/layout.tsx`, `src/components/theme-toggle.tsx`
**Starts:** After `bd-1yn` (Scaffold) completes

**Beads:**
1. `bd-2xr` — Configure Tailwind CSS v4 + shadcn/ui — CSS-first config, `npx shadcn init`
2. `bd-2vh` — Build root layout with ThemeProvider — `next-themes`, `suppressHydrationWarning`
3. `bd-3ql` — Build ThemeToggle component — `useTheme`, `mounted` guard, lucide icons
4. `bd-3cp` — Polish glassmorphism styles — `@theme` tokens, OKLCH colors, `backdrop-blur`

### Track 3: RedStone — State + Interactive Components

**File scope:** `src/store/**`, `src/components/filter-tabs.tsx`, `src/components/todo-form.tsx`, `src/components/todo-item.tsx`
**Starts:** After `bd-1yn` (Scaffold) + `bd-2xr` (shadcn) + `bd-1xj` (Server Actions) complete

> Note: bd-263 (Zustand) can start after just bd-1yn; bd-1ak/bd-8pt/bd-2rb additionally need bd-2xr and bd-1xj

**Beads:**
1. `bd-263` — Create Zustand UI store — `src/store/ui.ts`, filter + editingId
2. `bd-1ak` — Build FilterTabs component — shadcn Tabs, count badges, Zustand filter
3. `bd-8pt` — Build TodoForm component — create action, keyboard shortcuts (n/Enter/Esc)
4. `bd-2rb` — Build TodoItem component (functional) — toggle/edit/delete, due date colors
5. `bd-f6o` — Add Framer Motion microinteractions — `LazyMotion` + `m`, enter/exit/bounce

### Track 4: PurpleBear — Page Assembly & Deploy

**File scope:** `src/app/page.tsx`, `src/components/todo-list.tsx`
**Starts:** After bd-1xj (Track 1) + bd-2vh (Track 2) + bd-263 (Track 3) all complete; deploy waits for all tracks

**Beads:**
1. `bd-36t` — Build main page (RSC) — DB query, full layout composition, glassmorphism container
2. `bd-39x` — Build TodoList component — client filter from Zustand, empty state, AnimatePresence
3. `bd-28a` — Deploy to Vercel with Turso prod DB — Turso create, drizzle migrate, Vercel env vars

---

## Cross-Track Dependency Map

```
bd-282 (epic)
    └─→ bd-1yn [Track 1 start]
             ├─→ bd-1yv → bd-3hf → bd-16j → bd-1xj [Track 1 continues]
             ├─→ bd-2xr → bd-2vh → bd-3ql → bd-3cp [Track 2]
             └─→ bd-263 [Track 3 start]

After bd-1xj + bd-2xr complete:
    └─→ bd-1ak, bd-8pt, bd-2rb [Track 3 unblocked]
             └─→ bd-f6o [Track 3 finish]

After bd-1xj + bd-2vh + bd-263 complete:
    └─→ bd-36t → bd-39x [Track 4]

After bd-39x + bd-3ql + bd-8pt + bd-f6o + bd-3cp complete:
    └─→ bd-28a [Deploy]
```

---

## Key Technical Notes (for orchestrator)

1. **bd-1yv BEFORE bd-3hf** — `serverExternalPackages` must be set before any `@libsql/client` import or `next dev` crashes
2. **bd-16j BEFORE bd-1xj** — `local.db` with `todos` table must exist before Server Actions run
3. **bd-2xr BEFORE bd-2vh** — `shadcn init` creates `components/ui/` needed by all UI components
4. **bd-263 BEFORE bd-1ak/bd-8pt/bd-2rb** — Zustand store must exist before components import it
5. **bd-2rb BEFORE bd-f6o** — Framer Motion is layered onto functional TodoItem, not built from scratch
6. **LazyMotion provider** goes in `todo-list.tsx` wrapping `AnimatePresence` (not layout.tsx)
7. **No tailwind.config.js** — Tailwind v4 is CSS-first; any generated config from scaffold must be deleted
8. **`completed` is integer 0/1** — use `!!todo.completed` in JSX, `completed ? 1 : 0` in actions

---

## Bead ID Reference

| Short ID | Full ID | Title |
|---|---|---|
| bd-282 | hdkit-project-1-282 | Epic: Todo App — Next.js 16 |
| bd-1yn | hdkit-project-1-1yn | Scaffold Next.js 16 project |
| bd-1yv | hdkit-project-1-1yv | Configure next.config.ts |
| bd-3hf | hdkit-project-1-3hf | Implement Drizzle schema + DB client |
| bd-16j | hdkit-project-1-16j | Set up drizzle.config.ts and run initial migration |
| bd-1xj | hdkit-project-1-1xj | Implement Server Actions (CRUD) |
| bd-2xr | hdkit-project-1-2xr | Configure Tailwind CSS v4 + shadcn/ui |
| bd-2vh | hdkit-project-1-2vh | Build root layout with ThemeProvider |
| bd-3ql | hdkit-project-1-3ql | Build ThemeToggle component |
| bd-3cp | hdkit-project-1-3cp | Polish glassmorphism styles |
| bd-263 | hdkit-project-1-263 | Create Zustand UI store |
| bd-1ak | hdkit-project-1-1ak | Build FilterTabs component |
| bd-8pt | hdkit-project-1-8pt | Build TodoForm component |
| bd-2rb | hdkit-project-1-2rb | Build TodoItem component (functional) |
| bd-f6o | hdkit-project-1-f6o | Add Framer Motion microinteractions |
| bd-36t | hdkit-project-1-36t | Build main page (RSC) |
| bd-39x | hdkit-project-1-39x | Build TodoList component |
| bd-28a | hdkit-project-1-28a | Deploy to Vercel with Turso production DB |
