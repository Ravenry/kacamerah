import { NextResponse } from "next/server"
import { mockViews } from "@/app/_lib/mock-data"
import { createViewSchema } from "@/app/_lib/validations"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const view = mockViews.find((v) => v.id === params.id)
    if (!view) {
      return NextResponse.json(
        { error: "View not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(view)
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch view" },
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
    const body = createViewSchema.parse(json)
    
    const viewIndex = mockViews.findIndex((v) => v.id === params.id)
    if (viewIndex === -1) {
      return NextResponse.json(
        { error: "View not found" },
        { status: 404 }
      )
    }

    const existingView = mockViews[viewIndex]
    if (!existingView) {
      return NextResponse.json(
        { error: "View not found" },
        { status: 404 }
      )
    }

    const updatedView = {
      id: existingView.id,
      name: body.name,
      columns: body.columns ?? existingView.columns,
      filterParams: existingView.filterParams,
      createdAt: existingView.createdAt,
      updatedAt: new Date()
    }
    
    if (body.filterParams?.operator) {
      updatedView.filterParams = {
        ...existingView.filterParams,
        operator: body.filterParams.operator
      }
    }
    
    mockViews[viewIndex] = updatedView
    return NextResponse.json(updatedView)
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update view" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const viewIndex = mockViews.findIndex((v) => v.id === params.id)
    if (viewIndex === -1) {
      return NextResponse.json(
        { error: "View not found" },
        { status: 404 }
      )
    }

    mockViews.splice(viewIndex, 1)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete view" },
      { status: 500 }
    )
  }
} 