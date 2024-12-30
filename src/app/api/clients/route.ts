import { NextResponse } from "next/server"
import { z } from "zod"
import connectDB from "@/lib/mongodb"
import { Client, type IClient } from "@/models/client"
import { WithMongooseFields, removeMongooseFields } from "@/lib/types"

const createClientSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  company: z.string(),
  industry: z.string(),
  status: z.string(),
  totalProjects: z.number().default(0),
  activeProjects: z.number().default(0),
  totalBudget: z.number().default(0)
});

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") ?? "1")
    const per_page = parseInt(searchParams.get("per_page") ?? "10")
    const industry = searchParams.get("industry")
    
    const query = industry ? { industry } : {}
    const offset = (page - 1) * per_page
    const totalClients = await Client.countDocuments(query)
    const clients = await Client.find(query, { _id: 0, __v: 0 })
      .skip(offset)
      .limit(per_page)
      .sort({ createdAt: -1 })
      .lean()

    const pageCount = Math.ceil(totalClients / per_page)

    return NextResponse.json({ 
      data: clients, 
      pageCount 
    })
  } catch (err) {
    console.error('Failed to fetch clients:', err);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const json = await request.json()
    const body = createClientSchema.parse(json)
    
    const newClient: IClient = {
      clientId: crypto.randomUUID(),
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const client = await Client.create(newClient)
    const clientResponse = removeMongooseFields(client.toObject() as WithMongooseFields<IClient>)
    
    return NextResponse.json(clientResponse)
  } catch (err) {
    console.error('Failed to create client:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid client data", issues: err.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    )
  }
} 