import { NextResponse } from "next/server"
import { z } from "zod"
import connectDB from "@/lib/mongodb"
import { Task, type ITask } from "@/models/task"
import { WithMongooseFields, removeMongooseFields } from "@/lib/types"

const createTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.string(),
  priority: z.string(),
  projectId: z.string(),
  assignedTo: z.string().optional(),
  dueDate: z.string().transform(str => new Date(str)),
  estimatedHours: z.number(),
  actualHours: z.number().optional()
});

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") ?? "1")
    const per_page = parseInt(searchParams.get("per_page") ?? "10")
    const projectId = searchParams.get("projectId")
    
    const query = projectId ? { projectId } : {}
    const offset = (page - 1) * per_page
    const totalTasks = await Task.countDocuments(query)
    const tasks = await Task.find(query, { _id: 0, __v: 0 })
      .skip(offset)
      .limit(per_page)
      .sort({ createdAt: -1 })
      .lean()

    const pageCount = Math.ceil(totalTasks / per_page)

    return NextResponse.json({ 
      data: tasks, 
      pageCount 
    })
  } catch (err) {
    console.error('Failed to fetch tasks:', err);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const json = await request.json()
    const body = createTaskSchema.parse(json)
    
    const newTask: ITask = {
      taskId: crypto.randomUUID(),
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const task = await Task.create(newTask)
    const taskResponse = removeMongooseFields(task.toObject() as WithMongooseFields<ITask>)
    
    return NextResponse.json(taskResponse)
  } catch (err) {
    console.error('Failed to create task:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid task data", issues: err.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    )
  }
} 