import { NextResponse } from "next/server"
import { mockTasks } from "@/app/_lib/mock-data"
import { z } from "zod"

const deleteTasksSchema = z.object({
  ids: z.array(z.string())
})

export async function DELETE(request: Request) {
  try {
    const json = await request.json()
    const { ids } = deleteTasksSchema.parse(json)
    
    // Remove tasks with matching ids
    const tasksToDelete = new Set(ids)
    const remainingTasks = mockTasks.filter(task => !tasksToDelete.has(task.id))
    mockTasks.length = 0
    mockTasks.push(...remainingTasks)

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete tasks" },
      { status: 500 }
    )
  }
} 