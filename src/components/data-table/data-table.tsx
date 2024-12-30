import * as React from "react"
import { flexRender, type Column, type Table as TanstackTable } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type TanstackTable<TData>
   */
  table: TanstackTable<TData>

  /**
   * The floating bar to render at the bottom of the table on row selection.
   * @default null
   * @type React.ReactNode | null
   * @example floatingBar={<TasksTableFloatingBar />}
   */
  floatingBar?: React.ReactNode | null
}

// Add this helper function
const shouldPinSelect = (table: TanstackTable<any>) => {
  const pinnedColumns = table.getState().columnPinning;
  return (pinnedColumns.left?.length || 0) > 1 || (pinnedColumns.right?.length || 0) > 0;
};

// Modify the pinning styles function
const getCommonPinningStyles = (column: Column<any>, table: TanstackTable<any>): React.CSSProperties => {
  const isPinned = column.getIsPinned();
  const isSelectColumn = column.id === 'select';
  const hasOtherPinnedColumns = shouldPinSelect(table);

  // Base styles for all cells
  const baseStyles: React.CSSProperties = {
    padding: '12px',
    width: column.getSize(),
    position: 'relative',
    borderRight: '1px solid var(--border)', // Add border between columns
  };

  // Don't pin select column if no other columns are pinned
  if (isSelectColumn && !hasOtherPinnedColumns) {
    return baseStyles;
  }

  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    ...baseStyles,
    boxShadow: isLastLeftPinnedColumn
      ? '4px 0 4px -4px rgba(0, 0, 0, 0.2)'
      : isFirstRightPinnedColumn
        ? '-4px 0 4px -4px rgba(0, 0, 0, 0.2)'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    backgroundColor: isPinned ? '#f1f5f9' : undefined,
    zIndex: isPinned ? 1 : 0,
  }
}

export function DataTable<TData>({
  table,
  floatingBar = null,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  return (
    <div
      className={cn("w-full space-y-2.5 overflow-hidden pr-1", className)}
      {...props}
    >
      {children}
      <div className="table-container mx-1 rounded-md border" style={{ maxWidth: 'calc(100vw - 332px)', border: '1px solid rgb(113, 113, 122)' }}>
        <Table
          style={{
            width: table.getTotalSize(),
          }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { column } = header
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={getCommonPinningStyles(column, table)}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanPin() && (
                            <div className="flex gap-1 justify-start mt-2">
                              {header.column.getIsPinned() !== 'left' && (
                                <button
                                  className="rounded p-1 hover:bg-accent"
                                  onClick={() => header.column.pin('left')}
                                >
                                  ⬅️
                                </button>
                              )}
                              {header.column.getIsPinned() && (
                                <button
                                  className="rounded p-1 hover:bg-accent"
                                  onClick={() => header.column.pin(false)}
                                >
                                  ✖️
                                </button>
                              )}
                              {header.column.getIsPinned() !== 'right' && (
                                <button
                                  className="rounded p-1 hover:bg-accent"
                                  onClick={() => header.column.pin('right')}
                                >
                                  ➡️
                                </button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={getCommonPinningStyles(cell.column, table)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {table.getFilteredSelectedRowModel().rows.length > 0 && floatingBar}
      </div>
    </div>
  )
}
