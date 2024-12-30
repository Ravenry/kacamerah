import { type ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface Staff {
    _id: string
    name: string
    email: string
    role: 'Account Manager' | 'Project Coordinator' | 'Admin'
    is_active: boolean
    projects: string[]
    createdAt: string
    updatedAt: string
}

export function getColumns(): ColumnDef<Staff>[] {
    return [
        {
            accessorKey: "name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
            enableSorting: true,
        },
        {
            accessorKey: "email",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
            enableSorting: true,
        },
        {
            accessorKey: "role",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
            cell: ({ row }) => {
                const role = row.getValue("role") as string
                return <Badge className={cn("bg-primary text-primary-foreground")}>{role}</Badge>
            },
            enableSorting: true,
            size: 200,
        },
        {
            accessorKey: "is_active",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            cell: ({ row }) => {
                const isActive = row.getValue("is_active") as boolean
                return (
                    <Badge className={cn(
                        isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                    )}>
                        {isActive ? "Active" : "Inactive"}
                    </Badge>
                )
            },
            enableSorting: true,
        },
        {
            accessorKey: "projects",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Projects" />,
            cell: ({ row }) => {
                const projects = row.getValue("projects") as string[]
                return <div className="text-muted-foreground">{projects.length} projects</div>
            },
            enableSorting: false,
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
            cell: ({ row }) => {
                const date = new Date(row.getValue("createdAt"))
                return <div>{date.toLocaleDateString()}</div>
            },
            enableSorting: true,
        },
    ]
} 