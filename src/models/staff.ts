import mongoose, { type Document } from 'mongoose'
import { type Staff as IStaff } from '@/app/(entities)/staff/components/staff-table-columns'

type StaffDocument = Document & Omit<IStaff, '_id'>

const staffSchema = new mongoose.Schema<StaffDocument>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        role: { type: String, required: true },
        is_active: { type: Boolean, default: true },
        projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    },
    {
        timestamps: true,
    }
)

staffSchema.index({ email: 1 }, { unique: true })
staffSchema.index({ name: 'text' })

const Staff = (mongoose.models.Staff as mongoose.Model<StaffDocument>) || mongoose.model<StaffDocument>('Staff', staffSchema)

export { Staff } 