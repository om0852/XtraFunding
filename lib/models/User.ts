import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  password: string;
  role: 'INVESTOR' | 'STARTUP';
  name: string;
  email: string;
  phone?: string;
  profileMetadata?: {
    avatar?: string;
    kycStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
    walletAddress?: string;
  };
  startupDetails?: {
    companyName?: string;
    registrationType?: string;
    sector?: string;
    location?: string;
  };
  investorDetails?: {
    expertise?: string;
    network?: string;
    personality?: string;
    investmentFocus?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    password: { type: String, required: true },
    role: { type: String, enum: ['INVESTOR', 'STARTUP'], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    profileMetadata: {
      avatar: { type: String },
      kycStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
      walletAddress: { type: String },
    },
    startupDetails: {
      companyName: { type: String },
      registrationType: { type: String },
      sector: { type: String },
      location: { type: String },
    },
    investorDetails: {
      expertise: { type: String },
      network: { type: String },
      personality: { type: String },
      investmentFocus: { type: String },
    },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
