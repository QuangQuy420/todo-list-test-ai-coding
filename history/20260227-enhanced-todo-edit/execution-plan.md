# Execution Plan: Enhanced Todo Edit

Epic: hdkit-project-1-14x
Generated: 2026-02-27

## Tracks

| Track | Agent | Beads (in order) | File Scope |
|---|---|---|---|
| 1 | BlueLake | hdkit-project-1-14x.1 | `src/components/todo-item.tsx` |

## Track Details

### Track 1: BlueLake — Enhance TodoItem inline edit

**File scope**: `src/components/todo-item.tsx`
**Beads**:

1. `hdkit-project-1-14x.1`: Enhance inline edit in TodoItem — pencil trigger, due date field, save/cancel buttons

**What to build:**
- Add `Pencil`, `Check`, `X` imports from `lucide-react`
- Add `editDueDateRef = useRef<HTMLInputElement>(null)`
- Remove `handleTitleClick`
- Update `handleEditSave` to read `editDueDateRef.current?.value`
- Replace single-input edit mode with two-input flex row (title + datetime-local)
- Remove `onBlur` from title input
- Add `{isEditing && <Check/> + <X/>}` save/cancel buttons
- Add `{!isEditing && <Pencil/>}` trigger + conditionalize delete button to `!isEditing`
- Hide due date display paragraph during edit

## Cross-Track Dependencies

None — single track, single file.

## Key Notes

- **No backend changes**: `updateTodo(id, title, dueDate?)` already handles everything
- **No new dependencies**: `lucide-react`, `Input`, `Button` all already installed
- **Pattern reference**: Follow `TodoForm` for the two-ref uncontrolled input + datetime-local layout
- **onBlur removal is intentional**: Without it, focus can freely move between title input, due date input, and action buttons
- **Row width risk (MEDIUM)**: If the two inputs overflow on small screens, reduce due date input to `w-36`
