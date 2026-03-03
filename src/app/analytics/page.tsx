import { db } from '@/lib/db'
import { todos } from '@/lib/schema'
import { desc } from 'drizzle-orm'
import { computeAnalytics } from '@/lib/analytics'
import { OverviewCards } from '@/components/analytics/overview-cards'
import { InsightsCards } from '@/components/analytics/insights-cards'
import { StreakTracker } from '@/components/analytics/streak-tracker'
import { DailyActivityChart } from '@/components/analytics/daily-activity-chart'

export const metadata = {
  title: 'Analytics — Todos',
  description: 'Analytics and insights for your todos',
}

export default async function AnalyticsPage() {
  const allTodos = await db.select().from(todos).orderBy(desc(todos.created_at))
  const analytics = computeAnalytics(allTodos)

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-violet-100 to-cyan-100 dark:from-[oklch(0.16_0.06_25)] dark:via-[oklch(0.13_0.06_270)] dark:to-[oklch(0.14_0.05_195)] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page header */}
        <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 rounded-2xl px-6 py-4 shadow-2xl">
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Insights and trends for your todo activity
          </p>
        </div>

        {/* Overview cards */}
        <section aria-label="Overview statistics">
          <OverviewCards analytics={analytics} />
        </section>

        {/* Daily activity chart */}
        <section aria-label="Daily activity chart">
          <DailyActivityChart data={analytics.last30DaysActivity} />
        </section>

        {/* Insights */}
        <section aria-label="Insights">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Insights
          </h2>
          <InsightsCards analytics={analytics} />
        </section>

        {/* Streak tracker */}
        <section aria-label="Streak tracker">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Streaks
          </h2>
          <StreakTracker analytics={analytics} />
        </section>
      </div>
    </div>
  )
}
