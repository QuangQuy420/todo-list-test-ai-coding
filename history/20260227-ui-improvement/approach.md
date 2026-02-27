# Approach: UI Improvement — Full Project

## Gap Analysis

| Component | Have | Need | Gap |
| --------- | ---- | ---- | --- |
| `globals.css` | Zero-chroma OKLCH neutrals only; glassmorphism tokens defined | Violet/indigo accent tokens wired into `--primary`, `--accent`, `--ring` | No chromatic accent in token system; all interactive elements gray |
| `page.tsx` | `bg-gradient-to-br from-slate-900 to-slate-800`; stray `<h1>Todos</h1>` in-page | Violet/indigo gradient background; no h1 in page body | Wrong gradient hue; branding in wrong place |
| `layout.tsx` | Header: ThemeToggle on right only; `bg-background/80` | Left: CheckSquare icon + "Todos" wordmark; Right: ThemeToggle; `glass-header` | Header identity missing; background clashes with gradient |
| `todo-form.tsx` | Always-visible 192px datetime-local input cramping the row | Title + Add on row 1; CalendarDays toggle reveals datetime-local below on demand | Datetime input permanently consumes space regardless of user intent |
| `todo-item.tsx` | `bg-card` (solid) breaks glassmorphism depth; delete = inline SVG | `glass-surface border-transparent`; delete = `Trash2` from lucide-react | Visual discontinuity and icon inconsistency |
| `filter-tabs.tsx` | `TabsList` floats left, default neutral active state | `w-full` list; `data-[state=active]:bg-accent-violet data-[state=active]:text-white` | Tabs don't fill container; no accent identity on active state |
| `todo-list.tsx` | Empty state: plain gray text only | `ClipboardList` icon + heading + sub-text | Empty state lacks visual interest |
| Progress bar | Does not exist | New `src/components/todo-progress.tsx` | Zero progress feedback |
| Header branding | Does not exist | `CheckSquare` icon + "Todos" text in header left slot | No app identity in persistent chrome |

---

## Recommended Approach

Changes are purely cosmetic and structural — no data model changes, no new server actions, no new routes. All 9 beads can be parallelized after Bead 1 (accent tokens) lands, since all subsequent files reference `--color-accent-violet`.

The `--primary` override cascades automatically: `data-[state=checked]:bg-primary` in `checkbox.tsx` and `bg-primary` in Button default variant both become violet with no component changes.

Header uses `glass-header` utility (already defined in globals.css) for seamless integration with the page gradient.

Form collapse uses local `useState<boolean>` — no Zustand store change needed; it's ephemeral UI state.

Progress bar uses CSS transition (not Framer Motion) to avoid `LazyMotion` scope issues.

---

## Design Specification (Inline UI Standard)

### Accent Color Tokens (add to globals.css)

**`:root` (light mode):**
```css
--primary:              oklch(0.6 0.22 270);
--primary-foreground:   oklch(0.98 0.01 270);
--accent:               oklch(0.94 0.04 270);
--accent-foreground:    oklch(0.35 0.18 270);
--ring:                 oklch(0.6 0.22 270);
--accent-violet:        oklch(0.6 0.22 270);
--accent-violet-dark:   oklch(0.55 0.25 270);
--accent-violet-muted:  oklch(0.94 0.04 270);
```

**`.dark`:**
```css
--primary:              oklch(0.65 0.22 270);
--primary-foreground:   oklch(0.98 0.01 270);
--accent:               oklch(0.269 0.06 270);
--accent-foreground:    oklch(0.88 0.06 270);
--ring:                 oklch(0.55 0.22 270);
--accent-violet:        oklch(0.65 0.22 270);
--accent-violet-dark:   oklch(0.55 0.25 270);
--accent-violet-muted:  oklch(0.30 0.08 270);
```

**`@theme inline` block (add):**
```css
--color-accent-violet:       var(--accent-violet);
--color-accent-violet-dark:  var(--accent-violet-dark);
--color-accent-violet-muted: var(--accent-violet-muted);
```

### Background gradient retheme

Replace `<main>` className in `page.tsx`:
```
from-violet-950 via-indigo-950 to-slate-950
dark:from-[oklch(0.12_0.08_270)] dark:via-[oklch(0.10_0.06_265)] dark:to-[oklch(0.08_0.03_260)]
```
Remove entire `<div className="flex items-center justify-between mb-6">` wrapper with `<h1>Todos</h1>`.

### Header design

Replace `<header>` className with: `glass-header flex items-center justify-between px-5 py-3 sticky top-0 z-50`

Left slot:
```tsx
<div className="flex items-center gap-2 text-white/90">
  <CheckSquare className="size-5 text-accent-violet" />
  <span className="text-sm font-semibold tracking-wide">Todos</span>
</div>
```

### TodoItem harmonization

In `m.li`: replace `border bg-card` → `glass-surface border-transparent`

Replace inline SVG delete with `<Trash2 size={14} />` (add to lucide-react import).

### FilterTabs

```tsx
<TabsList className="w-full">
  <TabsTrigger
    value="all"
    className="data-[state=active]:bg-accent-violet data-[state=active]:text-white"
  >
```
Apply same className to all three triggers.

### Progress bar spec

New `src/components/todo-progress.tsx`:
```tsx
interface TodoProgressProps { todos: Todo[] }
// Calculation: total, completedCount, pct = total===0 ? 0 : Math.round(completedCount/total*100)
// Layout: label row ("Progress" + "N / M") + track div (bg-white/10 h-1.5) + fill div (bg-accent-violet, CSS width transition 0.5s)
// Placed in page.tsx between <FilterTabs> and <TodoList>
```
Uses CSS transition (`style={{ width: `${pct}%`, transition: 'width 0.5s ease-out' }}`), NOT Framer Motion.

### Form collapse

```tsx
const [showDueDate, setShowDueDate] = useState(false)
// Row 1: title + CalendarDays toggle (ghost icon-sm, text-accent-violet when open) + Add button
// Row 2 (conditional): datetime-local input, full width
```

### Empty state

```tsx
<div className="py-12 flex flex-col items-center gap-3 text-center">
  <ClipboardList className="size-10 text-muted-foreground/40" strokeWidth={1.5} />
  <div>
    <p className="text-sm font-medium text-muted-foreground">{message}</p>
    {filter === 'all' && <p className="text-xs text-muted-foreground/60 mt-0.5">Add one above to get started.</p>}
  </div>
</div>
```

---

## Risk Map

| Component | Risk | Reason | Verification |
| --------- | ---- | ------- | ------------ |
| `--primary` override cascade | LOW | Only `button.tsx` and `checkbox.tsx` use `bg-primary` in this project — both intentionally adopt violet | Read all ui/ component files |
| `glass-surface` in light mode | LOW | May look washed out on violet gradient; adjust to `bg-transparent` or `bg-white/5` if chalky | Visual browser check |
| `data-[state=active]:bg-accent-violet` in Tailwind v4 | LOW | Works as long as `--color-accent-violet` is registered in `@theme inline` (Bead 1) | `npm run build` |
| `dueDateRef` when hidden | LOW | Optional chaining `dueDateRef.current?.value` safely returns undefined when input unmounted | Manual form submit test |
| Progress bar CSS transition vs Framer Motion | LOW | CSS transition avoids LazyMotion scope issue; document in comment | Code review |
| `glass-header` backdrop-filter | LOW | Sticky header above gradient sibling — backdrop-filter correctly reads through | Visual scroll test |
| Bead ordering | MEDIUM | All violet utility classes invisible if Bead 1 skipped; enforce as blocker in bead tracker | Bead dependency graph |
