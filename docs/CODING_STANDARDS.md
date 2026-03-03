# Coding Standards — hdkit-project-1 Todo App
# Last updated: 2026-02-27
#
# This is the Layer 2 project override for hd-code-review.
# It extends (not replaces) the base layer at .claude/skills/hd-code-review/CODING_STANDARDS.md.
# Sections omitted here inherit from the base layer.

## Stack Context

- Next.js 16 App Router (RSC + Server Actions)
- TypeScript 5.x strict
- Tailwind CSS v4 (CSS-first)
- shadcn/ui components
- Drizzle ORM + @libsql/client
- Zustand (client state only)
- Framer Motion (animations only)

---

## 2. Code Style

### 2.1 Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Variables / Functions | camelCase | `filteredTodos`, `handleToggle` |
| React Components | PascalCase | `TodoItem`, `FilterTabs` |
| Types / Interfaces | PascalCase | `Todo`, `UIState`, `Filter` |
| Files (components) | kebab-case | `todo-item.tsx`, `filter-tabs.tsx` |
| Files (lib/store) | kebab-case | `db.ts`, `ui.ts`, `schema.ts` |
| Database columns | snake_case | `due_date`, `created_at`, `updated_at` |
| Environment variables | UPPER_SNAKE_CASE | `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` |
| Server Actions | camelCase verb+noun | `createTodo`, `toggleTodo`, `deleteTodo` |

### 2.4 Project-Specific Patterns

**Server Actions (src/actions/)**
- Must be marked `'use server'` at top of file
- Must call `revalidatePath('/')` after every mutation
- Must validate title via `validateTitle()` before any DB write
- No direct DB access outside of `src/actions/` and `src/app/page.tsx` (RSC page)

**Components**
- RSC components: no `'use client'` directive, no hooks, no event handlers
- Client components: must have `'use client'` at top
- shadcn/ui primitives live in `src/components/ui/` — do not modify them directly
- Framer Motion: use `m.*` components (not `motion.*`) within a `LazyMotion` provider
- `LazyMotion` provider lives in `TodoList` — do not add another one in layout.tsx

**Database**
- All DB access via Drizzle ORM — no raw SQL strings
- `completed` field is integer `0/1` — always coerce: `!!todo.completed` in JSX, `completed ? 1 : 0` in actions
- `TURSO_DATABASE_URL` env-switch handles dev↔prod with zero code change

**Tailwind CSS v4**
- No `tailwind.config.js` — Tailwind v4 is CSS-first
- All theme tokens in `src/app/globals.css` under `@theme`
- Do not add a config file; it breaks the v4 build

**Zustand store**
- Client UI state only — `filter`, `editingId`, `searchQuery`, `sortOrder`
- Do not store server data (todos) in Zustand; that comes from RSC page props
- Export shared types from the store (e.g. `SortOrder`) for use in consumer components

---

## 3. Project Policies

### 3.1 Feature Flags

```yaml
feature_flags:
  provider: none
  required: no
```

### 3.2 Observability

```yaml
observability:
  provider: none
  required: no
```

### 3.3 Internationalization (i18n)

```yaml
i18n:
  required: no
  # Single-language personal tool. Hardcoded EN strings acceptable.
```
