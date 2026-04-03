import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  slug: string;
  ownerId: mongoose.Types.ObjectId;
  members: Array<{
    userId: mongoose.Types.ObjectId;
    role: 'owner' | 'admin' | 'member' | 'viewer';
    joinedAt: Date;
  }>;
  subscription: {
    tier: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'trialing' | 'past_due' | 'canceled';
    currentPeriodEnd: Date;
  };
  metrics: {
    mrr: number;
    arr: number;
    activeUsers: number;
    churnRate: number;
    conversionRate: number;
    avgSessionDuration: number;
    lastUpdated: Date;
  };
  settings: {
    timezone: string;
    currency: string;
    logo?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: {
          type: String,
          enum: ['owner', 'admin', 'member', 'viewer'],
          default: 'member',
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    subscription: {
      tier: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
      status: {
        type: String,
        enum: ['active', 'trialing', 'past_due', 'canceled'],
        default: 'active',
      },
      currentPeriodEnd: { type: Date },
    },
    metrics: {
      mrr: { type: Number, default: 0 },
      arr: { type: Number, default: 0 },
      activeUsers: { type: Number, default: 0 },
      churnRate: { type: Number, default: 0 },
      conversionRate: { type: Number, default: 0 },
      avgSessionDuration: { type: Number, default: 0 },
      lastUpdated: { type: Date, default: Date.now },
    },
    settings: {
      timezone: { type: String, default: 'UTC' },
      currency: { type: String, default: 'USD' },
      logo: { type: String },
    },
  },
  { timestamps: true }
);

OrganizationSchema.index({ slug: 1 }, { unique: true });
OrganizationSchema.index({ ownerId: 1 });
OrganizationSchema.index({ 'members.userId': 1 });

export const Organization: Model<IOrganization> =
  mongoose.models.Organization ||
  mongoose.model<IOrganization>('Organization', OrganizationSchema);
