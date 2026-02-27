# Approach: Enhanced Todo Edit

## Gap Analysis

| Component | Have | Need | Gap |
|---|---|---|---|
| Edit trigger | `handleTitleClick()` on title `<button>` | Pencil `<Button>` (lucide-react `Pencil` icon) | Remove title-click; add pencil icon-sm button |
| Edit layout | Single title `<Input>` only | Inline flex row: [title Input flex-1] + [datetime-local Input w-48] | Add `editDueDateRef` + second input, refactor flex structure |
| Due date editing | `todo.due_date` passed unchanged | Read from `editDueDateRef.current?.value` on save | Change `handleEditSave` to read new ref |
| Save/cancel buttons | None (Enter/Esc only) | `Check` + `X` icon buttons visible during edit | Add conditional save/cancel buttons |
| `onBlur` save | Present — fires prematurely when focus moves between two inputs | Remove | Remove `onBlur={handleEditSave}` from title input |
| Delete button visibility | Always visible | Hidden during edit mode (replaced by save/cancel) | Conditionalize on `!isEditing` |

## Recommended Approach

**Single-file change: `src/components/todo-item.tsx`**

No backend changes — `updateTodo(id, title, dueDate?)` already accepts both fields.

### Step-by-step changes:
1. **Imports**: Add `Pencil, Check, X` from `lucide-react`
2. **New ref**: `const editDueDateRef = useRef<HTMLInputElement>(null)`
3. **Remove** `handleTitleClick` function (replaced by pencil button onClick)
4. **Modify** `handleEditSave`: read `editDueDateRef.current?.value || undefined` instead of `todo.due_date`
5. **Edit mode JSX**: Replace single Input with flex row containing title Input + datetime-local Input (no `onBlur`)
6. **Add save/cancel buttons** after flex-1 div, visible only when `isEditing`
7. **Add pencil button** next to delete button (both visible in view mode — Option B: preserves one-click delete)
8. **Conditionalize delete button** to `!isEditing`
9. **Hide due date paragraph** during edit (`{!isEditing && todo.due_date && ...}`)
10. **Outer div class**: `cn('min-w-0', isEditing ? 'flex flex-1 items-center gap-2' : 'flex-1')`

### Alternative approaches considered:
- **Modal dialog**: Dialog.tsx is available but adds unnecessary complexity for this simple two-field form. Inline keeps context and matches existing UX.
- **Title-click + pencil**: Keeping title-click as secondary trigger would cause accidental edits. Pencil-only is cleaner.

## Risk Map

| Component | Risk | Reason | Verification |
|---|---|---|---|
| `onBlur` removal | LOW | Removes fragile behavior; save via Enter or save button | Proceed |
| Due date `defaultValue` | LOW | ISO datetime string directly accepted by `datetime-local` input | Proceed |
| Empty string → undefined for due date | LOW | `dueDate || null` in action handles cleared input → null | Proceed |
| Row width at mobile | MEDIUM | Two inputs + two buttons may overflow narrow viewports | Test at ≤375px; use `w-36` for due date input if overflow occurs |
| Framer Motion `layout` prop | LOW | `m.li` already has `layout` — will animate row expansion naturally | Proceed |
| Tab/keyboard order | LOW | Natural DOM order is correct; no tabIndex needed | Proceed |

**All risks LOW/MEDIUM → no spikes required.**

## Implementation scope

| File | Change |
|---|---|
| `src/components/todo-item.tsx` | All changes (9 points above) |
| `src/actions/todos.ts` | None — already supports `updateTodo(id, title, dueDate?)` |
| `src/store/ui.ts` | None — `editingId` is sufficient |
| `src/components/ui/` | None — `Input`, `Button` primitives already exist |
