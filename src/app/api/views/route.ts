import { NextResponse } from "next/server"
import { mockViews } from "@/app/_lib/mock-data"
import { createViewSchema } from "@/app/_lib/validations"

export async function GET() {
  try {
    return NextResponse.json(mockViews)
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch views" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = createViewSchema.parse(json)
    
    const newView = {
      id: crypto.randomUUID(),
      name: body.name,
      columns: body.columns ?? ["code", "title", "status", "priority"],
      filterParams: {
        status: [],
        priority: [],
        operator: body.filterParams?.operator ?? "and"
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    mockViews.push(newView)
    return NextResponse.json(newView)
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create view" },
      { status: 500 }
    )
  }
} 