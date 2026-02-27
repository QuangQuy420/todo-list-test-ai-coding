'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createTodo } from '@/actions/todos'

export function TodoForm() {
  const titleRef = useRef<HTMLInputElement>(null)
  const dueDateRef = useRef<HTMLInputElement>(null)
  const [showDueDate, setShowDueDate] = useState(false)

  // Keyboard shortcut: press 'n' to focus the input (when not already in an input)
  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement
    const isInInput =
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable

    if (e.key === 'n' && !isInInput && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault()
      titleRef.current?.focus()
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [handleGlobalKeyDown])

  const handleClear = () => {
    if (titleRef.current) titleRef.current.value = ''
    if (dueDateRef.current) dueDateRef.current.value = ''
    setShowDueDate(false)
    titleRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      handleClear()
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const title = titleRef.current?.value.trim()
    if (!title) return

    const dueDate = dueDateRef.current?.value || undefined
    await createTodo(title, dueDate)

    // Clear form after submission
    if (titleRef.current) titleRef.current.value = ''
    if (dueDateRef.current) dueDateRef.current.value = ''
    titleRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {/* Row 1: title + toggle + submit */}
      <div className="flex gap-2 items-center">
        <Input
          ref={titleRef}
          type="text"
          placeholder="Add a new todo… (press 'n' to focus)"
          onKeyDown={handleKeyDown}
          className="flex-1"
          autoComplete="off"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setShowDueDate((v) => !v)}
          aria-label={showDueDate ? 'Hide due date' : 'Add due date'}
          aria-expanded={showDueDate}
          className={cn(
            'text-muted-foreground shrink-0',
            showDueDate && 'text-accent-violet'
          )}
        >
          <CalendarDays size={16} aria-hidden="true" />
        </Button>
        <Button type="submit">Add</Button>
      </div>

      {/* Row 2: due date — collapsible */}
      {showDueDate && (
        <Input
          ref={dueDateRef}
          type="datetime-local"
          onKeyDown={handleKeyDown}
          className="w-full"
          aria-label="Due date and time"
        />
      )}
    </form>
  )
}
