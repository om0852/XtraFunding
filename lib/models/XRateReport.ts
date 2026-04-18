import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IXRateReport extends Document {
  startupName: string;
  industry: string;
  description: string;
  overallScore: number;
  riskScore: number;
  growthScore: number;
  teamScore: number;
  marketScore: number;
  executiveSummary: string;
  riskFactors: string[];
  growthIndicators: string[];
  investmentRecommendations: string;
  campaignId?: string;
  verifiedDocuments: string[];
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const XRateReportSchema: Schema = new Schema(
  {
    startupName: { type: String, required: true },
    industry: { type: String, required: true },
    description: { type: String, required: true },
    overallScore: { type: Number, required: true, min: 0, max: 100 },
    riskScore: { type: Number, required: true, min: 0, max: 100 },
    growthScore: { type: Number, required: true, min: 0, max: 100 },
    teamScore: { type: Number, required: true, min: 0, max: 100 },
    marketScore: { type: Number, required: true, min: 0, max: 100 },
    executiveSummary: { type: String, required: true },
    riskFactors: [{ type: String }],
    growthIndicators: [{ type: String }],
    investmentRecommendations: { type: String, required: true },
    campaignId: { type: String },
    verifiedDocuments: [{ type: String }],
  },
  { timestamps: true }
);

if (mongoose.models.XRateReport) {
  delete (mongoose as any).models.XRateReport;
}
const XRateReport: Model<IXRateReport> = mongoose.model<IXRateReport>('XRateReport', XRateReportSchema);

export default XRateReport;
