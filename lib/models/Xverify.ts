import mongoose, { Schema, Document } from 'mongoose';

export interface IXverify extends Document {
  aadharUrl: string;
  panUrl: string;
  companyLicenseUrl: string;
  userId?: mongoose.Types.ObjectId; // Optional relation to User depending on auth
  status: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const XverifySchema: Schema = new Schema(
  {
    aadharUrl: {
      type: String,
      required: true,
    },
    panUrl: {
      type: String,
      required: true,
    },
    companyLicenseUrl: {
      type: String,
      required: true,
    },
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

// Prevent mongoose from compiling the model multiple times in dev mode
const Xverify = mongoose.models.Xverify || mongoose.model<IXverify>('Xverify', XverifySchema);

export default Xverify;
