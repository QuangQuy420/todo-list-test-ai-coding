# Discovery Report: Search, Filter & Sort Todos

Date: 2026-02-27
Feature: Add search input, advanced filtering, and sort by datetime

---

## Architecture Snapshot

- **Framework:** Next.js 16 App Router — RSC fetches all todos, passes as props to client components
- **Client state:** Zustand 5 — `filter: 'all'|'active'|'completed'` + `editingId: number|null`
- **DB query:** `db.select().from(todos).orderBy(desc(todos.created_at))` — only `created_at` DESC sort
- **Filtering:** Pure client-side in `TodoList` — `initialTodos.filter(...)` based on `filter` Zustand state
- **Key modules:**
  - `src/app/page.tsx` — RSC, fetches all todos, passes `allTodos[]` to FilterTabs + TodoProgress + TodoList
  - `src/components/todo-list.tsx` — Client, does filtering + renders with Framer Motion
  - `src/components/filter-tabs.tsx` — Client, shadcn Tabs, calls `setFilter()` on click
  - `src/store/ui.ts` — Zustand store (filter + editingId only)
  - `src/lib/schema.ts` — `todos` table: id, title, completed(int), due_date(text), created_at(text), updated_at(text)

## Existing Patterns

- **Filtering pattern:** TodoList reads Zustand `filter`, applies `array.filter()` client-side on `initialTodos` prop
- **No search:** No search input, no debounce utility, no search state
- **No client-side sort:** Server sends data sorted by `created_at DESC` only; client never re-sorts
- **Reusable:** `Input` component in `src/components/ui/input.tsx` (shadcn standard)
- **Naming:** camelCase for functions, kebab-case for component files, PascalCase for components
- **State pattern:** Zustand store for cross-component client state; local `useState` for component-local state

## Technical Constraints

- **Tailwind v4 CSS-first** — no `tailwind.config.js`; all tokens in `globals.css` under `@theme`
- **No debounce library** — would need a small custom hook or use `setTimeout`
- **All todos fetched server-side** — client receives full list; search/sort could remain client-side
- **Schema columns available for sorting:** `due_date` (nullable text ISO 8601), `created_at` (nullable text), `title` (text)
- **`completed` is integer (0/1)** — not boolean; coerced with `!!todo.completed` in JSX

## UI Work Detected

- UI patterns identified: **search input bar**, **sort controls** (button/dropdown for sort direction)
- Existing `docs/ui-standards/` directory: **no**
- `## Worker Config` in AGENTS.md: **no**

---

## Clarifications

| Question | Answer | Impact |
|----------|--------|--------|
| Search placement | Above filter tabs, combined — search AND active tab filter both apply simultaneously | Search bar renders above FilterTabs; both filters compose |
| Sort behavior | Sort by `due_date` toggle: Created↓ → Due↑ → Due↓; todos without due_date go to bottom | Add `sortOrder` state to Zustand; client-side re-sort in TodoList |
| Search strategy | Client-side — filter `initialTodos` in memory, instant, no network | Add `searchQuery` state to Zustand; compose with existing filter in TodoList |
| UI standard | Follow existing patterns — glassmorphism `glass-surface`, shadcn `Input`, `Button variant=ghost`, lucide icons | No extra spec; workers match existing component conventions |

**User Confirmation**: 2026-02-27
