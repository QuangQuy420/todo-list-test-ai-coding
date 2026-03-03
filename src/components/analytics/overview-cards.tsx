import type { ReactNode } from 'react'
import { CheckCircle2, Circle, ListTodo, Percent, AlertCircle } from 'lucide-react'
import type { AnalyticsResult } from '@/lib/analytics'

interface OverviewCardsProps {
  analytics: AnalyticsResult
}

interface CardDef {
  label: string
  value: string | number
  icon: ReactNode
  colorClass: string
  bgClass: string
}

export function OverviewCards({ analytics }: OverviewCardsProps) {
  const { totalTodos, completedTodos, activeTodos, completionRate, overdueTodos } = analytics

  const cards: CardDef[] = [
    {
      label: 'Total',
      value: totalTodos,
      icon: <ListTodo size={20} aria-hidden="true" />,
      colorClass: 'text-[var(--color-spectrum-7)]',
      bgClass: 'bg-[var(--color-spectrum-7)]/10',
    },
    {
      label: 'Completed',
      value: completedTodos,
      icon: <CheckCircle2 size={20} aria-hidden="true" />,
      colorClass: 'text-[var(--color-spectrum-4)]',
      bgClass: 'bg-[var(--color-spectrum-4)]/10',
    },
    {
      label: 'Active',
      value: activeTodos,
      icon: <Circle size={20} aria-hidden="true" />,
      colorClass: 'text-[var(--color-spectrum-5)]',
      bgClass: 'bg-[var(--color-spectrum-5)]/10',
    },
    {
      label: 'Completion',
      value: `${completionRate}%`,
      icon: <Percent size={20} aria-hidden="true" />,
      colorClass: 'text-[var(--color-spectrum-2)]',
      bgClass: 'bg-[var(--color-spectrum-2)]/10',
    },
    {
      label: 'Overdue',
      value: overdueTodos,
      icon: <AlertCircle size={20} aria-hidden="true" />,
      colorClass: overdueTodos > 0 ? 'text-red-500' : 'text-muted-foreground',
      bgClass: overdueTodos > 0 ? 'bg-red-500/10' : 'bg-muted/30',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 rounded-2xl p-4 flex flex-col gap-2 shadow-sm"
        >
          <div className={`flex items-center justify-between`}>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {card.label}
            </span>
            <span className={`p-1.5 rounded-lg ${card.bgClass} ${card.colorClass}`}>
              {card.icon}
            </span>
          </div>
          <span className={`text-3xl font-bold tabular-nums leading-none ${card.colorClass}`}>
            {card.value}
          </span>
        </div>
      ))}
    </div>
  )
}
