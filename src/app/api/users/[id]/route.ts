import { NextResponse } from "next/server"
import { mockUsers } from "@/app/_lib/mock-data"
import { updateUserSchema } from "@/app/_lib/validations"
import { type User } from "@/db/schema"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = mockUsers.find((u) => u.id === params.id)
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(user)
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
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
    const body = updateUserSchema.parse(json)
    
    const userIndex = mockUsers.findIndex((u) => u.id === params.id)
    if (userIndex === -1) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const existingUser = mockUsers[userIndex]
    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const updatedUser: User = {
      ...existingUser,
      email: body.email ?? existingUser.email,
      name: body.name ?? existingUser.name,
      role: body.role ?? existingUser.role,
      status: body.status ?? existingUser.status,
      department: body.department ?? existingUser.department,
      updatedAt: new Date()
    }
    
    mockUsers[userIndex] = updatedUser
    return NextResponse.json(updatedUser)
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userIndex = mockUsers.findIndex((u) => u.id === params.id)
    if (userIndex === -1) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    mockUsers.splice(userIndex, 1)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
} 