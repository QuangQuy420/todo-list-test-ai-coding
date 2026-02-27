# Approach: Rainbow/Spectrum Colorful UI

## Clarifications

| Question | Answer | Impact |
|---|---|---|
| Aesthetic direction | Rainbow / Spectrum Palette | Each todo item gets a distinct spectrum color; playful + colorful |
| Color scope | All 4 areas | Background gradient, todo item colors, filter tabs+buttons, progress bar |

**User Confirmation**: 2026-02-27

---

## Gap Analysis

| Component | Have | Need | Gap |
|---|---|---|---|
| Background | Dark violet→indigo→slate gradient | Soft colorful multi-hue gradient | New gradient classes in `page.tsx` |
| Color tokens | Single violet accent | 7-color spectrum palette | New `@spectrum-*` tokens in `globals.css` |
| Todo items | Flat glass-surface, no color accent | Per-item color tint based on spectrum | Color assignment logic + tinted border/bg per item |
| Filter tabs | All violet active state | Distinct color per tab (all/active/completed) | Update `filter-tabs.tsx` active-state classes |
| Progress bar | Solid violet fill | Rainbow gradient fill | CSS gradient on progress bar inner div |
| Todo item border | `border-transparent` | Left border accent in item's spectrum color | Add `border-l-4` with color token |

---

## Recommended Approach

### 7-Color Spectrum Palette (OKLCH)
Define 7 named spectrum tokens in `globals.css` under `@theme` using perceptually-uniform OKLCH values with high chroma for vivid, accessible colors in both light and dark modes.

```
spectrum-1: red/coral     oklch(0.65 0.23 25)
spectrum-2: orange        oklch(0.72 0.19 60)
spectrum-3: amber/yellow  oklch(0.80 0.18 90)
spectrum-4: green         oklch(0.68 0.20 145)
spectrum-5: teal/cyan     oklch(0.70 0.18 195)
spectrum-6: blue          oklch(0.62 0.20 240)
spectrum-7: violet/purple oklch(0.60 0.22 290)
```

Dark mode variants: slightly lighter (+0.05L) and same chroma.

### Todo Item Color Assignment
- Assign spectrum color by `todo.id % 7 + 1` (deterministic, stable per item)
- Apply as: left border accent (`border-l-4 border-[var(--color-spectrum-N)]`) + very subtle bg tint (`bg-[var(--color-spectrum-N)]/5`)
- The glass-surface base remains — color is additive, not replacing it

### Background Gradient
Replace `from-violet-950 via-indigo-950 to-slate-950` with a softer, more colorful gradient:
- Light: `from-rose-50 via-purple-50 to-cyan-50` — airy pastel
- Dark: `from-rose-950/60 via-purple-950/60 to-cyan-950/60` — deep colorful dark

### Filter Tabs
- "All" tab: blue (`spectrum-6`)
- "Active" tab: orange (`spectrum-2`)
- "Completed" tab: green (`spectrum-4`)

### Progress Bar
- Replace `bg-accent-violet` with a CSS linear gradient:
  `background: linear-gradient(to right, var(--color-spectrum-4), var(--color-spectrum-5), var(--color-spectrum-6), var(--color-spectrum-7))`

---

## Risk Map

| Component | Risk | Reason | Verification |
|---|---|---|---|
| New CSS tokens in @theme | LOW | Pattern exists in globals.css | Proceed |
| Todo item color assignment | LOW | Simple modulo in existing component | Proceed |
| Background gradient | LOW | Just class change in page.tsx | Proceed |
| Filter tab active states | LOW | Just class change in filter-tabs.tsx | Proceed |
| Progress bar gradient | LOW | Inline style change | Proceed |

**Overall: All LOW risk — no spikes needed.**

---

## Decomposition Plan

### Bead 1: Spectrum Color Tokens
- Add 7 `--spectrum-*` OKLCH tokens to `globals.css` (both `:root` and `.dark`)
- Register in `@theme inline` block

### Bead 2: Colorful Background Gradient
- Update `page.tsx` background gradient (light + dark variants)

### Bead 3: Todo Item Spectrum Colors
- Add color assignment helper in `todo-item.tsx`
- Apply left border accent + subtle bg tint per item

### Bead 4: Filter Tabs Multi-Color
- Update `filter-tabs.tsx` — distinct active color per tab

### Bead 5: Rainbow Progress Bar
- Update `todo-progress.tsx` — gradient fill instead of solid violet
