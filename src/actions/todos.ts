"use server";

import { db } from "@/lib/db";
import { todos } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function validateTitle(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) {
    throw new Error("Title cannot be empty");
  }
  if (trimmed.length > 500) {
    throw new Error("Title must be 500 characters or fewer");
  }
  return trimmed;
}

function nowISO(): string {
  return new Date().toISOString();
}

export async function createTodo(title: string, dueDate?: string) {
  const validTitle = validateTitle(title);
  const now = nowISO();

  await db.insert(todos).values({
    title: validTitle,
    completed: 0,
    due_date: dueDate || null,
    created_at: now,
    updated_at: now,
  });

  revalidatePath("/");
}

export async function toggleTodo(id: number) {
  const todo = await db.query.todos.findFirst({
    where: eq(todos.id, id),
  });

  if (!todo) {
    throw new Error(`Todo with id ${id} not found`);
  }

  await db
    .update(todos)
    .set({
      completed: todo.completed ? 0 : 1,
      updated_at: nowISO(),
    })
    .where(eq(todos.id, id));

  revalidatePath("/");
}

export async function updateTodo(id: number, title: string, dueDate?: string) {
  const validTitle = validateTitle(title);

  await db
    .update(todos)
    .set({
      title: validTitle,
      due_date: dueDate || null,
      updated_at: nowISO(),
    })
    .where(eq(todos.id, id));

  revalidatePath("/");
}

export async function deleteTodo(id: number) {
  await db.delete(todos).where(eq(todos.id, id));
  revalidatePath("/");
}
