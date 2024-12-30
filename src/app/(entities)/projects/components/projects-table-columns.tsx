import { type ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DataTableRowActions } from "./projects-table-row-actions"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { formatCurrency } from "@/lib/utils"

export interface Project {
    _id: string
    project_id: string
    name: string
    organization_id: string
    client_id: string
    project_value: {
        amount: number
        currency: string
    }
    service_type: string
    note: string
    timeline: {
        start_date: string
        end_date: string
        duration: number
    }
    team: {
        project_managers: Array<{
            _id: string
            name: string
        }>
        account_manager: {
            _id: string
            name: string
        }
        members: Array<{
            role: string
            freelancers: Array<{
                _id: string
                name: string
            }>
        }>
    }
    brief: {
        business_type: string
        industries: string[]
        regions: string[]
        objectives: string[]
        target_audience: string[]
        requirements: string[]
    }
    financial: {
        budget: {
            amount: number
            currency: string
        }
        cost_of_sales: {
            amount: number
            currency: string
        }
        margin: number
    }
    files: {
        name: string
        url: string
        type: string
        size: number
    }[]
    createdAt: string
    updatedAt: string
}

export function getColumns(): ColumnDef<Project>[] {
    return [
        // {
        //     id: "select",
        //     header: ({ table }) => (
        //         <Checkbox
        //             checked={table.getIsAllPageRowsSelected()}
        //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        //             aria-label="Select all"
        //             className="translate-y-[2px]"
        //         />
        //     ),
        //     cell: ({ row }) => (
        //         <Checkbox
        //             checked={row.getIsSelected()}
        //             onCheckedChange={(value) => row.toggleSelected(!!value)}
        //             aria-label="Select row"
        //             className="translate-y-[2px]"
        //         />
        //     ),
        //     enableSorting: false,
        //     enableHiding: false,
        // },
        {
            accessorKey: "project_id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Project ID" />
            ),
        },
        {
            accessorKey: "name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        },
        {
            accessorKey: "project_value",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Project Value" />
            ),
            cell: ({ row }) => {
                const value = row.getValue("project_value") as { amount: number, currency: string }
                return formatCurrency(value.amount, value.currency)
            },
        },
        {
            accessorKey: "service_type",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Service Type" />
            ),
            cell: ({ row }) => {
                const type = row.getValue("service_type") as string
                return (
                    <Badge variant="outline">
                        {type === "SS" ? "Single Service" : "Managed Service"}
                    </Badge>
                )
            },
        },
        {
            id: "project_managers",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Project Managers" />
            ),
            accessorFn: (row) => row.team.project_managers,
            cell: ({ row }) => {
                const managers = row.getValue("project_managers") as Project["team"]["project_managers"]
                if (!managers?.length) return null
                return (
                    <div className="text-sm">
                        {managers.map(m => m.name).join(", ")}
                    </div>
                )
            },
        },
        {
            id: "account_manager",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Account Manager" />
            ),
            accessorFn: (row) => row.team.account_manager,
            cell: ({ row }) => {
                const manager = row.getValue("account_manager") as Project["team"]["account_manager"]
                if (!manager) return null
                return (
                    <div className="text-sm">
                        {manager.name}
                    </div>
                )
            },
        },
        {
            id: "team_members",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Team Members" />
            ),
            accessorFn: (row) => row.team.members,
            cell: ({ row }) => {
                const members = row.getValue("team_members") as Project["team"]["members"]
                if (!members?.length) return null
                return (
                    <div className="space-y-2">
                        {members.map((group) => (
                            <div key={group.role}>
                                <Badge variant="outline" className="mb-1">
                                    {group.role}
                                </Badge>
                                <div className="text-sm text-muted-foreground">
                                    {group.freelancers.map(f => f.name).join(", ")}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            },
        },
        {
            accessorKey: "timeline",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Timeline" />
            ),
            cell: ({ row }) => {
                const timeline = row.getValue("timeline") as Project["timeline"]
                return (
                    <div className="flex flex-col space-y-1">
                        <div className="text-sm">
                            Start: {new Date(timeline.start_date).toLocaleDateString()}
                        </div>
                        <div className="text-sm">
                            End: {new Date(timeline.end_date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Duration: {timeline.duration} days
                        </div>
                    </div>
                )
            },
        },
        {
            id: "business_type",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Business Type" />
            ),
            accessorFn: (row) => row.brief.business_type,
            cell: ({ row }) => {
                const businessType = row.getValue("business_type") as string
                if (!businessType) return null
                return <Badge variant="outline">{businessType}</Badge>
            },
        },
        {
            id: "industries",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Industries" />
            ),
            accessorFn: (row) => row.brief.industries,
            cell: ({ row }) => {
                const industries = row.getValue("industries") as string[]
                if (!industries?.length) return null
                return (
                    <div className="flex flex-wrap gap-1">
                        {industries.map((industry) => (
                            <Badge key={industry} variant="secondary">
                                {industry}
                            </Badge>
                        ))}
                    </div>
                )
            },
        },
        {
            id: "regions",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Regions" />
            ),
            accessorFn: (row) => row.brief.regions,
            cell: ({ row }) => {
                const regions = row.getValue("regions") as string[]
                if (!regions?.length) return null
                return (
                    <div className="flex flex-wrap gap-1">
                        {regions.map((region) => (
                            <Badge key={region} variant="outline">
                                {region}
                            </Badge>
                        ))}
                    </div>
                )
            },
        },
        {
            id: "objectives",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Objectives" />
            ),
            accessorFn: (row) => row.brief.objectives,
            cell: ({ row }) => {
                const objectives = row.getValue("objectives") as string[]
                if (!objectives?.length) return null
                return (
                    <div className="flex flex-col gap-1">
                        {objectives.map((objective) => (
                            <div key={objective} className="text-sm">
                                • {objective}
                            </div>
                        ))}
                    </div>
                )
            },
            size: 300
        },
        {
            id: "target_audience",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Target Audience" />
            ),
            accessorFn: (row) => row.brief.target_audience,
            cell: ({ row }) => {
                const audience = row.getValue("target_audience") as string[]
                if (!audience?.length) return null
                return (
                    <div className="flex flex-wrap gap-1">
                        {audience.map((target) => (
                            <Badge key={target} variant="secondary">
                                {target}
                            </Badge>
                        ))}
                    </div>
                )
            },
        },
        {
            id: "requirements",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Requirements" />
            ),
            accessorFn: (row) => row.brief.requirements,
            cell: ({ row }) => {
                const requirements = row.getValue("requirements") as string[]
                if (!requirements?.length) return null
                return (
                    <div className="flex flex-col gap-1">
                        {requirements.map((requirement) => (
                            <div key={requirement} className="text-sm">
                                • {requirement}
                            </div>
                        ))}
                    </div>
                )
            },
            size: 300
        },
        {
            accessorKey: "financial",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Financial" />
            ),
            cell: ({ row }) => {
                const financial = row.getValue("financial") as Project["financial"]
                if (!financial) return null
                return (
                    <div className="flex flex-col space-y-1">
                        <div className="text-sm">
                            Budget: {formatCurrency(financial.budget.amount, financial.budget.currency)}
                        </div>
                        <div className="text-sm">
                            CoS: {formatCurrency(financial.cost_of_sales.amount, financial.cost_of_sales.currency)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Margin: {financial.margin}%
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "files",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Files" />,
            cell: ({ row }) => {
                const files = row.getValue("files") as Project["files"]
                if (!files?.length) return "0"
                return files.length.toString()
            },
        },
        {
            id: "actions",
            cell: ({ row }) => <DataTableRowActions row={row} />,
        },
    ]
} 