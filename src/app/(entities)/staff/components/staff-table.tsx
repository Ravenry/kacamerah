'use client'

import * as React from "react"
import { type Staff, getColumns } from "./staff-table-columns"
import { type View } from "@/types"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableAdvancedToolbar } from "@/components/data-table/advanced/data-table-advanced-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { type ApiResponse } from "@/app/_lib/api"
import { TableInstanceProvider } from "@/components/data-table/table-instance-provider"
import { type DataTableFilterField } from "@/types"

interface StaffTableProps {
    staffPromise: Promise<ApiResponse<Staff>>
}

export function StaffTable({ staffPromise }: StaffTableProps) {
    const { data: staff, pageCount, total } = React.use(staffPromise)

    const filterFields: DataTableFilterField<Staff>[] = [
        {
            label: "Name",
            value: "name",
            placeholder: "Filter by name...",
        },
        {
            label: "Email",
            value: "email",
            placeholder: "Filter by email...",
        },
        {
            label: "Role",
            value: "role",
            options: [
                { label: "Account Manager", value: "Account Manager", withCount: true },
                { label: "Project Coordinator", value: "Project Coordinator", withCount: true },
                { label: "Admin", value: "Admin", withCount: true },
            ],
        },
        {
            label: "Status",
            value: "is_active",
            options: [
                { label: "Active", value: "true", withCount: true },
                { label: "Inactive", value: "false", withCount: true },
            ],
        },
    ]

    const { table } = useDataTable({
        data: staff,
        columns: getColumns(),
        pageCount,
        filterFields,
        defaultPerPage: 10,
        defaultSort: "updatedAt.desc",
    })

    return (
        <TableInstanceProvider table={table}>
            <DataTable
                table={table}
            />
        </TableInstanceProvider>
    )
} 