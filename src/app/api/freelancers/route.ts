import { NextResponse } from "next/server"
import { z } from "zod"
import connectDB from "@/lib/mongodb"
import { Freelancer, type IFreelancer } from "@/models/freelancer"
import { WithMongooseFields, removeMongooseFields } from "@/lib/types"
import { 
  MODEL_DEGREE_TYPES, 
  MODEL_FREELANCE_SERVICES, 
  MODEL_YEARS_EXPERIENCE,
  MODEL_FEEDBACK_STATUS,
  MODEL_RELATIONSHIP_SOURCES
} from "@/app/_lib/constants"

const createFreelancerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  linkedin: z.string().url().optional(),
  profile: z.object({
    location: z.string().min(1, "Location is required"),
    about_me: z.string().optional(),
    languages: z.array(z.string()),
    education: z.array(z.object({
      degree: z.enum(MODEL_DEGREE_TYPES),
      field: z.string().min(1, "Field of study is required"),
      year: z.string()
    })).min(1, "At least one education entry is required")
  }),
  experience: z.object({
    roles: z.array(z.object({
      title: z.string().min(1, "Role title is required"),
      organization: z.string().min(1, "Organization is required"),
      current: z.boolean()
    })),
    organizations: z.array(z.string())
  }),
  freelance_services: z.array(z.enum(MODEL_FREELANCE_SERVICES))
    .min(1, "At least one freelance service is required"),
  industry_experience: z.array(z.object({
    industry: z.string().min(1, "Industry is required"),
    years_experience: z.enum(MODEL_YEARS_EXPERIENCE),
    note: z.string().optional()
  })),
  ravenry_relationship: z.object({
    worked_with_us: z.boolean(),
    feedback: z.enum(MODEL_FEEDBACK_STATUS),
    source: z.enum(MODEL_RELATIONSHIP_SOURCES)
  }).optional(),
  availability: z.boolean().default(true),
  rating: z.number().min(0).max(5).optional(),
  audit: z.object({
    updated_by: z.string()
  })
});

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") ?? "1")
    const per_page = parseInt(searchParams.get("per_page") ?? "10")
    const search = searchParams.get("search")
    const location = searchParams.get("location")
    const service = searchParams.get("service")
    const available = searchParams.get("available")
    
    // Build query
    const query: any = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (location) {
      query['profile.location'] = location;
    }
    
    if (service) {
      query.freelance_services = service;
    }
    
    if (available !== null) {
      query.availability = available === 'true';
    }
    
    const offset = (page - 1) * per_page
    const totalFreelancers = await Freelancer.countDocuments(query)
    const freelancers = await Freelancer.find(query, { _id: 0, __v: 0 })
      .skip(offset)
      .limit(per_page)
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .lean()

    const pageCount = Math.ceil(totalFreelancers / per_page)

    return NextResponse.json({ 
      data: freelancers, 
      pageCount 
    })
  } catch (err) {
    console.error('Failed to fetch freelancers:', err);
    return NextResponse.json(
      { error: "Failed to fetch freelancers" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const json = await request.json()
    const body = createFreelancerSchema.parse(json)
    
    // Set audit fields
    const newFreelancer: IFreelancer = {
      ...body,
      audit: {
        ...body.audit,
        updated_on: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const freelancer = await Freelancer.create(newFreelancer)
    const freelancerResponse = removeMongooseFields(freelancer.toObject() as WithMongooseFields<IFreelancer>)
    
    return NextResponse.json(freelancerResponse)
  } catch (err) {
    console.error('Failed to create freelancer:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid freelancer data", issues: err.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create freelancer" },
      { status: 500 }
    )
  }
} 