import { NextResponse } from "next/server"
import { z } from "zod"
import connectDB from "@/lib/mongodb"
import { Project, type IProject } from "@/models/project"
import { Client } from "@/models/client"
import { Freelancer } from "@/models/freelancer"
import Staff from "@/models/staff"
import { WithMongooseFields, removeMongooseFields } from "@/lib/types"
import { Types } from "mongoose"

interface PopulatedTeamMember {
  _id: Types.ObjectId;
  name: string;
}

interface PopulatedProject extends Omit<IProject, 'team'> {
  team: {
    project_managers: PopulatedTeamMember[];
    account_manager: PopulatedTeamMember;
    members: Array<{
      role: string;
      freelancers: PopulatedTeamMember[];
    }>;
  };
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") ?? "1")
    const per_page = parseInt(searchParams.get("per_page") ?? "10")
    const sort = searchParams.get("sort")
    
    // Build sort query
    let sortQuery: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort) {
      const [field, order] = sort.split('.');
      if (field) {
        sortQuery = { [field]: order === 'desc' ? -1 : 1 };
      }
    }
    
    const offset = (page - 1) * per_page
    
    // Execute queries with populated team members
    const totalProjects = await Project.countDocuments();
    const projects = await Project.find()
      .populate({
        path: 'team.project_managers',
        model: Freelancer,
        select: 'name'
      })
      .populate({
        path: 'team.account_manager',
        model: Staff,
        select: 'name'
      })
      .populate({
        path: 'team.members.freelancers',
        model: Freelancer,
        select: 'name'
      })
      .skip(offset)
      .limit(per_page)
      .sort(sortQuery)
      .lean() as unknown as PopulatedProject[];

    const pageCount = Math.ceil(totalProjects / per_page)

    // Transform the populated data to match the expected format
    const transformedProjects = projects.map(project => {
      const { team, ...rest } = project;
      return {
        ...rest,
        team: {
          project_managers: team.project_managers.map(pm => ({
            _id: pm._id.toString(),
            name: pm.name
          })),
          account_manager: {
            _id: team.account_manager._id.toString(),
            name: team.account_manager.name
          },
          members: team.members.map(member => ({
            role: member.role,
            freelancers: member.freelancers.map(f => ({
              _id: f._id.toString(),
              name: f.name
            }))
          }))
        }
      };
    });

    return NextResponse.json({ 
      data: transformedProjects, 
      pageCount,
      total: totalProjects
    })
  } catch (err) {
    console.error('Failed to fetch projects:', err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
} 