# Discovery Report: Enhanced Todo Edit Feature

## Architecture Snapshot

- **Framework**: Next.js 16 App Router — RSC page (`page.tsx`) + Client Components
- **Key modules**:
  - `src/components/todo-item.tsx` — inline edit lives here (Zustand `editingId`)
  - `src/actions/todos.ts` — `updateTodo(id, title, dueDate?)` already supports both fields
  - `src/store/ui.ts` — `editingId: number | null` + `setEditingId`
  - `src/components/ui/dialog.tsx` — full Dialog primitive already installed, **not currently used**
- **Entry point for edit**: `handleTitleClick` in `todo-item.tsx:79-81` sets `editingId`

## Existing Patterns

### Current Inline Edit (title-only)
- **Trigger**: click title text → sets `editingId` via Zustand
- **UI**: `<Input ref={editInputRef} defaultValue={todo.title} />` replaces title button
- **Save**: Enter key or `onBlur` → calls `updateTodo(id, newTitle, todo.due_date)` (due_date unchanged)
- **Cancel**: Esc → `setEditingId(null)`
- **Gap**: **Due date cannot be changed during inline edit** — the datetime-local input is absent

### Similar Pattern in TodoForm
- `TodoForm` uses two `ref`-controlled inputs: title (`type="text"`) + due date (`type="datetime-local"`)
- `useRef` pattern (uncontrolled inputs) is the convention — avoid `useState` for form values
- "Clear on Esc" + "submit on Enter" keyboard convention established

### Dialog Component (available, unused)
- `src/components/ui/dialog.tsx` — full Radix UI dialog with overlay, animations, close button
- `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription` all available
- Fade + zoom-in animations on open/close

### Framer Motion constraint
- `LazyMotion + domAnimation` lives in `TodoList` — use `m.*` not `motion.*`
- No additional `LazyMotion` providers

## Technical Constraints

- **Node**: Next.js 16 / React 19
- **Tailwind v4**: CSS-first, no config file — only `globals.css @theme`
- **Glass styling convention**: `backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20`
- **shadcn/ui primitives**: Copy-paste ownership in `src/components/ui/` — available: button, checkbox, dialog, input, tabs
- **Zustand**: Client UI state only — do not store todos there
- **Server Actions**: Must call `revalidatePath('/')` after mutations

## Gap Analysis

| Capability | Have | Need | Gap |
|---|---|---|---|
| Edit title | ✅ Inline text input | Enhanced trigger/UX | Minor |
| Edit due_date | ❌ Absent in edit mode | datetime-local input in edit | **Missing** |
| Edit trigger | Click title text only | Clear edit button or enhanced trigger | Needs design |
| Edit save feedback | None (silent) | Visual confirmation | Nice-to-have |
| Edit cancel | Esc or click away | Explicit cancel affordance | Needs design |

## UI Work Detected

- UI patterns identified: edit form (title + datetime fields), possible modal dialog, possible inline expansion
- Existing `docs/ui-standards/` directory: **no**
- `## Worker Config` in AGENTS.md: **no**

## Clarifications

| Question | Answer | Impact |
|---|---|---|
| Edit UX pattern | **Inline expansion** — row expands with title + datetime picker side by side, no modal | No Dialog needed; extend todo-item.tsx only |
| Edit trigger | **Pencil icon button** (next to delete button); title-click trigger removed | `handleTitleClick` repurposed/removed; pencil `<Button>` added |
| UI standard | Follow existing patterns (TodoForm layout, glassmorphism tokens, shadcn/ui, h-7 inputs) | Worker uses existing conventions |

**User Confirmation**: 2026-02-27
