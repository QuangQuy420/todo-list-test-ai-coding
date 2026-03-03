# Approach: Search, Filter & Sort Todos

## Gap Analysis

| Component | Have | Need | Gap |
|---|---|---|---|
| Zustand store | `filter`, `editingId` | + `searchQuery: string`, `sortOrder: SortOrder` | 4 new fields + 2 setters in `src/store/ui.ts` |
| Search UI | Nothing | Search bar with clear button above FilterTabs | New `src/components/search-sort-bar.tsx` |
| Sort UI | Nothing | Sort toggle button (Created↓ → Due↑ → Due↓) | Same new component |
| Filtering logic | `array.filter()` on completion only | Compose: completion + search + sort | Extend `src/components/todo-list.tsx` |
| Empty state copy | Keyed on `filter` only | Handle "no results for search query" | Inline override in `todo-list.tsx` |
| Page layout | Form → FilterTabs → Progress → List | Form → **SearchSortBar** → FilterTabs → Progress → List | +1 import, +1 JSX tag in `src/app/page.tsx` |

## Recommended Approach

**4-file change, purely additive:**

1. **`src/store/ui.ts`** — Extend `UIState` with `searchQuery: string` (default `''`) and `sortOrder: 'created_desc'|'due_asc'|'due_desc'` (default `'created_desc'`), plus setters.

2. **`src/components/search-sort-bar.tsx`** (new file) — `'use client'` component:
   - Left: Search input (`glass-surface` + `pl-8` for Search icon + clear × button when non-empty)
   - Right: Sort toggle button cycles `created_desc → due_asc → due_desc` with lucide `ArrowUpDown/ArrowUp/ArrowDown` icon + label
   - Highlighted when sort is non-default (accent-violet border/text)

3. **`src/components/todo-list.tsx`** — Three-step client pipeline:
   - Step 1: completion filter (existing, unchanged)
   - Step 2: search filter (`title.toLowerCase().includes(query)`)
   - Step 3: sort — `created_desc` preserves DB order; `due_asc/due_desc` sorts by `new Date(due_date).getTime()`, nulls go to bottom
   - Empty state message: `searchQuery.trim() ? \`No todos match "${searchQuery}"\` : EMPTY_STATE_COPY[filter]`
   - AnimatePresence key: `key={filter + searchQuery}` to re-trigger animation when either changes

4. **`src/app/page.tsx`** — +1 import + `<SearchSortBar />` between `<TodoForm />` and `<FilterTabs>`

## Risk Map

| Component | Risk | Reason | Mitigation |
|---|---|---|---|
| `src/store/ui.ts` | LOW | Purely additive; existing consumers unaffected | TypeScript strict catches mismatches |
| `search-sort-bar.tsx` (new) | LOW | Isolated; no existing code references it | Verify lucide icon names before writing |
| `todo-list.tsx` filter pipeline | MEDIUM | In-place `.sort()` mutation hazard; `sortOrder='created_desc'` fast-path assumptions | Always use `[...afterSearch].sort()` spread |
| Three-way composition | MEDIUM | 9 logical combinations must all work correctly | Deterministic pipeline (filter → search → sort) makes this automatic |
| `src/app/page.tsx` | LOW | One import + one JSX tag, no server logic | TypeScript catches import typos |
| Input lag | LOW | Single-user app, <hundreds of todos | No debounce needed |
| Hydration | LOW | SearchSortBar is pure client, Zustand defaults safe | No suppressHydrationWarning needed |

## No Spikes Required

All risks are LOW or MEDIUM. No external deps, no novel patterns — all patterns exist in codebase already.
