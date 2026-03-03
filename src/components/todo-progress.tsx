'use client'

import type { Todo } from '@/lib/schema'

interface TodoProgressProps {
  todos: Todo[]
}

export function TodoProgress({ todos }: TodoProgressProps) {
  const total = todos.length
  const completedCount = todos.filter((t) => !!t.completed).length
  const pct = total === 0 ? 0 : Math.round((completedCount / total) * 100)

  if (total === 0) return null

  return (
    <div className="mt-4 mb-2">
      <div className="flex justify-between items-center gap-2 mb-2">
        <span className="text-xs text-muted-foreground">Progress</span>
        <span className="text-xs font-medium text-muted-foreground tabular-nums">
          {completedCount} / {total}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        {/* CSS transition used (not Framer Motion) to avoid LazyMotion scope issues in parent */}
        <div
          style={{
            width: `${pct}%`,
            transition: 'width 0.5s ease-out',
            background: 'linear-gradient(to right, var(--color-spectrum-1), var(--color-spectrum-2), var(--color-spectrum-3), var(--color-spectrum-4), var(--color-spectrum-5), var(--color-spectrum-6), var(--color-spectrum-7))',
          }}
          className="h-full rounded-full"
        />
      </div>
    </div>
  )
}
