"use client"

import * as React from "react"
import { type Freelancer, getColumns } from "./freelancers-table-columns"
import { type View } from "@/types"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableAdvancedToolbar } from "@/components/data-table/advanced/data-table-advanced-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { TableInstanceProvider } from "@/components/data-table/table-instance-provider"
import { type DataTableFilterField } from "@/types"
import {
    MODEL_YEARS_EXPERIENCE,
    MODEL_FREELANCE_SERVICES,
    type YearsExperience,
    type FreelanceService
} from "@/constants"

interface FreelancersTableProps {
    freelancersPromise: Promise<{ data: Freelancer[], pageCount: number }>
    viewsPromise: Promise<View[]>
}

export function FreelancersTable({ freelancersPromise, viewsPromise }: FreelancersTableProps) {
    const { data: freelancers, pageCount } = React.use(freelancersPromise)
    const views = React.use(viewsPromise)

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
        data: freelancers,
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