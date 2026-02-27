# Discovery Report: UI Improvement — Full Project

Date: 2026-02-27
Feature directory: `history/20260227-ui-improvement/`

---

## Architecture Snapshot

### Relevant Packages
- `tailwindcss@^4.2.1` — CSS-first, `@theme` tokens in `globals.css` (no config file)
- `framer-motion@^12.34.3` — LazyMotion + domAnimation pattern
- `lucide-react@^0.575.0` — Icons
- `next-themes@^0.4.6` — Light/dark with suppressHydrationWarning
- `radix-ui@^1.4.3` — Underlying primitives for shadcn/ui
- `tw-animate-css@^1.4.0` — Tailwind animation utility classes
- `@radix-ui/react-*` (button, checkbox, dialog, input, tabs) via shadcn copy-paste

### Key Modules (UI files)
```
src/app/layout.tsx        — Root layout: sticky header with only ThemeToggle on the right
src/app/page.tsx          — Main page: dark gradient bg, glassmorphism card (max-w-lg)
src/app/globals.css       — Tailwind v4 @theme tokens, OKLCH palette, glass utility classes
src/components/
  todo-form.tsx           — Flex row: title input + datetime-local + "Add" button
  filter-tabs.tsx         — shadcn Tabs with count badges
  todo-list.tsx           — LazyMotion wrapper, AnimatePresence, ul gap-2
  todo-item.tsx           — m.li with checkbox, title (strikethrough), due date, edit/delete
  theme-toggle.tsx        — Ghost icon button, Sun/Moon icons
src/components/ui/
  button.tsx, checkbox.tsx, input.tsx, tabs.tsx, dialog.tsx
```

### Current Color Palette (OKLCH — all neutral, zero chroma)
- Light mode: White/near-black neutrals, no accent hue
- Dark mode: Charcoal/light-gray neutrals, no accent hue
- Glassmorphism tokens: `--glass-bg`, `--glass-border`, `--glass-blur`, `--glass-shadow`
- Only colored elements: `text-red-500` (overdue), `text-yellow-500` (due today)

---

## Current UI Assessment — What Exists vs What Could Be Better

### ✅ Good (keep/build on)
- Glassmorphism card container in page.tsx — good foundation
- Framer Motion animations: checkbox bounce, strikethrough scaleX, item exit
- Animated strikethrough on TodoItem
- OKLCH color system (modern, perceptually uniform)
- Keyboard shortcuts architecture
- Due date color coding (red/yellow)
- LazyMotion bundle efficiency pattern

### ⚠️ Issues to Address
1. **No accent color** — All neutral palette, visually monotone/flat
2. **Header is empty** — Just a ThemeToggle floating right; no branding/title/identity
3. **TodoForm UX** — Title + datetime picker crammed in one line; datetime picker is always visible taking 12rem width even when no date needed
4. **TodoItem card inconsistency** — Items use `bg-card` (solid) inside a glassmorphism container; creates visual mismatch
5. **Filter tabs alignment** — TabsList not stretched to full width of container; looks disconnected
6. **No completion progress** — No visual feedback on overall task completion status
7. **Empty state** — Plain text, no icon, feels abandoned
8. **Delete button** — Uses inline SVG instead of lucide-react `Trash2` (inconsistency)
9. **Typography** — No distinctive font weight hierarchy beyond `text-2xl font-bold` for "Todos"
10. **Page title position** — "Todos" heading is inside the page flex layout, not in the header; awkward relationship with the sticky header
11. **Input/button styling** — Default shadcn inputs look fine but don't harmonize with glassmorphism background
12. **No separator** — No visual separation between form area and filter/list below

---

## Technical Constraints

- Node: latest (no version pinned in package.json)
- TypeScript strict mode ON
- Tailwind v4 CSS-first — no `tailwind.config.js` (NEVER create one)
- All theme tokens in `globals.css` under `@theme inline {}`
- shadcn/ui: new-york style, components in `src/components/ui/`
- Motion: must use `m.*` (not `motion.*`) inside LazyMotion
- Dark mode via `next-themes` class strategy — all color tokens support both modes
- No new npm packages unless essential (avoid bloat)

---

## UI Work Detected

- UI patterns identified: **list view, form, header/layout, global theme, glassmorphism cards**
- Existing `docs/ui-standards/` directory: **no** (only `docs/CODING_STANDARDS.md` and `docs/SECURITY_STANDARDS.md`)
- `## Worker Config` in project AGENTS.md: **no**
- `ui-theme.md` at root: **yes** — contains the `ui-design` skill license (references "bold aesthetic direction", "distinctive fonts", "cohesive color palettes")

---

## Clarifications

| Question | Answer | Impact |
| -------- | ------ | ------ |
| Aesthetic direction | **B — Bold identity** (decided by agent) | Retheme gradient background, add accent color, improve typography hierarchy |
| Accent color | **Violet/indigo** (`oklch(0.6 0.22 270)`) | Modern productivity feel, beautiful with glassmorphism; apply to primary, ring, active tab, progress bar, focus states |
| Form datetime layout | **A — Collapse** (decided by agent) | Datetime picker hidden behind "Add due date" toggle button; cleaner form UX |
| Progress bar | **YES** | New `todo-progress.tsx` component showing "X of Y completed" with colored bar |
| Better empty state | **YES** | Icon + styled message in TodoList empty state |
| App title/branding in header | **YES** | Left side of header: checkmark icon + "Todos" title; removes redundant heading from page.tsx |
| UI standard | **Inline** (decided by agent) | Glassmorphism + violet accent; follow existing patterns in globals.css glass utilities |

**User Confirmation**: 2026-02-27 (user said "decide everything")
