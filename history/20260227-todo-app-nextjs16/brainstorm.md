# Brainstorm: Modern Todo App — Next.js 16 (2026)

**Date:** 2026-02-27
**Status:** Concluded — ready for planning

---

## Problem Statement

Build a modern, visually polished todo list web app in 2026 using Next.js 16. Target: personal tool / portfolio demo. No auth, no multi-user. Ship fast, look great.

---

## Requirements

- **Framework:** Next.js 16 App Router
- **Auth:** None
- **Features:** Create / complete / delete / edit todos, filter (All/Active/Completed), due dates, dark mode
- **Deployment:** Vercel
- **Database:** SQLite (local dev) → Turso (prod)

---

## Evaluated Approaches

### Option A — Minimal ✅ CHOSEN
```
Next.js 16 App Router
├── Server Actions (CRUD — no API routes)
├── Drizzle ORM + @libsql/client
├── file:./local.db (dev) → Turso free tier (prod)
├── shadcn/ui + Tailwind CSS v4
├── Zustand (filter + UI state only)
├── Framer Motion (microinteractions)
└── Vercel
```
**Pros:** Ships in 2-3 days. Zero infra cost. Dead simple mental model.
**Cons:** No real-time, no multi-user — acceptable for scope.

### Option B — Standard SaaS ❌ Rejected (over-scoped)
Supabase + Drizzle + Clerk Auth + TanStack Query. Too heavy for no-auth personal tool.

### Option C — AI-Enhanced ❌ Rejected (not the differentiator here)
NLP task creation via Vercel AI SDK. Adds cost and complexity beyond stated scope.

---

## Final Architecture

### Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 16.1 (App Router) | Turbopack default, Server Actions, RSC |
| Styling | Tailwind CSS v4 | Industry standard, v4 perf gains |
| Components | shadcn/ui | Accessible, copy-paste ownership |
| Animation | Framer Motion | Microinteractions (check, delete, filter) |
| Client state | Zustand | Filter state + modal open/close only |
| Database (dev) | SQLite via `file:./local.db` | Zero config, instant local dev |
| Database (prod) | Turso (libSQL) | SQLite-compatible, works on Vercel serverless |
| ORM | Drizzle ORM | Lightweight, type-safe, Edge-compatible |
| Hosting | Vercel | Native Next.js, free tier sufficient |

### Data Model (SQLite/Turso)

```sql
CREATE TABLE todos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  title     TEXT    NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,  -- boolean
  due_date  TEXT,                         -- ISO 8601 date string
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, theme provider
│   ├── page.tsx            # Main todo page
│   └── globals.css
├── components/
│   ├── todo-list.tsx       # List container (RSC)
│   ├── todo-item.tsx       # Single item (client, animations)
│   ├── todo-form.tsx       # Add todo form (client)
│   ├── filter-tabs.tsx     # All/Active/Completed tabs
│   └── theme-toggle.tsx    # Dark mode toggle
├── lib/
│   ├── db.ts               # Drizzle + libSQL client
│   └── schema.ts           # Drizzle schema
├── actions/
│   └── todos.ts            # Server Actions (CRUD)
└── store/
    └── ui.ts               # Zustand (filter, editing state)
```

### Key Implementation Patterns

**Server Actions (no API routes):**
```ts
// actions/todos.ts
'use server'
import { db } from '@/lib/db'
import { todos } from '@/lib/schema'
import { revalidatePath } from 'next/cache'

export async function createTodo(title: string, dueDate?: string) {
  await db.insert(todos).values({ title, due_date: dueDate ?? null })
  revalidatePath('/')
}

export async function toggleTodo(id: number, completed: boolean) {
  await db.update(todos).set({ completed: completed ? 1 : 0 }).where(eq(todos.id, id))
  revalidatePath('/')
}
```

**Env switching (dev → prod zero code change):**
```bash
# .env.local
TURSO_DATABASE_URL=file:./local.db

# Vercel env vars
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
```

### UI/UX Decisions (2026 Standards)

- **Dark mode default** — system preference via `next-themes`, Tailwind `dark:` classes
- **Glassmorphism** — frosted-glass card for todo list container
- **Microinteractions** — Framer Motion: checkbox scale bounce, strike-through on complete, slide-out on delete
- **Due date visual** — color-coded: green (future), amber (today), red (overdue)
- **Filter tabs** — shadcn/ui Tabs component, count badges per filter
- **Keyboard shortcuts** — `n` new task, `Enter` save, `Esc` cancel, `Delete` remove focused item

---

## Implementation Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Turso cold start latency | LOW | Simple queries <10ms; acceptable |
| Vercel `/tmp` SQLite confusion | LOW | Use Turso for prod, never `better-sqlite3` on Vercel |
| Drizzle schema migrations on Turso | LOW | `drizzle-kit push` works against remote URL |
| Framer Motion bundle size | LOW | Tree-shake; only animate todo-item |
| shadcn/ui "generic look" | LOW | Custom color palette + glassmorphism shell differentiates |

---

## Success Metrics

- [ ] CRUD operations work end-to-end
- [ ] Filter state persists on page refresh (URL param or Zustand + localStorage)
- [ ] Due dates render color-coded correctly
- [ ] Dark/light mode toggles without flash
- [ ] Animations don't block interaction (layout: false on Framer variants)
- [ ] Deploys to Vercel in one `git push`
- [ ] Lighthouse score ≥ 90 on performance and accessibility

---

## Security Considerations

**Data classification:** Public (no auth, no PII beyond self-entered task text)
**PII involved:** No
**API surface:** Internal only (Server Actions, not public REST)
**Key risks:**

| Risk | Severity | Note |
|---|---|---|
| Server Action input not sanitized | MEDIUM | Validate title length, strip HTML — Drizzle parameterizes queries (no SQL injection) |
| Turso auth token leaked | HIGH | Never commit `.env` — use Vercel env vars |
| XSS via task title rendering | LOW | React escapes by default — avoid `dangerouslySetInnerHTML` |

**Compliance:** N/A (no user data, no auth)

---

## Next Steps

1. Scaffold Next.js 16 project with Tailwind v4 + shadcn/ui
2. Set up Drizzle schema + Turso connection
3. Implement Server Actions (create, toggle, delete, edit)
4. Build UI components (list, item, form, filter tabs)
5. Add due date picker + color-coded display
6. Implement dark mode with next-themes
7. Add Framer Motion microinteractions
8. Deploy to Vercel + configure Turso production DB
