# Execution Plan: Search, Filter & Sort Todos

Epic: hdkit-project-1-2ji
Generated: 2026-02-27

## Tracks

| Track | Agent       | Beads (in order)                                    | File Scope                                     |
|-------|-------------|-----------------------------------------------------|------------------------------------------------|
| 1     | BlueLake    | hdkit-project-1-18o → hdkit-project-1-2pc → hdkit-project-1-38j | `src/store/ui.ts`, `src/components/search-sort-bar.tsx`, `src/app/page.tsx` |
| 2     | GreenCastle | hdkit-project-1-18o → hdkit-project-1-11e           | `src/store/ui.ts`, `src/components/todo-list.tsx` |

> Note: Both tracks start with hdkit-project-1-18o (store). In practice, a single agent should do the store first, then Tracks 1 and 2 can be split for parallel execution.

---

## Track Details

### Track 1: BlueLake — UI Component + Integration

**File scope:** `src/store/ui.ts`, `src/components/search-sort-bar.tsx`, `src/app/page.tsx`

**Beads:**

1. `hdkit-project-1-18o`: Extend Zustand store — add `searchQuery`, `sortOrder`, and their setters + export `SortOrder` type
2. `hdkit-project-1-2pc`: Create SearchSortBar component — new `src/components/search-sort-bar.tsx` with search input and sort toggle
3. `hdkit-project-1-38j`: Integrate SearchSortBar into page — +1 import, +1 JSX tag in `src/app/page.tsx`

### Track 2: GreenCastle — Filter Pipeline

**File scope:** `src/components/todo-list.tsx` (store is shared with Track 1 but its change is additive/non-conflicting)

**Beads:**

1. `hdkit-project-1-18o`: Same store extension as Track 1 (do this first if running as single agent, or coordinate if running in parallel)
2. `hdkit-project-1-11e`: Extend TodoList with search and sort pipeline — three-step filter/search/sort in `src/components/todo-list.tsx`

---

## Recommended Single-Agent Execution Order

Since the store bead (hdkit-project-1-18o) is shared, a single agent should execute in this order:

1. `hdkit-project-1-18o` — Store (foundation, no deps)
2. `hdkit-project-1-2pc` + `hdkit-project-1-11e` — Can be done in either order (both depend only on store)
3. `hdkit-project-1-38j` — Page integration (depends on SearchSortBar component)

---

## Cross-Track Dependencies

- Store (hdkit-project-1-18o) must complete before all other beads
- SearchSortBar (hdkit-project-1-2pc) must complete before page integration (hdkit-project-1-38j)
- TodoList pipeline (hdkit-project-1-11e) has no further downstream deps

---

## Key Implementation Notes

1. **Never mutate initialTodos:** Always use `[...afterSearch].sort()` spread in TodoList
2. **SortOrder type export:** Export `SortOrder` from store so SearchSortBar can import it
3. **glass-surface class:** Use on search Input and sort Button — defined in `globals.css`
4. **created_desc fast-path:** `sortOrder === 'created_desc'` returns `0` to preserve DB order — this relies on `orderBy(desc(todos.created_at))` in page.tsx
5. **Tailwind v4:** No config file — use CSS variables directly (`var(--color-spectrum-7)`)
