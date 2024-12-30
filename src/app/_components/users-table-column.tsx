// src/app/_components/users-table-columns.tsx
import { type User } from "@/db/schema"
import { type ColumnDef } from "@tanstack/react-table"

export function getColumns(): ColumnDef<User>[] {
    return [
        {
            id: "name",
            header: "Name",
            accessorKey: "name",
        },
        {
            id: "email",
            header: "Email",
            accessorKey: "email",
        },
        {
            id: "role",
            header: "Role",
            accessorKey: "role",
        },
        {
            id: "status",
            header: "Status",
            accessorKey: "status",
        },
        {
            id: "department",
            header: "Department",
            accessorKey: "department",
        },
        {
            id: "lastLoginAt",
            header: "Last Login",
            accessorKey: "lastLoginAt",
            cell: ({ row }) => {
                const date = row.getValue("lastLoginAt") as Date | null
                return date ? new Date(date).toLocaleDateString() : "Never"
            }
        }
    ]
}