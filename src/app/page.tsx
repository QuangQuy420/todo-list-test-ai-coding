import { db } from '@/lib/db'
import { todos } from '@/lib/schema'
import { desc } from 'drizzle-orm'
import { TodoForm } from '@/components/todo-form'
import { TodoList } from '@/components/todo-list'
import { FilterTabs } from '@/components/filter-tabs'
import { TodoProgress } from '@/components/todo-progress'

export default async function Page() {
  const allTodos = await db.select().from(todos).orderBy(desc(todos.created_at))

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-100 via-violet-100 to-cyan-100 dark:from-[oklch(0.16_0.06_25)] dark:via-[oklch(0.13_0.06_270)] dark:to-[oklch(0.14_0.05_195)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 rounded-2xl p-6 shadow-2xl">
          <TodoForm />
          <FilterTabs todos={allTodos} />
          <TodoProgress todos={allTodos} />
          <TodoList initialTodos={allTodos} />
        </div>
      </div>
    </main>
  )
}
