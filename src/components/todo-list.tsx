'use client'

import { LazyMotion, domAnimation, AnimatePresence, m } from 'framer-motion'
import { ClipboardList } from 'lucide-react'
import { useUIStore } from '@/store/ui'
import { TodoItem } from '@/components/todo-item'
import type { Todo } from '@/lib/schema'

interface TodoListProps {
  initialTodos: Todo[]
}

const EMPTY_STATE_COPY: Record<'all' | 'active' | 'completed', string> = {
  all: 'No todos yet — press N to add one',
  active: 'No active todos',
  completed: 'No completed todos yet',
}

export function TodoList({ initialTodos }: TodoListProps) {
  const { filter, searchQuery, sortOrder } = useUIStore()

  // Step 1: completion filter (unchanged)
  const afterFilter = initialTodos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return !!todo.completed
    return true
  })

  // Step 2: search filter (case-insensitive substring match on title)
  const trimmedQuery = searchQuery.trim().toLowerCase()
  const afterSearch = trimmedQuery
    ? afterFilter.filter((todo) =>
        todo.title.toLowerCase().includes(trimmedQuery)
      )
    : afterFilter

  // Step 3: sort — always spread to avoid mutating the prop
  const filteredTodos = [...afterSearch].sort((a, b) => {
    if (sortOrder === 'created_desc') return 0 // preserve DB order (created_at DESC)

    const aDate = a.due_date ? new Date(a.due_date).getTime() : null
    const bDate = b.due_date ? new Date(b.due_date).getTime() : null

    // Nulls always go to the bottom regardless of sort direction
    if (aDate === null && bDate === null) return 0
    if (aDate === null) return 1
    if (bDate === null) return -1

    return sortOrder === 'due_asc' ? aDate - bDate : bDate - aDate
  })

  const emptyMessage = trimmedQuery
    ? `No todos match "${searchQuery}"`
    : EMPTY_STATE_COPY[filter]

  if (filteredTodos.length === 0) {
    return (
      <LazyMotion features={domAnimation}>
        <m.div
          key={filter + searchQuery}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center gap-3 py-14 text-center"
        >
          <ClipboardList size={48} className="text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        </m.div>
      </LazyMotion>
    )
  }

  return (
    <LazyMotion features={domAnimation}>
      <ul className="mt-4 flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </AnimatePresence>
      </ul>
    </LazyMotion>
  )
}
