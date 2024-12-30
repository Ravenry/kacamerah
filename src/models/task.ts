import { Document, Model, model, models, Schema } from 'mongoose';

export interface ITask {
  taskId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId: string;
  assignedTo?: string;
  dueDate: Date;
  estimatedHours: number;
  actualHours?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskDocument extends ITask, Document {}

const taskSchema = new Schema<ITaskDocument>({
  taskId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  priority: { type: String, required: true },
  projectId: { type: String, required: true },
  assignedTo: { type: String },
  dueDate: { type: Date, required: true },
  estimatedHours: { type: Number, required: true },
  actualHours: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create indexes
taskSchema.index({ title: 1 });
taskSchema.index({ projectId: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ dueDate: -1 });
taskSchema.index({ createdAt: -1 });

// Update the updatedAt timestamp before saving
taskSchema.pre('save', function(next) {
  const doc = this as ITaskDocument;
  doc.updatedAt = new Date();
  next();
});

export const Task: Model<ITaskDocument> = models.Task || model<ITaskDocument>('Task', taskSchema); 