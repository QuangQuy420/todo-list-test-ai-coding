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
  const { filter } = useUIStore()

  const filteredTodos = initialTodos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return !!todo.completed
    return true
  })

  if (filteredTodos.length === 0) {
    return (
      <LazyMotion features={domAnimation}>
        <m.div
          key={filter}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center gap-3 py-14 text-center"
        >
          <ClipboardList size={48} className="text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            {EMPTY_STATE_COPY[filter]}
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
