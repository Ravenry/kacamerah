'use client'

import * as React from "react"
import { type Client, getColumns } from "./clients-table-columns"
import { type View } from "@/types"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableAdvancedToolbar } from "@/components/data-table/advanced/data-table-advanced-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { type GetClientsResponse } from "@/app/_lib/api"
import { TableInstanceProvider } from "@/components/data-table/table-instance-provider"
import { type DataTableFilterField } from "@/types"

interface ClientsTableProps {
    clientsPromise: Promise<GetClientsResponse>
    viewsPromise: Promise<View[]>
}

export function ClientsTable({ clientsPromise, viewsPromise }: ClientsTableProps) {
    const { data: clients, pageCount } = React.use(clientsPromise)
    const views = React.use(viewsPromise)

    const filterFields: DataTableFilterField<Client>[] = [
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
            label: "Organization Type",
            value: "organization_type",
            options: [
                { label: "Corporation", value: "Corporation", withCount: true },
                { label: "SMEs", value: "SMEs", withCount: true },
                { label: "Government", value: "Government", withCount: true },
                { label: "NGO", value: "NGO", withCount: true },
                { label: "Startup", value: "Startup", withCount: true },
                { label: "Individual", value: "Individual", withCount: true },
            ],
        },
        {
            label: "Industry",
            value: "industry",
            options: Array.from(
                new Set(clients.flatMap((client) => client.industry))
            ).map((industry) => ({
                label: industry,
                value: industry,
                withCount: true,
            })),
        },
        {
            label: "Location",
            value: "location",
            options: Array.from(
                new Set(clients.map((client) => client.location))
            ).map((location) => ({
                label: location,
                value: location,
                withCount: true,
            })),
        },
    ]

    const { table } = useDataTable({
        data: clients,
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