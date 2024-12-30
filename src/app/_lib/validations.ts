import { z } from "zod"

import { taskStatus, taskLabel, taskPriority, userRole, userStatus } from "@/db/schema"

// Common schemas
export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
  viewId: z.string().optional(),
})

export type SearchParams = {
  page: number
  per_page: number
  sort?: string
  search?: string
  role?: string
  status?: string
  operator?: "and" | "or"
  viewId?: string
}

// Task schemas
export const taskSearchParamsSchema = searchParamsSchema.extend({
  title: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})

export type TaskSearchParams = z.infer<typeof taskSearchParamsSchema>

export const createTaskSchema = z.object({
  title: z.string().min(1).max(256),
  status: z.enum(taskStatus.enumValues),
  label: z.enum(taskLabel.enumValues),
  priority: z.enum(taskPriority.enumValues),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(256).optional(),
  status: z.enum(taskStatus.enumValues).optional(),
  label: z.enum(taskLabel.enumValues).optional(),
  priority: z.enum(taskPriority.enumValues).optional(),
})

// User schemas
export const userSearchParamsSchema = searchParamsSchema.extend({
  name: z.string().optional(),
  email: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
})

export type UserSearchParams = z.infer<typeof userSearchParamsSchema>

export const createUserSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.enum(["admin", "user", "manager"], {
    required_error: "Please select a role.",
  }),
  status: z.enum(["active", "inactive"], {
    required_error: "Please select a status.",
  })
})

export type CreateUser = z.infer<typeof createUserSchema>

export const updateUserSchema = createUserSchema.partial().extend({
  lastLoginAt: z.date().optional().nullable()
})

export type UpdateUser = z.infer<typeof updateUserSchema>

// View schemas
export interface FilterParams {
  operator?: "and" | "or"
  sort?: string
  filters?: {
    id: string
    field: string
    value: string[]
    operator: "equals" | "contains" | "startsWith" | "endsWith"
  }[]
}

export const createViewSchema = z.object({
  name: z.string().min(1).max(256),
  columns: z.array(z.string()).optional(),
  filterParams: z
    .object({
      operator: z.enum(["and", "or"]).optional(),
      sort: z.string().optional(),
      filters: z
        .array(
          z.object({
            id: z.string(),
            field: z.string(),
            value: z.array(z.string()),
            operator: z.enum(["equals", "contains", "startsWith", "endsWith"]),
          })
        )
        .optional(),
    })
    .optional(),
})

// Freelancer schemas
export const freelancerSearchParamsSchema = searchParamsSchema.extend({
  name: z.string().optional(),
  location: z.string().optional(),
  services: z.string().optional(),
  experience: z.string().optional(),
  availability: z.string().optional(),
  rating: z.string().optional(),
})

export type FreelancerSearchParams = z.infer<typeof freelancerSearchParamsSchema>
