# Discovery Report: Colorful UI Update

## Architecture Snapshot

- Framework: Next.js 16 App Router — RSC + Server Actions
- Styling: Tailwind CSS v4 (CSS-first, `@theme` in `globals.css`) — NO `tailwind.config.js`
- Animation: Framer Motion 12.x via `LazyMotion` + `domAnimation` in `TodoList`
- UI primitives: shadcn/ui new-york style in `src/components/ui/`
- Theme: next-themes 0.4.x (light/dark, `suppressHydrationWarning`)

## Current Color Palette

| Token | Light | Dark |
|---|---|---|
| `--primary` | `oklch(0.6 0.22 270)` — violet | `oklch(0.65 0.22 270)` — violet |
| `--accent-violet` | `oklch(0.6 0.22 270)` | `oklch(0.65 0.22 270)` |
| `--background` | `oklch(1 0 0)` — white | `oklch(0.145 0 0)` — near-black |
| Overdue due date | `text-red-500` | same |
| Today due date | `text-yellow-500` | same |
| Future due date | `text-muted-foreground` | same |

**Page background gradient**: `from-violet-950 via-indigo-950 to-slate-950` (hard-coded class, not a CSS token)
**Container**: Glassmorphism — `bg-white/10 dark:bg-white/5 border border-white/20 rounded-2xl`
**Active filter tabs**: `data-[state=active]:bg-accent-violet data-[state=active]:text-white`
**Progress bar**: `bg-accent-violet`

## Current UI Files

| File | Role |
|---|---|
| `src/app/globals.css` | All design tokens (`@theme`), glass utilities |
| `src/app/layout.tsx` | Sticky header, ThemeToggle |
| `src/app/page.tsx` | Page bg gradient, glass container |
| `src/components/filter-tabs.tsx` | Tabs with violet active state |
| `src/components/todo-form.tsx` | Input + Add button |
| `src/components/todo-item.tsx` | List item, checkbox bounce, strikethrough |
| `src/components/todo-list.tsx` | Animated list container |
| `src/components/todo-progress.tsx` | Progress bar |

## Existing Patterns

- **Glassmorphism utilities**: `.glass`, `.glass-strong`, `.glass-card`, `.glass-surface`, `.glass-header`, `.glass-glow` in `globals.css`
- **Framer Motion**: LazyMotion provider in `todo-list.tsx`; `m.*` components in `todo-item.tsx`
- **OKLCH color space**: All tokens use `oklch()` — supports high chroma colors well
- **Monotone palette**: Currently single-accent violet everywhere, limited visual variety

## Technical Constraints

- Tailwind v4 CSS-first — must use `@theme` block in `globals.css` for new tokens
- No `tailwind.config.js` — do NOT create one
- Use `oklch()` for all new color tokens (consistent with existing)
- Framer Motion: use `m.*` not `motion.*`, stays within `LazyMotion` scope
- `completed` field is integer 0/1 — coerce with `!!todo.completed`

## UI Work Detected

- UI patterns identified: background/gradient, color palette expansion, component accent colors, animated effects
- Existing `docs/ui-standards/` directory: no
- `## Worker Config` in project AGENTS.md: no

## Clarifications (to be filled after Phase 2)
