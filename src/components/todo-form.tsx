'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DateTimePicker } from '@/components/date-time-picker'
import { createTodo } from '@/actions/todos'

export function TodoForm() {
  const titleRef = useRef<HTMLInputElement>(null)
  const [dueDate, setDueDate] = useState<string | null>(null)

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
    setDueDate(null)
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

    await createTodo(title, dueDate ?? undefined)

    // Clear form after submission
    if (titleRef.current) titleRef.current.value = ''
    setDueDate(null)
    titleRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Row 1: title + submit */}
      <div className="flex gap-2 items-center">
        <Input
          ref={titleRef}
          type="text"
          placeholder="Add a new todo… (press 'n' to focus)"
          onKeyDown={handleKeyDown}
          className="flex-1"
          autoComplete="off"
        />
        <Button type="submit">Add</Button>
      </div>

      {/* Row 2: due date picker (always visible, optional) */}
      <DateTimePicker
        value={dueDate}
        onChange={setDueDate}
        placeholder="Add due date (optional)"
      />
    </form>
  )
}
