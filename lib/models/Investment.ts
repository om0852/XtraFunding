import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvestment extends Document {
  investorId: mongoose.Types.ObjectId;
  campaignId: mongoose.Types.ObjectId;
  amount: number;
  equityPercentage?: number;
  status: 'Pending' | 'Completed' | 'Failed' | 'Escrow';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  blockchainTxHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvestmentSchema: Schema = new Schema(
  {
    investorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    amount: { type: Number, required: true },
    equityPercentage: { type: Number },
    status: { 
      type: String, 
      enum: ['Pending', 'Completed', 'Failed', 'Escrow'], 
      default: 'Pending' 
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    blockchainTxHash: { type: String },
  },
  { timestamps: true }
);

const Investment: Model<IInvestment> = mongoose.models.Investment || mongoose.model<IInvestment>('Investment', InvestmentSchema);

export default Investment;
