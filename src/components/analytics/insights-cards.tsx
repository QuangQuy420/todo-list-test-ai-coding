import { Calendar, Clock, Hourglass } from 'lucide-react'
import type { AnalyticsResult } from '@/lib/analytics'

interface InsightsCardsProps {
  analytics: AnalyticsResult
}

function formatRelativeDate(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) === 1 ? '' : 's'} ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) === 1 ? '' : 's'} ago`
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) === 1 ? '' : 's'} ago`
}

export function InsightsCards({ analytics }: InsightsCardsProps) {
  const { mostProductiveDay, avgCompletionDays, oldestActiveTodo } = analytics

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Most Productive Day */}
      <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[var(--color-spectrum-7)]/10 text-[var(--color-spectrum-7)]">
            <Calendar size={16} aria-hidden="true" />
          </span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Most Productive Day
          </span>
        </div>
        {mostProductiveDay ? (
          <div>
            <span className="text-2xl font-bold text-[var(--color-spectrum-7)]">
              {mostProductiveDay}
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">Most completions on this day</p>
          </div>
        ) : (
          <span className="text-2xl font-bold text-muted-foreground">—</span>
        )}
      </div>

      {/* Avg Completion Time */}
      <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[var(--color-spectrum-5)]/10 text-[var(--color-spectrum-5)]">
            <Clock size={16} aria-hidden="true" />
          </span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Avg Completion Time
          </span>
        </div>
        {avgCompletionDays !== null ? (
          <div>
            <span className="text-2xl font-bold text-[var(--color-spectrum-5)]">
              {avgCompletionDays}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {avgCompletionDays === 1 ? 'day' : 'days'}
              </span>
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">From creation to completion</p>
          </div>
        ) : (
          <div>
            <span className="text-2xl font-bold text-muted-foreground">—</span>
            <p className="text-xs text-muted-foreground mt-0.5">No completed todos yet</p>
          </div>
        )}
      </div>

      {/* Oldest Active Todo */}
      <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[var(--color-spectrum-1)]/10 text-[var(--color-spectrum-1)]">
            <Hourglass size={16} aria-hidden="true" />
          </span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Oldest Active Todo
          </span>
        </div>
        {oldestActiveTodo ? (
          <div>
            <p
              className="text-sm font-semibold text-foreground truncate"
              title={oldestActiveTodo.title}
            >
              {oldestActiveTodo.title}
            </p>
            <p className="text-xs text-[var(--color-spectrum-1)] mt-0.5">
              Created {formatRelativeDate(oldestActiveTodo.created_at)}
            </p>
          </div>
        ) : (
          <div>
            <span className="text-2xl font-bold text-muted-foreground">—</span>
            <p className="text-xs text-muted-foreground mt-0.5">No active todos</p>
          </div>
        )}
      </div>
    </div>
  )
}
