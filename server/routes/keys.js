import express from 'express';
import crypto from 'crypto';
import { ApiKey } from '../models/ApiKey.js';
import { requireAuth } from '../middleware/auth.js';

export const keyRouter = express.Router();

keyRouter.use(requireAuth);

keyRouter.get('/', async (req, res) => {
  const keys = await ApiKey.find({ user: req.user.id, disabled: false })
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    keys: keys.map((key) => ({
      id: key._id,
      name: key.name,
      createdAt: key.createdAt,
      lastUsedAt: key.lastUsedAt
    }))
  });
});

keyRouter.post('/', async (req, res) => {
  const name = req.body?.name || 'Default';
  const rawKey = `pk_${crypto.randomBytes(24).toString('hex')}`;
  const hash = crypto.createHash('sha256').update(rawKey).digest('hex');

  const keyDoc = await ApiKey.create({
    user: req.user.id,
    name,
    hash
  });

  res.json({
    key: rawKey,
    keyId: keyDoc._id
  });
});
