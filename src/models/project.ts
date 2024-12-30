import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';
import {
  PROJECT_STATUSES,
  SERVICE_TYPE,
  RESEARCH_OBJECTIVES,
  RESEARCH_SERVICES,
  OUTPUT_TYPES,
  INDUSTRIES,
  TEAM_ROLES,
  type ProjectStatus,
  type ServiceType,
  type ResearchObjective,
  type ResearchService,
  type OutputType,
  type Industry,
  type TeamRole
} from '@/app/_lib/project-constants';

// Counter Interface
interface ICounter {
  seq: number;
}

interface ICounterDocument extends ICounter, Document {
  _id: string;
}

// Counter Schema for auto-incrementing project IDs
const CounterSchema = new mongoose.Schema<ICounterDocument>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter: Model<ICounterDocument> = mongoose.models.Counter || mongoose.model<ICounterDocument>('Counter', CounterSchema);

// Project Interfaces
interface IProjectValue {
  amount: number;
  currency: 'USD' | 'SGD';
}

interface ITimeline {
  kick_off_date: Date;
  deadline: Date;
  completed_on?: Date;
  latest_update?: Date;
}

interface ITeamMember {
  role: TeamRole;
  freelancers: mongoose.Types.ObjectId[];
}

interface ITeam {
  project_managers: mongoose.Types.ObjectId[];
  account_manager: mongoose.Types.ObjectId;
  members: ITeamMember[];
}

interface IBrief {
  objectives: ResearchObjective[];
  objective_notes?: string;
  topic: string;
  services: ResearchService[];
  regions: string[];
  expected_output: OutputType;
  business_type: 'B2B' | 'B2C';
  industries: Industry[];
}

interface IFinancial {
  cost_of_sales: number;
  budget: number;
}

interface IFiles {
  final_proposal?: string;
  final_report?: string;
  relevant_folder?: string;
  budgeting_sheet?: string;
}

export interface IProject {
  project_id?: string;
  name: string;
  organization_id?: mongoose.Types.ObjectId;
  client_id: mongoose.Types.ObjectId;
  project_value: IProjectValue;
  service_type: ServiceType;
  note?: string;
  status: ProjectStatus;
  timeline: ITimeline;
  team: ITeam;
  brief: IBrief;
  financial: IFinancial;
  files?: IFiles;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectDocument extends IProject, Document {}

const projectSchema = new mongoose.Schema<IProjectDocument>({
  project_id: {
    type: String,
    unique: true,
    sparse: true
  },
  name: {
    type: String,
    required: [true, 'Project name is required']
  },
  organization_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  project_value: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      enum: ['USD', 'SGD'],
      default: 'USD'
    }
  },
  service_type: {
    type: String,
    enum: SERVICE_TYPE,
    required: [true, 'Service type is required']
  },
  note: String,
  status: {
    type: String,
    enum: PROJECT_STATUSES,
    default: 'Active'
  },
  timeline: {
    kick_off_date: {
      type: Date,
      required: [true, 'Kick-off date is required']
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required']
    },
    completed_on: Date,
    latest_update: Date
  },
  team: {
    project_managers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Freelancer'
    }],
    account_manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: true
    },
    members: [{
      role: {
        type: String,
        enum: TEAM_ROLES
      },
      freelancers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Freelancer'
      }]
    }]
  },
  brief: {
    objectives: [{
      type: String,
      enum: RESEARCH_OBJECTIVES,
      required: true
    }],
    objective_notes: String,
    topic: {
      type: String,
      required: true
    },
    services: [{
      type: String,
      enum: RESEARCH_SERVICES,
      required: true
    }],
    regions: [{
      type: String,
      required: true
    }],
    expected_output: {
      type: String,
      enum: OUTPUT_TYPES,
      required: true
    },
    business_type: {
      type: String,
      enum: ['B2B', 'B2C'],
      required: true
    },
    industries: [{
      type: String,
      enum: INDUSTRIES,
      required: true
    }]
  },
  financial: {
    cost_of_sales: {
      type: Number,
      default: 0
    },
    budget: {
      type: Number,
      required: true
    }
  },
  files: {
    final_proposal: String,
    final_report: String,
    relevant_folder: String,
    budgeting_sheet: String
  }
}, {
  timestamps: true
});

// Auto-increment project_id
projectSchema.pre('save', async function(this: IProjectDocument, next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate<ICounterDocument>(
        'project_id',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      ).exec();
      
      if (counter) {
        this.project_id = `PROJ-${counter.seq.toString().padStart(3, '0')}`;
      }
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

// Indexes
projectSchema.index({ name: 'text' });
projectSchema.index({ client_id: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ 'timeline.kick_off_date': 1 });
projectSchema.index({ 'timeline.deadline': 1 });
projectSchema.index({ 'timeline.completed_on': 1 });
projectSchema.index({ 'brief.industries': 1 });
projectSchema.index({ 'brief.regions': 1 });

export const Project: Model<IProjectDocument> = mongoose.models.Project || mongoose.model<IProjectDocument>('Project', projectSchema);

export async function getNextProjectId(): Promise<string> {
  const counter = await Counter.findById<ICounterDocument>('project_id').exec();
  if (!counter) {
    return 'PROJ-001';
  }
  const nextSeq = counter.seq + 1;
  return `PROJ-${nextSeq.toString().padStart(3, '0')}`;
} 