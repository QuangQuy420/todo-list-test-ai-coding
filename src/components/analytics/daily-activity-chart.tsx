'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { DayActivity } from '@/lib/analytics'

interface DailyActivityChartProps {
  data: DayActivity[]
}

const chartConfig = {
  created: {
    label: 'Created',
    color: 'var(--color-spectrum-7)',
  },
  completed: {
    label: 'Completed',
    color: 'var(--color-spectrum-4)',
  },
} satisfies ChartConfig

function formatXAxisDate(dateStr: string): string {
  // dateStr is "YYYY-MM-DD", parse as local date to avoid timezone shift
  const [, month, day] = dateStr.split('-').map(Number)
  const date = new Date(2000, month - 1, day)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function DailyActivityChart({ data }: DailyActivityChartProps) {
  // Show only last 14 days
  const chartData = data.slice(-14).map((item) => ({
    ...item,
    label: formatXAxisDate(item.date),
  }))

  return (
    <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 rounded-2xl p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
        Daily Activity (Last 14 Days)
      </h2>
      <ChartContainer config={chartConfig} className="h-48 w-full">
        <BarChart
          data={chartData}
          margin={{ top: 4, right: 8, bottom: 4, left: -16 }}
          barCategoryGap="30%"
          barGap={2}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.15} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            interval={1}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            width={28}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="created"
            fill="var(--color-created)"
            radius={[3, 3, 0, 0]}
            maxBarSize={20}
          />
          <Bar
            dataKey="completed"
            fill="var(--color-completed)"
            radius={[3, 3, 0, 0]}
            maxBarSize={20}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
