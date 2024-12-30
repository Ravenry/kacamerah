import { type Task, type User } from "@/db/schema"

// Mock data store
export const mockTasks: Task[] = Array.from({ length: 100 }, () => ({
  id: crypto.randomUUID(),
  code: `TASK-${Math.floor(Math.random() * 1000)}`,
  title: `Random Task ${Math.floor(Math.random() * 100)}`,
  status: ['todo', 'in-progress', 'done', 'canceled'][Math.floor(Math.random() * 4)] as Task['status'],
  label: ['bug', 'feature', 'enhancement', 'documentation'][Math.floor(Math.random() * 4)] as Task['label'],
  priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as Task['priority'],
  assignee: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown'][Math.floor(Math.random() * 4)] || null,
  dueDate: new Date(Date.now() + Math.floor(Math.random() * 7776000000)),
  estimatedHours: `${Math.floor(Math.random() * 40 + 1)}h`,
  department: ['Engineering', 'Design', 'Marketing', 'Sales'][Math.floor(Math.random() * 4)] || null,
  tags: Array.from(
    { length: Math.floor(Math.random() * 3 + 1) },
    () => ['urgent', 'blocked', 'review', 'frontend', 'backend'][Math.floor(Math.random() * 5)]!
  ),
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
  updatedAt: new Date()
}))

const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'] as const
export const mockUsers: User[] = Array.from({ length: 50 }, () => {
  const randomIndex = Math.floor(Math.random() * names.length)
  const name = names[randomIndex]
  if (!name) throw new Error('Invalid name index')
  
  return {
    id: crypto.randomUUID(),
    email: `${name.toLowerCase().replace(' ', '.')}${Math.floor(Math.random() * 1000)}@example.com`,
    name,
    role: ['admin', 'user', 'guest'][Math.floor(Math.random() * 3)] as User['role'],
    status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)] as User['status'],
    department: ['Engineering', 'Design', 'Marketing', 'Sales'][Math.floor(Math.random() * 4)] || null,
    lastLoginAt: Math.random() > 0.2 ? new Date(Date.now() - Math.floor(Math.random() * 10000000000)) : null,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
    updatedAt: new Date()
  }
})

export const mockViews = [
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

export const mockUserViews = [
  {
    id: crypto.randomUUID(),
    name: "All Users",
    columns: ["name", "email", "role", "status", "department"],
    filterParams: {
      status: [],
      role: [],
      operator: "and"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: crypto.randomUUID(),
    name: "Active Admins",
    columns: ["name", "email", "department", "lastLoginAt"],
    filterParams: {
      role: ["admin"],
      status: ["active"],
      operator: "and"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
] 