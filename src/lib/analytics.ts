import type { Todo } from '@/lib/schema'

export interface DayActivity {
  date: string  // ISO date string "YYYY-MM-DD"
  created: number
  completed: number
}

export interface AnalyticsResult {
  totalTodos: number
  completedTodos: number
  activeTodos: number
  completionRate: number        // 0–100
  overdueTodos: number          // due_date < today and not completed
  dueTodayTodos: number         // due_date is today and not completed
  todosWithDueDate: number
  avgCompletionDays: number | null  // avg days from created_at to updated_at when completed
  mostProductiveDay: string | null  // day of week with most completions
  oldestActiveTodo: { id: number; title: string; created_at: string } | null
  currentStreak: number         // consecutive days (ending today or yesterday) with >= 1 completion
  longestStreak: number
  last30DaysActivity: DayActivity[]
}

/** Return "YYYY-MM-DD" for a given Date in local time */
function toDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Generate the last N calendar date strings (oldest → newest) ending today */
function lastNDates(n: number): string[] {
  const today = new Date()
  const result: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    result.push(toDateStr(d))
  }
  return result
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function computeAnalytics(todos: Todo[]): AnalyticsResult {
  const now = new Date()
  const todayStr = toDateStr(now)

  // ── Counts ──────────────────────────────────────────────────────────────────
  const totalTodos = todos.length
  const completedTodos = todos.filter((t) => !!t.completed).length
  const activeTodos = totalTodos - completedTodos
  const completionRate = totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100)

  // ── Due date stats (active only) ────────────────────────────────────────────
  let overdueTodos = 0
  let dueTodayTodos = 0
  let todosWithDueDate = 0

  for (const todo of todos) {
    if (!todo.due_date) continue
    todosWithDueDate++
    if (!!todo.completed) continue  // skip completed for overdue/today counts

    const due = new Date(todo.due_date)
    if (due < now) {
      overdueTodos++
    } else {
      const dueDayStr = toDateStr(due)
      if (dueDayStr === todayStr) {
        dueTodayTodos++
      }
    }
  }

  // ── Avg completion days ──────────────────────────────────────────────────────
  const completedWithDates = todos.filter(
    (t) => !!t.completed && t.created_at && t.updated_at
  )
  let avgCompletionDays: number | null = null
  if (completedWithDates.length > 0) {
    const totalDays = completedWithDates.reduce((sum, t) => {
      const created = new Date(t.created_at!).getTime()
      const updated = new Date(t.updated_at!).getTime()
      const diffDays = Math.max(0, (updated - created) / (1000 * 60 * 60 * 24))
      return sum + diffDays
    }, 0)
    avgCompletionDays = Math.round((totalDays / completedWithDates.length) * 10) / 10
  }

  // ── Most productive day of week ──────────────────────────────────────────────
  const dayCount = [0, 0, 0, 0, 0, 0, 0]  // index = day of week 0=Sun
  for (const todo of todos) {
    if (!todo.completed || !todo.updated_at) continue
    const d = new Date(todo.updated_at)
    dayCount[d.getDay()]++
  }
  const maxCount = Math.max(...dayCount)
  let mostProductiveDay: string | null = null
  if (maxCount > 0) {
    mostProductiveDay = DAY_NAMES[dayCount.indexOf(maxCount)]
  }

  // ── Oldest active todo ───────────────────────────────────────────────────────
  const activeTodosList = todos
    .filter((t) => !t.completed && t.created_at)
    .sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime())
  const oldestActiveTodo =
    activeTodosList.length > 0
      ? { id: activeTodosList[0].id, title: activeTodosList[0].title, created_at: activeTodosList[0].created_at! }
      : null

  // ── Streaks ──────────────────────────────────────────────────────────────────
  // Build a Set of dates (YYYY-MM-DD) that have at least one completion
  const completionDates = new Set<string>()
  for (const todo of todos) {
    if (!todo.completed || !todo.updated_at) continue
    completionDates.add(toDateStr(new Date(todo.updated_at)))
  }

  // Current streak: count consecutive days backwards from today (or yesterday)
  let currentStreak = 0
  {
    const startDay = completionDates.has(todayStr) ? 0 : 1
    for (let i = startDay; ; i++) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      const ds = toDateStr(d)
      if (completionDates.has(ds)) {
        currentStreak++
      } else {
        break
      }
    }
  }

  // Longest streak: sort unique dates, then walk through them
  let longestStreak = 0
  if (completionDates.size > 0) {
    const sortedDates = Array.from(completionDates).sort()
    let streak = 1
    longestStreak = 1
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1])
      const curr = new Date(sortedDates[i])
      const diffMs = curr.getTime() - prev.getTime()
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        streak++
        longestStreak = Math.max(longestStreak, streak)
      } else {
        streak = 1
      }
    }
  }

  // ── Last 30 days activity ────────────────────────────────────────────────────
  const dates30 = lastNDates(30)
  // created counts
  const createdByDate = new Map<string, number>()
  for (const todo of todos) {
    if (!todo.created_at) continue
    const ds = toDateStr(new Date(todo.created_at))
    createdByDate.set(ds, (createdByDate.get(ds) ?? 0) + 1)
  }
  // completed counts (keyed by updated_at date)
  const completedByDate = new Map<string, number>()
  for (const todo of todos) {
    if (!todo.completed || !todo.updated_at) continue
    const ds = toDateStr(new Date(todo.updated_at))
    completedByDate.set(ds, (completedByDate.get(ds) ?? 0) + 1)
  }

  const last30DaysActivity: DayActivity[] = dates30.map((date) => ({
    date,
    created: createdByDate.get(date) ?? 0,
    completed: completedByDate.get(date) ?? 0,
  }))

  return {
    totalTodos,
    completedTodos,
    activeTodos,
    completionRate,
    overdueTodos,
    dueTodayTodos,
    todosWithDueDate,
    avgCompletionDays,
    mostProductiveDay,
    oldestActiveTodo,
    currentStreak,
    longestStreak,
    last30DaysActivity,
  }
}
