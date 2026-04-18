import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICampaign extends Document {
  founderId: mongoose.Types.ObjectId;
  title: string;
  sector: string;
  stage: 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C';
  tagline: string;
  pitch: string;
  fundingGoal: number;
  amountRaised: number;
  minimumInvestment: number;
  equityOffered: number;
  status: 'Draft' | 'Active' | 'Funded' | 'Closed';
  endDate: Date;
  location: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema: Schema = new Schema(
  {
    founderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    sector: { type: String, required: true },
    stage: { 
      type: String, 
      enum: ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C'], 
      required: true 
    },
    tagline: { type: String, required: true },
    pitch: { type: String, required: true },
    fundingGoal: { type: Number, required: true },
    amountRaised: { type: Number, default: 0 },
    minimumInvestment: { type: Number, required: true },
    equityOffered: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['Draft', 'Active', 'Funded', 'Closed'], 
      default: 'Draft' 
    },
    endDate: { type: Date, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

const Campaign: Model<ICampaign> = mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);

export default Campaign;
