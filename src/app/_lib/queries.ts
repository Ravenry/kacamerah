import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { tasks, views, type Task } from "@/db/schema"
import type { DrizzleWhere } from "@/types"
import { and, asc, count, desc, gte, lte, or, sql, type SQL } from "drizzle-orm"

import { filterColumn } from "@/lib/filter-column"

import { type GetTasksSchema } from "./validations"

export async function getTasks(input: GetTasksSchema) {
  noStore()
  const { page, per_page } = input

  try {
    // Generate random mock data
    const generateRandomTask = (): Task => ({
      id: crypto.randomUUID(),
      code: `TASK-${Math.floor(Math.random() * 1000)}`,
      title: `Random Task ${Math.floor(Math.random() * 100)}`,
      status: ['todo', 'in-progress', 'done', 'canceled'][Math.floor(Math.random() * 4)] as Task['status'],
      label: ['bug', 'feature', 'enhancement', 'documentation'][Math.floor(Math.random() * 4)] as Task['label'],
      priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as Task['priority'],
      assignee: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown'][Math.floor(Math.random() * 4)],
      dueDate: new Date(Date.now() + Math.floor(Math.random() * 7776000000)),
      estimatedHours: `${Math.floor(Math.random() * 40 + 1)}h`,
      department: ['Engineering', 'Design', 'Marketing', 'Sales'][Math.floor(Math.random() * 4)],
      tags: Array.from(
        { length: Math.floor(Math.random() * 3 + 1) },
        () => ['urgent', 'blocked', 'review', 'frontend', 'backend'][Math.floor(Math.random() * 5)]
      ),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
      updatedAt: new Date()
    })

    // Generate array of random tasks
    const mockTasks = Array.from({ length: 100 }, generateRandomTask)
    
    // Apply pagination
    const offset = (page - 1) * per_page
    const paginatedData = mockTasks.slice(offset, offset + per_page)
    const pageCount = Math.ceil(mockTasks.length / per_page)

    return { 
      data: paginatedData, 
      pageCount 
    }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}

export async function getTaskCountByStatus() {
  noStore()
  try {
    return await db
      .select({
        status: tasks.status,
        count: count(),
      })
      .from(tasks)
      .groupBy(tasks.status)
      .execute()
  } catch (err) {
    return []
  }
}

export async function getTaskCountByPriority() {
  noStore()
  try {
    return await db
      .select({
        priority: tasks.priority,
        count: count(),
      })
      .from(tasks)
      .groupBy(tasks.priority)
      .execute()
  } catch (err) {
    return []
  }
}

export async function getViews() {
  noStore()
  
  // Mock views data
  const mockViews: any[] = [
    {
      id: crypto.randomUUID(),
      name: "All Tasks",
      columns: ["code", "title", "status", "priority", "createdAt"],
      filterParams: {
        status: [],
        priority: [],
        operator: "and"
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: crypto.randomUUID(),
      name: "High Priority",
      columns: ["code", "title", "status", "label"],
      filterParams: {
        priority: ["high"],
        operator: "and"
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: crypto.randomUUID(),
      name: "Bugs",
      columns: ["code", "title", "priority", "status"],
      filterParams: {
        label: ["bug"],
        operator: "and"
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  return mockViews
}
