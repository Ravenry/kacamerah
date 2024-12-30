import { Types } from 'mongoose';

export interface IStaff {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: 'Account Manager' | 'Project Coordinator' | 'Admin';
  is_active: boolean;
  projects: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
} 