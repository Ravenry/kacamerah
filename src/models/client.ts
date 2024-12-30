import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';

export const ORGANIZATION_TYPES = [
  'Corporation',
  'SMEs',
  'Government',
  'NGO',
  'Startup',
  'Individual'
] as const;

export type OrganizationType = typeof ORGANIZATION_TYPES[number];

export interface IClient {
  name: string;
  email: string;
  organization_type: OrganizationType;
  company_name?: string;
  industry: string[];
  team?: string;
  location: string;
  projects: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IClientDocument extends IClient, Document {}

const clientSchema = new mongoose.Schema<IClientDocument>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    validate: {
      validator: function(v: string) {
        return v.length >= 2;
      },
      message: 'Name must be at least 2 characters long'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  organization_type: {
    type: String,
    required: [true, 'Organization type is required'],
    enum: {
      values: ORGANIZATION_TYPES,
      message: 'Invalid organization type'
    }
  },
  company_name: {
    type: String,
    trim: true
  },
  industry: [{
    type: String,
    trim: true
  }],
  team: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
clientSchema.index({ name: 1 });
clientSchema.index({ organization_type: 1 });
clientSchema.index({ industry: 1 });
clientSchema.index({ location: 1 });

export const Client: Model<IClientDocument> = mongoose.models.Client || mongoose.model<IClientDocument>('Client', clientSchema); 