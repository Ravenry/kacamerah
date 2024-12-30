import { NextResponse } from "next/server"
import { createUserSchema, type UserSearchParams } from "@/app/_lib/validations"
import connectDB from "@/lib/mongodb"
import { User, type IUser } from "@/models/user"
import { ZodError } from "zod"
import { Error as MongooseError } from "mongoose"

interface MongooseDocument extends IUser {
  _id: unknown;
  __v?: number;
}

type SortOrder = 1 | -1;
type SortQuery = Record<string, SortOrder>;

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url)
    
    // Parse search params
    const page = parseInt(searchParams.get("page") ?? "1")
    const per_page = parseInt(searchParams.get("per_page") ?? "10")
    const sort = searchParams.get("sort")
    const name = searchParams.get("name")
    const email = searchParams.get("email")
    const role = searchParams.get("role")
    const status = searchParams.get("status")
    
    // Build filter query
    const query: Record<string, any> = {};
    if (name) query.name = new RegExp(name, 'i');
    if (email) query.email = new RegExp(email, 'i');
    if (role) query.role = role;
    if (status) query.status = status;

    // Build sort query
    let sortQuery: SortQuery = { createdAt: -1 };
    if (sort) {
      const [field, order] = sort.split('.');
      if (field && (field === 'name' || field === 'email' || field === 'role' || field === 'status' || field === 'createdAt')) {
        sortQuery = { [field]: order === 'desc' ? -1 : 1 };
      }
    }
    
    const offset = (page - 1) * per_page
    
    // Execute queries
    const [totalUsers, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query, { _id: 0, __v: 0 })
        .skip(offset)
        .limit(per_page)
        .sort(sortQuery)
        .lean()
    ]);

    const pageCount = Math.ceil(totalUsers / per_page)

    return NextResponse.json({ 
      data: users, 
      pageCount,
      total: totalUsers
    })
  } catch (err) {
    console.error('Failed to fetch users:', err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const json = await request.json()
    const body = createUserSchema.parse(json)
    
    // Check if email already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      )
    }
    
    const newUser: IUser = {
      ...body,
      userId: crypto.randomUUID(),
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const user = await User.create(newUser)
    const userResponse = user.toObject() as MongooseDocument
    
    // Remove Mongoose-specific fields
    const { _id, __v, ...cleanUserResponse } = userResponse
    
    return NextResponse.json(cleanUserResponse)
  } catch (err) {
    console.error('Failed to create user:', err);
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid user data", details: err.errors },
        { status: 400 }
      )
    }
    if (err instanceof MongooseError.ValidationError) {
      return NextResponse.json(
        { error: "Invalid user data", details: err.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const json = await request.json()
    const body = createUserSchema.partial().parse(json)
    
    // Check if email is being changed and already exists
    if (body.email) {
      const existingUser = await User.findOne({ 
        email: body.email,
        userId: { $ne: userId }
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        )
      }
    }
    
    const user = await User.findOneAndUpdate(
      { userId },
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    
    // Remove Mongoose-specific fields
    const { _id, __v, ...cleanUserResponse } = user;
    
    return NextResponse.json(cleanUserResponse)
  } catch (err) {
    console.error('Failed to update user:', err);
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid user data", details: err.errors },
        { status: 400 }
      )
    }
    if (err instanceof MongooseError.ValidationError) {
      return NextResponse.json(
        { error: "Invalid user data", details: err.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }
    
    const user = await User.findOneAndDelete({ userId }).lean();
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Failed to delete user:', err);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
} 