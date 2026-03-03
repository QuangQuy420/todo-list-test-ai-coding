'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUIStore } from '@/store/ui'
import type { Todo } from '@/lib/schema'

type Filter = 'all' | 'active' | 'completed'

interface FilterTabsProps {
  todos: Todo[]
}

export function FilterTabs({ todos }: FilterTabsProps) {
  const { filter, setFilter } = useUIStore()

  const allCount = todos.length
  const activeCount = todos.filter((t) => !t.completed).length
  const completedCount = todos.filter((t) => !!t.completed).length

  return (
    <Tabs
      value={filter}
      onValueChange={(value) => setFilter(value as Filter)}
      className="mt-4 mb-2"
    >
      <TabsList className="w-full">
        <TabsTrigger
          value="all"
          className="flex-1 px-4 data-[state=active]:bg-[var(--color-spectrum-6)] data-[state=active]:text-white"
        >
          All
          <span className="ml-2 rounded-full bg-[var(--color-spectrum-6)]/20 px-1.5 py-0.5 text-xs font-medium tabular-nums">
            {allCount}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="active"
          className="flex-1 px-4 data-[state=active]:bg-[var(--color-spectrum-2)] data-[state=active]:text-white"
        >
          Active
          <span className="ml-2 rounded-full bg-[var(--color-spectrum-2)]/20 px-1.5 py-0.5 text-xs font-medium tabular-nums">
            {activeCount}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="completed"
          className="flex-1 px-4 data-[state=active]:bg-[var(--color-spectrum-4)] data-[state=active]:text-white"
        >
          Completed
          <span className="ml-2 rounded-full bg-[var(--color-spectrum-4)]/20 px-1.5 py-0.5 text-xs font-medium tabular-nums">
            {completedCount}
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
