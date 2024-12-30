import { connect, disconnect, Types, Document } from 'mongoose';
import { Client, type IClient } from '@/models/client';
import { Project, type IProject } from '@/models/project';
import { Freelancer, type IFreelancer } from '@/models/freelancer';
import { User, type IUser, USER_ROLES, USER_STATUSES } from '@/models/user';
import { ORGANIZATION_TYPES } from '@/models/client';
import Staff from '@/models/staff';
import { type IStaff } from '@/models/types';
import {
  RESEARCH_OBJECTIVES,
  RESEARCH_SERVICES,
  OUTPUT_TYPES,
  INDUSTRIES,
  TEAM_ROLES,
  SERVICE_TYPE,
  PROJECT_STATUSES,
  type ResearchService
} from '@/app/_lib/project-constants';
import {
  MODEL_DEGREE_TYPES,
  MODEL_FEEDBACK_STATUS,
  MODEL_RELATIONSHIP_SOURCES,
  MODEL_YEARS_EXPERIENCE,
  MODEL_FREELANCE_SERVICES
} from '@/app/_lib/constants';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shadcn-view-table';

// Sample data generators
function getRandomElement<T>(array: readonly T[]): T {
  if (array.length === 0) {
    throw new Error('Cannot get random element from empty array');
  }
  return array[Math.floor(Math.random() * array.length)]!;
}

function getRandomElements<T>(array: readonly T[], min = 1, max = 3): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Seed data
async function seedUsers(count = 10) {
  const users: Partial<IUser>[] = [];
  
  // Always create an admin user
  users.push({
    userId: 'ADMIN001',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    lastLoginAt: new Date()
  });

  // Create random users
  for (let i = 0; i < count - 1; i++) {
    users.push({
      userId: `USER${String(i + 1).padStart(3, '0')}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: getRandomElement(USER_ROLES),
      status: getRandomElement(USER_STATUSES),
      lastLoginAt: Math.random() > 0.3 ? getRandomDate(new Date(2023, 0, 1), new Date()) : null
    });
  }

  return await User.create(users);
}

async function seedClients(count = 10) {
  const clients: Partial<IClient>[] = [];
  for (let i = 0; i < count; i++) {
    clients.push({
      name: `Client ${i + 1}`,
      email: `client${i + 1}@example.com`,
      organization_type: getRandomElement(ORGANIZATION_TYPES),
      company_name: `Company ${i + 1}`,
      industry: getRandomElements(INDUSTRIES, 1, 2),
      team: `Team ${i + 1}`,
      location: getRandomElement(['Singapore', 'Indonesia', 'Malaysia', 'Thailand', 'Vietnam']),
      projects: []
    });
  }
  return await Client.create(clients);
}

async function seedFreelancers(count = 20) {
  const freelancers: Partial<IFreelancer>[] = [];
  for (let i = 0; i < count; i++) {
    const freelancer: Partial<IFreelancer> = {
      name: `Freelancer ${i + 1}`,
      linkedin: Math.random() > 0.3 ? `https://linkedin.com/in/freelancer-${i + 1}` : undefined,
      profile: {
        location: getRandomElement(['Singapore', 'Indonesia', 'Malaysia', 'Thailand', 'Vietnam']),
        about_me: `Experienced professional with ${i + 1} years of experience.`,
        languages: getRandomElements(['English', 'Mandarin', 'Malay', 'Thai', 'Vietnamese']),
        education: [{
          degree: getRandomElement(MODEL_DEGREE_TYPES),
          field: getRandomElement(['Business', 'Engineering', 'Science', 'Arts']),
          year: String(2010 + Math.floor(Math.random() * 13))
        }]
      },
      experience: {
        roles: [{
          title: getRandomElement(['Senior Consultant', 'Project Manager', 'Research Lead', 'Analyst']),
          organization: `Previous Company ${i + 1}`,
          current: true
        }],
        organizations: [`Previous Company ${i + 1}`]
      },
      freelance_services: getRandomElements(MODEL_FREELANCE_SERVICES, 1, 3),
      industry_experience: getRandomElements(INDUSTRIES, 1, 3).map(industry => ({
        industry,
        years_experience: getRandomElement(MODEL_YEARS_EXPERIENCE),
        note: Math.random() > 0.5 ? `Specialized in ${industry}` : undefined
      })),
      availability: Math.random() > 0.3,
      rating: Math.random() > 0.2 ? Math.floor(Math.random() * 2) + 3 + Math.random() : undefined,
      audit: {
        updated_on: new Date(),
        updated_by: 'System'
      }
    };

    if (Math.random() > 0.3) {
      freelancer.ravenry_relationship = {
        worked_with_us: Math.random() > 0.5,
        feedback: getRandomElement(MODEL_FEEDBACK_STATUS),
        source: getRandomElement(MODEL_RELATIONSHIP_SOURCES)
      };
    }

    freelancers.push(freelancer);
  }
  return await Freelancer.create(freelancers);
}

async function seedStaff(count = 10) {
  const staff: Partial<IStaff>[] = [];
  
  // Always create an admin staff
  staff.push({
    name: 'Admin Staff',
    email: 'admin@example.com',
    role: 'Admin',
    is_active: true,
    projects: []
  });

  // Create random staff
  for (let i = 0; i < count - 1; i++) {
    staff.push({
      name: `Staff ${i + 1}`,
      email: `staff${i + 1}@example.com`,
      role: getRandomElement(['Account Manager', 'Project Coordinator', 'Admin'] as const),
      is_active: Math.random() > 0.2,
      projects: []
    });
  }

  return await Staff.create(staff);
}

async function seedProjects(
  clients: Document<unknown, {}, IClient>[],
  freelancers: Document<unknown, {}, IFreelancer>[],
  staff: Document<unknown, {}, IStaff>[],
  count = 30
) {
  const projects: Partial<IProject>[] = [];
  const startDate = new Date(2023, 0, 1);
  const endDate = new Date(2024, 11, 31);

  // Filter staff to get only Account Managers
  const accountManagers = staff.filter(s => (s.toObject() as IStaff).role === 'Account Manager');
  if (accountManagers.length === 0) {
    throw new Error('No account managers found in staff');
  }

  for (let i = 0; i < count; i++) {
    const client = getRandomElement(clients);
    const kick_off_date = getRandomDate(startDate, endDate);
    const deadline = new Date(kick_off_date.getTime() + Math.random() * 90 * 24 * 60 * 60 * 1000);
    
    // Select random freelancers for project managers
    const projectManagers = getRandomElements(freelancers, 1, 2);
    
    // Select random account manager from staff
    const accountManager = getRandomElement(accountManagers);
    
    // Create team members by role
    const teamMembers = TEAM_ROLES.map(role => ({
      role,
      freelancers: getRandomElements(freelancers, 1, 3).map(f => f._id as Types.ObjectId)
    }));
    
    const project: Partial<IProject> = {
      name: `Project ${i + 1}`,
      client_id: client._id as Types.ObjectId,
      project_value: {
        amount: Math.floor(Math.random() * 100000) + 10000,
        currency: Math.random() > 0.5 ? 'USD' : 'SGD'
      },
      service_type: getRandomElement(SERVICE_TYPE),
      note: `Project ${i + 1} description`,
      status: getRandomElement(PROJECT_STATUSES),
      timeline: {
        kick_off_date,
        deadline,
        completed_on: Math.random() > 0.7 ? getRandomDate(kick_off_date, deadline) : undefined,
        latest_update: new Date()
      },
      team: {
        project_managers: projectManagers.map(pm => pm._id as Types.ObjectId),
        account_manager: accountManager._id as Types.ObjectId,
        members: teamMembers
      },
      brief: {
        objectives: getRandomElements(RESEARCH_OBJECTIVES, 1, 3),
        objective_notes: `Objectives for Project ${i + 1}`,
        topic: `Research Topic ${i + 1}`,
        services: getRandomElements(RESEARCH_SERVICES, 1, 3) as ResearchService[],
        regions: getRandomElements(['Singapore', 'Indonesia', 'Malaysia', 'Thailand', 'Vietnam'], 1, 3),
        expected_output: getRandomElement(OUTPUT_TYPES),
        business_type: Math.random() > 0.5 ? 'B2B' : 'B2C',
        industries: getRandomElements(INDUSTRIES, 1, 3)
      },
      financial: {
        cost_of_sales: Math.floor(Math.random() * 50000),
        budget: Math.floor(Math.random() * 100000) + 50000
      }
    };

    if (Math.random() > 0.5) {
      project.files = {
        final_proposal: `https://example.com/files/proposal_${i + 1}.pdf`,
        final_report: `https://example.com/files/report_${i + 1}.pdf`,
        relevant_folder: `https://example.com/folders/${i + 1}`,
        budgeting_sheet: `https://example.com/files/budget_${i + 1}.xlsx`
      };
    }

    projects.push(project);
  }

  const createdProjects = await Project.create(projects);

  // Update client projects
  for (const project of createdProjects) {
    await Client.findByIdAndUpdate(
      project.client_id,
      { $push: { projects: project._id } }
    );
  }

  return createdProjects;
}

async function main() {
  try {
    await connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Client.deleteMany({}),
      Project.deleteMany({}),
      Freelancer.deleteMany({}),
      Staff.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Seed data
    const users = await seedUsers();
    console.log('Seeded users');

    const clients = await seedClients();
    console.log('Seeded clients');

    const freelancers = await seedFreelancers();
    console.log('Seeded freelancers');

    const staff = await seedStaff();
    console.log('Seeded staff');

    const projects = await seedProjects(clients, freelancers, staff);
    console.log('Seeded projects');

    // Update staff projects
    const allStaff = await Staff.find();
    for (const member of allStaff) {
      const randomProjects = getRandomElements(projects, 1, 5);
      member.projects = randomProjects.map(p => p._id) as Types.ObjectId[];
      await member.save();
    }
    console.log('Updated staff projects');

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run seeder
main(); 