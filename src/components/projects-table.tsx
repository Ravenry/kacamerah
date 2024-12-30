"use client"

import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

const data = [
    {
        id: "1",
        name: "Market Research 2024",
        client: "TechCorp",
        assignedTo: "John Doe",
        status: "In Progress",
        dueDate: "2024-06-30",
    },
    {
        id: "2",
        name: "Customer Satisfaction Survey",
        client: "RetailGiant",
        assignedTo: "Jane Smith",
        status: "Completed",
        dueDate: "2024-03-15",
    },
    {
        id: "3",
        name: "Competitor Analysis",
        client: "StartupX",
        assignedTo: "Bob Johnson",
        status: "Not Started",
        dueDate: "2024-08-01",
    },
    // Add more project data here...
]

const columns: ColumnDef<typeof data[0]>[] = [
    {
        accessorKey: "name",
        header: "Project Name",
    },
    {
        accessorKey: "client",
        header: "Client",
    },
    {
        accessorKey: "assignedTo",
        header: "Assigned To",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "dueDate",
        header: "Due Date",
    },
]

export function ProjectsTable() {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
    })

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

