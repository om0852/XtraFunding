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
  equityOffered?: number;
  fundingType: 'Equity' | 'Debt';
  interestRate?: number;
  repaymentMonths?: number;
  fundingModel: 'XFund' | 'XRaise';
  status: 'Draft' | 'Active' | 'Funded' | 'Closed';
  disbursed: boolean;
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
    equityOffered: { type: Number },
    fundingType: { 
      type: String, 
      enum: ['Equity', 'Debt'], 
      required: true,
      default: 'Equity'
    },
    interestRate: { type: Number },
    repaymentMonths: { type: Number },
    fundingModel: { 
      type: String, 
      enum: ['XFund', 'XRaise'], 
      required: true,
      default: 'XFund'
    },
    status: { 
      type: String, 
      enum: ['Draft', 'Active', 'Funded', 'Closed'], 
      default: 'Draft' 
    },
    disbursed: { type: Boolean, default: false },
    endDate: { type: Date, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

const Campaign: Model<ICampaign> = mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);

export default Campaign;
