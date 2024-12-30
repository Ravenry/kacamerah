import { NextResponse } from "next/server"
import { mockTasks } from "@/app/_lib/mock-data"

export async function GET() {
  try {
    const statusCounts = mockTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const result = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    }))

    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch task status counts" },
      { status: 500 }
    )
  }
} 