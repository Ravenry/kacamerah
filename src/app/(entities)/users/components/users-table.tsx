'use client'

import React from "react"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableAdvancedToolbar } from "@/components/data-table/advanced/data-table-advanced-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { type View } from "@/types"
import { type DataTableFilterField } from "@/types"
import { getColumns, type User } from "./users-table-columns"
import { TableInstanceProvider } from "@/components/data-table/table-instance-provider"

interface UsersTableProps {
    usersPromise: Promise<{ data: User[], pageCount: number }>
    viewsPromise: Promise<View[]>
}

export function UsersTable({ usersPromise, viewsPromise }: UsersTableProps) {
    const { data: users, pageCount } = React.use(usersPromise)
    const views = React.use(viewsPromise)

    const filterFields: DataTableFilterField<User>[] = [
        {
            label: "Name",
            value: "name",
            placeholder: "Filter names...",
        },
        {
            label: "Role",
            value: "role",
            options: ["admin", "user", "guest"].map((role) => ({
                label: role[0]?.toUpperCase() + role.slice(1),
                value: role,
                withCount: true,
            })),
        },
        {
            label: "Status",
            value: "status",
            options: ["active", "inactive", "pending"].map((status) => ({
                label: status[0]?.toUpperCase() + status.slice(1),
                value: status,
                withCount: true,
            })),
        },
        {
            label: "Department",
            value: "department",
            options: Array.from(
                new Set(users.filter(user => user.department).map(user => user.department))
            ).map((department) => ({
                label: department!,
                value: department!,
                withCount: true,
            })),
        },
    ]

    const { table } = useDataTable({
        data: users,
        columns: getColumns(),
        pageCount,
        filterFields,
        defaultPerPage: 10,
        defaultSort: "updatedAt.desc",
    })

    return (
        <TableInstanceProvider table={table}>
            <DataTable table={table}>
                <DataTableAdvancedToolbar filterFields={filterFields} views={views} />
            </DataTable>
        </TableInstanceProvider>
    )
} 