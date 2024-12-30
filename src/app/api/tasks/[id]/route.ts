import { NextResponse } from "next/server"
import { mockTasks } from "@/app/_lib/mock-data"
import { updateTaskSchema } from "@/app/_lib/validations"
import { type Task } from "@/db/schema"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const task = mockTasks.find((t) => t.id === params.id)
    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(task)
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json()
    const body = updateTaskSchema.parse(json)
    
    const taskIndex = mockTasks.findIndex((t) => t.id === params.id)
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
    }

    const existingTask = mockTasks[taskIndex]
    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
    }

    const updatedTask: Task = {
      ...existingTask,
      title: body.title ?? existingTask.title,
      status: body.status ?? existingTask.status,
      label: body.label ?? existingTask.label,
      priority: body.priority ?? existingTask.priority,
      updatedAt: new Date()
    }
    
    mockTasks[taskIndex] = updatedTask
    return NextResponse.json(updatedTask)
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const taskIndex = mockTasks.findIndex((t) => t.id === params.id)
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
    }

    mockTasks.splice(taskIndex, 1)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    )
  }
} 