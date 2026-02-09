import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    hash: { type: String, required: true },
    lastUsedAt: { type: Date },
    disabled: { type: Boolean, default: false }
  },
  { timestamps: true }
);

apiKeySchema.index({ user: 1, createdAt: -1 });
apiKeySchema.index({ hash: 1 }, { unique: true });

export const ApiKey = mongoose.model('ApiKey', apiKeySchema);
