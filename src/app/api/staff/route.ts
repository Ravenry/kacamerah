import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Staff } from "@/models/staff"

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") ?? "1")
    const per_page = parseInt(searchParams.get("per_page") ?? "10")
    const sort = searchParams.get("sort")
    const search = searchParams.get("search")
    const role = searchParams.get("role")
    const status = searchParams.get("status")
    
    // Build filter query
    const filter: Record<string, any> = {};
    if (search) {
      filter.$text = { $search: search };
    }
    if (role) {
      filter.role = role;
    }
    if (status) {
      filter.is_active = status === 'active';
    }
    
    // Build sort query
    let sortQuery: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort) {
      const [field, order] = sort.split('.');
      if (field) {
        sortQuery = { [field]: order === 'desc' ? -1 : 1 };
      }
    }
    
    const offset = (page - 1) * per_page
    
    // Execute queries
    const [totalStaff, staff] = await Promise.all([
      Staff.countDocuments(filter),
      Staff.find(filter)
        .populate('projects', 'name')
        .skip(offset)
        .limit(per_page)
        .sort(sortQuery)
        .lean()
    ]);

    const pageCount = Math.ceil(totalStaff / per_page)

    return NextResponse.json({ 
      data: staff, 
      pageCount,
      total: totalStaff
    })
  } catch (err) {
    console.error('Failed to fetch staff:', err);
    return NextResponse.json(
      { error: "Failed to fetch staff" },
      { status: 500 }
    )
  }
} 