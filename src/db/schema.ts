import { sql } from "drizzle-orm"
import { text, timestamp, pgTable, pgEnum } from "drizzle-orm/pg-core"

// Enums
export const taskStatus = pgEnum("task_status", [
  "todo",
  "in-progress",
  "done",
  "canceled",
])

export const taskLabel = pgEnum("task_label", [
  "bug",
  "feature",
  "enhancement",
  "documentation",
])

export const taskPriority = pgEnum("task_priority", ["low", "medium", "high"])

export const userRole = pgEnum("user_role", ["admin", "user", "guest"])
export const userStatus = pgEnum("user_status", ["active", "inactive", "pending"])

// Tables
export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  title: text("title"),
  status: taskStatus("status").notNull(),
  label: taskLabel("label").notNull(),
  priority: taskPriority("priority").notNull(),
  assignee: text("assignee"),
  dueDate: timestamp("due_date").notNull(),
  estimatedHours: text("estimated_hours").notNull(),
  department: text("department"),
  tags: text("tags").array().notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at"),
})

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: userRole("role").notNull().default("user"),
  status: userStatus("status").notNull().default("pending"),
  department: text("department"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at"),
})

// Types
export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
