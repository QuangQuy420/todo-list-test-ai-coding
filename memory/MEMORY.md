# Project Memory: hdkit-project-1

## Active Projects

### Todo App — Next.js 16 (2026-02-27)
- Brainstorm: `history/20260227-todo-app-nextjs16/brainstorm.md`
- Discovery: `history/20260227-todo-app-nextjs16/discovery.md`
- Approach: `history/20260227-todo-app-nextjs16/approach.md`
- Execution plan: `history/20260227-todo-app-nextjs16/execution-plan.md`
- Epic: `hdkit-project-1-282`
- Status: **COMPLETE** — 18/18 beads closed (2026-02-27), build passes, git initialized

## Stack (Todo App)
Next.js 16 App Router · Tailwind CSS v4 · shadcn/ui new-york · Framer Motion (LazyMotion) · Zustand · Drizzle ORM + @libsql/client · SQLite dev / Turso prod · next-themes · Vercel

## Critical Config Notes
- `serverExternalPackages: ['@libsql/client']` in next.config.ts — MUST be set before first `next dev`
- No `tailwind.config.js` — Tailwind v4 is CSS-first via `@theme` in globals.css
- Use `tw-animate-css` not `tailwindcss-animate`
- `completed` stored as integer 0/1 in DB
- `drizzle-kit push` for dev, `drizzle-kit migrate` for prod Turso

## Bead IDs (Todo App)
| Bead | ID |
|---|---|
| Epic | hdkit-project-1-282 |
| Scaffold | hdkit-project-1-1yn |
| next.config | hdkit-project-1-1yv |
| Tailwind+shadcn | hdkit-project-1-2xr |
| Drizzle schema+DB | hdkit-project-1-3hf |
| drizzle.config+migration | hdkit-project-1-16j |
| Server Actions | hdkit-project-1-1xj |
| Zustand store | hdkit-project-1-263 |
| Root layout | hdkit-project-1-2vh |
| Main page | hdkit-project-1-36t |
| FilterTabs | hdkit-project-1-1ak |
| TodoList | hdkit-project-1-39x |
| ThemeToggle | hdkit-project-1-3ql |
| TodoForm | hdkit-project-1-8pt |
| TodoItem (functional) | hdkit-project-1-2rb |
| Framer Motion | hdkit-project-1-f6o |
| Glassmorphism | hdkit-project-1-3cp |
| Deploy | hdkit-project-1-28a |
