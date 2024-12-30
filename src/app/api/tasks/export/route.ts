import { NextResponse } from "next/server"
import { mockTasks } from "@/app/_lib/mock-data"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const excludeColumns = searchParams.get("excludeColumns")?.split(",") ?? []
    
    // Convert tasks to CSV format
    const headers = Object.keys(mockTasks[0] ?? {}).filter(
      key => !excludeColumns.includes(key)
    )
    
    const rows = mockTasks.map(task => 
      headers.map(header => {
        const value = task[header as keyof typeof task]
        if (value instanceof Date) {
          return value.toISOString()
        }
        if (Array.isArray(value)) {
          return value.join(", ")
        }
        return String(value ?? "")
      }).join(",")
    )
    
    const csv = [
      headers.join(","),
      ...rows
    ].join("\n")

    // Return CSV as a downloadable file
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="tasks.csv"'
      }
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to export tasks" },
      { status: 500 }
    )
  }
} 