import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    normalizedUrl: { type: String },
    riskScore: { type: Number, required: true },
    riskLevel: { type: String, required: true },
    flags: { type: [String], default: [] },
    riskBreakdown: { type: Array, default: [] },
    details: { type: Object, default: {} },
    jobId: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    apiKey: { type: mongoose.Schema.Types.ObjectId, ref: 'ApiKey' }
  },
  { timestamps: true }
);

scanSchema.index({ createdAt: -1 });
scanSchema.index({ owner: 1, createdAt: -1 });

export const Scan = mongoose.model('Scan', scanSchema);
