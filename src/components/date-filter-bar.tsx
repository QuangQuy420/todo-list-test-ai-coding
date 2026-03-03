'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/ui'
import { cn } from '@/lib/utils'
import type { DateFilter } from '@/store/ui'

interface DateFilterBarProps {
  todos?: Array<{ due_date: string | null }>
}

export function DateFilterBar({ todos = [] }: DateFilterBarProps) {
  const { dateFilter, setDateFilter } = useUIStore()
  const today = new Date().toISOString().slice(0, 10)

  // Count todos due today for the badge
  const todayCount = todos.filter((t) => t.due_date?.slice(0, 10) === today).length

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val) {
      setDateFilter(val as DateFilter)
    } else {
      setDateFilter(null)
    }
  }

  // Derive the current date input value (only when a specific date string is active)
  const dateInputValue =
    dateFilter !== null && dateFilter !== 'today' ? dateFilter : ''

  return (
    <div className="flex items-center gap-2 mt-3 flex-wrap">
      {/* All button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setDateFilter(null)}
        aria-pressed={dateFilter === null}
        className={cn(
          'text-xs glass-surface shrink-0',
          dateFilter === null
            ? 'border-[var(--color-accent-violet)] text-[var(--color-accent-violet)]'
            : 'text-muted-foreground'
        )}
      >
        All
      </Button>

      {/* Today button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setDateFilter('today')}
        aria-pressed={dateFilter === 'today'}
        className={cn(
          'text-xs glass-surface shrink-0 gap-1.5',
          dateFilter === 'today'
            ? 'border-[var(--color-accent-violet)] text-[var(--color-accent-violet)]'
            : 'text-muted-foreground'
        )}
      >
        Today
        {todayCount > 0 && (
          <span
            className={cn(
              'inline-flex items-center justify-center rounded-full text-xs font-medium px-1.5 py-0 min-w-[1.25rem] h-4',
              dateFilter === 'today'
                ? 'bg-[var(--color-accent-violet)] text-white'
                : 'bg-[var(--color-spectrum-2)]/20 text-[var(--color-spectrum-2)]'
            )}
            aria-label={`${todayCount} todos due today`}
          >
            {todayCount}
          </span>
        )}
      </Button>

      {/* Date picker */}
      <input
        type="date"
        max={today}
        value={dateInputValue}
        onChange={handleDateChange}
        aria-label="Filter by specific date"
        className="glass-surface rounded-md px-2 py-1 text-sm border border-white/20 text-foreground bg-transparent focus:outline-none focus:border-[var(--color-accent-violet)] focus:ring-1 focus:ring-[var(--color-accent-violet)]/50 shrink-0 cursor-pointer"
      />

      {/* Clear button — shown when a filter is active */}
      {dateFilter !== null && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => setDateFilter(null)}
          aria-label="Clear date filter"
          className="text-muted-foreground hover:text-foreground shrink-0"
        >
          <X size={12} aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}
