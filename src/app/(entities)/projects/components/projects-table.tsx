'use client'

import * as React from "react"
import { type Project, getColumns } from "./projects-table-columns"
import { type View } from "@/types"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableAdvancedToolbar } from "@/components/data-table/advanced/data-table-advanced-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { type GetProjectsResponse } from "@/app/_lib/api"
import { TableInstanceProvider } from "@/components/data-table/table-instance-provider"
import { type DataTableFilterField } from "@/types"

interface ProjectsTableProps {
    projectsPromise: Promise<GetProjectsResponse>
    viewsPromise: Promise<View[]>
}

export function ProjectsTable({ projectsPromise, viewsPromise }: ProjectsTableProps) {
    const { data: projects, pageCount } = React.use(projectsPromise)
    const views = React.use(viewsPromise)

    const filterFields: DataTableFilterField<Project>[] = [
        {
            label: "Name",
            value: "name",
            placeholder: "Filter by name...",
        },
        {
            label: "Status",
            value: "status",
            options: Array.from(new Set(projects.map((project) => project.status))).map(
                (status) => ({
                    label: status[0]?.toUpperCase() + status.slice(1),
                    value: status,
                    withCount: true,
                })
            ),
        },
        {
            label: "Service Type",
            value: "service_type",
            options: [
                { label: "Single Service", value: "SS", withCount: true },
                { label: "Managed Service", value: "MS", withCount: true },
            ],
        },
        {
            label: "Business Type",
            value: "brief.business_type",
            options: [
                { label: "B2B", value: "B2B", withCount: true },
                { label: "B2C", value: "B2C", withCount: true },
            ],
        },
        {
            label: "Industries",
            value: "brief.industries",
            options: Array.from(
                new Set(projects.flatMap((project) => project.brief.industries))
            ).map((industry) => ({
                label: industry,
                value: industry,
                withCount: true,
            })),
        },
        {
            label: "Regions",
            value: "brief.regions",
            options: Array.from(
                new Set(projects.flatMap((project) => project.brief.regions))
            ).map((region) => ({
                label: region,
                value: region,
                withCount: true,
            })),
        },
    ]

    const { table } = useDataTable({
        data: projects,
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