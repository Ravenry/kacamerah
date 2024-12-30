import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export interface Freelancer {
    _id: string
    name: string
    linkedin?: string
    profile: {
        location: string
        about_me?: string
        languages: string[]
        education: {
            degree: string
            field: string
            year: string
        }[]
    }
    experience: {
        roles: {
            title: string
            organization: string
            current: boolean
        }[]
        organizations: string[]
    }
    freelance_services: string[]
    industry_experience: {
        industry: string
        years_experience: string
        note: string
    }[]
    ravenry_relationship?: {
        worked_with_us: boolean
        feedback?: string
        source?: string
    }
    availability: boolean
    rating?: number
    audit: {
        updated_on: Date
        updated_by: string
    }
    createdAt: Date
    updatedAt: Date
}

export function getColumns(): ColumnDef<Freelancer>[] {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
            cell: ({ row }) => {
                const initials = row.getValue<string>("name")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()

                return (
                    <div className="flex items-center gap-4">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <span>{row.getValue<string>("name")}</span>
                    </div>
                )
            },
            enableSorting: true,
            enableHiding: false,
        },
        {
            accessorKey: "profile.location",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
            cell: ({ row }) => <div>{row.original.profile.location}</div>,
            enableSorting: true,
        },
        {
            accessorKey: "freelance_services",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Services" />,
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.freelance_services.map((service) => (
                        <Badge key={service} variant="outline">
                            {service}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "experience.roles",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Current Role" />,
            cell: ({ row }) => {
                const currentRole = row.original.experience.roles.find((role) => role.current)
                return currentRole ? (
                    <div>
                        <div className="font-medium">{currentRole.title}</div>
                        <div className="text-muted-foreground text-sm">{currentRole.organization}</div>
                    </div>
                ) : null
            },
        },
        {
            accessorKey: "industry_experience",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Industries" />,
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.industry_experience.map((exp) => (
                        <Badge key={exp.industry} variant="outline">
                            {exp.industry}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "updatedAt",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated" />,
            cell: ({ row }) => (
                <div>{new Date(row.original.updatedAt).toLocaleDateString()}</div>
            ),
            enableSorting: true,
        },
        {
            id: "actions",
            cell: ({ row }) => <DataTableRowActions row={row} />,
        },
    ]
}