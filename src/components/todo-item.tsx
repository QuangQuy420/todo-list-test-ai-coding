'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Pencil, Check, X, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DateTimePicker } from '@/components/date-time-picker'
import { useUIStore } from '@/store/ui'
import { toggleTodo, updateTodo, deleteTodo } from '@/actions/todos'
import type { Todo } from '@/lib/schema'
import { cn } from '@/lib/utils'

interface TodoItemProps {
  todo: Todo
}

const SPECTRUM_COLORS = [
  'var(--color-spectrum-1)', 'var(--color-spectrum-2)', 'var(--color-spectrum-3)',
  'var(--color-spectrum-4)', 'var(--color-spectrum-5)', 'var(--color-spectrum-6)',
  'var(--color-spectrum-7)',
] as const

function getSpectrumColor(id: number): string {
  return SPECTRUM_COLORS[id % SPECTRUM_COLORS.length]
}

function getDueDateClass(dueDate: string | null): string {
  if (!dueDate) return ''
  const now = new Date()
  const due = new Date(dueDate)

  if (due < now) return 'text-red-500'

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const dueDay = new Date(due)
  dueDay.setHours(0, 0, 0, 0)
  if (dueDay.getTime() === todayStart.getTime()) return 'text-yellow-500'

  return ''
}

function formatDueDate(dueDate: string | null): string {
  if (!dueDate) return ''
  const date = new Date(dueDate)
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  if (dueDate.includes('T')) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }
  return date.toLocaleString(undefined, options)
}

export function TodoItem({ todo }: TodoItemProps) {
  const { editingId, setEditingId } = useUIStore()
  const isEditing = editingId === todo.id
  const editInputRef = useRef<HTMLInputElement>(null)
  const [editDueDate, setEditDueDate] = useState<string | null>(todo.due_date ?? null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [checkBounce, setCheckBounce] = useState(false)

  const isCompleted = !!todo.completed
  const dueDateClass = getDueDateClass(todo.due_date)

  // Reset edit due date when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setEditDueDate(todo.due_date ?? null)
    }
  }, [isEditing, todo.due_date])

  // Focus edit input when entering edit mode
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [isEditing])

  const handleToggle = useCallback(async () => {
    // Trigger bounce animation
    setCheckBounce(true)
    setTimeout(() => setCheckBounce(false), 400)
    await toggleTodo(todo.id)
  }, [todo.id])

  const handleDelete = useCallback(async () => {
    setIsDeleting(true)
    // Small delay to let the exit animation play before server action
    await new Promise((resolve) => setTimeout(resolve, 300))
    await deleteTodo(todo.id)
  }, [todo.id])

  const handleEditSave = async () => {
    const newTitle = editInputRef.current?.value.trim()
    if (!newTitle) {
      setEditingId(null)
      return
    }
    await updateTodo(todo.id, newTitle, editDueDate ?? undefined)
    setEditingId(null)
  }

  const handleEditCancel = () => {
    setEditingId(null)
  }

  const handleEditKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      await handleEditSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleEditCancel()
    }
  }

  // Keyboard: Delete key on focused item to delete
  const handleItemKeyDown = useCallback(
    async (e: React.KeyboardEvent) => {
      if (e.key === 'Delete' && !isEditing) {
        e.preventDefault()
        await handleDelete()
      }
    },
    [isEditing, handleDelete]
  )

  return (
    <AnimatePresence>
      {!isDeleting && (
        <m.li
          layout
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -40, height: 0, marginTop: 0, marginBottom: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex items-start gap-3 rounded-lg glass-surface border-l-4 px-4 py-4 shadow-xs transition-colors hover:bg-accent/5 focus-within:ring-1 focus-within:ring-ring/30 outline-none list-none"
          style={{ borderLeftColor: getSpectrumColor(todo.id) }}
          tabIndex={0}
          onKeyDown={handleItemKeyDown}
          aria-label={`Todo: ${todo.title}`}
        >
          {/* Checkbox with bounce animation */}
          <m.span
            animate={checkBounce ? { scale: [1, 1.4, 0.85, 1.1, 1] } : { scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="flex items-center pt-0.5"
          >
            <Checkbox
              checked={isCompleted}
              onCheckedChange={handleToggle}
              aria-label={isCompleted ? 'Mark as active' : 'Mark as completed'}
            />
          </m.span>

          {/* Title / Edit Input */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex flex-col gap-3">
                <Input
                  ref={editInputRef}
                  defaultValue={todo.title}
                  onKeyDown={handleEditKeyDown}
                  className="h-8 text-sm"
                  aria-label="Edit todo title"
                />
                <DateTimePicker
                  value={editDueDate}
                  onChange={setEditDueDate}
                  placeholder="Set due date (optional)"
                />
              </div>
            ) : (
              <div className="truncate relative text-sm">
                <span
                  className={cn(
                    'transition-colors duration-200',
                    isCompleted && 'text-muted-foreground'
                  )}
                >
                  {todo.title}
                </span>
                {/* Animated strikethrough */}
                <m.span
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-muted-foreground origin-left"
                  initial={false}
                  animate={isCompleted ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{ width: '100%' }}
                  aria-hidden="true"
                />
              </div>
            )}

            {/* Due date — hidden during edit mode */}
            {!isEditing && todo.due_date && (
              <p className={cn('text-xs mt-1', dueDateClass || 'text-muted-foreground')}>
                Due: {formatDueDate(todo.due_date)}
              </p>
            )}
          </div>

          {/* Edit-mode save/cancel buttons */}
          {isEditing && (
            <div className="flex gap-1 mt-0.5 shrink-0">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleEditSave}
                aria-label="Save edit"
                className="text-muted-foreground hover:text-green-500"
              >
                <Check size={14} aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleEditCancel}
                aria-label="Cancel edit"
                className="text-muted-foreground hover:text-destructive"
              >
                <X size={14} aria-hidden="true" />
              </Button>
            </div>
          )}

          {/* Pencil trigger (enter edit mode) — hidden during edit */}
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setEditingId(todo.id)}
              aria-label={`Edit: ${todo.title}`}
              className="text-muted-foreground hover:text-foreground shrink-0"
            >
              <Pencil size={14} aria-hidden="true" />
            </Button>
          )}

          {/* Delete button — hidden during edit */}
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleDelete}
              aria-label="Delete todo"
              className="text-muted-foreground hover:text-destructive shrink-0"
            >
              <Trash2 size={14} aria-hidden="true" />
            </Button>
          )}
        </m.li>
      )}
    </AnimatePresence>
  )
}
