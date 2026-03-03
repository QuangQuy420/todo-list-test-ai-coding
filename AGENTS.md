# AGENTS.md — hdkit-project-1 Todo App

> Modern Todo web app built with Next.js 16 App Router. Single-user, no auth, deployable to Vercel with Turso as the production database.

---

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16.x (App Router) | Turbopack default, RSC + Server Actions |
| Language | TypeScript 5.x | Strict mode |
| Styling | Tailwind CSS v4 | CSS-first (`@theme` in `globals.css`) — no `tailwind.config.js` |
| Components | shadcn/ui (new-york style) | Copy-paste ownership via `src/components/ui/` |
| Animation | Framer Motion 12.x | `LazyMotion` + `domAnimation` for bundle efficiency |
| Client state | Zustand 5.x | Filter, search, sort, and editing state |
| Database (dev) | SQLite (`file:./local.db`) | Zero config, `drizzle-kit push` to create |
| Database (prod) | Turso (libSQL) | SQLite-compatible, works on Vercel serverless |
| ORM | Drizzle ORM | Lightweight, type-safe, Edge-compatible |
| Theme | next-themes 0.4.x | System preference, `suppressHydrationWarning` |
| Icons | lucide-react | Used in ThemeToggle |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — ThemeProvider, sticky header with ThemeToggle
│   ├── page.tsx            # Main page (RSC) — DB query, glassmorphism container
│   └── globals.css         # Tailwind v4 @theme tokens, OKLCH palette, glassmorphism base
├── components/
│   ├── todo-list.tsx       # Client — LazyMotion provider, AnimatePresence, three-step filter/search/sort pipeline
│   ├── todo-item.tsx       # Client — checkbox bounce, strikethrough, inline edit, due date
│   ├── todo-form.tsx       # Client — create todo, datetime-local picker, keyboard shortcuts (n / Enter / Esc)
│   ├── filter-tabs.tsx     # Client — shadcn Tabs, count badges, Zustand filter
│   ├── search-sort-bar.tsx # Client — search input (glass-surface, clear button) + sort cycle button
│   ├── theme-toggle.tsx    # Client — useTheme, mounted guard, Sun/Moon icons
│   └── ui/                 # shadcn/ui primitives (button, checkbox, dialog, input, tabs)
├── lib/
│   ├── db.ts               # Drizzle client — libSQL, env-switched URL
│   ├── schema.ts           # Drizzle schema — todos table
│   └── utils.ts            # cn() helper
├── actions/
│   └── todos.ts            # Server Actions — createTodo, toggleTodo, updateTodo, deleteTodo
└── store/
    └── ui.ts               # Zustand store — filter, searchQuery, sortOrder, editingId
```

---

## Data Model

```ts
// src/lib/schema.ts
todos {
  id:         integer  PRIMARY KEY AUTOINCREMENT
  title:      text     NOT NULL
  completed:  integer  DEFAULT 0   // 0 = active, 1 = completed — use !!todo.completed in JSX
  due_date:   text     nullable    // ISO 8601 date or datetime string (e.g. "2026-02-27T19:00")
  created_at: text     nullable
  updated_at: text     nullable
}
```

---

## Server Actions (`src/actions/todos.ts`)

All mutations use `revalidatePath('/')` to trigger RSC re-render.

| Function | Signature | Notes |
|---|---|---|
| `createTodo` | `(title, dueDate?)` | Validates title (trim, max 500 chars) |
| `toggleTodo` | `(id)` | Fetches current state, flips `completed` 0↔1 |
| `updateTodo` | `(id, title, dueDate?)` | Validates title same as create |
| `deleteTodo` | `(id)` | Hard delete |

**Input validation:** `validateTitle()` strips whitespace, rejects empty strings and titles > 500 chars.

---

## Client State (`src/store/ui.ts`)

```ts
export type SortOrder = 'created_desc' | 'due_asc' | 'due_desc'

useUIStore {
  filter:       'all' | 'active' | 'completed'   // drives completion filter in TodoList
  editingId:    number | null                     // which TodoItem is in inline-edit mode
  searchQuery:  string                            // case-insensitive substring search on title (default '')
  sortOrder:    SortOrder                         // client-side sort order (default 'created_desc')
}
```

All filtering, searching, and sorting is client-side only — `TodoList` runs a three-step pipeline on the `initialTodos` prop from the RSC page query. `SortOrder` is exported for use in `SearchSortBar`.

---

## Key Patterns

### Database connection (env-switching)
```ts
// src/lib/db.ts
url: process.env.TURSO_DATABASE_URL || 'file:./local.db'
// Dev:  TURSO_DATABASE_URL=file:./local.db  (or omit)
// Prod: TURSO_DATABASE_URL=libsql://your-db.turso.io + TURSO_AUTH_TOKEN=...
```

### Framer Motion bundle pattern
```ts
// TodoList.tsx — LazyMotion wraps AnimatePresence (NOT in layout.tsx)
<LazyMotion features={domAnimation}>
  <AnimatePresence initial={false}>
    {filteredTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
  </AnimatePresence>
</LazyMotion>

// TodoItem.tsx — uses m.* (not motion.*) to stay within LazyMotion
import { m, AnimatePresence } from 'framer-motion'
```

### next-themes hydration safety
```tsx
// ThemeToggle: returns null until mounted to avoid SSR mismatch
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return null
```

### completed field coercion
```ts
// Always coerce integer → boolean in JSX
const isCompleted = !!todo.completed
// Always coerce boolean → integer in actions
completed: completed ? 1 : 0
```

### Search + sort pipeline (TodoList)
```ts
// src/components/todo-list.tsx
// Step 1: completion filter (existing, unchanged)
const afterFilter = initialTodos.filter(todo => /* all | active | completed */)

// Step 2: search filter — case-insensitive substring on title; skipped when empty
const afterSearch = trimmedQuery
  ? afterFilter.filter(todo => todo.title.toLowerCase().includes(trimmedQuery))
  : afterFilter

// Step 3: sort — ALWAYS spread to avoid mutating the prop
const filteredTodos = [...afterSearch].sort((a, b) => {
  if (sortOrder === 'created_desc') return 0  // fast-path: preserve DB order
  // due_asc / due_desc: nulls always go to bottom regardless of direction
})
```

- `created_desc` relies on `orderBy(desc(todos.created_at))` in `page.tsx` — do not change DB query
- `AnimatePresence` key: `key={filter + searchQuery}` remounts empty state on either change

### Tailwind v4 note
No `tailwind.config.js` — Tailwind v4 is CSS-first. All theme tokens live in `globals.css` under `@theme`. Do not create a config file; it breaks the v4 build.

---

## UI/UX Conventions

| Feature | Implementation |
|---|---|
| Glassmorphism container | `backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 rounded-2xl` |
| Due date — overdue | `text-red-500` (datetime < now — exact time comparison) |
| Due date — today | `text-yellow-500` (same calendar day, not yet past) |
| Due date — future | `text-muted-foreground` (no special color) |
| Due date — display | Date-only: "Feb 27, 2026"; datetime: "Feb 27, 2026, 07:00 PM" |
| Checkbox animation | Scale bounce `[1, 1.4, 0.85, 1.1, 1]` over 400ms |
| Strikethrough on complete | Animated `scaleX` 0→1 via `m.span` |
| Delete animation | Exit: `opacity: 0, x: -40, height: 0` over 250ms |
| SearchSortBar — search input | `glass-surface` class, `pl-8` for icon offset, clear `×` button (`variant="ghost" size="icon-xs"`) when non-empty |
| SearchSortBar — sort button | Cycles `created_desc → due_asc → due_desc`; accent-violet border + text (`var(--color-spectrum-7)`) when sort is non-default |
| Search empty state | `No todos match "<query>"` when `searchQuery` is non-empty; falls back to `EMPTY_STATE_COPY[filter]` |

---

## Keyboard Shortcuts

| Key | Context | Action |
|---|---|---|
| `n` | Global (not in input) | Focus the new-todo title input |
| `Enter` | TodoForm | Submit new todo |
| `Esc` | TodoForm | Clear form inputs |
| `Enter` | TodoItem edit mode | Save inline edit |
| `Esc` | TodoItem edit mode | Cancel inline edit |
| `Delete` | TodoItem focused (not editing) | Delete todo |

---

## Dev Commands

```bash
npm run dev          # Start Next.js dev server (Turbopack)
npm run build        # Production build
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint
npm run db:push      # drizzle-kit push (creates/updates local.db schema)
npm run db:studio    # Drizzle Studio GUI for local DB
```

**First-time setup:**
```bash
npm install
npm run db:push      # Creates local.db with todos table
npm run dev
```

---

## Environment Variables

| Variable | Dev | Prod (Vercel) |
|---|---|---|
| `TURSO_DATABASE_URL` | `file:./local.db` (or omit) | `libsql://your-db.turso.io` |
| `TURSO_AUTH_TOKEN` | Not needed for local file | Required for Turso cloud |

---

## Deployment (planned)

Target: **Vercel** with **Turso** production database.

Steps (not yet executed):
1. Create Turso DB: `turso db create todo-app`
2. Get credentials: `turso db show --url` + `turso db tokens create`
3. Set Vercel env vars: `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`
4. Run migration on prod: `drizzle-kit migrate`
5. `git push` → Vercel auto-deploys

> `serverExternalPackages: ['@libsql/client']` in `next.config.ts` is required for `@libsql/client` to work in Vercel serverless functions.

---

## Security Notes

- **No auth, no PII** — public personal tool
- **SQL injection:** Protected by Drizzle's parameterized queries
- **XSS:** React escapes by default; no `dangerouslySetInnerHTML` in codebase
- **Input validation:** Server Actions validate title length and trim whitespace
- **Secrets:** Never commit `.env.local`; use Vercel env vars for `TURSO_AUTH_TOKEN`

<!-- bv-agent-instructions-v1 -->

---

## Beads Workflow Integration

This project uses [beads_viewer](https://github.com/Dicklesworthstone/beads_viewer) for issue tracking. Issues are stored in `.beads/` and tracked in git.

### Essential Commands

```bash
# View issues (launches TUI - avoid in automated sessions)
bv

# CLI commands for agents (use these instead)
br ready              # Show issues ready to work (no blockers)
br list --status=open # All open issues
br show <id>          # Full issue details with dependencies
br create --title="..." --type=task --priority=2
br update <id> --status=in_progress
br close <id> --reason="Completed"
br sync --flush-only  # Export JSONL (use before git commit)
```

### Workflow Pattern

1. **Start**: Run `br ready` to find actionable work
2. **Claim**: Use `br update <id> --status=in_progress`
3. **Work**: Implement the task
4. **Complete**: Use `br close <id>`
5. **Sync**: Always run `br sync --flush-only` at session end

### Key Concepts

- **Dependencies**: Issues can block other issues. `bd ready` shows only unblocked work.
- **Priority**: P0=critical, P1=high, P2=medium, P3=low, P4=backlog (use numbers, not words)
- **Types**: task, bug, feature, epic, question, docs
- **Blocking**: `br dep add <issue> <depends-on>` to add dependencies

### Session Protocol

**Before ending any session, run this checklist:**

```bash
git status              # Check what changed
git add <files>         # Stage code changes
br sync --flush-only    # Export beads to JSONL
git commit -m "..."     # Commit code + beads
git push                # Push to remote
```

### Best Practices

- Check `br ready` at session start to find available work
- Update status as you work (in_progress → closed)
- Create new issues with `br create` when you discover tasks
- Use descriptive titles and set appropriate priority/type
- Always `br sync --flush-only` before ending session

<!-- end-bv-agent-instructions -->
