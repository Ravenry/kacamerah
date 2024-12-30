import { type ColumnDef } from "@tanstack/react-table"

// Define the User type based on API response
export interface User {
    id: string
    email: string
    name: string
    role: "admin" | "user" | "guest"
    status: "active" | "inactive" | "pending"
    department: string | null
    lastLoginAt: Date | null
    createdAt: Date
    updatedAt: Date | null
}

export function getColumns(): ColumnDef<User>[] {
    return [
        {
            id: "name",
            header: "Name",
            accessorKey: "name",
            size: 250,
        },
        {
            id: "email",
            header: "Email",
            accessorKey: "email",
            size: 250,
        },
        {
            id: "role",
            header: "Role",
            accessorKey: "role",
            size: 250,
        },
        {
            id: "status",
            header: "Status",
            accessorKey: "status",
            size: 250,
        },
        // {
        //     id: "department",
        //     header: "Department",
        //     accessorKey: "department",
        // },
        // {
        //     id: "lastLoginAt",
        //     header: "Last Login",
        //     accessorKey: "lastLoginAt",
        //     cell: ({ row }) => {
        //         const date = row.getValue("lastLoginAt") as Date | null
        //         return date ? new Date(date).toLocaleDateString() : "Never"
        //     }
        // }
    ]
} 