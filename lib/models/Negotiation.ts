import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INegotiationOffer {
  sender: 'INVESTOR' | 'STARTUP';
  amount: number;
  equity: number;
  instrumentType: 'SAFE' | 'Equity' | 'Convertible Note';
  expiryDays: number;
  terms: string;
  timestamp: Date;
}

export interface INegotiation extends Document {
  investorId: mongoose.Types.ObjectId;
  startupId: mongoose.Types.ObjectId;
  campaignId: mongoose.Types.ObjectId;
  status: 'Negotiating' | 'Accepted' | 'Rejected' | 'Closed';
  offers: INegotiationOffer[];
  finalAgreementPdf?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NegotiationOfferSchema: Schema = new Schema({
  sender: { type: String, enum: ['INVESTOR', 'STARTUP'], required: true },
  amount: { type: Number, required: true },
  equity: { type: Number, required: true },
  instrumentType: { type: String, enum: ['SAFE', 'Equity', 'Convertible Note'], required: true },
  expiryDays: { type: Number, required: true },
  terms: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const NegotiationSchema: Schema = new Schema(
  {
    investorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startupId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    status: { 
      type: String, 
      enum: ['Negotiating', 'Accepted', 'Rejected', 'Closed'], 
      default: 'Negotiating' 
    },
    offers: [NegotiationOfferSchema],
    finalAgreementPdf: { type: String },
  },
  { timestamps: true }
);

const Negotiation: Model<INegotiation> = mongoose.models.Negotiation || mongoose.model<INegotiation>('Negotiation', NegotiationSchema);

export default Negotiation;
