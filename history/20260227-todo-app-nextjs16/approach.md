# Approach: Modern Todo App — Next.js 16 (2026)

## Gap Analysis

All components require 100% net-new implementation (greenfield project).

| Component | Have | Need | Gap |
|---|---|---|---|
| Project Scaffold | Nothing | create-next-app@16, TS, App Router | 100% |
| next.config.ts | None | `serverExternalPackages: ['@libsql/client']` | 100% |
| Tailwind v4 + globals.css | None | CSS-first `@theme`, glassmorphism tokens, OKLCH palette | 100% |
| shadcn/ui init | None | `npx shadcn@latest init`, new-york style, Tabs/Input/Checkbox/Button/Dialog | 100% |
| lib/schema.ts | None | Drizzle table: id, title, completed (int), due_date, created_at, updated_at | 100% |
| lib/db.ts | None | Drizzle + libsql, env-switched URL (file:./local.db ↔ Turso) | 100% |
| drizzle.config.ts + .env.local | None | dialect: 'turso', migrations dir, TURSO_DATABASE_URL | 100% |
| actions/todos.ts | None | createTodo, toggleTodo, updateTodo, deleteTodo + input validation | 100% |
| app/layout.tsx | None | ThemeProvider (next-themes), suppressHydrationWarning | 100% |
| app/page.tsx | None | RSC, DB query, TodoList + TodoForm + FilterTabs | 100% |
| store/ui.ts | None | Zustand: filter + editingId | 100% |
| components/filter-tabs.tsx | None | shadcn Tabs, count badges, Zustand filter state | 100% |
| components/todo-list.tsx | None | RSC, empty state, maps to TodoItem | 100% |
| components/todo-item.tsx | None | Client, toggle/delete/edit, due date color logic, keyboard Delete | 100% |
| components/todo-form.tsx | None | Client, createTodo action, n/Enter/Esc keyboard shortcuts | 100% |
| components/theme-toggle.tsx | None | useTheme, mounted guard, lucide icons | 100% |
| Framer Motion animations | None | LazyMotion + m, checkbox bounce, strike-through, AnimatePresence slide-out | 100% |
| Vercel deployment | None | Git push deploy, Turso prod env vars, drizzle-kit migrate | 100% |

## Recommended Approach

**Build order (strict dependency sequence):**

1. **Foundation:** Scaffold → Tailwind v4 + shadcn init → next.config.ts
2. **Data Layer:** schema.ts → db.ts → drizzle.config.ts → `drizzle-kit push`
3. **Server Logic:** actions/todos.ts (CRUD + validation)
4. **UI Shell:** store/ui.ts → layout.tsx → page.tsx → filter-tabs → todo-list → theme-toggle
5. **Interactive:** todo-form → todo-item (functional)
6. **Polish:** Framer Motion → glassmorphism → Vercel deploy

## Risk Map

| Component | Risk | Reason | Mitigation |
|---|---|---|---|
| Project Scaffold | LOW | Well-known pattern | `create-next-app@16` (Node v24.12 compatible) |
| next.config.ts | LOW | Known Turbopack requirement | `serverExternalPackages: ['@libsql/client']` must be set before first `next dev` |
| Tailwind v4 | LOW | Breaking change from v3 (CSS-first) | No `tailwind.config.js`; use `@theme` in `globals.css`; `tw-animate-css` not `tailwindcss-animate` |
| shadcn/ui | LOW | v4-compatible CLI stable | Run `npx shadcn@latest init` on fresh Next 16 project |
| Drizzle + libSQL | LOW | Pattern documented by Drizzle team | `drizzle-kit push` for dev; `drizzle-kit migrate` for prod |
| Server Actions | LOW | First-class Next.js 16 feature | `'use server'` + `revalidatePath('/')` + Drizzle queries |
| Framer Motion | LOW | Bundle size mitigable | Use `m` + `LazyMotion` (~4.6kb vs ~34kb) |
| next-themes | LOW | Hydration flash is known/fixed | `suppressHydrationWarning` + `mounted` guard in toggle |
| Vercel deploy | LOW | Native Next.js hosting | `serverExternalPackages` ensures `@libsql/client` works on serverless |
| Input security | LOW (mitigated) | Server Action surface | Validate title length + strip HTML; Drizzle parameterizes queries |

## Hidden Dependencies (critical sequencing)

1. `next.config.ts` serverExternalPackages → must exist before first `next dev` (DB import will fail)
2. `drizzle-kit push` → must run before `next dev` (no `todos` table = runtime crash)
3. `ThemeProvider` in layout → must precede any `useTheme` usage
4. `shadcn init` → must precede all `@/components/ui/*` imports
5. Zustand store → must exist before `FilterTabs` and `TodoItem` edit mode
6. `LazyMotion` provider → must wrap all `m.*` components in `todo-item`
