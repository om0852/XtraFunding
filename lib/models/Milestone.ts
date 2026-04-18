import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMilestone extends Document {
  campaignId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  targetDate: Date;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Completed';
  fundsToRelease: number;
  proofOfWork?: string; // S3/IPFS links
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema: Schema = new Schema(
  {
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetDate: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['Pending', 'Under Review', 'Approved', 'Completed'], 
      default: 'Pending' 
    },
    fundsToRelease: { type: Number, required: true },
    proofOfWork: { type: String },
  },
  { timestamps: true }
);

const Milestone: Model<IMilestone> = mongoose.models.Milestone || mongoose.model<IMilestone>('Milestone', MilestoneSchema);

export default Milestone;
