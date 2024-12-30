import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';
import { 
  MODEL_YEARS_EXPERIENCE, 
  MODEL_FEEDBACK_STATUS, 
  MODEL_RELATIONSHIP_SOURCES,
  MODEL_FREELANCE_SERVICES,
  MODEL_DEGREE_TYPES 
} from '@/app/_lib/constants';

export interface IEducation {
  degree: typeof MODEL_DEGREE_TYPES[number];
  field: string;
  year: string;
}

export interface IRole {
  title: string;
  organization: string;
  current: boolean;
}

export interface IIndustryExperience {
  industry: string;
  years_experience: typeof MODEL_YEARS_EXPERIENCE[number];
  note?: string;
}

export interface IRavenryRelationship {
  worked_with_us: boolean;
  feedback: typeof MODEL_FEEDBACK_STATUS[number];
  source: typeof MODEL_RELATIONSHIP_SOURCES[number];
}

export interface IFreelancer {
  name: string;
  linkedin?: string;
  profile: {
    location: string;
    about_me?: string;
    languages: string[];
    education: IEducation[];
  };
  experience: {
    roles: IRole[];
    organizations: string[];
  };
  freelance_services: typeof MODEL_FREELANCE_SERVICES[number][];
  industry_experience: IIndustryExperience[];
  ravenry_relationship?: IRavenryRelationship;
  availability: boolean;
  rating?: number;
  audit: {
    updated_on: Date;
    updated_by: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IFreelancerDocument extends IFreelancer, Document {}

const freelancerSchema = new mongoose.Schema<IFreelancerDocument>({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  linkedin: {
    type: String,
    unique: true,
    sparse: true
  },
  profile: {
    location: {
      type: String,
      required: [true, 'Location is required']
    },
    about_me: String,
    languages: [String],
    education: {
      type: [{
        degree: {
          type: String,
          enum: MODEL_DEGREE_TYPES,
          required: [true, 'Degree is required']
        },
        field: {
          type: String,
          required: [true, 'Field of study is required']
        },
        year: {
          type: String,
          default: 'Unknown'
        }
      }],
      validate: [
        (arr: any[]) => arr.length >= 1,
        'At least one education entry is required'
      ]
    }
  },
  experience: {
    roles: [{
      title: {
        type: String,
        required: [true, 'Role title is required']
      },
      organization: {
        type: String,
        required: [true, 'Organization is required']
      },
      current: {
        type: Boolean,
        required: true
      }
    }],
    organizations: [String]
  },
  freelance_services: {
    type: [{
      type: String,
      enum: MODEL_FREELANCE_SERVICES
    }],
    required: [true, 'At least one freelance service is required'],
    validate: [
      (arr: string[]) => arr.length >= 1,
      'At least one freelance service is required'
    ]
  },
  industry_experience: [{
    industry: {
      type: String,
      required: [true, 'Industry is required']
    },
    years_experience: {
      type: String,
      enum: MODEL_YEARS_EXPERIENCE,
      default: 'Unknown'
    },
    note: {
      type: String,
      default: ''
    }
  }],
  ravenry_relationship: {
    worked_with_us: Boolean,
    feedback: {
      type: String,
      enum: MODEL_FEEDBACK_STATUS
    },
    source: {
      type: String,
      enum: MODEL_RELATIONSHIP_SOURCES
    }
  },
  availability: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  audit: {
    updated_on: {
      type: Date,
      default: Date.now
    },
    updated_by: String
  }
}, {
  timestamps: true
});

// Text search index
freelancerSchema.index({ 
  name: 'text',
  'profile.about_me': 'text',
  'profile.location': 'text',
  'experience.roles.title': 'text',
  'experience.roles.organization': 'text',
  'industry_experience.industry': 'text'
}, {
  weights: {
    name: 10,
    'profile.about_me': 5,
    'profile.location': 3,
    'experience.roles.title': 8,
    'experience.roles.organization': 4,
    'industry_experience.industry': 6
  },
  name: 'freelancer_text_search'
});

// Other indexes
freelancerSchema.index({ 'profile.location': 1 });
freelancerSchema.index({ 'experience.roles.title': 1 });
freelancerSchema.index({ 'experience.organizations': 1 });
freelancerSchema.index({ 'industry_experience.industry': 1 });
freelancerSchema.index({ availability: 1 });
freelancerSchema.index({ rating: 1 });

export const Freelancer: Model<IFreelancerDocument> = mongoose.models.Freelancer || mongoose.model<IFreelancerDocument>('Freelancer', freelancerSchema); 