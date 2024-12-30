import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions"

export interface Client {
    _id: string
    name: string
    email: string
    organization_type: "Corporation" | "SMEs" | "Government" | "NGO" | "Startup" | "Individual"
    company_name?: string
    industry: string[]
    team?: string
    location: string
    projects: string[]
    createdAt: Date
    updatedAt: Date
}

export function getColumns(): ColumnDef<Client>[] {
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
            accessorKey: "name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.getValue<string>("name")}</span>
                    {row.original.company_name && (
                        <span className="text-sm text-muted-foreground">
                            {row.original.company_name}
                        </span>
                    )}
                </div>
            ),
            enableSorting: true,
        },
        {
            accessorKey: "email",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
            cell: ({ row }) => <div>{row.getValue<string>("email")}</div>,
            enableSorting: true,
        },
        {
            accessorKey: "organization_type",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Organization Type" />,
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.getValue<string>("organization_type")}
                </Badge>
            ),
            enableSorting: true,
        },
        {
            accessorKey: "industry",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Industries" />,
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.industry.map((ind) => (
                        <Badge key={ind} variant="outline">
                            {ind}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "team",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Team" />,
            cell: ({ row }) => row.getValue<string>("team") || "—",
            enableSorting: true,
        },
        {
            accessorKey: "location",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
            cell: ({ row }) => <div>{row.getValue<string>("location")}</div>,
            enableSorting: true,
        },
        {
            accessorKey: "projects",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Projects" />,
            cell: ({ row }) => (
                <Badge>
                    {row.original.projects.length} project{row.original.projects.length !== 1 ? "s" : ""}
                </Badge>
            ),
            enableSorting: true,
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
            cell: ({ row }) => (
                <div>{new Date(row.original.createdAt).toLocaleDateString()}</div>
            ),
            enableSorting: true,
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