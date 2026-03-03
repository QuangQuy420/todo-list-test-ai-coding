import { Flame, Trophy } from 'lucide-react'
import type { AnalyticsResult } from '@/lib/analytics'
import { cn } from '@/lib/utils'

interface StreakTrackerProps {
  analytics: AnalyticsResult
}

function getHeatmapColor(count: number): string {
  if (count === 0) return 'bg-muted/30 dark:bg-white/5'
  if (count <= 2) return 'bg-[var(--color-spectrum-5)]/30'
  if (count <= 5) return 'bg-[var(--color-spectrum-5)]/60'
  return 'bg-[var(--color-spectrum-5)]'
}

function formatHeatmapDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function StreakTracker({ analytics }: StreakTrackerProps) {
  const { currentStreak, longestStreak, last30DaysActivity } = analytics

  return (
    <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 rounded-2xl p-5 flex flex-col gap-4">
      {/* Header row: current streak + longest streak badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'p-2 rounded-xl',
              currentStreak > 0
                ? 'bg-orange-500/15 text-orange-500'
                : 'bg-muted/30 text-muted-foreground'
            )}
          >
            <Flame size={22} aria-hidden="true" />
          </span>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span
                className={cn(
                  'text-4xl font-bold tabular-nums leading-none',
                  currentStreak > 0 ? 'text-orange-500' : 'text-muted-foreground'
                )}
              >
                {currentStreak}
              </span>
              <span className="text-sm text-muted-foreground">
                {currentStreak === 1 ? 'day streak' : 'days streak'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Current completion streak</p>
          </div>
        </div>

        {/* Longest streak badge */}
        <div className="flex items-center gap-1.5 bg-[var(--color-spectrum-3)]/15 text-[var(--color-spectrum-3)] px-3 py-1.5 rounded-full">
          <Trophy size={14} aria-hidden="true" />
          <span className="text-sm font-semibold tabular-nums">{longestStreak}</span>
          <span className="text-xs">best</span>
        </div>
      </div>

      {/* 30-day heatmap */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
          30-Day Activity
        </p>
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: 'repeat(30, minmax(0, 1fr))' }}
          role="img"
          aria-label="30-day completion activity heatmap"
        >
          {last30DaysActivity.map((day) => {
            return (
              <div
                key={day.date}
                title={`${formatHeatmapDate(day.date)}: ${day.completed} completed, ${day.created} created`}
                className={cn(
                  'aspect-square rounded-sm transition-colors',
                  getHeatmapColor(day.completed)
                )}
                aria-hidden="true"
              />
            )
          })}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-2 justify-end">
          <span className="text-xs text-muted-foreground">Less</span>
          <div className="w-3 h-3 rounded-sm bg-muted/30 dark:bg-white/5" />
          <div className="w-3 h-3 rounded-sm bg-[var(--color-spectrum-5)]/30" />
          <div className="w-3 h-3 rounded-sm bg-[var(--color-spectrum-5)]/60" />
          <div className="w-3 h-3 rounded-sm bg-[var(--color-spectrum-5)]" />
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </div>
    </div>
  )
}
