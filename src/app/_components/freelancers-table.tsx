"use client"

import * as React from "react"
import type { DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTableAdvancedToolbar } from "@/components/data-table/advanced/data-table-advanced-toolbar"
import { DataTable } from "@/components/data-table/data-table"
import { TableInstanceProvider } from "@/components/data-table/table-instance-provider"
import { type Freelancer, getColumns } from "./freelancers-table-columns"
import {
    MODEL_YEARS_EXPERIENCE,
    MODEL_FREELANCE_SERVICES,
    type YearsExperience,
    type FreelanceService
} from "@/constants"

interface FreelancersTableProps {
    data: Freelancer[]
    pageCount: number
    views: any[]
}

export function FreelancersTable({ data, pageCount, views }: FreelancersTableProps) {
    // Memoize the columns so they don't re-render on every render
    const columns = React.useMemo(() => getColumns(), [])

    const filterFields: DataTableFilterField<Freelancer>[] = [
        {
            label: "Name",
            value: "name",
            placeholder: "Filter by name...",
        },
        {
            label: "Location",
            value: "profile",
            placeholder: "Filter by location...",
            subField: "location"
        },
        {
            label: "Services",
            value: "freelance_services",
            options: MODEL_FREELANCE_SERVICES.map((service: FreelanceService) => ({
                label: service,
                value: service,
                withCount: true,
            })),
        },
        {
            label: "Experience",
            value: "industry_experience",
            subField: "years_experience",
            options: MODEL_YEARS_EXPERIENCE.map((years: YearsExperience) => ({
                label: years,
                value: years,
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
