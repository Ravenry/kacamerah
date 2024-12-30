import { NextResponse } from "next/server"
import { mockTasks } from "@/app/_lib/mock-data"

export async function GET() {
  try {
    const priorityCounts = mockTasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const result = Object.entries(priorityCounts).map(([priority, count]) => ({
      priority,
      count
    }))

    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch task priority counts" },
      { status: 500 }
    )
  }
} 