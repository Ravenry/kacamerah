import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';

export const USER_ROLES = ['admin', 'manager', 'user'] as const;
export const USER_STATUSES = ['active', 'inactive', 'pending'] as const;

export type UserRole = typeof USER_ROLES[number];
export type UserStatus = typeof USER_STATUSES[number];

export interface IUser {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new mongoose.Schema<IUserDocument>({
  userId: { 
    type: String, 
    required: [true, 'User ID is required'], 
    unique: true,
    trim: true
  },
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
  role: { 
    type: String, 
    required: [true, 'Role is required'],
    enum: {
      values: USER_ROLES,
      message: 'Invalid role'
    }
  },
  status: { 
    type: String, 
    required: [true, 'Status is required'],
    enum: {
      values: USER_STATUSES,
      message: 'Invalid status'
    },
    default: 'active'
  },
  lastLoginAt: { type: Date, default: null },
}, {
  timestamps: true
});

// Create indexes
userSchema.index({ name: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

export const User: Model<IUserDocument> = mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema); 