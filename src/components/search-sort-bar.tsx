'use client'

import { useRef } from 'react'
import { Search, X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/ui'
import { cn } from '@/lib/utils'
import type { SortOrder } from '@/store/ui'

const SORT_CYCLE: SortOrder[] = ['created_desc', 'due_asc', 'due_desc']
const SORT_LABELS: Record<SortOrder, string> = {
  created_desc: 'Created',
  due_asc: 'Due ↑',
  due_desc: 'Due ↓',
}
const SORT_ICONS: Record<SortOrder, React.ReactNode> = {
  created_desc: <ArrowUpDown size={14} />,
  due_asc: <ArrowUp size={14} />,
  due_desc: <ArrowDown size={14} />,
}

export function SearchSortBar() {
  const { searchQuery, setSearchQuery, sortOrder, setSortOrder } = useUIStore()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleCycleSortOrder = () => {
    const next = SORT_CYCLE[(SORT_CYCLE.indexOf(sortOrder) + 1) % SORT_CYCLE.length]
    setSortOrder(next)
  }

  return (
    <div className="flex gap-3 items-center mt-4 mb-1">
      <div className="relative flex-1">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search todos…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 pr-8 glass-surface"
          aria-label="Search todos"
          autoComplete="off"
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => {
              setSearchQuery('')
              inputRef.current?.focus()
            }}
            aria-label="Clear search"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={12} aria-hidden="true" />
          </Button>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCycleSortOrder}
        aria-label={`Sort order: ${SORT_LABELS[sortOrder]}. Click to cycle.`}
        className={cn(
          'shrink-0 gap-1.5 text-xs glass-surface',
          sortOrder !== 'created_desc' &&
            'text-[var(--color-spectrum-7)] border-[var(--color-spectrum-7)]/40'
        )}
      >
        {SORT_ICONS[sortOrder]}
        {SORT_LABELS[sortOrder]}
      </Button>
    </div>
  )
}
