// src/app/_components/users-table.tsx
import { type User } from "@/db/schema"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableAdvancedToolbar } from "@/components/data-table/advanced/data-table-advanced-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { getColumns } from "./users-table-columns"
import { ViewItem } from "@/components/data-table/advanced/views/data-table-views-dropdown"
import React from "react"

interface UsersTableProps {
    data: User[]
    pageCount: number
    views: ViewItem[]
}

export function UsersTable({ data, pageCount, views }: UsersTableProps) {
    const columns = React.useMemo(() => getColumns(), [])

    const filterFields = [
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
    ]

    const { table } = useDataTable({
        data,
        columns,
        pageCount,
        filterFields,
        defaultPerPage: 10,
    })

    return (
        <DataTable
            table={table}
            floatingBar={null}
        >
            <DataTableAdvancedToolbar
                filterFields={filterFields}
                views={views}
                defaultViewName="All Users"
            />
        </DataTable>
    )
}