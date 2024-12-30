import { type ColumnDef } from "@tanstack/react-table"

// Define the Task type based on API response
export interface Task {
    id: string
    code: string
    title: string | null
    status: "todo" | "in-progress" | "done" | "canceled"
    label: "bug" | "feature" | "enhancement" | "documentation"
    priority: "low" | "medium" | "high"
    assignee: string | null
    dueDate: Date
    estimatedHours: string
    department: string | null
    tags: string[]
    createdAt: Date
    updatedAt: Date | null
}

export function getColumns(): ColumnDef<Task>[] {
    return [
        {
            id: "code",
            header: "Code",
            accessorKey: "code",
        },
        {
            id: "title",
            header: "Title",
            accessorKey: "title",
        },
        {
            id: "status",
            header: "Status",
            accessorKey: "status",
        },
        {
            id: "priority",
            header: "Priority",
            accessorKey: "priority",
        },
        {
            id: "assignee",
            header: "Assignee",
            accessorKey: "assignee",
        },
        {
            id: "dueDate",
            header: "Due Date",
            accessorKey: "dueDate",
            cell: ({ row }) => {
                const date = row.getValue("dueDate") as Date
                return date ? new Date(date).toLocaleDateString() : "No date"
            }
        },
        {
            id: "estimatedHours",
            header: "Est. Hours",
            accessorKey: "estimatedHours",
        },
        {
            id: "department",
            header: "Department",
            accessorKey: "department",
        },
        {
            id: "tags",
            header: "Tags",
            accessorKey: "tags",
            cell: ({ row }) => {
                const tags = row.getValue("tags") as string[]
                return tags.join(", ")
            }
        },
        {
            id: "createdAt",
            header: "Created At",
            accessorKey: "createdAt",
            cell: ({ row }) => {
                const date = row.getValue("createdAt") as Date
                return new Date(date).toLocaleDateString()
            }
        }
    ]
} 