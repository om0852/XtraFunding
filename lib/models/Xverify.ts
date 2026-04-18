import mongoose, { Schema, Document } from 'mongoose';

export interface IXverify extends Document {
  fullName: string;
  phone: string;
  companyName: string;
  registrationNumber: string;
  walletAddress: string;
  aadharUrl: string;
  panUrl: string;
  companyLicenseUrl: string;
  userId?: mongoose.Types.ObjectId;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const XverifySchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    companyName: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    walletAddress: { type: String, required: true },
    aadharUrl: { type: String, required: true },
    panUrl: { type: String, required: true },
    companyLicenseUrl: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Xverify = mongoose.models.Xverify || mongoose.model<IXverify>('Xverify', XverifySchema);
export default Xverify;
